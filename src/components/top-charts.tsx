"use client";

import { useState } from "react";
import type { App } from "@/data/apps";
import { RowCard } from "@/components/app-card";
import { cn } from "@/lib/utils";

interface TopChartsProps {
  apps: App[];
  perColumn?: number;
}

export function TopCharts({ apps, perColumn = 10 }: TopChartsProps) {
  const [tab, setTab] = useState<"all" | "android" | "ios">("all");

  const filtered =
    tab === "all"
      ? apps
      : apps.filter((a) => a.platform === (tab === "android" ? "android" : "ios"));

  const total = Math.min(filtered.length, perColumn * 3);
  const ranked = filtered.slice(0, total);

  // Distribute across 3 columns
  const columns: App[][] = [[], [], []];
  ranked.forEach((a, i) => columns[Math.floor(i / perColumn)].push(a));

  return (
    <section
      id="charts"
      aria-labelledby="charts-heading"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-5 py-20 sm:px-8"
    >
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2" style={{ color: "var(--accent)" }}>
            Top Charts
          </p>
          <h2
            id="charts-heading"
            className="section-title text-[clamp(1.9rem,4.4vw,3rem)]"
          >
            What people <span className="italic-serif" style={{ color: "var(--warm)" }}>download</span> this week
          </h2>
        </div>

        <div
          className="inline-flex items-center rounded-full border p-1 text-[13px]"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
          role="tablist"
          aria-label="Filter charts by platform"
        >
          {(["all", "android", "ios"] as const).map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "rounded-full px-4 py-1.5 font-semibold capitalize transition-colors"
              )}
              style={
                tab === key
                  ? { background: "var(--ink)", color: "var(--background)" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              {key === "ios" ? "iOS" : key}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
        {columns.map((col, ci) =>
          col.length > 0 ? (
            <div key={ci} role="list" aria-label={`Chart column ${ci + 1}`}>
              {col.map((app, i) => (
                <RowCard
                  key={app.id}
                  app={app}
                  rank={ci * perColumn + i + 1}
                  showDivider={i < col.length - 1}
                />
              ))}
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}
