import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(200),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  publishedAt: z.coerce.date().optional(),
  tagIds: z.array(z.string()).optional(),
  pinned: z.boolean().optional(),
});

export const updateNoteSchema = createNoteSchema.partial();

export const listNotesQuerySchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  sort: z.enum(["date-desc", "date-asc", "title-asc"]).default("date-desc"),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
export type ListNotesQuery = z.infer<typeof listNotesQuerySchema>;
