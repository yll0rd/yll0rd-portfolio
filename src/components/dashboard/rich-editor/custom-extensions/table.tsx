"use client";

import { Table as TiptapTable } from "@tiptap/extension-table";
import {
	NodeViewContent,
	type NodeViewProps,
	NodeViewWrapper,
	ReactNodeViewRenderer,
} from "@tiptap/react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const TableExtension = TiptapTable.extend({
	addNodeView: () => ReactNodeViewRenderer(CustomTable),
});

function CustomTable({
	editor,
	node,
	selected,
	deleteNode,
	getPos,
}: NodeViewProps) {
	function tableChain() {
		const position = getPos();
		const chain = editor.chain().focus();

		if (typeof position !== "number") return chain;
		const { from, to } = editor.state.selection;

		// Preserve the chosen cell; otherwise target this table's first cell.
		return from > position && to < position + node.nodeSize
			? chain
			: chain.setTextSelection(position + 3);
	}

	const actions = [
		{ label: "Add row", run: () => tableChain().addRowAfter().run() },
		{ label: "Remove row", run: () => tableChain().deleteRow().run() },
		{ label: "Add column", run: () => tableChain().addColumnAfter().run() },
		{
			label: "Remove column",
			run: () => tableChain().deleteColumn().run(),
		},
	];

	return (
		<NodeViewWrapper
			className={cn(
				"my-6 min-w-0 max-w-full rounded-md border border-border",
				selected && "ring-2 ring-secondary",
			)}
		>
			{editor.isEditable && (
				<div
					contentEditable={false}
					role="group"
					aria-label="Table controls"
					className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2 font-[family-name:var(--font-sans)] text-xs text-muted-foreground"
				>
					{actions.map(({ label, run }) => (
						<button
							key={label}
							type="button"
							onMouseDown={(event) => event.preventDefault()}
							onClick={run}
							className="min-h-10 rounded px-2 hover:bg-accent hover:text-primary"
						>
							{label}
						</button>
					))}
					<button
						type="button"
						aria-label="Delete table"
						onClick={() => {
							deleteNode();
							editor.commands.focus();
						}}
						className="flex size-10 items-center justify-center rounded text-destructive hover:bg-destructive/10"
					>
						<Trash2 size={16} aria-hidden />
					</button>
				</div>
			)}
			<div className="max-w-full overflow-x-auto">
				<NodeViewContent as="table" className="w-full" />
			</div>
		</NodeViewWrapper>
	);
}
