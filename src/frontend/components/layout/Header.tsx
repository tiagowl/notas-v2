"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LuClipboardPaste, LuMenu, LuPlus, LuSearch } from "react-icons/lu";
import { ColorModeButton } from "@/components/ui/ColorModeButton";

interface HeaderProps {
  search: string;
  onSearchChange: (v: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  onOpenDrawer?: () => void;
  onPaste?: () => void;
  showMenuButton?: boolean;
}

export function Header({
  search,
  onSearchChange,
  searchInputRef,
  onOpenDrawer,
  onPaste,
  showMenuButton,
}: HeaderProps) {
  const router = useRouter();
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Notas v2";
  const headerRef = useRef<HTMLDivElement>(null);
  const [mobileHeaderHeight, setMobileHeaderHeight] = useState(0);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => setMobileHeaderHeight(el.offsetHeight);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [onPaste, showMenuButton]);

  return (
    <>
      <Box
        ref={headerRef}
        as="header"
        className="app-header"
        borderBottomWidth="1px"
        borderColor="border.subtle"
        position={{ base: "fixed", md: "sticky" }}
        top={0}
        left={0}
        right={0}
        width="100%"
        zIndex={1200}
        bg={{ base: "white", md: "bg.surface" }}
        _dark={{ bg: { base: "gray.950", md: "bg.surface" } }}
        shadow={{ base: "sm", md: "none" }}
        isolation="isolate"
        css={{
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          transform: "translateZ(0)",
        }}
      >
        <Container maxW="container.xl" py={3} position="relative" zIndex={1}>
          <Flex gap={3} align="center" flexWrap="wrap">
            {showMenuButton && (
              <IconButton
                aria-label="Menu"
                variant="ghost"
                display={{ base: "inline-flex", lg: "none" }}
                onClick={onOpenDrawer}
              >
                <LuMenu />
              </IconButton>
            )}
            <Button asChild variant="ghost" fontWeight="bold" px={2}>
              <Link href="/notas">{appName}</Link>
            </Button>
            <InputGroup
              flex="1"
              minW={{ base: "100%", md: "200px" }}
              order={{ base: 3, md: 0 }}
              w={{ base: "100%", md: "auto" }}
              startElement={<LuSearch />}
            >
              <Input
                ref={searchInputRef}
                placeholder="Buscar por título ou conteúdo…"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Buscar notas"
                bg={{ base: "gray.50", md: "bg" }}
                _dark={{ bg: { base: "gray.900", md: "bg" } }}
              />
            </InputGroup>
            <Flex gap={2} ml={{ md: "auto" }}>
              {onPaste && (
                <Button
                  colorPalette="blue"
                  size="sm"
                  onClick={onPaste}
                  display={{ base: "none", sm: "inline-flex" }}
                >
                  <LuClipboardPaste />
                  Colar nota
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/notas/nova")}
              >
                <LuPlus />
                Nova
              </Button>
              <ColorModeButton />
            </Flex>
          </Flex>
          {onPaste && (
            <Button
              colorPalette="blue"
              size="sm"
              w="full"
              mt={2}
              display={{ base: "inline-flex", sm: "none" }}
              onClick={onPaste}
            >
              <LuClipboardPaste />
              Colar nota
            </Button>
          )}
        </Container>
      </Box>
      {/* Reserva espaço no mobile para o header fixo */}
      <Box
        display={{ base: "block", md: "none" }}
        h={mobileHeaderHeight > 0 ? `${mobileHeaderHeight}px` : "120px"}
        flexShrink={0}
        aria-hidden
      />
    </>
  );
}
