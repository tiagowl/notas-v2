import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/errorHandler";
import * as noteService from "@/lib/services/noteService";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const note = await noteService.toggleNotePin(id);
    if (!note) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (error) {
    return handleApiError(error);
  }
}
