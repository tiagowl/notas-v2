"use client";

import { Breadcrumb } from "@chakra-ui/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { NoteForm } from "@/components/notes/NoteForm";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { toaster } from "@/components/ui/toaster";
import { useStore } from "@/contexts/StoreContext";
import type { NoteWithTags } from "@/lib/types";

export default function EditarNotaPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { getNote, updateNote } = useStore();
  const [note, setNote] = useState<NoteWithTags | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNote(id)
      .then((n) => setNote(n ?? null))
      .finally(() => setLoading(false));
  }, [id, getNote]);

  if (loading) {
    return (
      <AppShell showSidebar={false}>
        <PageSkeleton rows={4} />
      </AppShell>
    );
  }

  if (!note) {
    return (
      <AppShell showSidebar={false}>
        <p>Nota não encontrada.</p>
        <Link href="/notas">Voltar</Link>
      </AppShell>
    );
  }

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
            <Breadcrumb.Link asChild>
              <Link href={`/notas/${note.id}`}>{note.title}</Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Editar</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <NoteForm
        initial={note}
        submitLabel="Salvar alterações"
        onSubmit={async (values) => {
          try {
            await updateNote({ id: note.id, ...values });
            toaster.create({ title: "Alterações salvas", type: "success" });
            router.push(`/notas/${note.id}`);
          } catch (e) {
            toaster.create({
              title: e instanceof Error ? e.message : "Erro ao salvar",
              type: "error",
            });
          }
        }}
        onCancel={() => router.push(`/notas/${note.id}`)}
      />
    </AppShell>
  );
}
