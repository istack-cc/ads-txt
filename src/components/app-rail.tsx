"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { App } from "@/data/apps";
import { RailCard } from "@/components/app-card";
import { cn } from "@/lib/utils";

interface AppRailProps {
  kicker: string;
  title: string;
  italicWord?: string;
  apps: App[];
  seeAllHref?: string;
  id?: string;
}

export function AppRail({
  kicker,
  title,
  italicWord,
  apps,
  seeAllHref,
  id,
}: AppRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 4);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [apps.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 800);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (!apps.length) return null;

  const renderedTitle = italicWord
    ? (() => {
        const idx = title.indexOf(italicWord);
        if (idx === -1) return title;
        return (
          <>
            {title.slice(0, idx)}
            <span className="italic-serif" style={{ color: "var(--warm)" }}>
              {italicWord}
            </span>
            {title.slice(idx + italicWord.length)}
          </>
        );
      })()
    : title;

  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className="relative w-full py-14 sm:py-20"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        <div className="mb-6 flex items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.2, 0.9, 0.3, 1] }}
          >
            <p className="eyebrow mb-2" style={{ color: "var(--accent)" }}>
              {kicker}
            </p>
            <h2
              id={id ? `${id}-heading` : undefined}
              className="section-title text-[clamp(1.9rem,4.4vw,3rem)]"
            >
              {renderedTitle}
            </h2>
          </motion.div>

          <div className="flex shrink-0 items-center gap-2">
            <ArrowButton
              direction="left"
              enabled={canLeft}
              onClick={() => scrollBy(-1)}
            />
            <ArrowButton
              direction="right"
              enabled={canRight}
              onClick={() => scrollBy(1)}
            />
            {seeAllHref && (
              <Link
                href={seeAllHref}
                className="ml-2 hidden text-[13px] font-semibold transition-colors hover:opacity-70 sm:inline"
                style={{ color: "var(--accent)" }}
              >
                See all →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <div
          ref={scrollerRef}
          className="rail flex w-full gap-4 overflow-x-auto pb-4 pt-2 sm:gap-5"
          aria-label={title}
        >
          {apps.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: Math.min(i * 0.05, 0.35),
                ease: [0.2, 0.9, 0.3, 1],
              }}
              className="shrink-0"
            >
              <RailCard app={app} />
            </motion.div>
          ))}
          <span className="shrink-0 pr-2" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

function ArrowButton({
  direction,
  enabled,
  onClick,
}: {
  direction: "left" | "right";
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      onClick={onClick}
      disabled={!enabled}
      whileHover={enabled ? { scale: 1.08 } : undefined}
      whileTap={enabled ? { scale: 0.92 } : undefined}
      animate={{ opacity: enabled ? 1 : 0.3 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border",
        enabled ? "cursor-pointer" : "cursor-not-allowed"
      )}
      style={{
        borderColor: "var(--border-hover)",
        background: "var(--card)",
        color: "var(--ink)",
      }}
    >
      {direction === "left" ? (
        <ChevronLeft className="size-4" />
      ) : (
        <ChevronRight className="size-4" />
      )}
    </motion.button>
  );
}
