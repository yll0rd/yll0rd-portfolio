"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewPostButton() {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	async function create() {
		setBusy(true);
		setError("");

		try {
			const response = await fetch("/api/posts", { method: "POST" });
			const result = await response.json();

			if (!response.ok) throw new Error(result.error);
			router.push("/dashboard/posts/" + result.id);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Could not create a post.",
			);
			setBusy(false);
		}
	}

	return (
		<div>
			<Button onClick={create} disabled={busy}>
				<Plus size={16} className="mr-2" />
				{busy ? "Creating..." : "New post"}
			</Button>
			{error && (
				<p
					role="alert"
					className="mt-2 max-w-xs text-sm text-destructive"
				>
					{error}
				</p>
			)}
		</div>
	);
}
