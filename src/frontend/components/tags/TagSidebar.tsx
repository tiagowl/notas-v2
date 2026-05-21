"use client";

import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { TagBadge } from "./TagBadge";
import type { Tag } from "@/lib/types";

interface TagWithCount extends Tag {
  noteCount: number;
}

interface TagSidebarProps {
  tags: TagWithCount[];
  totalNotes: number;
  activeTagSlug?: string;
  onSelectTag: (slug: string | undefined) => void;
}

export function TagSidebar({
  tags,
  totalNotes,
  activeTagSlug,
  onSelectTag,
}: TagSidebarProps) {
  return (
    <Box as="nav" aria-label="Filtro por tags" p={4}>
      <Heading size="sm" mb={3} color="fg.muted">
        Tags
      </Heading>
      <Stack gap={2}>
        <Button
          size="sm"
          variant={!activeTagSlug ? "solid" : "ghost"}
          colorPalette={!activeTagSlug ? "blue" : undefined}
          justifyContent="flex-start"
          onClick={() => onSelectTag(undefined)}
        >
          Todas
          <Text as="span" ml="auto" fontSize="xs" opacity={0.8}>
            ({totalNotes})
          </Text>
        </Button>
        {tags.map((tag) => (
          <Button
            key={tag.id}
            size="sm"
            variant="ghost"
            justifyContent="flex-start"
            gap={2}
            onClick={() =>
              onSelectTag(activeTagSlug === tag.slug ? undefined : tag.slug)
            }
            bg={activeTagSlug === tag.slug ? "bg.subtle" : undefined}
          >
            <TagBadge tag={tag} selected={activeTagSlug === tag.slug} size="sm" />
            <Text as="span" ml="auto" fontSize="xs" color="fg.muted">
              {tag.noteCount}
            </Text>
          </Button>
        ))}
      </Stack>
      <Button asChild variant="ghost" size="sm" mt={6} colorPalette="blue">
        <Link href="/tags">Gerenciar tags</Link>
      </Button>
    </Box>
  );
}
