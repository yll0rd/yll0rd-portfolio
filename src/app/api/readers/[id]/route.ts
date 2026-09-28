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

const banSchema = z.object({ banned: z.boolean() });

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		await adminRequest(request);

		if (!isObjectId(params.id))
			throw new HttpError(404, "Reader not found.");
		const parsed = banSchema.safeParse(await readJson(request));

		if (!parsed.success) throw new HttpError(400, "Invalid request.");
		const result = await db.reader.updateMany({
			where: { id: params.id },
			data: { banned: parsed.data.banned },
		});

		if (!result.count) throw new HttpError(404, "Reader not found.");

		return NextResponse.json({ ok: true });
	} catch (error) {
		return apiError(error);
	}
}
