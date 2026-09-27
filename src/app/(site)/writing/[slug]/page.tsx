import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { publishedPost } from "@/lib/posts";
import type { PublishedPost } from "@/lib/blog-content";
import Article from "@/components/blog/article";
import TableOfContents from "@/components/blog/table-of-contents";
import { prepareArticleHeadings } from "@/lib/article-headings";

export const dynamic = "force-dynamic";

const getPost = cache(publishedPost);

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata> {
	const row = await getPost(params.slug);

	if (!row?.published)
		return { title: "Post not found", robots: { index: false } };
	const post = row.published as unknown as PublishedPost;
	const url = "https://yll0rd.me/writing/" + row.slug;

	return {
		title: (post.seoTitle || post.title) + " | Youmbi Leo",
		description: post.seoDescription || post.excerpt,
		alternates: { canonical: url },
		openGraph: {
			type: "article",
			title: post.title,
			description: post.excerpt,
			url,
			publishedTime: row.publishedAt?.toISOString(),
			authors: ["Youmbi Leo"],
			images: post.coverUrl
				? [{ url: post.coverUrl, alt: `${post.title} cover` }]
				: [],
		},
		twitter: {
			card: post.coverUrl ? "summary_large_image" : "summary",
			title: post.title,
			description: post.excerpt,
			images: post.coverUrl ? [post.coverUrl] : [],
		},
	};
}

export default async function ArticlePage({
	params,
}: {
	params: { slug: string };
}) {
	const row = await getPost(params.slug);

	if (!row?.published) notFound();
	const post = row.published as unknown as PublishedPost;
	const { content, headings } = prepareArticleHeadings(post.content);

	return (
		<div className="site-width py-12 sm:py-20">
			<div className="mx-auto mb-10 max-w-[800px]">
				<Link href="/writing" className="text-link text-sm">
					Back to writing
				</Link>
			</div>
			<div
				className={
					headings.length
						? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12"
						: ""
				}
			>
				{headings.length > 0 && (
					<div className="lg:col-start-2 lg:row-start-1 lg:self-start lg:sticky lg:top-28">
						<TableOfContents headings={headings} />
					</div>
				)}
				<div
					id="writing-article"
					className="min-w-0 lg:col-start-1 lg:row-start-1 [&_.ProseMirror_:is(h1,h2,h3)]:scroll-mt-28"
				>
					<Article
						post={{ ...post, content }}
						date={row.publishedAt}
					/>
				</div>
			</div>
		</div>
	);
}
