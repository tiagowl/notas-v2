import { prisma } from "@/lib/prisma";
import { serializeNote } from "@/lib/api/serialize";
import type { CreateNoteDto, ListNotesQuery, UpdateNoteDto } from "@/lib/validators/note";

function buildOrderBy(sort: ListNotesQuery["sort"]) {
  if (sort === "title-asc") return [{ pinned: "desc" as const }, { title: "asc" as const }];
  if (sort === "date-asc") return [{ pinned: "desc" as const }, { publishedAt: "asc" as const }];
  return [{ pinned: "desc" as const }, { publishedAt: "desc" as const }];
}

async function resolveTagId(tagParam?: string) {
  if (!tagParam) return undefined;
  const tag = await prisma.tag.findFirst({
    where: { OR: [{ slug: tagParam }, { id: tagParam }] },
  });
  return tag?.id;
}

export async function listNotes(params: ListNotesQuery) {
  const { q, tag, sort, from, to } = params;
  const tagId = await resolveTagId(tag);

  const notes = await prisma.note.findMany({
    where: {
      ...(tagId && { tags: { some: { id: tagId } } }),
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(from || to
        ? {
            publishedAt: {
              ...(from && { gte: new Date(from) }),
              ...(to && { lte: new Date(to) }),
            },
          }
        : {}),
    },
    orderBy: buildOrderBy(sort),
    include: { tags: true },
    take: 200,
  });

  return notes.map((n) => serializeNote(n, { includePreview: true }));
}

export async function getNoteById(id: string) {
  const note = await prisma.note.findUnique({
    where: { id },
    include: { tags: true },
  });
  if (!note) return null;
  return serializeNote(note);
}

export async function createNote(input: CreateNoteDto) {
  const { tagIds, publishedAt, ...rest } = input;
  const note = await prisma.note.create({
    data: {
      ...rest,
      publishedAt: publishedAt ?? new Date(),
      tags: tagIds?.length ? { connect: tagIds.map((id) => ({ id })) } : undefined,
    },
    include: { tags: true },
  });
  return serializeNote(note);
}

export async function updateNote(id: string, input: UpdateNoteDto) {
  const { tagIds, publishedAt, ...rest } = input;

  const existing = await prisma.note.findUnique({ where: { id } });
  if (!existing) return null;

  const note = await prisma.note.update({
    where: { id },
    data: {
      ...rest,
      ...(publishedAt !== undefined && { publishedAt }),
      ...(tagIds !== undefined && {
        tags: { set: tagIds.map((tid) => ({ id: tid })) },
      }),
    },
    include: { tags: true },
  });

  return serializeNote(note);
}

export async function deleteNote(id: string) {
  try {
    await prisma.note.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function toggleNotePin(id: string) {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) return null;
  return updateNote(id, { pinned: !note.pinned });
}
