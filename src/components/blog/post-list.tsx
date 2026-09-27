import Link from "next/link";
import { readingMinutes, type PublishedPost } from "@/lib/blog-content";
export default function PostList({
  posts,
}: {
  posts: {
    id: string;
    slug: string;
    publishedAt: Date | null;
    post: PublishedPost;
  }[];
}) {
  return (
    <ul className="divide-y divide-border">
      {posts.map(({ id, slug, publishedAt, post }) => (
        <li key={id} className="py-8">
          <div className="flex gap-4 text-xs text-muted-foreground">
            {publishedAt && (
              <time dateTime={publishedAt.toISOString()}>
                {publishedAt.toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
            )}
            <span>{readingMinutes(post.content)} min read</span>
          </div>
          <Link
            href={"/writing/" + slug}
            className="mt-3 block text-primary hover:underline"
          >
            <h2 className="font-[family-name:var(--font-serif)] text-3xl leading-tight">
              {post.title}
            </h2>
          </Link>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          {!!post.tags.length && (
            <p className="mt-4 text-xs text-muted-foreground">
              {post.tags.join(" · ")}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
