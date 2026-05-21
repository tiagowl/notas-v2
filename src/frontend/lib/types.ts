export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  tagIds: string[];
}

export interface NoteWithTags extends Omit<Note, "tagIds"> {
  tags: Tag[];
}

export type SortOption = "date-desc" | "date-asc" | "title-asc";
export type ViewMode = "list" | "cards";
export type DateFilterPreset = "all" | "7d" | "30d" | "custom";

export interface ListNotesFilters {
  q?: string;
  tagSlug?: string;
  sort?: SortOption;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  publishedAt?: string;
  tagIds?: string[];
  pinned?: boolean;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {
  id: string;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}

export interface UpdateTagInput {
  id: string;
  name?: string;
  color?: string;
}
