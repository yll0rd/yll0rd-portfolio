import type { JSONContent } from "@tiptap/core";
import { slugify } from "@/lib/utils";

export type ArticleHeading = { id: string; text: string; level: number };

export function prepareArticleHeadings(content: JSONContent) {
	const headings: ArticleHeading[] = [];
	const used = new Set<string>();

	function textOf(node: JSONContent): string {
		return node.text || (node.content || []).map(textOf).join("");
	}

	function visit(node: JSONContent): JSONContent {
		const copy = { ...node };

		if (node.type === "heading") {
			const text = textOf(node).trim();
			const base = slugify(text) || "section";
			let id = base;
			let suffix = 2;

			while (used.has(id)) id = `${base}-${suffix++}`;
			used.add(id);
			copy.attrs = { ...node.attrs, id };

			if (text)
				headings.push({
					id,
					text,
					level: Number(node.attrs?.level) || 2,
				});
		}

		if (node.content) copy.content = node.content.map(visit);

		return copy;
	}

	return { content: visit(content), headings };
}
