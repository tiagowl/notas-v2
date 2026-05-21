import type { ListNotesFilters, Note, SortOption, Tag } from "@/lib/types";
import { isInDateRange } from "@/lib/utils/date";

function compareNotes(a: Note, b: Note, sort: SortOption): number {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
  switch (sort) {
    case "date-asc":
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    case "title-asc":
      return a.title.localeCompare(b.title, "pt-BR");
    case "date-desc":
    default:
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  }
}

export function filterAndSortNotes(
  notes: Note[],
  tags: Tag[],
  filters: ListNotesFilters
): Note[] {
  const { q, tagSlug, sort = "date-desc", dateFrom, dateTo } = filters;
  const qLower = q?.trim().toLowerCase();

  let result = notes.filter((note) => {
    if (tagSlug) {
      const tag = tags.find((t) => t.slug === tagSlug || t.id === tagSlug);
      if (!tag || !note.tagIds.includes(tag.id)) return false;
    }
    if (!isInDateRange(note.publishedAt, dateFrom, dateTo)) return false;
    if (qLower) {
      const inTitle = note.title.toLowerCase().includes(qLower);
      const inContent = note.content.toLowerCase().includes(qLower);
      if (!inTitle && !inContent) return false;
    }
    return true;
  });

  result = [...result].sort((a, b) => compareNotes(a, b, sort));
  return result;
}

export function attachTagsToNote(note: Note, tags: Tag[]) {
  return {
    ...note,
    tags: tags.filter((t) => note.tagIds.includes(t.id)),
  };
}
