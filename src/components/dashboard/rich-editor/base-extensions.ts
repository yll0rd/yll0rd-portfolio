// Extensions without React node views, shared by the editor and the server-rendered article.
import { StarterKit } from "@tiptap/starter-kit";
import { Heading } from "@tiptap/extension-heading";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Color, FontSize, TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Youtube } from "@tiptap/extension-youtube";
import { TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { Typography } from "@tiptap/extension-typography";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { mergeAttributes } from "@tiptap/core";
import { cx } from "class-variance-authority";
import { createLowlight, all } from "lowlight";
import { slugify } from "@/lib/utils";

// create a lowlight instance with all languages loaded
export const lowlight = createLowlight(all);
export const codeBlockOptions = { lowlight, defaultLanguage: "javascript" };
export const katexOptions = { throwOnError: false };

export const tableCellExtensions = [TableRow, TableHeader, TableCell];

const youTube = Youtube.configure({
	HTMLAttributes: {
		class: cx("w-full"),
	},
});

const taskList = TaskList.configure({
	HTMLAttributes: {
		class: cx("not-prose pl-2 "),
	},
});
const taskItem = TaskItem.configure({
	HTMLAttributes: {
		class: cx("flex gap-2 items-start my-4"),
	},
	nested: true,
});

const highlightExtension = Highlight.configure({
	multicolor: true,
});

// Headings carry an id so the article's table of contents can link to them.
const CustomHeading = Heading.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			id: {
				default: null,
				rendered: false,
				parseHTML: (element) => element.getAttribute("id"),
			},
		};
	},

	renderHTML({ node, HTMLAttributes }) {
		const hasLevel = this.options.levels.includes(node.attrs.level);
		const level = hasLevel ? node.attrs.level : this.options.levels[0];

		return [
			`h${level}`,
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				// Prefer the de-duplicated id from prepareArticleHeadings.
				id: node.attrs.id || slugify(node.textContent) || undefined,
			}),
			0,
		];
	},
});

const starterKit = StarterKit.configure({
	heading: false,
	codeBlock: false,
	bulletList: {
		HTMLAttributes: {
			class: cx("list-disc list-outside leading-3"),
		},
	},
	orderedList: {
		HTMLAttributes: {
			class: cx("list-decimal list-outside leading-3"),
		},
	},
	listItem: {
		HTMLAttributes: {
			class: cx("leading-normal -mb-2"),
		},
	},
	blockquote: {
		HTMLAttributes: {
			class: cx("border-l-4 border-primary"),
		},
	},
	code: {
		HTMLAttributes: {
			class: cx("rounded-md bg-muted px-1.5 py-1 font-mono font-medium"),
			spellcheck: "false",
		},
	},
	horizontalRule: {
		HTMLAttributes: {
			class: cx("mt-4 mb-6 border-t border-muted-foreground"),
		},
	},
	link: {
		openOnClick: false,
		HTMLAttributes: {
			class: cx(
				"text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
			),
		},
	},
	dropcursor: {
		color: "hsl(var(--secondary))",
		width: 4,
	},
	gapcursor: false,
});

export const baseExtensions = [
	starterKit,
	CustomHeading.configure({
		levels: [1, 2, 3],
		HTMLAttributes: {
			class: "font-[family-name:var(--font-serif)]",
		},
	}),
	Color,
	TextStyle,
	FontSize,
	highlightExtension,
	youTube,
	Typography,
	Subscript,
	Superscript,
	...tableCellExtensions,
	taskList,
	taskItem,
];
