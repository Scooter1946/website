# Design spec — Approach A ("quiet base, one signature moment")

Source of truth for the portfolio's design tokens, components, motion, and content shape. The build plan (`personal-website-build-checklist.md`) implements this in order. Values here are exact — do not improvise tokens, sizes, colors, or timings.

Philosophy: minimalist, type-led, fast. Motion is spent only where it guides, confirms, or clarifies, plus exactly one signature interaction (the kinetic headline).

---

## 1. Design tokens — `src/styles/tokens.css`

Create this file verbatim. Light values in `:root`; dark via `prefers-color-scheme`.

```css
:root {
  color-scheme: light dark;

  /* Color — light mode */
  --bg: #FBFBF9;
  --surface: #FFFFFF;
  --text-primary: #1A1A18;
  --text-secondary: #5F5E5A;
  --text-tertiary: #8A8980;
  --border: rgba(0, 0, 0, 0.10);
  --border-strong: rgba(0, 0, 0, 0.18);
  --accent: #0F6E56;        /* TODO(user): one accent hue, any value; never add a second */
  --accent-soft: #E1F5EE;
  --focus: #0F6E56;

  /* Type families — TODO(user): swap for licensed/self-hosted fonts if desired */
  --font-display: "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  /* Fluid type scale (handles mobile→desktop without media queries) */
  --fs-display: clamp(2rem, 1.3rem + 3.2vw, 3rem);
  --fs-h1: clamp(1.5rem, 1.2rem + 1.4vw, 1.875rem);
  --fs-h2: clamp(1.25rem, 1.1rem + 0.6vw, 1.375rem);
  --fs-lead: clamp(1rem, 0.95rem + 0.4vw, 1.125rem);
  --fs-body: 1rem;
  --fs-caption: 0.8125rem;
  --fs-mono: 0.75rem;

  /* Spacing (4px base) */
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
  --sp-6: 24px; --sp-8: 32px; --sp-12: 48px; --sp-16: 64px; --sp-24: 96px;

  /* Radius & borders */
  --radius: 8px;
  --radius-card: 12px;
  --hairline: 0.5px;

  /* Motion */
  --dur-micro: 120ms;
  --dur-hover: 180ms;
  --dur-enter: 500ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0E0E0D;
    --surface: #1A1A18;
    --text-primary: #F4F3EE;
    --text-secondary: #A8A7A0;
    --text-tertiary: #6E6D67;
    --border: rgba(255, 255, 255, 0.12);
    --border-strong: rgba(255, 255, 255, 0.22);
    --accent: #1D9E75;
    --accent-soft: #085041;
    --focus: #1D9E75;
  }
}
```

Hard rules: two font weights only (400, 500 — never 600/700). Sentence case everywhere except the mono eyebrow label. Exactly one accent.

---

## 2. Base styles — `src/styles/global.css`

```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  font-weight: 400;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.01em;
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
img { max-width: 100%; display: block; }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; border-radius: 2px; }

/* Entrance state applies ONLY when JS is present, so the site is fully
   readable with JS disabled. The <head> inline script adds `.js`. */
.js [data-rise], .js [data-reveal] { opacity: 0; transform: translateY(10px); }
[data-rise].is-in, [data-reveal].is-in {
  opacity: 1; transform: none;
  transition: opacity var(--dur-enter) var(--ease-out),
              transform var(--dur-enter) var(--ease-out);
}

/* Reduced motion: neutralize all motion, render final state */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

IMPORTANT: in the page `<head>`, add `<script is:inline>document.documentElement.classList.add('js')</script>` so the hidden entrance state is gated on JS being available.

---

## 3. Component styles (interactive bits) — `src/styles/components.css`

```css
/* Status pill */
.status { display: flex; align-items: center; gap: var(--sp-2); }
.status__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }

/* Buttons */
.btn {
  font-family: var(--font-body); font-size: var(--fs-caption);
  border-radius: var(--radius); padding: var(--sp-2) var(--sp-4);
  border: var(--hairline) solid var(--border-strong);
  background: transparent; color: var(--text-primary); cursor: pointer;
  transition: background var(--dur-hover) var(--ease-standard), transform var(--dur-micro);
}
.btn:hover { background: var(--surface); }
.btn:active { transform: scale(0.98); }
.btn--primary { background: var(--accent); color: var(--accent-soft); border-color: var(--accent); }

/* Project card */
.card {
  position: relative; overflow: hidden;
  background: var(--surface); border: var(--hairline) solid var(--border);
  border-radius: var(--radius-card); padding: var(--sp-4) var(--sp-4);
  cursor: pointer; text-decoration: none; color: inherit;
  transition: transform var(--dur-hover) var(--ease-standard),
              border-color var(--dur-hover) var(--ease-standard);
}
.card:hover { transform: translateY(-3px); border-color: var(--border-strong); }
.card__bar {
  position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--accent);
  transform: scaleY(0); transform-origin: top;
  transition: transform var(--dur-hover) var(--ease-standard);
}
.card:hover .card__bar { transform: scaleY(1); }
.card__arrow { transition: transform var(--dur-hover) var(--ease-standard); }
.card:hover .card__arrow { transform: translateX(4px); }

/* Mono tag pill + eyebrow label */
.tag {
  font-family: var(--font-mono); font-size: var(--fs-mono);
  color: var(--text-secondary); background: color-mix(in srgb, var(--text-primary) 6%, transparent);
  border-radius: var(--radius); padding: 2px var(--sp-2);
}
.eyebrow { font-family: var(--font-mono); font-size: var(--fs-mono); letter-spacing: 0.5px; color: var(--text-tertiary); }

/* Kinetic headline word */
.kinetic { color: var(--text-primary); border-bottom: 2px solid var(--accent); padding-bottom: 1px; }

/* Project grid */
.work-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: var(--sp-3); }
```

---

## 4. Enhancement script — `src/scripts/enhance.ts`

The only client JavaScript. Pure progressive enhancement: entrance stagger, the one signature kinetic headline, scroll reveal, and the availability dot. All guarded by reduced-motion.

```ts
const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

// 1. Entrance stagger (hero) — elements carry data-rise="0|1|2..."
const rises = Array.from(document.querySelectorAll<HTMLElement>('[data-rise]'));
if (reduce) {
  rises.forEach((el) => el.classList.add('is-in'));
} else {
  rises
    .sort((a, b) => Number(a.dataset.rise) - Number(b.dataset.rise))
    .forEach((el, i) => setTimeout(() => el.classList.add('is-in'), 80 * i));
}

// 2. Signature moment: kinetic headline. Element: data-kinetic, data-words='["a","b"]'
const k = document.querySelector<HTMLElement>('[data-kinetic]');
if (k && !reduce) {
  const words = JSON.parse(k.dataset.words || '[]') as string[];
  let i = 0;
  const cycle = () => {
    i = (i + 1) % words.length;
    k.style.transition = 'opacity .26s ease';
    k.style.opacity = '0';
    setTimeout(() => { k.textContent = words[i]; k.style.opacity = '1'; }, 260);
    setTimeout(cycle, 2600);
  };
  setTimeout(cycle, 2600);
}

// 3. Scroll reveal for below-the-fold sections (data-reveal)
const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reveals.length && !reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

// 4. Availability dot pulse (data-pulse) — the only other permitted ambient loop
const dot = document.querySelector<HTMLElement>('[data-pulse]');
if (dot && !reduce) {
  setInterval(() => {
    dot.style.transition = 'opacity .9s ease';
    dot.style.opacity = dot.style.opacity === '0.35' ? '1' : '0.35';
  }, 1100);
}
```

Motion rules: animate only `transform`/`opacity`; nothing over 500ms; no looping motion beyond the headline and the dot.

---

## 5. Content data — `src/data/site.ts`

ALL user-editable content lives here, pre-filled with labeled placeholders so the site builds and runs immediately. The agent must not invent real values.

```ts
export interface Project {
  title: string;
  outcome: string; // one line; MUST contain a quantified metric
  tags: string[];
  href: string;
}

export const site = {
  name: "TODO(user): Your Name",
  available: "TODO(user): Available for summer 2026 roles",
  specializations: [           // the kinetic headline cycles through these
    "embedded firmware",
    "distributed systems",
    "developer tooling",
    "real-time control",
  ],                            // TODO(user): replace with your real focus areas
  email: "TODO(user): you@example.com",
  links: [
    { label: "GitHub", href: "https://github.com/TODO" },
    { label: "LinkedIn", href: "https://linkedin.com/in/TODO" },
  ],
  resume: "/resume.pdf",        // TODO(user): drop your PDF at public/resume.pdf
  about: "TODO(user): 2-4 sentences, first person, genuine personality.",
  skills: [
    { group: "Languages", items: ["TODO", "TODO"] },
    { group: "Frameworks", items: ["TODO"] },
    { group: "Tools", items: ["TODO"] },
  ],
  projects: [                   // 3-5 total. No clones. Each needs a real metric.
    { title: "TODO(user): Project name", outcome: "TODO(user): one line with a metric, e.g. cut p99 latency 41%", tags: ["C", "RTOS"], href: "#" },
  ] as Project[],
};
```

---

## 6. Page structure & required hooks

Single page, sections top to bottom: (1) Hero, (2) Selected work, (3) About, (4) Skills, (5) Contact/footer. Nav is a minimal top bar.

Required markup hooks (so the enhancement script binds correctly):
- Hero children get `data-rise="0"`, `"1"`, `"2"`, ... in visual order.
- The cycled headline word element gets `data-kinetic` and `data-words='[...]'` (JSON of `site.specializations`); its initial text is `specializations[0]` and class `kinetic`.
- The status dot gets `data-pulse`.
- Each below-the-fold `<section>` (work, about, skills, contact) gets `data-reveal`.
- Each project renders as an `<a class="card">` with `.card__bar` (`aria-hidden`), title, outcome, `.tag` pills, and a trailing `.card__arrow` icon (`aria-hidden`).

Component contracts: `Nav`, `StatusPill`, `Hero`, `ProjectCard`, `Footer` — all read from `site.ts`, no hardcoded copy.

---

## 7. Accessibility (required)

- `prefers-reduced-motion: reduce` disables all transitions, stagger, headline cycle, and dot pulse; final state renders statically (handled by §2 + §4).
- Body text contrast ≥ 4.5:1; large text and UI affordances ≥ 3:1 — verify the accent in both modes.
- All interactions keyboard-reachable; visible focus ring (never remove outlines); logical tab order; skip-to-content link.
- Semantic HTML (`<nav>`, `<main>`, `<section>`, ordered headings); `alt` on imagery; `aria-label` on icon-only controls.
- Never convey state by color alone (card hover pairs lift + arrow movement with the accent bar).

## 8. Performance budgets (pass/fail)

- LCP < 1.5s on mid-tier mobile / 4G.
- Total initial transfer < 500KB.
- Hero renders without waiting on web fonts: `font-display: swap` + system fallback in the stack.
- CLS ≈ 0 — reserve a fixed min-width for the kinetic word so cycling causes no layout shift.
- Images: responsive `srcset`, lazy-load below the fold, WebP/AVIF.
- Fully readable with JavaScript disabled (JS is enhancement only).

## 9. Do-not-ship list

- More than one self-running animation in primary content (headline + dot are the only permitted loops).
- A second accent color.
- Any animation that delays reading or interaction, or any animation > 500ms.
- Hover-only affordances with no keyboard/touch equivalent.
- A project card without a quantified outcome; any cloned/tutorial project as flagship work.
- Web fonts blocking first paint, or a hero that requires JS to show content.
