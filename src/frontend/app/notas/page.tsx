"use client";

import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  NativeSelect,
  Stack,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { LuGrid2X2, LuList } from "react-icons/lu";
import { AppShell } from "@/components/layout/AppShell";
import { PasteNoteModal } from "@/components/notes/PasteNoteModal";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteListItem } from "@/components/notes/NoteListItem";
import { NOTES_PER_PAGE, NotesPagination } from "@/components/notes/NotesPagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { toaster } from "@/components/ui/toaster";
import { useStore } from "@/contexts/StoreContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { SortOption, ViewMode } from "@/lib/types";
import { getDateRangeFromPreset } from "@/lib/utils/date";

function NotesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ready, loading, notes, loadNotes, createNote, deleteNote, togglePin } = useStore();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebouncedValue(search);
  const tagSlug = searchParams.get("tag") ?? undefined;
  const sort = (searchParams.get("sort") as SortOption) || "date-desc";
  const view = (searchParams.get("view") as ViewMode) || "list";
  const datePreset = searchParams.get("date") ?? "all";
  const skipSearchSync = useRef(true);
  const filterKeyRef = useRef("");

  const [pasteOpen, setPasteOpen] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === "" || v === "all") params.delete(k);
        else params.set(k, v);
      });
      const qs = params.toString();
      router.push(qs ? `/notas?${qs}` : "/notas");
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (skipSearchSync.current) {
      skipSearchSync.current = false;
      return;
    }
    const current = searchParams.get("q") ?? "";
    if (debouncedSearch !== current) {
      updateParams({ q: debouncedSearch || undefined });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const dateRange = (() => {
    if (datePreset === "custom") {
      return {
        from: searchParams.get("from") ?? undefined,
        to: searchParams.get("to") ?? undefined,
      };
    }
    return getDateRangeFromPreset(datePreset as "all" | "7d" | "30d" | "month");
  })();

  useEffect(() => {
    if (!ready) return;
    loadNotes({
      q: debouncedSearch || undefined,
      tagSlug,
      sort,
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
    });
  }, [ready, debouncedSearch, tagSlug, sort, dateRange.from, dateRange.to, loadNotes]);

  const filterKey = `${debouncedSearch}|${tagSlug}|${sort}|${dateRange.from ?? ""}|${dateRange.to ?? ""}`;

  useEffect(() => {
    if (filterKeyRef.current === filterKey) return;
    filterKeyRef.current = filterKey;
    if (searchParams.get("page")) {
      updateParams({ page: undefined });
    }
  }, [filterKey, searchParams, updateParams]);

  const totalPages = Math.max(1, Math.ceil(notes.length / NOTES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (!ready || loading || notes.length === 0) return;
    if (page !== currentPage) {
      updateParams({ page: currentPage === 1 ? undefined : String(currentPage) });
    }
  }, [ready, loading, notes.length, page, currentPage, updateParams]);

  const paginatedNotes = notes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE
  );

  const setPage = (next: number) => {
    updateParams({ page: next <= 1 ? undefined : String(next) });
  };

  const handlePasteSave = async (data: {
    title: string;
    content: string;
    publishedAt: string;
    tagIds: string[];
  }) => {
    try {
      const note = await createNote(data);
      toaster.create({ title: "Nota salva", type: "success" });
      router.push(`/notas/${note.id}`);
    } catch (e) {
      toaster.create({
        title: e instanceof Error ? e.message : "Erro ao salvar",
        type: "error",
      });
    }
  };

  const showLoading = !ready || loading;
  const noteToDelete = deleteNoteId ? notes.find((n) => n.id === deleteNoteId) : undefined;

  const handleDeleteNote = async () => {
    if (!deleteNoteId) return;
    try {
      await deleteNote(deleteNoteId);
      toaster.create({ title: "Nota excluída", type: "info" });
      const remaining = notes.length - 1;
      const newTotalPages = Math.max(1, Math.ceil(remaining / NOTES_PER_PAGE));
      if (currentPage > newTotalPages) {
        setPage(newTotalPages);
      }
      setDeleteNoteId(null);
    } catch (e) {
      toaster.create({
        title: e instanceof Error ? e.message : "Erro ao excluir",
        type: "error",
      });
    }
  };

  return (
    <>
      <AppShell
        search={search}
        onSearchChange={setSearch}
        activeTagSlug={tagSlug}
        onTagFilter={(slug) => updateParams({ tag: slug })}
        onPaste={() => setPasteOpen(true)}
      >
        <Stack gap={4}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
            <Heading size="lg">Notas</Heading>
            <HStack gap={2} flexWrap="wrap">
              <NativeSelect.Root size="sm" w="auto">
                <NativeSelect.Field
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  aria-label="Ordenar"
                >
                  <option value="date-desc">Mais recentes</option>
                  <option value="date-asc">Mais antigas</option>
                  <option value="title-asc">Título A–Z</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
              <NativeSelect.Root size="sm" w="auto">
                <NativeSelect.Field
                  value={datePreset}
                  onChange={(e) =>
                    updateParams({ date: e.target.value, from: undefined, to: undefined })
                  }
                  aria-label="Período"
                >
                  <option value="all">Todas as datas</option>
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="month">Este mês</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
              <HStack gap={0} borderWidth="1px" borderRadius="md">
                <Button
                  size="sm"
                  variant={view === "list" ? "solid" : "ghost"}
                  onClick={() => updateParams({ view: "list" })}
                  aria-label="Lista"
                >
                  <LuList />
                </Button>
                <Button
                  size="sm"
                  variant={view === "cards" ? "solid" : "ghost"}
                  onClick={() => updateParams({ view: "cards" })}
                  aria-label="Cards"
                >
                  <LuGrid2X2 />
                </Button>
              </HStack>
            </HStack>
          </Flex>

          {tagSlug && (
            <HStack>
              <Badge colorPalette="blue" size="lg">
                Filtrando por: {tagSlug}
              </Badge>
              <Button size="xs" variant="ghost" onClick={() => updateParams({ tag: undefined })}>
                Limpar filtros
              </Button>
            </HStack>
          )}

          {showLoading ? (
            <PageSkeleton />
          ) : notes.length === 0 ? (
            <EmptyState
              title={
                debouncedSearch || tagSlug ? "Nenhuma nota encontrada" : "Nenhuma nota ainda"
              }
              description={
                debouncedSearch || tagSlug
                  ? "Tente outros termos ou limpe os filtros."
                  : "Cole sua primeira resposta do ChatGPT ou crie uma nota."
              }
              onPaste={() => setPasteOpen(true)}
              onCreate={() => router.push("/notas/nova")}
            />
          ) : view === "cards" ? (
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }}
              gap={4}
            >
              {paginatedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onTogglePin={() =>
                    togglePin(note.id).catch((e) =>
                      toaster.create({
                        title: e instanceof Error ? e.message : "Erro ao atualizar destaque",
                        type: "error",
                      })
                    )
                  }
                />
              ))}
            </Grid>
          ) : (
            <Stack gap={3}>
              {paginatedNotes.map((note) => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  showPreview
                  onTogglePin={() =>
                    togglePin(note.id).catch((e) =>
                      toaster.create({
                        title: e instanceof Error ? e.message : "Erro ao atualizar destaque",
                        type: "error",
                      })
                    )
                  }
                  onDelete={() => setDeleteNoteId(note.id)}
                />
              ))}
            </Stack>
          )}

          {ready && !showLoading && notes.length > 0 && (
            <NotesPagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={notes.length}
              onPageChange={setPage}
            />
          )}
        </Stack>
      </AppShell>

      <PasteNoteModal open={pasteOpen} onOpenChange={setPasteOpen} onSave={handlePasteSave} />

      <ConfirmDialog
        open={!!deleteNoteId}
        onOpenChange={(o) => !o && setDeleteNoteId(null)}
        title="Excluir nota?"
        description={
          noteToDelete
            ? `"${noteToDelete.title}" será excluída permanentemente.`
            : "Esta ação não pode ser desfeita."
        }
        confirmLabel="Excluir"
        onConfirm={handleDeleteNote}
      />
    </>
  );
}

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <Box p={6}>
          <PageSkeleton />
        </Box>
      }
    >
      <NotesPageContent />
    </Suspense>
  );
}
