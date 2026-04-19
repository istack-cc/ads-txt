"use client";

import { motion } from "motion/react";
import { APPS, DEVELOPER_URL, IOS_DEVELOPER_URL } from "@/data/apps";

const EASE = [0.2, 0.9, 0.3, 1] as const;

export function ScienceBillboard() {
  return (
    <section
      aria-labelledby="science-heading"
      className="dark-section relative w-full overflow-hidden"
    >
      {/* Soft electric-blue glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 0%, color-mix(in oklab, var(--electric) 18%, transparent) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 100%, color-mix(in oklab, var(--electric) 12%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 py-28 sm:px-8 sm:py-40">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="eyebrow mb-6"
          style={{ color: "var(--electric-soft)" }}
        >
          ● The Lab
        </motion.p>

        <motion.h2
          id="science-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="display-tight display-tight--xl mb-10 max-w-[18ch]"
        >
          The <span style={{ color: "var(--electric-soft)" }}>science</span>{" "}
          behind apps that <span className="italic-serif" style={{ fontWeight: 400, color: "var(--warm)" }}>stick</span>.
        </motion.h2>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="max-w-2xl text-[18px] leading-[1.55]"
            style={{ color: "oklch(0.7 0.01 260)" }}
          >
            {APPS.length}+ ships across Android and iOS. No bloat. No
            dark patterns. Every one of them exists to finish a job — scan the
            PDF, count the steps, stash the calculator behind a photo vault —
            and then fade back into your home screen until you need it again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="flex flex-wrap items-center gap-3 self-end"
          >
            <motion.a
              href={DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hub-pill hub-pill--blue"
            >
              Browse on Google Play
              <span aria-hidden="true">→</span>
            </motion.a>
            <motion.a
              href={IOS_DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hub-pill hub-pill--light"
            >
              On the App Store
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
