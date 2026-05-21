"use client";

import {
  Box,
  Breadcrumb,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuArrowLeft, LuExpand, LuPencil, LuShrink, LuTrash2 } from "react-icons/lu";
import { AppShell } from "@/components/layout/AppShell";
import { MarkdownContent } from "@/components/notes/MarkdownContent";
import { TagBadge } from "@/components/tags/TagBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { toaster } from "@/components/ui/toaster";
import { useStore } from "@/contexts/StoreContext";
import type { NoteWithTags } from "@/lib/types";
import { formatNoteDate } from "@/lib/utils/date";

export default function NotaDetalhePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { getNote, deleteNote } = useStore();
  const [note, setNote] = useState<NoteWithTags | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [zenMode, setZenMode] = useState(false);

  useEffect(() => {
    setLoading(true);
    getNote(id)
      .then((n) => setNote(n ?? null))
      .finally(() => setLoading(false));
  }, [id, getNote]);

  if (loading) {
    return (
      <AppShell showSidebar={false}>
        <PageSkeleton rows={3} />
      </AppShell>
    );
  }

  if (!note) {
    return (
      <AppShell showSidebar={false}>
        <Heading size="md" mb={4}>
          Nota não encontrada
        </Heading>
        <Button asChild>
          <Link href="/notas">Voltar para notas</Link>
        </Button>
      </AppShell>
    );
  }

  if (zenMode) {
    return (
      <Box minH="100dvh" bg="bg.canvas" px={{ base: 4, md: 8 }} py={8}>
        <Flex justify="flex-end" mb={6}>
          <IconButton
            aria-label="Sair do modo foco"
            variant="ghost"
            onClick={() => setZenMode(false)}
          >
            <LuShrink />
          </IconButton>
        </Flex>
        <Heading size="md" textAlign="center" mb={8} color="fg.muted">
          {note.title}
        </Heading>
        <MarkdownContent content={note.content} maxW="70ch" />
      </Box>
    );
  }

  return (
    <AppShell showSidebar={false}>
      <Breadcrumb.Root mb={4} size="sm">
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <Link href="/notas">Notas</Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink lineClamp={1}>{note.title}</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <Button asChild variant="ghost" size="sm" mb={4} px={0}>
        <Link href="/notas">
          <LuArrowLeft />
          Voltar para notas
        </Link>
      </Button>

      <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap={4} mb={6}>
        <Box flex="1" minW={0}>
          <Heading size="2xl" mb={2}>
            {note.title}
          </Heading>
          <Text color="fg.muted" mb={3}>
            {formatNoteDate(note.publishedAt)}
          </Text>
          <HStack gap={2} flexWrap="wrap">
            {note.tags.map((t) => (
              <TagBadge
                key={t.id}
                tag={t}
                onClick={() => router.push(`/notas?tag=${t.slug}`)}
              />
            ))}
          </HStack>
        </Box>
        <HStack>
          <IconButton
            aria-label="Modo leitura focada"
            variant="outline"
            onClick={() => setZenMode(true)}
          >
            <LuExpand />
          </IconButton>
          <Button asChild variant="outline" size="sm">
            <Link href={`/notas/${note.id}/editar`}>
              <LuPencil />
              Editar
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            colorPalette="red"
            onClick={() => setDeleteOpen(true)}
          >
            <LuTrash2 />
            Excluir
          </Button>
        </HStack>
      </Flex>

      <Box borderTopWidth="1px" borderColor="border.subtle" pt={8}>
        <MarkdownContent content={note.content} />
      </Box>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir nota?"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={async () => {
          try {
            await deleteNote(note.id);
            toaster.create({ title: "Nota excluída", type: "info" });
            router.push("/notas");
          } catch (e) {
            toaster.create({
              title: e instanceof Error ? e.message : "Erro ao excluir",
              type: "error",
            });
          }
        }}
      />
    </AppShell>
  );
}
