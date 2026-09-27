import type { MetadataRoute } from "next";
import { publishedPosts } from "@/lib/posts";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await publishedPosts(49000);
  return [
    ...["", "/about", "/work", "/writing"].map((path) => ({
      url: "https://yll0rd.me" + path,
      changeFrequency: "monthly" as const,
      priority: path ? 0.8 : 1,
    })),
    ...posts.map((row) => ({
      url: "https://yll0rd.me/writing/" + row.slug,
      ...(row.publishedAt ? { lastModified: row.publishedAt } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
