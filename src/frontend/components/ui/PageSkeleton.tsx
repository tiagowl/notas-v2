"use client";

import { Skeleton, Stack } from "@chakra-ui/react";

export function PageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Stack gap={3}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height="72px" borderRadius="md" />
      ))}
    </Stack>
  );
}
