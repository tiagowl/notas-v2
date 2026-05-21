import type { Note as PrismaNote, Tag as PrismaTag } from "@prisma/client";
import type { NoteWithTags, Tag } from "@/lib/types";
import { truncate } from "@/lib/utils/truncate";

export function serializeTag(tag: PrismaTag): Tag {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    color: tag.color,
    createdAt: tag.createdAt.toISOString(),
  };
}

export function serializeNote(
  note: PrismaNote & { tags: PrismaTag[] },
  options?: { includePreview?: boolean }
): NoteWithTags & { preview?: string } {
  const base: NoteWithTags = {
    id: note.id,
    title: note.title,
    content: note.content,
    publishedAt: note.publishedAt.toISOString(),
    pinned: note.pinned,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
    tags: note.tags.map(serializeTag),
  };

  if (options?.includePreview) {
    return { ...base, preview: truncate(note.content) };
  }

  return base;
}
