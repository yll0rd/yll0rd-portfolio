"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import type { Editor, JSONContent } from "@tiptap/core";
// @ts-ignore: Allow importing CSS side-effect without type declarations
import "katex/dist/katex.min.css";
// @ts-ignore: Allow importing CSS side-effect without type declarations
import "./styles/prosemirror.css";
import { useDebouncedCallback } from "use-debounce";
import { safeHref } from "@/lib/blog-content";
import ImageUpload, { uploadImage } from "../image-upload";
import { createExtensions } from "./extensions";
import { SlashCommand, createSlashItems } from "./slash-command";

// Relative sizes follow the article's prose scale on every screen.
const textSizes = [
	{ name: "Small", value: "0.875em" },
	{ name: "Normal", value: null },
	{ name: "Large", value: "1.25em" },
];

const readOnlyExcluded = ["globalDragHandle", "autoJoiner", "placeholder"];

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
	const editorRef = useRef<Editor | null>(null);
	const changeRef = useRef(onChange);
	const insertFileRef = useRef(insertFile);

	changeRef.current = onChange;
	insertFileRef.current = insertFile;
	const [uploadError, setUploadError] = useState("");
	const [uploading, setUploading] = useState(false);
	const [linkOpen, setLinkOpen] = useState(false);
	const [linkUrl, setLinkUrl] = useState("");

	const debouncedUpdates = useDebouncedCallback(
		(editor: Editor) => changeRef.current?.(editor.getJSON()),
		800,
	);

	// Built once per editor; refs keep the callbacks current.
	const extensions = useMemo(() => {
		const base = createExtensions(() => editorRef.current);

		if (notEditable)
			return base.filter(
				(extension) => !readOnlyExcluded.includes(extension.name),
			);

		return [
			...base,
			SlashCommand.configure({
				items: createSlashItems({
					uploadImage: (file, position) =>
						void insertFileRef.current(file, position),
				}),
			}),
		];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const editor = useEditor({
		extensions,
		content: initialContent,
		immediatelyRender: false,
		editable: !disabled && !notEditable,
		onCreate: ({ editor }) => {
			editorRef.current = editor;
		},
		onUpdate: ({ editor }) => {
			if (editor.isEditable) debouncedUpdates(editor);
		},
		onDestroy: () => {
			editorRef.current = null;
		},
		editorProps: {
			attributes: {
				class: `prose prose-lg dark:prose-invert prose-headings:font-title prose-code:before:content-none prose-code:after:content-none font-default focus:outline-none ${notEditable ? "max-w-none" : "min-h-[420px]"} ${editorClassName || ""}`,
				role: notEditable ? "document" : "textbox",
				"aria-label": "Article content",
				...(notEditable ? {} : { "aria-multiline": "true" }),
			},
			handlePaste: (view, event) => {
				if (!view.editable) return false;
				const file = Array.from(event.clipboardData?.files || []).find(
					(file) => file.type.startsWith("image/"),
				);

				if (!file) return false;
				event.preventDefault();
				void insertFileRef.current(file, view.state.selection.from);

				return true;
			},
			handleDrop: (view, event, _slice, moved) => {
				if (!view.editable || moved) return false;
				const file = Array.from(event.dataTransfer?.files || []).find(
					(file) => file.type.startsWith("image/"),
				);

				if (!file) return false;
				event.preventDefault();
				const pos = view.posAtCoords({
					left: event.clientX,
					top: event.clientY,
				})?.pos;

				void insertFileRef.current(file, pos);

				return true;
			},
		},
	});

	useEffect(() => {
		editor?.setEditable(!disabled && !notEditable);
	}, [editor, disabled, notEditable]);

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

	// v3 does not re-render on every transaction, so subscribe to the toolbar state.
	const activeTools = useEditorState({
		editor,
		selector: ({ editor }) =>
			Object.fromEntries(
				tools.map((tool) => [
					tool.active,
					editor?.isActive(tool.active) ?? false,
				]),
			),
	});

	const activeSize = useEditorState({
		editor,
		selector: ({ editor }) =>
			(editor?.getAttributes("textStyle").fontSize as
				string | undefined) ?? null,
	});

	function setTextSize(value: string | null) {
		const chain = editor?.chain().focus();

		if (value) chain?.setFontSize(value).run();
		else chain?.unsetFontSize().run();
	}

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
							aria-pressed={activeTools?.[tool.active] ?? false}
							className="min-h-10 rounded px-3 text-xs hover:bg-accent aria-pressed:bg-accent disabled:opacity-50"
							onClick={tool.run}
						>
							{tool.name}
						</button>
					))}
					<div
						role="group"
						aria-label="Text size"
						className="flex items-center gap-1 border-x border-border px-1"
					>
						{textSizes.map((size) => (
							<button
								key={size.name}
								type="button"
								disabled={!editor || disabled}
								aria-pressed={
									(activeSize ?? null) === size.value
								}
								className="min-h-10 rounded px-3 text-xs hover:bg-accent aria-pressed:bg-accent disabled:opacity-50"
								onClick={() => setTextSize(size.value)}
							>
								{size.name}
							</button>
						))}
					</div>
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
			<EditorContent editor={editor} />
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
