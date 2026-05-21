import type { Note, Tag } from "@/lib/types";

/** Mesmos IDs do database/seed-test-data.sql */
export const SEED_TAGS: Tag[] = [
  { id: "tag_react", name: "React", slug: "react", color: "#3182CE", createdAt: "2026-05-01T10:00:00.000Z" },
  { id: "tag_prisma", name: "Prisma", slug: "prisma", color: "#805AD5", createdAt: "2026-05-01T10:00:00.000Z" },
  { id: "tag_ia", name: "IA", slug: "ia", color: "#38A169", createdAt: "2026-05-01T10:00:00.000Z" },
  { id: "tag_docker", name: "Docker", slug: "docker", color: "#DD6B20", createdAt: "2026-05-02T10:00:00.000Z" },
  { id: "tag_nextjs", name: "Next.js", slug: "nextjs", color: "#1A202C", createdAt: "2026-05-03T10:00:00.000Z" },
];

export const SEED_NOTES: Note[] = [
  {
    id: "note_prisma_next",
    title: "Como configurar Prisma no Next.js",
    content: `## Introdução

O Prisma ORM integra-se ao Next.js via API Routes.

### Passos

1. Instalar \`prisma\` e \`@prisma/client\`
2. Definir \`schema.prisma\`
3. Rodar \`npx prisma migrate dev\`

\`\`\`typescript
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const notes = await prisma.note.findMany()
  return Response.json(notes)
}
\`\`\`

> Dica: use connection pooler do Neon em produção.`,
    publishedAt: "2026-05-18T14:30:00.000Z",
    pinned: true,
    createdAt: "2026-05-18T14:30:00.000Z",
    updatedAt: "2026-05-18T14:30:00.000Z",
    tagIds: ["tag_nextjs", "tag_prisma", "tag_react"],
  },
  {
    id: "note_hooks",
    title: "Hooks useEffect — guia completo",
    content: `## useEffect

Executa efeitos colaterais após render.

\`\`\`javascript
useEffect(() => {
  console.log("mounted")
  return () => console.log("cleanup")
}, [])
\`\`\`

| Cenário | Dependências |
|---------|---------------|
| Mount only | \`[]\` |
| On change | \`[dep]\` |`,
    publishedAt: "2026-05-15T09:00:00.000Z",
    pinned: false,
    createdAt: "2026-05-15T09:00:00.000Z",
    updatedAt: "2026-05-15T09:00:00.000Z",
    tagIds: ["tag_react", "tag_ia"],
  },
  {
    id: "note_chatgpt_prompts",
    title: "Prompts eficazes para código com ChatGPT",
    content: `# Prompts eficazes

Peça sempre:

- Contexto da stack
- Exemplo de entrada/saída
- Formato Markdown na resposta

**Exemplo de prompt:**

> Explique middleware Next.js 15 com exemplo em TypeScript`,
    publishedAt: "2026-05-12T16:45:00.000Z",
    pinned: true,
    createdAt: "2026-05-12T16:45:00.000Z",
    updatedAt: "2026-05-12T16:45:00.000Z",
    tagIds: ["tag_ia"],
  },
  {
    id: "note_docker_neon",
    title: "Docker Compose para desenvolvimento local",
    content: `## docker-compose.yml

\`\`\`yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: \${DATABASE_URL}
\`\`\`

Útil antes de conectar ao Neon em produção.`,
    publishedAt: "2026-05-08T11:20:00.000Z",
    pinned: false,
    createdAt: "2026-05-08T11:20:00.000Z",
    updatedAt: "2026-05-08T11:20:00.000Z",
    tagIds: ["tag_docker", "tag_prisma"],
  },
  {
    id: "note_chakra_v3",
    title: "Chakra UI v3 — componentes principais",
    content: `## Chakra UI v3

- \`ChakraProvider\` com \`defaultSystem\`
- Color mode via \`next-themes\`
- Componentes compostos: Dialog, Drawer

Lista: Button, Input, Field, Badge, Card.`,
    publishedAt: "2026-05-05T08:00:00.000Z",
    pinned: false,
    createdAt: "2026-05-05T08:00:00.000Z",
    updatedAt: "2026-05-05T08:00:00.000Z",
    tagIds: ["tag_react", "tag_nextjs"],
  },
  {
    id: "note_markdown_archive",
    title: "Por que arquivar respostas em Markdown",
    content: `## Markdown como formato de arquivo

- LLMs geram MD nativamente
- Portável e legível em qualquer editor
- Renderização fiel com react-markdown

Links: [Documentação MD](https://www.markdownguide.org)`,
    publishedAt: "2026-05-01T12:00:00.000Z",
    pinned: false,
    createdAt: "2026-05-01T12:00:00.000Z",
    updatedAt: "2026-05-01T12:00:00.000Z",
    tagIds: ["tag_ia"],
  },
];

export const INITIAL_STORE = { notes: SEED_NOTES, tags: SEED_TAGS };
