import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TAGS = [
  { id: "tag_react", name: "React", slug: "react", color: "#3182CE" },
  { id: "tag_prisma", name: "Prisma", slug: "prisma", color: "#805AD5" },
  { id: "tag_ia", name: "IA", slug: "ia", color: "#38A169" },
  { id: "tag_docker", name: "Docker", slug: "docker", color: "#DD6B20" },
  { id: "tag_nextjs", name: "Next.js", slug: "nextjs", color: "#1A202C" },
];

async function main() {
  console.log("Seeding database…");

  for (const tag of TAGS) {
    await prisma.tag.upsert({
      where: { id: tag.id },
      update: tag,
      create: { ...tag, createdAt: new Date("2026-05-01") },
    });
  }

  const notes = [
    {
      id: "note_prisma_next",
      title: "Como configurar Prisma no Next.js",
      content: `## Introdução\n\nO Prisma ORM integra-se ao Next.js via API Routes.\n\n\`\`\`typescript\nconst prisma = new PrismaClient()\n\`\`\``,
      publishedAt: new Date("2026-05-18T14:30:00Z"),
      pinned: true,
      tagIds: ["tag_nextjs", "tag_prisma", "tag_react"],
    },
    {
      id: "note_hooks",
      title: "Hooks useEffect — guia completo",
      content: `## useEffect\n\nExecuta efeitos colaterais após render.`,
      publishedAt: new Date("2026-05-15T09:00:00Z"),
      pinned: false,
      tagIds: ["tag_react", "tag_ia"],
    },
    {
      id: "note_chatgpt_prompts",
      title: "Prompts eficazes para código com ChatGPT",
      content: `# Prompts eficazes\n\nPeça contexto da stack e formato Markdown.`,
      publishedAt: new Date("2026-05-12T16:45:00Z"),
      pinned: true,
      tagIds: ["tag_ia"],
    },
    {
      id: "note_docker_neon",
      title: "Docker Compose para desenvolvimento local",
      content: `## docker-compose.yml\n\nÚtil antes de conectar ao Neon.`,
      publishedAt: new Date("2026-05-08T11:20:00Z"),
      pinned: false,
      tagIds: ["tag_docker", "tag_prisma"],
    },
    {
      id: "note_chakra_v3",
      title: "Chakra UI v3 — componentes principais",
      content: `## Chakra UI v3\n\nChakraProvider com defaultSystem.`,
      publishedAt: new Date("2026-05-05T08:00:00Z"),
      pinned: false,
      tagIds: ["tag_react", "tag_nextjs"],
    },
    {
      id: "note_markdown_archive",
      title: "Por que arquivar respostas em Markdown",
      content: `## Markdown\n\nLLMs geram MD nativamente.`,
      publishedAt: new Date("2026-05-01T12:00:00Z"),
      pinned: false,
      tagIds: ["tag_ia"],
    },
  ];

  for (const n of notes) {
    const { tagIds, ...data } = n;
    await prisma.note.upsert({
      where: { id: n.id },
      update: {
        ...data,
        tags: { set: tagIds.map((id) => ({ id })) },
      },
      create: {
        ...data,
        createdAt: data.publishedAt,
        updatedAt: data.publishedAt,
        tags: { connect: tagIds.map((id) => ({ id })) },
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
