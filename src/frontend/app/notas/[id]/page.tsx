"use client";

import {
  Box,
  Breadcrumb,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Stack,
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
      <Breadcrumb.Root mb={4} size="sm" display={{ base: "none", md: "block" }}>
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

      <Button asChild variant="ghost" size="sm" mb={{ base: 3, md: 4 }} px={0} minH="44px">
        <Link href="/notas">
          <LuArrowLeft />
          Voltar
        </Link>
      </Button>

      <Stack gap={{ base: 4, md: 0 }} mb={6}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify="space-between"
          align={{ base: "stretch", lg: "flex-start" }}
          gap={4}
        >
          <Box flex="1" minW={0}>
            <Heading
              size={{ base: "xl", md: "2xl" }}
              mb={2}
              lineHeight="short"
              wordBreak="break-word"
            >
              {note.title}
            </Heading>
            <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }} mb={3}>
              {formatNoteDate(note.publishedAt)}
            </Text>
            {note.tags.length > 0 && (
              <HStack gap={2} flexWrap="wrap">
                {note.tags.map((t) => (
                  <TagBadge
                    key={t.id}
                    tag={t}
                    onClick={() => router.push(`/notas?tag=${t.slug}`)}
                  />
                ))}
              </HStack>
            )}
          </Box>

          <HStack
            gap={2}
            w={{ base: "full", lg: "auto" }}
            flexShrink={0}
            display={{ base: "none", lg: "flex" }}
          >
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

        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={2}
          w="full"
          display={{ base: "grid", lg: "none" }}
          pt={1}
          borderTopWidth="1px"
          borderColor="border.subtle"
        >
          <Button
            variant="outline"
            size="md"
            flexDirection="column"
            gap={1}
            h="auto"
            py={3}
            minH="56px"
            onClick={() => setZenMode(true)}
          >
            <LuExpand size={18} />
            <Text fontSize="xs" fontWeight="medium">
              Foco
            </Text>
          </Button>
          <Button
            asChild
            variant="outline"
            size="md"
            flexDirection="column"
            gap={1}
            h="auto"
            py={3}
            minH="56px"
          >
            <Link href={`/notas/${note.id}/editar`}>
              <LuPencil size={18} />
              <Text fontSize="xs" fontWeight="medium">
                Editar
              </Text>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="md"
            colorPalette="red"
            flexDirection="column"
            gap={1}
            h="auto"
            py={3}
            minH="56px"
            onClick={() => setDeleteOpen(true)}
          >
            <LuTrash2 size={18} />
            <Text fontSize="xs" fontWeight="medium">
              Excluir
            </Text>
          </Button>
        </Grid>
      </Stack>

      <Box
        borderTopWidth="1px"
        borderColor="border.subtle"
        pt={{ base: 6, md: 8 }}
        px={{ base: 0, md: 0 }}
      >
        <Box maxW={{ base: "100%", md: "65ch" }} mx={{ md: "auto" }}>
          <MarkdownContent content={note.content} maxW="100%" />
        </Box>
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
