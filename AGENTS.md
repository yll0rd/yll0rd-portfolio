# Repository Guidelines

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
- `npm run lint`: invoke Next.js linting. The ESLint configuration extends `next/core-web-vitals`, but required ESLint packages are not declared in `package.json`; report setup failures explicitly.

Treat GitHub Pages scripts as legacy: the current Next.js configuration does not enable static export. `npm run deploy` also commits and pushes; do not use it for local verification. Cleanup scripts assume Unix shell commands.

## Coding Style & Naming Conventions
Use two-space indentation and follow the surrounding file's quote and semicolon style. Prefer typed functional components, PascalCase component names, and kebab-case filenames such as `projects-section.tsx`. Name hooks with a `use` prefix. Use `@/` imports for `src/`, Tailwind utilities for styling, and `cn()` for conditional classes. Add `"use client"` when components require hooks or browser APIs. TypeScript strict mode is enabled; no formatter is configured.

## Testing Guidelines
No automated test framework, test script, or coverage threshold is configured. Run the production build and type check, and report any failures. Manually verify affected routes, mobile layouts, theme switching, navigation, and contact-form validation. If introducing tests, document the runner and use descriptive `*.test.ts` or `*.test.tsx` filenames.

## Commit & Pull Request Guidelines
History commonly uses `feat:` and `fix:` prefixes alongside imperative summaries. Keep commits focused. Pull requests should explain the change, link relevant issues, list validation results, and include screenshots for visual changes.

## Configuration & Secrets
Copy `.env.local.example` to `.env.local` for EmailJS configuration. Never commit credentials or webhook URLs. Values prefixed with `NEXT_PUBLIC_` are exposed to browsers; use only public EmailJS identifiers there.
