import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";
import { db, databaseConfigured } from "@/lib/db";

// Readers sign in with Google to comment. This is deliberately separate from
// the admin login in `@/lib/auth`: different models, cookies, and routes.
export const readerAuthBasePath = "/api/reader-auth";

export const readerAuthConfigured = () =>
	databaseConfigured() &&
	Boolean(
		process.env.BETTER_AUTH_SECRET &&
		process.env.GOOGLE_CLIENT_ID &&
		process.env.GOOGLE_CLIENT_SECRET,
	);

export const readerAuth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL || process.env.APP_URL,
	basePath: readerAuthBasePath,
	secret: process.env.BETTER_AUTH_SECRET,
	database: prismaAdapter(db, { provider: "mongodb" }),
	advanced: {
		cookiePrefix: "reader",
		// MongoDB ids come from Prisma's @default(auto()) ObjectIds.
		database: { generateId: false },
	},
	user: {
		modelName: "reader",
		additionalFields: {
			banned: {
				type: "boolean",
				required: false,
				defaultValue: false,
				input: false,
			},
		},
	},
	session: { modelName: "readerSession" },
	account: { modelName: "readerAccount", encryptOAuthTokens: true },
	verification: { modelName: "verification" },
	emailAndPassword: { enabled: false },
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
			prompt: "select_account",
		},
	},
});

export async function getReader() {
	if (!readerAuthConfigured()) return null;
	const session = await readerAuth.api.getSession({ headers: headers() });

	if (!session) return null;
	const { id, name, image, banned } = session.user;

	return { id, name, image: image ?? null, banned: Boolean(banned) };
}
