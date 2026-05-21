import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/errorHandler";
import * as noteService from "@/lib/services/noteService";
import { createNoteSchema, listNotesQuerySchema } from "@/lib/validators/note";

export async function GET(request: NextRequest) {
  try {
    const params = listNotesQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    );
    const notes = await noteService.listNotes(params);
    return NextResponse.json(notes);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = createNoteSchema.parse(await request.json());
    const note = await noteService.createNote(body);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
