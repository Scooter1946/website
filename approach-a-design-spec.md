# Design spec — "Kinetic editorial, warm"

Source of truth for the portfolio's palette, type, motion, components, and page structure. This is the current direction (it replaced the earlier minimalist "quiet base" spec at the owner's request). Keep new work consistent with the tokens and patterns here rather than improvising one-off values.

**Philosophy:** expressive and type-led, warm, alive with motion. Space Grotesk display type carries the personality (geometric, techy, engineered); a warm analogous palette (copper → amber → rose) sits on a peach base with one dramatic dark band for contrast; motion is embraced (ambient, scroll-driven, and pointer-driven) but stays `transform`/`opacity`-based and fully reduce-motion-safe. One physical signature moment: the CSS-3D macropad in the hero.

---

## 1. Design tokens — `src/styles/tokens.css`

Light-only, warm scheme (no dark-mode variant; there is instead a dark *band*).

**Color.** Peach base + cream surfaces; deep-espresso ink text; a warm accent family used freely (analogous, all warm):
- `--bg #FFF3EA`, `--bg-tint #FCE7D6`, `--surface #FFFCF8`, `--surface-2 #FFF7EE`
- `--text-primary #241812`, `--text-secondary #6E5849`, `--text-tertiary #7A6150` (darkened to clear AA on peach)
- `--accent #C2502B` (copper, primary + focus), `--accent-2 #E08A2B` (amber), `--accent-3 #B23A5F` (rose, sparing)
- `--on-accent #FFFBF7` (text on an accent fill — ≥ 4.5:1 on copper)
- Gradients: `--grad-warm` (copper→amber), `--grad-sunset` (rose→copper→amber)
- Dark band: `--dark-bg #24120A`, `--dark-surface #311A0F`, `--dark-text #FBE9DA`, `--dark-text-secondary #CBAB93`, `--dark-border`

**Type.** `--font-display "Space Grotesk Variable"` (geometric grotesque, weight 300–700; no true italic — emphasize with weight + accent color), `--font-body "Inter"`, `--font-mono "JetBrains Mono"`. Fluid scale: `--fs-hero` (clamp → 6.5rem), `--fs-display` (→ 4rem), `--fs-quote` (→ 3rem), `--fs-h1`, `--fs-h2`, `--fs-lead`, `--fs-body 1.0625rem`, `--fs-caption`, `--fs-mono`. Weights `--fw-light 340 / --fw-normal 400 / --fw-medium 500 / --fw-semibold 600` — use the full range.

**Spacing** 4px base (`--sp-1`…`--sp-32`). **Radius** `--radius 8 / --radius-card 14 / --radius-lg 24 / --radius-pill 999 / --hairline 0.5px`. **Layout** `--maxw 78rem`, `--maxw-text 42rem`, `--gutter clamp(1.25rem,4vw,4rem)`.

**Motion.** `--dur-micro 120 / --dur-hover 220 / --dur-enter 640 / --dur-slow 1000ms`; eases `--ease-standard`, `--ease-out`, `--ease-spring` (overshoot). Durations may exceed 500ms where it serves the feel — the old cap is retired.

Hard rules that remain: sentence case except the mono eyebrow (lowercase); keep contrast (§7).

---

## 2. Base + reveal system — `src/styles/global.css`

- Box-sizing reset; body on `--bg` with Inter; `overflow-x: clip` (NOT `hidden` — keeps the sticky nav working while clipping aurora/parallax overflow). Headings use Fraunces with tight tracking, `font-optical-sizing: auto`, `text-wrap: balance`.
- `html { scroll-behavior: smooth }` (disabled under reduced motion).
- **JS-gated reveal:** hidden entrance state applies only under `.js` (the `<head>` inline script adds it), so the site is fully readable with JS off. `[data-rise]` (hero, fired on load) and `[data-reveal]` (everything below — observed per-element, so each item unveils as it scrolls into view) fade + rise; `.is-in` transitions them in with `transition-delay: calc(var(--i,0) * 70ms)` for row cascades. Variants: `[data-reveal="left|right|scale"]`.
- **Reduced motion:** a media block neutralizes animation/transition durations, disables smooth scroll, and forces `[data-rise]/[data-reveal]/[data-stagger]` to their final visible state.

IMPORTANT: keep the `<head>` inline `document.documentElement.classList.add('js')` script.

---

## 3. Components — `src/styles/components.css`

- **Status pill:** rounded, blurred, dot with a soft halo ring; `data-pulse` on the dot.
- **Buttons:** pill; `.btn--primary` uses `--grad-warm` + warm glow; magnetic (`data-magnet` → `--mag-x/--mag-y` via the independent `translate` longhand; press uses independent `scale`). `.link-arrow` slides its arrow.
- **Eyebrow** (mono, lowercase) + **kinetic** word (`display:inline-block`, semibold, accent, gradient underline).
- **Tags:** mono pills with a warm tint, hover lift.
- **Stats:** big Fraunces numbers with `background-clip:text` gradient (guarded by `@supports`, falls back to solid accent); linked stats show a `↗`.
- **Marquee / ticker:** continuous `transform`-only scroll; two duplicated sets so `translateX(-50%)` loops seamlessly; duration set from content width by the script for constant speed; pauses on hover/focus; freezes to a scrollable row under reduced motion. `.ticker` is the big keyword variant.
- **Project card:** featured — index, period, badge, title, arrow, outcome, tags; pointer tilt (`--rx/--ry`) + spotlight (`--mx/--my`) + hover lift/shadow.
- **Experience timeline:** left spine + node per role (`.xp::before`, ring-masked); head (company + period), role, em-dash bullets, tags; node grows on hover.
- **Aurora:** three blurred, warm radial blobs drifting on slow `transform` keyframes behind the hero.
- **Scroll progress:** fixed top bar, `transform: scaleX(var(--progress))`.
- **Macropad:** kept intact — a real preserve-3d cuboid (STL-accurate ~170×149mm, chunky case), pointer-tilt, real keyboard-operable keycaps with extruded walls that clack. `transform`/`opacity` only; static model with no JS.

Section-specific layout lives in the component `.astro` scoped styles; shared visuals live here.

---

## 4. Enhancement script — `src/scripts/enhance.ts`

The only client JS. All guarded by `reduce` (and pointer-driven bits by `fine = (hover:hover) and (pointer:fine)`). Sections: (1) entrance stagger; (2) kinetic headline cycle (fade + slide); (3) scroll reveal via IntersectionObserver; (4) availability-dot pulse; (5) pointer spotlight + tilt; (6) macropad (roving tabindex, arrow keys, WebAudio clack, press animation); (7) marquee/ticker duration from content width (supports multiple `[data-marquee]`); (8) scroll-progress bar + parallax (`data-parallax`) in one rAF scroll loop; (9) active-section nav highlight via IO band; (10) magnetic buttons.

Rules: `transform`/`opacity` first; rAF-throttle pointer/scroll writes; everything must no-op cleanly under reduced motion and with JS absent.

---

## 5. Content data — `src/data/site.ts`

Holds Justin's real content (do not invent beyond the résumé). Interfaces: `Project { title, outcome, tags, href, badge?, period? }`, `Experience { company, role, period, summary, tags[], href? }`, `Stat { value, label, href? }`. Plus `name, available, location, education, gradYear, tagline, specializations[]` (kinetic words, each reads after "currently building ___"), `keywords[]` (ticker), `stats[]`, `email, links[], aboutQuote, about, skills[]`. No résumé download by request — contact invites emailing for it.

---

## 6. Page structure — `src/pages/index.astro`

Single page, full-bleed bands: **Hero** → **keyword ticker** (`.ticker`, `aria-hidden`) → **stats** (`--bg-tint`) → **Experience** (`01`, timeline) → **Selected work** (`02`, featured cards) → **About** (`03`, `.band--dark` pull-quote) → **Skills** (`04`, rail + groups, tags cascade in + pop on hover) → **Contact** (`05`, `.band--dark` footer — big CTA, email as a secondary link, reactive socials). Both dark bands carry a pointer-tracking warm glow via `data-spotlight`. Numbered `section-head` eyebrows on the main sections. Skip link first; one `<main>`; JSON-LD `Person` in `<head>`. Granular items (section heads, stats, timeline entries, bento tiles, skill groups, contact blocks) each get their own `data-reveal` (+ optional `style="--i:N"`) so they unveil individually as they scroll in.

Required hooks: hero children `data-rise="0..5"`; kinetic word `data-kinetic` + `data-words`; status dot `data-pulse`; interactive surfaces `data-spotlight`/`data-tilt`; primary CTAs `data-magnet`; marquee/ticker containers `data-marquee`; nav links `data-navlink`; scroll bar `data-progress`; aurora `data-parallax`.

---

## 7. Accessibility (required)
- `prefers-reduced-motion: reduce` → all motion off, final state renders (see §2 + §4).
- Contrast: body/label ≥ 4.5:1, large/UI ≥ 3:1 — on peach AND on the dark band. `--text-tertiary` is tuned for this; re-check any new color pairing.
- Keyboard-reachable everything; visible focus ring (never removed); skip link; logical order; the macropad is one roving-tabindex arrow-key group.
- Semantic HTML, ordered headings, `aria-label` on icon-only / decorative-interactive bits, `aria-hidden` on purely decorative nodes (aurora, ticker, marquee clones).
- Never convey state by color alone (cards pair lift + shadow + arrow with the accent; nav active pairs color + underline).

## 8. Performance
- Fonts self-hosted with `font-display: swap` + system fallbacks; hero paints without waiting on fonts.
- Client JS stays tiny (~2KB gz). No layout-property animation; `transform`/`opacity` + rAF only.
- Fully readable with JS disabled. Images (if added later): responsive `srcset`, lazy below the fold, WebP/AVIF.

## 9. Do-not-ship list
- Cool/clashing colors that break the warm family; text that fails the §7 contrast floors.
- Motion that isn't reduce-motion-safe, animates layout properties, or isn't rAF-throttled.
- Any content that requires JS to be readable; any removed focus outline.
- Invented biographical facts, employers, or metrics.
