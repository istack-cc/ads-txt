"use client";

import { useEffect, useState } from "react";
import { DEVELOPER_URL } from "@/data/apps";

export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    const footer = document.getElementById("site-footer");
    if (!hero || !footer) return;

    let heroVisible = true;
    let footerVisible = false;

    const update = () => setShow(!heroVisible && !footerVisible);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.15 }
    );

    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        footerVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.12 }
    );

    heroObserver.observe(hero);
    footerObserver.observe(footer);

    return () => {
      heroObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-2 md:hidden transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!show}
    >
      <div
        className="mx-auto flex max-w-md items-center justify-between rounded-2xl border px-3 py-2.5 shadow-2xl backdrop-blur-md"
        style={{
          borderColor: "var(--border-hover)",
          background: "oklch(0.12 0.005 280 / 90%)",
        }}
      >
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
          >
            Free on Play Store
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}
          >
            Free Apps
          </p>
        </div>

        <a
          href={DEVELOPER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold uppercase tracking-[0.08em] focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: "var(--accent)",
            color: "var(--primary-foreground)",
            fontFamily: "var(--font-outfit)",
            touchAction: "manipulation",
          }}
          aria-label="View iStack apps on Google Play"
        >
          View on Google Play
        </a>
      </div>
    </div>
  );
}
