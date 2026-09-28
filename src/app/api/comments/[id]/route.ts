import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/auth";
import { getReader } from "@/lib/reader-auth";
import {
	adminRequest,
	apiError,
	assertSameOrigin,
	HttpError,
	isObjectId,
	readJson,
} from "@/lib/http";

const moderationSchema = z.object({ status: z.enum(["VISIBLE", "HIDDEN"]) });

// Readers delete their own comments; the admin can delete any comment.
// Deletion keeps the record so replies stay in context, but drops the text.
export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		assertSameOrigin(request);

		if (!isObjectId(params.id))
			throw new HttpError(404, "Comment not found.");
		const admin = await getAdmin();
		const reader = admin ? null : await getReader();

		if (!admin && !reader)
			throw new HttpError(401, "Sign in to manage your comments.");
		const result = await db.comment.updateMany({
			where: {
				id: params.id,
				status: { not: "DELETED" },
				...(admin ? {} : { readerId: reader!.id }),
			},
			data: { status: "DELETED", body: "" },
		});

		if (!result.count) throw new HttpError(404, "Comment not found.");

		return NextResponse.json({ ok: true });
	} catch (error) {
		return apiError(error);
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		await adminRequest(request);

		if (!isObjectId(params.id))
			throw new HttpError(404, "Comment not found.");
		const parsed = moderationSchema.safeParse(await readJson(request));

		if (!parsed.success) throw new HttpError(400, "Invalid status.");
		const result = await db.comment.updateMany({
			where: { id: params.id, status: { not: "DELETED" } },
			data: { status: parsed.data.status },
		});

		if (!result.count) throw new HttpError(404, "Comment not found.");

		return NextResponse.json({ ok: true });
	} catch (error) {
		return apiError(error);
	}
}
