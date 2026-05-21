import type {
  CreateNoteInput,
  CreateTagInput,
  ListNotesFilters,
  NoteWithTags,
  Tag,
  UpdateNoteInput,
  UpdateTagInput,
} from "@/lib/types";

export type TagWithCount = Tag & { noteCount: number };
export type NoteSummary = NoteWithTags & { preview?: string };

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      typeof body.error === "string" ? body.error : "Erro na requisição"
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

function buildNotesQuery(filters: ListNotesFilters = {}) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.tagSlug) params.set("tag", filters.tagSlug);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.dateFrom) params.set("from", filters.dateFrom);
  if (filters.dateTo) params.set("to", filters.dateTo);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  notes: {
    list: (filters?: ListNotesFilters) =>
      request<NoteSummary[]>(`/api/notes${buildNotesQuery(filters)}`),
    get: (id: string) => request<NoteWithTags>(`/api/notes/${id}`),
    create: (input: CreateNoteInput) =>
      request<NoteWithTags>("/api/notes", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    update: (input: UpdateNoteInput) => {
      const { id, ...body } = input;
      return request<NoteWithTags>(`/api/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },
    delete: (id: string) =>
      request<void>(`/api/notes/${id}`, { method: "DELETE" }),
    togglePin: (id: string) =>
      request<NoteWithTags>(`/api/notes/${id}/pin`, { method: "PATCH" }),
  },
  tags: {
    list: () => request<TagWithCount[]>("/api/tags"),
    get: (id: string) => request<TagWithCount>(`/api/tags/${id}`),
    create: (input: CreateTagInput) =>
      request<Tag>("/api/tags", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    update: (input: UpdateTagInput) => {
      const { id, ...body } = input;
      return request<Tag>(`/api/tags/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },
    delete: (id: string) =>
      request<void>(`/api/tags/${id}`, { method: "DELETE" }),
  },
};
