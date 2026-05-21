"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

type FeaturedProductVisualProps = {
  name: string;
  iconUrl: string;
  screenshots?: string[];
  gradientFrom: string;
  gradientTo: string;
  index: number;
};

export function FeaturedProductVisual({
  name,
  iconUrl,
  screenshots = [],
  gradientFrom,
  gradientTo,
  index,
}: FeaturedProductVisualProps) {
  const reduceMotion = useReducedMotion();
  const previewImages = screenshots.length > 0 ? screenshots.slice(0, 3) : [iconUrl, iconUrl, iconUrl];

  return (
    <div
      className="product-stage"
      style={
        {
          "--stage-from": gradientFrom,
          "--stage-to": gradientTo,
        } as CSSProperties
      }
    >
      <div className="product-stage__grid" />
      {previewImages.map((src, previewIndex) => (
        <motion.div
          key={`${name}-${previewIndex}`}
          className={`product-stage__preview product-stage__preview--${previewIndex + 1}`}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, previewIndex % 2 === 0 ? -10 : 10, 0],
                  rotateZ: [
                    previewIndex === 0 ? -10 : previewIndex === 1 ? 8 : -2,
                    previewIndex === 0 ? -7 : previewIndex === 1 ? 5 : 1,
                    previewIndex === 0 ? -10 : previewIndex === 1 ? 8 : -2,
                  ],
                }
          }
          transition={{
            duration: 5.8 + previewIndex * 0.6,
            delay: previewIndex * 0.14,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="260px"
            style={{ objectFit: "contain" }}
            unoptimized
          />
        </motion.div>
      ))}

      <motion.div
        className="product-stage__identity"
        whileHover={{ y: -6, rotateX: 4, rotateY: -5 }}
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -8, 0],
                rotateZ: [-2, 1, -2],
              }
        }
        transition={{ duration: 5.4, ease: "easeInOut", repeat: Infinity }}
      >
        <span className="product-stage__number">{String(index + 1).padStart(2, "0")}</span>
        <Image src={iconUrl} alt={`${name} icon`} width={128} height={128} unoptimized />
        <strong>{name}</strong>
      </motion.div>

      <div className="product-stage__badge">
        <span>Store ready</span>
        <strong>Free</strong>
      </div>
    </div>
  );
}
