import Link from "next/link";
import type { BlogStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import NewPostButton from "@/components/dashboard/new-post-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function PostsPage({
	searchParams,
}: {
	searchParams: { q?: string; status?: string; page?: string };
}) {
	const user = await requireAdmin();
	const q =
		typeof searchParams.q === "string" ? searchParams.q.slice(0, 180) : "";
	const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(
		searchParams.status || "",
	)
		? (searchParams.status as BlogStatus)
		: undefined;
	const page = Math.max(1, Math.min(10000, Number(searchParams.page) || 1));
	const where = {
		authorId: user.id,
		...(status ? { status } : {}),
		...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
	};
	const [posts, count] = await Promise.all([
		db.blog.findMany({
			where,
			orderBy: { updatedAt: "desc" },
			skip: (page - 1) * 20,
			take: 20,
			select: {
				id: true,
				title: true,
				status: true,
				tags: true,
				updatedAt: true,
				version: true,
				publishedVersion: true,
			},
		}),
		db.blog.count({ where }),
	]);
	const href = (next: number) =>
		"/dashboard/posts?" +
		new URLSearchParams({
			q,
			...(status ? { status } : {}),
			page: String(next),
		});

	return (
		<>
			<div className="mb-10 flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="eyebrow">Writing</p>
					<h1 className="editorial-title">Your posts</h1>
				</div>
				<NewPostButton />
			</div>
			<form className="mb-8 flex flex-wrap gap-3">
				<Input
					name="q"
					aria-label="Search posts"
					placeholder="Search by title"
					defaultValue={q}
					className="max-w-sm"
				/>
				<select
					name="status"
					aria-label="Post status"
					defaultValue={status || ""}
					className="min-h-10 rounded-md border border-input bg-background px-3 text-sm"
				>
					<option value="">All posts</option>
					<option value="DRAFT">Drafts</option>
					<option value="PUBLISHED">Published</option>
					<option value="ARCHIVED">Archived</option>
				</select>
				<Button variant="outline" type="submit">
					Filter
				</Button>
			</form>
			<ul className="divide-y divide-border border-y border-border">
				{posts.map((post) => (
					<li key={post.id}>
						<a
							href={"/dashboard/posts/" + post.id}
							className="flex flex-col justify-between gap-3 py-6 hover:text-primary sm:flex-row sm:items-center"
						>
							<div>
								<h2 className="font-medium">
									{post.title || "Untitled post"}
								</h2>
								<p className="mt-2 text-xs text-muted-foreground">
									{post.tags.join(" · ") || "No tags"}
								</p>
							</div>
							<div className="text-sm text-muted-foreground">
								<span className="capitalize">
									{post.status.toLowerCase()}
								</span>
								{post.status === "PUBLISHED" &&
									post.version !== post.publishedVersion && (
										<span> · Unpublished changes</span>
									)}
								<p className="mt-1 text-xs">
									Edited{" "}
									{post.updatedAt.toLocaleDateString(
										"en-GB",
										{
											timeZone: "UTC",
										},
									)}
								</p>
							</div>
						</a>
					</li>
				))}
			</ul>
			{!posts.length && (
				<p className="py-12 text-muted-foreground">
					{q || status
						? "No posts match these filters."
						: "No posts yet. Start with a new draft."}
				</p>
			)}
			<div className="mt-6 flex items-center justify-between text-sm">
				<span>{count} posts</span>
				<div className="flex gap-6">
					{page > 1 && (
						<Link href={href(page - 1)} className="text-link">
							Previous
						</Link>
					)}
					{page * 20 < count && (
						<Link href={href(page + 1)} className="text-link">
							Next
						</Link>
					)}
				</div>
			</div>
		</>
	);
}
