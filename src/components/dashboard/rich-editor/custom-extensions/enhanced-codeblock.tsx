"use client";

import {
	NodeViewWrapper,
	NodeViewContent,
	type NodeViewProps,
} from "@tiptap/react";
import CopyCodeButton from "./copy-code-button";

export default function CodeBlockComponent({ node }: NodeViewProps) {
	return (
		<NodeViewWrapper className="my-6 min-w-0 overflow-hidden rounded-md border border-border bg-muted/40 text-foreground">
			<div
				contentEditable={false}
				className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-1 font-[family-name:var(--font-sans)] text-xs text-muted-foreground"
			>
				<span>{node.attrs.language || "Plain text"}</span>
				<CopyCodeButton code={node.textContent} />
			</div>
			<pre className="!m-0 max-h-[36rem] overflow-auto !rounded-none !border-0">
				<NodeViewContent<"code"> as="code" />
			</pre>
		</NodeViewWrapper>
	);
}
