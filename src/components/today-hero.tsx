"use client";

import { motion } from "motion/react";
import { APPS, FEATURED_APPS } from "@/data/apps";
import { StoryCard } from "@/components/app-card";

const HEADLINE = [
  { text: "Apps that", italic: false },
  { text: "earn", italic: true },
  { text: "their spot", italic: false },
  { text: "on your", italic: false },
  { text: "home screen.", italic: true },
];

const EASE = [0.2, 0.9, 0.3, 1] as const;

export function TodayHero() {
  const [lead] = FEATURED_APPS;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      id="today"
      aria-label="Today"
      className="relative mx-auto w-full max-w-[1440px] px-5 pt-28 sm:px-8 sm:pt-32"
    >
      {/* Date masthead */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-baseline gap-3">
          <span
            className="text-[13px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--muted-foreground)" }}
          >
            {today}
          </span>
          <span
            className="italic-serif text-[14px]"
            style={{ color: "var(--warm)" }}
          >
            — Today
          </span>
        </div>
        <span
          className="hidden text-[12px] sm:inline"
          style={{ color: "var(--muted-foreground)" }}
        >
          {APPS.length} apps · Android & iOS
        </span>
      </motion.div>

      {/* Editorial headline */}
      <h1
        className="section-title mb-10 text-[clamp(2.6rem,8vw,6rem)]"
        aria-label="Apps that earn their spot on your home screen."
      >
        {HEADLINE.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.9,
                delay: 0.15 + i * 0.09,
                ease: EASE,
              }}
              className="inline-block"
              style={{
                fontStyle: w.italic ? "italic" : "normal",
                color: w.italic ? "var(--warm)" : "var(--ink)",
                marginRight: "0.22em",
              }}
            >
              {w.text}
            </motion.span>
          </span>
        ))}
      </h1>

      <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
          className="max-w-xl text-[17px] leading-[1.55]"
          style={{ color: "var(--muted-foreground)" }}
        >
          {APPS.length}+ hand-built Android &amp; iOS apps for workouts,
          documents, photography, and everyday utilities. Each one does a single
          job — and does it well.{" "}
          <span style={{ color: "var(--ink)" }}>Free to download.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85, ease: EASE }}
          className="flex flex-wrap items-center gap-3"
        >
          <motion.a
            href="#charts"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-[13px] font-semibold"
            style={{
              background: "var(--ink)",
              color: "var(--background)",
              fontFamily: "var(--font-sans)",
            }}
          >
            See top charts
            <span aria-hidden="true">→</span>
          </motion.a>
          <motion.a
            href="#apps"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex h-11 items-center gap-2 rounded-full border px-5 text-[13px] font-semibold"
            style={{
              borderColor: "var(--border-hover)",
              color: "var(--ink)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Browse all apps
          </motion.a>
        </motion.div>
      </div>

      {/* Story cards */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12, delayChildren: 1 } },
        }}
        className="grid gap-5 sm:gap-6 lg:grid-cols-2"
      >
        {lead && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
            }}
            className="lg:col-span-2"
          >
            <StoryCard
              app={lead}
              kicker="App of the Day"
              headline={lead.subtitle}
              priority
            />
          </motion.div>
        )}

        {FEATURED_APPS.slice(1, 3).map((app, i) => (
          <motion.div
            key={app.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            <StoryCard
              app={app}
              kicker={i === 0 ? "Must-Have" : "Quiet Essentials"}
              headline={app.subtitle}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
