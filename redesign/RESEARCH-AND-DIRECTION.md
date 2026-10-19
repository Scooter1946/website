# Three new directions for Justin Chen

Research completed before implementation, October 15, 2026. See the detailed briefs in `.agents/codex-team/research-flow.md` and `research-portfolios.md` for source links and observations of real student portfolios.

## What the research changes

Flow means an understandable reading sequence, spacing that groups related material, and ordinary continuous scrolling. It does not require a scroll engine. The strongest work should appear before a long skills inventory. For this portfolio, the useful sequence is identity and education, tangible work, experience, personal context, contact. Keep work evidence close to each claim. A visually quiet page still needs contrast, visible keyboard focus, mobile targets, and a reduced-motion alternative.

Sources: [NN/g visual hierarchy](https://www.nngroup.com/articles/principles-visual-design/), [NN/g proximity](https://www.nngroup.com/articles/gestalt-proximity/), [NN/g scrolljacking](https://www.nngroup.com/articles/scrolljacking-101/), [Purdue career guidance](https://cco.purdue.edu/Students/ResumesAndCVs?tab=WritingtheResume), [GitHub README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes), [W3C reduced motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html), [web.dev animation performance](https://web.dev/articles/animations-guide).

## Cliche audit

The existing design stacks gradients, ambient blobs, a ticker, pulsing status, changing headline words, metric tiles, numbered sections, bento cards, pointer tilt, magnetic controls, and repeated reveal effects. Rebuild the presentation; retain factual data only. Avoid token-chips as decoration, generic aspirational slogans, false personal photography, fake project screenshots, and repeated arrows. New illustrations must explain a real project and be identified as conceptual where appropriate.

These are editorial choices, not an AI detector. Common patterns can be useful when their purpose is clear. [Anthropic frontend-design](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md) provides the aesthetic lens; [Vercel guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) inform implementation checks.

## Skill search evaluation

UI UX Pro Max's first design-system search, `student developer portfolio minimal`, returned a developer-tool documentation page with dark OLED styling; rejected as irrelevant to this brief. The narrower `personal portfolio` matched the product but recommended brutalism and Caveat/Quicksand, which conflict with the requested smooth neutral direction. Retain the relevant content-first storytelling and anti-template guidance; select the actual typography and colors deliberately below. Explicit UX queries returned applicable reduced-motion and excessive-motion guidance. Astro stack results support static markup and minimal client script. No incompatible recommendation was persisted as the design system.

## Draft A: Fieldwork

Palette: paper #F7F8F5, stone #E8EBE5, charcoal #26312D, secondary #5B655F, moss #466652, white #FFFFFF. Manrope for all text, with generous optical scale. A wide left-aligned introduction flows into a large beehive-system drawing and project stories of different sizes. Open spacing, not card chrome, separates work. The memorable detail is a new restrained engineering drawing grounded in the actual beehive monitor.

```text
name                         work / experience / contact
large introduction            concise education
project story          large sensor-system illustration
secondary project             secondary project
experience / personal context / direct email
```

## Draft B: Notebook

Palette: page #FCFCFA, pale gray #F0F0EC, ink #303332, secondary #626762, muted olive #526351. Newsreader for prose/display, Public Sans for navigation and metadata. A personal long-form introduction with wide margins leads to compact project notes and expandable details. Keep a comfortable reading measure and concise dated experience. The memorable element is prose typography, not newspaper rules, cream/terracotta, or a giant promotional headline.

```text
                  name / small navigation
margin context    personal introduction
                  selected work, reading-column rhythm
margin note       native expandable project notes
                  experience / about / contact
```

## Draft C: Studio

Palette: canvas #F5F7F8, white #FFFFFF, cool stone #E5EAEE, ink #263541, secondary #566674, slate blue #3D6076. Public Sans for all text. A persistent desktop identity/navigation rail accompanies a broad work column. Native project filters enhance a fully visible no-JS project collection. Use a new conceptual order-book visualization rather than stock imagery. Mobile becomes a normal stacked document.

```text
identity rail     work introduction / project filter
education         featured technical illustration
navigation        project index with varied detail
contact           experience / personal context
```

## Critique before coding

The three concepts differ in information architecture and reading behavior, not just color. Removed an initial newspaper direction because it risks replacing one stock aesthetic with another. No default gradient hero, three-feature-card section, hero metrics row, or copied macropad. Facts can be shared from `src/data/site.ts`; no old components, CSS, enhancement scripts, or visual assets may be imported. No new facts, photos, or project results. Preserve the existing no-resume-download preference. Label generic GitHub destinations honestly, omit unsupported project demo links, and rewrite references to the old macropad/old site design when used.

## Delivery and checks

Three independently addressable Astro drafts under `/drafts/`, plus a comparison page. Existing homepage stays intact during comparison. Typecheck, static build, desktop/mobile visual inspection, anchor destinations, keyboard focus, no-JS readability, reduced motion, overflow, and relevant interaction checks. Local preview remains running for the user's return; no deployment or push.
