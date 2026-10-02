"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CommentNode } from "@/lib/comments";
import { readerAuthClient } from "@/lib/reader-auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const maxLength = 2000;

export type CommentViewer =
	| { kind: "admin"; name: string }
	| { kind: "reader"; name: string; image: string | null; banned: boolean }
	| null;

type Props = {
	slug: string;
	comments: CommentNode[];
	count: number;
	viewer: CommentViewer;
	enabled: boolean;
};

export default function Comments({
	slug,
	comments,
	count,
	viewer,
	enabled,
}: Props) {
	const router = useRouter();
	const [focusId, setFocusId] = useState<string | null>(null);
	const canPost = Boolean(
		enabled && viewer && !(viewer.kind === "reader" && viewer.banned),
	);

	useEffect(() => {
		if (!focusId) return;
		const element = document.getElementById("comment-" + focusId);

		if (!element) return;
		element.scrollIntoView({ block: "center" });
		element.focus({ preventScroll: true });
		setFocusId(null);
	}, [comments, focusId]);

	async function post(body: string, parentId?: string) {
		const res = await fetch("/api/comments", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ slug, body, parentId }),
		});
		const data = await res.json().catch(() => ({}));

		if (!res.ok)
			throw new Error(data.error || "Could not post your comment.");
		setFocusId(data.id);
		router.refresh();
	}

	return (
		<section
			id="comments"
			aria-labelledby="comments-title"
			className="mx-auto mt-20 max-w-[800px] scroll-mt-28 border-t border-border pt-12"
		>
			<p className="eyebrow !mb-3">Conversation</p>
			<h2 id="comments-title" className="editorial-title !mb-8">
				Comments
				{count > 0 && (
					<span className="ml-3 font-sans text-base text-muted-foreground">
						{count}
					</span>
				)}
			</h2>

			{!enabled ? (
				<p className="text-muted-foreground">
					Comments are unavailable right now.
				</p>
			) : (
				<ViewerPanel viewer={viewer} onPost={post} />
			)}

			{comments.length > 0 ? (
				<ol className="mt-12 space-y-10">
					{comments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							canReply={canPost}
							onPost={post}
						/>
					))}
				</ol>
			) : (
				enabled && (
					<p className="mt-10 [font-family:var(--font-serif),Georgia,serif] text-lg italic text-muted-foreground">
						No comments yet. Yours could be the first.
					</p>
				)
			)}
		</section>
	);
}

function ViewerPanel({
	viewer,
	onPost,
}: {
	viewer: CommentViewer;
	onPost: (body: string) => Promise<void>;
}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const signInFailed = searchParams.get("signin") === "failed";

	async function signIn() {
		setBusy(true);
		setError("");

		try {
			const { error } = await readerAuthClient.signIn.social({
				provider: "google",
				callbackURL: pathname + "#comments",
				errorCallbackURL: pathname + "?signin=failed#comments",
			});

			if (error) throw error;
		} catch (error) {
			console.error(error);
			setError("Could not reach Google. Try again.");
			setBusy(false);
		}
	}

	async function signOut() {
		setBusy(true);
		setError("");

		try {
			const { error } = await readerAuthClient.signOut();

			if (error) throw error;
			router.refresh();
		} catch {
			setError("Could not sign out. Try again.");
		} finally {
			setBusy(false);
		}
	}

	if (!viewer)
		return (
			<div className="rounded-md border border-border bg-card px-6 py-7 sm:px-8">
				<p className="[font-family:var(--font-serif),Georgia,serif] text-xl leading-snug text-primary">
					Have a thought on this piece?
				</p>
				<p className="mt-2 max-w-[520px] text-sm leading-relaxed text-muted-foreground">
					Sign in with Google to comment and reply. Only your name and
					profile photo appear beside what you write.
				</p>
				<Button
					variant="outline"
					onClick={signIn}
					disabled={busy}
					className="mt-6 h-11 px-5"
				>
					<GoogleMark />
					{busy ? "Opening Google…" : "Continue with Google"}
				</Button>
				{(error || signInFailed) && (
					<p role="alert" className="mt-4 text-sm text-destructive">
						{error || "Google sign-in didn’t finish. Try again."}
					</p>
				)}
			</div>
		);

	return (
		<div>
			<div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
				<div className="flex min-w-0 items-center gap-3 text-sm">
					<Avatar
						name={viewer.name}
						image={viewer.kind === "reader" ? viewer.image : null}
						isAuthor={viewer.kind === "admin"}
					/>
					<span className="min-w-0 truncate">
						<span className="text-muted-foreground">
							Commenting as{" "}
						</span>
						<span className="font-medium">{viewer.name}</span>
					</span>
					{viewer.kind === "admin" && <AuthorLabel />}
				</div>
				{viewer.kind === "reader" && (
					<button
						type="button"
						onClick={signOut}
						disabled={busy}
						className="min-h-11 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
					>
						Sign out
					</button>
				)}
			</div>
			{error && (
				<p role="alert" className="mb-4 text-sm text-destructive">
					{error}
				</p>
			)}
			{viewer.kind === "reader" && viewer.banned ? (
				<p className="rounded-md border border-border px-5 py-4 text-sm text-muted-foreground">
					This account can no longer comment on this site.
				</p>
			) : (
				<Composer
					label="Your comment"
					submitLabel="Post comment"
					placeholder="Share what this made you think about"
					onSubmit={(body) => onPost(body)}
				/>
			)}
		</div>
	);
}

function Composer({
	label,
	submitLabel,
	placeholder,
	initialValue = "",
	autoFocus,
	onSubmit,
	onCancel,
}: {
	label: string;
	submitLabel: string;
	placeholder: string;
	initialValue?: string;
	autoFocus?: boolean;
	onSubmit: (body: string) => Promise<void>;
	onCancel?: () => void;
}) {
	const id = useId();
	const ref = useRef<HTMLTextAreaElement>(null);
	const [body, setBody] = useState(initialValue);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const remaining = maxLength - body.length;

	useEffect(() => {
		if (!autoFocus || !ref.current) return;
		const end = ref.current.value.length;

		ref.current.focus();
		ref.current.setSelectionRange(end, end);
	}, [autoFocus]);

	async function submit(event?: React.FormEvent) {
		event?.preventDefault();

		if (busy) return;

		if (!body.trim()) {
			setError("Write something before posting.");

			return;
		}

		setBusy(true);
		setError("");

		try {
			await onSubmit(body);
			setBody("");
			onCancel?.();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Could not post your comment.",
			);
		} finally {
			setBusy(false);
		}
	}

	return (
		<form onSubmit={submit} noValidate>
			<label htmlFor={id} className="sr-only">
				{label}
			</label>
			<textarea
				id={id}
				ref={ref}
				value={body}
				maxLength={maxLength}
				rows={onCancel ? 3 : 4}
				placeholder={placeholder}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? id + "-error" : undefined}
				onChange={(event) => {
					setBody(event.target.value);

					if (error) setError("");
				}}
				onKeyDown={(event) => {
					if (
						event.key === "Enter" &&
						(event.metaKey || event.ctrlKey)
					)
						submit();

					if (event.key === "Escape" && onCancel) onCancel();
				}}
				className="block w-full resize-y rounded-md border border-input bg-card px-4 py-3 [font-family:var(--font-serif),Georgia,serif] text-lg leading-relaxed placeholder:text-muted-foreground/80 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-[invalid=true]:border-destructive"
			/>
			<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
				<p
					id={id + "-error"}
					role={error ? "alert" : undefined}
					className={cn(
						"text-sm",
						error ? "text-destructive" : "text-muted-foreground",
					)}
				>
					{error ||
						(remaining < 200
							? `${remaining} characters left`
							: "Plain text. Links become clickable.")}
				</p>
				<div className="flex items-center gap-2">
					{onCancel && (
						<Button
							type="button"
							variant="ghost"
							onClick={onCancel}
							disabled={busy}
							className="h-11"
						>
							Cancel
						</Button>
					)}
					<Button type="submit" disabled={busy} className="h-11 px-5">
						{busy ? "Posting…" : submitLabel}
					</Button>
				</div>
			</div>
		</form>
	);
}

function CommentItem({
	comment,
	canReply,
	onPost,
}: {
	comment: CommentNode;
	canReply: boolean;
	onPost: (body: string, parentId?: string) => Promise<void>;
}) {
	const router = useRouter();
	const [replying, setReplying] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const date = new Date(comment.createdAt);

	async function remove() {
		setBusy(true);
		setError("");

		try {
			const res = await fetch("/api/comments/" + comment.id, {
				method: "DELETE",
			});
			const data = await res.json().catch(() => ({}));

			if (!res.ok)
				throw new Error(data.error || "Could not delete the comment.");
			setConfirming(false);
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Could not delete the comment.",
			);
		} finally {
			setBusy(false);
		}
	}

	return (
		<li>
			<article
				id={"comment-" + comment.id}
				tabIndex={-1}
				aria-label={
					comment.author
						? `Comment by ${comment.author.name}`
						: "Removed comment"
				}
				className="-mx-3 scroll-mt-28 rounded-md px-3 py-2 outline-none transition-colors duration-700 target:bg-accent focus-visible:bg-accent motion-reduce:transition-none"
			>
				{comment.author ? (
					<>
						<header className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
							<Avatar
								name={comment.author.name}
								image={comment.author.image}
								isAuthor={comment.author.isAuthor}
							/>
							<span className="font-medium">
								{comment.author.name}
							</span>
							{comment.author.isAuthor && <AuthorLabel />}
							<time
								dateTime={comment.createdAt}
								className="text-xs text-muted-foreground"
							>
								{date.toLocaleDateString("en-GB", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</time>
						</header>
						<div className="mt-3 whitespace-pre-line break-words [font-family:var(--font-serif),Georgia,serif] text-lg leading-[1.65] sm:pl-11">
							<Linkified text={comment.body} />
						</div>
						<div className="mt-1 flex flex-wrap items-center gap-x-5 text-sm sm:pl-11">
							{canReply && !replying && (
								<button
									type="button"
									onClick={() => {
										setReplying(true);
										setConfirming(false);
									}}
									className="min-h-11 text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
								>
									Reply
								</button>
							)}
							{comment.canDelete &&
								(confirming ? (
									<span className="flex min-h-11 flex-wrap items-center gap-x-4">
										<span className="text-muted-foreground">
											Delete this comment?
										</span>
										<button
											type="button"
											onClick={remove}
											disabled={busy}
											className="font-medium text-destructive underline-offset-4 hover:underline disabled:opacity-50"
										>
											{busy ? "Deleting…" : "Delete"}
										</button>
										<button
											type="button"
											onClick={() => setConfirming(false)}
											disabled={busy}
											className="text-muted-foreground underline-offset-4 hover:underline"
										>
											Keep it
										</button>
									</span>
								) : (
									<button
										type="button"
										onClick={() => {
											setConfirming(true);
											setReplying(false);
										}}
										className="min-h-11 text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
									>
										Delete
									</button>
								))}
						</div>
						{error && (
							<p
								role="alert"
								className="text-sm text-destructive sm:pl-11"
							>
								{error}
							</p>
						)}
					</>
				) : (
					<p className="[font-family:var(--font-serif),Georgia,serif] text-lg italic text-muted-foreground">
						{comment.status === "DELETED"
							? "This comment was deleted."
							: "This comment was hidden by the author."}
					</p>
				)}
			</article>

			{replying && comment.author && (
				<div className="mt-4 sm:pl-11">
					<Composer
						autoFocus
						label={`Reply to ${comment.author.name}`}
						submitLabel="Post reply"
						placeholder={`Reply to ${comment.author.name}`}
						initialValue={
							comment.depth >= 2 ? `@${comment.author.name} ` : ""
						}
						onSubmit={(body) => onPost(body, comment.id)}
						onCancel={() => setReplying(false)}
					/>
				</div>
			)}

			{comment.replies.length > 0 && (
				<ol
					aria-label={`Replies${comment.author ? " to " + comment.author.name : ""}`}
					className="ml-4 mt-6 space-y-8 border-l border-secondary/60 pl-5 sm:ml-4 sm:pl-7"
				>
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
							canReply={canReply}
							onPost={onPost}
						/>
					))}
				</ol>
			)}
		</li>
	);
}

function Avatar({
	name,
	image,
	isAuthor,
}: {
	name: string;
	image: string | null;
	isAuthor: boolean;
}) {
	const [failed, setFailed] = useState(false);

	if (image && !failed)
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={image}
				alt=""
				width={32}
				height={32}
				referrerPolicy="no-referrer"
				onError={() => setFailed(true)}
				className="size-8 shrink-0 rounded-full bg-muted object-cover"
			/>
		);

	return (
		<span
			aria-hidden="true"
			className={cn(
				"grid size-8 shrink-0 place-items-center rounded-full [font-family:var(--font-serif),Georgia,serif] text-sm",
				isAuthor
					? "bg-primary text-primary-foreground"
					: "bg-muted text-muted-foreground",
			)}
		>
			{name.trim().charAt(0).toUpperCase() || "?"}
		</span>
	);
}

function AuthorLabel() {
	return (
		<span className="rounded-sm border border-secondary/50 px-1.5 py-0.5 text-[10px] font-medium uppercase leading-none tracking-[.12em] text-secondary">
			Author
		</span>
	);
}

const urlPattern = /(https?:\/\/[^\s<]+[^\s<.,:;"')\]!?])/g;

function Linkified({ text }: { text: string }) {
	return (
		<>
			{text.split(urlPattern).map((part, index) =>
				index % 2 ? (
					<a
						key={index}
						href={part}
						target="_blank"
						rel="nofollow ugc noopener noreferrer"
						className="break-all text-primary underline underline-offset-4"
					>
						{part}
					</a>
				) : (
					part
				),
			)}
		</>
	);
}

function GoogleMark() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="!size-[18px]">
			<path
				fill="#4285F4"
				d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
			/>
			<path
				fill="#34A853"
				d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24Z"
			/>
			<path
				fill="#FBBC05"
				d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11Z"
			/>
			<path
				fill="#EA4335"
				d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.53 11.53 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
			/>
		</svg>
	);
}
