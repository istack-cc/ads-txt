"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import type { App } from "@/data/apps";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

/* ─── Icon with gradient fallback ───────────────────────── */
export function AppIcon({
  app,
  size = 56,
  className,
}: {
  app: App;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const radius = Math.round(size * 0.23);

  const shell: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    boxShadow:
      "0 1px 2px oklch(0.14 0.01 260 / 10%), inset 0 0 0 1px oklch(1 0 0 / 35%)",
  };

  if (failed) {
    return (
      <div
        className={cn("shrink-0", className)}
        style={{
          ...shell,
          background: `linear-gradient(135deg, ${app.gradientFrom}, ${app.gradientTo})`,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden", className)}
      style={shell}
      aria-hidden="true"
    >
      <Image
        src={app.iconUrl}
        alt={`${app.name} icon`}
        width={size}
        height={size}
        className="object-cover"
        onError={() => setFailed(true)}
        unoptimized
      />
    </div>
  );
}

/* ─── Banner image with gradient fallback ────────────────── */
function AppBanner({ app, priority = false }: { app: App; priority?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${app.gradientFrom}, ${app.gradientTo})`,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <Image
      src={app.bannerUrl}
      alt={`${app.name} screenshot`}
      fill
      className="object-cover"
      onError={() => setFailed(true)}
      loading={priority ? "eager" : "lazy"}
      priority={priority}
      unoptimized
    />
  );
}

/* ─── Get pill (reusable) ────────────────────────────────── */
function GetPill({ ghost = false }: { ghost?: boolean }) {
  return (
    <motion.span
      className={cn("get-pill", ghost && "get-pill--ghost")}
      aria-hidden="true"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      Get
    </motion.span>
  );
}

/* ─── Editorial STORY card (Today hero companion) ────────── */
export function StoryCard({
  app,
  kicker = "App of the Day",
  headline,
  priority = false,
  className,
}: {
  app: App;
  kicker?: string;
  headline?: string;
  priority?: boolean;
  className?: string;
}) {
  const detailsUrl = `/apps/${app.id}`;
  const title = headline ?? app.subtitle;

  return (
    <MotionLink
      href={detailsUrl}
      aria-label={`${app.name} — ${kicker}. Open app page`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "story-card group relative block overflow-hidden rounded-[28px] bg-card focus-visible:outline-2 focus-visible:outline-offset-4",
        className
      )}
      style={{ touchAction: "manipulation" }}
    >
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/10]">
        <AppBanner app={app} priority={priority} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.14 0.01 260 / 25%) 0%, transparent 30%, transparent 50%, oklch(0.14 0.01 260 / 78%) 100%)",
          }}
          aria-hidden="true"
        />
        {/* Top kicker */}
        <div className="absolute left-6 right-6 top-6 flex items-start justify-between text-white sm:left-8 sm:top-8">
          <div>
            <p className="eyebrow opacity-95">{kicker}</p>
            <p className="mt-1 text-[13px] opacity-80" style={{ fontFamily: "var(--font-sans)" }}>
              {app.category}
            </p>
          </div>
          <span
            className="italic-serif text-[15px] leading-none opacity-80"
            aria-hidden="true"
          >
            no. {String(app.id.length).padStart(2, "0")}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
          <h3
            className="mb-4 max-w-2xl text-[32px] leading-[1.02] sm:text-[44px]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </h3>

          <div className="flex items-center gap-3 rounded-2xl bg-white/95 p-3 backdrop-blur-sm text-[color:var(--ink)] shadow-[0_10px_30px_-10px_oklch(0_0_0/40%)]">
            <AppIcon app={app} size={52} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold">{app.name}</p>
              <p className="truncate text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                {app.platform === "ios" ? "App Store" : "Google Play"} · Free
              </p>
            </div>
            <GetPill />
          </div>
        </div>
      </div>
    </MotionLink>
  );
}

/* ─── Compact RAIL card (horizontal carousel) ────────────── */
export function RailCard({ app }: { app: App }) {
  const detailsUrl = `/apps/${app.id}`;
  return (
    <MotionLink
      href={detailsUrl}
      aria-label={`${app.name} — ${app.subtitle}`}
      whileHover={{ y: -6, boxShadow: "0 16px 32px -12px oklch(0.14 0.01 260 / 22%)" }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl bg-card focus-visible:outline-2 focus-visible:outline-offset-4 sm:w-[300px]"
      style={{ boxShadow: "0 1px 2px oklch(0.14 0.01 260 / 6%)" }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <AppBanner app={app} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 55%, oklch(0.14 0.01 260 / 40%) 100%)",
          }}
          aria-hidden="true"
        />
        <span
          className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-sm"
          style={{ color: "var(--ink)" }}
        >
          {app.category}
        </span>
      </div>

      <div className="flex items-center gap-3 p-4">
        <AppIcon app={app} size={48} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold" style={{ color: "var(--ink)" }}>
            {app.name}
          </p>
          <p
            className="truncate text-[12px]"
            style={{ color: "var(--muted-foreground)" }}
          >
            {app.subtitle}
          </p>
        </div>
        <GetPill ghost />
      </div>
    </MotionLink>
  );
}

/* ─── ROW card (list view — App Store "Chart" row) ───────── */
export function RowCard({
  app,
  rank,
  showDivider = true,
}: {
  app: App;
  rank?: number;
  showDivider?: boolean;
}) {
  const detailsUrl = `/apps/${app.id}`;
  return (
    <Link
      href={detailsUrl}
      aria-label={`${rank ? `#${rank} ` : ""}${app.name} — ${app.subtitle}`}
      className={cn(
        "mini-card group flex items-center gap-4 py-3.5 pl-2 pr-3 focus-visible:outline-2 focus-visible:outline-offset-2",
        showDivider && "border-b"
      )}
      style={{ borderColor: "var(--border)" }}
    >
      {typeof rank === "number" && (
        <span
          className="w-7 shrink-0 text-center text-[22px] tabular-nums"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--muted-foreground)",
            letterSpacing: "-0.02em",
          }}
          aria-hidden="true"
        >
          {rank}
        </span>
      )}
      <AppIcon app={app} size={58} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold" style={{ color: "var(--ink)" }}>
          {app.name}
        </p>
        <p
          className="truncate text-[12px]"
          style={{ color: "var(--muted-foreground)" }}
        >
          {app.subtitle}
        </p>
        <p
          className="truncate text-[11px] opacity-80"
          style={{ color: "var(--muted-foreground)" }}
        >
          {app.category} · {app.platform === "ios" ? "iOS" : "Android"}
        </p>
      </div>
      <GetPill ghost />
    </Link>
  );
}

/* ─── Default AppCard (kept for back-compat; now renders RailCard) ── */
export function AppCard({
  app,
  className,
  style,
}: {
  app: App;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}) {
  const detailsUrl = `/apps/${app.id}`;
  return (
    <Link
      href={detailsUrl}
      aria-label={`${app.name} — ${app.subtitle}`}
      className={cn(
        "mini-card group flex items-center gap-4 rounded-2xl border bg-card p-3 pr-4 focus-visible:outline-2 focus-visible:outline-offset-2",
        className
      )}
      style={{ borderColor: "var(--border)", ...style }}
    >
      <AppIcon app={app} size={58} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold" style={{ color: "var(--ink)" }}>
          {app.name}
        </p>
        <p className="truncate text-[12px]" style={{ color: "var(--muted-foreground)" }}>
          {app.subtitle}
        </p>
        <p className="truncate text-[11px] opacity-80" style={{ color: "var(--muted-foreground)" }}>
          {app.category}
        </p>
      </div>
      <GetPill ghost />
    </Link>
  );
}

/* ─── Featured card alias (kept for back-compat) ─────────── */
export function FeaturedCard({ app }: { app: App }) {
  return <StoryCard app={app} kicker="Featured" priority />;
}
