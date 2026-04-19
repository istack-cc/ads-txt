import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  Download,
  ExternalLink,
  Info,
  ShieldCheck,
  Star,
} from "lucide-react";
import {
  APPS,
  DEVELOPER_URL,
  IOS_DEVELOPER_URL,
  getAppBySlug,
  getStoreUrl,
  type App,
} from "@/data/apps";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

function toAbsoluteUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

function schemaCategory(category: App["category"]) {
  switch (category) {
    case "Health":
      return "HealthApplication";
    case "Photography":
      return "MultimediaApplication";
    case "Productivity":
      return "BusinessApplication";
    case "Personalization":
      return "PersonalizationApplication";
    case "Utilities":
    default:
      return "UtilitiesApplication";
  }
}

export function generateStaticParams() {
  return APPS.map((app) => ({ slug: app.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    return {
      title: "App Not Found | iStack",
      description: "The requested app page could not be found.",
    };
  }

  const pageTitle = `${app.name} – ${app.subtitle} | iStack`;
  const rawDesc = app.playStoreShortDescription ?? app.description;
  const pageDescription =
    rawDesc.length > 160 ? rawDesc.substring(0, 157) + "..." : rawDesc;
  const canonical = `/apps/${app.id}/`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "website",
      url: canonical,
      images: [
        {
          url: toAbsoluteUrl(app.bannerUrl),
          width: 1200,
          height: 675,
          alt: `${app.name} – ${app.subtitle}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [app.bannerUrl],
    },
  };
}

export default async function AppLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    notFound();
  }

  const storeUrl = getStoreUrl(app);
  const isIos = app.platform === "ios";
  const devUrl = isIos ? IOS_DEVELOPER_URL : DEVELOPER_URL;
  const relatedApps = APPS.filter(
    (candidate) =>
      candidate.category === app.category && candidate.id !== app.id
  ).slice(0, 6);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Apps", item: `${SITE_URL}/#apps` },
      { "@type": "ListItem", position: 3, name: app.name, item: `${SITE_URL}/apps/${app.id}/` },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    operatingSystem: isIos ? "iOS" : "Android",
    applicationCategory: schemaCategory(app.category),
    applicationSubCategory: app.playStoreCategory ?? app.category,
    description: app.description,
    dateModified: app.playStoreUpdatedOn,
    contentRating: app.playStoreContentRating,
    url: storeUrl,
    mainEntityOfPage: `${SITE_URL}/apps/${app.id}`,
    image: [toAbsoluteUrl(app.iconUrl), toAbsoluteUrl(app.bannerUrl)],
    screenshot: [toAbsoluteUrl(app.bannerUrl)],
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "iStack",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "iStack",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.ico`,
      },
      sameAs: [DEVELOPER_URL],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="grain-overlay" aria-hidden="true" />
      <Nav appsHref="/#apps" />

      <main className="pt-16">
        {/* ── Hero: Play Store-style 2-column layout ── */}
        <div
          className="border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <article className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-8 lg:py-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
              {/* Left: Banner / Screenshot */}
              <div className="lg:flex-[3] lg:min-w-0">
                <div
                  className="relative overflow-hidden rounded-2xl border"
                  style={{
                    borderColor: "var(--border)",
                    aspectRatio: "16 / 9",
                  }}
                >
                  <Image
                    src={app.bannerUrl}
                    alt={`${app.name} app screenshot`}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
              </div>

              {/* Right: App info panel */}
              <div className="flex flex-col lg:flex-[2] lg:min-w-0">
                {/* Icon + Name + Developer */}
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 overflow-hidden rounded-[20px] border shadow-lg"
                    style={{ borderColor: "var(--border-hover)" }}
                  >
                    <Image
                      src={app.iconUrl}
                      alt={`${app.name} icon`}
                      width={84}
                      height={84}
                      className="h-[84px] w-[84px] object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1
                      className="text-2xl font-semibold leading-tight lg:text-3xl"
                      style={{
                        fontFamily: "var(--font-fraunces)",
                        color: "var(--foreground)",
                        fontVariationSettings: '"opsz" 48',
                        textWrap: "balance",
                      }}
                    >
                      {app.name}
                    </h1>
                    <a
                      href={devUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm font-medium transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        color: "var(--accent)",
                        fontFamily: "var(--font-outfit)",
                      }}
                    >
                      iStack
                    </a>
                    <p
                      className="mt-0.5 text-xs"
                      style={{
                        color: "var(--muted-foreground)",
                        fontFamily: "var(--font-outfit)",
                      }}
                    >
                      {app.playStoreCategory ?? app.category}
                    </p>
                  </div>
                </div>

                {/* Stats row */}
                <div
                  className="mt-5 flex items-center gap-4 border-y py-4"
                  style={{
                    borderColor: "var(--border)",
                    fontFamily: "var(--font-outfit)",
                  }}
                >
                  <div className="flex flex-col items-center gap-0.5 flex-1">
                    <div className="flex items-center gap-1">
                      <Star
                        className="h-4 w-4"
                        style={{ color: "var(--accent)" }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-lg font-bold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {app.playStoreContentRating ?? "Everyone"}
                      </span>
                    </div>
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Content Rating
                    </span>
                  </div>
                  <div
                    className="h-8 w-px"
                    style={{ background: "var(--border)" }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col items-center gap-0.5 flex-1">
                    <span
                      className="text-lg font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      Free
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Price
                    </span>
                  </div>
                </div>

                {/* Install button */}
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2.5 rounded-xl text-sm font-semibold transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    background: "var(--accent)",
                    color: "var(--primary-foreground)",
                    fontFamily: "var(--font-outfit)",
                    touchAction: "manipulation",
                  }}
                  aria-label={`Install ${app.name} on ${isIos ? "the App Store" : "Google Play"}`}
                >
                  {isIos ? <AppleIcon /> : <PlayStoreIcon />}
                  {isIos ? "Get on the App Store" : "Install on Google Play"}
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                </a>

                {/* Trust badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { label: "Free", icon: Download },
                    { label: "No Account", icon: BadgeCheck },
                    { label: isIos ? "iPhone" : "Android", icon: ShieldCheck },
                  ].map(({ label, icon: Icon }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--muted-foreground)",
                        fontFamily: "var(--font-outfit)",
                      }}
                    >
                      <Icon
                        className="h-3.5 w-3.5"
                        style={{ color: "var(--accent)" }}
                        aria-hidden="true"
                      />
                      {label}
                    </span>
                  ))}
                </div>

                {/* Subtitle */}
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{
                    color: "var(--muted-foreground)",
                    fontFamily: "var(--font-outfit)",
                  }}
                >
                  {app.subtitle}
                </p>

                {/* Updated / Rating metadata */}
                {app.playStoreUpdatedOn && (
                  <p
                    className="mt-3 text-xs"
                    style={{
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-outfit)",
                    }}
                  >
                    Updated {app.playStoreUpdatedOn}
                  </p>
                )}
              </div>
            </div>
          </article>
        </div>

        {/* ── Content below the fold ── */}
        <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
          {/* About This App */}
          <section className="py-10 lg:py-12">
            <div className="mb-6 flex items-center justify-between">
              <h2
                className="text-xl font-semibold"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  color: "var(--foreground)",
                  fontVariationSettings: '"opsz" 36',
                }}
              >
                About This App
              </h2>
              <ChevronRight
                className="h-5 w-5"
                style={{ color: "var(--muted-foreground)" }}
                aria-hidden="true"
              />
            </div>
            <p
              className="max-w-3xl whitespace-pre-line text-sm leading-relaxed"
              style={{
                color: "var(--muted-foreground)",
                fontFamily: "var(--font-outfit)",
              }}
            >
              {app.description}
            </p>

            {/* Category tag */}
            <div className="mt-6">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  fontFamily: "var(--font-outfit)",
                }}
              >
                <Info
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--accent)" }}
                  aria-hidden="true"
                />
                {app.category}
              </span>
            </div>
          </section>

          <SectionDivider />

          {/* What's New */}
          {app.playStoreWhatsNew && (
            <>
              <section className="py-10 lg:py-12">
                <h2
                  className="mb-4 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    color: "var(--foreground)",
                    fontVariationSettings: '"opsz" 36',
                  }}
                >
                  What&rsquo;s New
                </h2>
                <p
                  className="max-w-3xl text-sm leading-relaxed"
                  style={{
                    color: "var(--muted-foreground)",
                    fontFamily: "var(--font-outfit)",
                  }}
                >
                  {app.playStoreWhatsNew}
                </p>
              </section>
              <SectionDivider />
            </>
          )}

          {/* App Highlights */}
          <section className="py-10 lg:py-12">
            <h2
              className="mb-6 text-xl font-semibold"
              style={{
                fontFamily: "var(--font-fraunces)",
                color: "var(--foreground)",
                fontVariationSettings: '"opsz" 36',
              }}
            >
              Highlights
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: app.subtitle,
                  text: `${app.name} is a free ${isIos ? "iOS" : "Android"} app that delivers ${app.subtitle.toLowerCase()}. No account needed — open the app and start immediately.`,
                },
                {
                  title: `${app.category} App`,
                  text: `${app.name} is focused on ${app.category.toLowerCase()} — one clear job, no bloated features or unnecessary steps.`,
                },
                {
                  title: `Free on ${isIos ? "App Store" : "Google Play"}`,
                  text: `Download ${app.name} free on ${isIos ? "the App Store" : "Google Play"}. Rated ${app.playStoreContentRating ?? "Everyone"}${app.playStoreInstalls ? `. ${app.playStoreInstalls} downloads` : ""}.`,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  <p
                    className="mb-1.5 text-xs font-semibold uppercase tracking-wider"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-outfit)",
                    }}
                  >
                    {card.title}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "var(--foreground)",
                      fontFamily: "var(--font-outfit)",
                    }}
                  >
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <SectionDivider />

          {/* Similar Apps */}
          {relatedApps.length > 0 && (
            <>
              <section className="py-10 lg:py-12">
                <div className="mb-6 flex items-center justify-between">
                  <h2
                    className="text-xl font-semibold"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      color: "var(--foreground)",
                      fontVariationSettings: '"opsz" 36',
                    }}
                  >
                    Similar Apps
                  </h2>
                  <Link
                    href="/#apps"
                    className="text-xs font-medium transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-outfit)",
                    }}
                  >
                    See all
                  </Link>
                </div>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                  {relatedApps.map((related) => (
                    <Link
                      key={related.id}
                      href={`/apps/${related.id}`}
                      className="group flex flex-col items-center gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-[--surface]"
                      style={{ touchAction: "manipulation" }}
                    >
                      <div
                        className="overflow-hidden rounded-[18px] border shadow-md transition-transform duration-200 group-hover:scale-105"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <Image
                          src={related.iconUrl}
                          alt={`${related.name} icon`}
                          width={72}
                          height={72}
                          className="h-[72px] w-[72px] object-cover"
                        />
                      </div>
                      <div className="w-full text-center">
                        <p
                          className="text-xs font-medium leading-tight line-clamp-2"
                          style={{
                            fontFamily: "var(--font-outfit)",
                            color: "var(--foreground)",
                          }}
                        >
                          {related.name}
                        </p>
                        <p
                          className="mt-0.5 text-[11px]"
                          style={{
                            color: "var(--muted-foreground)",
                            fontFamily: "var(--font-outfit)",
                          }}
                        >
                          {related.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
              <SectionDivider />
            </>
          )}

          {/* Back to all apps */}
          <div className="py-10 text-center">
            <Link
              href="/#apps"
              className="inline-flex items-center gap-2 text-sm font-medium transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-outfit)",
              }}
            >
              &larr; Back to All Apps
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ── Helper components ── */

function SectionDivider() {
  return (
    <div
      className="h-px w-full"
      style={{
        background:
          "linear-gradient(to right, transparent, var(--border), transparent)",
      }}
      aria-hidden="true"
    />
  );
}

function PlayStoreIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M3.18 23.76c.3.17.66.19.98.05l13.79-7.95-2.87-2.88-11.9 10.78zm-1.4-20.98C1.46 3.14 1.25 3.6 1.25 4.14v15.72c0 .54.21 1 .53 1.36l.07.07 8.81-8.81v-.21L1.85 3.41l-.07.37zm17.22 8.7-3.02-1.74-3.14 3.14 3.14 3.14 3.04-1.76c.87-.5.87-1.32-.02-1.78zM4.16.24l13.79 7.96-2.87 2.87L3.18.28C2.86.14 2.5.17 2.2.34c.9-.52 2-.48 1.96-.1z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
