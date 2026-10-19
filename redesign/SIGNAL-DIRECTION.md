# Signal — compact cinematic direction

## Current refinement: liquid currents and working project illustrations

Keep the accepted compact personal layout. Replace the separate bubble volumes with continuous, broad liquid currents: layered flowing S-curves in mist, sage, and pearl blue. Maintain dark foreground text and native scrolling. Static gradients and compositor transforms provide continuous flow without animated full-screen blur/turbulence or a 3D renderer. Three or four overlapping surfaces carry the motion, with gentle scroll/pointer response and the existing pause control.

Replace the tiny static project sketches with compact interactive illustrations inside each project column. PitchLoop cycles through prospects, calls, learning, and tool proposals. Beealive routes four generic sensor streams into local inference and an illustrative health alert. These are clearly conceptual flows, not live systems or fabricated telemetry. Let visitors advance them with buttons; provide subtle visible-while-in-view motion and stop it offscreen. Respect pause, reduced motion, and keyboard/touch input. Keep the macropad side interaction.

Critique: stretching circles into ovals would not satisfy the new liquid direction; use continuous edge-to-edge wave shapes instead. Generic spinning icons would not satisfy the request for dynamic project components; animate each project's actual information flow with readable states and controls.

## Current pivot: a moving environment, not a product stage

The user rejected the single-object stage and reported choppy scroll. Replace it with a compact personal portfolio in normal document flow, with equally weighted PitchLoop and Beealive stories. Keep the macropad as a small side illustration only. No sticky WebGL object or chapter-dependent object teleporting. Manual scrolling in both directions, including small viewports, is a required release check.

Plan: fog #f3f4f2, ink #253638, muted #526267, sage #d4e3dc, pearl blue #d7dfeb, soft sand #e8dfd1. Manrope for all reading/display; no tiny technical labels. Left-aligned name and introduction, small macropad aside on the right; two concise project columns; short background/contact. Large translucent bubble forms sit behind the whole page and move continuously, with a small native-scroll/pointer response. Their surfaces use static gradients and transform-only animation, without animated blur, WebGL, or scroll hijacking. Foreground text stays still and fully readable.

Critique: generic gradient haze would still feel static and miss the user's request. Give the backdrop visible rounded volume, overlapping silhouettes and specular rims, with restrained but perceptible drift. Avoid a single giant orb framing the macropad; distribute movement across the environment. The portfolio remains the foreground. Target around two desktop screens. Preserve pause and reduced-motion controls, and use direct manual scrolling rather than relying only on anchor screenshots.

Manual validation: used actual browser wheel scrolling at 714×612, 1280×800, and 375×812. Scrolled in short and long increments through the introduction, both projects, and the lower page; reversed direction repeatedly. Foreground content moves in document flow with no object handoffs or pinned-stage jumps. Read the backdrop wrapper and surface transforms before/after scroll to confirm both parallax and independent ambient movement. Paused, scrolled again, and confirmed both transform values remained identical; resumed successfully. Tested the macropad with Enter and native project details with Enter. No horizontal overflow at these sizes. The desktop page is 1,844px at an 800px viewport, about 2.3 screens. These are manual behavior checks, not a measured FPS claim. Reduced-motion behavior was source-reviewed, not OS-emulated.

Implementation: five composited bubble wrappers with static gradient surfaces and transform-only drift. Native scroll updates targets; one on-demand RAF interpolates transforms without per-frame layout measurement. No canvas, Three.js, modal layer, scroll interception, or chapter detection is loaded by Signal. Body resize observations refresh the scroll range after font loading or disclosure changes. All content and native details remain readable without JavaScript; no-JS ambient motion stays paused.

## October 16 refinement: personal, tactile, continuous

The user likes the scroll disassembly but finds the white/black contrast too commercial. Replace the Beealive centerpiece with the existing macropad project, keep PitchLoop, and keep the short structure. Palette: mist #f0f2ef, pale stone #e5e9e5, graphite #26332f, muted slate #52635e, sage #527568, steel #496878. A continuous mist-to-stone background replaces all dark section cuts; dark text keeps reading contrast. Keep Manrope, slightly smaller headings, and a personal introduction rather than a product slogan.

Layout: centered personal introduction above the assembled macropad; left-aligned macropad story beside its separated keycaps, plate, circuit layer, and hinged case; right-aligned PitchLoop story beside its feedback loop; concise contact. The scroll sequence is the one expressive element. Critique: merely recoloring the prior generic signal core would miss the request; replace its geometry with a recognizable 5×5 keypad informed by the existing homepage. This is a newly authored conceptual cutaway, not exact CAD. Facts are limited to the project record: RP2040 firmware, layered mapping, RGB, hinged/latchable enclosure. A generic GitHub profile must not be labeled a project repository.

Validation for this refinement: production build succeeds; Astro check has zero errors/warnings and one existing homepage hint. Browser verified at 375×812, 768×1024, and 1440×900 with no horizontal overflow. The circuit board was raised clear of the lower shell after visual inspection. The macropad details dialog opens, closes with Escape, and restores focus. Secondary text contrast is 5.18:1 against the darkest new background, and blue accent text is 4.84:1. Desktop reading length remains 2,706px at 900px height. Static SVG fallbacks were updated to the same macropad imagery; reduced motion remains supported. The 3D dependency retains its existing bundle-size warning.

The following sections record the October 15 design before this refinement.

User brief: rebuild from scratch; futuristic big-tech product-demo feel, short page, only standout projects. Latest brief supersedes the Workbench direction. Keep factual content only and no resume download.

## Design plan and critique

Palette: porcelain #f1f3f5, titanium #b8c1ce, ink #090c12, frost #f8fbff, amber #ffcb76, ice #9ccfff. White opening, dark project theater, white close. Color identifies Beealive's physical signals and PitchLoop's software loop. Avoid neon gradients, fake terminal chrome, random HUDs, decorative grids, generic rounded-card stacks.

Typography: self-hosted Manrope variable for a precise, open geometric display and body; JetBrains Mono only for short engineering captions. Hero 88–132px desktop / 52px mobile; project titles 66–92px / 48px; body17–19px. Left-align project explanations; centered opening headline. Sentence case.

Structure / rough desktop height: 90svh opening + 84svh Beealive + 84svh PitchLoop + ~48svh concise about/contact = about three screens. One continuous WebGL stage behind normal flowing semantic content, no scroll capture or mandatory watch time. Direct anchors skip to either project. No skills wall, timeline, smaller projects, maze, gallery, or extra filler.

    [ Justin Chen           Beealive  PitchLoop  Contact ]
    [             Built to sense.                       ]
    [               Made to act.                        ]
    [               titanium core                       ]
    [ EE at Purdue                      explore work ↓  ]
    [ Beealive story       core opens to four inputs    ]
    [ orbital agent loop           PitchLoop story      ]
    [ short background             email / social links ]

Original visual language: a machined hexagonal signal core transitions into four sensor inputs, then a three-part feedback loop. These are clearly labeled conceptual system illustrations, not claims about hardware geometry. Each project carries its actual result and a Devpost source link. The artifact, scale, scene handoff, and lighting do the storytelling; copy stays readable in normal document flow.

Critique before implementation: the skill's generated Rubik/Nunito ecommerce typography and generic hero/features pattern are off-target, so reject those specifics. Retain its monochrome/contrast foundation, input accessibility, and scrub guidance. Avoid the previous alternating text-and-small-illustration layout: commit to one full-viewport stage, giant type, sharp light/dark cut, and continuous material transformation. Four content beats is the hard limit. Motion should explain sensing and acting; remove any decoration that doesn't.

Sources: .agents/codex-team/cinematic-research.md, Apple MacBook Pro https://www.apple.com/macbook-pro/, NVIDIA RTX50 https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/. Research inference: continuity and large artifacts make the scene feel cinematic; those sources do not establish an engagement benefit. Implementation uses native scroll, one render loop, bounded pixel ratio, on-demand frames, static SVG fallbacks, reduced-motion and pause.

## Implementation and verification

Implemented independently at `/drafts/signal/`, using new markup, styling, orchestration, and original procedural Three.js geometry. Only Beealive and PitchLoop are featured. Project explanations use native dialogs so they do not extend the reading path. The desktop page measured 2,706px at a 900px viewport, approximately three screens. No original homepage components are imported.

Browser checks covered 1440×900, 768×1024, 699×612, and 375×812: no horizontal overflow, readable project controls, responsive visual sizing, anchor navigation, and pause/resume. Mobile art enters below the copy as the visitor scrolls. Dialog checks covered opening, Escape, focus restoration, and scroll lock. No browser console errors were recorded. Reduced-motion and no-WebGL fallback paths were reviewed in code; actual reduced-motion device emulation and physical-phone frame-rate profiling were not performed.

Astro check: zero errors, zero warnings, one existing JSON-LD hint on the original homepage. Production build succeeds; Vite reports the shared Three.js bundle size (about 143 KB gzip). Geometry is rendered on demand with DPR capped at 1.5; the 3D module loads dynamically and is skipped for reduced-motion visitors. These checks do not establish a universal frame-rate guarantee.

## Liquid refinement verification — October 16, 2026

- Replaced bubble surfaces with three continuous liquid currents; ambient movement and bounded scroll/pointer parallax use separate transform layers.
- Replaced project sketches with interactive PitchLoop stages and four-stream Beealive illustration. Kept the macropad's keyboard-accessible layer toggle.
- Manually tested wheel scrolling down and up, desktop 1280×800 and phone 375×812, PitchLoop click/Enter advancement, Beealive signal/clear state, and macropad Enter toggle.
- Verified global pause freezes the exact background and pulse transforms. Project animations stop offscreen; reduced-motion CSS and preference listeners disable ambient movement.
- No horizontal overflow at either tested width; desktop page is 2026px tall, phone 2714px. Browser console had no errors.
- Astro build passed. Astro check: 0 errors, 0 warnings, one pre-existing homepage structured-data hint. Existing Workbench bundle-size warning remains unrelated to Signal.
- Screenshots: public/redesign/previews/signal.png and signal-projects.png.

## Organic liquid and restored original scenes — next refinement

Keep the established Manrope typography, left-aligned introduction, paired project columns and neutral colors: paper #f3f4f2, ink #253638, sage #c3d0c7, mist #d9e3e1, chalk #f8faf7. Replace the three horizontally translated sheets with one continuous domain-warped pigment field. Its irregular boundaries should stretch, fold and merge, with shallow highlights that suggest liquid rather than separate circles or repeated waves. Limit contrast behind text and render resolution for smooth native scrolling. Pause and reduced motion freeze the field.

Restore the existing Three.js project scenes from the earlier drafts inside the current compact project columns. Reuse their original geometry; do not substitute diagram nodes. Controls remain keyboard accessible and scenes stop offscreen. Do not make any one project a full-page centerpiece.

Critique before building: parallel horizontal bands read as water-wave decoration, while the latest diagrams discard the user's requested original interactions. The revised field changes shape in two dimensions, and restoring original objects keeps the portfolio's software/hardware character. Preserve the accepted page rather than starting another layout.

Performance reference: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices (bounded drawing-buffer size and deliberate graphics resource cleanup).

## Final verification — organic liquid and restored scenes

- Replaced SVG wave bands with a continuous domain-warped liquid shader. Bounded to a 760px longest drawing-buffer edge and approximately 30 background draws per second, leaving foreground models at native responsiveness. Neutral colors stay readable behind content.
- Restored the original Three.js geometry from Signal (macropad and PitchLoop orbit) and Workbench (Beealive instrument). Adapted framing to the existing compact hero and paired project columns; no replacement flow diagrams remain.
- Browser QA at 1280x800 and 375x812: wheel scrolling, reverse scrolling, keyboard macropad opening, project transitions and assembly controls, no horizontal overflow. Phone page remains about 3008px tall.
- Compared paused browser screenshots across separate calls: exact byte equality, confirming the backdrop and visible models stay still. Final browser error log was empty.
- Final Astro check: 31 files, 0 errors, 0 warnings, 0 hints. Build passed; shared Three.js bundle retains Vite's >500kB advisory and loads on demand.

## Quieter material, larger objects, revised selection
Preserve the light neutral palette and Manrope hierarchy. Lower the liquid's contrast, blur sharp menisci, reduce fine warping and slow its evolution. Increase the PitchLoop viewport to 292px (240px on mobile), and keep the CPU on the same scale. The CPU is explicitly in progress; no source link or completed-performance claims until the user supplies them.

Replace Beealive in Signal with the CPU. Add Sift as a horizontal project below the paired columns, balancing a tactile receipt interaction with a short description; this avoids shrinking three visuals into narrow columns. Keep PitchLoop's original 3D geometry and hero macropad. Sift facts: user supplied fourth at HackMIT; public HackMIT project page supports receipt extraction, policy checks and human review. Its demo uses clearly illustrative sample values, not real receipts.

Critique: another full-screen project would lengthen the portfolio unnecessarily. A paired top row and compact horizontal Sift row retain large, useful visuals with a short reading path. The backdrop should now support these objects instead of competing with them.

Validation: Astro check passes with zero errors, warnings, or hints. Production build passes (Three.js chunk-size advisory remains). Manually checked desktop 1280x800 and phone 375x812; CPU open/close, keyboard controls, Sift match/mismatch, pause/resume, and reverse scrolling. Fixed mobile Sift clipping. Paused screenshots matched exactly. No browser console errors. CPU source link intentionally omitted; Sift links to its HackMIT entry because no matching repository was found under Scooter1946.

## Compact scroll reveals — October 16, 2026

Keep the established Manrope, neutral paper #f3f4f2, ink #253638, sage #c3d0c7, mist #d9e3e1 and quiet liquid background. Promote Sift alongside the in-progress CPU, move PitchLoop into a secondary index, and keep the macropad as a personal hardware side piece. Six smaller projects fit in a two-column index (one column on phones); the previously excluded maze stays excluded.

### Interaction options and decision

| Approach | Benefits | Costs and failure modes | Decision |
| --- | --- | --- | --- |
| Pin each scene for several viewports | Precise sequencing, maximum inspection time, cinematic framing | Inflates page length, repeated stops interrupt reading, harder on phones and reduced-motion visitors | Reject: conflicts with short portfolio |
| One shared sticky visual with chapter changes | Reuses screen space, can compare projects in one stage | Needs dedicated travel distance, creates a single dominant centerpiece, weak project-to-visual association on small screens | Reject: repeats the spotlighting problem |
| Trigger a timed animation on entry | Adds no scroll distance, simple and inexpensive, easy static fallback | Can finish while visitor looks elsewhere; reverse scrolling doesn't retrace it; replay requires controls | Useful for tiny feedback, not the main reveal |
| Scrub short reveals inside normal document flow | Zero added scroll distance, immediate relation between movement and visual, reversible, works with wheel/touch/keyboard | Less inspection time; fast scrolling can skip intermediate poses; must fit the full reveal within the visible zone | Selected: short bounded reveal windows, legible static final states, optional Sift controls |

The scene center travels from approximately 82% to 34% of viewport height. Desktop hero assembly opens during its first 160px of scroll at an 800px viewport, before the keycaps reach the sticky header. No pinning, scroll interception, snapping, or spacer sections. The rendering coordinator batches geometry reads, uses a short 90ms easing response, stops after settling, and skips offscreen scenes. A pause control freezes motion; reduced motion provides a separated macropad and completed die view. Sift's buttons remain optional for closer inspection and retain a visitor's manual choice.

Critique before building: keeping the orbit visual would continue to overstate PitchLoop. Moving it to a quiet index preserves the work without giving it hero status. Replacing the CPU stack with an etched die avoids generic mechanical blocks. The macropad's exploded view must reveal recognisable components rather than extra slabs, so its controller board, contacts, switch stems, sockets, keycaps and hollow enclosure are separately modeled. Exact board dimensions/layout remain illustrative because no project CAD was supplied.

References: [Adafruit assembly](https://learn.adafruit.com/neokey-emoji-keyboard/assembly), [Chrome scroll animation performance](https://developer.chrome.com/blog/scroll-animation-performance-case-study), [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines). UI UX Pro Max's local animation search reinforced reduced-motion handling, avoiding scroll-jacking, and limiting simultaneous focal motion.

### Final validation of compact scroll flow

Astro check: 36 files, zero errors/warnings/hints. Production build passed; shared Three.js chunk-size advisory remains. Browser review covered desktop 1280x800, tablet 768x1024 and phone 375x812, with no horizontal overflow. Desktop document is approximately 2514px tall; phone approximately 3610px. These are ordinary document lengths, with no animation spacer sections.

Manually verified: macropad assembles and separates through keyboard/native scrolling; complete desktop reveal remains below the sticky header; controller board is visible at the front/right; CPU moves Decode to Write back and rewinds on reverse scrolling; Sift detects the sample mismatch without clicks; manual Match choice persists while scrolling. Pause screenshots from separate calls were byte-identical. No browser console errors. A review caught and fixed an OS-motion-preference listener bypassing pause. Reduced-motion branches were inspected in code, not emulated through an OS setting or benchmarked on a physical phone.

Source links for Order-Book-Sim and roboArm were verified on the owner's public GitHub and replaced generic profile links. Sift retains its HackMIT entry. CPU and hardware artwork remain clearly illustrative rather than claims of an exact fabricated CPU or exact CAD dimensions.

## Earlier reveals and dimensional CPU — October 16, 2026

Shorten the viewport reveal window from center positions 82%–34% to 94%–62%. This completes the visual in the lower middle of the screen, leaving the rest of the normal scroll for inspection. The desktop macropad opens over the first 90px (88px at an 800px viewport), with a bounded 50px downward offset that gently holds it in view. No extra sections, pinning, or scroll interception. Phone reveals use the same viewport-aware window as the projects.

Six dashed leaders project from the actual 3D keycaps, rim, switches, NeoKey PCB, RP2040 controller and case. They fade in progressively during separation and follow the parts when the object tilts. The liquid retains its low-contrast neutral colors but has slightly higher opacity, faster organic evolution, stronger scroll advection and a soft pointer-centered eddy.

Replace the flat CPU view with a lazy-loaded Three.js exposed package: thin carrier, raised silicon die, asymmetric cell banks, etched routes, 58 fine arched bond wires and underside pin hints. A short camera orbit exposes its depth; a restrained pulse traces the illustrative route. It is an illustrative semiconductor study, not a claim about the unfinished project's fabricated layout. Static SVG fallback, reduced-motion pose, pause controls and resource teardown remain available.

Validation: production build passed (existing shared Three.js size advisory); Astro checked 37 files with zero errors, warnings or hints. Manually inspected 1280×800 and 375×812 views: short-scroll expansion, leader alignment, Sift automatic result and manual match/mismatch, CPU depth/orbit and reverse progress, and absence of horizontal overflow. Phone macropad was fully expanded at scrollY 160 with the object near the viewport middle. Sift was fully complete with its cards centered around y473 on the phone. Paused screenshots taken in separate calls were byte-identical; browser error log was empty. Reduced-motion behavior was source-reviewed rather than OS-emulated.

## Visible CPU motion and quiet navigation entrance — October 17, 2026

The early scroll reveal made the CPU reach its resting pose before a visitor necessarily noticed its movement. Keep that compact reveal, but add a slow bounded yaw/tilt and repeated signal pulse while the CPU is visible. Stop its animation loop outside the viewport, on pause, when the document is hidden, during context loss, and for reduced motion. Resume from the same elapsed time rather than jumping after an interruption.

The navigation enters with a short opacity/8px translation animation. Its background starts transparent and gains opacity over the first 180px of native scroll. Keyboard focus reveals navigation immediately; reduced motion skips the entrance. This keeps navigation available without placing an opaque bar over the initial composition. UI UX Pro Max's reduced-motion and excessive-motion guidance informed the single gently moving foreground object and static accessibility alternative.

Validation: production build and Astro checks passed (37 files, zero errors/warnings/hints; existing Three.js bundle-size advisory). Browser screenshots at unchanged scroll position showed distinct CPU orientations several seconds apart. Pause screenshots across separate calls matched byte-for-byte. Reload inspection caught the navigation mid-fade; its surface opacity was zero at the top and one after scrolling. Browser error log was empty. Reduced-motion and offscreen/hidden-document stop paths were reviewed in source.

### Passive liquid flow

Increase the time-driven field evolution and add a slow two-axis drift to the liquid domain. The prior shader already ran continuously, but its independent motion was too slow to read without scrolling. Keep the existing palette, opacity and blur; stronger idle movement comes from changing shapes rather than higher contrast. Scroll/pointer interaction, pause, reduced motion and hidden-document suspension remain intact.

### Two background studies

Add a draft-only comparison control and shareable `?background=pigment` / `?background=satin` URLs. Switching preserves scroll position and changes the existing canvas rather than creating another graphics context. Pigment uses stronger sage/blue color, crisper edges, higher opacity and faster independent flow. Satin replaces the fractal cloud field with long reflective folds, fine directional striations and restrained warm/cool highlights. Both keep native scrolling, autonomous motion, pointer response, pause and reduced-motion support. Controls expose their selection with aria-pressed and retain 44px touch targets. A static satin gradient remains available if WebGL cannot initialize.

### Readable pigment studies

Preserve the original Pigment as a comparison and retain old Satin URLs. Add three shareable studies: `neutral` keeps Pigment's evolving shape with stone, chalk and warm gray colors at lower amplitude; `selective` uses the same neutral palette with spatial fades around the opening hardware and contact area, leaving work, the project index and About on paper; `fuller` replaces the layered turbulent field with low-frequency connected pools and rounded fronts in the neutral palette. The default without a query is Neutral.

Selective fades are tied to measured document sections, not arbitrary scroll thresholds. On phones, use the macropad's area rather than the text-heavy opening as the visual region. Feathered vertical boundaries and a right-side bias keep reading areas quiet without a hard background switch. The background remains animated at rest; pause and reduced-motion behavior remain available. Retain dark text contrast rather than reducing text opacity. A conservative calculated neutral-background sample (217,222,215) against muted text #526267 gives approximately 4.66:1; actual colors vary with the shader and this is not a whole-site accessibility audit.

Validation: built all variants and checked 37 source files with zero errors/warnings/hints. Manually inspected desktop and 375px phone layouts, switching without scroll resets, the selective fade through Work and reappearance near Contact, fuller movement without input, and pause (byte-identical screenshots across calls). Fixed draft controls covering footer links by adding clearance below the footer. Browser error log was empty; existing shared Three.js bundle advisory remains. Reduced motion was source-reviewed.

### Bright shape studies: Blobs, Pools, Jelly

User correction: retain Original Pigment's energy and full-page coverage. Gray/stone feels gloomy; selective placement feels too limited. The next three drafts therefore change the shape construction and use brighter mint, sky blue and pale yellow on warm white. All three bypass the old turbulent noise field entirely.

- `blobs`: smooth metaballs with rounded boundaries that join and separate; weighted color blending at joins.
- `pools`: wide connected liquid sheets with a few clean flowing boundaries and subtle edge highlights.
- `jelly`: separate elliptical forms with domed shading and specular rims, offering depth rather than smoke.

Keep Original in the switcher, preserve previous query URLs, and default new unparameterized visits to Blobs. Keep full-page passive motion, gentle scroll/pointer response, the same foreground layout, pause/reduced-motion support, mobile touch targets and footer clearance.

Validation: production build passed and Astro checked 37 files with zero errors/warnings/hints. Browser inspection confirmed three distinct rendered shape systems and changed idle screenshots for each without scroll input. No shader/browser errors were reported. These are comparison drafts, not a selected final direction.


## Typography comparison — October 17

Original Pigment stays the default. Three query-driven typography drafts share all content and interactive scenes: `type=copper`, `type=ink`, and `type=highlight`. Copper echoes the main site's Space Grotesk / copper emphasis; Ink uses stronger Manrope with restrained teal underlines; Highlight uses warm marker accents and rounder secondary project cards. Descriptions increase to 18px desktop / 17px mobile, project outcome statements to 24px / 22px. Accent appears only in selected phrases, achievements and actions. Secondary projects become individually linked rounded surfaces with readable descriptions.

Macropad starts expanded and assembles as the visitor scrolls. On phones it stays expanded while entering view and closes as it passes upward; reduced motion keeps its layers visible without animation. No extra scroll runway.

Validation: built and type-checked; manually reviewed all three typography modes on desktop and at 390px, checked overflow and scroll-driven macropad progress.


## Expanded secondary projects — October 17

Copper is now the selected typography for Signal. New `projects=cards|rows|compact` drafts vary only the More projects section. Cards show purpose, technology tags, implementation notes, and source links; rows give the description more horizontal room; compact cards keep purpose and stack visible with native disclosure for deeper notes. All six entries share one typed data source. No new featured projects or scroll runway.

Macropad timing: hold fully split for the first ~100px at an 800px viewport, then assemble over ~320px with a smoothstep curve. On phones, hold until its center passes 58% of the viewport, then close over half a viewport. Reduced-motion keeps the exploded static view.

Copy checked against GitHub Order-Book-Sim, cv-number-detector, roboArm, Devpost PitchLoop / BeeAlive, and the local site implementation. The arm README identifies the planar two-joint prototype with base rotation planned. BeeAlive is described as a prototype with incomplete integration; unsupported accuracy and fully integrated sensor claims are omitted. Website copy reflects Three.js / WebGL rather than the older CSS-only / 2KB claim.

Validation: Astro build completed; Astro check reports 41 files with zero errors, warnings, or hints. Manually reviewed all three layouts at 1280px and 390px with no horizontal overflow. Technical disclosures support keyboard Enter and retain open choices while comparing layouts. Browser console had no errors. Desktop pad remained fully split at scrollY 80 and 59% open at scrollY 240; no additional page spacer was added.


## Cards interaction pass — October 17

Cards is now fixed and the comparison toolbar is removed. Each project is one native full-surface link, with no nested controls. Cards reveal once on entering the viewport (20px / 620ms, 65ms column stagger). Fine-pointer hover lifts 6px and moves a subtle copper light beneath the content; the link arrow also responds. Idle cards stay still for reading. Keyboard focus reveals any pending card immediately and outlines the full surface. Reduced motion disables transforms and entrances; Pause motion makes every card visible and still. JavaScript failure leaves the content visible by default.

Validation: build succeeded; Astro check reports 42 files, zero errors/warnings/hints. Browser verified six native links/no nested controls, scroll reveal (pending cards decreased from six to three), actual pointer hover at translateY(-6px), GitHub navigation from the card, keyboard focus outline, pause visibility, and 390px phone layout without overflow. No browser console errors.


## Accolade emphasis and hero scale — October 17

Accolades now use larger Space Grotesk figures, pale copper surfaces, and a restrained copper top edge. They share the project-card entrance controller (one reveal per visit, 65ms stagger), focus visibility, pause, and reduced-motion behavior. No counting effects or idle movement. The desktop macropad column grows responsively from 380px up to 500px; its top offset is reduced so the larger exploded model and labels fit comfortably beside the introduction.

Validation: build and Astro check passed (42 files, no diagnostics). At a 1280px viewport, the macropad canvas grew from 380px to about 455px with no overflow or label clipping. Three accolade panels were pending above the fold, then all visible after scrolling into About. Checked 390px layout: panels fit without horizontal overflow.


## Plain-language copy pass — October 18

Replaced broad slogans with direct descriptions. Removed the location/physical-world footer, repeated category labels and topic tags, generic status labels, and secondary section taglines. Introduction now states the degree and current CPU project; headings are Selected projects, More projects, and About me. Project descriptions keep concrete implementation details, stacks, links, awards, and prototype status. Demo / CPU illustration labels remain to distinguish the visuals from real project output. The macropad only shows its initial scroll instruction; no ongoing decorative narration.

Validation: build and Astro check passed (42 files, zero diagnostics). Reviewed desktop and phone text wrapping, verified removed phrases are absent from rendered page, and saw no browser console errors.

## Typography hierarchy — October 18

Standardized section headings across Selected projects, More projects, and About me. Desktop: 48px maximum section headings, 32px featured project titles, 24px secondary card titles, and 18px descriptions. Phone: 34px / 28px / 22px / 17px respectively. Descriptions now use regular body emphasis instead of competing with project names. Copper accents, interactions, and existing copy are preserved. The introduction now contains only the name, degree, and project link; the generic software/hardware headline was removed.

Validation: build passed; Astro check reports 42 files and zero errors, warnings, or hints. Browser reviewed at 1280px and 390px: heading roles match the intended sizes, cards wrap cleanly, and neither layout overflows horizontally. No browser console errors. Screenshot: public/redesign/previews/signal-type-hierarchy.png.
