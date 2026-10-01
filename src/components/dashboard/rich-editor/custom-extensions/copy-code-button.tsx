"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyCodeButton({ code }: { code: string }) {
	const [status, setStatus] = useState("");
	const timer = useRef<ReturnType<typeof setTimeout>>();

	useEffect(() => () => clearTimeout(timer.current), []);
	async function copyCode() {
		clearTimeout(timer.current);

		try {
			await navigator.clipboard.writeText(code);
			setStatus("Copied");
		} catch {
			setStatus("Could not copy. Select the code to copy it manually.");
		}

		timer.current = setTimeout(() => setStatus(""), 3000);
	}

	return (
		<>
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
		</>
	);
}
