"use client";

import { useState } from "react";
import Link from "next/link";
import { APPS, CATEGORIES, type AppCategory } from "@/data/apps";
import { AppIcon } from "@/components/app-card";

const UNPUBLISHED_IDS = new Set(["forms"]);

export function AppGrid() {
  const [active, setActive] = useState<AppCategory>("All");

  const base = active === "All" ? APPS : APPS.filter((a) => a.category === active);
  const filtered = [...base].sort((a, b) => {
    const au = UNPUBLISHED_IDS.has(a.id) ? 1 : 0;
    const bu = UNPUBLISHED_IDS.has(b.id) ? 1 : 0;
    return au - bu;
  });

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter apps by category"
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}
      >
        {CATEGORIES.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(c)}
              style={{
                padding: "8px 18px",
                borderRadius: 100,
                fontFamily: "var(--font-sans), sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                border: "none",
                background: isActive ? "#1a1a1a" : "#f2f2f2",
                color: isActive ? "#fff" : "#555",
                transition: "all 0.15s",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
        aria-label="Apps grid"
      >
        {filtered.map((app) => (
          <AppGridCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

function AppGridCard({ app }: { app: (typeof APPS)[number] }) {
  const platforms: Array<"android" | "ios"> = app.platform === "both" ? ["android", "ios"] : [app.platform];
  const installs = app.playStoreInstalls
    ? app.playStoreInstalls.replace(/,/g, "").replace(/\s+/g, "")
    : "";

  return (
    <Link
      href={`/apps/${app.id}`}
      className="app-grid-card"
      style={{
        background: "#f7f7f7",
        border: "1.5px solid #ebebeb",
        borderRadius: 18,
        padding: "20px 18px",
        display: "block",
        textDecoration: "none",
        transition: "all 0.2s",
        color: "#0f0f0f",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <AppIcon app={app} size={44} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#0f0f0f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {app.name}
          </div>
          <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>{app.category}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: "#aaa" }}>
          {installs ? `${installs} installs` : "Free"}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {platforms.map((p) => (
            <span
              key={p}
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "3px 7px",
                borderRadius: 5,
                background: p === "android" ? "#e8f5e9" : "#e3f2fd",
                color: p === "android" ? "#2e7d32" : "#1565c0",
              }}
            >
              {p === "android" ? "Android" : "iOS"}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
