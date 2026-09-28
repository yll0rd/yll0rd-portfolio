import "server-only";
import type { CommentStatus } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";

export const commentAuthorName = "Youmbi Leo";
export const maxCommentLength = 2000;
export const maxCommentDepth = 2;

export const commentSchema = z.object({
	slug: z.string().min(1).max(200),
	parentId: z
		.string()
		.regex(/^[a-f0-9]{24}$/i)
		.nullish(),
	body: z
		.string()
		.transform((body) => body.replace(/\r\n?/g, "\n").trim())
		.pipe(
			z
				.string()
				.min(1, "Write something before posting.")
				.max(
					maxCommentLength,
					`Keep comments under ${maxCommentLength} characters.`,
				),
		),
});

export type Viewer =
	| { kind: "admin"; id: string }
	| { kind: "reader"; id: string; banned: boolean }
	| null;

export type CommentNode = {
	id: string;
	depth: number;
	status: CommentStatus;
	body: string;
	createdAt: string;
	author: { name: string; image: string | null; isAuthor: boolean } | null;
	canDelete: boolean;
	replies: CommentNode[];
};

export async function commentThread(blogId: string, viewer: Viewer) {
	const rows = await db.comment.findMany({
		where: { blogId },
		orderBy: { createdAt: "asc" },
		include: { reader: { select: { name: true, image: true } } },
	});
	const nodes = new Map<string, CommentNode & { parentId: string | null }>();

	for (const row of rows) {
		const visible = row.status === "VISIBLE";
		const own =
			viewer?.kind === "admin"
				? row.adminId === viewer.id
				: viewer?.kind === "reader" && row.readerId === viewer.id;

		nodes.set(row.id, {
			id: row.id,
			parentId: row.parentId,
			depth: row.depth,
			status: row.status,
			// Hidden and deleted text never leaves the server.
			body: visible ? row.body : "",
			createdAt: row.createdAt.toISOString(),
			author: !visible
				? null
				: row.adminId
					? { name: commentAuthorName, image: null, isAuthor: true }
					: {
							name: row.reader?.name || "Former reader",
							image: row.reader?.image ?? null,
							isAuthor: false,
						},
			canDelete: visible && (viewer?.kind === "admin" || Boolean(own)),
			replies: [],
		});
	}

	const roots: CommentNode[] = [];

	for (const node of Array.from(nodes.values())) {
		const parent = node.parentId ? nodes.get(node.parentId) : undefined;

		if (parent) parent.replies.push(node);
		else if (!node.parentId) roots.push(node);
	}

	// Moderated comments stay only when replies depend on them for context.
	const prune = (list: CommentNode[]): CommentNode[] =>
		list
			.map((node) => ({ ...node, replies: prune(node.replies) }))
			.filter(
				(node) => node.status !== "HIDDEN" || node.replies.length > 0,
			);

	return {
		comments: prune(roots),
		count: rows.filter((row) => row.status === "VISIBLE").length,
	};
}
