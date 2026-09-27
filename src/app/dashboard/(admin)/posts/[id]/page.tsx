import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { isObjectId } from "@/lib/http";
import { draftFromBlog } from "@/lib/posts";
import PostEditor from "@/components/dashboard/post-editor";

export default async function EditPost({ params }: { params: { id: string } }) {
	const user = await requireAdmin();

	if (!isObjectId(params.id)) notFound();
	const post = await db.blog.findFirst({
		where: { id: params.id, authorId: user.id },
	});

	if (!post) notFound();

	return (
		<PostEditor
			id={post.id}
			initial={draftFromBlog(post)}
			initialVersion={post.version}
			initialStatus={post.status}
			initialPublishedVersion={post.publishedVersion}
			slugLocked={Boolean(post.publishedAt)}
			initialCoverUrl={post.coverUrl || null}
		/>
	);
}
