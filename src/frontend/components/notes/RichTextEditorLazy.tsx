"use client";

import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";

export const RichTextEditorLazy = dynamic(
  () => import("./RichTextEditor").then((m) => m.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <Box
        minH="280px"
        borderWidth="1px"
        borderRadius="md"
        borderColor="border.emphasized"
        p={4}
        color="fg.muted"
      >
        Carregando editor…
      </Box>
    ),
  }
);
