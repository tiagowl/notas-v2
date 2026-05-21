"use client";

import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { LuFileText } from "react-icons/lu";

interface EmptyStateProps {
  title: string;
  description?: string;
  onPaste?: () => void;
  onCreate?: () => void;
}

export function EmptyState({ title, description, onPaste, onCreate }: EmptyStateProps) {
  return (
    <Box textAlign="center" py={16} px={4}>
      <Box color="fg.muted" fontSize="4xl" mb={4} display="flex" justifyContent="center">
        <LuFileText />
      </Box>
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      {description && (
        <Text color="fg.muted" mb={6} maxW="md" mx="auto">
          {description}
        </Text>
      )}
      <Stack direction={{ base: "column", sm: "row" }} gap={3} justify="center">
        {onPaste && (
          <Button colorPalette="blue" onClick={onPaste}>
            Colar nota
          </Button>
        )}
        {onCreate && (
          <Button variant="outline" onClick={onCreate}>
            Criar nota
          </Button>
        )}
      </Stack>
    </Box>
  );
}
