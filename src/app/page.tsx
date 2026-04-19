import Image from "next/image";
import Link from "next/link";
import { AppShowcase } from "@/components/app-showcase";
import { AppGrid } from "@/components/app-grid";
import { ManyMoreMarquee } from "@/components/many-more-marquee";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  APPS,
  FEATURED_APPS,
  DEVELOPER_URL,
  IOS_DEVELOPER_URL,
} from "@/data/apps";
import { CATEGORIES_LIST } from "@/data/categories";
import { ORGANIZATION } from "@/data/organization";
import {
  generateGraph,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateItemListSchema,
} from "@/lib/schema";

const UNPUBLISHED_IDS = new Set(["forms"]);
const LIVE_APPS = APPS.filter((a) => !UNPUBLISHED_IDS.has(a.id));
const FEATURED = FEATURED_APPS.filter((a) => !UNPUBLISHED_IDS.has(a.id)).slice(0, 4);

// Recent releases: apps with update dates, most recent first
const RECENT = [...LIVE_APPS]
  .filter((a) => a.playStoreUpdatedOn)
  .sort((a, b) => {
    const da = new Date(a.playStoreUpdatedOn!).getTime();
    const db = new Date(b.playStoreUpdatedOn!).getTime();
    return db - da;
  })
  .slice(0, 6);

// Stat bar data
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

const STATS = [
  { value: `${LIVE_APPS.length}+`, label: "Free apps" },
  { value: formatInstallsTotal(), label: "Total installs" },
  { value: "4.6★", label: "Avg. rating" },
  { value: `${CATEGORIES_LIST.length}`, label: "Categories" },
];

// Category app counts
const CAT_COUNTS = Object.fromEntries(
  CATEGORIES_LIST.map((cat) => [
    cat.id,
    LIVE_APPS.filter((a) => a.seoCategory === cat.id).length,
  ])
);

const CAT_ICONS: Record<string, string> = {
  productivity: "⚡",
  "ai-photo": "📸",
  utilities: "🔧",
  health: "💪",
  education: "🎓",
  personalization: "✨",
  voice: "🎙️",
};

const jsonLd = generateGraph([
  generateOrganizationSchema(),
  generateWebSiteSchema(),
  generateItemListSchema(FEATURED, "iStack Featured Apps"),
]);

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: "#0f0f0f", color: "#fff" }}
      >
        Skip to main content
      </a>

      <Nav appsHref="#apps" />

      <main id="main-content">

        {/* ── 1. Hero ─────────────────────────────────────────────────── */}
        <section
          aria-labelledby="hero-heading"
          style={{
            background: "#fff",
            padding: "96px 24px 72px",
            borderBottom: "1px solid #eee",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div
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
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#555",
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-sans)",
                }}
              >
                SOLO INDIE DEVELOPER · {LIVE_APPS.length} FREE APPS
              </span>
            </div>

            <h1
              id="hero-heading"
              className="sd-fade-up"
              style={{
                fontWeight: 800,
                fontSize: "clamp(38px, 6vw, 68px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                marginBottom: 20,
                color: "#0f0f0f",
              }}
            >
              Free mobile apps
              <br />
              <span style={{ color: "#888" }}>that just work.</span>
            </h1>

            <p
              className="sd-fade-up"
              style={{
                fontSize: 18,
                color: "#555",
                lineHeight: 1.65,
                maxWidth: 560,
                margin: "0 auto 40px",
                fontFamily: "var(--font-sans)",
              }}
            >
              {LIVE_APPS.length}+ Android &amp; iOS apps for productivity,
              photos, fitness, and daily tasks. Free to download — no dark
              patterns, no mandatory sign-ups.
            </p>

            <div
              className="sd-fade-up"
              style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
            >
              <a
                href="#apps"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#0f0f0f",
                  color: "#fff",
                  borderRadius: 12,
                  padding: "14px 28px",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Browse all apps
              </a>
              <a
                href="#categories"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#f3f4f6",
                  color: "#0f0f0f",
                  borderRadius: 12,
                  padding: "14px 28px",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Explore by category →
              </a>
            </div>
          </div>
        </section>

        {/* ── 2. Stat bar ─────────────────────────────────────────────── */}
        <section
          aria-label="Key statistics"
          style={{
            background: "#f9f9f9",
            borderBottom: "1px solid #eee",
          }}
        >
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "24px 36px",
                  borderLeft: i === 0 ? "1px solid #eee" : "none",
                  borderRight: "1px solid #eee",
                  minWidth: 140,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 30,
                    letterSpacing: "-0.02em",
                    color: "#0f0f0f",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#999",
                    fontWeight: 600,
                    marginTop: 4,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Category Browse ──────────────────────────────────────── */}
        <section
          id="categories"
          aria-labelledby="categories-heading"
          style={{
            background: "#fff",
            padding: "72px 24px",
            borderBottom: "1px solid #eee",
            scrollMarginTop: 80,
          }}
        >
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <h2
              id="categories-heading"
              style={{
                fontWeight: 800,
                fontSize: 30,
                letterSpacing: "-0.03em",
                color: "#0f0f0f",
                marginBottom: 8,
              }}
            >
              Browse by category
            </h2>
            <p
              style={{
                color: "#888",
                fontSize: 15,
                marginBottom: 36,
                fontFamily: "var(--font-sans)",
              }}
            >
              Every category, covered. All apps free.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {CATEGORIES_LIST.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}/`}
                  style={{
                    display: "block",
                    background: "#f7f7f7",
                    border: "1.5px solid #ebebeb",
                    borderRadius: 18,
                    padding: "24px 20px",
                    textDecoration: "none",
                    color: "#0f0f0f",
                    transition: "all 0.2s",
                  }}
                  className="category-card"
                >
                  <div style={{ fontSize: 28, marginBottom: 10 }}>
                    {CAT_ICONS[cat.id] ?? "📱"}
                  </div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 16,
                      marginBottom: 4,
                      color: "#0f0f0f",
                    }}
                  >
                    {cat.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#999",
                      marginBottom: 12,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {CAT_COUNTS[cat.id] ?? 0} apps
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#555",
                      fontFamily: "var(--font-sans)",
                      lineHeight: 1.4,
                    }}
                  >
                    {cat.hub_keyword}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Featured apps ────────────────────────────────────────── */}
        {FEATURED.map((app, i) => (
          <AppShowcase key={app.id} app={app} index={i} />
        ))}

        {/* ── 5. Why iStack ───────────────────────────────────────────── */}
        <section
          aria-labelledby="why-heading"
          style={{
            background: "#fff",
            padding: "72px 24px",
            borderTop: "1px solid #eee",
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <h2
              id="why-heading"
              style={{
                fontWeight: 800,
                fontSize: 30,
                letterSpacing: "-0.03em",
                color: "#0f0f0f",
                marginBottom: 8,
              }}
            >
              Why iStack?
            </h2>
            <p
              style={{
                color: "#888",
                fontSize: 15,
                marginBottom: 40,
                fontFamily: "var(--font-sans)",
              }}
            >
              Every app is built around one clear principle.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 20,
              }}
            >
              {[
                {
                  icon: "⬇️",
                  title: "Free to download",
                  text: "Every iStack app is free to install. Android apps are ad-supported with no IAP; iOS apps offer optional premium features.",
                },
                {
                  icon: "🔓",
                  title: "No account needed",
                  text: "Open and start immediately. We never require email sign-up or social login to access core features.",
                },
                {
                  icon: "⚡",
                  title: "One app, one job",
                  text: "No feature bloat. Each app does one thing and does it well — fast, focused, and reliable.",
                },
                {
                  icon: "🛡️",
                  title: "Privacy by default",
                  text: "Processing stays on your device wherever possible. We don't sell data or build advertising profiles.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: "#f7f7f7",
                    border: "1.5px solid #ebebeb",
                    borderRadius: 18,
                    padding: "28px 22px",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 12 }}>
                    {card.icon}
                  </div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 16,
                      marginBottom: 8,
                      color: "#0f0f0f",
                    }}
                  >
                    {card.title}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#555",
                      lineHeight: 1.6,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {card.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Recent releases ──────────────────────────────────────── */}
        {RECENT.length > 0 && (
          <section
            aria-labelledby="recent-heading"
            style={{
              background: "#f9f9f9",
              padding: "72px 24px",
              borderBottom: "1px solid #eee",
            }}
          >
            <div style={{ maxWidth: 1120, margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <h2
                  id="recent-heading"
                  style={{
                    fontWeight: 800,
                    fontSize: 30,
                    letterSpacing: "-0.03em",
                    color: "#0f0f0f",
                  }}
                >
                  Recently updated
                </h2>
                <a
                  href="#apps"
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#555",
                    textDecoration: "none",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  See all apps →
                </a>
              </div>
              <p
                style={{
                  color: "#888",
                  fontSize: 15,
                  marginBottom: 36,
                  fontFamily: "var(--font-sans)",
                }}
              >
                The latest releases and updates from iStack.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 16,
                }}
              >
                {RECENT.map((app) => (
                  <Link
                    key={app.id}
                    href={`/apps/${app.id}/`}
                    style={{
                      display: "block",
                      background: "#fff",
                      border: "1.5px solid #ebebeb",
                      borderRadius: 18,
                      padding: "20px 18px",
                      textDecoration: "none",
                      color: "#0f0f0f",
                      transition: "all 0.2s",
                    }}
                    className="app-grid-card"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 11,
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "1px solid #eee",
                        }}
                      >
                        <Image
                          src={app.iconUrl}
                          alt={`${app.name} icon`}
                          width={44}
                          height={44}
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 14,
                            color: "#0f0f0f",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {app.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#999",
                            fontWeight: 600,
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {app.playStoreUpdatedOn}
                        </div>
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#666",
                        lineHeight: 1.5,
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {app.short_description || app.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 7. Dev bio ──────────────────────────────────────────────── */}
        <section
          aria-labelledby="bio-heading"
          style={{
            background: "#fff",
            padding: "72px 24px",
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <h2
              id="bio-heading"
              style={{
                fontWeight: 800,
                fontSize: 28,
                letterSpacing: "-0.03em",
                color: "#0f0f0f",
                marginBottom: 20,
              }}
            >
              Built by one person.
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#555",
                lineHeight: 1.75,
                marginBottom: 20,
                fontFamily: "var(--font-sans)",
              }}
            >
              <strong style={{ color: "#0f0f0f" }}>iStack</strong> is an
              independent publisher building small, focused apps that solve
              real everyday problems — no bloat, no paywalls, no dark
              patterns. Every app in this portfolio is free to download and
              built with care.
            </p>
            <p
              style={{
                fontSize: 15,
                color: "#888",
                lineHeight: 1.7,
                marginBottom: 32,
                fontFamily: "var(--font-sans)",
              }}
            >
              {ORGANIZATION.aggregate_stats.total_apps} apps published &middot;{" "}
              {(ORGANIZATION.aggregate_stats.total_installs / 1000).toFixed(0)}K+ installs &middot;{" "}
              {ORGANIZATION.aggregate_stats.avg_rating}★ avg rating
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#f3f4f6",
                  color: "#0f0f0f",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Google Play profile ↗
              </a>
              <a
                href={IOS_DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#f3f4f6",
                  color: "#0f0f0f",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                }}
              >
                App Store profile ↗
              </a>
            </div>
          </div>
        </section>

        {/* ── 8. Icon carousel ────────────────────────────────────────── */}
        <ManyMoreMarquee apps={LIVE_APPS} speed={45} />

        {/* ── 9. All apps grid ────────────────────────────────────────── */}
        <section
          id="apps"
          aria-labelledby="apps-heading"
          style={{
            background: "#fff",
            padding: "80px 24px",
            scrollMarginTop: 80,
          }}
        >
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <h2
              id="apps-heading"
              className="sd-fade-up"
              style={{
                fontWeight: 800,
                fontSize: 30,
                marginBottom: 8,
                letterSpacing: "-0.03em",
                color: "#0f0f0f",
              }}
            >
              All {LIVE_APPS.length} apps
            </h2>
            <p
              className="sd-fade-up"
              style={{
                color: "#888",
                fontSize: 15,
                marginBottom: 36,
                fontFamily: "var(--font-sans)",
              }}
            >
              Every app is free to download and use.
            </p>
            <AppGrid />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
