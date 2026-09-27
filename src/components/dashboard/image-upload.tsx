"use client";

import { useRef, useState } from "react";
import { uploadFiles } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";

export type UploadedImage = { url: string; name: string };

export async function uploadImage(file: File): Promise<UploadedImage> {
	if (
		!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
			file.type,
		)
	)
		throw new Error("Choose a JPEG, PNG, WebP, or GIF image.");

	if (file.size > 4 * 1024 * 1024)
		throw new Error("Images must be 4 MB or smaller.");
	const files = await uploadFiles("blogImage", { files: [file] });
	const image = files[0]?.serverData;

	if (!image)
		throw new Error("The upload could not be confirmed. Try again.");

	return image;
}

export default function ImageUpload({
	onUpload,
	label = "Upload image",
	disabled = false,
}: {
	onUpload: (image: UploadedImage) => void;
	label?: string;
	disabled?: boolean;
}) {
	const input = useRef<HTMLInputElement>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");

	return (
		<div className="space-y-2">
			<input
				ref={input}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/gif"
				aria-label={label}
				className="sr-only"
				tabIndex={-1}
				onChange={async (event) => {
					const file = event.target.files?.[0];

					if (!file) return;
					setBusy(true);
					setError("");

					try {
						onUpload(await uploadImage(file));
					} catch (error) {
						setError(
							error instanceof Error
								? error.message
								: "Upload failed.",
						);
					} finally {
						setBusy(false);

						if (input.current) input.current.value = "";
					}
				}}
			/>
			<Button
				type="button"
				variant="outline"
				size="sm"
				disabled={busy || disabled}
				onClick={() => input.current?.click()}
			>
				{busy ? "Uploading..." : label}
			</Button>
			<p className="text-xs text-muted-foreground">
				JPEG, PNG, WebP or GIF. Up to 4 MB.
			</p>
			{error && (
				<p role="alert" className="text-sm text-destructive">
					{error}
				</p>
			)}
		</div>
	);
}
