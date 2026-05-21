import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/errorHandler";
import * as tagService from "@/lib/services/tagService";
import { createTagSchema } from "@/lib/validators/tag";

export async function GET() {
  try {
    const tags = await tagService.listTags();
    return NextResponse.json(tags);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = createTagSchema.parse(await request.json());
    const tag = await tagService.createTag(body);
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
