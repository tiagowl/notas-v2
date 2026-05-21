"use client";

import { Breadcrumb } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { NoteForm } from "@/components/notes/NoteForm";
import { toaster } from "@/components/ui/toaster";
import { useStore } from "@/contexts/StoreContext";

export default function NovaNotaPage() {
  const router = useRouter();
  const { createNote } = useStore();

  return (
    <AppShell showSidebar={false}>
      <Breadcrumb.Root mb={4} size="sm">
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <Link href="/notas">Notas</Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Nova nota</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <NoteForm
        onSubmit={async (values) => {
          try {
            const note = await createNote(values);
            toaster.create({ title: "Nota criada", type: "success" });
            router.push(`/notas/${note.id}`);
          } catch (e) {
            toaster.create({
              title: e instanceof Error ? e.message : "Erro ao criar nota",
              type: "error",
            });
          }
        }}
        onCancel={() => router.push("/notas")}
      />
    </AppShell>
  );
}
