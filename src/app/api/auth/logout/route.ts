import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessionCookie, tokenHash } from "@/lib/auth";
import { apiError, assertSameOrigin } from "@/lib/http";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const token = cookies().get(sessionCookie)?.value;
    if (token)
      await db.session.deleteMany({ where: { tokenHash: tokenHash(token) } });
    cookies().delete(sessionCookie);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
