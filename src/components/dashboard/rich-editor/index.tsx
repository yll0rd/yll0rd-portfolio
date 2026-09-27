"use client";

import { useRef, useState } from "react";
import {
	EditorRoot,
	EditorContent,
	EditorCommand,
	EditorCommandList,
	EditorCommandEmpty,
	EditorCommandItem,
	Command,
	createSuggestionItems,
	renderItems,
	handleCommandNavigation,
	type EditorInstance,
	type JSONContent,
} from "novel";
// @ts-ignore: Allow importing CSS side-effect without type declarations
import "./styles/prosemirror.css";
import { Code, Heading2, List, Quote, Type } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { safeHref } from "@/lib/blog-content";
import ImageUpload, { uploadImage } from "../image-upload";
import { defaultExtensions } from "./extensions";

const suggestions = createSuggestionItems([
	{
		title: "Text",
		description: "A plain paragraph",
		icon: <Type size={18} />,
		command: ({ editor, range }) =>
			editor.chain().focus().deleteRange(range).setParagraph().run(),
	},
	{
		title: "Heading",
		description: "A section heading",
		icon: <Heading2 size={18} />,
		command: ({ editor, range }) =>
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.setHeading({ level: 2 })
				.run(),
	},
	{
		title: "Bullet list",
		description: "A list of ideas",
		icon: <List size={18} />,
		command: ({ editor, range }) =>
			editor.chain().focus().deleteRange(range).toggleBulletList().run(),
	},
	{
		title: "Quote",
		description: "A quoted passage",
		icon: <Quote size={18} />,
		command: ({ editor, range }) =>
			editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
	},
	{
		title: "Code",
		description: "A code block",
		icon: <Code size={18} />,
		command: ({ editor, range }) =>
			editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
	},
]);

const readOnlyExtensions = defaultExtensions.filter(
	(extension) =>
		!["globalDragHandle", "autoJoiner", "placeholder"].includes(
			extension.name,
		),
);

const extensions = [
	...defaultExtensions,
	Command.configure({
		suggestion: { items: () => suggestions, render: renderItems },
	}),
];

export default function RichEditor({
	initialContent,
	editorClassName,
	onChange,
	disabled = false,
	notEditable = false,
}: {
	initialContent: JSONContent;
	editorClassName?: string;
	onChange?: (content: JSONContent) => void;
	disabled?: boolean;
	notEditable?: boolean;
}) {
	const editorRef = useRef<EditorInstance | null>(null);
	const changeRef = useRef(onChange);

	changeRef.current = onChange;
	const [editor, setEditor] = useState<EditorInstance | null>(null);
	const [uploadError, setUploadError] = useState("");
	const [uploading, setUploading] = useState(false);
	const [linkOpen, setLinkOpen] = useState(false);
	const [linkUrl, setLinkUrl] = useState("");

	const debouncedUpdates = useDebouncedCallback(
		(editor: EditorInstance) => changeRef.current?.(editor.getJSON()),
		800,
	);

	async function insertFile(file: File, position?: number) {
		setUploading(true);
		setUploadError("");

		try {
			const image = await uploadImage(file);
			const current = editorRef.current;

			if (!current || current.isDestroyed) return;

			if (position !== undefined)
				current
					.chain()
					.focus()
					.insertContentAt(
						Math.min(position, current.state.doc.content.size),
						{
							type: "image",
							attrs: { src: image.url, alt: "" },
						},
					)
					.run();
			else
				current
					.chain()
					.focus()
					.setImage({ src: image.url, alt: "" })
					.run();
		} catch (error) {
			setUploadError(
				error instanceof Error ? error.message : "Image upload failed.",
			);
		} finally {
			setUploading(false);
		}
	}

	const tools = [
		{
			name: "Bold",
			active: "bold",
			run: () => editor?.chain().focus().toggleBold().run(),
		},
		{
			name: "Italic",
			active: "italic",
			run: () => editor?.chain().focus().toggleItalic().run(),
		},
		{
			name: "Underline",
			active: "underline",
			run: () => editor?.chain().focus().toggleUnderline().run(),
		},
		{
			name: "Heading",
			active: "heading",
			run: () =>
				editor?.chain().focus().toggleHeading({ level: 2 }).run(),
		},
		{
			name: "List",
			active: "bulletList",
			run: () => editor?.chain().focus().toggleBulletList().run(),
		},
		{
			name: "Quote",
			active: "blockquote",
			run: () => editor?.chain().focus().toggleBlockquote().run(),
		},
		{
			name: "Code",
			active: "codeBlock",
			run: () => editor?.chain().focus().toggleCodeBlock().run(),
		},
	];

	return (
		<div>
			{!notEditable && (
				<div
					className="mb-6 flex flex-wrap items-center gap-1 border-y border-border py-3"
					role="group"
					aria-label="Text formatting"
				>
					{tools.map((tool) => (
						<button
							key={tool.name}
							type="button"
							disabled={!editor || disabled}
							aria-pressed={
								editor?.isActive(tool.active) || false
							}
							className="min-h-10 rounded px-3 text-xs hover:bg-accent aria-pressed:bg-accent disabled:opacity-50"
							onClick={tool.run}
						>
							{tool.name}
						</button>
					))}
					<button
						type="button"
						disabled={!editor || disabled}
						className="min-h-10 rounded px-3 text-xs hover:bg-accent"
						onClick={() => {
							setLinkUrl(
								String(
									editor?.getAttributes("link").href || "",
								),
							);
							setLinkOpen(!linkOpen);
						}}
					>
						Link
					</button>
					<button
						type="button"
						disabled={!editor || disabled}
						className="min-h-10 rounded px-3 text-xs hover:bg-accent"
						onClick={() => editor?.chain().focus().undo().run()}
					>
						Undo
					</button>
					<button
						type="button"
						disabled={!editor || disabled}
						className="min-h-10 rounded px-3 text-xs hover:bg-accent"
						onClick={() => editor?.chain().focus().redo().run()}
					>
						Redo
					</button>
				</div>
			)}
			{!notEditable && linkOpen && (
				<div className="mb-5 flex flex-wrap gap-2">
					<input
						aria-label="Link URL"
						value={linkUrl}
						onChange={(event) => setLinkUrl(event.target.value)}
						placeholder="https://..."
						className="min-w-0 flex-1 rounded border border-input bg-background px-3 py-2 text-sm"
					/>
					<button
						className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
						onClick={() => {
							if (!linkUrl)
								editor?.chain().focus().unsetLink().run();
							else if (safeHref(linkUrl))
								editor
									?.chain()
									.focus()
									.setLink({ href: linkUrl })
									.run();
							else {
								setUploadError(
									"Enter an http, https, or mailto URL.",
								);

								return;
							}

							setLinkOpen(false);
						}}
					>
						Apply
					</button>
				</div>
			)}
			<EditorRoot>
				<EditorContent
					initialContent={initialContent}
					extensions={notEditable ? readOnlyExtensions : extensions}
					immediatelyRender={false}
					editable={!disabled && !notEditable}
					onCreate={({ editor }) => {
						editorRef.current = editor;
						setEditor(editor);
					}}
					onUpdate={({ editor }) => {
						if (editor.isEditable) debouncedUpdates(editor);
					}}
					onDestroy={() => {
						editorRef.current = null;
					}}
					editorProps={{
						attributes: {
							class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none ${notEditable ? "max-w-none" : "min-h-[420px]"} ${editorClassName || ""}`,
							role: notEditable ? "document" : "textbox",
							"aria-label": "Article content",
							...(notEditable
								? {}
								: { "aria-multiline": "true" }),
						},
						handleDOMEvents: {
							keydown: (_view, event) =>
								!notEditable &&
								!disabled &&
								handleCommandNavigation(event),
						},
						handlePaste: (view, event) => {
							if (notEditable || disabled) return false;
							const file = Array.from(
								event.clipboardData?.files || [],
							).find((file) => file.type.startsWith("image/"));

							if (!file) return false;
							event.preventDefault();
							void insertFile(file, view.state.selection.from);

							return true;
						},
						handleDrop: (view, event, _slice, moved) => {
							if (notEditable || disabled) return false;

							if (moved) return false;
							const file = Array.from(
								event.dataTransfer?.files || [],
							).find((file) => file.type.startsWith("image/"));

							if (!file) return false;
							event.preventDefault();
							const pos = view.posAtCoords({
								left: event.clientX,
								top: event.clientY,
							})?.pos;

							void insertFile(file, pos);

							return true;
						},
					}}
				>
					{!notEditable && (
						<EditorCommand className="z-[60] max-h-72 w-[min(320px,80vw)] overflow-y-auto rounded-md border border-border bg-popover p-2 shadow-lg">
							<EditorCommandEmpty className="p-3 text-sm">
								No matching blocks.
							</EditorCommandEmpty>
							<EditorCommandList>
								{suggestions.map((item) => (
									<EditorCommandItem
										key={item.title}
										value={item.title}
										onCommand={item.command!}
										className="flex cursor-pointer items-center gap-3 rounded p-3 text-sm aria-selected:bg-accent"
									>
										{item.icon}
										<span>
											{item.title}
											<span className="block text-xs text-muted-foreground">
												{item.description}
											</span>
										</span>
									</EditorCommandItem>
								))}
							</EditorCommandList>
						</EditorCommand>
					)}
				</EditorContent>
			</EditorRoot>
			{!notEditable && (
				<div className="mt-8 border-t border-border pt-5">
					<ImageUpload
						disabled={disabled || uploading}
						label="Insert image"
						onUpload={(image) =>
							editorRef.current
								?.chain()
								.focus()
								.setImage({ src: image.url, alt: "" })
								.run()
						}
					/>
					<p className="mt-3 text-xs text-muted-foreground">
						You can also paste or drop an image into the article.
					</p>
				</div>
			)}
			{!notEditable && uploading && (
				<p role="status" className="mt-3 text-sm">
					Uploading image...
				</p>
			)}
			{!notEditable && uploadError && (
				<p role="alert" className="mt-3 text-sm text-destructive">
					{uploadError}
				</p>
			)}
		</div>
	);
}
