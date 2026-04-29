import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { APPS, type App } from "@/data/apps";
import { CATEGORIES_LIST, getCategoryBySlug, type CategoryData } from "@/data/categories";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getStoreUrl } from "@/lib/storeUrl";
import {
  generateGraph,
  generateOrganizationSchema,
  generateCollectionPageSchema,
  generateBreadcrumbListSchema,
  generateItemListSchema,
  generateFAQPageSchema,
} from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Static generation ───────────────────────────────────────────────────────

export function generateStaticParams() {
  return CATEGORIES_LIST.map((cat) => ({ slug: cat.slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Not Found | iStack" };

  const appsInCategory = getAppsForCategory(category);
  const count = appsInCategory.length;
  const title = `${category.name} Apps — Free, No Subscription | iStack`;
  const description = `${count} free ${category.name.toLowerCase()} apps by iStack. ${capitalize(category.hub_keyword)}. No subscriptions, no accounts, no dark patterns.`;

  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}/` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/category/${slug}/`,
      siteName: "iStack",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAppsForCategory(category: CategoryData): App[] {
  return APPS.filter((a) => a.seoCategory === category.id);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function platformLabel(app: App) {
  if (app.platform === "ios") return "iOS";
  if (app.platform === "both") return "Android & iOS";
  return "Android";
}

function getCategoryFaqs(category: CategoryData, apps: App[]) {
  const catName = category.name.toLowerCase();
  const top3 = apps
    .filter((a) => a.featured)
    .concat(apps.filter((a) => !a.featured))
    .slice(0, 3)
    .map((a) => a.name)
    .join(", ");
  const hasIos = apps.some((a) => a.platform === "ios" || a.platform === "both");
  const count = apps.length;

  return [
    {
      question: `What is the best free ${catName} app?`,
      answer: `iStack offers ${count} free ${catName} app${count > 1 ? "s" : ""}${top3 ? `, including ${top3}` : ""}. Each is completely free with no subscription required — just download and use.`,
    },
    {
      question: `Are all iStack ${catName} apps really free?`,
      answer: `All iStack apps are free to download. On Android, apps are ad-supported with no subscriptions or in-app purchases. On iOS, apps are free to install and may offer optional premium features through in-app purchase or subscription.`,
    },
    {
      question: `Do iStack ${catName} apps work offline?`,
      answer: `Most iStack ${catName} apps work fully offline. Core features do not require an internet connection. A few apps with live data — such as currency rates or map tiles — need connectivity for real-time updates, but core functionality still works offline.`,
    },
    ...(hasIos
      ? [
          {
            question: `Are iStack ${catName} apps available on iPhone?`,
            answer: `Yes. Several iStack ${catName} apps are available on the App Store for iPhone in addition to Android. Check each app's page for its supported platforms.`,
          },
        ]
      : [
          {
            question: `Are iStack ${catName} apps available on iPhone?`,
            answer: `The ${catName} apps listed here are currently available for Android on Google Play. iStack also publishes iOS-exclusive apps in other categories. Check back for future iOS ${catName} releases.`,
          },
        ]),
    {
      question: `Do iStack ${catName} apps require creating an account?`,
      answer: `No. iStack apps do not require an account, email sign-up, or any registration. Open the app and start using it immediately.`,
    },
    {
      question: `Who makes these ${catName} apps?`,
      answer: `iStack is an independent app publisher that has shipped 45 apps on Android and iOS with 419K+ total installs. Every app is maintained and updated regularly.`,
    },
    {
      question: `How often are iStack ${catName} apps updated?`,
      answer: `Most iStack apps are updated every few weeks. Updates bring new features, performance improvements, and bug fixes. You can check each app's Play Store or App Store listing for the exact update date.`,
    },
  ];
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const allApps = getAppsForCategory(category);
  const featuredFirst = [
    ...allApps.filter((a) => a.featured),
    ...allApps.filter((a) => !a.featured),
  ];
  const heroApps = featuredFirst.slice(0, Math.min(3, allApps.length));
  const remainingApps = featuredFirst.slice(heroApps.length);
  const faqs = getCategoryFaqs(category, allApps);

  const jsonLd = generateGraph([
    generateOrganizationSchema(),
    generateCollectionPageSchema(category, allApps),
    generateBreadcrumbListSchema([
      { name: "Home", item: SITE_URL },
      { name: category.name, item: `${SITE_URL}/category/${slug}/` },
    ]),
    generateItemListSchema(allApps, `${category.name} Apps by iStack`),
    generateFAQPageSchema(faqs),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grain-overlay" aria-hidden="true" />
      <Nav appsHref="/#apps" />

      <main className="pt-16">
        {/* ── Hero ── */}
        <section
          className="border-b"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="mx-auto w-full max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
              >
                <li><Link href="/" className="hover:underline" style={{ color: "var(--accent)" }}>Home</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" style={{ color: "var(--foreground)" }}>{category.name}</li>
              </ol>
            </nav>

            {/* H1 */}
            <h1
              className="mb-4 text-3xl font-semibold leading-tight lg:text-4xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                fontVariationSettings: '"opsz" 48',
                textWrap: "balance",
              }}
            >
              {category.name} apps —{" "}
              <span style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}>
                {category.hub_keyword}
              </span>
            </h1>

            {/* TL;DR */}
            <p
              className="mb-8 max-w-2xl text-base leading-relaxed"
              style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
            >
              iStack builds{" "}
              <strong style={{ color: "var(--foreground)" }}>
                {allApps.length} free {category.name.toLowerCase()} app{allApps.length !== 1 ? "s" : ""}
              </strong>{" "}
              for Android and iOS. Every app is free forever — no subscription, no account required,
              no dark patterns. Built by one indie developer with 419K+ total installs.
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap items-center gap-6">
              {[
                { value: `${allApps.length}`, label: "Apps in category" },
                { value: "Free", label: "Price, always" },
                { value: "4.6★", label: "Avg. rating" },
                { value: "No account", label: "Required" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span
                    className="text-xl font-bold"
                    style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}
                  >
                    {value}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">

          {/* ── Comparison table ── */}
          <section className="py-10 lg:py-12" aria-labelledby="compare-heading">
            <h2
              id="compare-heading"
              className="mb-6 text-xl font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
            >
              All {category.name} apps at a glance
            </h2>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
              <table className="w-full text-sm" style={{ fontFamily: "var(--font-outfit)" }}>
                <thead>
                  <tr style={{ background: "var(--surface)", borderBottom: `1px solid var(--border)` }}>
                    <th scope="col" className="px-4 py-3 text-left font-semibold" style={{ color: "var(--foreground)" }}>App</th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold" style={{ color: "var(--foreground)" }}>Platform</th>
                    <th scope="col" className="hidden px-4 py-3 text-left font-semibold sm:table-cell" style={{ color: "var(--foreground)" }}>Key Feature</th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold" style={{ color: "var(--foreground)" }}>Get App</th>
                  </tr>
                </thead>
                <tbody>
                  {allApps.map((app, i) => (
                    <tr
                      key={app.id}
                      style={{
                        borderTop: i > 0 ? `1px solid var(--border)` : undefined,
                        background: i % 2 === 0 ? "var(--card)" : "var(--surface)",
                      }}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/apps/${app.id}/`}
                          className="flex items-center gap-2.5 hover:underline"
                          style={{ color: "var(--accent)" }}
                        >
                          <div className="shrink-0 overflow-hidden rounded-[10px] border" style={{ borderColor: "var(--border)" }}>
                            <Image
                              src={app.iconUrl}
                              alt={`${app.name} icon`}
                              width={32}
                              height={32}
                              className="h-8 w-8 object-cover"
                              unoptimized
                            />
                          </div>
                          <span className="font-medium" style={{ color: "var(--foreground)" }}>{app.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            borderColor: "var(--border)",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          {platformLabel(app)}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-sm sm:table-cell" style={{ color: "var(--muted-foreground)" }}>
                        {app.subtitle}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={getStoreUrl(app, "category", "mid")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-[filter] hover:brightness-110"
                          style={{
                            background: "var(--accent)",
                            color: "var(--primary-foreground)",
                          }}
                          aria-label={`Install ${app.name}`}
                        >
                          Install
                          <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Divider />

          {/* ── Featured apps ── */}
          <section className="py-10 lg:py-12" aria-labelledby="featured-heading">
            <div className="mb-2 flex items-center gap-2">
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
                style={{ background: "var(--foreground)", color: "var(--primary-foreground)" }}
              >
                Editor's Choice
              </span>
            </div>
            <h2
              id="featured-heading"
              className="mb-8 text-xl font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
            >
              Top {category.name.toLowerCase()} apps from iStack
            </h2>

            <div className="flex flex-col gap-10">
              {heroApps.map((app) => (
                <FeaturedAppCard key={app.id} app={app} category={category} />
              ))}
            </div>

            {/* Remaining apps compact grid */}
            {remainingApps.length > 0 && (
              <div className="mt-10">
                <h3
                  className="mb-5 text-base font-semibold"
                  style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}
                >
                  More {category.name.toLowerCase()} apps
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {remainingApps.map((app) => (
                    <CompactAppCard key={app.id} app={app} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <Divider />

          {/* ── Use cases (TODO: human writing) ── */}
          <section className="py-10 lg:py-12" aria-labelledby="usecases-heading">
            <h2
              id="usecases-heading"
              className="mb-4 text-xl font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
            >
              Which {category.name.toLowerCase()} app is right for you?
            </h2>
            {/* TODO: Write 2-3 use-case sub-sections with H3s like:
                "Best {category} app for {use case 1}" — 150-200 words each
                linking to specific /apps/{slug}/ pages.
                Each section should target a secondary keyword from app.secondary_keywords.
            */}
            <div
              className="rounded-xl border border-dashed p-6 text-center"
              style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
              <p className="text-sm" style={{ fontFamily: "var(--font-outfit)" }}>
                TODO: Use case sub-sections — "Best {category.name.toLowerCase()} app for [use case]" — requires keyword research + human writing.
              </p>
            </div>
          </section>

          <Divider />

          {/* ── FAQ ── */}
          <section className="py-10 lg:py-12" aria-labelledby="faq-heading">
            <h2
              id="faq-heading"
              className="mb-6 text-xl font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
            >
              Frequently asked questions
            </h2>
            <div className="flex flex-col gap-0 divide-y" style={{ borderColor: "var(--border)" }}>
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-4">
                  <summary
                    className="cursor-pointer list-none text-sm font-semibold leading-snug"
                    style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}
                  >
                    {faq.question}
                  </summary>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
                  >
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <Divider />

          {/* ── Repeat CTA: all apps in category ── */}
          <section className="py-10 lg:py-12" aria-labelledby="all-apps-heading">
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="all-apps-heading"
                className="text-xl font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
              >
                All {allApps.length} free {category.name.toLowerCase()} app{allApps.length !== 1 ? "s" : ""}
              </h2>
              <Link
                href="/"
                className="text-xs font-medium transition-opacity hover:opacity-80"
                style={{ color: "var(--accent)", fontFamily: "var(--font-outfit)" }}
              >
                Browse all categories →
              </Link>
            </div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {allApps.map((app) => (
                <div
                  key={app.id}
                  className="group flex flex-col items-center gap-2 rounded-xl border p-4 text-center"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Link href={`/apps/${app.id}/`} tabIndex={-1} aria-hidden="true">
                    <div className="overflow-hidden rounded-[16px] border shadow-sm" style={{ borderColor: "var(--border)" }}>
                      <Image
                        src={app.iconUrl}
                        alt={`${app.name} icon`}
                        width={56}
                        height={56}
                        className="h-14 w-14 object-cover"
                        unoptimized
                      />
                    </div>
                  </Link>
                  <Link
                    href={`/apps/${app.id}/`}
                    className="text-xs font-medium leading-tight line-clamp-2 hover:underline"
                    style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}
                  >
                    {app.name}
                  </Link>
                  <a
                    href={getStoreUrl(app, "category", "footer")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto rounded-lg px-3 py-1 text-[11px] font-semibold transition-[filter] hover:brightness-110"
                    style={{ background: "var(--foreground)", color: "#fff" }}
                    aria-label={`Install ${app.name}`}
                  >
                    {app.platform === "ios" ? "App Store" : "Play Store"}
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* ── Back to all ── */}
          <div className="py-8 text-center">
            <Link
              href="/"
              className="text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: "var(--accent)", fontFamily: "var(--font-outfit)" }}
            >
              ← Browse all categories
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      className="h-px w-full"
      style={{ background: "linear-gradient(to right, transparent, var(--border), transparent)" }}
      aria-hidden="true"
    />
  );
}

function FeaturedAppCard({ app, category }: { app: App; category: CategoryData }) {
  const storeUrl = getStoreUrl(app, "category", "mid");
  const isIos = app.platform === "ios";
  const hasBanner = !!app.bannerUrl;

  return (
    <article
      className="flex flex-col gap-6 rounded-2xl border p-6 lg:flex-row lg:items-start lg:gap-8"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {/* Banner / Icon */}
      <div className="shrink-0 lg:w-64">
        {hasBanner ? (
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)", aspectRatio: "16/9" }}>
            <Image
              src={app.bannerUrl}
              alt={`${app.name} — ${app.subtitle}`}
              width={256}
              height={144}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <Image
              src={app.iconUrl}
              alt={`${app.name} icon`}
              width={96}
              height={96}
              className="h-24 w-24 object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="overflow-hidden rounded-[14px] border shadow-sm" style={{ borderColor: "var(--border)" }}>
            <Image
              src={app.iconUrl}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 object-cover"
              unoptimized
              aria-hidden="true"
            />
          </div>
          <div>
            <Link
              href={`/apps/${app.id}/`}
              className="font-semibold hover:underline"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-display)", fontSize: 18 }}
            >
              {app.name}
            </Link>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}>
              {category.name} · {platformLabel(app)} · Free
            </p>
          </div>
        </div>

        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
        >
          {app.short_description}
        </p>

        {/* Feature bullets from subtitle split */}
        <ul className="flex flex-col gap-1">
          {app.subtitle.split(/[·•&,]+/).slice(0, 3).map((feat) => (
            <li
              key={feat}
              className="flex items-center gap-2 text-xs"
              style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
            >
              <span style={{ color: "var(--foreground)" }}>✓</span>
              {feat.trim()}
            </li>
          ))}
        </ul>

        <div className="mt-2 flex items-center gap-3">
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-[filter] hover:brightness-110"
            style={{ background: "var(--accent)", color: "var(--primary-foreground)", fontFamily: "var(--font-outfit)" }}
            aria-label={`Install ${app.name} on ${isIos ? "App Store" : "Google Play"}`}
          >
            {isIos ? "Get on App Store" : "Install on Google Play"}
            <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
          </a>
          <Link
            href={`/apps/${app.id}/`}
            className="text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "var(--accent)", fontFamily: "var(--font-outfit)" }}
          >
            Full details →
          </Link>
        </div>
      </div>
    </article>
  );
}

function CompactAppCard({ app }: { app: App }) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <div className="shrink-0 overflow-hidden rounded-[12px] border shadow-sm" style={{ borderColor: "var(--border)" }}>
        <Image
          src={app.iconUrl}
          alt={`${app.name} icon`}
          width={44}
          height={44}
          className="h-11 w-11 object-cover"
          unoptimized
        />
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/apps/${app.id}/`}
          className="text-sm font-semibold hover:underline line-clamp-1"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}
        >
          {app.name}
        </Link>
        <p
          className="mt-0.5 text-xs line-clamp-2"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
        >
          {app.subtitle}
        </p>
        <a
          href={getStoreUrl(app, "category", "mid")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block rounded-md px-2.5 py-1 text-[11px] font-semibold transition-[filter] hover:brightness-110"
          style={{ background: "var(--foreground)", color: "#fff", fontFamily: "var(--font-outfit)" }}
          aria-label={`Install ${app.name}`}
        >
          {app.platform === "ios" ? "App Store" : "Play Store"}
        </a>
      </div>
    </div>
  );
}
