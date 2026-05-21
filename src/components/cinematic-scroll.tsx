"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function CinematicScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".site3d > section:not(#apps)")
    );

    if (reduceMotion) {
      gsap.set(sections, { autoAlpha: 1, y: 0, clearProps: "transform,opacity,visibility" });
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      sections.forEach((section, index) => {
        const sceneItems = Array.from(section.children).filter(
          (child): child is HTMLElement => child instanceof HTMLElement
        );

        if (index === 0) return;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          })
          .fromTo(
            sceneItems,
            {
              autoAlpha: 0,
              y: 24,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              ease: "power2.out",
              stagger: 0.055,
            },
          );
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const refreshTimer = window.setTimeout(refresh, 450);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimer);
      ctx.revert();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return null;
}
