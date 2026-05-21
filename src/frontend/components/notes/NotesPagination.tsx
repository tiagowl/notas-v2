"use client";

import { Button, Flex, HStack, Text } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export const NOTES_PER_PAGE = 4;

interface NotesPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function NotesPagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: NotesPaginationProps) {
  if (totalItems === 0 || totalPages <= 1) return null;

  const from = (page - 1) * NOTES_PER_PAGE + 1;
  const to = Math.min(page * NOTES_PER_PAGE, totalItems);

  const showPageNumbers = totalPages <= 7;
  const pages = showPageNumbers
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : [];

  return (
    <Flex direction="column" align="center" gap={3} mt={2}>
      <Text fontSize="sm" color="fg.muted">
        Mostrando {from}–{to} de {totalItems} nota(s)
      </Text>
      <HStack gap={1} flexWrap="wrap" justify="center">
        <Button
          size="sm"
          variant="outline"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <LuChevronLeft />
          Anterior
        </Button>
        {showPageNumbers ? (
          pages.map((p) => (
            <Button
              key={p}
              size="sm"
              variant={p === page ? "solid" : "outline"}
              colorPalette={p === page ? "blue" : undefined}
              aria-label={`Página ${p}`}
              aria-current={p === page ? "page" : undefined}
              onClick={() => onPageChange(p)}
              minW="9"
            >
              {p}
            </Button>
          ))
        ) : (
          <Text fontSize="sm" px={2} fontWeight="medium">
            Página {page} de {totalPages}
          </Text>
        )}
        <Button
          size="sm"
          variant="outline"
          aria-label="Próxima página"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
          <LuChevronRight />
        </Button>
      </HStack>
    </Flex>
  );
}
