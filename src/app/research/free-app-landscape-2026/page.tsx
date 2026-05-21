import type { Metadata } from "next";
import Link from "next/link";
import { APPS } from "@/data/apps";
import {
  generateGraph,
  generateOrganizationSchema,
  generateBreadcrumbListSchema,
  generateFAQPageSchema,
} from "@/lib/schema";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";
const RECENCY_REFERENCE_TIME = new Date("2026-05-20T00:00:00.000Z").getTime();
const CANONICAL = "/research/free-app-landscape-2026/";
const PUBLISHED = "2026-04-19";

export const metadata: Metadata = {
  title: "The free Android & iOS app landscape in 2026 — iStack Research",
  description:
    "Original analysis of 45 free Android and iOS apps across 7 categories, covering 419,000+ installs: what makes a 'truly free' app truly free, category install distribution, rating patterns, and the hidden cost of account-gated apps.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "The free Android & iOS app landscape in 2026 — iStack Research",
    description:
      "Original data on 45 free apps across 419K+ installs: category distribution, rating patterns, account-free vs account-gated apps, and what 'free' actually means in 2026.",
    type: "article",
    url: CANONICAL,
  },
  twitter: {
    card: "summary_large_image",
    title: "The free Android & iOS app landscape in 2026 — iStack Research",
    description:
      "Original data on 45 free apps across 419K+ installs: category distribution, rating patterns, account-free vs account-gated apps, and what 'free' actually means in 2026.",
  },
};

/* ── Derived stats from actual portfolio data ──────────────────────────── */

function parseInstalls(raw?: string): number {
  if (!raw) return 0;
  const m = raw.replace(/,/g, "").match(/([\d.]+)\s*([KMB]?)\+?/i);
  if (!m) return 0;
  const num = parseFloat(m[1]);
  const unit = m[2].toUpperCase();
  if (unit === "K") return num * 1_000;
  if (unit === "M") return num * 1_000_000;
  if (unit === "B") return num * 1_000_000_000;
  return num;
}

function formatInstalls(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

const CAT_NAMES: Record<string, string> = {
  productivity: "Productivity",
  "ai-photo": "AI & Photo",
  utilities: "Utilities",
  health: "Health & Fitness",
  education: "Education",
  personalization: "Personalization",
  voice: "Voice & Commands",
};

export default function ResearchPage() {
  // Total apps & platform split
  const totalApps = APPS.length;
  const android = APPS.filter((a) => a.platform === "android").length;
  const ios = APPS.filter((a) => a.platform === "ios").length;
  const both = APPS.filter((a) => a.platform === "both").length;

  // Installs (Android only — Apple does not publish install counts)
  const androidApps = APPS.filter((a) => a.platform !== "ios");
  const withInstalls = androidApps.filter((a) => a.playStoreInstalls);
  const totalInstalls = withInstalls.reduce(
    (sum, a) => sum + parseInstalls(a.playStoreInstalls),
    0
  );
  const medianInstalls = (() => {
    const values = withInstalls
      .map((a) => parseInstalls(a.playStoreInstalls))
      .sort((a, b) => a - b);
    if (values.length === 0) return 0;
    const mid = Math.floor(values.length / 2);
    return values.length % 2 === 0
      ? (values[mid - 1] + values[mid]) / 2
      : values[mid];
  })();

  // Top 5 by installs
  const topByInstalls = [...withInstalls]
    .sort(
      (a, b) =>
        parseInstalls(b.playStoreInstalls) - parseInstalls(a.playStoreInstalls)
    )
    .slice(0, 5);

  // Category distribution
  const catCounts: Record<string, { count: number; installs: number }> = {};
  for (const a of APPS) {
    const c = a.seoCategory;
    if (!catCounts[c]) catCounts[c] = { count: 0, installs: 0 };
    catCounts[c].count += 1;
    catCounts[c].installs += parseInstalls(a.playStoreInstalls);
  }
  const catRows = Object.entries(catCounts)
    .map(([slug, d]) => ({ slug, name: CAT_NAMES[slug] ?? slug, ...d }))
    .sort((a, b) => b.installs - a.installs);

  // Rating distribution
  const withRating = APPS.filter((a) => typeof a.rating === "number");
  const avgRating =
    withRating.reduce((s, a) => s + (a.rating ?? 0), 0) /
    (withRating.length || 1);
  const rating45plus = withRating.filter((a) => (a.rating ?? 0) >= 4.5).length;
  const rating40to44 = withRating.filter(
    (a) => (a.rating ?? 0) >= 4.0 && (a.rating ?? 0) < 4.5
  ).length;
  const ratingUnder40 = withRating.filter((a) => (a.rating ?? 0) < 4.0).length;

  // Release recency
  const withDate = APPS.filter((a) => a.playStoreUpdatedOn);
  const past90Days = withDate.filter((a) => {
    const d = new Date(a.playStoreUpdatedOn!);
    const daysAgo = (RECENCY_REFERENCE_TIME - d.getTime()) / 86_400_000;
    return daysAgo <= 90;
  }).length;

  const faqs = [
    {
      question: "What percentage of 'free' Android apps are actually free?",
      answer:
        "Of the 43 Android apps in this portfolio, 100% are free with no paywall, subscription, in-app purchase, or account requirement — supported solely by ads. This is uncommon in the broader Play Store, where most 'free' productivity and fitness apps now gate core features behind a subscription or require a sign-in that collects user data. iOS apps in the portfolio are free to download and may offer optional premium features via in-app purchase or subscription.",
    },
    {
      question: "What is the median install count for a free indie mobile app?",
      answer: `Across this 45-app portfolio, the median install count is ${formatInstalls(
        medianInstalls
      )} and the total is ${formatInstalls(totalInstalls)}+. Indie Android app install counts follow a power-law distribution — the top 5 apps account for a disproportionate share of total installs.`,
    },
    {
      question: "Which app categories have the highest install volume?",
      answer: `In this dataset, the highest-install categories are ${catRows
        .slice(0, 3)
        .map((c) => c.name)
        .join(", ")}. Productivity and utilities consistently outperform niche categories because the total addressable market for scanners, step counters, and document readers is broader than for specialty tools.`,
    },
    {
      question: "Does requiring an account hurt an app's install count?",
      answer:
        "Account-gated apps typically see 30–50% lower install-to-active-user conversion than no-account apps. In this portfolio, every app is account-free by design — users can install and use the app immediately without a sign-up, which eliminates a major drop-off point in onboarding.",
    },
    {
      question: "How often are indie mobile apps updated?",
      answer: `In this portfolio, ${past90Days} of ${withDate.length} apps with known update dates (${Math.round(
        (past90Days / (withDate.length || 1)) * 100
      )}%) have been updated in the past 90 days. Google Play's ranking algorithm rewards recency — apps updated within 90 days are favored over stale listings in discovery surfaces.`,
    },
  ];

  const jsonLd = generateGraph([
    generateOrganizationSchema(),
    generateBreadcrumbListSchema([
      { name: "Home", item: SITE_URL },
      { name: "Research", item: `${SITE_URL}/research/` },
      {
        name: "Free app landscape 2026",
        item: `${SITE_URL}${CANONICAL}`,
      },
    ]),
    {
      "@type": "Article",
      headline: "The free Android & iOS app landscape in 2026",
      description:
        "Original analysis of 45 free apps across 7 categories covering 419,000+ installs.",
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      author: { "@id": `${SITE_URL}/#founder` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: `${SITE_URL}${CANONICAL}`,
    },
    {
      "@type": "Dataset",
      name: "iStack free mobile app portfolio (n=45)",
      description:
        "Per-app platform, category, install tier, rating, and last-update date for 45 free Android and iOS apps published by iStack.",
      creator: { "@id": `${SITE_URL}/#organization` },
      license: "https://creativecommons.org/licenses/by/4.0/",
      datePublished: PUBLISHED,
      keywords: [
        "free Android apps",
        "free iOS apps",
        "no account apps",
        "indie mobile apps",
      ],
    },
    generateFAQPageSchema(faqs),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav appsHref="/#apps" />

      <main className="mx-auto w-full max-w-3xl px-5 py-24 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol
            className="flex flex-wrap items-center gap-1.5 text-xs"
            style={{
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            <li>
              <Link
                href="/"
                style={{ color: "var(--accent)" }}
                className="hover:underline underline-offset-2"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">Research</li>
          </ol>
        </nav>

        <p
          className="mb-3 text-[11px] font-bold uppercase tracking-wider"
          style={{ color: "var(--accent)", fontFamily: "var(--font-outfit)" }}
        >
          iStack Research — April 2026
        </p>

        <h1
          className="mb-4 text-4xl font-semibold leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--foreground)",
            fontVariationSettings: '"opsz" 48',
            textWrap: "balance",
          }}
        >
          The free Android & iOS app landscape in 2026
        </h1>

        <p
          className="mb-6 text-base italic"
          style={{
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-outfit)",
          }}
        >
          Original data from a {totalApps}-app, {formatInstalls(totalInstalls)}+
          install indie portfolio
        </p>

        {/* TL;DR answer capsule */}
        <aside
          aria-label="Key findings"
          className="mb-12 rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <p
            className="mb-3 text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "var(--accent)", fontFamily: "var(--font-outfit)" }}
          >
            Key findings
          </p>
          <ul
            className="space-y-2 text-sm leading-relaxed"
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            <li>
              <strong>{totalApps} apps</strong> analyzed across{" "}
              {Object.keys(catCounts).length} categories —{" "}
              {android + both} Android, {ios + both} iOS.
            </li>
            <li>
              <strong>{formatInstalls(totalInstalls)}+ total installs</strong>{" "}
              with a median of {formatInstalls(medianInstalls)} installs per
              app.
            </li>
            <li>
              <strong>{avgRating.toFixed(2)} average rating</strong> across{" "}
              {withRating.length} rated apps;{" "}
              {Math.round((rating45plus / withRating.length) * 100)}% rated 4.5★
              or higher.
            </li>
            <li>
              <strong>100% account-free</strong> — every app installs and runs
              without sign-up, email, or third-party login.
            </li>
            <li>
              <strong>Android: 100% ad-supported</strong> — no subscriptions,
              no trials, no in-app purchases. iOS apps are free to download
              with optional premium features.
            </li>
          </ul>
        </aside>

        {/* Context */}
        <section className="mb-12">
          <h2
            className="mb-4 text-2xl font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              fontVariationSettings: '"opsz" 36',
            }}
          >
            Why this matters
          </h2>
          <p
            className="mb-4 text-base leading-relaxed"
            style={{
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            The phrase &quot;free app&quot; has been hollowed out. Most apps
            marketed as free in 2026 are free to download but gate core
            functionality behind subscriptions, trials that convert to paid, or
            account-only access that collects user data in exchange for the
            product. This analysis uses a {totalApps}-app indie portfolio as a
            reference dataset to quantify what a genuinely free, account-free
            app catalog looks like — and how it performs in the wild.
          </p>
          <p
            className="text-base leading-relaxed"
            style={{
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            All numbers below are drawn from live Google Play Store and App
            Store listings for apps published by iStack, as of April 2026.
          </p>
        </section>

        {/* Platform split */}
        <section className="mb-12">
          <h2
            className="mb-4 text-2xl font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              fontVariationSettings: '"opsz" 36',
            }}
          >
            Platform distribution
          </h2>
          <StatGrid
            rows={[
              { label: "Total apps", value: String(totalApps) },
              { label: "Android only", value: String(android) },
              { label: "iOS only", value: String(ios) },
              { label: "Both platforms", value: String(both) },
            ]}
          />
          <p
            className="mt-4 text-sm leading-relaxed"
            style={{
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            Android-first distribution is typical for indie publishers:
            lower barrier to publish, faster review, and no $99/year
            subscription to maintain a developer account. iOS apps in this
            portfolio target niches underserved on Android, such as
            trading-card valuation and AI-powered photo editing.
          </p>
        </section>

        {/* Category distribution */}
        <section className="mb-12">
          <h2
            className="mb-4 text-2xl font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              fontVariationSettings: '"opsz" 36',
            }}
          >
            Category distribution
          </h2>
          <div
            className="overflow-x-auto rounded-xl border"
            style={{ borderColor: "var(--border)" }}
          >
            <table
              className="w-full text-sm"
              style={{ fontFamily: "var(--font-outfit)", borderCollapse: "collapse" }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid var(--border)`,
                    background: "var(--surface)",
                  }}
                >
                  <th
                    className="p-4 text-left font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Category
                  </th>
                  <th
                    className="p-4 text-right font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Apps
                  </th>
                  <th
                    className="p-4 text-right font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Total installs
                  </th>
                  <th
                    className="p-4 text-right font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {catRows.map((r, i) => (
                  <tr
                    key={r.slug}
                    style={{
                      borderBottom:
                        i < catRows.length - 1 ? `1px solid var(--border)` : "none",
                    }}
                  >
                    <td
                      className="p-4"
                      style={{ color: "var(--foreground)" }}
                    >
                      <Link
                        href={`/category/${r.slug}/`}
                        style={{ color: "var(--accent)" }}
                        className="hover:underline underline-offset-2"
                      >
                        {r.name}
                      </Link>
                    </td>
                    <td
                      className="p-4 text-right tabular-nums"
                      style={{ color: "var(--foreground)" }}
                    >
                      {r.count}
                    </td>
                    <td
                      className="p-4 text-right tabular-nums"
                      style={{ color: "var(--foreground)" }}
                    >
                      {formatInstalls(r.installs)}
                    </td>
                    <td
                      className="p-4 text-right tabular-nums"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {Math.round((r.installs / (totalInstalls || 1)) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top installs */}
        <section className="mb-12">
          <h2
            className="mb-4 text-2xl font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              fontVariationSettings: '"opsz" 36',
            }}
          >
            Top 5 apps by install count
          </h2>
          <ol className="space-y-3">
            {topByInstalls.map((a, i) => (
              <li
                key={a.id}
                className="flex items-center gap-4 rounded-xl border p-4"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: "var(--accent)",
                    color: "var(--primary-foreground)",
                    fontFamily: "var(--font-outfit)",
                  }}
                >
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/apps/${a.id}/`}
                    className="text-base font-semibold hover:underline underline-offset-4"
                    style={{
                      color: "var(--foreground)",
                      fontFamily: "var(--font-outfit)",
                    }}
                  >
                    {a.name}
                  </Link>
                  <p
                    className="text-xs"
                    style={{
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-outfit)",
                    }}
                  >
                    {CAT_NAMES[a.seoCategory]} · Android
                  </p>
                </div>
                <p
                  className="tabular-nums text-sm font-semibold"
                  style={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-outfit)",
                  }}
                >
                  {a.playStoreInstalls} installs
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Ratings */}
        <section className="mb-12">
          <h2
            className="mb-4 text-2xl font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              fontVariationSettings: '"opsz" 36',
            }}
          >
            Rating distribution
          </h2>
          <StatGrid
            rows={[
              { label: "Average rating", value: avgRating.toFixed(2) + " / 5" },
              {
                label: "Apps rated 4.5★+",
                value: `${rating45plus} (${Math.round(
                  (rating45plus / withRating.length) * 100
                )}%)`,
              },
              {
                label: "Apps rated 4.0–4.4★",
                value: `${rating40to44} (${Math.round(
                  (rating40to44 / withRating.length) * 100
                )}%)`,
              },
              {
                label: "Apps rated below 4.0★",
                value: `${ratingUnder40} (${Math.round(
                  (ratingUnder40 / withRating.length) * 100
                )}%)`,
              },
            ]}
          />
        </section>

        {/* Freshness */}
        <section className="mb-12">
          <h2
            className="mb-4 text-2xl font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              fontVariationSettings: '"opsz" 36',
            }}
          >
            Update recency
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            Of {withDate.length} apps with recorded last-update dates,{" "}
            <strong>{past90Days} ({Math.round((past90Days / (withDate.length || 1)) * 100)}%)</strong>{" "}
            have been updated within the past 90 days. Google Play&apos;s discovery
            algorithm favors recently updated listings — stale apps
            progressively lose impression share, which creates a reinforcing
            cycle against abandoned projects.
          </p>
        </section>

        {/* Methodology */}
        <section className="mb-12">
          <h2
            className="mb-4 text-2xl font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              fontVariationSettings: '"opsz" 36',
            }}
          >
            Methodology
          </h2>
          <ul
            className="space-y-2 text-sm leading-relaxed"
            style={{
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            <li>
              <strong>Dataset:</strong> all {totalApps} apps published by
              iStack on Google Play and the Apple App Store as of {PUBLISHED}.
            </li>
            <li>
              <strong>Install counts:</strong> scraped from the public Google
              Play listing for each Android app. Apple does not publish install
              counts; iOS apps are excluded from install-count figures.
            </li>
            <li>
              <strong>Ratings:</strong> current store-listed aggregate star
              rating (1–5 scale).
            </li>
            <li>
              <strong>Category:</strong> internal iStack SEO category, mapped
              to the {Object.keys(catCounts).length}-category taxonomy used on
              this site.
            </li>
            <li>
              <strong>Limitations:</strong> single-publisher dataset — results
              should not be extrapolated to the broader Play Store without
              additional sampling. Install counts are Play Store bins (e.g.
              &quot;10,000+&quot;), not exact figures.
            </li>
            <li>
              <strong>License:</strong> this dataset and analysis are released
              under CC BY 4.0. Cite as &quot;iStack Research, April 2026,
              istack.cc/research/free-app-landscape-2026/&quot;.
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2
            className="mb-6 text-2xl font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              fontVariationSettings: '"opsz" 36',
            }}
          >
            Frequently asked questions
          </h2>
          <dl className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-xl border"
                style={{ borderColor: "var(--border)" }}
              >
                <summary
                  className="flex cursor-pointer select-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium"
                  style={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-outfit)",
                    listStyle: "none",
                  }}
                >
                  <dt>{faq.question}</dt>
                  <span
                    className="shrink-0 text-xs"
                    style={{ color: "var(--accent)" }}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </summary>
                <dd
                  className="px-5 pb-4 text-sm leading-relaxed"
                  style={{
                    color: "var(--muted-foreground)",
                    fontFamily: "var(--font-outfit)",
                  }}
                >
                  {faq.answer}
                </dd>
              </details>
            ))}
          </dl>
        </section>

        <p
          className="text-xs"
          style={{
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-outfit)",
          }}
        >
          Published {PUBLISHED}. Analysis by iStack. Licensed CC BY 4.0.
        </p>
      </main>

      <Footer />
    </>
  );
}

/* ── Local helpers ─────────────────────────────────────────────────────── */

function StatGrid({
  rows,
}: {
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((r) => (
        <div
          key={r.label}
          className="rounded-xl border p-4"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
          }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            {r.label}
          </p>
          <p
            className="mt-1 text-2xl font-semibold tabular-nums"
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            {r.value}
          </p>
        </div>
      ))}
    </div>
  );
}
