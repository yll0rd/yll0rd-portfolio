import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  adminRequest,
  apiError,
  HttpError,
  isObjectId,
  readJson,
} from "@/lib/http";
import { draftSchema } from "@/lib/blog-content";
import { asJson } from "@/lib/posts";
import { imageSources } from "@/lib/image-references";
import { deleteUnusedImages } from "@/lib/image-cleanup";
const saveSchema = draftSchema.extend({
  version: z.number().int().nonnegative(),
  deletedImageUrls: z.array(z.string().max(2048)).max(500).default([]),
});
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await adminRequest(request);
    if (!isObjectId(params.id)) throw new HttpError(404, "Post not found.");
    const parsed = saveSchema.safeParse(await readJson(request));
    if (!parsed.success)
      throw new HttpError(400, parsed.error.issues[0].message);
    const { version, coverUrl, deletedImageUrls, ...draft } = parsed.data;
    const current = await db.blog.findFirst({
      where: { id: params.id, authorId: user.id },
    });
    if (!current) throw new HttpError(404, "Post not found.");
    if (current.publishedAt && draft.slug !== current.slug)
      throw new HttpError(
        400,
        "The URL is locked after first publication to preserve existing links.",
      );
    const result = await db.blog.updateMany({
      where: { id: params.id, authorId: user.id, version },
      data: {
        ...draft,
        ...(coverUrl === null ? {} : { coverUrl }),
        content: asJson(draft.content),
        tags: Array.from(new Set(draft.tags)),
        version: { increment: 1 },
      },
    });
    if (!result.count)
      throw new HttpError(
        409,
        "This post changed in another tab. Your edits are kept locally; reload to compare versions.",
      );
    let cleanupWarning: string | undefined;
    try {
      const remaining = imageSources(draft.content);
      await deleteUnusedImages([
        ...deletedImageUrls,
        ...Array.from(imageSources(current.content)).filter((source) => !remaining.has(source)),
      ]);
    } catch {
      // The draft was saved. Do not turn a cleanup failure into a version conflict.
      cleanupWarning = "Draft saved, but unused images could not be deleted from UploadThing.";
    }
    return NextResponse.json({
      version: version + 1,
      cleanupWarning,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    return apiError(error);
  }
}
