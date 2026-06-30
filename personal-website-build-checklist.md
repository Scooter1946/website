# Build plan — personal portfolio (Approach A)

An ordered runbook for an AI coding agent. Work phase by phase; after each phase, run its "Done when" checks before moving on. All design values come from `approach-a-design-spec.md` (the source of truth) — read it in full before Phase 1. Do not improvise tokens, colors, sizes, or timings.

Stack (decided — do not change without being asked): Astro (static output), TypeScript, plain CSS. No UI framework, no Tailwind. Client JS is a single progressive-enhancement script. Package manager: npm. Node 20+.

Target file tree:
```
/
  CLAUDE.md
  approach-a-design-spec.md
  personal-website-build-checklist.md
  astro.config.mjs
  public/resume.pdf            (TODO(user) placeholder)
  src/
    data/site.ts
    styles/{tokens,global,components}.css
    scripts/enhance.ts
    components/{Nav,StatusPill,Hero,ProjectCard,Footer}.astro
    pages/index.astro
```

---

## Phase 0 — Scaffold
- Initialize a minimal Astro + TypeScript (strict) project with the official scaffolder (`npm create astro@latest`): choose the Empty/Minimal template, TypeScript Strict, install dependencies. Add no framework integrations.
- Confirm `package.json` exposes scripts: `dev` (astro dev), `build` (astro build), `preview` (astro preview). Add type checking best-effort: `npx astro add check` (or `npm i -D @astrojs/check typescript`) → script `check` = `astro check`.
- Set `astro.config.mjs`: `site` to a placeholder domain (`TODO(user)`); for a GitHub Pages project site also set `base: '/REPO_NAME'` (leave commented with a TODO if unknown).
- Create the directory structure above (empty files are fine for now).
- Done when: `npm install` succeeds and `npm run dev` serves a blank page with no errors.

## Phase 1 — Tokens & base styles
- Create `src/styles/tokens.css`, `global.css`, and `components.css` verbatim from spec §1–§3.
- Import all three once (global layout `<head>` or a base layout component).
- Add the JS-gate inline script to `<head>`: `<script is:inline>document.documentElement.classList.add('js')</script>` (spec §2).
- Done when: `npm run build` compiles; a test heading + link render with correct fonts; toggling OS dark mode flips the palette; with JS disabled, no element is stuck invisible.

## Phase 2 — Content data layer
- Create `src/data/site.ts` exactly per spec §5, including the `Project` interface and all `TODO(user)` placeholder defaults.
- Done when: `npm run check` (or `npm run build`) reports no type errors and `site` is importable.

## Phase 3 — Components
- Build `Nav`, `StatusPill`, `Hero`, `ProjectCard`, `Footer` as Astro components. All copy comes from `site.ts` — no hardcoded text.
- Wire the required markup hooks from spec §6: `data-rise` indices on hero children; `data-kinetic` + `data-words` (JSON of `site.specializations`) on the cycled word (initial text = `specializations[0]`, class `kinetic`); `data-pulse` on the status dot; `.card`/`.card__bar`/`.card__arrow` on project cards with `aria-hidden` on decorative bits.
- Use outline icons only (e.g. an inline SVG or an outline icon set) for the mail and arrow glyphs; give icon-only controls `aria-label`.
- Done when: each component renders in isolation with placeholder content and no console errors.

## Phase 4 — Enhancement script
- Create `src/scripts/enhance.ts` verbatim from spec §4. Import it once from the page with a deferred client script (e.g. Astro `<script>`), loaded after content.
- Done when, in the browser: hero elements stagger in on load; the headline word cycles every ~2.6s with a crossfade; cards lift + show the accent bar + slide the arrow on hover; the status dot pulses. With `prefers-reduced-motion: reduce` set, none of these animate and all content shows in final state. With JS disabled, all text content is still present and readable.

## Phase 5 — Page assembly
- Build `src/pages/index.astro` composing sections in order (spec §6): Hero → Selected work (3–5 `ProjectCard`s in `.work-grid` under an `.eyebrow` label) → About → Skills (grouped) → Contact/footer (email, resume link to `site.resume`, social links). Add a skip-to-content link as the first focusable element and a single `<main>`.
- Apply `data-reveal` to each below-the-fold `<section>`.
- Done when: the full single page renders with placeholder content; layout holds at 360px, 768px, and 1280px widths; tabbing reaches every interactive element with a visible focus ring in logical order.

## Phase 6 — Performance & accessibility pass
- Self-host or preconnect fonts; set `font-display: swap`; ensure a system fallback so the hero paints without waiting on fonts.
- Reserve a fixed `min-width` on the `.kinetic` word so cycling causes no layout shift.
- For any imagery: responsive `srcset`, `loading="lazy"` below the fold, WebP/AVIF.
- Run a Lighthouse audit on the production build (`npm run build && npm run preview`, then `npx lighthouse http://localhost:4321 --view` or Chrome DevTools).
- Done when (pass/fail, spec §7–§8): Performance ≥ 95, Accessibility ≥ 95, LCP < 1.5s, CLS ≈ 0, total initial transfer < 500KB, and the page is fully readable with JS disabled.

## Phase 7 — Deploy
- Produce a static build (`npm run build` → `dist/`). Verify with `npm run preview`.
- Provide deploy config for one host (default GitHub Pages; Netlify/Vercel equally fine): for GitHub Pages, confirm `base` is set to the repo name and add a Pages workflow or `astro build` step; for Netlify/Vercel, set build command `astro build` and publish dir `dist`.
- Done when: `dist/` is generated cleanly and the chosen host config is present. Do NOT publish, push, or change repo/host settings without the user's go-ahead.

---

## Final do-not-ship sweep (verify before declaring done)
- Exactly one accent color; only two self-running animations (headline + dot).
- No broken links; every project card has a quantified outcome; no clone/tutorial project as flagship.
- No animation > 500ms; only `transform`/`opacity` animated.
- Reduced-motion fully neutralizes motion; JS-disabled site is readable.
- `npm run build` passes with no type errors; performance/a11y budgets met.
- All `TODO(user)` placeholders are either filled (if the user provided values) or clearly listed in your handoff summary.
