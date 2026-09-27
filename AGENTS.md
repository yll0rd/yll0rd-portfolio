# Repository Guidelines

## Brand and Design

Before editing visual design, public-facing copy, imagery, navigation, or article presentation, read [BRAND.md](BRAND.md). It documents the portfolio’s identity, current theme tokens, typography, responsive patterns, and accessibility expectations. Follow it for additions and edits unless the user explicitly requests a different direction.

## Project Structure & Module Organization

This portfolio uses Next.js 14 App Router, React 18, TypeScript, and Tailwind CSS.

- `src/app/`: home, About, Work, and Writing routes, root layout, global styles, and sitemap.
- `src/components/`: portfolio sections and navigation; `ui/` contains reusable Radix/shadcn-style primitives.
- `src/lib/`: project data, constants, icons, and shared utilities such as `cn()`.
- `src/hooks/`: shared React hooks.
- `public/`: images, technology icons, and project screenshots.

Update shared project content in `src/lib/projects.ts`. Keep generated `.next/` output out of source changes.

## Build, Test, and Development Commands

Use Node.js 18 or newer and npm with the committed `package-lock.json`.

- `npm ci`: install locked dependencies.
- `npm run dev`: serve locally at `http://localhost:3000`.
- `npm run build`: compile the production application.
- `npm start`: serve an existing production build.
- `npx tsc --noEmit`: check TypeScript types.
- `npm run lint`: run ESLint with Next.js Core Web Vitals and Prettier formatting checks.
- `npm run lint:fix`: apply automatic ESLint and formatting fixes.
- `npm run format`: format supported project files with Prettier.
- `npm run format:check`: check formatting without changing files.

Treat GitHub Pages scripts as legacy: the current Next.js configuration does not enable static export. `npm run deploy` also commits and pushes; do not use it for local verification. Cleanup scripts assume Unix shell commands.

## Coding Style & Naming Conventions

Use literal tabs for indentation, displayed at a width of four spaces. Follow `.editorconfig` and `.prettierrc.json`; YAML uses two spaces because tabs are not valid YAML indentation. Prefer typed functional components, PascalCase component names, and kebab-case filenames such as `projects-section.tsx`. Name hooks with a `use` prefix. Use `@/` imports for `src/`, Tailwind utilities for styling, and `cn()` for conditional classes. Add `"use client"` when components require hooks or browser APIs. TypeScript strict mode is enabled. Prettier is the formatter and its rules are enforced by ESLint. Format files you edit before finishing.

## Testing Guidelines

No automated test framework, test script, or coverage threshold is configured. Run the production build and type check, and report any failures. Manually verify affected routes, mobile layouts, theme switching, navigation, and contact-form validation. If introducing tests, document the runner and use descriptive `*.test.ts` or `*.test.tsx` filenames.

## Commit & Pull Request Guidelines

History commonly uses `feat:` and `fix:` prefixes alongside imperative summaries. Keep commits focused. Pull requests should explain the change, link relevant issues, list validation results, and include screenshots for visual changes.

## Configuration & Secrets

Copy `.env.local.example` to `.env.local` for EmailJS configuration. Never commit credentials or webhook URLs. Values prefixed with `NEXT_PUBLIC_` are exposed to browsers; use only public EmailJS identifiers there.
