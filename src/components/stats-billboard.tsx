"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { APPS } from "@/data/apps";

const EASE = [0.2, 0.9, 0.3, 1] as const;

function totalInstalls() {
  return APPS.reduce((sum, a) => {
    const n = parseInt((a.playStoreInstalls ?? "0").replace(/\D/g, ""), 10) || 0;
    return sum + n;
  }, 0);
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`;
  return `${n}`;
}

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }
    let raf = 0;
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.floor(easeOut(p) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

export function StatsBillboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  const installsTarget = totalInstalls();
  const apps = useCountUp(APPS.length, inView);
  const installs = useCountUp(installsTarget, inView);
  const categories = useCountUp(6, inView);

  const stats = [
    { label: "Apps Shipped", value: apps, display: `${apps}+` },
    {
      label: "Total Installs",
      value: installs,
      display: formatCompact(installs),
    },
    { label: "Categories", value: categories, display: `${categories}` },
    { label: "Platforms", value: 2, display: "iOS · Android" },
  ];

  return (
    <section
      ref={ref}
      aria-labelledby="stats-heading"
      className="dark-section relative w-full overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 120%, color-mix(in oklab, var(--electric) 20%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 py-28 sm:px-8 sm:py-36">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-2xl"
          >
            <p className="eyebrow mb-4" style={{ color: "var(--electric-soft)" }}>
              ● The Numbers
            </p>
            <h2
              id="stats-heading"
              className="display-tight text-[clamp(2.4rem,6.5vw,5.5rem)]"
            >
              Quietly at work on <span style={{ color: "var(--electric-soft)" }}>millions</span> of phones.
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            >
              <p
                className="display-tight mb-3 tabular-nums"
                style={{
                  fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
                  letterSpacing: "-0.055em",
                  color: "#fff",
                }}
              >
                {s.display}
              </p>
              <p
                className="text-[12px] uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.22em",
                  color: "oklch(0.65 0.008 260)",
                }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
