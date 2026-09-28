import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/auth";
import { getReader } from "@/lib/reader-auth";
import { apiError, assertSameOrigin, HttpError, readJson } from "@/lib/http";
import {
	commentAuthorName,
	commentSchema,
	maxCommentDepth,
} from "@/lib/comments";
import { notifyCommentRecipients } from "@/lib/comment-notifications";
import type { PublishedPost } from "@/lib/blog-content";

const rateWindow = 10 * 60 * 1000;
const rateLimit = 5;

export async function POST(request: Request) {
	try {
		assertSameOrigin(request);
		const admin = await getAdmin();
		const reader = admin ? null : await getReader();

		if (!admin && !reader)
			throw new HttpError(401, "Sign in with Google to comment.");

		if (reader?.banned)
			throw new HttpError(403, "This account can no longer comment.");
		const parsed = commentSchema.safeParse(await readJson(request));

		if (!parsed.success)
			throw new HttpError(400, parsed.error.issues[0].message);
		const { slug, body } = parsed.data;
		const blog = await db.blog.findFirst({
			where: { slug, status: "PUBLISHED" },
			select: { id: true, published: true },
		});

		if (!blog) throw new HttpError(404, "This post is not available.");

		if (reader) {
			const recent = await db.comment.count({
				where: {
					readerId: reader.id,
					createdAt: { gt: new Date(Date.now() - rateWindow) },
				},
			});

			if (recent >= rateLimit)
				throw new HttpError(
					429,
					"You’ve posted several comments in a short time. Wait a few minutes and try again.",
				);
		}

		let parentId: string | null = null;
		let depth = 0;
		// The comment the person actually replied to, even when the reply is
		// filed under its parent to respect the depth limit.
		const parent = parsed.data.parentId
			? await db.comment.findFirst({
					where: {
						id: parsed.data.parentId,
						blogId: blog.id,
						status: "VISIBLE",
					},
					select: {
						id: true,
						parentId: true,
						depth: true,
						body: true,
						adminId: true,
						readerId: true,
						reader: { select: { name: true, email: true } },
					},
				})
			: null;

		if (parsed.data.parentId) {
			if (!parent)
				throw new HttpError(
					404,
					"The comment you’re replying to is no longer available.",
				);

			// Replies deeper than two levels attach to the level-one comment.
			if (parent.depth >= maxCommentDepth && parent.parentId) {
				parentId = parent.parentId;
				depth = maxCommentDepth;
			} else {
				parentId = parent.id;
				depth = parent.depth + 1;
			}
		}

		const comment = await db.comment.create({
			data: {
				blogId: blog.id,
				body,
				parentId,
				depth,
				...(admin ? { adminId: admin.id } : { readerId: reader!.id }),
			},
			select: { id: true },
		});

		const origin = process.env.APP_URL || new URL(request.url).origin;

		try {
			await notifyCommentRecipients({
				commenter: {
					name: admin ? commentAuthorName : reader!.name,
					isOwner: Boolean(admin),
					readerId: reader?.id ?? null,
				},
				target: parent
					? {
							authorName: parent.adminId
								? commentAuthorName
								: parent.reader?.name || "a former reader",
							isOwner: Boolean(parent.adminId),
							readerId: parent.readerId,
							readerEmail: parent.reader?.email ?? null,
							body: parent.body,
						}
					: null,
				postTitle:
					(blog.published as unknown as PublishedPost | null)
						?.title || slug,
				body,
				url: `${origin}/writing/${slug}#comment-${comment.id}`,
			});
		} catch (error) {
			// The comment is saved; a failed email must not surface to the commenter.
			console.error(
				"Comment notification failed:",
				error instanceof Error ? error.message : "Unknown error",
			);
		}

		return NextResponse.json({ id: comment.id }, { status: 201 });
	} catch (error) {
		return apiError(error);
	}
}
