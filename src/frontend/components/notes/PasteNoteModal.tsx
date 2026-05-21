"use client";

import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RichTextEditorLazy } from "@/components/notes/RichTextEditorLazy";
import { TagSelector } from "@/components/tags/TagSelector";
import { parsePastedContent } from "@/lib/utils/parse-paste";
import { toDateInputValue } from "@/lib/utils/date";
import { toaster } from "@/components/ui/toaster";

interface PasteNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    title: string;
    content: string;
    publishedAt: string;
    tagIds: string[];
  }) => void;
}

export function PasteNoteModal({ open, onOpenChange, onSave }: PasteNoteModalProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishedAt, setPublishedAt] = useState(toDateInputValue(new Date().toISOString()));
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [manualPaste, setManualPaste] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setTitle("");
    setContent("");
    setTagIds([]);
    setPublishedAt(toDateInputValue(new Date().toISOString()));

    navigator.clipboard
      .readText()
      .then((text) => {
        if (text.trim()) {
          const parsed = parsePastedContent(text);
          setTitle(parsed.title);
          setContent(parsed.content);
        }
      })
      .catch(() => {
        toaster.create({
          title: "Cole o texto no campo abaixo",
          type: "info",
        });
      })
      .finally(() => setLoading(false));
  }, [open]);

  const applyManual = () => {
    const parsed = parsePastedContent(manualPaste);
    setTitle(parsed.title);
    setContent(parsed.content);
    setManualPaste("");
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toaster.create({ title: "Título e conteúdo são obrigatórios", type: "error" });
      return;
    }
    onSave({
      title: title.trim(),
      content: content.trim(),
      publishedAt: new Date(publishedAt).toISOString(),
      tagIds,
    });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} size="lg">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Colar nota</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              {loading ? (
                <Text color="fg.muted">Lendo área de transferência…</Text>
              ) : (
                <Stack gap={4}>
                  {!content && (
                    <Field.Root>
                      <Field.Label>Colar manualmente</Field.Label>
                      <Textarea
                        value={manualPaste}
                        onChange={(e) => setManualPaste(e.target.value)}
                        placeholder="Cole aqui se o clipboard não foi lido"
                        rows={4}
                      />
                      <Button size="sm" mt={2} onClick={applyManual}>
                        Aplicar
                      </Button>
                    </Field.Root>
                  )}
                  <Field.Root>
                    <Field.Label>Título</Field.Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Data</Field.Label>
                    <Input
                      type="date"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Tags</Field.Label>
                    <TagSelector selectedIds={tagIds} onChange={setTagIds} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Conteúdo</Field.Label>
                    <RichTextEditorLazy
                      key={content ? `paste-${content.length}` : "paste-empty"}
                      value={content}
                      onChange={setContent}
                      minHeight="200px"
                      placeholder="Revise ou edite o conteúdo colado"
                    />
                  </Field.Root>
                </Stack>
              )}
            </Dialog.Body>
            <Dialog.Footer gap={2}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button colorPalette="blue" onClick={handleSave} disabled={loading}>
                Salvar nota
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
