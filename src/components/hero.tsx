import { APPS } from "@/data/apps";

function formatInstallsTotal() {
  const total = APPS.reduce((acc, app) => {
    const n = parseInt((app.playStoreInstalls ?? "0").replace(/\D/g, ""), 10) || 0;
    return acc + n;
  }, 0);
  if (total >= 1_000_000) {
    const m = total / 1_000_000;
    return `${m >= 10 ? Math.floor(m) : m.toFixed(1)}M+`;
  }
  if (total >= 1_000) return `${Math.round(total / 1_000)}K+`;
  return `${total}+`;
}

export function Hero() {
  const stats = [
    { n: `${APPS.length}`, l: "Free apps" },
    { n: formatInstallsTotal(), l: "Total installs" },
    { n: "4.6★", l: "Avg. rating" },
    { n: "6", l: "Categories" },
  ];

  return (
    <section
      id="today"
      style={{
        background: "#fff",
        padding: "96px 24px 80px",
        borderBottom: "1px solid #eee",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div
          className="sd-fade-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#f3f4f6",
            borderRadius: 100,
            padding: "6px 16px",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#555",
              letterSpacing: "0.06em",
            }}
          >
            SOLO INDIE DEVELOPER · {APPS.length} FREE APPS
          </span>
        </div>

        <h1
          className="sd-fade-up"
          style={{
            fontWeight: 800,
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            color: "#0f0f0f",
          }}
        >
          Portfolio of apps
        </h1>
        <p
          className="sd-fade-up"
          style={{
            fontSize: 18,
            color: "#666",
            lineHeight: 1.65,
            maxWidth: 520,
            margin: "0 auto 48px",
          }}
        >
          Small apps. Real jobs. No noise. Every app is free to download — no
          subscriptions, no trials, no dark patterns.
        </p>

        <div
          className="sd-fade-up"
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.l}
              style={{
                padding: "20px 28px",
                borderLeft: i === 0 ? "1px solid #eee" : "none",
                borderRight: "1px solid #eee",
                borderTop: "1px solid #eee",
                borderBottom: "1px solid #eee",
                minWidth: 140,
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 28,
                  letterSpacing: "-0.02em",
                  color: "#0f0f0f",
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#999",
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
