# CLAUDE.md — personal portfolio site

## Project
A static personal website for a software / electrical engineering job candidate. Design philosophy: "quiet base, one signature moment" — minimalist, type-led, fast, with motion only where it guides, confirms, or clarifies.

## Stack (decided — do not change without being asked)
- Astro (static output), TypeScript, plain CSS. No UI framework, no Tailwind.
- Zero client JS by default; the only client script is progressive enhancement for micro-interactions.
- npm, Node 20+. Deploy target: a static host (GitHub Pages / Netlify / Vercel).

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build` (outputs `dist/`)
- Preview build: `npm run preview`
- Type check: `npm run check`

## Where things live
- Ordered build steps + acceptance checks: `personal-website-build-checklist.md` — follow it in order.
- Design source of truth (tokens, components, motion, budgets): `approach-a-design-spec.md`.
- All user-editable content (name, accent, specializations, projects, links): `src/data/site.ts`.
- Tokens: `src/styles/tokens.css`. Enhancement script: `src/scripts/enhance.ts`.

IMPORTANT: Before writing any code, read `personal-website-build-checklist.md` and `approach-a-design-spec.md` in full. The spec defines exact values; do not improvise tokens, sizes, colors, or timings.

## Non-negotiables
- YOU MUST keep every design-token value (color, type scale, spacing, radius, motion timing) exactly as written in the spec.
- Use exactly one accent color. Never add a second.
- Only two self-running animations exist: the kinetic headline and the availability dot. Add no other looping motion.
- Animate only `transform` and `opacity`. Never animate layout properties. No animation longer than 500ms.
- Every interaction works by keyboard with a visible focus ring. Never remove focus outlines.
- All text content renders with JavaScript disabled; JS is enhancement only.
- Honor `prefers-reduced-motion: reduce`: disable all transitions, stagger, headline cycle, and dot pulse; render the final static state.
- Two font weights only (400, 500). Sentence case everywhere except the mono eyebrow label.

## Exceptions (owner-approved)
- **Selected-work marquee**: an always-on left→right auto-scroll in the "Selected work" section. This is a THIRD self-running animation and runs longer than 500ms — both against the animation non-negotiables — added at the owner's explicit request. Constraints kept: `transform`-only, pauses on hover/focus, and freezes to a static (manually scrollable) row under `prefers-reduced-motion`.

## Placeholders — handle, do not invent
`src/data/site.ts` ships with clearly labeled `TODO(user)` values so the site builds and runs on defaults.
- Build on the defaults; the site MUST run end to end without real content.
- Do NOT invent biographical facts, employers, or project metrics. Keep placeholder copy obviously labeled.
- If the user is in-session, ask for real values to fill `site.ts`; otherwise leave the placeholders and list them in your summary.

## Workflow
- Plan the file tree before creating files; follow the structure in the build plan.
- Work phase by phase; run each phase's "Done when" checks before continuing.
- Run `npm run build` (and `npm run check`) before declaring done.
- Stop and ask if anything here conflicts with the spec, or if a non-negotiable cannot be met.
- Do NOT publish, push, or change repo/host settings without explicit approval.

## Definition of done
Every phase in the build plan passes its acceptance checks, `npm run build` succeeds with no type errors, and the performance/accessibility budgets in the spec are met.
