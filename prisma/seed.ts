import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

loadEnvConfig(process.cwd());
const db = new PrismaClient();

async function main() {
  if (await db.user.count()) {
    console.log("An account already exists. Nothing changed.");
    return;
  }
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (
    !username ||
    // !/^[a-z0-9._-]{3,64}$/.test(username) ||
    !password
    // password.length < 12
  ) {
    throw new Error(
      "Set ADMIN_USERNAME (3-64 letters, numbers, dots, underscores or hyphens) and ADMIN_PASSWORD (at least 12 characters).",
    );
  }
  await db.user.upsert({
    where: { singleton: "owner" },
    update: {},
    create: {
      singleton: "owner",
      username,
      passwordHash: await hashPassword(password),
      isAdmin: true,
    },
  });
  console.log(
    "Administrator seeded. Existing credentials are never overwritten.",
  );
}
main()
  .catch((e) => {
    console.error(e)
    console.error(
      "Seeding failed. Check the database connection and admin environment variables.",
    );
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
