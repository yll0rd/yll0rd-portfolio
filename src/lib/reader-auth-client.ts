import { createAuthClient } from "better-auth/react";

export const readerAuthClient = createAuthClient({
	basePath: "/api/reader-auth",
});
