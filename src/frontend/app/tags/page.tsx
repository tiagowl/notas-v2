"use client";

import {
  Box,
  Breadcrumb,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Table,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TagBadge } from "@/components/tags/TagBadge";
import { TagFormModal } from "@/components/tags/TagFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { toaster } from "@/components/ui/toaster";
import { useStore } from "@/contexts/StoreContext";
import type { Tag } from "@/lib/types";

export default function TagsPage() {
  const { ready, loading, listTags, createTag, updateTag, deleteTag } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const tags = listTags();
  const tagToDelete = deleteId ? tags.find((t) => t.id === deleteId) : undefined;
  const showLoading = !ready || loading;

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
            <Breadcrumb.CurrentLink>Tags</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={3}>
        <Heading size="lg">Gerenciar tags</Heading>
        <Button
          colorPalette="blue"
          onClick={() => {
            setEditing(undefined);
            setModalOpen(true);
          }}
        >
          + Nova tag
        </Button>
      </Flex>

      {showLoading ? (
        <PageSkeleton />
      ) : tags.length === 0 ? (
        <Card.Root>
          <Card.Body textAlign="center" py={10}>
            <Text color="fg.muted" mb={4}>
              Nenhuma tag criada. Crie tags para organizar suas notas por tema.
            </Text>
            <Button colorPalette="blue" onClick={() => setModalOpen(true)}>
              + Nova tag
            </Button>
          </Card.Body>
        </Card.Root>
      ) : (
        <>
          <Box display={{ base: "none", md: "block" }}>
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Cor</Table.ColumnHeader>
                  <Table.ColumnHeader>Nome</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Notas</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tags.map((tag) => (
                  <Table.Row key={tag.id}>
                    <Table.Cell>
                      <Box w={4} h={4} borderRadius="sm" bg={tag.color ?? "#3182CE"} />
                    </Table.Cell>
                    <Table.Cell>
                      <TagBadge tag={tag} />
                    </Table.Cell>
                    <Table.Cell textAlign="end">{tag.noteCount}</Table.Cell>
                    <Table.Cell textAlign="end">
                      <HStack gap={2} justify="flex-end">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            setEditing(tag);
                            setModalOpen(true);
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          colorPalette="red"
                          onClick={() => setDeleteId(tag.id)}
                        >
                          Excluir
                        </Button>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

          <Box display={{ base: "block", md: "none" }}>
            <HStack flexDirection="column" gap={3} align="stretch">
              {tags.map((tag) => (
                <Card.Root key={tag.id} size="sm">
                  <Card.Body>
                    <Flex justify="space-between" align="center" mb={2}>
                      <TagBadge tag={tag} />
                      <Text fontSize="sm" color="fg.muted">
                        {tag.noteCount} notas
                      </Text>
                    </Flex>
                    <HStack gap={2}>
                      <Button
                        size="sm"
                        flex={1}
                        variant="outline"
                        onClick={() => {
                          setEditing(tag);
                          setModalOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        flex={1}
                        variant="outline"
                        colorPalette="red"
                        onClick={() => setDeleteId(tag.id)}
                      >
                        Excluir
                      </Button>
                    </HStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </HStack>
          </Box>
        </>
      )}

      <Button asChild variant="ghost" mt={8} colorPalette="blue">
        <Link href="/notas">← Voltar para notas</Link>
      </Button>

      <TagFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editing}
        onSave={async (data) => {
          try {
            if (editing) {
              await updateTag({ id: editing.id, name: data.name, color: data.color });
              toaster.create({ title: "Tag atualizada", type: "success" });
            } else {
              await createTag(data);
              toaster.create({ title: "Tag criada", type: "success" });
            }
          } catch (e) {
            toaster.create({
              title: e instanceof Error ? e.message : "Erro",
              type: "error",
            });
          }
        }}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Excluir tag?"
        description={
          tagToDelete?.noteCount
            ? `A tag "${tagToDelete.name}" e ${tagToDelete.noteCount} nota(s) vinculada(s) serão excluídas permanentemente.`
            : "A tag será excluída permanentemente."
        }
        confirmLabel="Excluir tag e notas"
        onConfirm={async () => {
          if (deleteId) {
            try {
              const count = tagToDelete?.noteCount ?? 0;
              await deleteTag(deleteId);
              toaster.create({
                title: "Tag excluída",
                description:
                  count > 0 ? `${count} nota(s) vinculada(s) também foram removidas.` : undefined,
                type: "info",
              });
              setDeleteId(null);
            } catch (e) {
              toaster.create({
                title: e instanceof Error ? e.message : "Erro ao excluir",
                type: "error",
              });
            }
          }
        }}
      />
    </AppShell>
  );
}
