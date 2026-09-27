import "server-only";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";

export class HttpError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
	}
}
export function assertSameOrigin(request: Request) {
	const origin = request.headers.get("origin");
	const expected = process.env.APP_URL || new URL(request.url).origin;

	if (!origin || new URL(origin).origin !== new URL(expected).origin)
		throw new HttpError(403, "Request origin rejected.");
}

export async function adminRequest(request: Request, mutation = true) {
	if (mutation) assertSameOrigin(request);
	const user = await getAdmin();

	if (!user) throw new HttpError(401, "Your session expired. Sign in again.");

	return user;
}

export async function readJson(request: Request) {
	if (!request.headers.get("content-type")?.includes("application/json"))
		throw new HttpError(415, "Expected JSON.");

	if (Number(request.headers.get("content-length")) > 1_500_000)
		throw new HttpError(413, "This post is too large.");

	if (!request.body) throw new HttpError(400, "Missing request body.");
	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let size = 0;

	while (true) {
		const { done, value } = await reader.read();

		if (done) break;
		size += value.byteLength;

		if (size > 1_500_000) {
			await reader.cancel();
			throw new HttpError(413, "This post is too large.");
		}

		chunks.push(value);
	}

	const text = Buffer.concat(chunks).toString("utf8");

	try {
		return JSON.parse(text);
	} catch {
		throw new HttpError(400, "Invalid JSON.");
	}
}

export function apiError(error: unknown) {
	if (error instanceof HttpError)
		return NextResponse.json(
			{ error: error.message },
			{ status: error.status },
		);

	if (
		error &&
		typeof error === "object" &&
		"code" in error &&
		error.code === "P2002"
	)
		return NextResponse.json(
			{
				error: "That slug is already in use. Choose a different one and save again.",
			},
			{ status: 422 },
		);
	console.error(
		"Dashboard request failed:",
		error instanceof Error ? error.name : "Unknown error",
	);

	return NextResponse.json(
		{ error: "Could not complete the request. Please try again." },
		{ status: 500 },
	);
}

export const isObjectId = (id: string) => /^[a-f0-9]{24}$/i.test(id);
