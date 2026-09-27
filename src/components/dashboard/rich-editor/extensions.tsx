import { StarterKit } from "@tiptap/starter-kit";
import { Heading } from "@tiptap/extension-heading";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Mathematics } from "@tiptap/extension-mathematics";
import { Youtube } from "@tiptap/extension-youtube";
import { TableCell, TableHeader, TableRow } from "@tiptap/extension-table";

import { cx } from "class-variance-authority";
import { Typography } from "@tiptap/extension-typography";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import AutoJoiner from "tiptap-extension-auto-joiner"; // optional
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Markdown } from "tiptap-markdown";
import { slugify } from "@/lib/utils";
import { mergeAttributes, type Editor } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { createLowlight, all } from "lowlight";
import { TableExtension as Table } from "./custom-extensions/table";
import { ImageExtension } from "./custom-extensions/image";
import { ImagePlaceholder } from "./custom-extensions/image-placeholder";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlockComponent from "./custom-extensions/enhanced-codeblock";

const placeholder = Placeholder.configure({
	placeholder: "Start typing here, or press '/' for blocks...",
});

const markdownExtension = Markdown.configure({
	html: true,
	tightLists: true,
	tightListClass: "tight",
	bulletListMarker: "-",
	linkify: false,
	breaks: false,
	transformPastedText: false,
	transformCopiedText: false,
});

const tableConfigs = [
	Table.configure({
		handleWidth: 5,
		cellMinWidth: 25,
		// resizable: true,
	}),
	TableRow,
	TableHeader,
	TableCell,
];

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
// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all);
const codeBlockLowlight = CodeBlockLowlight.extend({
	addNodeView() {
		return ReactNodeViewRenderer(CodeBlockComponent);
	},
}).configure({
	lowlight,
	defaultLanguage: "javascript",
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

// Clicking a formula in the editor lets the author change its LaTeX.
function editMath(
	editor: Editor,
	node: ProseMirrorNode,
	pos: number,
	type: "inline" | "block",
) {
	if (!editor.isEditable) return;
	const latex = window.prompt("Edit the LaTeX formula", node.attrs.latex);

	if (latex === null) return;
	const chain = editor.chain().setNodeSelection(pos);

	if (!latex.trim())
		(type === "inline"
			? chain.deleteInlineMath({ pos })
			: chain.deleteBlockMath({ pos })
		).run();
	else
		(type === "inline"
			? chain.updateInlineMath({ latex, pos })
			: chain.updateBlockMath({ latex, pos })
		).run();
}

const characterCount = CharacterCount.configure();

// Formula clicks need the editor instance, so extensions are created per editor.
export function createExtensions(getEditor: () => Editor | null) {
	const mathematics = Mathematics.configure({
		katexOptions: { throwOnError: false },
		inlineOptions: {
			onClick: (node, pos) => {
				const editor = getEditor();

				if (editor) editMath(editor, node, pos, "inline");
			},
		},
		blockOptions: {
			onClick: (node, pos) => {
				const editor = getEditor();

				if (editor) editMath(editor, node, pos, "block");
			},
		},
	});

	return [
		starterKit,
		CustomHeading.configure({
			levels: [1, 2, 3],
			HTMLAttributes: {
				class: "font-[family-name:var(--font-serif)]",
			},
		}),
		ImageExtension.configure({
			allowBase64: true,
			HTMLAttributes: {
				class: cx("rounded-lg border border-muted relative"),
			},
		}),
		ImagePlaceholder,
		codeBlockLowlight,
		Color,
		TextStyle,
		highlightExtension,
		placeholder,
		youTube,
		Typography,
		Subscript,
		Superscript,
		...tableConfigs,
		characterCount,
		mathematics,
		taskList,
		taskItem,
		markdownExtension,
		GlobalDragHandle.configure({
			dragHandleWidth: 20,
			scrollTreshold: 100,
		}),
		AutoJoiner.configure({
			elementsToJoin: ["bulletList", "orderedList"],
		}),
	];
}
