import { NextResponse } from "next/server";
import { db, databaseConfigured } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";
import { apiError, assertSameOrigin, HttpError, readJson } from "@/lib/http";

export const runtime = "nodejs";
let dummyHash: Promise<string> | undefined;

export async function POST(request: Request) {
	try {
		assertSameOrigin(request);

		if (!databaseConfigured())
			throw new HttpError(
				503,
				"The dashboard database has not been configured.",
			);
		const body = await readJson(request);

		if (!body || typeof body !== "object")
			throw new HttpError(400, "Enter a valid username and password.");
		const username =
			typeof body.username === "string"
				? body.username.trim().toLowerCase()
				: "";
		const password = typeof body.password === "string" ? body.password : "";

		if (
			!/^[a-z0-9._-]{3,64}$/.test(username) ||
			!password ||
			password.length > 256
		)
			throw new HttpError(400, "Enter a valid username and password.");
		// One administrator: a shared database counter also works across app instances.
		const now = new Date();
		const cutoff = new Date(Date.now() - 15 * 60 * 1000);

		await db.loginThrottle.upsert({
			where: { id: "admin-login" },
			create: { id: "admin-login", attempts: 0, windowStart: now },
			update: {},
		});
		await db.loginThrottle.updateMany({
			where: { id: "admin-login", windowStart: { lt: cutoff } },
			data: { attempts: 0, windowStart: now },
		});
		const quota = await db.loginThrottle.updateMany({
			where: { id: "admin-login", attempts: { lt: 10 } },
			data: { attempts: { increment: 1 } },
		});

		if (!quota.count)
			throw new HttpError(
				429,
				"Too many sign-in attempts. Try again in 15 minutes.",
			);
		const user = await db.user.findUnique({ where: { username } });

		dummyHash ??= hashPassword("unusable-dummy-password");
		const valid = await verifyPassword(
			password,
			user?.passwordHash ?? (await dummyHash),
		);

		if (!valid || !user?.isAdmin)
			throw new HttpError(401, "Incorrect username or password.");
		await createSession(user.id);
		await db.loginThrottle.update({
			where: { id: "admin-login" },
			data: { attempts: 0 },
		});

		return NextResponse.json(
			{ ok: true },
			{ headers: { "Cache-Control": "no-store" } },
		);
	} catch (error) {
		return apiError(error);
	}
}
