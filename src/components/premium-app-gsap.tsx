"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

type PremiumAppGsapProps = {
  children: ReactNode;
};

export function PremiumAppGsap({ children }: PremiumAppGsapProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        ({ conditions }) => {
          if (conditions?.reduceMotion) {
            gsap.set("[data-gsap]", { autoAlpha: 1, y: 0, x: 0, scale: 1 });
            return;
          }

          gsap
            .timeline({ defaults: { ease: "power3.out", duration: 0.52 } })
            .from("[data-gsap='nav']", { autoAlpha: 0, y: -12 })
            .from("[data-gsap='hero-copy'] > *", { autoAlpha: 0, y: 20, stagger: 0.06 }, "-=0.28")
            .from("[data-gsap='hero-media']", { autoAlpha: 0, y: 24, scale: 0.98 }, "-=0.38")
            .from("[data-gsap='proof-item']", { autoAlpha: 0, y: 12, stagger: 0.035, duration: 0.38 }, "-=0.32");

          gsap.to("[data-gsap='float']", {
            y: -12,
            duration: 3.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }
      );

      return () => mm.revert();
    }, root);

    return () => context.revert();
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
