import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { publishedPost } from "@/lib/posts";
import type { PublishedPost } from "@/lib/blog-content";
import Article from "@/components/blog/article";

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

	return (
		<div className="site-width py-12 sm:py-20">
			<div className="mx-auto mb-10 max-w-[800px]">
				<Link href="/writing" className="text-link text-sm">
					Back to writing
				</Link>
			</div>
			<Article
				post={row.published as unknown as PublishedPost}
				date={row.publishedAt}
			/>
		</div>
	);
}
