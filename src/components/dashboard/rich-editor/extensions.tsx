import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Mathematics } from "@tiptap/extension-mathematics";

import { cx } from "class-variance-authority";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import AutoJoiner from "tiptap-extension-auto-joiner"; // optional
import { Markdown } from "tiptap-markdown";
import type { Editor } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { TableExtension as Table } from "./custom-extensions/table";
import { ImageExtension } from "./custom-extensions/image";
import { ImagePlaceholder } from "./custom-extensions/image-placeholder";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlockComponent from "./custom-extensions/enhanced-codeblock";
import {
	baseExtensions,
	codeBlockOptions,
	katexOptions,
} from "./base-extensions";

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

const table = Table.configure({
	handleWidth: 5,
	cellMinWidth: 25,
	// resizable: true,
});

const codeBlockLowlight = CodeBlockLowlight.extend({
	addNodeView() {
		return ReactNodeViewRenderer(CodeBlockComponent);
	},
}).configure(codeBlockOptions);

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
		katexOptions,
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
		...baseExtensions,
		ImageExtension.configure({
			allowBase64: true,
			HTMLAttributes: {
				class: cx("rounded-lg border border-muted relative"),
			},
		}),
		ImagePlaceholder,
		codeBlockLowlight,
		table,
		placeholder,
		characterCount,
		mathematics,
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
