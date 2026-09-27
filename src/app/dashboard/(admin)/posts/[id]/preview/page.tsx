import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { isObjectId } from "@/lib/http";
import { draftFromBlog } from "@/lib/posts";
import Article from "@/components/blog/article";

export default async function Preview({ params }: { params: { id: string } }) {
	const user = await requireAdmin();

	if (!isObjectId(params.id)) notFound();

	const blog = await db.blog.findFirst({
		where: { id: params.id, authorId: user.id },
	});

	if (!blog) notFound();

	return (
		<>
			<div className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded border border-border bg-muted p-4 text-sm">
				<p>Private preview of the latest saved draft.</p>
				<a className="text-link" href={"/dashboard/posts/" + blog.id}>
					Back to editor
				</a>
			</div>
			<Article post={{ ...(draftFromBlog(blog) || null) }} />
		</>
	);
}
