"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ArticleHeading } from "@/lib/article-headings";
import { cn } from "@/lib/utils";

export default function TableOfContents({
	headings,
}: {
	headings: ArticleHeading[];
}) {
	const [active, setActive] = useState(headings[0]?.id || "");
	const disclosure = useRef<HTMLDetailsElement>(null);
	const minimumLevel = Math.min(...headings.map((heading) => heading.level));

	useEffect(() => {
		const article = document.getElementById("writing-article");

		if (!article || !headings.length) return;
		let frame = 0;
		let followedHash = false;
		const update = () => {
			frame = 0;
			let current = headings[0].id;

			for (const heading of headings) {
				const element = document.getElementById(heading.id);

				if (element && element.getBoundingClientRect().top <= 150)
					current = heading.id;
			}

			setActive(current);
		};

		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		const ready = () => {
			// The read-only editor mounts after hydration.
			if (!followedHash && window.location.hash) {
				const heading = headings.find(
					(item) => `#${item.id}` === window.location.hash,
				);
				const element = heading && document.getElementById(heading.id);

				if (element) {
					followedHash = true;
					element.scrollIntoView();
				}
			}

			schedule();
		};

		const observer = new MutationObserver(ready);

		observer.observe(article, { childList: true, subtree: true });
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		ready();

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
			cancelAnimationFrame(frame);
		};
	}, [headings]);

	if (!headings.length) return null;
	const links = (
		<ul className="border-l border-border">
			{headings.map((heading) => (
				<li key={heading.id}>
					<a
						href={`#${heading.id}`}
						aria-current={
							active === heading.id ? "location" : undefined
						}
						className={cn(
							"-ml-px flex min-h-11 items-center border-l-2 border-transparent py-2 pr-2 text-sm leading-relaxed transition-colors hover:text-primary",
							active === heading.id
								? "border-secondary font-medium text-primary"
								: "text-muted-foreground",
						)}
						style={{
							paddingLeft: `${16 + Math.max(0, heading.level - minimumLevel) * 12}px`,
						}}
						onClick={(event) => {
							if (
								event.metaKey ||
								event.ctrlKey ||
								event.shiftKey ||
								event.altKey
							)
								return;
							const target = document.getElementById(heading.id);

							if (!target) return;
							event.preventDefault();

							if (disclosure.current)
								disclosure.current.open = false;
							history.pushState(null, "", `#${heading.id}`);
							target.tabIndex = -1;
							target.focus({ preventScroll: true });
							target.scrollIntoView({
								behavior: matchMedia(
									"(prefers-reduced-motion: reduce)",
								).matches
									? "instant"
									: "smooth",
							});
							setActive(heading.id);
						}}
					>
						{heading.text}
					</a>
				</li>
			))}
		</ul>
	);

	return (
		<aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
			<nav aria-label="Table of contents" className="hidden lg:block">
				<p className="mb-5 text-xs font-medium uppercase tracking-[.12em] text-muted-foreground">
					On this page
				</p>
				<div className="max-h-[calc(100dvh-11rem)] overflow-y-auto overscroll-contain py-1 [overflow-wrap:anywhere]">
					{links}
				</div>
			</nav>
			<details
				ref={disclosure}
				className="group border-y border-border lg:hidden"
			>
				<summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-sm text-primary [&::-webkit-details-marker]:hidden">
					On this page
					<ChevronDown
						size={16}
						aria-hidden
						className="transition-transform group-open:rotate-180"
					/>
				</summary>
				<nav
					aria-label="Table of contents"
					className="max-h-[50dvh] overflow-y-auto pb-4 [overflow-wrap:anywhere]"
				>
					{links}
				</nav>
			</details>
		</aside>
	);
}
