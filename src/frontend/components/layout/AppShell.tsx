"use client";

import { Box, Drawer, Flex, Portal, Text } from "@chakra-ui/react";
import { useRef, useState, type ReactNode } from "react";
import { Header } from "./Header";
import { TagSidebar } from "@/components/tags/TagSidebar";
import { useStore } from "@/contexts/StoreContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface AppShellProps {
  children: ReactNode;
  search?: string;
  onSearchChange?: (v: string) => void;
  activeTagSlug?: string;
  onTagFilter?: (slug: string | undefined) => void;
  onPaste?: () => void;
  showSidebar?: boolean;
}

export function AppShell({
  children,
  search = "",
  onSearchChange,
  activeTagSlug,
  onTagFilter,
  onPaste,
  showSidebar = true,
}: AppShellProps) {
  const { listTags, totalNotesCount, ready, error } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts({
    onSearch: () => searchRef.current?.focus(),
  });

  const tags = listTags();

  return (
    <Box minH="100dvh" bg="bg.canvas">
      <Header
        search={search}
        onSearchChange={onSearchChange ?? (() => {})}
        searchInputRef={searchRef}
        onOpenDrawer={() => setDrawerOpen(true)}
        onPaste={onPaste}
        showMenuButton={showSidebar}
      />
      {error && (
        <Text bg="red.subtle" color="red.fg" px={4} py={2} fontSize="sm" textAlign="center">
          {error} — verifique DATABASE_URL e execute as migrations.
        </Text>
      )}
      <Flex maxW="container.xl" mx="auto" w="full">
        {showSidebar && (
          <Box
            w="240px"
            flexShrink={0}
            borderRightWidth="1px"
            borderColor="border.subtle"
            display={{ base: "none", lg: "block" }}
            bg="bg.surface"
            minH="calc(100dvh - 65px)"
          >
            {ready && onTagFilter && (
              <TagSidebar
                tags={tags}
                totalNotes={totalNotesCount}
                activeTagSlug={activeTagSlug}
                onSelectTag={onTagFilter}
              />
            )}
          </Box>
        )}
        <Box flex="1" p={{ base: 4, md: 6 }} minW={0}>
          {children}
        </Box>
      </Flex>

      <Drawer.Root
        open={drawerOpen}
        onOpenChange={(e) => setDrawerOpen(e.open)}
        placement="start"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Menu</Drawer.Title>
                <Drawer.CloseTrigger />
              </Drawer.Header>
              <Drawer.Body p={0}>
                {ready && onTagFilter && (
                  <TagSidebar
                    tags={tags}
                    totalNotes={totalNotesCount}
                    activeTagSlug={activeTagSlug}
                    onSelectTag={(slug) => {
                      onTagFilter(slug);
                      setDrawerOpen(false);
                    }}
                  />
                )}
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
}
