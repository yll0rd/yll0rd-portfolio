import { createRequire } from "node:module";
import { spawn } from "node:child_process";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const child = spawn(
	process.execPath,
	[require.resolve("prisma/build/index.js"), ...process.argv.slice(2)],
	{ stdio: "inherit", env: process.env, windowsHide: true },
);

child.on("error", () => {
	console.error("Could not run Prisma.");
	process.exitCode = 1;
});
child.on("exit", (code) => {
	process.exitCode = code ?? 1;
});
