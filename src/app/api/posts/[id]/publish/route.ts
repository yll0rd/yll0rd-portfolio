import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import {
	adminRequest,
	apiError,
	HttpError,
	isObjectId,
	readJson,
} from "@/lib/http";
import { publicationErrors } from "@/lib/blog-content";
import { asJson, draftFromBlog } from "@/lib/posts";

const actionSchema = z.object({
	version: z.number().int().nonnegative(),
	action: z.enum(["publish", "unpublish", "archive"]),
});

export async function POST(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const user = await adminRequest(request);

		if (!isObjectId(params.id)) throw new HttpError(404, "Post not found.");
		const body = actionSchema.safeParse(await readJson(request));

		if (!body.success)
			throw new HttpError(400, "Invalid publishing action.");
		const { version, action } = body.data;
		const blog = await db.blog.findFirst({
			where: { id: params.id, authorId: user.id },
		});

		if (!blog) throw new HttpError(404, "Post not found.");

		if (blog.version !== version)
			throw new HttpError(
				409,
				"This post changed in another tab. Reload before publishing.",
			);
		const draft = draftFromBlog(blog);
		const status =
			action === "publish"
				? "PUBLISHED"
				: action === "archive"
					? "ARCHIVED"
					: "DRAFT";
		let publication = {};

		if (action === "publish") {
			const errors = publicationErrors(draft);

			if (errors.length) throw new HttpError(400, errors.join(" "));
			const coverUrl = blog.coverUrl || null;

			publication = {
				published: asJson({ ...draft, coverUrl }),
				publishedAt: blog.publishedAt ?? new Date(),
				publishedVersion: version + 1,
			};
		}

		const result = await db.blog.updateMany({
			where: { id: blog.id, authorId: user.id, version },
			data: { status, ...publication, version: { increment: 1 } },
		});

		if (!result.count)
			throw new HttpError(
				409,
				"This post changed while publishing. Reload and try again.",
			);
		revalidatePath("/");
		revalidatePath("/writing");
		revalidatePath("/writing/" + blog.slug);
		revalidatePath("/sitemap.xml");

		return NextResponse.json({
			version: version + 1,
			status,
			publishedVersion:
				action === "publish" ? version + 1 : blog.publishedVersion,
		});
	} catch (error) {
		return apiError(error);
	}
}
