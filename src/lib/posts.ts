import "server-only";
import { Prisma, type Blog } from "@prisma/client";
import { db, databaseConfigured } from "@/lib/db";
import {
	draftSchema,
	type Draft,
	type PublishedPost,
} from "@/lib/blog-content";

export function draftFromBlog(blog: Blog): Draft {
	return draftSchema.parse({ ...blog, content: blog.content });
}

export const asJson = (value: unknown) => value as Prisma.InputJsonValue;

export async function publishedPosts(limit = 50) {
	if (!databaseConfigured()) return [];
	const rows = await db.blog.findMany({
		where: { status: "PUBLISHED" },
		orderBy: { publishedAt: "desc" },
		take: limit,
		select: { id: true, slug: true, published: true, publishedAt: true },
	});

	return rows
		.filter((row) => row.published)
		.map((row) => ({
			id: row.id,
			slug: row.slug,
			publishedAt: row.publishedAt,
			post: row.published as unknown as PublishedPost,
		}));
}

export async function publishedPost(slug: string) {
	if (!databaseConfigured()) return null;

	return db.blog.findFirst({
		where: { slug, status: "PUBLISHED" },
		select: { id: true, slug: true, published: true, publishedAt: true },
	});
}
