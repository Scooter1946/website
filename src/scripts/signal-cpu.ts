export type CpuDemoController = {
  setProgress(progress: number): void;
  setPaused(paused: boolean): void;
  dispose(): void;
};

type CpuScene = {
  update(progress: number, reduced: boolean): void;
  setActive(active: boolean): void;
  dispose(): void;
};
type Demo = {
  root: HTMLElement;
  host: HTMLElement;
  status: HTMLElement | null;
  progress: number;
  visible: boolean;
  paused: boolean;
  query: MediaQueryList;
  scene: CpuScene | null;
  loading: boolean;
  disposed: boolean;
  observer: IntersectionObserver | null;
  onMotion: () => void;
};

const active = new WeakMap<HTMLElement, Demo>();
const clamp = (value: number) =>
  Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
const phaseAt = (progress: number) =>
  progress < 0.22
    ? "Fetch"
    : progress < 0.48
      ? "Decode"
      : progress < 0.76
        ? "Execute"
        : "Write back";

function render(demo: Demo) {
  if (demo.disposed || demo.paused || !demo.visible || document.hidden) return;
  const progress = demo.query.matches ? 1 : demo.progress;
  const phase = phaseAt(progress);
  if (demo.status && demo.status.textContent !== phase)
    demo.status.textContent = phase;
  demo.scene?.update(progress, demo.query.matches);
  demo.scene?.setActive(!demo.query.matches);
}

async function mount(demo: Demo) {
  if (
    demo.loading ||
    demo.scene ||
    demo.disposed ||
    demo.paused ||
    !demo.visible ||
    document.hidden
  )
    return;
  demo.loading = true;
  try {
    const { initCpuScene } = await import("./signal-cpu-scene");
    if (demo.disposed || demo.paused || !demo.visible || document.hidden)
      return;
    demo.scene = initCpuScene(demo.host);
    render(demo);
  } catch {
    // The static SVG remains available if the WebGL scene cannot load.
  } finally {
    demo.loading = false;
  }
}

export function initCpuDemo(): CpuDemoController {
  let paused = false;
  let disposed = false;
  const demos: Demo[] = [];
  for (const root of document.querySelectorAll<HTMLElement>(
    "[data-cpu-demo]",
  )) {
    const existing = active.get(root);
    if (existing) {
      demos.push(existing);
      continue;
    }
    const host = root.querySelector<HTMLElement>("[data-cpu-canvas]");
    if (!host) continue;
    const demo: Demo = {
      root,
      host,
      status: root.querySelector<HTMLElement>("[data-cpu-status]"),
      progress: 0,
      visible: false,
      paused,
      query: window.matchMedia("(prefers-reduced-motion: reduce)"),
      scene: null,
      loading: false,
      disposed: false,
      observer: null,
      onMotion: () => {
        if (!paused) render(demo);
      },
    };
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              demo.visible = entries.some((entry) => entry.isIntersecting);
              if (!demo.visible) demo.scene?.setActive(false);
              else if (!paused && !document.hidden) {
                if (demo.scene) render(demo);
                else void mount(demo);
              }
            },
            { threshold: 0.01 },
          );
    demo.observer = observer;
    if (observer) observer.observe(root);
    else demo.visible = true;
    demo.query.addEventListener("change", demo.onMotion);
    active.set(root, demo);
    demos.push(demo);
    if (demo.visible) void mount(demo);
  }

  const onVisibility = () => {
    if (document.hidden) demos.forEach((demo) => demo.scene?.setActive(false));
    if (!document.hidden && !paused)
      demos.forEach((demo) => demo.visible && void mount(demo));
    if (!document.hidden && !paused) demos.forEach(render);
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    setProgress(progress) {
      if (disposed) return;
      const amount = clamp(progress);
      demos.forEach((demo) => {
        demo.progress = amount;
        if (!paused && demo.visible) {
          if (demo.scene) render(demo);
          else void mount(demo);
        }
      });
    },
    setPaused(value) {
      if (disposed || paused === value) return;
      paused = value;
      demos.forEach((demo) => {
        demo.paused = paused;
        if (paused) demo.scene?.setActive(false);
      });
      if (!paused && !document.hidden)
        demos.forEach(
          (demo) =>
            demo.visible && (demo.scene ? render(demo) : void mount(demo)),
        );
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibility);
      demos.forEach((demo) => {
        demo.disposed = true;
        demo.observer?.disconnect();
        demo.query.removeEventListener("change", demo.onMotion);
        demo.scene?.dispose();
        active.delete(demo.root);
      });
    },
  };
}
