import type { MacropadScene } from "./signal-macropad-scene";

export function initPad() {
  const host = document.querySelector<HTMLElement>("[data-pad-scene]");
  const piece = host?.closest<HTMLElement>(".desk-piece");
  const note = piece?.querySelector<HTMLElement>("[data-pad-note]");
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let scene: MacropadScene | null = null;
  let loading = false,
    disposed = false,
    visible = false,
    paused = false;
  let progress = 1,
    pointerX = 0,
    pointerY = 0;
  piece?.style.setProperty("--pad-open", "1");
  if (note) note.textContent = "Scroll to assemble";
  const draw = () => {
    if (disposed || paused || !visible || document.hidden) return;
    const amount = preference.matches ? 1 : progress;
    piece?.style.setProperty("--pad-open", String(amount));
    if (note && !scene)
      note.textContent =
        !preference.matches && amount > 0.98 ? "Scroll to assemble" : "";
    scene?.update({
      progress: amount,
      pointerX,
      pointerY,
      reduced: preference.matches,
    });
  };
  const mount = async () => {
    if (!host || loading || scene || disposed) return;
    loading = true;
    try {
      const { initMacropadScene } = await import("./signal-macropad-scene");
      if (disposed || !visible) return;
      scene = initMacropadScene(host);
      draw();
    } catch {
      /* The inline layered illustration remains available. */
    } finally {
      loading = false;
    }
  };
  const pointer = (event: PointerEvent) => {
    if (!host || paused || preference.matches || event.pointerType !== "mouse")
      return;
    const rect = host.getBoundingClientRect();
    pointerX = Math.max(
      -1,
      Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
    );
    pointerY = Math.max(
      -1,
      Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    draw();
  };
  const leave = () => {
    pointerX = pointerY = 0;
    if (!paused) draw();
  };
  const visibility = () => {
    if (!document.hidden && !paused) draw();
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) {
        if (!scene) void mount();
        else draw();
      }
    },
    { rootMargin: "100px" },
  );
  if (host) observer.observe(host);
  host?.addEventListener("pointermove", pointer, { passive: true });
  host?.addEventListener("pointerleave", leave);
  preference.addEventListener("change", draw);
  document.addEventListener("visibilitychange", visibility);
  return {
    setProgress(value: number) {
      if (paused) return;
      progress = value;
      draw();
    },
    setPaused(value: boolean) {
      paused = value;
      if (!paused) draw();
    },
    dispose() {
      disposed = true;
      observer.disconnect();
      scene?.dispose();
      host?.removeEventListener("pointermove", pointer);
      host?.removeEventListener("pointerleave", leave);
      preference.removeEventListener("change", draw);
      document.removeEventListener("visibilitychange", visibility);
    },
  };
}
