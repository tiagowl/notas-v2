# Stack Tecnológica — Notas v2

**Versão:** 1.0  
**Data:** 2026-05-20  
**Decisor:** Arquiteto (baseado em diretrizes Product Owner)

---

## 1. Resumo da stack

| Camada | Tecnologia | Versão alvo |
|--------|------------|-------------|
| Runtime | Node.js | 20 LTS |
| Framework | Next.js (App Router) | 15.x |
| UI Library | React | 19.x |
| Componentes | Chakra UI | v3 |
| Linguagem | TypeScript | 5.x |
| ORM | Prisma | 6.x |
| Banco | PostgreSQL (Neon) | 16 |
| Validação | Zod | 3.x |
| Markdown | react-markdown + remark/rehype | latest |
| Syntax highlight | rehype-highlight ou shiki | Fase 1 |
| Deploy | Vercel (recomendado) | — |
| Package manager | pnpm (recomendado) ou npm | — |

---

## 2. Decisões por camada

### 2.1 Next.js (App Router)

**Escolhido:** Next.js 15 com App Router  
**Alternativas consideradas:** Vite + SPA, Remix

| Critério | Next.js | Vite SPA |
|----------|---------|----------|
| API Routes integradas | ✅ | ❌ backend separado |
| SSR/SSG para lista/detalhe | ✅ | manual |
| Convenção de rotas | ✅ alinhada UX `/notas` | configurar router |
| Deploy Vercel | ✅ nativo | possível |
| Curva 1 dev | ✅ PO já definiu | — |

**Consequência:** Monolito fullstack em um repositório; Prisma roda apenas no servidor.

---

### 2.2 PostgreSQL + Neon

**Escolhido:** Neon serverless PostgreSQL  
**Alternativas:** Supabase, SQLite local, PlanetScale

| Critério | Neon | SQLite |
|----------|------|--------|
| PO requirement | ✅ | ❌ |
| Relações N:N tags | ✅ | ✅ |
| Full-text futuro (`pg_trgm`) | ✅ | limitado |
| Serverless / scale to zero | ✅ | N/A |
| Custo uso pessoal | free tier adequado | zero |

**Connection string:**
```
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/notas?sslmode=require"
```

**Prisma:** usar `directUrl` se connection pooling (Neon pooler):
```env
DATABASE_URL="postgresql://...@pooler.neon.tech/notas?sslmode=require"
DIRECT_URL="postgresql://...@ep-xxx.neon.tech/notas?sslmode=require"
```

---

### 2.3 Prisma ORM

**Escolhido:** Prisma  
**Alternativas:** Drizzle, raw SQL

| Critério | Prisma |
|----------|--------|
| Migrations versionadas (RNF-M01) | ✅ |
| Type-safety com TypeScript | ✅ |
| Relações N:N | ✅ sintaxe simples |
| 1 desenvolvedor | produtividade |

**Schema location:** `prisma/schema.prisma`  
**Client singleton:** `lib/prisma.ts`

---

### 2.4 Chakra UI v3

**Escolhido:** Chakra UI v3 (obrigatório PO/UX)  
**Alternativas:** shadcn, MUI

- Design system UX já mapeado para tokens Chakra
- Color mode nativo (tema claro/escuro US-014)
- Componentes acessíveis (Drawer, Dialog, Toast)

**Setup:**
```tsx
// app/providers.tsx
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"

export function Providers({ children }) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}
```

---

### 2.5 Validação — Zod

**Escolhido:** Zod em API Routes (e opcionalmente forms com react-hook-form)

Schemas compartilhados em `lib/validators/`:
- `createNoteSchema`
- `updateNoteSchema`
- `createTagSchema`
- `listNotesQuerySchema`

---

### 2.6 Markdown

| Pacote | Função |
|--------|--------|
| `react-markdown` | Render MD em React |
| `remark-gfm` | Tabelas, task lists, strikethrough |
| `rehype-sanitize` | XSS prevention (RNF segurança) |
| `rehype-highlight` ou `rehype-pretty-code` | Syntax highlight Fase 1 |

**Armazenamento:** `content` como `TEXT` plain Markdown — sem conversão no DB.

---

### 2.7 Busca (evolução)

| Fase | Abordagem |
|------|-----------|
| MVP | `Prisma where: { title: { contains: q, mode: 'insensitive' } } }` |
| Fase 1 | `OR` title + content; índice `pg_trgm` via `$queryRaw` ou extensão |
| Fase 4 | Embeddings + pgvector (Neon suporta) — fora do escopo MVP |

---

## 3. Dependências npm sugeridas

### Produção

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@chakra-ui/react": "^3.0.0",
    "@emotion/react": "^11.0.0",
    "@prisma/client": "^6.0.0",
    "zod": "^3.23.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "rehype-sanitize": "^6.0.0",
    "date-fns": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "prisma": "^6.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

### Fase 1 (adicionar)

```json
{
  "rehype-highlight": "^7.0.0",
  "react-hook-form": "^7.0.0",
  "@hookform/resolvers": "^3.0.0"
}
```

---

## 4. Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | Connection string Neon (pooler) |
| `DIRECT_URL` | Recomendado | URL direta para migrations |
| `NODE_ENV` | Auto | development / production |

**`.env.example`:**
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/notas?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/notas?sslmode=require"
```

**Nunca** expor `DATABASE_URL` em Client Components ou `NEXT_PUBLIC_*`.

---

## 5. Ferramentas de desenvolvimento

| Ferramenta | Uso |
|------------|-----|
| ESLint + eslint-config-next | Lint |
| Prettier | Formatação (opcional) |
| Prisma Studio | Inspecionar dados local |
| Neon Console | Branches, backups |
| VS Code / Cursor | IDE |

### Scripts `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

---

## 6. Performance e limites

| Aspecto | Meta PO | Implementação |
|---------|---------|---------------|
| Lista 200 notas | ≤ 2s | `take` default 50 + paginação `cursor` futuro |
| Busca | ≤ 500ms | Índice + limit 20 resultados |
| Nota 50k chars | ≤ 1s render | Server Component + MD streaming opcional |
| Cold start Neon | — | Connection pooler; `prisma.$connect()` warm |

---

## 7. Custos estimados (uso pessoal)

| Serviço | Tier | Custo esperado |
|---------|------|----------------|
| Neon | Free / Launch | $0–5/mês |
| Vercel | Hobby | $0 |
| Domínio | Opcional | variável |

---

## 8. O que não usar no MVP

| Tecnologia | Motivo |
|------------|--------|
| Redis | Desnecessário para 1 usuário |
| GraphQL | REST simples suficiente |
| Microserviços | Overhead para 1 dev |
| MongoDB | Relações tags; PO definiu SQL |
| Turborepo monorepo | Projeto único |

---

## 9. Matriz requisito → tecnologia

| Requisito | Stack |
|-----------|-------|
| RF-N* CRUD notas | Next API + Prisma + Neon |
| RF-T* Tags N:N | Prisma many-to-many |
| RF-U* UI moderna | Chakra v3 |
| RF-U03 tema | Chakra color mode |
| RF-N09 Markdown | react-markdown |
| RNF-M03 estrutura | App Router conventions |

---

*Stack tecnológica — agente Architect, Notas v2.*
