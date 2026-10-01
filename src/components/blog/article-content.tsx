import type { ReactNode } from "react";
import type { JSONContent } from "@tiptap/core";
import { Table } from "@tiptap/extension-table";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Mathematics } from "@tiptap/extension-mathematics";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import katex from "katex";
import type { Root, RootContent } from "hast";
// @ts-ignore: Allow importing CSS side-effect without type declarations
import "katex/dist/katex.min.css";
// @ts-ignore: Allow importing CSS side-effect without type declarations
import "@/components/dashboard/rich-editor/styles/prosemirror.css";
import {
	baseExtensions,
	codeBlockOptions,
	katexOptions,
	lowlight,
} from "@/components/dashboard/rich-editor/base-extensions";
import { ImageBase } from "@/components/dashboard/rich-editor/custom-extensions/image-base";
import CopyCodeButton from "@/components/dashboard/rich-editor/custom-extensions/copy-code-button";
import { cn } from "@/lib/utils";

const extensions = [
	...baseExtensions,
	ImageBase,
	CodeBlockLowlight.configure(codeBlockOptions),
	Table,
	Mathematics.configure({ katexOptions }),
];

// Lowlight returns a hast tree; turn it into the same spans the editor decorates.
function hastToReact(nodes: (Root | RootContent)[]): ReactNode[] {
	return nodes.map((node, index) => {
		if (node.type === "text") return node.value;

		if (node.type !== "element" && node.type !== "root") return null;
		const children = hastToReact(node.children);

		if (node.type === "root") return children;
		const className = node.properties.className;

		return (
			<span
				key={index}
				className={
					Array.isArray(className) ? className.join(" ") : undefined
				}
			>
				{children}
			</span>
		);
	});
}

function highlight(code: string, language: string | null) {
	if (language && lowlight.registered(language))
		return hastToReact([lowlight.highlight(language, code)]);

	return hastToReact([lowlight.highlightAuto(code)]);
}

function math(latex: string, displayMode: boolean) {
	return katex.renderToString(latex || "", { ...katexOptions, displayMode });
}

// Renders the published article on the server so readers and crawlers get the full text.
export default function ArticleContent({ content }: { content: JSONContent }) {
	return (
		<div className="ProseMirror tiptap prose prose-lg max-w-none font-default dark:prose-invert prose-headings:font-title prose-code:before:content-none prose-code:after:content-none">
			{renderToReactElement({
				content,
				extensions,
				options: {
					nodeMapping: {
						image: ({ node }) => (
							<figure
								className={cn(
									"relative flex max-w-full flex-col rounded-md border-2 border-transparent",
									node.attrs.align === "left" && "mr-auto",
									node.attrs.align === "center" && "mx-auto",
									node.attrs.align === "right" && "ml-auto",
								)}
								style={{ width: node.attrs.width }}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={node.attrs.src}
									alt={node.attrs.alt ?? ""}
									title={node.attrs.title ?? undefined}
									loading="lazy"
									className="not-prose block h-auto w-full max-w-full rounded-lg border border-muted"
								/>
								{node.attrs.caption && (
									<figcaption className="not-prose mt-2 px-1 text-center font-[family-name:var(--font-sans)] text-sm leading-relaxed text-muted-foreground">
										{node.attrs.caption}
									</figcaption>
								)}
							</figure>
						),
						codeBlock: ({ node }) => (
							<div className="my-6 min-w-0 overflow-hidden rounded-md border border-border bg-muted/40 text-foreground">
								<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-1 font-[family-name:var(--font-sans)] text-xs text-muted-foreground">
									<span>
										{node.attrs.language || "Plain text"}
									</span>
									<CopyCodeButton code={node.textContent} />
								</div>
								<pre className="!m-0 max-h-[36rem] overflow-auto !rounded-none !border-0">
									<code>
										{highlight(
											node.textContent,
											node.attrs.language,
										)}
									</code>
								</pre>
							</div>
						),
						table: ({ children }) => (
							<div className="my-6 min-w-0 max-w-full rounded-md border border-border">
								<div className="max-w-full overflow-x-auto">
									<table className="w-full">
										<tbody>{children}</tbody>
									</table>
								</div>
							</div>
						),
						inlineMath: ({ node }) => (
							<span
								data-type="inline-math"
								dangerouslySetInnerHTML={{
									__html: math(node.attrs.latex, false),
								}}
							/>
						),
						blockMath: ({ node }) => (
							<div
								data-type="block-math"
								dangerouslySetInnerHTML={{
									__html: math(node.attrs.latex, true),
								}}
							/>
						),
					},
					// Editor-only nodes such as image placeholders are not shown to readers.
					unhandledNode: ({ children }) => children ?? null,
				},
			})}
		</div>
	);
}
