import Link from "next/link";
import type { CommentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { commentAuthorName } from "@/lib/comments";
import type { PublishedPost } from "@/lib/blog-content";
import CommentActions from "@/components/dashboard/comment-actions";

const filters = [
	["", "All"],
	["VISIBLE", "Visible"],
	["HIDDEN", "Hidden"],
	["DELETED", "Deleted"],
] as const;

export default async function CommentsPage({
	searchParams,
}: {
	searchParams: { status?: string; page?: string };
}) {
	await requireAdmin();
	const status = ["VISIBLE", "HIDDEN", "DELETED"].includes(
		searchParams.status || "",
	)
		? (searchParams.status as CommentStatus)
		: undefined;
	const page = Math.max(1, Math.min(10000, Number(searchParams.page) || 1));
	const where = status ? { status } : {};
	const [comments, count] = await Promise.all([
		db.comment.findMany({
			where,
			orderBy: { createdAt: "desc" },
			skip: (page - 1) * 30,
			take: 30,
			include: {
				reader: {
					select: { id: true, name: true, email: true, banned: true },
				},
				blog: { select: { slug: true, published: true } },
			},
		}),
		db.comment.count({ where }),
	]);
	const href = (next: number) =>
		"/dashboard/comments?" +
		new URLSearchParams({
			...(status ? { status } : {}),
			page: String(next),
		});

	return (
		<>
			<div className="mb-10">
				<p className="eyebrow">Writing</p>
				<h1 className="editorial-title">Comments</h1>
				<p className="text-muted-foreground">
					Hide or delete comments, and stop readers from posting.
				</p>
			</div>
			<nav
				aria-label="Filter comments"
				className="mb-8 flex flex-wrap gap-2 text-sm"
			>
				{filters.map(([value, label]) => (
					<Link
						key={label}
						href={
							"/dashboard/comments" +
							(value ? "?status=" + value : "")
						}
						aria-current={
							(status || "") === value ? "page" : undefined
						}
						className="inline-flex min-h-10 items-center rounded px-3 text-muted-foreground hover:bg-accent aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-primary"
					>
						{label}
					</Link>
				))}
			</nav>
			<ul className="divide-y divide-border border-y border-border">
				{comments.map((comment) => {
					const title =
						(
							comment.blog
								.published as unknown as PublishedPost | null
						)?.title || comment.blog.slug;

					return (
						<li
							key={comment.id}
							className="grid gap-4 py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8"
						>
							<div className="min-w-0">
								<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
									<span className="font-medium">
										{comment.adminId
											? commentAuthorName
											: comment.reader?.name ||
												"Former reader"}
									</span>
									{comment.reader && (
										<span className="text-muted-foreground">
											{comment.reader.email}
										</span>
									)}
									{comment.reader?.banned && (
										<span className="rounded-sm border border-destructive/40 px-1.5 text-xs text-destructive">
											Banned
										</span>
									)}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">
									{comment.parentId ? "Reply on " : "On "}
									<a
										href={`/writing/${comment.blog.slug}#comment-${comment.id}`}
										className="text-primary underline-offset-4 hover:underline"
									>
										{title}
									</a>
									{" · "}
									{comment.createdAt.toLocaleString("en-GB", {
										dateStyle: "medium",
										timeStyle: "short",
										timeZone: "UTC",
									})}{" "}
									UTC
								</p>
								{comment.status === "DELETED" ? (
									<p className="mt-3 italic text-muted-foreground">
										Deleted
									</p>
								) : (
									<p className="mt-3 whitespace-pre-line break-words">
										{comment.body}
									</p>
								)}
							</div>
							<CommentActions
								id={comment.id}
								status={comment.status}
								reader={
									comment.reader
										? {
												id: comment.reader.id,
												banned: comment.reader.banned,
											}
										: null
								}
							/>
						</li>
					);
				})}
			</ul>
			{!comments.length && (
				<p className="py-12 text-muted-foreground">
					{status
						? "No comments with this status."
						: "No comments yet. They’ll appear here as readers respond."}
				</p>
			)}
			<div className="mt-6 flex items-center justify-between text-sm">
				<span>
					{count} {count === 1 ? "comment" : "comments"}
				</span>
				<div className="flex gap-6">
					{page > 1 && (
						<Link href={href(page - 1)} className="text-link">
							Previous
						</Link>
					)}
					{page * 30 < count && (
						<Link href={href(page + 1)} className="text-link">
							Next
						</Link>
					)}
				</div>
			</div>
		</>
	);
}
