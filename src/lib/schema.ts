import type { App } from "@/data/apps";
import type { CategoryData } from "@/data/categories";
import { ORGANIZATION } from "@/data/organization";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";
const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#founder`;

// ─── Core entity schemas ─────────────────────────────────────────────────────

export function generateOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORGANIZATION.name,
    url: ORGANIZATION.url,
    logo: {
      "@type": "ImageObject",
      url: ORGANIZATION.logo,
    },
    sameAs: ORGANIZATION.sameAs,
    founder: { "@id": PERSON_ID },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ORGANIZATION.aggregate_stats.avg_rating,
      reviewCount: ORGANIZATION.aggregate_stats.total_installs,
      bestRating: 5,
    },
  };
}

export function generateFounderSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: ORGANIZATION.founder.name,
    url: ORGANIZATION.founder.url,
    worksFor: { "@id": ORG_ID },
  };
}

export function generateWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORGANIZATION.name,
    publisher: { "@id": ORG_ID },
  };
}

function schemaCategory(app: App): string {
  switch (app.category) {
    case "Health": return "HealthApplication";
    case "Photography": return "MultimediaApplication";
    case "Productivity": return "BusinessApplication";
    case "Personalization": return "PersonalizationApplication";
    default: return "UtilitiesApplication";
  }
}

export function generateSoftwareApplicationSchema(app: App) {
  const isIos = app.platform === "ios";
  const appUrl = `${SITE_URL}/apps/${app.id}/`;
  const playUrl = app.platform !== "ios"
    ? `https://play.google.com/store/apps/details?id=${app.packageId}`
    : undefined;
  const iosUrl = app.appStoreId
    ? `https://apps.apple.com/us/app/${app.id}/id${app.appStoreId}`
    : undefined;

  const schema: Record<string, unknown> = {
    "@type": "SoftwareApplication",
    "@id": `${appUrl}#app`,
    name: app.name,
    description: app.short_description,
    operatingSystem: app.platform === "both" ? "Android, iOS" : isIos ? "iOS" : "Android",
    applicationCategory: schemaCategory(app),
    applicationSubCategory: app.playStoreCategory ?? app.category,
    url: appUrl,
    mainEntityOfPage: appUrl,
    image: [app.iconUrl, app.bannerUrl].map((u) =>
      u.startsWith("http") ? u : `${SITE_URL}${u}`
    ),
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };

  if (app.playStoreUpdatedOn) schema.dateModified = app.playStoreUpdatedOn;
  if (app.playStoreContentRating) schema.contentRating = app.playStoreContentRating;
  if (app.rating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: app.rating,
      bestRating: 5,
    };
  }

  const downloadUrl = [playUrl, iosUrl].filter(Boolean);
  if (downloadUrl.length) schema.downloadUrl = downloadUrl.length === 1 ? downloadUrl[0] : downloadUrl;

  return schema;
}

export function generateCollectionPageSchema(
  category: CategoryData,
  apps: App[]
) {
  const url = `${SITE_URL}/category/${category.slug}/`;
  return {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: `${category.name} Apps — iStack`,
    description: category.description || `Free ${category.name.toLowerCase()} apps for Android and iOS.`,
    url,
    publisher: { "@id": ORG_ID },
    hasPart: apps.map((app) => ({
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/apps/${app.id}/#app`,
      name: app.name,
    })),
  };
}

export function generateHowToSchema(howto: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
}) {
  return {
    "@type": "HowTo",
    name: howto.name,
    description: howto.description,
    totalTime: howto.totalTime,
    step: howto.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.image ? { image: s.image } : {}),
    })),
    publisher: { "@id": ORG_ID },
  };
}

export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbListSchema(
  trail: Array<{ name: string; item?: string }>
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.item ? { item: crumb.item } : {}),
    })),
  };
}

export function generateItemListSchema(apps: App[], listName = "iStack Apps") {
  return {
    "@type": "ItemList",
    name: listName,
    itemListElement: apps.map((app, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/apps/${app.id}/#app`,
        name: app.name,
        url: `${SITE_URL}/apps/${app.id}/`,
      },
    })),
  };
}

// ─── @graph wrapper ──────────────────────────────────────────────────────────

export function generateGraph(entities: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": entities,
  };
}
