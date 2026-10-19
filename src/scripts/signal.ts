import { initBackdrop } from "./signal-backdrop";
import { initPad } from "./signal-pad";
import { initCpuDemo } from "./signal-cpu";
import { initSiftDemo } from "./signal-sift";

const backdrop = document.querySelector<HTMLElement>("[data-backdrop]");
const motion = document.querySelector<HTMLButtonElement>(".motion-control");
const header = document.querySelector<HTMLElement>(".site-header");
const preference = matchMedia("(prefers-reduced-motion: reduce)");
let background = backdrop ? initBackdrop(backdrop) : null;
let cpu = initCpuDemo();
let sift = initSiftDemo();
let pad = initPad();
let paused = false,
  disposed = false,
  frame = 0,
  previous = 0;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const scenes = [
  {
    host: document.querySelector<HTMLElement>("[data-pad-scene]"),
    // The pad starts exploded so the first frame does not animate it open.
    value: 1,
    kind: "pad",
  },
  {
    host: document.querySelector<HTMLElement>("[data-cpu-demo]"),
    value: 0,
    kind: "cpu",
  },
  {
    host: document.querySelector<HTMLElement>("[data-sift]"),
    value: 0,
    kind: "sift",
  },
];

function draw(time: number) {
  frame = 0;
  if (paused || disposed || document.hidden) return;
  const dt = previous ? Math.min(0.05, (time - previous) / 1000) : 1 / 60;
  previous = time;
  const ease = preference.matches ? 1 : 1 - Math.exp(-dt / 0.09);
  // Read all geometry before writing any styles; native scroll is never intercepted.
  const measurements = scenes.map((scene) => ({
    scene,
    rect: scene.host?.getBoundingClientRect(),
  }));
  let unsettled = false;
  for (const { scene, rect } of measurements) {
    if (!rect || rect.bottom < -40 || rect.top > innerHeight + 40) continue;
    const center = rect.top + rect.height / 2;
    // Hold the exploded view, then assemble over a broad native-scroll range.
    // Desktop: ~100px hold + ~320px assembly at an 800px viewport.
    // Phone: hold until the pad passes 58% of the viewport, finish near 8%.
    const assembly =
      innerWidth > 760
        ? clamp(
            (scrollY - Math.min(110, innerHeight * 0.125)) /
              Math.min(360, innerHeight * 0.4),
          )
        : clamp((innerHeight * 0.58 - center) / (innerHeight * 0.5));
    const smoothAssembly = assembly * assembly * (3 - 2 * assembly);
    const target = preference.matches
      ? 1
      : scene.kind === "pad"
        ? 1 - smoothAssembly
        : clamp((innerHeight * 0.94 - center) / (innerHeight * 0.32));
    scene.value += (target - scene.value) * ease;
    if (Math.abs(target - scene.value) < 0.001) scene.value = target;
    else unsettled = true;
    if (scene.kind === "pad") pad.setProgress(scene.value);
    else if (scene.kind === "cpu") cpu.setProgress(scene.value);
    else sift.setProgress(scene.value);
  }
  if (unsettled) frame = requestAnimationFrame(draw);
  else previous = 0;
}
function request() {
  header?.style.setProperty("--header-surface", String(clamp(scrollY / 180)));
  if (!frame && !paused && !disposed && !document.hidden)
    frame = requestAnimationFrame(draw);
}
function updateMotion() {
  document.documentElement.classList.toggle("visuals-paused", paused);
  background?.setPaused(paused);
  cpu.setPaused(paused);
  sift.setPaused(paused);
  if (preference.matches && !paused) sift.setProgress(1);
  sift.setPaused(paused || preference.matches);
  pad.setPaused(paused);
  if (paused) {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
  } else request();
  if (!motion) return;
  motion.hidden = preference.matches && !paused;
  motion.setAttribute("aria-pressed", String(paused));
  motion.setAttribute(
    "aria-label",
    paused ? "Resume visual motion" : "Pause visual motion",
  );
  const label = motion.querySelector("[data-motion-label]");
  if (label) label.textContent = paused ? "Resume motion" : "Pause motion";
  const icon = motion.querySelector("span");
  if (icon) icon.textContent = paused ? "▷" : "Ⅱ";
}
motion?.addEventListener("click", () => {
  paused = !paused;
  updateMotion();
});
preference.addEventListener("change", updateMotion);
window.addEventListener("scroll", request, { passive: true });
window.addEventListener("resize", request, { passive: true });
document.addEventListener("visibilitychange", request);
updateMotion();
document.fonts.ready.then(request);
window.addEventListener("pagehide", () => {
  disposed = true;
  cancelAnimationFrame(frame);
  frame = 0;
  previous = 0;
  background?.dispose();
  background = null;
  cpu.dispose();
  sift.dispose();
  pad.dispose();
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    disposed = false;
    background = backdrop ? initBackdrop(backdrop) : null;
    cpu = initCpuDemo();
    sift = initSiftDemo();
    pad = initPad();
    updateMotion();
  }
});
