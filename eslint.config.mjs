import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierRecommended from "eslint-plugin-prettier/recommended";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	{
		ignores: [
			".next/**",
			"out/**",
			"build/**",
			"coverage/**",
			"node_modules/**",
			"next-env.d.ts",
			"playwright-report/**",
			"test-results/**",
		],
	},
	...compat.extends("next/core-web-vitals"),
	{
		rules: {
			"padding-line-between-statements": [
				"error",
				{ blankLine: "always", prev: "directive", next: "*" },
				{ blankLine: "always", prev: "import", next: "*" },
				{ blankLine: "any", prev: "import", next: "import" },
				// blank line after a group of declarations, but keep consecutive ones together
				{
					blankLine: "always",
					prev: ["const", "let", "var"],
					next: "*",
				},
				{
					blankLine: "any",
					prev: ["const", "let", "var"],
					next: ["const", "let", "var"],
				},
				// blank line before control flow and return, and after any block
				{
					blankLine: "always",
					prev: "*",
					next: ["if", "try", "for", "while", "switch", "return"],
				},
				{ blankLine: "always", prev: "block-like", next: "*" },
			],
		},
	},
	prettierRecommended,
];

export default eslintConfig;
