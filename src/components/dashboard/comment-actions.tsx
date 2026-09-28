"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CommentStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";

export default function CommentActions({
	id,
	status,
	reader,
}: {
	id: string;
	status: CommentStatus;
	reader: { id: string; banned: boolean } | null;
}) {
	const router = useRouter();
	const [busy, setBusy] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [error, setError] = useState("");

	async function send(url: string, method: string, body?: object) {
		setBusy(true);
		setError("");

		try {
			const res = await fetch(url, {
				method,
				...(body
					? {
							headers: { "content-type": "application/json" },
							body: JSON.stringify(body),
						}
					: {}),
			});
			const data = await res.json().catch(() => ({}));

			if (!res.ok) throw new Error(data.error || "Could not update.");
			setConfirming(false);
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not update.");
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="flex flex-col items-start gap-2 lg:items-end">
			<div className="flex flex-wrap gap-2">
				{status !== "DELETED" && (
					<Button
						variant="outline"
						size="sm"
						disabled={busy}
						onClick={() =>
							send("/api/comments/" + id, "PATCH", {
								status:
									status === "HIDDEN" ? "VISIBLE" : "HIDDEN",
							})
						}
					>
						{status === "HIDDEN" ? "Show" : "Hide"}
					</Button>
				)}
				{status !== "DELETED" &&
					(confirming ? (
						<Button
							variant="destructive"
							size="sm"
							disabled={busy}
							onClick={() =>
								send("/api/comments/" + id, "DELETE")
							}
						>
							Confirm delete
						</Button>
					) : (
						<Button
							variant="ghost"
							size="sm"
							disabled={busy}
							onClick={() => setConfirming(true)}
						>
							Delete
						</Button>
					))}
				{reader && (
					<Button
						variant="ghost"
						size="sm"
						disabled={busy}
						onClick={() =>
							send("/api/readers/" + reader.id, "PATCH", {
								banned: !reader.banned,
							})
						}
					>
						{reader.banned ? "Unban reader" : "Ban reader"}
					</Button>
				)}
			</div>
			{error && (
				<p role="alert" className="text-sm text-destructive">
					{error}
				</p>
			)}
		</div>
	);
}
