"use client";

import { Box, Card, Heading, HStack, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import { LuPin, LuTrash2 } from "react-icons/lu";
import { TagBadge } from "@/components/tags/TagBadge";
import { formatShortDate } from "@/lib/utils/date";
import { truncate } from "@/lib/utils/truncate";
import type { NoteSummary } from "@/lib/api/client";

interface NoteCardProps {
  note: NoteSummary;
  onTogglePin?: () => void;
  onDelete?: () => void;
}

export function NoteCard({ note, onTogglePin, onDelete }: NoteCardProps) {
  return (
    <Card.Root variant="outline" size="sm" h="full">
      <Card.Body>
        <HStack justify="space-between" align="flex-start" mb={2} gap={2}>
          <Box flex="1" minW={0} asChild>
            <Link href={`/notas/${note.id}`}>
              <Heading size="sm" lineClamp={2}>
                {note.title}
              </Heading>
            </Link>
          </Box>
          <HStack gap={0} flexShrink={0}>
            {onTogglePin && (
              <IconButton
                aria-label={note.pinned ? "Desafixar" : "Fixar"}
                size="xs"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  onTogglePin();
                }}
              >
                <LuPin color={note.pinned ? "orange" : undefined} />
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
                  onDelete();
                }}
              >
                <LuTrash2 />
              </IconButton>
            )}
          </HStack>
        </HStack>
        <Box asChild>
          <Link href={`/notas/${note.id}`}>
            <Text fontSize="xs" color="fg.muted" mb={2}>
              {formatShortDate(note.publishedAt)}
            </Text>
            <Text fontSize="sm" color="fg.muted" lineClamp={4} mb={3}>
              {note.preview ?? truncate(note.content, 200)}
            </Text>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {note.tags.map((t) => (
                <TagBadge key={t.id} tag={t} size="sm" />
              ))}
            </Box>
          </Link>
        </Box>
      </Card.Body>
    </Card.Root>
  );
}
