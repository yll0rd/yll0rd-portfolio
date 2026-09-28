# Youmbi Leo / yll0rd — Brand guidelines

Read this document before changing public-facing design, copy, imagery, navigation, or the writing experience. It is tool-independent guidance for any AI agent or human contributor. Read [AGENTS.md](AGENTS.md) for engineering conventions.

Preserve this identity when extending the site. A specific user-requested design change takes precedence; update this guide when an intentional brand change is approved. This document describes the current direction, not permission to redesign unrelated pages.

## Identity and purpose

- **Name:** Youmbi Leo. **Handle:** `yll0rd` (with a zero), pronounced “why-lord.”
- **Role:** AI/ML engineer with a full-stack background.
- **Home:** `https://yll0rd.me`.
- **Purpose:** share Leo’s work, learning, and thoughts from everyday life. Help readers explore projects, read articles, learn about Leo, and make contact.
- **Character:** thoughtful, technically capable, curious, personal, and quietly confident.

The site should feel like an engineer’s personal publication: generous reading space, clear structure, and considered typography. Writing about life belongs here alongside technical work. Avoid turning the portfolio into a generic AI startup sales page.

## Sources of truth

| Concern                                                                    | Source                                                                                 |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Theme colors, layout utilities, shared type styles, focus and motion rules | [src/app/globals.css](src/app/globals.css)                                             |
| Font loading and site identity metadata                                    | [src/app/layout.tsx](src/app/layout.tsx)                                               |
| Tailwind token mappings and radius scale                                   | [tailwind.config.js](tailwind.config.js)                                               |
| Current homepage composition and voice                                     | [src/app/(site)/page.tsx](<src/app/(site)/page.tsx>)                                   |
| Public navigation and theme switching                                      | [src/components/navbar.tsx](src/components/navbar.tsx)                                 |
| Article presentation                                                       | [src/components/blog/article.tsx](src/components/blog/article.tsx)                     |
| Editorial lists                                                            | [src/components/blog/post-list.tsx](src/components/blog/post-list.tsx)                 |
| Reading navigation                                                         | [src/components/blog/table-of-contents.tsx](src/components/blog/table-of-contents.tsx) |
| Shared project content                                                     | [src/lib/projects.ts](src/lib/projects.ts)                                             |

Inspect the active route and its imports before choosing a reference. Older standalone components such as `src/components/hero.tsx`, older README descriptions, and unused animation utilities may reflect earlier designs. Their presence is not a reason to introduce particles, oversized shadows, or decorative effects into current pages. Commented-out CSS is not an active design specification.

## Color

Use the existing semantic Tailwind classes, not duplicated hex values. The reference palette below documents the tokens in `globals.css`; verify that file when changing them.

| Role / token       | Light                | Dark                   | Use                                              |
| ------------------ | -------------------- | ---------------------- | ------------------------------------------------ |
| `background`       | `#F2F4F5` mist       | `#151D26` evening blue | Page canvas                                      |
| `foreground`       | `#252C33` charcoal   | `#E5E9ED` pale grey    | Main reading text                                |
| `primary`          | `#243C53` ink blue   | `#A8BDD0` soft blue    | Headings, links, primary actions                 |
| `secondary`        | `#92713A` aged brass | `#C2A16A` muted brass  | Sparse emphasis, editorial rules, active markers |
| `muted`            | `#E8EDF0`            | `#243240`              | Subdued surfaces                                 |
| `muted-foreground` | `#626D78`            | `#A4AFBA`              | Supporting text and metadata                     |
| `accent`           | `#E3E9EE`            | `#2B3B4B`              | Hover and selected surfaces                      |
| `border`           | `#D8DFE5`            | `#344453`              | Quiet structural dividers                        |
| `card` / `popover` | `#FFFFFF`            | `#1C2733`              | Elevated functional surfaces                     |

Pair filled surfaces with their matching foreground tokens, for example `bg-primary text-primary-foreground`. Reserve destructive and success colors for actual states. Brass is an accent, not a large-area background or default body text. Check contrast in both themes rather than assuming any pair of brand colors is accessible.

## Typography

- **Newsreader** (`--font-serif`, with Georgia fallback): expressive page titles, editorial headings, article titles, and selected narrative passages. Prefer regular weight, deliberate line breaks, and occasional meaningful italic emphasis.
- **IBM Plex Sans** (`--font-sans`, weights 400, 500, 600): navigation, controls, metadata, supporting copy, and interface text.
- **Monospace:** code and technical values; retain the existing code renderer. Do not introduce another display font for a small feature.

Reuse the existing classes where their role fits:

| Class             | Current treatment                                                                    |
| ----------------- | ------------------------------------------------------------------------------------ |
| `page-title`      | Newsreader, fluid 44–72px, 1.08 line height, slight negative tracking, primary color |
| `editorial-title` | Newsreader, 38px, 1.2 line height                                                    |
| `story-copy`      | Newsreader, 23px desktop / 21px mobile, 1.6 line height                              |
| `intro-copy`      | 19px desktop / 17px mobile, 1.7 line height, maximum 620px width                     |
| `eyebrow`         | Small uppercase utility label with restrained tracking                               |
| `text-link`       | Primary-color text action, generous hit area, underline on hover                     |

Article titles currently use a smaller fluid 36–60px range. Preserve readable prose and meaningful heading hierarchy; do not make every heading a large display title. Uppercase is for brief labels, not paragraphs or ordinary controls.

## Layout and components

- Use `site-width`: maximum 1120px, with 32px side margins by default and 20px below 700px. Avoid introducing a competing page container.
- Keep reading columns bounded; article presentation has an 800px maximum. Side navigation must leave sufficient room for prose.
- Let spacing, typography, and thin rules organize content. Use cards when content needs a distinct functional surface, not around every paragraph or list item.
- Maintain generous section spacing. The homepage uses roughly 64–96px between major sections, scaled to screen size; treat this as a reference, not a requirement for compact dashboard controls.
- Use modest corners from the existing radius system (`--radius: 0.5rem`). Avoid pill-shaped containers and large rounded panels as a universal motif.
- Keep shadows restrained and functional. Avoid new glass panels, neon glows, gradient text, background blobs, and decorative particles unless explicitly requested.
- Reuse existing UI primitives and the established Lucide/Radix icon language. Icons supplement clear labels; decorative icons are hidden from assistive technology.
- Keep actions specific and calm. Prefer one clear primary action and quieter text or outline alternatives.

The dashboard shares the palette, typography, and accessibility standards, but may use denser forms and controls. Public pages should not inherit administrative chrome.

## Writing and media

Use plain, personal English. First person fits Leo’s introductions and reflections; functional labels should describe the action directly. Prefer sentence case and concrete descriptions over promotional superlatives.

Existing voice references include “I build software, and write about what stays on my mind,” “A little about me,” “Selected work,” and “Room for a longer thought.” Use these as tone references, not phrases to repeat everywhere.

Explain what a project does and Leo’s contribution. Never invent metrics, clients, credentials, experience, testimonials, or availability. Preserve supplied names, links, and article meaning. Avoid generic claims such as “revolutionizing the future” or “unlocking limitless possibilities.”

Use actual project screenshots and existing personal imagery where appropriate. Preserve image proportions, provide useful alternative text, and keep cropping intentional. Do not replace identity assets or the portrait with generated imagery without a specific request. Decorative imagery must earn its space beside the writing.

## Responsive behavior and accessibility

- Design for narrow phones as well as wide screens. Check around 375px, 768px, 1024px, and 1440px, including long titles and unusually long links.
- Stack columns when they no longer fit comfortably. Do not shrink text to preserve a desktop layout.
- Keep tables and code horizontally scrollable within their own containers; avoid horizontal scrolling of the whole page.
- The article TOC is a sticky sidebar on desktop and a collapsible “On this page” disclosure on smaller screens. Retain unique heading anchors, active-section feedback, and offsets that clear navigation.
- Provide visible keyboard focus, accessible labels, semantic landmarks, and logical heading order. Preserve the global focus outline and comfortable touch targets; aim for at least 44px for standalone controls.
- Test light and dark themes, hover, focus, active, disabled, empty, and error states where relevant. Do not communicate a state through color alone.
- Motion should explain navigation or state changes. Keep it subtle, respect `prefers-reduced-motion`, and preserve nonanimated fallbacks. Avoid scroll hijacking and perpetual decorative movement.

## Article and editor consistency

Published articles and previews use the shared rich editor in `notEditable` mode. Preserve custom rendering for images, tables, code blocks, and supported marks. Keep useful reader controls such as code copying; hide authoring controls in read-only mode. Do not add a separate simplified renderer that silently drops supported content.

Heading IDs and TOC links must agree, including duplicate titles and headings containing formatted text. Preserve deep links and keyboard navigation when changing the reader layout.

Reader comments sit below the article in the same 800px column. Comment text uses Newsreader like the article; names, dates, and controls use IBM Plex Sans. Replies (at most two levels) hang from a thin brass rule, echoing article blockquotes. Leo’s own comments carry a small brass “Author” label. Deleted and hidden comments stay in place as an italic placeholder so replies keep their context. Sign-in with Google lives inside the comments section itself, never on a separate page.

## Workflow for future agents

1. Read this guide and `AGENTS.md`, then inspect the affected active route and nearby shared components.
2. Reuse the existing tokens, type roles, content sources, and layout utilities. Explain any necessary departure from them.
3. Keep edits scoped to the requested behavior. Preserve existing user changes and unrelated page designs.
4. Use literal tabs displayed at width four; follow the repository’s Prettier, ESLint, and EditorConfig settings. Format edited files.
5. Verify affected interactions, narrow layouts, both themes, keyboard access, and reduced motion. Run applicable repository checks and report what was actually verified, including unavailable browser checks.
6. Update this document alongside intentional changes to the brand system so future agents do not follow stale guidance.
