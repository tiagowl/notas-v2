# Diagramas de Arquitetura — Notas v2

**Versão:** 1.0  
**Data:** 2026-05-20  
**Referências:** `outputs/product-owner/requirements.md`, `outputs/ux/wireframes/01-information-architecture.md`

---

## 1. Visão geral (C4 — Contexto)

Sistema web pessoal de notas. Um único usuário interage via browser; não há integrações externas obrigatórias no MVP.

```mermaid
C4Context
    title Contexto — Notas v2
    Person(user, "Usuário", "Desenvolvedor / uso pessoal")
    System(notas, "Notas v2", "Web app Next.js")
    System_Ext(chatgpt, "ChatGPT", "Fonte de conteúdo via clipboard")
    System_Ext(neon, "Neon PostgreSQL", "Persistência")
    Rel(user, notas, "Usa", "HTTPS")
    Rel(user, chatgpt, "Copia respostas")
    Rel(notas, neon, "SQL via Prisma", "TLS")
```

---

## 2. Visão de containers (C4 — Nível 2)

Arquitetura **monolito modular** em um único deploy Next.js (sem microserviços no MVP).

```mermaid
flowchart TB
    subgraph Client["Browser"]
        UI[React UI<br/>Chakra UI v3]
    end

    subgraph NextApp["Next.js Application"]
        Pages[App Router<br/>Server + Client Components]
        API[API Routes<br/>app/api/*]
        Lib[lib/<br/>prisma, validators, utils]
    end

    subgraph Data["Dados"]
        DB[(Neon PostgreSQL)]
    end

    UI --> Pages
    UI --> API
    Pages --> API
    API --> Lib
    Lib --> DB
```

| Container | Responsabilidade | Tecnologia |
|-----------|------------------|------------|
| **UI** | Renderização, interação, tema, Markdown client | React 19, Chakra UI v3 |
| **App Router** | Rotas, SSR/SSG seletivo, layouts | Next.js 15 App Router |
| **API Routes** | CRUD REST, validação, acesso DB | Route Handlers |
| **lib** | Prisma client, schemas Zod, helpers | TypeScript |
| **Neon** | Persistência relacional | PostgreSQL serverless |

---

## 3. Componentes internos (C4 — Nível 3)

```mermaid
flowchart LR
    subgraph Presentation["presentation/"]
        Layout[AppShell]
        NotesList[NotesListPage]
        NoteDetail[NoteDetailPage]
        NoteForm[NoteForm]
        TagsPage[TagsManagerPage]
    end

    subgraph API_Layer["app/api/"]
        NotesAPI[notes/route]
        NoteIdAPI[notes/id/route]
        TagsAPI[tags/route]
        TagIdAPI[tags/id/route]
    end

    subgraph Domain["lib/"]
        Prisma[prisma.ts]
        Validators[validators/]
        NoteService[services/noteService]
        TagService[services/tagService]
    end

    NotesList --> NotesAPI
    NoteForm --> NotesAPI
    NoteDetail --> NoteIdAPI
    TagsPage --> TagsAPI
    NotesAPI --> NoteService
    NoteIdAPI --> NoteService
    TagsAPI --> TagService
    NoteService --> Prisma
    TagService --> Prisma
```

### Responsabilidades por camada

| Camada | Faz | Não faz |
|--------|-----|---------|
| **Páginas (`app/`)** | Composição UI, fetch de dados (server ou client), estados de loading | SQL direto; regras de negócio complexas |
| **Componentes (`components/`)** | UI reutilizável, sem conhecimento de Prisma | Chamadas API acopladas (preferir props/callbacks) |
| **API Routes** | HTTP, status codes, validação entrada, orquestração | Lógica de apresentação |
| **Services (`lib/services/`)** | Regras de negócio, queries Prisma compostas | Retornar Response HTTP |
| **Prisma** | Acesso a dados, migrations | Validação de domínio rica |

---

## 4. Fluxo de dados — Criar nota

```mermaid
sequenceDiagram
    participant U as Browser
    participant P as NoteForm (Client)
    participant A as POST /api/notes
    participant S as noteService
    participant D as Prisma
    participant N as Neon

    U->>P: Preenche título, conteúdo, tags, data
    P->>P: Validação client (Zod)
    P->>A: JSON body
    A->>A: Validação server (Zod)
    A->>S: createNote(dto)
    S->>D: prisma.note.create + connect tags
    D->>N: INSERT + junction
    N-->>D: OK
    D-->>S: Note + tags
    S-->>A: entity
    A-->>P: 201 + JSON
    P-->>U: redirect /notas/[id] + Toast
```

---

## 5. Fluxo de dados — Listar com filtros

```mermaid
sequenceDiagram
    participant U as Browser
    participant L as /notas (Server Component)
    participant A as GET /api/notes?q=&tag=&sort=
    participant S as noteService
    participant D as Prisma

    U->>L: Request /notas?tag=react&q=prisma
    L->>A: fetch (server) ou client SWR
    A->>S: listNotes(filters)
    S->>D: findMany + where + orderBy + include tags
    D-->>S: notes[]
    S-->>A: notes[]
    A-->>L: 200 JSON
    L-->>U: HTML + hidratação
```

**Query params suportados (evolução):**

| Param | MVP | Fase 1+ |
|-------|-----|---------|
| `q` | título `contains` | título OR conteúdo `contains` |
| `tag` | slug ou id da tag | — |
| `sort` | `date-desc` (default) | `date-asc`, `title-asc` |
| `from`, `to` | — | filtro `publishedAt` |

---

## 6. Modelo de dados (ER)

```mermaid
erDiagram
    NOTE ||--o{ NOTE_TAG : has
    TAG ||--o{ NOTE_TAG : has

    NOTE {
        string id PK
        string title
        text content
        datetime publishedAt
        boolean pinned
        datetime createdAt
        datetime updatedAt
    }

    TAG {
        string id PK
        string name UK
        string slug UK
        string color
        datetime createdAt
    }

    NOTE_TAG {
        string noteId FK
        string tagId FK
    }
```

### Índices recomendados

| Tabela | Índice | Motivo |
|--------|--------|--------|
| `Note` | `publishedAt DESC` | Ordenação padrão |
| `Note` | GIN/trgm em `title` (Fase 1) | Busca full-text |
| `Note` | GIN/trgm em `content` (Fase 1) | Busca no corpo |
| `Tag` | `slug` unique | Filtro URL |
| `NoteTag` | `(tagId, noteId)` | Filtro por tag |

*Extensão `pg_trgm` no Neon para busca ILIKE performática em Fase 1.*

---

## 7. Mapa de rotas (App Router)

```
app/
├── layout.tsx                 # Providers: Chakra, color mode
├── page.tsx                   # redirect → /notas
├── notas/
│   ├── page.tsx               # Lista (US-002)
│   ├── nova/
│   │   └── page.tsx           # Criar (US-001)
│   └── [id]/
│       ├── page.tsx           # Visualizar (US-005)
│       └── editar/
│           └── page.tsx       # Editar (US-003)
├── tags/
│   └── page.tsx               # CRUD tags (US-007)
└── api/
    ├── notes/
    │   ├── route.ts           # GET list, POST create
    │   └── [id]/
    │       └── route.ts       # GET, PUT, DELETE
    └── tags/
        ├── route.ts           # GET list, POST create
        └── [id]/
            └── route.ts       # GET, PUT, DELETE
```

---

## 8. Mapa de API REST

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `GET` | `/api/notes` | Lista com `?q`, `?tag`, `?sort` | 200 |
| `POST` | `/api/notes` | Cria nota + tags | 201 |
| `GET` | `/api/notes/:id` | Detalhe | 200 / 404 |
| `PUT` | `/api/notes/:id` | Atualiza | 200 / 404 |
| `DELETE` | `/api/notes/:id` | Remove + desvincula tags | 204 / 404 |
| `GET` | `/api/tags` | Lista com `_count.notes` | 200 |
| `POST` | `/api/tags` | Cria tag | 201 |
| `GET` | `/api/tags/:id` | Detalhe | 200 / 404 |
| `PUT` | `/api/tags/:id` | Atualiza nome/cor | 200 / 404 |
| `DELETE` | `/api/tags/:id` | Remove; cascade junction | 204 / 404 |

---

## 9. Estratégia de renderização (Next.js)

| Rota | Estratégia | Justificativa |
|------|------------|---------------|
| `/notas` | Server Component + revalidate on demand | SEO irrelevante; dados frescos; menos JS |
| `/notas/[id]` | Server Component | Conteúdo grande; MD pode ser server-rendered |
| `/notas/nova`, `editar` | Client Component | Form interativo |
| `/tags` | Client ou Server | CRUD com modais — Client preferível |
| API | Dynamic | Sempre fresh |

**Revalidação:** `revalidatePath('/notas')` após mutations em API Routes.

---

## 10. Segurança (MVP)

```mermaid
flowchart TD
    A[Request] --> B{API Route?}
    B -->|Sim| C[Validação Zod]
    C --> D[Prisma parameterized]
    D --> E[Neon TLS]
    B -->|Página| F[Sem secrets no client]
```

| Controle | MVP | Futuro |
|----------|-----|--------|
| Autenticação | Nenhuma (uso pessoal, rede privada ou deploy protegido) | NextAuth / middleware |
| `DATABASE_URL` | Apenas server | — |
| Rate limit | Opcional Vercel | — |
| XSS Markdown | rehype-sanitize | — |
| CSRF | Same-origin fetch + cookies padrão Next | — |

---

## 11. Deploy (visão alvo)

```mermaid
flowchart LR
    Dev[Dev local] --> Vercel[Vercel / Node host]
    Vercel --> Neon[Neon PostgreSQL]
    User[Browser] --> Vercel
```

- **App:** Vercel (recomendado para Next.js) ou Docker + Node
- **DB:** Neon (branch dev/prod separados)
- **Env:** `DATABASE_URL`, `NODE_ENV` — ver `tech-stack.md`

---

## 12. Evolução arquitetural (fases)

| Fase | Mudança arquitetural |
|------|----------------------|
| 0–1 | Monolito Next + Neon |
| 1 | `pg_trgm` + busca composta |
| 2 | Campo `pinned`, índices compostos |
| 3 | PWA (service worker, manifest) — mesmo backend |
| 4 | Busca semântica: worker ou API route + embeddings store |

---

## 13. Rastreabilidade

| Requisito PO | Componente |
|--------------|--------------|
| RF-N01–04 | `noteService` + `/api/notes` |
| RF-T01–03 | `tagService` + `/api/tags` |
| RF-U01 | AppShell responsivo |
| RNF-P01–03 | Índices + Server Components + paginação futura |
| RNF-S01–02 | API-only DB access + Zod |

---

*Diagramas de arquitetura — agente Architect, Notas v2.*
