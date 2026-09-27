import { z } from "zod";
import { type JSONContent } from "novel";

export function safeHref(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    return ["https:", "http:", "mailto:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}
export function safeImage(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "utfs.io" || url.hostname.endsWith(".ufs.sh"))
    );
  } catch {
    return false;
  }
}

const JSONContentSchema: z.ZodType<JSONContent> = z.lazy(() =>
  z.object(
    {
      type: z.string().optional(),
      attrs: z.record(z.string(), z.any()).optional(),
      content: z.array(JSONContentSchema).optional(),
      marks: z
        .array(
          z.object({
            type: z.string(),
            attrs: z.record(z.string(), z.any()).optional(),
          }),
        )
        .optional(),
      text: z.string().optional(),
    },
    "The article contains unsupported or invalid content.",
  ),
);

export const draftSchema = z.object({
  title: z.string().max(180),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase words separated by hyphens.",
    ),
  excerpt: z.string().max(500),
  content: JSONContentSchema,
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
  seoTitle: z.string().max(80),
  seoDescription: z.string().max(200),
  coverUrl: z.string().nullable(),
});

export type Draft = z.infer<typeof draftSchema>;
export type PublishedPost = Draft & { coverUrl: string | null };
export const emptyContent: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function contentText(node: JSONContent): string {
  return [node.text || "", ...(node.content || []).map(contentText)]
    .filter(Boolean)
    .join(" ");
}

export function imageUrls(node: JSONContent): string[] {
  return [
    ...(node.type === "image" ? [String(node.attrs?.src)] : []),
    ...(node.content || []).flatMap(imageUrls),
  ];
}

export function readingMinutes(content: JSONContent) {
  return Math.max(
    1,
    Math.ceil(
      contentText(content).trim().split(/\s+/).filter(Boolean).length / 220,
    ),
  );
}

export function publicationErrors(draft: Draft) {
  const errors: string[] = [];
  if (!draft.title.trim()) errors.push("Add a title.");
  if (!draft.excerpt.trim()) errors.push("Add an excerpt.");
  if (!contentText(draft.content).trim())
    errors.push("Write some article content.");
  return errors;
}
