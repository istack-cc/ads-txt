import Image from "next/image";
import type { App } from "@/data/apps";

interface ManyMoreMarqueeProps {
  apps: App[];
  speed?: number;
}

export function ManyMoreMarquee({ apps, speed = 40 }: ManyMoreMarqueeProps) {
  if (!apps.length) return null;
  const loop = [...apps, ...apps];

  return (
    <div
      style={{
        background: "#f9f9f9",
        borderTop: "1px solid #eee",
        borderBottom: "1px solid #eee",
        height: 106,
        overflow: "hidden",
        contain: "layout paint",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        className="marquee-track"
        style={{ gap: 20, animationDuration: `${speed}s`, left: 0, position: "absolute", top: 24 }}
      >
        {loop.map((app, i) => (
          <MarqueeTile key={`${app.id}-${i}`} app={app} />
        ))}
      </div>
    </div>
  );
}

function MarqueeTile({ app }: { app: App }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 56,
        height: 56,
        borderRadius: 14,
        flexShrink: 0,
        marginRight: 20,
        background: `linear-gradient(135deg, ${app.gradientFrom}, ${app.gradientTo})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid rgba(0,0,0,0.04)`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Image
        src={app.iconUrl}
        alt={`${app.name} icon`}
        width={56}
        height={56}
        style={{ objectFit: "cover" }}
        unoptimized
      />
    </div>
  );
}
