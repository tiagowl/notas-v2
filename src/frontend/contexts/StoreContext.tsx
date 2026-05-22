"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, type NoteSummary, type TagWithCount } from "@/lib/api/client";
import { reorderNotesAfterPinToggle } from "@/lib/store/note-filters";
import type {
  CreateNoteInput,
  CreateTagInput,
  ListNotesFilters,
  NoteWithTags,
  Tag,
  UpdateNoteInput,
  UpdateTagInput,
} from "@/lib/types";

interface StoreContextValue {
  notes: NoteSummary[];
  tags: TagWithCount[];
  ready: boolean;
  loading: boolean;
  error: string | null;
  totalNotesCount: number;
  loadNotes: (filters?: ListNotesFilters) => Promise<void>;
  loadTags: () => Promise<void>;
  refreshAll: () => Promise<void>;
  getNote: (id: string) => Promise<NoteWithTags | undefined>;
  createNote: (input: CreateNoteInput) => Promise<NoteWithTags>;
  updateNote: (input: UpdateNoteInput) => Promise<NoteWithTags>;
  deleteNote: (id: string) => Promise<boolean>;
  togglePin: (id: string) => Promise<void>;
  listTags: () => TagWithCount[];
  getTag: (id: string) => Tag | undefined;
  createTag: (input: CreateTagInput) => Promise<Tag>;
  updateTag: (input: UpdateTagInput) => Promise<Tag>;
  deleteTag: (id: string) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalNotesCount, setTotalNotesCount] = useState(0);

  const loadTags = useCallback(async () => {
    const data = await api.tags.list();
    setTags(data);
  }, []);

  const loadNotes = useCallback(async (filters: ListNotesFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.notes.list(filters);
      setNotes(data);
      if (!filters.q && !filters.tagSlug && !filters.dateFrom) {
        setTotalNotesCount(data.length);
      } else {
        const all = await api.notes.list();
        setTotalNotesCount(all.length);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar notas");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadTags(), loadNotes()]);
  }, [loadTags, loadNotes]);

  useEffect(() => {
    (async () => {
      try {
        await refreshAll();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao conectar à API");
      } finally {
        setReady(true);
        setLoading(false);
      }
    })();
  }, [refreshAll]);

  const getNote = useCallback(async (id: string) => {
    try {
      return await api.notes.get(id);
    } catch {
      return undefined;
    }
  }, []);

  const createNote = useCallback(
    async (input: CreateNoteInput) => {
      const note = await api.notes.create(input);
      await refreshAll();
      return note;
    },
    [refreshAll]
  );

  const updateNote = useCallback(
    async (input: UpdateNoteInput) => {
      const note = await api.notes.update(input);
      await refreshAll();
      return note;
    },
    [refreshAll]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      await api.notes.delete(id);
      await refreshAll();
      return true;
    },
    [refreshAll]
  );

  const togglePin = useCallback(async (id: string) => {
    let snapshot: NoteSummary[] = [];

    setNotes((prev) => {
      snapshot = prev;
      return reorderNotesAfterPinToggle(prev, id);
    });

    try {
      const updated = await api.notes.togglePin(id);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                pinned: updated.pinned,
                updatedAt: updated.updatedAt,
              }
            : n
        )
      );
    } catch (e) {
      setNotes(snapshot);
      throw e;
    }
  }, []);

  const listTags = useCallback(() => tags, [tags]);

  const getTag = useCallback(
    (id: string) => tags.find((t) => t.id === id || t.slug === id),
    [tags]
  );

  const createTag = useCallback(
    async (input: CreateTagInput) => {
      const tag = await api.tags.create(input);
      await loadTags();
      return tag;
    },
    [loadTags]
  );

  const updateTag = useCallback(
    async (input: UpdateTagInput) => {
      const tag = await api.tags.update(input);
      await loadTags();
      return tag;
    },
    [loadTags]
  );

  const deleteTag = useCallback(
    async (id: string) => {
      await api.tags.delete(id);
      await refreshAll();
      return true;
    },
    [refreshAll]
  );

  const value = useMemo(
    () => ({
      notes,
      tags,
      ready,
      loading,
      error,
      totalNotesCount,
      loadNotes,
      loadTags,
      refreshAll,
      getNote,
      createNote,
      updateNote,
      deleteNote,
      togglePin,
      listTags,
      getTag,
      createTag,
      updateTag,
      deleteTag,
    }),
    [
      notes,
      tags,
      ready,
      loading,
      error,
      totalNotesCount,
      loadNotes,
      loadTags,
      refreshAll,
      getNote,
      createNote,
      updateNote,
      deleteNote,
      togglePin,
      listTags,
      getTag,
      createTag,
      updateTag,
      deleteTag,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
