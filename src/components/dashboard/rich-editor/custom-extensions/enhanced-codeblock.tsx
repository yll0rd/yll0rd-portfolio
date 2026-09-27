"use client";

import { useEffect, useRef, useState } from "react";
import {
	NodeViewWrapper,
	NodeViewContent,
	type NodeViewProps,
} from "@tiptap/react";
import { Check, Copy } from "lucide-react";

export default function CodeBlockComponent({ node }: NodeViewProps) {
	const [status, setStatus] = useState("");
	const timer = useRef<ReturnType<typeof setTimeout>>();

	useEffect(() => () => clearTimeout(timer.current), []);
	async function copyCode() {
		clearTimeout(timer.current);

		try {
			await navigator.clipboard.writeText(node.textContent);
			setStatus("Copied");
		} catch {
			setStatus("Could not copy. Select the code to copy it manually.");
		}

		timer.current = setTimeout(() => setStatus(""), 3000);
	}

	return (
		<NodeViewWrapper className="my-6 min-w-0 overflow-hidden rounded-md border border-border bg-muted/40 text-foreground">
			<div
				contentEditable={false}
				className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-1 font-[family-name:var(--font-sans)] text-xs text-muted-foreground"
			>
				<span>{node.attrs.language || "Plain text"}</span>
				<button
					type="button"
					aria-label="Copy code"
					onClick={copyCode}
					className="flex min-h-10 items-center gap-2 rounded px-2 hover:bg-accent hover:text-primary"
				>
					{status === "Copied" ? (
						<Check size={15} aria-hidden />
					) : (
						<Copy size={15} aria-hidden />
					)}
					{status === "Copied" ? "Copied" : "Copy code"}
				</button>
				<span role="status" className="sr-only">
					{status}
				</span>
			</div>
			<pre className="!m-0 max-h-[36rem] overflow-auto !rounded-none !border-0">
				<NodeViewContent as="code" />
			</pre>
		</NodeViewWrapper>
	);
}
