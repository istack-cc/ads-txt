import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Download,
  ExternalLink,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import {
  APPS,
  DEVELOPER_URL,
  IOS_DEVELOPER_URL,
  getAppBySlug,
  type App,
  type AppFaq,
} from "@/data/apps";
import { CATEGORY_DATA } from "@/data/categories";
import { getStoreUrl } from "@/lib/storeUrl";
import {
  generateGraph,
  generateSoftwareApplicationSchema,
  generateBreadcrumbListSchema,
  generateFAQPageSchema,
  generateOrganizationSchema,
  generateHowToSchema,
} from "@/lib/schema";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DmvPracticeLandingPage } from "@/components/dmv-practice-page";
import { PremiumAppLandingPage } from "@/components/premium-app-landing-page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

function toAbsoluteUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

function getAppLanguageAlternates(app: App, canonical: string) {
  if (app.id !== "pokewert") return undefined;

  const germanCanonical = "/de/apps/pokewert/";

  return {
    "en-US": canonical,
    "de-DE": germanCanonical,
    "de-AT": germanCanonical,
    "de-CH": germanCanonical,
    "de-LU": germanCanonical,
    "de-LI": germanCanonical,
    "x-default": canonical,
  };
}

function getAppOpenGraphLocale(app: App) {
  if (app.id === "pokewert") {
    return {
      locale: "de_DE",
      alternateLocale: ["de_AT", "de_CH", "de_LU", "de_LI", "en_US"],
    };
  }

  return {
    locale: "en_US",
    alternateLocale: undefined,
  };
}

function getAppOpenGraphImage(app: App, alt: string) {
  if (app.id === "pokewert") {
    return {
      url: toAbsoluteUrl("/generated/pokewert-og.jpg"),
      width: 1200,
      height: 675,
      alt,
    };
  }

  return {
    url: toAbsoluteUrl(app.bannerUrl),
    width: 1200,
    height: 675,
    alt,
  };
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function trimToLength(value: string, maxLength: number) {
  const normalized = cleanText(value);
  if (normalized.length <= maxLength) return normalized;

  const truncated = normalized.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${(lastSpace > 40 ? truncated.slice(0, lastSpace) : truncated).trim()}…`;
}

function getPlatformLabel(app: App) {
  if (app.platform === "ios") return "iPhone";
  if (app.platform === "both") return "Android & iPhone";
  return "Android";
}

function buildAppTitle(app: App) {
  if (app.id === "dmv-practice-test") {
    return "US DMV Practice Test 2026 - Examen de Manejo | iStack";
  }

  if (app.id === "ai-tanning") {
    return "UV Index Tanning Timer & SPF Reminder | iStack";
  }

  if (app.id === "time-warp-scan") {
    return "Time Warp Scan App - Warp Scanner & Effect | iStack";
  }

  if (app.id === "gps-photo") {
    return "GPS Photo Stamp App - Location Stamp Camera | iStack";
  }

  if (app.id === "color-picker") {
    return "Color Detector App - Color Code Scanner | iStack";
  }

  if (app.id === "gimin") {
    return "Gimin App - Create Gimin Style Images | iStack";
  }

  if (app.id === "lgv-theory-test") {
    return "LGV Theory Test App UK - HGV DVSA Prep | iStack";
  }

  if (app.id === "hair-cut") {
    return "Hairstyle Try-On & Hair Color Changer | iStack";
  }

  if (app.id === "pokewert") {
    return "PokeWert Karten Wert Scanner Deutschland | iStack";
  }

  const cleanedKeyword = cleanText(
    app.primary_keyword
      .replace(/\bfree\b/gi, "")
      .replace(/\bandroid\b/gi, "")
      .replace(/\bios\b/gi, "")
      .replace(/\biphone\b/gi, "")
  );

  const candidates = [
    `${app.name} – ${app.subtitle} | iStack`,
    `${app.name} – ${cleanedKeyword} | iStack`,
    `${app.name} ${getPlatformLabel(app)} App | iStack`,
    `${app.name} | iStack`,
  ].map(cleanText);

  return candidates.find((candidate) => candidate.length <= 60) ?? candidates[candidates.length - 1];
}

function buildAppDescription(app: App) {
  if (app.id === "dmv-practice-test") {
    return "Prepare for U.S. DMV permit tests, CDL, road signs, and written exams. Spanish-search support for examen de manejo learners in the US and Mexico.";
  }

  if (app.id === "ai-tanning") {
    return "Use live UV index, SPF reminders, sunburn timing, vitamin D estimates, and Mexico beach forecasts to plan safer sun sessions.";
  }

  if (app.id === "time-warp-scan") {
    return "Create scan warp videos, time warp effects, and viral freeze-frame distortions on Android. Free warp scanner camera app from iStack.";
  }

  if (app.id === "gps-photo") {
    return "Add GPS coordinates, address, date, and digital photo location stamps on Android. Free location stamp camera app from iStack.";
  }

  if (app.id === "color-picker") {
    return "Identify colors from camera input and images on Android. Free color detector, color checker, and color code scanner from iStack.";
  }

  if (app.id === "gimin") {
    return "Download Gimin for iPhone and create Gimin-style AI images, face swaps, object removal edits, polaroid looks, cartoons, and headshots.";
  }

  if (app.id === "lgv-theory-test") {
    return "Prepare for the UK LGV and HGV theory test on iPhone with DVSA-style multiple choice, hazard perception, mock tests, and Driver CPC revision.";
  }

  if (app.id === "hair-cut") {
    return "Try hairstyles, hair colors, highlights, ombre, balayage, and haircut ideas on iPhone before a salon visit in the US or Canada.";
  }

  if (app.id === "pokewert") {
    return "Scan trading cards on iPhone, check Cardmarket-style EUR values, and track collections for Germany, Austria, Switzerland, and German speakers.";
  }

  const base = cleanText(app.short_description || app.description);
  const availability =
    app.platform === "ios"
      ? `Free iPhone app on the App Store.`
      : app.platform === "both"
        ? `Free app for Android and iPhone.`
        : `Free Android app on Google Play.`;
  const installs =
    app.playStoreInstalls && !["0+", "1+"].includes(app.playStoreInstalls)
      ? `${app.playStoreInstalls} installs.`
      : "";

  const withName = base.toLowerCase().includes(app.name.toLowerCase())
    ? base
    : `${app.name}: ${base}`;

  return trimToLength(cleanText([withName, availability, installs].filter(Boolean).join(" ")), 155);
}

/* ── Description parser ───────────────────────────────────────────────────── */

interface DescSection {
  heading?: string;
  body: string;
}

function parseDescriptionSections(text: string): DescSection[] {
  if (!text) return [];

  const blocks = text
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const nlIdx = block.indexOf("\n");
    const firstLine = nlIdx === -1 ? block : block.slice(0, nlIdx).trim();
    const rest = nlIdx === -1 ? "" : block.slice(nlIdx + 1).trim();

    if (!rest) return { body: block };

    // Emoji header: first codepoint in emoji ranges
    const firstCP = firstLine.codePointAt(0) ?? 0;
    const hasEmoji =
      (firstCP >= 0x1f300 && firstCP <= 0x1faff) ||
      (firstCP >= 0x2600 && firstCP <= 0x27bf);

    // ALL CAPS header: no lowercase letters, at least 8 chars
    const isAllCaps =
      firstLine.length >= 8 &&
      firstLine === firstLine.toUpperCase() &&
      /[A-Z]{3}/.test(firstLine);

    // Short title: < 70 chars, no trailing period
    const isShortTitle =
      firstLine.length < 70 && !firstLine.endsWith(".") && rest.length > 20;

    if (hasEmoji || isAllCaps || isShortTitle) {
      return { heading: firstLine, body: rest };
    }

    return { body: block };
  });
}

/* ── Generic FAQ fallback ─────────────────────────────────────────────────── */

function getEffectiveFaq(app: App): AppFaq[] {
  if (app.faq.length > 0) return app.faq;

  const isIos = app.platform === "ios";
  const store = isIos ? "the App Store" : "Google Play";
  const platform = isIos ? "iOS" : "Android";

  return [
    {
      question: `Is ${app.name} free?`,
      answer: isIos
        ? `Yes, ${app.name} is free to download on ${store}. The app offers optional premium features through in-app purchase or subscription — you can use the free features without paying.`
        : `Yes, ${app.name} is completely free to download on ${store}. It is ad-supported, so there are no paywalls or subscription fees required.`,
    },
    {
      question: `Does ${app.name} require an account?`,
      answer: `No account is required. Download ${app.name} and start using it immediately — no sign-up, no email, no login needed.`,
    },
    {
      question: `What is ${app.name} used for?`,
      answer: app.short_description,
    },
    {
      question: `Is ${app.name} available on ${platform}?`,
      answer: `Yes, ${app.name} is available for ${platform}${app.platform === "both" ? " and can also be found on the App Store" : ""} and can be downloaded from ${store}.`,
    },
    {
      question: `Does ${app.name} work offline?`,
      answer: `${app.name} is designed to work with minimal or no internet connection for its core features. Some features may require connectivity.`,
    },
  ];
}

/* ── How it works steps ───────────────────────────────────────────────────── */

function getHowToSteps(app: App) {
  const isIos = app.platform === "ios";
  const store = isIos ? "App Store" : "Google Play";

  if (app.id === "dmv-practice-test") {
    return [
      {
        name: "Download DMV Practice Test 2026 for free",
        text: "Install the iPhone app from the App Store and open it before your DMV appointment or written exam study session.",
      },
      {
        name: "Choose your practice focus",
        text: "Review permit test questions, CDL topics, motorcycle permit material, road signs, traffic rules, or all-50-state written exam practice.",
      },
      {
        name: "Practice, review, and confirm official rules",
        text: "Use short mock-test sessions to build recall, then confirm current documents, fees, and requirements with your official state DMV or motor vehicle agency.",
      },
    ];
  }

  if (app.id === "ai-tanning") {
    return [
      {
        name: "Download Tanning UV Index - Sun Tracker for free",
        text: "Install the iPhone app from the App Store before a beach day, pool session, vacation, or outdoor routine.",
      },
      {
        name: "Set your UV and skin inputs",
        text: "Use live UV index, Fitzpatrick skin type, SPF level, and your sun-exposure goal to estimate tanning windows and sunburn risk.",
      },
      {
        name: "Follow timer and SPF reminders as guidance",
        text: "Use the sunburn timer, sunscreen reapplication reminders, vitamin D estimates, and 7-day UV forecast as wellness guidance, not medical advice.",
      },
    ];
  }

  if (app.id === "gimin") {
    return [
      {
        name: "Download Gimin for iPhone",
        text: "Open the Gimin App Store listing from iStack and install the AI photo and face editor on iPhone.",
      },
      {
        name: "Choose a Gimin style image workflow",
        text: "Start with a selfie, portrait, product photo, room image, or creative prompt depending on whether you want a polaroid look, cartoon portrait, headshot, tattoo preview, or cleanup edit.",
      },
      {
        name: "Create, review, and export",
        text: "Use Gimin's AI photo tools for face swap, object removal, image generation, and enhancement, then save or share the finished Gimin-style image.",
      },
    ];
  }

  if (app.id === "pokewert") {
    return [
      {
        name: "Download PokeWert from the German App Store",
        text: "Install PokeWert on iPhone from the German App Store and open it before checking cards at home, at a shop, or at a local collecting event.",
      },
      {
        name: "Scan a card and review EUR value",
        text: "Use the camera scanner to identify a card and review German-market value context such as Cardmarket-style euro pricing, trend, low-price, and recent average signals when available.",
      },
      {
        name: "Track your collection and wishlist",
        text: "Save cards into your collection or wishlist so German-speaking collectors can monitor estimated portfolio value and missing cards in one workflow.",
      },
    ];
  }

  if (app.id === "lgv-theory-test") {
    return [
      {
        name: "Download the UK LGV theory app",
        text: "Open the GB App Store listing from this page and install LGV Theory Test: 4 in 1 Kit UK on iPhone before your next lorry theory revision session.",
      },
      {
        name: "Practise multiple choice and hazard perception",
        text: "Use short sessions for LGV/HGV multiple-choice topics, road signs, safe driving rules, and hazard perception timing before booking or retaking the official test.",
      },
      {
        name: "Confirm official rules before booking",
        text: "Treat the app as revision support, then check GOV.UK or nidirect for current booking rules, fees, documents, eligibility, pass marks, and Driver CPC requirements.",
      },
    ];
  }

  // Derive a verb phrase from short_description's first sentence
  const firstSentence = app.short_description.split(/[.!?]/)[0].trim().toLowerCase();

  return [
    {
      name: `Download ${app.name} for free`,
      text: `Search for "${app.name}" on the ${store} or tap the install button on this page. The app is completely free — no payment info required.`,
    },
    {
      name: "Open and start immediately",
      text: `Launch ${app.name} and ${firstSentence}. No account or lengthy setup required — just open and go.`,
    },
    {
      name: "Save and share your results",
      text: `When you are done, save your work directly to your device or share it with others. ${app.name} keeps your files on-device by default for privacy.`,
    },
  ];
}

function getRelatedSeoLinks(app: App) {
  const linksByApp: Record<
    string,
    Array<{ title: string; href: string; description: string }>
  > = {
    "pdf-scanner": [
      {
        title: "Best free PDF scanner apps for Android",
        href: "/best/best-free-pdf-scanner-apps-android/",
        description: "Compare PDF Scanner with other free document scanner apps.",
      },
      {
        title: "How to scan documents with PDF Scanner",
        href: "/how-to/how-to-scan-documents-with-pdf-scanner/",
        description: "Follow the step-by-step guide for scanning documents to PDF.",
      },
      {
        title: "PDF Scanner vs Adobe Scan",
        href: "/compare/pdf-scanner-vs-adobe-scan/",
        description: "Compare account requirements, offline OCR, privacy, and exports.",
      },
      {
        title: "What is OCR?",
        href: "/glossary/ocr/",
        description: "Learn how scanned images become searchable, copyable text.",
      },
    ],
    "step-counter": [
      {
        title: "Best free step counter apps for Android",
        href: "/best/best-free-step-counter-apps-android/",
        description: "Compare simple pedometer apps for daily step tracking.",
      },
    ],
    "home-workout": [
      {
        title: "Best free home workout apps with no equipment",
        href: "/best/best-free-home-workout-apps-no-equipment/",
        description: "Compare free bodyweight training apps for home workouts.",
      },
    ],
    "time-warp-scan": [
      {
        title: "How to make a time warp camera effect",
        href: "/how-to/how-to-make-a-time-warp-camera-effect/",
        description: "Use the warp scanner workflow to create scan warp videos and freeze-frame effects.",
      },
    ],
    "color-picker": [
      {
        title: "How to identify colors from your camera",
        href: "/how-to/how-to-identify-colors-from-camera/",
        description: "Use Color Picker as a color detector, color checker, and color code scanner.",
      },
    ],
    "gps-photo": [
      {
        title: "How to add a digital photo location stamp",
        href: "/how-to/how-to-add-location-stamps-to-digital-photos/",
        description: "Add GPS coordinates, address, date, and time directly onto Android photos.",
      },
    ],
    "gimin": [
      {
        title: "How to create a Gimin style image",
        href: "/how-to/how-to-create-a-gimin-style-image/",
        description: "Follow the step-by-step iPhone guide for Gimin style images, AI photo edits, and image style workflows.",
      },
    ],
    "lgv-theory-test": [
      {
        title: "How to prepare for the LGV theory test in the UK",
        href: "/how-to/how-to-prepare-for-the-lgv-theory-test-uk/",
        description: "Use the web-to-app revision path for LGV multiple choice, hazard perception, and Driver CPC study.",
      },
    ],
  };

  return linksByApp[app.id] ?? [];
}

/* ── Page props ───────────────────────────────────────────────────────────── */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return APPS.map((app) => ({ slug: app.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug)!;

  if (!app) {
    return {
      title: "App Not Found | iStack",
      description: "The requested app page could not be found.",
    };
  }

  const category = CATEGORY_DATA[app.seoCategory];
  const titleH1 = `${app.name} — ${app.subtitle}`;
  const pageTitle = buildAppTitle(app);
  const pageDescription = buildAppDescription(app);
  const canonical = `/apps/${app.id}/`;
  const openGraphLocale = getAppOpenGraphLocale(app);
  const openGraphImage = getAppOpenGraphImage(app, titleH1);

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      app.name,
      app.subtitle,
      app.primary_keyword,
      ...app.secondary_keywords,
    ],
    alternates: {
      canonical,
      languages: getAppLanguageAlternates(app, canonical),
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "website",
      url: canonical,
      locale: openGraphLocale.locale,
      alternateLocale: openGraphLocale.alternateLocale,
      images: [openGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [openGraphImage.url],
    },
    other: {
      "article:section": category.name,
    },
  };
}

export default async function AppLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const app = getAppBySlug(slug)!;
  if (!app) notFound();

  const heroUrl = getStoreUrl(app, "app-page", "hero");
  const footerUrl = getStoreUrl(app, "app-page", "footer");
  const isIos = app.platform === "ios";
  const devUrl = isIos ? IOS_DEVELOPER_URL : DEVELOPER_URL;
  const category = CATEGORY_DATA[app.seoCategory];

  const descSections = parseDescriptionSections(app.long_description);

  const faqs = getEffectiveFaq(app);
  const howToSteps = getHowToSteps(app);
  const relatedSeoLinks = getRelatedSeoLinks(app);
  const screenshots = app.screenshots ?? [];

  const relatedApps = APPS.filter(
    (a) => a.seoCategory === app.seoCategory && a.id !== app.id
  ).slice(0, 6);

  // JSON-LD @graph
  const breadcrumbTrail = [
    { name: "Home", item: SITE_URL },
    { name: category.name, item: `${SITE_URL}/category/${category.slug}/` },
    { name: app.name, item: `${SITE_URL}/apps/${app.id}/` },
  ];

  const jsonLd = generateGraph([
    generateOrganizationSchema(),
    generateSoftwareApplicationSchema(app),
    generateBreadcrumbListSchema(breadcrumbTrail),
    generateFAQPageSchema(faqs),
    generateHowToSchema({
      name: `How to use ${app.name}`,
      description: app.short_description,
      steps: howToSteps,
    }),
  ]);

  if (app.id === "dmv-practice-test") {
    return (
      <DmvPracticeLandingPage
        app={app}
        category={category}
        descSections={descSections}
        faqs={faqs}
        howToSteps={howToSteps}
        relatedApps={relatedApps}
        heroUrl={heroUrl}
        footerUrl={footerUrl}
        devUrl={devUrl}
        jsonLd={jsonLd}
      />
    );
  }

  return (
    <PremiumAppLandingPage
      app={app}
      category={category}
      descSections={descSections}
      faqs={faqs}
      howToSteps={howToSteps}
      relatedApps={relatedApps}
      relatedSeoLinks={relatedSeoLinks}
      heroUrl={heroUrl}
      footerUrl={footerUrl}
      devUrl={devUrl}
      jsonLd={jsonLd}
    />
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grain-overlay" aria-hidden="true" />
      <Nav appsHref="/#apps" />

      <main className="pt-16">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="border-b" style={{ borderColor: "var(--border)" }}>
          <article className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-8 lg:py-12">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
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
                    className="hover:underline underline-offset-2"
                    style={{ color: "var(--accent)" }}
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <Link
                    href={`/category/${category.slug}/`}
                    className="hover:underline underline-offset-2"
                    style={{ color: "var(--accent)" }}
                  >
                    {category.name}
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li aria-current="page">{app.name}</li>
              </ol>
            </nav>

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
              {/* Left: Feature banner */}
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
                    alt={`${app.name} — ${app.primary_keyword}`}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
              </div>

              {/* Right: App info panel */}
              <div className="flex flex-col lg:flex-[2] lg:min-w-0">
                {/* Icon + H1 */}
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 overflow-hidden rounded-[20px] border shadow-lg"
                    style={{ borderColor: "var(--border-hover)" }}
                  >
                    <Image
                      src={app.iconUrl}
                      alt={`${app.name} app icon`}
                      width={84}
                      height={84}
                      className="h-[84px] w-[84px] object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1
                      className="text-2xl font-semibold leading-tight lg:text-3xl"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--foreground)",
                        fontVariationSettings: '"opsz" 48',
                        textWrap: "balance",
                      }}
                    >
                      {app.name}
                      {app.subtitle && (
                        <span
                          className="block text-xl italic font-normal lg:text-2xl"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {app.subtitle}
                        </span>
                      )}
                    </h1>
                    <a
                      href={devUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm font-medium transition-opacity hover:opacity-80"
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

                {/* TL;DR */}
                <p
                  className="mt-5 text-sm leading-relaxed"
                  style={{
                    color: "var(--muted-foreground)",
                    fontFamily: "var(--font-outfit)",
                  }}
                >
                  {app.short_description || app.description}
                </p>

                {/* Stats row */}
                <div
                  className="mt-5 flex items-center gap-2 border-y py-4"
                  style={{
                    borderColor: "var(--border)",
                    fontFamily: "var(--font-outfit)",
                  }}
                >
                  {app.rating && (
                    <>
                      <div className="flex flex-col items-center gap-0.5 flex-1">
                        <div className="flex items-center gap-1">
                          <Star
                            className="h-4 w-4 fill-current"
                            style={{ color: "var(--accent)" }}
                            aria-hidden="true"
                          />
                          <span
                            className="text-base font-bold"
                            style={{ color: "var(--foreground)" }}
                          >
                            {app.rating!.toFixed(1)}
                          </span>
                        </div>
                        <span
                          className="text-[11px]"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          Rating
                        </span>
                      </div>
                      <div
                        className="h-8 w-px"
                        style={{ background: "var(--border)" }}
                        aria-hidden="true"
                      />
                    </>
                  )}
                  {app.playStoreInstalls && (
                    <>
                      <div className="flex flex-col items-center gap-0.5 flex-1">
                        <span
                          className="text-base font-bold"
                          style={{ color: "var(--foreground)" }}
                        >
                          {app.playStoreInstalls}
                        </span>
                        <span
                          className="text-[11px]"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          Downloads
                        </span>
                      </div>
                      <div
                        className="h-8 w-px"
                        style={{ background: "var(--border)" }}
                        aria-hidden="true"
                      />
                    </>
                  )}
                  <div className="flex flex-col items-center gap-0.5 flex-1">
                    <span
                      className="text-base font-bold"
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
                  {app.playStoreContentRating && (
                    <>
                      <div
                        className="h-8 w-px"
                        style={{ background: "var(--border)" }}
                        aria-hidden="true"
                      />
                      <div className="flex flex-col items-center gap-0.5 flex-1">
                        <span
                          className="text-base font-bold"
                          style={{ color: "var(--foreground)" }}
                        >
                          {app.playStoreContentRating}
                        </span>
                        <span
                          className="text-[11px]"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          Rated
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Primary CTA */}
                <a
                  href={heroUrl}
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
                  <ExternalLink
                    className="h-3.5 w-3.5 opacity-60"
                    aria-hidden="true"
                  />
                </a>

                {/* Trust pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { label: "Free to download", icon: Download },
                    { label: "No account", icon: BadgeCheck },
                    { label: isIos ? "iPhone & iPad" : "Android", icon: ShieldCheck },
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

        {/* ── Content below fold ───────────────────────────────────────── */}
        <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">

          {/* About This App */}
          <section className="py-10 lg:py-12" aria-labelledby="about-heading">
            <h2
              id="about-heading"
              className="mb-6 text-xl font-semibold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                fontVariationSettings: '"opsz" 36',
              }}
            >
              About {app.name}
            </h2>

            {descSections.length > 0 ? (
              <div className="max-w-3xl space-y-6">
                {descSections.map((section, i) => (
                  <div key={i}>
                    {section.heading && (
                      <h3
                        className="mb-2 text-base font-semibold"
                        style={{
                          color: "var(--foreground)",
                          fontFamily: "var(--font-outfit)",
                        }}
                      >
                        {section.heading}
                      </h3>
                    )}
                    <p
                      className="whitespace-pre-line text-sm leading-relaxed"
                      style={{
                        color: "var(--muted-foreground)",
                        fontFamily: "var(--font-outfit)",
                      }}
                    >
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className="max-w-3xl text-sm leading-relaxed"
                style={{
                  color: "var(--muted-foreground)",
                  fontFamily: "var(--font-outfit)",
                }}
              >
                {app.description}
              </p>
            )}
          </section>

          <SectionDivider />

          {/* Screenshot Gallery */}
          {screenshots.length > 0 && (
            <>
              <section
                className="py-10 lg:py-12"
                aria-labelledby="screenshots-heading"
              >
                <h2
                  id="screenshots-heading"
                  className="mb-6 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--foreground)",
                    fontVariationSettings: '"opsz" 36',
                  }}
                >
                  Screenshots
                </h2>
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4">
                  {screenshots.map((src, i) => (
                    <div
                      key={src}
                      className="shrink-0 snap-start overflow-hidden rounded-xl border"
                      style={{ borderColor: "var(--border)", width: "180px" }}
                    >
                      <Image
                        src={src}
                        alt={`${app.name} screenshot ${i + 1} — ${
                          app.secondary_keywords[i % app.secondary_keywords.length] ??
                          app.primary_keyword
                        }`}
                        width={180}
                        height={360}
                        className="h-auto w-full object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </section>
              <SectionDivider />
            </>
          )}

          {/* How It Works */}
          <section
            className="py-10 lg:py-12"
            aria-labelledby="howto-heading"
          >
            <h2
              id="howto-heading"
              className="mb-6 text-xl font-semibold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                fontVariationSettings: '"opsz" 36',
              }}
            >
              How it works
            </h2>
            <ol className="max-w-3xl space-y-6">
              {howToSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
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
                  <div>
                    <p
                      className="mb-1 text-sm font-semibold"
                      style={{
                        color: "var(--foreground)",
                        fontFamily: "var(--font-outfit)",
                      }}
                    >
                      {step.name}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "var(--muted-foreground)",
                        fontFamily: "var(--font-outfit)",
                      }}
                    >
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {relatedSeoLinks.length > 0 && (
            <>
              <SectionDivider />
              <section
                className="py-10 lg:py-12"
                aria-labelledby="related-guides-heading"
              >
                <h2
                  id="related-guides-heading"
                  className="mb-6 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--foreground)",
                    fontVariationSettings: '"opsz" 36',
                  }}
                >
                  Related guides
                </h2>
                <div className="grid max-w-4xl gap-4 sm:grid-cols-2">
                  {relatedSeoLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-xl border p-4 transition-colors hover:bg-[--surface]"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                    >
                      <p
                        className="mb-1.5 text-sm font-semibold"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {link.title}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: "var(--muted-foreground)",
                          fontFamily: "var(--font-outfit)",
                        }}
                      >
                        {link.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}

          <SectionDivider />

          {/* Feature Grid (only when data is populated) */}
          {app.features.length > 0 && (
            <>
              <section
                className="py-10 lg:py-12"
                aria-labelledby="features-heading"
              >
                <h2
                  id="features-heading"
                  className="mb-6 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--foreground)",
                    fontVariationSettings: '"opsz" 36',
                  }}
                >
                  Features
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {app.features.map((feature) => (
                    <div
                      key={feature.title}
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
                        {feature.title}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: "var(--foreground)",
                          fontFamily: "var(--font-outfit)",
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
              <SectionDivider />
            </>
          )}

          {/* Why iStack */}
          <section
            className="py-10 lg:py-12"
            aria-labelledby="why-heading"
          >
            <h2
              id="why-heading"
              className="mb-6 text-xl font-semibold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                fontVariationSettings: '"opsz" 36',
              }}
            >
              Why iStack apps?
            </h2>
            <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Download,
                  title: "Free to download",
                  text: "Every iStack app is free to install. Android apps are ad-supported with no IAP; iOS apps may offer optional premium features.",
                },
                {
                  icon: BadgeCheck,
                  title: "No account needed",
                  text: "Open and use immediately. We do not require sign-up or email to access core features.",
                },
                {
                  icon: Zap,
                  title: "Focused & fast",
                  text: "One app, one job. No bloat or feature overload — just what you need, working reliably.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  <Icon
                    className="mb-3 h-5 w-5"
                    style={{ color: "var(--accent)" }}
                    aria-hidden="true"
                  />
                  <p
                    className="mb-1.5 text-sm font-semibold"
                    style={{
                      color: "var(--foreground)",
                      fontFamily: "var(--font-outfit)",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-outfit)",
                    }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <SectionDivider />

          {/* FAQ */}
          <section
            className="py-10 lg:py-12"
            aria-labelledby="faq-heading"
          >
            <h2
              id="faq-heading"
              className="mb-6 text-xl font-semibold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                fontVariationSettings: '"opsz" 36',
              }}
            >
              Frequently asked questions
            </h2>
            <dl className="max-w-3xl space-y-3">
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

          {/* Related Apps */}
          {relatedApps.length > 0 && (
            <>
              <SectionDivider />
              <section
                className="py-10 lg:py-12"
                aria-labelledby="related-heading"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2
                    id="related-heading"
                    className="text-xl font-semibold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--foreground)",
                      fontVariationSettings: '"opsz" 36',
                    }}
                  >
                    More {category.name} apps
                  </h2>
                  <Link
                    href={`/category/${category.slug}/`}
                    className="text-xs font-medium transition-opacity hover:opacity-80"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-outfit)",
                    }}
                  >
                    See all →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {relatedApps.map((related) => (
                    <Link
                      key={related.id}
                      href={`/apps/${related.id}/`}
                      className="group flex flex-col items-center gap-3 rounded-xl p-3 transition-colors hover:bg-[--surface]"
                      style={{ touchAction: "manipulation" }}
                    >
                      <div
                        className="overflow-hidden rounded-[18px] border shadow-md transition-transform group-hover:scale-105"
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
                      <p
                        className="w-full text-center text-xs font-medium leading-tight line-clamp-2"
                        style={{
                          fontFamily: "var(--font-outfit)",
                          color: "var(--foreground)",
                        }}
                      >
                        {related.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}

          <SectionDivider />

          {/* Footer CTA */}
          <section className="py-12 text-center">
            <p
              className="mb-2 text-2xl font-semibold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                fontVariationSettings: '"opsz" 36',
              }}
            >
              Ready to try {app.name}?
            </p>
            <p
              className="mb-6 text-sm"
              style={{
                color: "var(--muted-foreground)",
                fontFamily: "var(--font-outfit)",
              }}
            >
              Free on {isIos ? "the App Store" : "Google Play"} — no account
              required.
            </p>
            <a
              href={footerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-xl px-8 text-sm font-semibold transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: "var(--accent)",
                color: "var(--primary-foreground)",
                fontFamily: "var(--font-outfit)",
                touchAction: "manipulation",
              }}
              aria-label={`Download ${app.name} on ${isIos ? "the App Store" : "Google Play"}`}
            >
              {isIos ? <AppleIcon /> : <PlayStoreIcon />}
              {isIos ? "Get on the App Store" : "Download on Google Play"}
              <ExternalLink
                className="h-3.5 w-3.5 opacity-60"
                aria-hidden="true"
              />
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ── Helper components ────────────────────────────────────────────────────── */

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
