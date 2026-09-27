import "server-only";
import { UTApi } from "uploadthing/server";
import { db } from "@/lib/db";
import { imageSources, uploadThingKey } from "@/lib/image-references";

export async function deleteUnusedImages(sources: string[]) {
	const candidates = new Set(
		sources.map(uploadThingKey).filter((key): key is string => !!key),
	);

	if (!candidates.size) return;

	// Include all drafts, covers, and publication snapshots before deleting a file.
	const posts = await db.blog.findMany({
		select: { content: true, coverUrl: true, published: true },
	});

	function retain(source: string) {
		const key = uploadThingKey(source);

		if (key) candidates.delete(key);
	}

	for (const post of posts) {
		imageSources(post.content).forEach(retain);
		retain(post.coverUrl);

		if (
			post.published &&
			typeof post.published === "object" &&
			!Array.isArray(post.published)
		) {
			imageSources(post.published.content).forEach(retain);

			if (typeof post.published.coverUrl === "string")
				retain(post.published.coverUrl);
		}
	}

	if (!candidates.size) return;
	const result = await new UTApi().deleteFiles(Array.from(candidates));

	if (!result.success) throw new Error("Image cleanup failed.");
}
