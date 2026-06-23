import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// bottom (substrate) → top (cap); each is an isometric layer of the chip
const LAYERS = [
  { c: "#3c2a20", pat: "none" }, // package substrate
  { c: "#e0613c", pat: "none" }, // silicon die
  { c: "#f47a4e", pat: "dots" }, // transistor layer
  { c: "#c1557b", pat: "linesH" }, // metal layer 1
  { c: "#d39440", pat: "linesV" }, // metal layer 2
  { c: "#f6d9c4", pat: "die" }, // cap
];
const N = LAYERS.length;

function patBg(pat: string): string | undefined {
  switch (pat) {
    case "dots":
      return "radial-gradient(circle, rgba(255,255,255,.45) 1.6px, transparent 1.7px)";
    case "linesH":
      return "repeating-linear-gradient(0deg, rgba(255,255,255,.34) 0 1px, transparent 1px 14px)";
    case "linesV":
      return "repeating-linear-gradient(90deg, rgba(43,28,20,.3) 0 1px, transparent 1px 14px)";
    default:
      return undefined;
  }
}

export default function ChipBuild() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setP(1);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const el = trackRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const q = Math.round(self.progress * 100) / 100;
        setP((v) => (v === q ? v : q));
      },
    });
    ScrollTrigger.refresh();
    return () => st.kill();
  }, []);

  const sep = 80 - p * 68; // exploded (80) → assembled (12)
  const scale = 0.9 + p * 0.12;
  const cap =
    p < 0.12
      ? "A chip is really just layers — stacked."
      : p < 0.55
        ? "Scroll to bring them together…"
        : p < 0.92
          ? "…aligning every layer…"
          : "Put them together and you've got a CPU.";

  return (
    <div ref={trackRef} className="pipeline-track relative my-12 h-[340vh]">
      <div className="pipeline-sticky sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-4xl px-6 text-center">
          <p className="mb-2 font-mono text-[12px] tracking-wide text-graphite">
            a peek at my hardware side
          </p>
          <h3 className="mb-8 text-[22px] font-semibold">How a chip comes together</h3>

          <div className="relative mx-auto" style={{ height: 440, perspective: "1200px" }}>
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: 200,
                height: 200,
                transform: `translate(-50%,-50%) rotateX(58deg) rotateZ(-45deg) scale(${scale})`,
                transformStyle: "preserve-3d",
              }}
            >
              {LAYERS.map((ly, i) => {
                const z = (i - (N - 1) / 2) * sep;
                const op = i === 0 ? 1 : 0.55 + p * 0.45;
                return (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: ly.c,
                      backgroundImage: patBg(ly.pat),
                      backgroundSize: ly.pat === "dots" ? "18px 18px" : undefined,
                      transform: `translateZ(${z}px)`,
                      opacity: op,
                      border: "1px solid rgba(255,255,255,.2)",
                      boxShadow: i === N - 1 && p > 0.9 ? "0 0 44px rgba(224,97,60,.55)" : undefined,
                    }}
                  >
                    {ly.pat === "die" && (
                      <div
                        className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-md"
                        style={{ background: "#e0613c", opacity: 0.85 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mx-auto mt-6 flex h-12 max-w-md items-center justify-center text-[15px] leading-relaxed text-ink/75">
            {cap}
          </p>
        </div>
      </div>
    </div>
  );
}
