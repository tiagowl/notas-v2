import { prisma } from "@/lib/prisma";
import { serializeTag } from "@/lib/api/serialize";
import type { CreateTagDto, UpdateTagDto } from "@/lib/validators/tag";
import { toSlug } from "@/lib/utils/slug";

export async function listTags() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { notes: true } } },
  });

  return tags.map((t) => ({
    ...serializeTag(t),
    noteCount: t._count.notes,
  }));
}

export async function getTagById(id: string) {
  const tag = await prisma.tag.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { _count: { select: { notes: true } } },
  });
  if (!tag) return null;
  return { ...serializeTag(tag), noteCount: tag._count.notes };
}

export async function createTag(input: CreateTagDto) {
  const name = input.name.trim();
  const slug = toSlug(name);
  const existing = await prisma.tag.findFirst({
    where: { OR: [{ name }, { slug }] },
  });
  if (existing) throw new Error("Tag já existe");

  const tag = await prisma.tag.create({
    data: {
      name,
      slug,
      color: input.color ?? "#3182CE",
    },
  });
  return serializeTag(tag);
}

export async function updateTag(id: string, input: UpdateTagDto) {
  const current = await prisma.tag.findUnique({ where: { id } });
  if (!current) return null;

  const name = input.name?.trim() ?? current.name;
  const slug = input.name ? toSlug(name) : current.slug;

  if (input.name) {
    const dup = await prisma.tag.findFirst({
      where: {
        OR: [{ name }, { slug }],
        NOT: { id },
      },
    });
    if (dup) throw new Error("Tag já existe");
  }

  const tag = await prisma.tag.update({
    where: { id },
    data: {
      ...(input.name && { name, slug }),
      ...(input.color !== undefined && { color: input.color }),
    },
  });
  return serializeTag(tag);
}

export async function deleteTag(id: string) {
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) return false;

  await prisma.$transaction(async (tx) => {
    await tx.note.deleteMany({
      where: { tags: { some: { id } } },
    });
    await tx.tag.delete({ where: { id } });
  });

  return true;
}
