import type { ReactNode } from "react";
import type { Editor, Range } from "@tiptap/core";
import { isValidYoutubeUrl } from "@tiptap/extension-youtube";
import {
	CheckSquare,
	Code,
	Heading1,
	Heading2,
	Heading3,
	ImageIcon,
	List,
	ListOrdered,
	Minus,
	Sigma,
	Table,
	Text,
	TextQuote,
	Youtube,
} from "lucide-react";

export type SlashCommandItem = {
	title: string;
	description: string;
	searchTerms: string[];
	icon: ReactNode;
	command: (props: { editor: Editor; range: Range }) => void;
};

type SlashItemOptions = {
	uploadImage: (file: File, position: number) => void;
};

export function createSlashItems({
	uploadImage,
}: SlashItemOptions): SlashCommandItem[] {
	return [
		{
			title: "Text",
			description: "Just start typing with plain text.",
			searchTerms: ["p", "paragraph"],
			icon: <Text size={18} />,
			command: ({ editor, range }) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.toggleNode("paragraph", "paragraph")
					.run(),
		},
		{
			title: "To-do List",
			description: "Track tasks with a to-do list.",
			searchTerms: ["todo", "task", "list", "check", "checkbox"],
			icon: <CheckSquare size={18} />,
			command: ({ editor, range }) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.toggleTaskList()
					.run(),
		},
		{
			title: "Heading 1",
			description: "Big section heading.",
			searchTerms: ["title", "big", "large", "h1"],
			icon: <Heading1 size={18} />,
			command: ({ editor, range }) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.setNode("heading", { level: 1 })
					.run(),
		},
		{
			title: "Heading 2",
			description: "Medium section heading.",
			searchTerms: ["subtitle", "medium", "h2"],
			icon: <Heading2 size={18} />,
			command: ({ editor, range }) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.setNode("heading", { level: 2 })
					.run(),
		},
		{
			title: "Heading 3",
			description: "Small section heading.",
			searchTerms: ["subtitle", "small", "h3"],
			icon: <Heading3 size={18} />,
			command: ({ editor, range }) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.setNode("heading", { level: 3 })
					.run(),
		},
		{
			title: "Bullet List",
			description: "Create a simple bullet list.",
			searchTerms: ["unordered", "point", "ul"],
			icon: <List size={18} />,
			command: ({ editor, range }) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.toggleBulletList()
					.run(),
		},
		{
			title: "Numbered List",
			description: "Create a list with numbering.",
			searchTerms: ["ordered", "ol"],
			icon: <ListOrdered size={18} />,
			command: ({ editor, range }) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.toggleOrderedList()
					.run(),
		},
		{
			title: "Quote",
			description: "Capture a quote.",
			searchTerms: ["blockquote", "citation"],
			icon: <TextQuote size={18} />,
			command: ({ editor, range }) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.toggleNode("paragraph", "paragraph")
					.toggleBlockquote()
					.run(),
		},
		{
			title: "Code",
			description: "Capture a code snippet.",
			searchTerms: ["codeblock", "snippet", "pre"],
			icon: <Code size={18} />,
			command: ({ editor, range }) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.toggleCodeBlock()
					.run(),
		},
		{
			title: "Table",
			description: "Organise information in rows and columns.",
			searchTerms: ["grid", "rows", "columns", "spreadsheet"],
			icon: <Table size={18} />,
			command: ({ editor, range }) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
					.run(),
		},
		{
			title: "Divider",
			description: "Separate sections with a line.",
			searchTerms: ["horizontal rule", "hr", "separator", "line"],
			icon: <Minus size={18} />,
			command: ({ editor, range }) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.setHorizontalRule()
					.run(),
		},
		{
			title: "Image",
			description: "Upload an image from your computer.",
			searchTerms: ["photo", "picture", "media", "upload"],
			icon: <ImageIcon size={18} />,
			command: ({ editor, range }) => {
				editor.chain().focus().deleteRange(range).run();
				// Upload at the slash position, even if the cursor moves while the picker is open.
				const position = editor.state.selection.from;
				const input = document.createElement("input");

				input.type = "file";
				input.accept = "image/*";
				input.onchange = () => {
					const file = input.files?.[0];

					if (file) uploadImage(file, position);
				};

				input.click();
			},
		},
		{
			title: "YouTube",
			description: "Embed a YouTube video.",
			searchTerms: ["video", "youtube", "embed"],
			icon: <Youtube size={18} />,
			command: ({ editor, range }) => {
				const link = window.prompt("Paste a YouTube link");

				if (link === null) return;

				if (!isValidYoutubeUrl(link)) {
					window.alert("Please enter a valid YouTube video link.");

					return;
				}

				editor
					.chain()
					.focus()
					.deleteRange(range)
					.setYoutubeVideo({ src: link })
					.run();
			},
		},
		{
			title: "Math",
			description: "Write an equation in LaTeX.",
			searchTerms: ["equation", "formula", "latex", "katex"],
			icon: <Sigma size={18} />,
			command: ({ editor, range }) => {
				const latex = window.prompt(
					"Enter a LaTeX formula",
					"E = mc^2",
				);

				if (!latex?.trim()) return;

				editor
					.chain()
					.focus()
					.deleteRange(range)
					.insertBlockMath({ latex })
					.run();
			},
		},
	];
}

export function filterSlashItems(items: SlashCommandItem[], query: string) {
	const search = query.trim().toLowerCase();

	if (!search) return items;

	return items.filter(
		(item) =>
			item.title.toLowerCase().includes(search) ||
			item.searchTerms.some((term) => term.includes(search)),
	);
}
