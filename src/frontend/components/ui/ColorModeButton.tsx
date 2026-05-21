"use client";

import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export function ColorModeButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <IconButton aria-label="Tema" variant="ghost" size="sm" disabled />;
  }

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <IconButton
      aria-label={isDark ? "Tema claro" : "Tema escuro"}
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <LuSun /> : <LuMoon />}
    </IconButton>
  );
}
