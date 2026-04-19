import Image from "next/image";
import Link from "next/link";
import type { App } from "@/data/apps";
import { AppIcon } from "@/components/app-card";
import { getStoreUrl } from "@/lib/storeUrl";

interface AppShowcaseProps {
  app: App;
  index?: number;
}

function formatInstalls(raw?: string) {
  const n = parseInt((raw ?? "0").replace(/\D/g, ""), 10) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M+`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  if (n > 0) return `${n}+`;
  return "New";
}

function splitFeatures(text: string | undefined): { label: string; sub: string }[] {
  const fallback = [
    { label: "Free, forever", sub: "No subscriptions,\nno hidden paywalls" },
    { label: "Privacy first", sub: "All processing\nhappens on-device" },
    { label: "Just works", sub: "One job, done well\nwith zero setup" },
  ];
  if (!text) return fallback;
  const sentences = text
    .split(/[.!]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 140);
  if (sentences.length < 3) return fallback;
  const out = sentences.slice(0, 3).map((s) => {
    const words = s.split(/\s+/);
    const label = words.slice(0, 2).join(" ");
    const sub = words.slice(2).join(" ");
    return { label: label || s, sub: sub || s };
  });
  return out;
}

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none">
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="#FF9500" />
              <stop offset="50%" stopColor="#E5E5E5" />
            </linearGradient>
          </defs>
          <path
            d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.44L7 8.885 3.91 10.51l.59-3.44L2 4.632l3.455-.502z"
            fill={
              i <= full
                ? "#FF9500"
                : i === full + 1 && half
                  ? `url(#half-${i})`
                  : "#E5E5E5"
            }
          />
        </svg>
      ))}
    </span>
  );
}

function PhoneFrame({
  app,
  screenshot,
  scale = 1,
}: {
  app: App;
  screenshot?: string;
  scale?: number;
}) {
  const W = 220 * scale;
  const H = 440 * scale;
  return (
    <div
      style={{
        position: "relative",
        width: W,
        height: H,
        borderRadius: 36 * scale,
        background: "#0a0a0a",
        padding: 7 * scale,
        boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 7 * scale,
          left: "50%",
          transform: "translateX(-50%)",
          width: 68 * scale,
          height: 18 * scale,
          borderRadius: 999,
          background: "#000",
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 30 * scale,
          overflow: "hidden",
          background: `linear-gradient(145deg, ${app.gradientFrom}, ${app.gradientTo})`,
        }}
      >
        {screenshot ? (
          <Image
            src={screenshot}
            alt={`${app.name} screenshot`}
            fill
            sizes={`${Math.round(W)}px`}
            style={{ objectFit: "cover" }}
            unoptimized
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <AppIcon app={app} size={72 * scale} />
            <div style={{ fontWeight: 800, fontSize: 18 * scale, color: "#1a1a1a" }}>
              {app.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PhoneCluster({ app }: { app: App }) {
  const shots = (app.screenshots ?? []).slice(0, 3);
  const primary = shots[0];
  const secondary = shots[1] ?? shots[0];
  const tertiary = shots[2] ?? shots[1] ?? shots[0];

  return (
    <div
      style={{
        position: "relative",
        width: 420,
        height: 520,
        flexShrink: 0,
      }}
    >
      {/* Back phone (left, tilted) */}
      <div
        className="sd-phone-a"
        style={{
          position: "absolute",
          left: 0,
          top: 40,
          zIndex: 1,
        }}
      >
        <PhoneFrame app={app} screenshot={secondary} scale={0.82} />
      </div>

      {/* Back phone (right, tilted) */}
      <div
        className="sd-phone-c"
        style={{
          position: "absolute",
          right: 0,
          top: 60,
          zIndex: 1,
        }}
      >
        <PhoneFrame app={app} screenshot={tertiary} scale={0.82} />
      </div>

      {/* Front phone — center, largest */}
      <div
        className="sd-phone-b"
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <PhoneFrame app={app} screenshot={primary} scale={1.05} />
      </div>

      {/* Floating app icon chip */}
      <div
        className="sd-stagger-4"
        style={{
          position: "absolute",
          left: -12,
          bottom: 24,
          zIndex: 3,
          background: "rgba(255,255,255,0.95)",
          borderRadius: 18,
          padding: 10,
          backdropFilter: "blur(10px)",
          boxShadow: "0 12px 32px -10px rgba(0,0,0,0.25)",
        }}
      >
        <AppIcon app={app} size={48} />
      </div>
    </div>
  );
}

export function AppShowcase({ app, index = 0 }: AppShowcaseProps) {
  const reversed = index % 2 === 1;
  const installs = formatInstalls(app.playStoreInstalls);
  const bgFrom = app.gradientFrom;
  const bgTo = app.gradientTo;
  const sectionBg = `linear-gradient(135deg, color-mix(in oklab, ${bgFrom}, white 88%) 0%, color-mix(in oklab, ${bgTo}, white 82%) 100%)`;
  const storeUrl = getStoreUrl(app, "homepage", "mid");
  const features = splitFeatures(app.playStoreShortDescription ?? app.description);
  const rating = 4.6; // Average-quality default; real rating data isn't in app data
  const platformLabel = app.platform === "ios" ? "App Store" : "Google Play";

  return (
    <section
      className="app-section"
      style={{
        background: sectionBg,
        width: "100%",
        padding: "80px 0 60px",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          className="showcase-top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 56,
            flexDirection: reversed ? "row-reverse" : "row",
            marginBottom: 64,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <PhoneCluster app={app} />

          <div
            style={{ flex: 1, minWidth: 280 }}
          >
            <div
              className="sd-stagger-1"
              style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}
            >
              <AppIcon app={app} size={68} />
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#888",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  {app.category}
                </div>
                <div style={{ fontWeight: 800, fontSize: 28, lineHeight: 1.1, color: "#0f0f0f" }}>
                  {app.name}
                </div>
              </div>
            </div>

            <p
              className="sd-stagger-2"
              style={{
                fontSize: 17,
                color: "#444",
                lineHeight: 1.65,
                marginBottom: 28,
                maxWidth: 460,
              }}
            >
              {app.playStoreShortDescription ?? app.description}
            </p>

            <div
              className="sd-stagger-3"
              style={{ display: "flex", gap: 20, marginBottom: 32, flexWrap: "wrap" }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <StarRating value={rating} />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{rating}</span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#999",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  {app.platform === "ios" ? "IOS" : "ANDROID"}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{installs}</span>
                <div
                  style={{
                    fontSize: 11,
                    color: "#999",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  INSTALLS
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Free</span>
                <div
                  style={{
                    fontSize: 11,
                    color: "#999",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  PRICE
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{platformLabel}</span>
                <div
                  style={{
                    fontSize: 11,
                    color: "#999",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  PLATFORM
                </div>
              </div>
            </div>

            <div
              className="sd-stagger-4"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn"
                style={{ background: "#1a1a1a", color: "#fff" }}
              >
                <StoreIcon platform={app.platform} />
                {app.platform === "ios" ? "App Store" : "Google Play"}
              </a>
              <Link
                href={`/apps/${app.id}`}
                className="store-btn"
                style={{
                  background: "#fff",
                  color: "#1a1a1a",
                  border: "1.5px solid #e0e0e0",
                }}
              >
                Read the story →
              </Link>
            </div>
          </div>
        </div>

        <div
          className="features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 0,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className={`sd-stagger-${Math.min(i + 3, 5)}`}
              style={{
                background: "rgba(255,255,255,0.72)",
                borderRadius: 20,
                padding: "26px 22px",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.9)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${bgFrom}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                  fontSize: 22,
                  color: "#0f0f0f",
                }}
              >
                {["✦", "◈", "◉"][i] ?? "•"}
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6, color: "#0f0f0f" }}>
                {f.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#555",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                }}
              >
                {f.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoreIcon({ platform }: { platform: "android" | "ios" | "both" }) {
  if (platform === "ios") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.18 23.76c.26.15.56.17.83.08l11.65-11.65L12 8.53 3.18 23.76zM20.47 10.36l-2.53-1.45-3.35 3.35 3.35 3.35 2.54-1.46c.72-.42.72-1.38-.01-1.79zM2.01 1.46C1.99 1.6 2 1.74 2 1.89v20.22c0 .15.01.29.03.43L13.48 11.1 2.01 1.46zM15.66 2.17L4.01.09c-.27-.09-.57-.07-.83.08L12 8.53l3.66-6.36z" />
    </svg>
  );
}
