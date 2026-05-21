"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type GsapImageRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
};

gsap.registerPlugin(ScrollTrigger);

export function GsapImageReveal({
  children,
  className,
  delay = 0,
  hover = true,
}: GsapImageRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(root, { autoAlpha: 1, clearProps: "clipPath,filter,transform" });
        return;
      }

      gsap.fromTo(
        root,
        {
          autoAlpha: 0,
          y: 34,
          scale: 0.96,
          clipPath: "inset(16% 0% 16% 0% round 18px)",
          filter: "blur(10px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 18px)",
          filter: "blur(0px)",
          duration: 1.05,
          delay: delay / 1000,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 86%",
            once: true,
          },
          onComplete: () => {
            gsap.set(root, { filter: "none", clipPath: "none" });
          },
        },
      );

      if (!hover) return;

      const enter = () => {
        gsap.to(root, {
          y: -8,
          scale: 1.018,
          rotateX: 1.2,
          rotateY: -1.2,
          duration: 0.45,
          ease: "power3.out",
        });
      };
      const leave = () => {
        gsap.to(root, {
          y: 0,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          duration: 0.55,
          ease: "power3.out",
        });
      };

      root.addEventListener("pointerenter", enter);
      root.addEventListener("pointerleave", leave);

      return () => {
        root.removeEventListener("pointerenter", enter);
        root.removeEventListener("pointerleave", leave);
      };
    }, root);

    return () => ctx.revert();
  }, [delay, hover]);

  return (
    <div ref={rootRef} className={className} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}
