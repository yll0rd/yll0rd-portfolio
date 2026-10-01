import {
	type PublishedPost,
	readingMinutes,
	safeImage,
} from "@/lib/blog-content";
import ArticleContent from "@/components/blog/article-content";

export default function Article({
	post,
	date,
}: {
	post: PublishedPost;
	date?: Date | null;
}) {
	return (
		<article className="mx-auto max-w-[800px]">
			<header className="mb-10">
				<div className="mb-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
					{date && (
						<time dateTime={date.toISOString()}>
							{date.toLocaleDateString("en-GB", {
								year: "numeric",
								month: "long",
								day: "numeric",
								timeZone: "UTC",
							})}
						</time>
					)}
					<span>{readingMinutes(post.content)} min read</span>
				</div>
				<h1 className="page-title !text-[clamp(36px,5vw,60px)]">
					{post.title || "Untitled post"}
				</h1>
				{post.excerpt && (
					<p className="mt-6 text-lg leading-relaxed text-muted-foreground">
						{post.excerpt}
					</p>
				)}
				<p className="mt-6 text-sm">By Youmbi Leo</p>
				{!!post.tags.length && (
					<ul
						aria-label="Tags"
						className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground"
					>
						{post.tags.map((tag) => (
							<li key={tag}>{tag}</li>
						))}
					</ul>
				)}
			</header>
			{post.coverUrl && safeImage(post.coverUrl) && (
				<img
					src={post.coverUrl}
					alt={`${post.title || "Untitled post"} cover image`}
					className="mb-12 max-h-[520px] w-full rounded-md object-cover"
				/>
			)}
			<ArticleContent content={post.content} />
		</article>
	);
}
