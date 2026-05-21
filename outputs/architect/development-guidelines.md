# Guia de Desenvolvimento — Notas v2

**Versão:** 1.0  
**Data:** 2026-05-20  
**Público:** Frontend Dev, Backend Dev (fullstack 1 pessoa)  
**Referências:** `architecture-diagram.md`, `tech-stack.md`, `design-patterns.md`, `outputs/product-owner/backlog.md`

---

## 1. Estrutura de pastas do projeto

```
notas-v2/
├── app/
│   ├── layout.tsx                 # Root layout + Providers
│   ├── page.tsx                   # redirect /notas
│   ├── providers.tsx              # ChakraProvider
│   ├── notas/
│   │   ├── page.tsx
│   │   ├── nova/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── editar/page.tsx
│   ├── tags/page.tsx
│   └── api/
│       ├── notes/route.ts
│       ├── notes/[id]/route.ts
│       ├── tags/route.ts
│       └── tags/[id]/route.ts
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Header.tsx
│   │   ├── TagSidebar.tsx
│   │   └── MobileNavDrawer.tsx
│   ├── notes/
│   │   ├── NoteList.tsx
│   │   ├── NoteListItem.tsx
│   │   ├── NoteCard.tsx
│   │   ├── NoteArticle.tsx
│   │   ├── NoteForm.tsx
│   │   ├── PasteNoteModal.tsx
│   │   └── DeleteNoteDialog.tsx
│   ├── tags/
│   │   ├── TagChip.tsx
│   │   ├── TagSelector.tsx
│   │   └── TagFormModal.tsx
│   └── ui/
│       ├── SearchInput.tsx
│       ├── EmptyState.tsx
│       └── PageSkeleton.tsx
├── lib/
│   ├── prisma.ts
│   ├── api/
│   │   └── errorHandler.ts
│   ├── services/
│   │   ├── noteService.ts
│   │   └── tagService.ts
│   ├── validators/
│   │   ├── note.ts
│   │   └── tag.ts
│   └── utils/
│       ├── slug.ts
│       ├── date.ts
│       └── truncate.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── .env.example
├── .env.local                    # gitignored
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 2. Convenções de nomenclatura

| Artefato | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivos componentes | PascalCase.tsx | `NoteListItem.tsx` |
| Arquivos utils/services | camelCase.ts | `noteService.ts` |
| Rotas App Router | kebab-case pastas | `notas/nova` |
| API routes | plural nouns | `/api/notes` |
| Prisma models | PascalCase singular | `Note`, `Tag` |
| DB columns | camelCase no Prisma | `publishedAt` |
| Zod schemas | camelCase + Schema | `createNoteSchema` |
| Types | PascalCase | `CreateNoteInput` |
| Constantes | UPPER_SNAKE | `MAX_TITLE_LENGTH` |
| Hooks | use + PascalCase | `useDebouncedSearch` |

### Imports

Usar alias `@/` configurado em `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
```

```typescript
import { NoteList } from "@/components/notes/NoteList"
import { prisma } from "@/lib/prisma"
```

---

## 3. Fluxo de trabalho Git

| Branch | Uso |
|--------|-----|
| `main` | Produção estável |
| `develop` | Integração (opcional) |
| `feature/us-XXX-descricao` | Por user story |

### Commits (Conventional Commits)

```
feat(notes): add POST /api/notes
fix(tags): prevent duplicate slug on rename
docs(arch): update ADR-003
chore(prisma): migration add pinned field
```

### PR / merge (solo dev)

Mesmo com 1 pessoa: commits atômicos por story; tag `v0.1.0-mvp` ao fim Sprint 3.

---

## 4. Setup local (checklist)

```bash
# 1. Clone e instale
pnpm install

# 2. Env
cp .env.example .env.local
# Preencher DATABASE_URL e DIRECT_URL do Neon

# 3. Prisma
pnpm db:generate
pnpm db:migrate

# 4. Dev
pnpm dev
```

**Neon:** criar branch `dev` separada para desenvolvimento local.

---

## 5. Ordem de implementação (Sprints PO)

Seguir `outputs/product-owner/backlog.md`:

1. **Sprint 0:** Next + Chakra + Prisma migrate + AppShell placeholder
2. **Sprint 1:** API notes + páginas CRUD básico
3. **Sprint 2:** API tags + filtros + associação
4. **Sprint 3:** Responsivo + skeleton + empty states + toasts
5. **Sprint 4:** MD + paste + color mode + busca conteúdo

Não pular migrations nem validação Zod “para ir mais rápido”.

---

## 6. Padrões de código TypeScript

```typescript
// Preferir tipos explícitos em exports públicos
export async function getNoteById(id: string): Promise<NoteWithTags | null> { ... }

// Evitar enum TS; usar const objects ou Zod enum
export const SORT_OPTIONS = ["date-desc", "date-asc", "title-asc"] as const

// Early return
if (!note) return null

// Não usar ! non-null assertion sem guard
```

**ESLint:** habilitar `@typescript-eslint/no-unused-vars`, `no-explicit-any` warn.

---

## 7. API — contrato JSON

### Note (resposta padrão)

```json
{
  "id": "clxx...",
  "title": "Como usar Prisma",
  "content": "## Intro\n...",
  "publishedAt": "2026-05-20T10:00:00.000Z",
  "pinned": false,
  "createdAt": "2026-05-20T10:00:00.000Z",
  "updatedAt": "2026-05-20T10:00:00.000Z",
  "tags": [
    { "id": "clxy...", "name": "prisma", "slug": "prisma", "color": "#3182CE" }
  ]
}
```

### Lista (sem content completo — recomendado)

```json
{
  "id": "clxx...",
  "title": "...",
  "preview": "Primeiras 150 chars...",
  "publishedAt": "...",
  "pinned": false,
  "tags": [...]
}
```

### Erro

```json
{
  "error": "Validation failed",
  "details": { "fieldErrors": { "title": ["Required"] } }
}
```

---

## 8. Revalidação e cache (Next.js 15)

Após mutações em API Route chamadas do client:

```typescript
import { revalidatePath } from "next/cache"

// No final do POST/PUT/DELETE em route handler
revalidatePath("/notas")
revalidatePath(`/notas/${id}`)
```

No client após `fetch`:

```typescript
import { useRouter } from "next/navigation"
router.refresh()
```

---

## 9. Testes (recomendação mínima)

| Tipo | Ferramenta | Escopo MVP |
|------|------------|------------|
| Unit | Vitest | `slug.ts`, validators Zod |
| Integration | Vitest + prisma test DB | `noteService` (opcional) |
| E2E | Playwright (Fase 2) | Fluxo criar → listar → excluir |

**MVP mínimo:** testes manuais via `acceptance-criteria.md`.

---

## 10. Acessibilidade (dev checklist)

- [ ] Botões ícone com `aria-label`
- [ ] `aria-pressed` em tags de filtro
- [ ] Dialog com foco inicial e trap
- [ ] Mensagens de erro ligadas com `aria-describedby`
- [ ] Contraste validado em ambos os temas

---

## 11. Logging e debug

```typescript
// Apenas em development
if (process.env.NODE_ENV === "development") {
  console.debug("[noteService.listNotes]", params)
}

// Produção: erros em API → console.error (Vercel logs)
```

Não logar `content` completo das notas em produção (privacidade).

---

## 12. Decisões Arquiteturais (ADRs)

### ADR-001 — Monolito Next.js fullstack

| Campo | Valor |
|-------|-------|
| **Status** | Aceito |
| **Contexto** | 1 dev, CRUD simples, PO definiu Next + API Routes |
| **Decisão** | Single Next.js app com API Routes e Prisma |
| **Consequências** | (+) Deploy simples, tipos compartilhados (-) Escalar equipes exige split futuro |

---

### ADR-002 — PostgreSQL Neon + Prisma

| Campo | Valor |
|-------|-------|
| **Status** | Aceito |
| **Contexto** | PO exige Neon; relações N:N tags |
| **Decisão** | Prisma ORM sobre Neon PostgreSQL |
| **Consequências** | (+) Migrations, tipos (-) Vendor lock-in moderado ORM |

---

### ADR-003 — Sem autenticação no MVP

| Campo | Valor |
|-------|-------|
| **Status** | Aceito |
| **Contexto** | Uso pessoal único (RNF-S03) |
| **Decisão** | Não implementar auth no Sprint 0–3 |
| **Consequências** | (+) Velocidade (-) Deploy público inseguro — mitigar com Vercel password ou rede privada |

---

### ADR-004 — Markdown como texto no banco

| Campo | Valor |
|-------|-------|
| **Status** | Aceito |
| **Contexto** | Conteúdo originado ChatGPT em MD |
| **Decisão** | Armazenar `content` plain MD; render no client/server com react-markdown |
| **Consequências** | (+) Portável, diffável (-) Busca full-text requer índice texto |

---

### ADR-005 — Chakra UI v3 exclusivo

| Campo | Valor |
|-------|-------|
| **Status** | Aceito |
| **Contexto** | PO + UX design system |
| **Decisão** | Chakra v3 como única lib de componentes |
| **Consequências** | (+) Consistência UX (-) Bundle size vs HTML puro |

---

### ADR-006 — Service layer entre API e Prisma

| Campo | Valor |
|-------|-------|
| **Status** | Aceito |
| **Contexto** | Manutenibilidade RNF-M03 |
| **Decisão** | `lib/services/*` obrigatório; routes finas |
| **Consequências** | (+) Testável, DRY (-) Camada extra para CRUD trivial |

---

### ADR-007 — N:N implícito Prisma para Note-Tag

| Campo | Valor |
|-------|-------|
| **Status** | Aceito |
| **Contexto** | Múltiplas tags por nota |
| **Decisão** | Relação many-to-many implícita (`tags Tag[]` em Note) |
| **Consequências** | (+) Schema simples (-) Tabela `_NoteToTag` menos explícita |

---

## 13. Definition of Done (técnico)

- [ ] TypeScript sem erros (`pnpm build`)
- [ ] ESLint passa
- [ ] Migration Prisma aplicada se schema mudou
- [ ] API validada com Zod
- [ ] Critérios de aceitação PO atendidos
- [ ] Responsivo mobile/desktop verificado
- [ ] Sem `DATABASE_URL` em código client
- [ ] `revalidatePath` após mutações

---

## 14. Handoff para outros agentes

| Agente | Documentos |
|--------|------------|
| **Frontend Dev** | Este guia + `design-patterns.md` + `outputs/ux/design-system.md` |
| **Backend Dev** | `architecture-diagram.md` §8 API + `design-patterns.md` §2 |
| **DevOps** | `tech-stack.md` §4 env + deploy Vercel + Neon branches |
| **Tester** | `outputs/product-owner/acceptance-criteria.md` |

---

## 15. Referências rápidas

- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma Docs](https://www.prisma.io/docs)
- [Chakra UI v3](https://www.chakra-ui.com/docs)
- [Neon + Prisma](https://neon.tech/docs/guides/prisma)

---

*Guia de desenvolvimento — agente Architect, Notas v2.*
