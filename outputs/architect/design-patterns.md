# Padrões de Design — Notas v2

**Versão:** 1.0  
**Data:** 2026-05-20  
**Contexto:** Monolito Next.js + Prisma + uso pessoal (1 dev)

---

## 1. Padrões arquiteturais adotados

| Padrão | Aplicação no projeto |
|--------|---------------------|
| **Monolito modular** | Um deploy; separação lógica por pastas (`app`, `lib`, `components`) |
| **Layered architecture** | Presentation → API → Service → Data Access |
| **Repository-like** | `noteService` / `tagService` encapsulam Prisma (não expor Prisma nas routes) |
| **BFF leve** | API Routes agregam e formatam JSON para o frontend |
| **Server-first** | Dados iniciais via Server Components onde possível |

---

## 2. Padrões por camada

### 2.1 API Routes — Route Handler pattern

Cada handler segue a mesma estrutura:

```typescript
// app/api/notes/route.ts
import { NextRequest, NextResponse } from "next/server"
import { listNotesQuerySchema, createNoteSchema } from "@/lib/validators/note"
import * as noteService from "@/lib/services/noteService"
import { handleApiError } from "@/lib/api/errorHandler"

export async function GET(request: NextRequest) {
  try {
    const params = listNotesQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    )
    const notes = await noteService.listNotes(params)
    return NextResponse.json(notes)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = createNoteSchema.parse(await request.json())
    const note = await noteService.createNote(body)
    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
```

**Regras:**
- Validar entrada com Zod antes de chamar service
- Nunca retornar stack trace em produção
- Status HTTP semânticos (201 create, 204 delete, 404 not found, 400 validation)

---

### 2.2 Service layer

```typescript
// lib/services/noteService.ts
import { prisma } from "@/lib/prisma"
import type { CreateNoteInput, ListNotesParams } from "@/lib/validators/note"

export async function createNote(input: CreateNoteInput) {
  const { tagIds, ...data } = input
  return prisma.note.create({
    data: {
      ...data,
      publishedAt: data.publishedAt ?? new Date(),
      tags: tagIds?.length
        ? { connect: tagIds.map((id) => ({ id })) }
        : undefined,
    },
    include: { tags: true },
  })
}

export async function listNotes(params: ListNotesParams) {
  const { q, tagId, sort } = params
  return prisma.note.findMany({
    where: {
      ...(q && {
        title: { contains: q, mode: "insensitive" },
      }),
      ...(tagId && {
        tags: { some: { id: tagId } },
      }),
    },
    orderBy: sort === "title-asc"
      ? { title: "asc" }
      : { publishedAt: sort === "date-asc" ? "asc" : "desc" },
    include: { tags: true },
    take: 100,
  })
}
```

**Regras:**
- Services são funções puras async (sem `Request`/`Response`)
- Transações Prisma (`$transaction`) para operações multi-tabela críticas
- `include`/`select` explícitos — evitar over-fetching de `content` na listagem

---

### 2.3 Prisma Client — Singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

Evita múltiplas instâncias em hot-reload do Next.js dev.

---

### 2.4 Validação — Schema compartilhado (Zod)

```typescript
// lib/validators/note.ts
import { z } from "zod"

export const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  publishedAt: z.coerce.date().optional(),
  tagIds: z.array(z.string().cuid()).optional(),
})

export const listNotesQuerySchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(), // slug ou id
  sort: z.enum(["date-desc", "date-asc", "title-asc"]).default("date-desc"),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type ListNotesParams = z.infer<typeof listNotesQuerySchema>
```

**Padrão:** `z.coerce.date()` para inputs de formulário; mensagens de erro mapeadas para 400.

---

### 2.5 Tratamento de erros centralizado

```typescript
// lib/api/errorHandler.ts
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { Prisma } from "@prisma/client"

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.flatten() },
      { status: 400 }
    )
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  console.error(error)
  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}
```

---

### 2.6 UI — Composição de componentes (Chakra)

| Padrão | Uso |
|--------|-----|
| **Container/Presentational** | Pages fetcham; `NoteCard` só recebe props |
| **Compound components** | `NoteForm` + `TagSelector` internos |
| **Controlled form** | react-hook-form + zodResolver (Fase 1+) |
| **Optimistic UI** | Opcional em delete; MVP: wait server |

**Server vs Client:**
- `"use client"` apenas em: forms, modals, theme toggle, paste modal, drawer
- Lista e detalhe: Server Component + client islands mínimos

---

### 2.7 Data fetching no frontend

| Cenário | Padrão |
|---------|--------|
| Lista inicial `/notas` | Server Component `await fetch` ou `noteService` direto no server |
| Mutações (create/update/delete) | `fetch('/api/...')` + `router.refresh()` ou `revalidatePath` |
| Busca debounced (client) | `useDebouncedValue` + fetch API |

**Evitar no MVP:** React Query — adicionar se complexidade de cache justificar.

---

## 3. Padrões de domínio

### 3.1 Tag slug

Ao criar tag, gerar `slug` a partir de `name`:

```typescript
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
```

URL: `/notas?tag=react` resolve por `slug` ou `id`.

### 3.2 Listagem sem conteúdo completo

```typescript
select: {
  id: true,
  title: true,
  publishedAt: true,
  pinned: true,
  content: true, // MVP: truncar no service para preview 150 chars
  tags: true,
}
```

Ou campo computado `preview` no service.

### 3.3 Exclusão de tag

Padrão **disconnect all, delete tag** (não deletar notas):

```typescript
await prisma.$transaction([
  prisma.noteTag.deleteMany({ where: { tagId } }),
  prisma.tag.delete({ where: { id: tagId } }),
])
```

---

## 4. Padrões de segurança

| Padrão | Implementação |
|--------|---------------|
| **Parameterized queries** | Prisma (automático) |
| **Input validation** | Zod em toda entrada API |
| **Output encoding** | react-markdown + rehype-sanitize |
| **Secrets** | Apenas server modules |
| **Fail closed** | API retorna 500 genérico; log server-side |

---

## 5. Padrões de performance

| Padrão | Quando |
|--------|--------|
| **Select mínimo** | Lista de notas |
| **Pagination cursor** | &gt; 100 notas |
| **Debounce busca** | 300ms client |
| **Dynamic import** | Editor MD pesado (se adicionado) |
| **Índice DB** | `publishedAt`, `tagId` via junction |

---

## 6. Anti-padrões (evitar)

| Anti-padrão | Por quê |
|-------------|---------|
| Prisma no Client Component | Expõe credenciais / aumenta bundle |
| Lógica de negócio na API Route inline | Duplicação, testes difíceis |
| `any` em DTOs | Perde type-safety |
| Buscar todas as notas sem `take` | Escala mal |
| Salvar HTML no DB | Usar Markdown plain text |
| Múltiplos `PrismaClient` | Connection leak em dev |

---

## 7. Schema Prisma (referência)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Note {
  id          String   @id @default(cuid())
  title       String   @db.VarChar(200)
  content     String   @db.Text
  publishedAt DateTime @default(now())
  pinned      Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tags        Tag[]

  @@index([publishedAt(sort: Desc)])
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique @db.VarChar(50)
  slug      String   @unique @db.VarChar(50)
  color     String?  @db.VarChar(7)
  createdAt DateTime @default(now())
  notes     Note[]

  @@index([slug])
}
```

*Prisma implicit N:N gera tabela `_NoteToTag`.*

---

## 8. Mapa padrão × user story

| Story | Padrões principais |
|-------|-------------------|
| US-001–004 | Service + Zod + Route Handler |
| US-006, US-009 | Query params + `findMany` where |
| US-008 | `connect` / `set` tags on create/update |
| US-011 | Client clipboard + POST mesmo schema |
| US-012 | react-markdown + rehype-sanitize |
| US-014 | Chakra color mode provider |

---

*Padrões de design — agente Architect, Notas v2.*
