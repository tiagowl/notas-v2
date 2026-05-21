"use client";

import {
  Button,
  CloseButton,
  Dialog,
  Field,
  HStack,
  Input,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { Tag } from "@/lib/types";

const PRESET_COLORS = [
  "#3182CE",
  "#805AD5",
  "#38A169",
  "#DD6B20",
  "#E53E3E",
  "#D69E2E",
  "#319795",
  "#1A202C",
];

interface TagFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Tag;
  onSave: (data: { name: string; color: string }) => void;
}

export function TagFormModal({ open, onOpenChange, initial, onSave }: TagFormModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setColor(initial?.color ?? PRESET_COLORS[0]);
    }
  }, [open, initial]);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{initial ? "Editar tag" : "Nova tag"}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={4}>
                <Field.Root>
                  <Field.Label>Nome *</Field.Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Cor</Field.Label>
                  <HStack flexWrap="wrap" gap={2}>
                    {PRESET_COLORS.map((c) => (
                      <Button
                        key={c}
                        w={8}
                        h={8}
                        minW={8}
                        p={0}
                        borderRadius="full"
                        bg={c}
                        borderWidth={color === c ? "3px" : "1px"}
                        borderColor={color === c ? "blue.500" : "transparent"}
                        onClick={() => setColor(c)}
                        aria-label={`Cor ${c}`}
                      />
                    ))}
                  </HStack>
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer gap={2}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                colorPalette="blue"
                onClick={() => {
                  if (!name.trim()) return;
                  onSave({ name: name.trim(), color });
                  onOpenChange(false);
                }}
              >
                Salvar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
