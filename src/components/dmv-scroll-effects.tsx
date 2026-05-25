"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMemo, useRef, type ReactNode } from "react";
import { Star } from "lucide-react";

type AttestationCard = {
  title: string;
  quote: string;
  person: string;
  image: string;
};

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
  duration?: number;
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  x = 0,
  y = 30,
  duration = 0.7,
}: MotionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{
        duration,
        delay: delay / 1000,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function DmvScrollMarquee({ images }: { images: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rowOneX = useTransform(scrollYProgress, [0, 1], ["-28%", "2%"]);
  const rowTwoX = useTransform(scrollYProgress, [0, 1], ["2%", "-28%"]);
  const rows = useMemo(() => {
    const first = images.slice(0, Math.ceil(images.length / 2));
    const second = images.slice(Math.ceil(images.length / 2));
    return {
      first: [...first, ...first, ...first],
      second: [...second, ...second, ...second],
    };
  }, [images]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f7fbff] py-12 md:py-16"
      style={{ position: "relative" }}
    >
      <div className="flex flex-col gap-3">
        <MarqueeRow images={rows.first} x={rowOneX} />
        <MarqueeRow images={rows.second} x={rowTwoX} />
      </div>
    </section>
  );
}

function MarqueeRow({ images, x }: { images: string[]; x: MotionValue<string> }) {
  return (
    <motion.div className="flex w-max gap-3 px-3" style={{ x, willChange: "transform" }}>
      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className="h-[180px] w-[280px] overflow-hidden rounded-[18px] border border-[#dbe8f5] bg-white shadow-[0_24px_80px_-66px_rgba(15,60,130,0.38)] sm:h-[220px] sm:w-[340px] md:h-[270px] md:w-[420px]"
        >
          <Image
            src={src}
            alt=""
            width={840}
            height={540}
            className="h-full w-full object-cover object-top"
            loading="lazy"
            unoptimized
          />
        </div>
      ))}
    </motion.div>
  );
}

export function DmvAnimatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return <p className={className}>{text}</p>;
}

export function DmvStickyAttestations({ cards }: { cards: AttestationCard[] }) {
  return (
    <div className="relative space-y-8 md:min-h-[230vh] md:space-y-0">
      {cards.map((card, index) => (
        <StickyAttestationCard
          key={card.title}
          card={card}
          index={index}
          total={cards.length}
        />
      ))}
    </div>
  );
}

function StickyAttestationCard({
  card,
  index,
  total,
}: {
  card: AttestationCard;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 82%", "end 24%"],
  });
  const targetScale = 1 - (total - 1 - index) * 0.035;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const imageY = useTransform(scrollYProgress, [0, 1], [24, -18]);

  return (
    <div ref={ref} className="relative md:h-[76vh]" style={{ position: "relative" }}>
      <motion.article
        className="overflow-hidden rounded-[28px] border border-[#dbe8f5] bg-white shadow-[0_30px_100px_-72px_rgba(15,60,130,0.48)] md:sticky"
        style={{
          scale,
          top: `calc(6rem + ${index * 28}px)`,
          willChange: "transform",
        }}
      >
        <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-[#eef6ff] md:min-h-[520px]">
            <motion.div className="absolute inset-0" style={{ y: imageY }}>
              <Image
                src={card.image}
                alt={`${card.person} smiling and holding a fictional DMV practice pass card`}
                width={1024}
                height={1536}
                className="h-[112%] w-full object-cover object-top"
                unoptimized
              />
            </motion.div>
            <div className="absolute left-4 top-4 rounded-full bg-white/92 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#0a84ff] shadow-sm backdrop-blur">
              Attestation {String(index + 1).padStart(2, "0")}
            </div>
          </div>
          <div className="flex flex-col justify-between p-7 md:p-10">
            <div>
              <div className="flex gap-1 text-[#f8b51b]">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <h3 className="mt-8 text-4xl font-black leading-none tracking-[-1px] text-[#071322] md:text-6xl">
                {card.title}
              </h3>
              <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-[#5b7288]">
                &quot;{card.quote}&quot;
              </p>
            </div>
            <p className="mt-12 text-sm font-black uppercase tracking-[0.18em] text-[#08a852]">
              {card.person}
            </p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
