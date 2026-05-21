-- =============================================================================
-- Notas v2 — Dados de teste (PostgreSQL / Neon)
-- Schema alinhado ao Prisma em outputs/architect/design-patterns.md
-- Relação N:N implícita → tabela "_NoteToTag" (A = Note.id, B = Tag.id)
-- =============================================================================
-- Uso: execute no Neon SQL Editor ou:
--   psql "$DATABASE_URL" -f database/seed-test-data.sql
-- =============================================================================

-- Limpar dados existentes (ordem por FK)
DELETE FROM "_NoteToTag";
DELETE FROM "Note";
DELETE FROM "Tag";

-- -----------------------------------------------------------------------------
-- Tags
-- -----------------------------------------------------------------------------
INSERT INTO "Tag" (id, name, slug, color, "createdAt") VALUES
  ('tag_react',   'React',    'react',   '#3182CE', '2026-05-01 10:00:00+00'),
  ('tag_prisma',  'Prisma',   'prisma',  '#805AD5', '2026-05-01 10:00:00+00'),
  ('tag_ia',      'IA',       'ia',      '#38A169', '2026-05-01 10:00:00+00'),
  ('tag_docker',  'Docker',   'docker',  '#DD6B20', '2026-05-02 10:00:00+00'),
  ('tag_nextjs',  'Next.js',  'nextjs',  '#1A202C', '2026-05-03 10:00:00+00');

-- -----------------------------------------------------------------------------
-- Notas
-- -----------------------------------------------------------------------------
INSERT INTO "Note" (id, title, content, "publishedAt", pinned, "createdAt", "updatedAt") VALUES
(
  'note_prisma_next',
  'Como configurar Prisma no Next.js',
  E'## Introdução\n\nO Prisma ORM integra-se ao Next.js via API Routes.\n\n### Passos\n\n1. Instalar `prisma` e `@prisma/client`\n2. Definir `schema.prisma`\n3. Rodar `npx prisma migrate dev`\n\n```typescript\nimport { PrismaClient } from "@prisma/client"\n\nconst prisma = new PrismaClient()\n\nexport async function GET() {\n  const notes = await prisma.note.findMany()\n  return Response.json(notes)\n}\n```\n\n> Dica: use connection pooler do Neon em produção.',
  '2026-05-18 14:30:00+00',
  true,
  '2026-05-18 14:30:00+00',
  '2026-05-18 14:30:00+00'
),
(
  'note_hooks',
  'Hooks useEffect — guia completo',
  E'## useEffect\n\nExecuta efeitos colaterais após render.\n\n```javascript\nuseEffect(() => {\n  console.log("mounted")\n  return () => console.log("cleanup")\n}, [])\n```\n\n| Cenário | Dependências |\n|---------|---------------|\n| Mount only | `[]` |\n| On change | `[dep]` |',
  '2026-05-15 09:00:00+00',
  false,
  '2026-05-15 09:00:00+00',
  '2026-05-15 09:00:00+00'
),
(
  'note_chatgpt_prompts',
  'Prompts eficazes para código com ChatGPT',
  E'# Prompts eficazes\n\nPeça sempre:\n\n- Contexto da stack\n- Exemplo de entrada/saída\n- Formato Markdown na resposta\n\n**Exemplo de prompt:**\n\n> Explique middleware Next.js 15 com exemplo em TypeScript',
  '2026-05-12 16:45:00+00',
  true,
  '2026-05-12 16:45:00+00',
  '2026-05-12 16:45:00+00'
),
(
  'note_docker_neon',
  'Docker Compose para desenvolvimento local',
  E'## docker-compose.yml\n\n```yaml\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      DATABASE_URL: ${DATABASE_URL}\n```\n\nÚtil antes de conectar ao Neon em produção.',
  '2026-05-08 11:20:00+00',
  false,
  '2026-05-08 11:20:00+00',
  '2026-05-08 11:20:00+00'
),
(
  'note_chakra_v3',
  'Chakra UI v3 — componentes principais',
  E'## Chakra UI v3\n\n- `ChakraProvider` com `defaultSystem`\n- Color mode via `next-themes`\n- Componentes compostos: `Dialog`, `Drawer`\n\nLista de componentes: Button, Input, Field, Badge, Card.',
  '2026-05-05 08:00:00+00',
  false,
  '2026-05-05 08:00:00+00',
  '2026-05-05 08:00:00+00'
),
(
  'note_markdown_archive',
  'Por que arquivar respostas em Markdown',
  E'## Markdown como formato de arquivo\n\n- LLMs geram MD nativamente\n- Portável e legível em qualquer editor\n- Renderização fiel com `react-markdown`\n\nLinks: [Documentação MD](https://www.markdownguide.org)',
  '2026-05-01 12:00:00+00',
  false,
  '2026-05-01 12:00:00+00',
  '2026-05-01 12:00:00+00'
);

-- -----------------------------------------------------------------------------
-- Vínculos Nota ↔ Tag (_NoteToTag)
-- -----------------------------------------------------------------------------
INSERT INTO "_NoteToTag" ("A", "B") VALUES
  ('note_prisma_next', 'tag_nextjs'),
  ('note_prisma_next', 'tag_prisma'),
  ('note_prisma_next', 'tag_react'),
  ('note_hooks', 'tag_react'),
  ('note_hooks', 'tag_ia'),
  ('note_chatgpt_prompts', 'tag_ia'),
  ('note_docker_neon', 'tag_docker'),
  ('note_docker_neon', 'tag_prisma'),
  ('note_chakra_v3', 'tag_react'),
  ('note_chakra_v3', 'tag_nextjs'),
  ('note_markdown_archive', 'tag_ia');

-- Verificação
SELECT 'Tags' AS entity, COUNT(*)::int AS total FROM "Tag"
UNION ALL
SELECT 'Notes', COUNT(*)::int FROM "Note"
UNION ALL
SELECT 'Note-Tag links', COUNT(*)::int FROM "_NoteToTag";
