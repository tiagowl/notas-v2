# Notas v2 — Aplicação fullstack (Next.js + Prisma + Neon)

Monolito conforme arquitetura: **UI + API Routes + Prisma** no mesmo projeto.

## Executar

```bash
cd src/frontend
cp .env.example .env.local   # preencha DATABASE_URL, DIRECT_URL e credenciais AUTH_*
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Abra http://localhost:3000 — você será redirecionado para `/login` se a autenticação estiver configurada.

## Login

Defina no `.env.local`:

- `AUTH_USERNAME` — usuário
- `AUTH_PASSWORD` — senha
- `AUTH_SECRET` — segredo para a sessão (mín. 16 caracteres)

Rotas e API ficam protegidas por cookie de sessão (`middleware`). Use o botão de sair no header para encerrar a sessão.

## API REST

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/notes?q=&tag=&sort=&from=&to=` | Lista notas |
| POST | `/api/notes` | Cria nota |
| GET | `/api/notes/:id` | Detalhe |
| PUT | `/api/notes/:id` | Atualiza |
| DELETE | `/api/notes/:id` | Remove |
| PATCH | `/api/notes/:id/pin` | Alterna fixação |
| GET | `/api/tags` | Lista tags com contagem |
| POST | `/api/tags` | Cria tag |
| PUT | `/api/tags/:id` | Atualiza |
| DELETE | `/api/tags/:id` | Remove |

## Estrutura backend

```
prisma/schema.prisma
prisma/seed.ts
lib/prisma.ts
lib/services/noteService.ts
lib/services/tagService.ts
lib/validators/
app/api/notes/
app/api/tags/
```

## Frontend

O `StoreContext` consome `/api/*` via `lib/api/client.ts` (sem localStorage).

## Seed alternativo (SQL)

`database/seed-test-data.sql` — mesmo dados, para executar no Neon SQL Editor.
