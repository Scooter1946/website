# CLAUDE.md — personal portfolio site

## Project
A static personal website for Justin Chen, a software / electrical engineering candidate (Purdue EE B.S./M.S., competitive programmer, hardware + software). Design philosophy: **"kinetic editorial, warm"** — expressive, type-led layout that feels alive and in motion, built on a warm peach palette, with a physical-build signature moment (the macropad). Bold and characterful, not minimal — but never at the cost of accessibility or load speed.

> History: this replaced an earlier "quiet base, one signature moment" minimalist direction at the owner's explicit request ("go all out, more flowy/active"). The old restraint rules (one accent, no motion > 500ms, only two self-running animations, two font weights) are intentionally retired. Do not reintroduce them.

## Stack (decided — do not change without being asked)
- Astro (static output), TypeScript, plain CSS. No UI framework, no Tailwind.
- Minimal client JS: a single progressive-enhancement script (`src/scripts/enhance.ts`). All content renders without it.
- Fonts via Fontsource, self-hosted: **Space Grotesk** (display), **Inter** (400/500/600, body & UI), **JetBrains Mono** (technical labels).
- npm, Node 20+. Deploy target: a static host (GitHub Pages / Netlify / Vercel).

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build` (outputs `dist/`)
- Preview build: `npm run preview`
- Type check: `npm run check`

## Where things live
- Design source of truth (tokens, palette, type, motion, components, sections): `approach-a-design-spec.md`.
- All user-editable content (name, stats, experience, projects, skills, links, keywords): `src/data/site.ts`.
- Tokens: `src/styles/tokens.css`. Layout primitives: `src/styles/layout.css`. Components: `src/styles/components.css`. Base + reveal system: `src/styles/global.css`.
- Enhancement script: `src/scripts/enhance.ts`.
- Components: `src/components/{Nav,StatusPill,Hero,Experience,ProjectCard,Footer}.astro`. Page: `src/pages/index.astro`.

IMPORTANT: Before changing design values, read `approach-a-design-spec.md`. The spec defines the palette, type scale, and motion tokens; keep new work consistent with them rather than improvising one-off values.

## Non-negotiables (accessibility & quality — these DO hold)
- YOU MUST keep the site fully readable with JavaScript disabled. JS is enhancement only; all text/content renders server-side.
- Honor `prefers-reduced-motion: reduce`: disable the entrance stagger, kinetic headline cycle, availability-dot pulse, aurora drift, parallax, magnetic buttons, and the marquee/ticker scroll — render the final static state. (The global reduced-motion block + `enhance.ts` guards handle this; keep them intact.)
- Every interaction works by keyboard with a visible focus ring. Never remove focus outlines. The macropad grid is a roving-tabindex arrow-key group; keep it keyboard-operable.
- Animate `transform` and `opacity` first. Do not animate layout properties (width/height/top/left/margin) — use transforms. This is for performance, not restraint.
- Maintain text contrast: body/label text ≥ 4.5:1, large display text & UI affordances ≥ 3:1 on their background (both on peach and on the dark band).
- Sentence case everywhere except the mono eyebrow labels (which are lowercase).

## Design direction (embraced — the "go all out" rules)
- **Palette:** a warm, analogous family — copper `--accent`, amber `--accent-2`, rose `--accent-3` — on a peach base, plus one dramatic warm-espresso dark band (`--dark-bg`). Multiple warm tones are fine and encouraged; keep them warm and cohesive (no cool/clashing hues). Gradients (`--grad-warm`, `--grad-sunset`) are welcome.
- **Type:** Space Grotesk (display) carries the personality — big, geometric, techy; emphasis via weight + accent color (it has no true italic — do not fake one). Inter for body/UI. JetBrains Mono for eyebrows/labels. Use the full weight range (light→semibold), not two weights.
- **Motion is a feature.** Ambient/self-running motion is allowed (aurora drift, availability dot, the keyword/work marquee). Scroll-driven motion is allowed (progress bar, section reveals with staggered children, parallax). Pointer motion is allowed (card tilt + spotlight, magnetic buttons, macropad tilt). Durations may exceed the old 500ms cap where it serves the feel. Keep it `transform`/`opacity`-based and rAF-throttled, and always reduce-motion-safe.
- **Signature piece:** the CSS-3D macropad in the hero (a nod to a real keypad Justin built). Keep it — real keyboard-operable keys that clack, pointer-tilt, degrades to a static 3D model with no JS.
- **Structure:** single page — Hero → keyword ticker → stats → Experience (timeline) → Selected work → About (dark band) → Skills → Contact. Full-bleed bands alternate `--bg` / `--surface` / `--bg-tint`, with the dark band for contrast.

## Placeholders — handle, do not invent
`src/data/site.ts` now holds Justin's real résumé content. Do NOT invent biographical facts, employers, or metrics beyond what the résumé / user provides. Remaining `TODO(user)` items to fill when the user is in-session:
- Codeforces profile URL (the "1600+" stat is currently unlinked).
- Real per-project repo/demo URLs (all projects currently link to the GitHub profile).

By request, the résumé is **not** downloadable on the site — the contact section invites emailing for it. Do not re-add a résumé link or `public/resume.pdf` without being asked.

## Workflow
- Work in the existing file structure; keep shared styles in `components.css` / `layout.css` and section-specific styles scoped in the component `.astro` files.
- Run `npm run check` and `npm run build` before declaring done.
- Verify visible changes in the browser preview. Note: the preview pane captures blank below the fold — verify lower sections with a tall viewport at scroll 0, or via DOM / computed-style inspection.
- Stop and ask if a change would break an accessibility non-negotiable above.
- Do NOT publish, push, or change repo/host settings without explicit approval.

## Definition of done
`npm run build` and `npm run check` pass with no errors; the page is readable with JS off; reduced-motion renders a clean static state; keyboard navigation works with visible focus; contrast holds on both peach and dark bands; layout holds at 375px, 768px, and 1280px.
