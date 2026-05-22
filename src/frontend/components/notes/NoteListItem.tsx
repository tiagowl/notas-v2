"use client";

import { Box, Flex, Heading, HStack, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import { LuPin, LuTrash2 } from "react-icons/lu";
import { TagBadge } from "@/components/tags/TagBadge";
import { formatRelativeDate } from "@/lib/utils/date";
import { truncate } from "@/lib/utils/truncate";
import type { NoteSummary } from "@/lib/api/client";

interface NoteListItemProps {
  note: NoteSummary;
  showPreview?: boolean;
  onTogglePin?: () => void;
  onDelete?: () => void;
}

export function NoteListItem({ note, showPreview, onTogglePin, onDelete }: NoteListItemProps) {
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      borderColor="border.subtle"
      bg="bg.surface"
      transition="all 0.15s"
      _hover={{ bg: "bg.subtle", shadow: "sm" }}
    >
      <Flex gap={2} align="flex-start">
        <HStack gap={0} flexShrink={0}>
          {onTogglePin && (
            <IconButton
              aria-label={note.pinned ? "Remover destaque" : "Marcar destaque"}
              aria-pressed={note.pinned}
              size="xs"
              variant="ghost"
              color={note.pinned ? "orange.500" : "fg.muted"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTogglePin();
              }}
            >
              <LuPin />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              aria-label="Excluir nota"
              size="xs"
              variant="ghost"
              colorPalette="red"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
            >
              <LuTrash2 />
            </IconButton>
          )}
        </HStack>
        <Box flex="1" minW={0} asChild>
          <Link href={`/notas/${note.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Heading size="sm" mb={1} lineClamp={1}>
              {note.title}
            </Heading>
            <Text fontSize="sm" color="fg.muted" mb={2}>
              {formatRelativeDate(note.publishedAt)}
            </Text>
            {showPreview && (
              <Text fontSize="sm" color="fg.muted" lineClamp={2} mb={2}>
                {note.preview ?? truncate(note.content)}
              </Text>
            )}
            <HStack gap={1} flexWrap="wrap">
              {note.tags.map((t) => (
                <TagBadge key={t.id} tag={t} size="sm" />
              ))}
            </HStack>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}
