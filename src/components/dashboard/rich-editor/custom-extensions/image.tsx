"use client";

import { Image } from "@tiptap/extension-image";

import {
	type NodeViewProps,
	NodeViewWrapper,
	ReactNodeViewRenderer,
} from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight, Trash } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const ImageExtension = Image.extend({
	addAttributes() {
		return {
			src: {
				default: null,
			},
			alt: {
				default: null,
			},
			title: {
				default: null,
			},
			width: {
				default: "100%",
			},
			height: {
				default: null,
			},
			align: {
				default: "center",
			},
			caption: {
				default: null,
				parseHTML: (element) => element.getAttribute("data-caption"),
				renderHTML: (attributes) =>
					attributes.caption
						? { "data-caption": attributes.caption }
						: {},
			},
		};
	},

	addNodeView: () => {
		return ReactNodeViewRenderer(TiptapImage);
	},
});

function TiptapImage(props: NodeViewProps) {
	const { node, editor, selected, deleteNode, updateAttributes, getPos } =
		props;
	const imageRef = useRef<HTMLImageElement | null>(null);
	const nodeRef = useRef<HTMLElement | null>(null);
	const captionRef = useRef<HTMLTextAreaElement | null>(null);
	const caption: string = node.attrs.caption ?? "";
	const [resizing, setResizing] = useState(false);
	const [resizingPosition, setResizingPosition] = useState<"left" | "right">(
		"left",
	);
	const [resizeInitialWidth, setResizeInitialWidth] = useState(0);
	const [resizeInitialMouseX, setResizeInitialMouseX] = useState(0);

	function handleResizingPosition({
		e,
		position,
	}: {
		e: React.MouseEvent<HTMLDivElement, MouseEvent>;
		position: "left" | "right";
	}) {
		startResize(e);
		setResizingPosition(position);
	}

	function startResize(event: React.MouseEvent<HTMLDivElement>) {
		event.preventDefault();

		setResizing(true);

		setResizeInitialMouseX(event.clientX);

		if (imageRef.current) {
			setResizeInitialWidth(imageRef.current.offsetWidth);
		}
	}

	function resize(event: MouseEvent) {
		if (!resizing) {
			return;
		}

		let dx = event.clientX - resizeInitialMouseX;

		if (resizingPosition === "left") {
			dx = resizeInitialMouseX - event.clientX;
		}

		const newWidth = Math.max(resizeInitialWidth + dx, 150); // Minimum width: 150
		const parentWidth = nodeRef.current?.parentElement?.offsetWidth || 0; // Get the parent element's width

		if (newWidth < parentWidth) {
			updateAttributes({
				width: newWidth,
			});
		}
	}

	function endResize() {
		setResizing(false);
		setResizeInitialMouseX(0);
		setResizeInitialWidth(0);
	}

	function handleTouchStart(
		event: React.TouchEvent,
		position: "left" | "right",
	) {
		event.preventDefault();

		setResizing(true);
		setResizingPosition(position);

		setResizeInitialMouseX(event.touches[0].clientX);

		if (imageRef.current) {
			setResizeInitialWidth(imageRef.current.offsetWidth);
		}
	}

	function handleTouchMove(event: TouchEvent) {
		if (!resizing) {
			return;
		}

		let dx = event.touches[0].clientX - resizeInitialMouseX;

		if (resizingPosition === "left") {
			dx = resizeInitialMouseX - event.touches[0].clientX;
		}

		const newWidth = Math.max(resizeInitialWidth + dx, 150);
		const parentWidth = nodeRef.current?.parentElement?.offsetWidth || 0;

		if (newWidth < parentWidth) {
			updateAttributes({
				width: newWidth,
			});
		}
	}

	function handleTouchEnd() {
		setResizing(false);
		setResizeInitialMouseX(0);
		setResizeInitialWidth(0);
	}

	function handleCaptionKeyDown(
		event: React.KeyboardEvent<HTMLTextAreaElement>,
	) {
		// Captions stay on one line; Enter returns to writing below the image.
		if (event.key !== "Enter") {
			return;
		}

		event.preventDefault();

		const position = getPos();

		if (typeof position === "number") {
			editor.commands.focus(position + node.nodeSize);
		}
	}

	// Grow the caption field with its text instead of scrolling inside it.
	useLayoutEffect(() => {
		const field = captionRef.current;

		if (!field) {
			return;
		}

		field.style.height = "auto";
		field.style.height = `${field.scrollHeight}px`;
	}, [caption, node.attrs.width]);

	useEffect(() => {
		// Mouse events
		window.addEventListener("mousemove", resize);
		window.addEventListener("mouseup", endResize);
		// Touch events
		window.addEventListener("touchmove", handleTouchMove);
		window.addEventListener("touchend", handleTouchEnd);

		return () => {
			window.removeEventListener("mousemove", resize);
			window.removeEventListener("mouseup", endResize);
			window.removeEventListener("touchmove", handleTouchMove);
			window.removeEventListener("touchend", handleTouchEnd);
		};
	}, [
		resizing,
		resizingPosition,
		resizeInitialMouseX,
		resizeInitialWidth,
		updateAttributes,
	]);

	return (
		<NodeViewWrapper
			as="figure"
			ref={nodeRef}
			className={cn(
				// Saved widths are pixels from a wide editor; cap them to the column.
				"relative flex max-w-full flex-col rounded-md border-2 border-transparent",
				selected ? "border-secondary" : "",
				node.attrs.align === "left" && "mr-auto",
				node.attrs.align === "center" && "mx-auto",
				node.attrs.align === "right" && "ml-auto",
			)}
			style={{ width: node.attrs.width }}
		>
			<div className="group relative flex flex-col rounded-md">
				<img
					ref={imageRef}
					src={node.attrs.src}
					alt={node.attrs.alt}
					title={node.attrs.title}
					className="not-prose block h-auto w-full max-w-full"
				/>

				{editor?.isEditable && !!imageRef.current && (
					<>
						<div
							className="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-start p-2"
							style={{ left: 0 }}
							onMouseDown={(event) => {
								handleResizingPosition({
									e: event,
									position: "left",
								});
							}}
							onTouchStart={(event) =>
								handleTouchStart(event, "left")
							}
						>
							<div className="z-20 h-[70px] w-1 rounded-xl border bg-primary/70 opacity-60 transition-opacity group-hover:opacity-100" />
						</div>
						<div
							className="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-end p-2"
							style={{ right: 0 }}
							onMouseDown={(event) => {
								handleResizingPosition({
									e: event,
									position: "right",
								});
							}}
							onTouchStart={(event) =>
								handleTouchStart(event, "right")
							}
						>
							<div className="z-20 h-[70px] w-1 rounded-xl border bg-primary/70 opacity-60 transition-opacity group-hover:opacity-100" />
						</div>
						<div
							className={cn(
								"absolute right-2 top-2 flex items-center gap-1 rounded-md border bg-background p-1 opacity-0 transition-opacity font-[family-name:var(--font-sans)] text-foreground",
								!resizing && "group-hover:opacity-100",
							)}
						>
							<Button
								type="button"
								size="icon"
								aria-pressed={node.attrs.align === "left"}
								className={cn(
									"size-7",
									node.attrs.align === "left" && "bg-accent",
								)}
								variant="ghost"
								onClick={() => {
									updateAttributes({
										align: "left",
									});
								}}
							>
								<AlignLeft
									aria-hidden="true"
									className="size-4"
								/>
								<span className="sr-only">
									Align image left
								</span>
							</Button>
							<Button
								type="button"
								size="icon"
								aria-pressed={node.attrs.align === "center"}
								className={cn(
									"size-7",
									node.attrs.align === "center" &&
										"bg-accent",
								)}
								variant="ghost"
								onClick={() => {
									updateAttributes({
										align: "center",
									});
								}}
							>
								<AlignCenter
									aria-hidden="true"
									className="size-4"
								/>
								<span className="sr-only">
									Align image center
								</span>
							</Button>
							<Button
								type="button"
								size="icon"
								aria-pressed={node.attrs.align === "right"}
								className={cn(
									"size-7",
									node.attrs.align === "right" && "bg-accent",
								)}
								variant="ghost"
								onClick={() => {
									updateAttributes({
										align: "right",
									});
								}}
							>
								<AlignRight
									aria-hidden="true"
									className="size-4"
								/>
								<span className="sr-only">
									Align image right
								</span>
							</Button>
							<Separator
								orientation="vertical"
								className="h-[20px]"
							/>
							<Button
								type="button"
								size="icon"
								className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive focus:text-destructive"
								variant="ghost"
								onClick={() => {
									deleteNode();
									editor.commands.focus();
								}}
							>
								<Trash aria-hidden="true" className="size-4" />
								<span className="sr-only">Delete image</span>
							</Button>
						</div>
					</>
				)}
			</div>

			{editor?.isEditable ? (
				<figcaption className="not-prose mt-2">
					<textarea
						ref={captionRef}
						rows={1}
						value={caption}
						placeholder="Add a caption (optional)"
						aria-label="Image caption"
						spellCheck
						onChange={(event) => {
							updateAttributes({
								caption:
									event.target.value.replace(/\n/g, " ") ||
									null,
							});
						}}
						onKeyDown={handleCaptionKeyDown}
						className="block w-full resize-none overflow-hidden rounded-sm border-b border-transparent bg-transparent px-1 py-1 text-center font-[family-name:var(--font-sans)] text-sm leading-relaxed text-muted-foreground transition-colors placeholder:text-muted-foreground/60 hover:border-border focus:border-secondary"
					/>
				</figcaption>
			) : (
				caption && (
					<figcaption className="not-prose mt-2 px-1 text-center font-[family-name:var(--font-sans)] text-sm leading-relaxed text-muted-foreground">
						{caption}
					</figcaption>
				)
			)}
		</NodeViewWrapper>
	);
}
