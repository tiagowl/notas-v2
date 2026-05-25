"use client";

import {
  Box,
  Button,
  Card,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { LuLock } from "react-icons/lu";
import { ColorModeButton } from "@/components/ui/ColorModeButton";
import { toaster } from "@/components/ui/toaster";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/notas";
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Notas v2";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Falha ao entrar"
        );
      }
      toaster.create({ title: "Login realizado", type: "success" });
      router.replace(from.startsWith("/") ? from : "/notas");
      router.refresh();
    } catch (err) {
      toaster.create({
        title: err instanceof Error ? err.message : "Erro ao entrar",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100dvh"
      bg="bg.canvas"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={8}
      position="relative"
    >
      <Box position="absolute" top={4} right={4}>
        <ColorModeButton />
      </Box>

      <Card.Root maxW="400px" w="full" variant="outline" shadow="md">
        <Card.Body p={{ base: 6, md: 8 }}>
          <Stack gap={6} as="form" onSubmit={handleSubmit}>
            <Stack gap={2} textAlign="center">
              <Box
                mx="auto"
                p={3}
                borderRadius="full"
                bg="blue.50"
                color="blue.600"
                _dark={{ bg: "blue.950", color: "blue.300" }}
              >
                <LuLock size={28} />
              </Box>
              <Heading size="lg">{appName}</Heading>
              <Text color="fg.muted" fontSize="sm">
                Entre com suas credenciais para acessar o sistema
              </Text>
            </Stack>

            <Field.Root required>
              <Field.Label>Usuário</Field.Label>
              <Input
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuário"
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Senha</Field.Label>
              <Input
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
              />
            </Field.Root>

            <Button
              type="submit"
              colorPalette="blue"
              w="full"
              size="lg"
              loading={loading}
            >
              Entrar
            </Button>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Box minH="100dvh" display="flex" alignItems="center" justifyContent="center">
          <Text color="fg.muted">Carregando…</Text>
        </Box>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
