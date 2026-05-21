"use client";

import { Box, Button, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { TagBadge } from "./TagBadge";
import { useStore } from "@/contexts/StoreContext";
import { toaster } from "@/components/ui/toaster";

interface TagSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function TagSelector({ selectedIds, onChange }: TagSelectorProps) {
  const { listTags, createTag, loadTags } = useStore();
  const [query, setQuery] = useState("");
  const tags = listTags();
  const selected = tags.filter((t) => selectedIds.includes(t.id));
  const filtered = tags.filter(
    (t) =>
      !selectedIds.includes(t.id) &&
      t.name.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const createNew = async () => {
    const name = query.trim();
    if (!name) return;
    try {
      const tag = await createTag({ name });
      await loadTags();
      onChange([...selectedIds, tag.id]);
      setQuery("");
      toaster.create({ title: `Tag "${tag.name}" criada`, type: "success" });
    } catch (e) {
      toaster.create({
        title: e instanceof Error ? e.message : "Erro ao criar tag",
        type: "error",
      });
    }
  };

  return (
    <Stack gap={3}>
      <HStack flexWrap="wrap" gap={2}>
        {selected.map((t) => (
          <Box key={t.id} display="flex" alignItems="center" gap={1}>
            <TagBadge tag={t} />
            <Button
              size="xs"
              variant="ghost"
              onClick={() => toggle(t.id)}
              aria-label={`Remover ${t.name}`}
            >
              ×
            </Button>
          </Box>
        ))}
      </HStack>
      <Input
        placeholder="Buscar ou criar tag…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        size="sm"
      />
      <Stack gap={1} maxH="120px" overflowY="auto">
        {filtered.map((t) => (
          <Button
            key={t.id}
            size="sm"
            variant="ghost"
            justifyContent="flex-start"
            onClick={() => toggle(t.id)}
          >
            <TagBadge tag={t} size="sm" />
          </Button>
        ))}
        {query.trim() && !tags.some((t) => t.name.toLowerCase() === query.toLowerCase()) && (
          <Button size="sm" variant="outline" onClick={createNew}>
            + Criar &quot;{query.trim()}&quot;
          </Button>
        )}
      </Stack>
      {tags.length === 0 && (
        <Text fontSize="sm" color="fg.muted">
          Nenhuma tag — digite para criar
        </Text>
      )}
    </Stack>
  );
}
