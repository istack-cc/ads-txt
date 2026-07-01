"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { APPS, CATEGORIES, type AppCategory } from "@/data/apps";
import { AppIcon } from "@/components/app-card";

const UNPUBLISHED_IDS = new Set(["forms"]);

export function AppGrid() {
  const [active, setActive] = useState<AppCategory>("All");

  const publishedApps = APPS.filter((app) => !UNPUBLISHED_IDS.has(app.id));
  const base = active === "All" ? publishedApps : publishedApps.filter((a) => a.category === active);
  const filtered = [...base].sort((a, b) => {
    const au = UNPUBLISHED_IDS.has(a.id) ? 1 : 0;
    const bu = UNPUBLISHED_IDS.has(b.id) ? 1 : 0;
    if (au !== bu) return au - bu;
    return Number(b.platform === "ios") - Number(a.platform === "ios");
  });

  return (
    <div>
      <div
        className="app-grid-tabs"
        role="tablist"
        aria-label="Filter apps by category"
      >
        {CATEGORIES.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(c)}
              className="app-grid-tabs__button"
            >
              {c}
            </button>
          );
        })}
      </div>

      <div
        className="app-grid"
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
  const screenshots = app.screenshots?.slice(0, 3) ?? [];
  const primaryShot = screenshots[0];
  const secondaryShots = screenshots.slice(1);

  return (
    <Link
      href={`/apps/${app.id}`}
      className="app-grid-card"
    >
      <div className="app-grid-card__top">
        <div className="app-grid-card__identity">
          <AppIcon app={app} size={50} />
          <div>
            <h3>{app.name}</h3>
            <p>{app.category}</p>
          </div>
        </div>
        <div className="app-grid-card__platforms">
          {platforms.map((p) => (
            <span key={p} data-platform={p}>
              {p === "android" ? "Android" : "iOS"}
            </span>
          ))}
        </div>
      </div>

      <div className="app-grid-card__preview" aria-hidden="true">
        {primaryShot ? (
          <>
            <div className="app-grid-card__shot app-grid-card__shot--main">
              <Image src={primaryShot} alt={`${app.name} screenshot`} fill sizes="220px" unoptimized />
            </div>
            <div className="app-grid-card__shot-stack">
              {secondaryShots.map((src, index) => (
                <div key={src} className="app-grid-card__shot app-grid-card__shot--small">
                  <Image
                    src={src}
                    alt={`${app.name} screenshot ${index + 2}`}
                    fill
                    sizes="118px"
                    unoptimized
                  />
                  <span>{String(index + 2).padStart(2, "0")}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="app-grid-card__empty-shot">
            <AppIcon app={app} size={88} />
          </div>
        )}
      </div>

      <div className="app-grid-card__footer">
        <span>{installs ? `${installs} installs` : "Free"}</span>
        <strong>View app</strong>
      </div>
    </Link>
  );
}
