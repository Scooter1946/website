import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STAGES = [
  { a: "IF", b: "fetch" },
  { a: "ID", b: "decode" },
  { a: "EX", b: "execute" },
  { a: "MEM", b: "memory" },
  { a: "WB", b: "writeback" },
];

const INSTRS = [
  { label: "lw x5", color: "var(--color-copper)" },
  { label: "add x6", color: "var(--color-violet)" },
  { label: "sub x7", color: "var(--color-teal)" },
  { label: "sw x7", color: "var(--color-graphite-2)" },
];

const CAPS = [
  "lw enters fetch — the pipeline starts to fill.",
  "two instructions in flight, one stage apart.",
  "three stages busy at once.",
  "four instructions overlapping — almost full.",
  "pipeline full: all five stages working at once. peak throughput.",
  "lw retires at writeback; the pipeline drains.",
  "two instructions left in flight.",
  "sw reaches writeback.",
  "all four complete — one finished per cycle once full.",
];

const MAX = 8;

export default function Pipeline() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCycle(4);
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
        const c = Math.round(self.progress * MAX);
        setCycle((prev) => (prev === c ? prev : c));
      },
    });
    ScrollTrigger.refresh();
    return () => st.kill();
  }, []);

  const inFlight = INSTRS.filter((_, i) => cycle - i >= 0 && cycle - i <= 4).length;

  return (
    <div ref={trackRef} className="pipeline-track relative my-16 h-[340vh]">
      <div className="pipeline-sticky sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-[20px] font-medium">
              <span className="text-copper">[RTL]</span> PicoCore — a 5-stage RISC-V core
            </h3>
            <span className="font-mono text-[12px] text-graphite-2">
              cycle {String(cycle + 1).padStart(2, "0")} / 09 · {inFlight} in flight
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {STAGES.map((s, i) => {
              const active = cycle - i >= 0 && cycle - i <= 3;
              return (
                <div
                  key={s.a}
                  className={`rounded-md border px-2 py-3 text-center transition-colors ${
                    active ? "border-teal bg-teal/10" : "border-ink/15 bg-paper-2/50"
                  }`}
                >
                  <div
                    className={`font-display text-[15px] font-medium ${
                      active ? "text-teal" : "text-ink"
                    }`}
                  >
                    {s.a}
                  </div>
                  <div className="font-mono text-[11px] text-graphite-2">{s.b}</div>
                </div>
              );
            })}
          </div>

          <div className="relative mt-3 h-14">
            {INSTRS.map((ins, i) => {
              const s = cycle - i;
              const visible = s >= 0 && s <= 4;
              const left = visible ? s * 20 + 1 : s < 0 ? -22 : 102;
              return (
                <div
                  key={ins.label}
                  className="absolute top-2 flex h-9 items-center justify-center rounded-md font-mono text-[12px] font-medium text-paper"
                  style={{
                    left: `${left}%`,
                    width: "18%",
                    opacity: visible ? 1 : 0,
                    background: ins.color,
                    transition:
                      "left .5s cubic-bezier(.2,.7,.2,1), opacity .35s ease",
                  }}
                >
                  {ins.label}
                </div>
              );
            })}
          </div>

          <p className="mt-6 max-w-xl font-mono text-[13px] leading-relaxed text-graphite">
            {CAPS[cycle]}
          </p>
        </div>
      </div>
    </div>
  );
}
