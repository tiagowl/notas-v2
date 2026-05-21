"use client";

import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RichTextEditorLazy } from "@/components/notes/RichTextEditorLazy";
import { TagSelector } from "@/components/tags/TagSelector";
import { toDateInputValue } from "@/lib/utils/date";
import type { NoteWithTags } from "@/lib/types";

export interface NoteFormValues {
  title: string;
  content: string;
  publishedAt: string;
  tagIds: string[];
}

interface NoteFormProps {
  initial?: NoteWithTags;
  onSubmit: (values: NoteFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function NoteForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Salvar nota",
}: NoteFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [publishedAt, setPublishedAt] = useState(
    initial ? toDateInputValue(initial.publishedAt) : toDateInputValue(new Date().toISOString())
  );
  const [tagIds, setTagIds] = useState<string[]>(initial?.tags.map((t) => t.id) ?? []);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const validate = () => {
    const next: typeof errors = {};
    if (!title.trim()) next.title = "Título é obrigatório";
    if (title.length > 200) next.title = "Máximo 200 caracteres";
    if (!content.trim()) next.content = "Conteúdo é obrigatório";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      publishedAt: new Date(publishedAt).toISOString(),
      tagIds,
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} maxW="720px">
      <Heading size="lg" mb={6}>
        {initial ? "Editar nota" : "Nova nota"}
      </Heading>
      <Stack gap={5}>
        <Field.Root invalid={!!errors.title}>
          <Field.Label>Título *</Field.Label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
            placeholder="Título da nota"
          />
          {errors.title && <Field.ErrorText>{errors.title}</Field.ErrorText>}
        </Field.Root>

        <Field.Root>
          <Field.Label>Data de publicação</Field.Label>
          <Input
            type="date"
            value={publishedAt}
            onChange={(e) => {
              setPublishedAt(e.target.value);
              setDirty(true);
            }}
          />
          <Field.HelperText>Data da resposta ou quando foi gerada a nota</Field.HelperText>
        </Field.Root>

        <Field.Root>
          <Field.Label>Tags</Field.Label>
          <TagSelector selectedIds={tagIds} onChange={(ids) => { setTagIds(ids); setDirty(true); }} />
        </Field.Root>

        <Field.Root invalid={!!errors.content}>
          <Field.Label>Conteúdo *</Field.Label>
          <RichTextEditorLazy
            value={content}
            onChange={(md) => {
              setContent(md);
              setDirty(true);
            }}
            placeholder="Escreva ou cole texto do ChatGPT — formatação é preservada"
          />
          <Field.HelperText>
            Salvo como Markdown. Cole respostas do ChatGPT ou edite visualmente.
          </Field.HelperText>
          {errors.content && <Field.ErrorText>{errors.content}</Field.ErrorText>}
        </Field.Root>

        <Flex
          gap={3}
          justify="flex-end"
          position={{ base: "sticky", md: "static" }}
          bottom={0}
          bg="bg.canvas"
          py={3}
          borderTopWidth={{ base: "1px", md: 0 }}
        >
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button colorPalette="blue" type="submit">
            {submitLabel}
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}
