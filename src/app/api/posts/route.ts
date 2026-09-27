import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminRequest, apiError } from "@/lib/http";
import { emptyContent } from "@/lib/blog-content";
import { asJson } from "@/lib/posts";

export async function POST(request: Request) {
	try {
		const user = await adminRequest(request);
		const post = await db.blog.create({
			data: {
				title: "",
				slug: "untitled-" + randomBytes(6).toString("hex"),
				content: asJson(emptyContent),
				tags: [],
				authorId: user.id,
			},
		});

		return NextResponse.json({ id: post.id }, { status: 201 });
	} catch (error) {
		return apiError(error);
	}
}
