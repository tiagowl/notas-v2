"use client";

import { Badge, Button } from "@chakra-ui/react";
import type { Tag } from "@/lib/types";

interface TagBadgeProps {
  tag: Tag;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

export function TagBadge({ tag, selected, onClick, size = "sm" }: TagBadgeProps) {
  const color = tag.color ?? "#3182CE";
  const label = (
    <Badge
      size={size}
      variant={selected ? "solid" : "subtle"}
      bg={selected ? color : undefined}
      color={selected ? "white" : undefined}
      borderWidth="1px"
      borderColor={color}
    >
      {tag.name}
    </Badge>
  );

  if (onClick) {
    return (
      <Button
        variant="ghost"
        size="xs"
        h="auto"
        minH="auto"
        p={0}
        aria-pressed={selected}
        onClick={onClick}
      >
        {label}
      </Button>
    );
  }

  return label;
}
