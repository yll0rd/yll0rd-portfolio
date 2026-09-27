import {
	TiptapImage,
	TiptapLink,
	UpdatedImage,
	TaskList,
	TaskItem,
	HorizontalRule,
	StarterKit,
	Placeholder,
	AIHighlight,
	Color,
	TextStyle,
	TiptapUnderline,
	HighlightExtension,
	CodeBlockLowlight,
	UploadImagesPlugin,
	Mathematics,
	CharacterCount,
} from "novel";
import { Youtube } from "@tiptap/extension-youtube";
import { type HeadingOptions } from "@tiptap/extension-heading"

import { cx } from "class-variance-authority";
import { Typography } from "@tiptap/extension-typography";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import AutoJoiner from "tiptap-extension-auto-joiner"; // optional
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row';
import { Markdown } from 'tiptap-markdown';
import { slugify } from "@/lib/utils";
import { mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/core";
import { createLowlight, all } from 'lowlight';
import { TableExtension as Table } from "./custom-extensions/table";
import { ImageExtension } from "./custom-extensions/image";
import { ImagePlaceholder } from "./custom-extensions/image-placeholder";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlockComponent from "./custom-extensions/enhanced-codeblock";
const aiHighlight = AIHighlight;
const placeholder = Placeholder.configure({
	placeholder: "Start typing here...",
});

const tiptapLink = TiptapLink.configure({
	HTMLAttributes: {
		class: cx(
			"text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"
		),
	},
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

const tiptapImage = TiptapImage.extend({
	addProseMirrorPlugins() {
		return [
			UploadImagesPlugin({
				imageClass: cx("opacity-40 rounded-lg border border-border"),
			}),
		];
	},
}).configure({
	allowBase64: true,
	HTMLAttributes: {
		class: cx("rounded-lg border border-muted"),
	},
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
]

const updatedImage = UpdatedImage.configure({
	HTMLAttributes: {
		class: cx("rounded-lg border border-muted"),
	},
});

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

const horizontalRule = HorizontalRule.configure({
	HTMLAttributes: {
		class: cx("mt-4 mb-6 border-t border-muted-foreground"),
	},
});

const highlightExtension = HighlightExtension.configure({
	multicolor: true,
})
// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all)
const codeBlockLowlight = CodeBlockLowlight.extend({
	addNodeView() {
		return ReactNodeViewRenderer(CodeBlockComponent);
	}
}).configure({
	lowlight,
	defaultLanguage: 'javascript',
})

const CustomHeading = Node.create<HeadingOptions>({
	name: 'heading',

	addOptions() {
		return {
			levels: [1, 2, 3, 4, 5, 6],
			HTMLAttributes: {},
		}
	},

	content: 'inline*',

	group: 'block',

	defining: true,

	addAttributes() {
		return {
			level: {
				default: 1,
				rendered: false,
			},
			id: {
				default: null,
				rendered: true,
				parseHTML: element => element.getAttribute('id'),
				renderHTML: attributes => {
					if (!attributes.id) {
						return {}
					}
					return { id: attributes.id }
				},
			},
		}
	},

	parseHTML() {
		return this.options.levels
			.map((level: (1 | 2 | 3 | 4 | 5 | 6)) => ({
				tag: `h${level}`,
				attrs: { level },
			}))
	},

	renderHTML({ node, HTMLAttributes }) {
		// Get text content from the node
		const text = node.content.content
			.map(n => n.text || '')
			.join('')

		// Generate slug from text
		const id = slugify(text)

		const level = node.attrs.level
		const hasLevel = this.options.levels.includes(level)
		const tag = `h${hasLevel ? level : this.options.levels[0]}`

		return [tag, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { id }), 0]
	},

	addCommands() {
		return {
			setHeading: attributes => ({ commands }) => {
				if (!this.options.levels.includes(attributes.level)) {
					return false
				}

				return commands.setNode(this.name, attributes)
			},
			toggleHeading: attributes => ({ commands }) => {
				if (!this.options.levels.includes(attributes.level)) {
					return false
				}

				return commands.toggleNode(this.name, 'paragraph', attributes)
			},
		}
	},

	addKeyboardShortcuts() {
		return this.options.levels.reduce((items, level) => ({
			...items,
			...{
				[`Mod-Alt-${level}`]: () => this.editor.commands.toggleHeading({ level }),
			},
		}), {})
	},

	addInputRules() {
		return this.options.levels.map(level => {
			return textblockTypeInputRule({
				find: new RegExp(`^(#{${Math.min(...this.options.levels)},${level}})\\s$`),
				type: this.type,
				getAttributes: {
					level,
				},
			})
		})
	},
})

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
			class: cx("rounded-md bg-muted  px-1.5 py-1 font-mono font-medium"),
			spellcheck: "false",
		},
	},
	horizontalRule: false,
	dropcursor: {
		color: "hsl(var(--secondary))",
		width: 4,
	},
	gapcursor: false,
});

const mathematics = Mathematics.configure({
	HTMLAttributes: {
		class: cx("text-foreground rounded p-1 hover:bg-accent cursor-pointer"),
	},
	katexOptions: {
		throwOnError: false,
	},
});

const characterCount = CharacterCount.configure();


export const defaultExtensions = [
	starterKit,
	CustomHeading.configure({
		levels: [1, 2, 3],
		HTMLAttributes: {
			class: "font-[family-name:var(--font-serif)]",
		},
	}),
	ImageExtension.extend({
		addProseMirrorPlugins() {
			return [
				UploadImagesPlugin({
					imageClass: cx("opacity-40 rounded-lg border border-border"),
				})
			];
		},
	}).configure({
		allowBase64: true,
		HTMLAttributes: {
			class: cx("rounded-lg border border-muted relative"),
		},
	}),
	ImagePlaceholder,
	codeBlockLowlight,
	Color,
	TiptapUnderline,
	TextStyle,
	highlightExtension,
	placeholder,
	tiptapLink,
	// tiptapImage,
	youTube,
	Typography,
	Subscript,
	Superscript,
	// updatedImage,
	...tableConfigs,
	characterCount,
	mathematics,
	taskList,
	taskItem,
	horizontalRule,
	aiHighlight,
	markdownExtension,
	GlobalDragHandle.configure({
		dragHandleWidth: 20,
		scrollTreshold: 100,
	}),
	AutoJoiner.configure({
		elementsToJoin: ["bulletList", "orderedList"],
	}),
];