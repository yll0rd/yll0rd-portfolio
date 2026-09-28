import "server-only";
import { Resend } from "resend";

const escapeHtml = (value: string) =>
	value.replace(
		/[&<>"']/g,
		(char) =>
			({
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#39;",
			})[char] as string,
	);

const clip = (text: string, length: number) =>
	text.length > length ? text.slice(0, length) + "…" : text;

type Email = {
	to: string;
	subject: string;
	intro: string;
	body: string;
	inReplyTo?: string;
	links: [label: string, href: string][];
};

function render({ intro, body, inReplyTo, links }: Email) {
	const quote = (text: string, muted = false) =>
		`<blockquote style="margin:16px 0;padding-left:16px;border-left:2px solid ${muted ? "#D8DFE5" : "#92713A"};font-size:${muted ? 15 : 18}px;line-height:1.6;white-space:pre-line;color:${muted ? "#626D78" : "#252C33"}">${escapeHtml(text)}</blockquote>`;

	return {
		text: [
			intro,
			inReplyTo ? `In reply to:\n${inReplyTo}` : "",
			body,
			links.map(([label, href]) => `${label}: ${href}`).join("\n"),
		]
			.filter(Boolean)
			.join("\n\n"),
		html: `<div style="font-family:Georgia,serif;color:#252C33;max-width:560px">
<p style="font-family:Arial,sans-serif;font-size:13px;color:#626D78">${escapeHtml(intro)}</p>
${inReplyTo ? quote(inReplyTo, true) : ""}
${quote(body)}
<p style="font-family:Arial,sans-serif;font-size:14px">${links
			.map(
				([label, href]) =>
					`<a href="${escapeHtml(href)}" style="color:#243C53">${escapeHtml(label)}</a>`,
			)
			.join(" · ")}</p>
</div>`,
	};
}

/**
 * Emails the people a new comment concerns:
 * - a top-level comment or a reply to the owner → the owner
 * - a reply to a reader → that reader, and the owner
 * The owner is never emailed about their own comments, and nobody is emailed
 * about replying to themselves.
 */
export async function notifyCommentRecipients({
	commenter,
	target,
	postTitle,
	body,
	url,
}: {
	commenter: { name: string; isOwner: boolean; readerId: string | null };
	target: {
		authorName: string;
		isOwner: boolean;
		readerId: string | null;
		readerEmail: string | null;
		body: string;
	} | null;
	postTitle: string;
	body: string;
	url: string;
}) {
	const apiKey = process.env.RESEND_API_KEY;

	if (!apiKey) return;
	const owner = process.env.COMMENT_NOTIFY_TO?.trim();
	const title = `“${postTitle}”`;
	const excerpt = clip(body, 600);
	const inReplyTo = target ? clip(target.body, 280) : undefined;
	const emails: Email[] = [];

	if (owner && !commenter.isOwner)
		emails.push({
			to: owner,
			subject: !target
				? `${commenter.name} commented on ${title}`
				: target.isOwner
					? `${commenter.name} replied to you on ${title}`
					: `${commenter.name} replied to ${target.authorName} on ${title}`,
			intro: !target
				? `${commenter.name} commented on ${title}.`
				: target.isOwner
					? `${commenter.name} replied to your comment on ${title}.`
					: `${commenter.name} replied to ${target.authorName} on ${title}.`,
			body: excerpt,
			inReplyTo,
			links: [
				["Read the comment", url],
				[
					"Moderate comments",
					new URL("/dashboard/comments", url).toString(),
				],
			],
		});

	if (
		target?.readerEmail &&
		target.readerId !== commenter.readerId &&
		target.readerEmail.toLowerCase() !== owner?.toLowerCase()
	)
		emails.push({
			to: target.readerEmail,
			subject: `${commenter.name} replied to your comment on ${title}`,
			intro: `${commenter.name} replied to your comment on ${title}.`,
			body: excerpt,
			inReplyTo,
			links: [["Read the reply", url]],
		});

	if (!emails.length) return;
	const resend = new Resend(apiKey);
	const from =
		process.env.COMMENT_NOTIFY_FROM || "Comments <onboarding@resend.dev>";
	const results = await Promise.allSettled(
		emails.map(async (email) => {
			const { error } = await resend.emails.send({
				from,
				to: email.to,
				subject: email.subject,
				...render(email),
			});

			if (error) throw new Error(error.name);
		}),
	);
	const failed = results.filter((result) => result.status === "rejected");

	if (failed.length)
		throw new Error(
			`${failed.length} of ${emails.length} notification emails failed`,
		);
}
