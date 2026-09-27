import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, databaseConfigured } from "@/lib/db";

export const sessionCookie =
  process.env.NODE_ENV === "production"
    ? "__Host-portfolio-session"
    : "portfolio-session";
export const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export async function getAdmin() {
  if (!databaseConfigured()) return null;
  const token = cookies().get(sessionCookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: tokenHash(token) },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, isAdmin: true },
  });
  return user?.isAdmin ? user : null;
}
export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/dashboard/login");
  return user;
}
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const previous = cookies().get(sessionCookie)?.value;
  if (previous)
    await db.session.deleteMany({ where: { tokenHash: tokenHash(previous) } });
  await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  await db.session.create({
    data: { tokenHash: tokenHash(token), userId, expiresAt },
  });
  cookies().set(sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}
