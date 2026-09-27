"use client";

import {
	forwardRef,
	useEffect,
	useId,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import type { SuggestionProps } from "@tiptap/suggestion";
import { cn } from "@/lib/utils";
import type { SlashCommandItem } from "./items";

export type SlashMenuHandle = {
	onKeyDown: (event: KeyboardEvent) => boolean;
};

type SlashMenuProps = SuggestionProps<SlashCommandItem, SlashCommandItem>;

export const SlashMenu = forwardRef<SlashMenuHandle, SlashMenuProps>(
	function SlashMenu({ items, command, editor }, ref) {
		const listId = useId();
		const [selected, setSelected] = useState(0);
		const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

		useEffect(() => setSelected(0), [items]);

		useEffect(() => {
			itemRefs.current[selected]?.scrollIntoView({ block: "nearest" });
		}, [selected]);

		// Focus stays in the editor, so point assistive technology at the highlighted option.
		useEffect(() => {
			const dom = editor.view.dom;

			dom.setAttribute("aria-controls", listId);

			if (items.length)
				dom.setAttribute(
					"aria-activedescendant",
					`${listId}-${selected}`,
				);
			else dom.removeAttribute("aria-activedescendant");

			return () => {
				dom.removeAttribute("aria-controls");
				dom.removeAttribute("aria-activedescendant");
			};
		}, [editor, items.length, listId, selected]);

		useImperativeHandle(ref, () => ({
			onKeyDown(event) {
				if (!items.length) return false;

				if (event.key === "ArrowUp") {
					setSelected((selected + items.length - 1) % items.length);

					return true;
				}

				if (event.key === "ArrowDown") {
					setSelected((selected + 1) % items.length);

					return true;
				}

				if (event.key === "Enter") {
					command(items[selected]);

					return true;
				}

				return false;
			},
		}));

		return (
			<div
				id={listId}
				role="listbox"
				aria-label="Insert block"
				className="max-h-[330px] w-72 max-w-[calc(100vw-32px)] overflow-y-auto rounded-md border border-border bg-popover px-1 py-2 text-popover-foreground shadow-md transition-all font-[family-name:var(--font-sans)]"
			>
				{items.length ? (
					items.map((item, index) => (
						<button
							key={item.title}
							id={`${listId}-${index}`}
							ref={(element) => {
								itemRefs.current[index] = element;
							}}
							type="button"
							role="option"
							tabIndex={-1}
							aria-selected={index === selected}
							// Keep the editor focused so the slash range stays valid.
							onMouseDown={(event) => event.preventDefault()}
							onMouseEnter={() => setSelected(index)}
							onClick={() => command(item)}
							className={cn(
								"flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm",
								index === selected &&
									"bg-accent text-accent-foreground",
							)}
						>
							<span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
								{item.icon}
							</span>
							<span className="min-w-0">
								<span className="block font-medium">
									{item.title}
								</span>
								<span className="block text-xs text-muted-foreground">
									{item.description}
								</span>
							</span>
						</button>
					))
				) : (
					<p className="px-2 py-1 text-sm text-muted-foreground">
						No matching blocks.
					</p>
				)}
			</div>
		);
	},
);
