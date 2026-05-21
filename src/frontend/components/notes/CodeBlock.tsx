"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";

interface CodeBlockProps {
  className?: string;
  children: string;
}

export function CodeBlock({ className, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    toaster.create({ title: "Código copiado", type: "success" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box position="relative" mb={4}>
      <Box
        as="pre"
        p={4}
        borderRadius="md"
        bg="bg.emphasized"
        overflow="auto"
        fontSize="sm"
        className={className}
      >
        <code>{children}</code>
      </Box>
      <IconButton
        aria-label="Copiar código"
        size="xs"
        variant="ghost"
        position="absolute"
        top={2}
        right={2}
        onClick={copy}
      >
        {copied ? <LuCheck /> : <LuCopy />}
      </IconButton>
    </Box>
  );
}
