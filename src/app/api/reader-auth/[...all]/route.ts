import { toNextJsHandler } from "better-auth/next-js";
import { readerAuth } from "@/lib/reader-auth";

export const { GET, POST } = toNextJsHandler(readerAuth);
