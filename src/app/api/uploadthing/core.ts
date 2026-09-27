import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin } from "@/lib/http";

const f = createUploadthing();

export const uploadRouter = {
	blogImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(async ({ req }) => {
			assertSameOrigin(req);
			const user = await getAdmin();

			if (!user)
				throw new UploadThingError(
					"Sign in as an administrator to upload images.",
				);

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			return { url: file.url, name: file.name };
		}),
} satisfies FileRouter;
export type UploadRouter = typeof uploadRouter;
