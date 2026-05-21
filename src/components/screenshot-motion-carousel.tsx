"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

type ScreenshotSlide = {
  src: string;
  alt: string;
  href: string;
};

type ScreenshotMotionCarouselProps = {
  slides: ScreenshotSlide[];
};

const PX_PER_SECOND = 48;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function ScreenshotMotionCarousel({ slides }: ScreenshotMotionCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopedSlides = useMemo(() => [...slides, ...slides], [slides]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || slides.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(track, { x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      let tween: gsap.core.Tween | null = null;
      let slideMetrics: Array<{ element: Element; left: number; width: number }> = [];

      const measureSlides = () => {
        slideMetrics = Array.from(track.children).map((element) => {
          const item = element as HTMLElement;
          return {
            element,
            left: item.offsetLeft,
            width: item.offsetWidth,
          };
        });
      };

      const applyDepth = () => {
        const stage = track.parentElement;
        if (!stage || slideMetrics.length === 0) return;

        const x = Number(gsap.getProperty(track, "x")) || 0;
        const stageCenter = stage.clientWidth / 2;
        const curveWidth = Math.max(stage.clientWidth * 0.48, 220);

        slideMetrics.forEach(({ element, left, width }) => {
          const center = left + width / 2 + x;
          const normalized = clamp((center - stageCenter) / curveWidth, -1.65, 1.65);
          const depth = Math.abs(normalized);
          const z = 190 - depth * 260;
          const y = 8 + depth * 46;
          const scale = 1.08 - depth * 0.14;
          const opacity = clamp(1 - depth * 0.42, 0.28, 1);

          gsap.set(element, {
            y,
            z,
            scale,
            opacity,
            rotationY: normalized * -58,
            rotationZ: normalized * 2.5,
            zIndex: Math.round((2 - depth) * 100),
            transformPerspective: 1200,
            force3D: true,
          });
        });
      };

      const buildTween = () => {
        tween?.kill();
        gsap.set(track, { x: 0 });
        measureSlides();
        applyDepth();

        const loopDistance = track.scrollWidth / 2;
        if (loopDistance <= 0) return;

        tween = gsap.to(track, {
          x: -loopDistance,
          duration: loopDistance / PX_PER_SECOND,
          ease: "none",
          repeat: -1,
          onUpdate: applyDepth,
        });
      };

      buildTween();

      const resizeObserver = new ResizeObserver(buildTween);
      resizeObserver.observe(track);
      if (track.parentElement) resizeObserver.observe(track.parentElement);

      return () => {
        resizeObserver.disconnect();
        tween?.kill();
      };
    }, track);

    return () => ctx.revert();
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <div className="screenshot-motion" aria-label="Featured app screenshots">
      <div ref={trackRef} className="screenshot-motion__track">
        {loopedSlides.map((slide, index) => (
            <Link
              key={`${slide.href}-${slide.src}-${index}`}
              href={slide.href}
              className="screenshot-motion__slide"
              aria-label={slide.alt}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 1280px) 230px, (min-width: 768px) 24vw, 56vw"
                className="object-cover object-top"
                unoptimized
              />
            </Link>
        ))}
      </div>
    </div>
  );
}
