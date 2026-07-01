import type { App } from "@/data/apps";
import type { CategoryData } from "@/data/categories";
import { ORGANIZATION } from "@/data/organization";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";
const ORG_ID = `${SITE_URL}/#organization`;

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
    contactPoint: {
      "@type": "ContactPoint",
      email: ORGANIZATION.contact_email,
      contactType: "customer support",
      availableLanguage: ["English"],
    },
    knowsAbout: [
      "free Android apps",
      "iPhone apps",
      "mobile productivity apps",
      "AI photo editing apps",
      "phone utility apps",
      "health and fitness apps",
      "app store optimization",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ORGANIZATION.aggregate_stats.avg_rating,
      reviewCount: ORGANIZATION.aggregate_stats.total_installs,
      bestRating: 5,
    },
  };
}

export function generateWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORGANIZATION.name,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateHomePageSchema() {
  return {
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/#homepage`,
    url: SITE_URL,
    name: "iStack Free Android and iPhone Apps",
    description:
      "iStack is an independent mobile app publisher with free Android and iPhone apps for photos, documents, utilities, fitness, education, personalization, and voice workflows.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORG_ID },
    about: [
      "free mobile apps",
      "Android utility apps",
      "iPhone apps",
      "AI photo apps",
      "productivity apps",
    ],
  };
}

function schemaCategory(app: App): string {
  switch (app.category) {
    case "Health": return "HealthApplication";
    case "Photography": return "MultimediaApplication";
    case "Productivity": return "BusinessApplication";
    case "Personalization": return "PersonalizationApplication";
    case "Education": return "EducationalApplication";
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
    ? `https://apps.apple.com/${app.appStoreCountry ?? "us"}/app/${app.appStoreSlug ?? app.id}/id${app.appStoreId}`
    : undefined;
  const downloadUrl = [playUrl, iosUrl].filter((url): url is string => Boolean(url));

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
      priceCurrency: app.id === "pokewert" ? "EUR" : app.id === "lgv-theory-test" ? "GBP" : "USD",
    },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };

  if (app.playStoreUpdatedOn) schema.dateModified = app.playStoreUpdatedOn;
  if (app.playStoreContentRating) schema.contentRating = app.playStoreContentRating;
  if (app.id === "ai-tanning") {
    schema.applicationSubCategory = "Weather";
    schema.contentRating = "9+";
    schema.softwareRequirements = "Requires iOS 18.0 or later";
    schema.softwareVersion = "1.0.1";
    schema.keywords = [
      app.primary_keyword,
      ...app.secondary_keywords,
      "Fitzpatrick skin type",
      "UV index tanning timer",
      "UV index forecast",
      "SPF reminder beach app",
      "sunscreen reapplication reminder",
      "Mexico beach UV planning",
      "indice UV Mexico",
      "protector solar reminder",
    ].join(", ");
    schema.featureList = [
      "Live UV index planning",
      "Fitzpatrick skin type inputs",
      "SPF reapplication reminders",
      "Sunburn risk timer",
      "Vitamin D exposure estimates",
      "7-day UV forecast",
      "Session history",
      "U.S. and Mexico UV planning",
    ];
  }

  if (app.id === "hair-cut") {
    schema.applicationSubCategory = "AI Hairstyle Editor";
    schema.contentRating = "4+";
    schema.softwareRequirements = "Requires iOS 16.6 or later";
    schema.softwareVersion = "1.1.1";
    schema.keywords = [
      app.primary_keyword,
      ...app.secondary_keywords,
      "US hairstyle try-on",
      "Canada hair color changer",
      "salon preview app",
    ].join(", ");
    schema.featureList = [
      "AI hairstyle try-on",
      "Hair color changer",
      "Highlights and ombre preview",
      "Balayage color preview",
      "U.S. and Canada salon decision support",
    ];
  }

  if (app.id === "time-warp-scan") {
    schema.applicationSubCategory = "Photo and Video";
    schema.keywords = [
      app.primary_keyword,
      ...app.secondary_keywords,
      "warp scanner app",
      "scan warp video",
      "time warp effect camera",
    ].join(", ");
    schema.featureList = [
      "Warp scanner camera",
      "Scan warp photo and video effects",
      "Time warp effect capture",
      "Freeze-frame distortion camera",
      "Fast save and share workflow",
    ];
  }

  if (app.id === "gps-photo") {
    schema.applicationSubCategory = "Photography Utility";
    schema.keywords = [
      app.primary_keyword,
      ...app.secondary_keywords,
      "digital photos location stamp",
      "GPS stamp camera",
      "latitude longitude photo stamp",
    ].join(", ");
    schema.featureList = [
      "Digital photo location stamp",
      "GPS coordinates on photos",
      "Address, date, and time stamp",
      "Geotag photo workflow",
      "Free Android location camera",
    ];
  }

  if (app.id === "color-picker") {
    schema.applicationSubCategory = "Color Utility";
    schema.keywords = [
      app.primary_keyword,
      ...app.secondary_keywords,
      "colour detector",
      "color code scanner app",
      "camera color checker",
    ].join(", ");
    schema.featureList = [
      "Camera color detector",
      "Color code scanner",
      "Color checker for Android",
      "Identify colors from camera input",
      "Capture color values from images",
    ];
  }

  if (app.id === "gimin") {
    schema.applicationSubCategory = "AI Photo Editor";
    schema.contentRating = "4+";
    schema.softwareRequirements = "Requires iOS";
    schema.softwareVersion = "2.2.1";
    schema.keywords = [
      app.primary_keyword,
      ...app.secondary_keywords,
      "Gimin app",
      "download Gimin iPhone",
      "Gimin style AI image",
      "Gimin image style",
      "Gimin style image creator",
      "Gimin style photo edit",
      "Gimin photo style",
      "AI polaroid image generator",
      "iPhone AI photo editor",
      "face swap photo editor",
      "object removal photo editor",
    ].join(", ");
    schema.featureList = [
      "Gimin iPhone app download",
      "AI photo and face editing",
      "Face swap",
      "Object removal",
      "AI image generation",
      "Polaroid-style image creation",
      "Cartoon filter portraits",
      "Professional headshot generation",
      "Tattoo try-on previews",
      "Interior design visualization",
      "One-tap photo enhancement",
    ];
  }

  if (app.id === "dmv-practice-test") {
    schema.applicationSubCategory = "Driver Education";
    schema.contentRating = "4+";
    schema.softwareRequirements = "Requires iOS 15.0 or later";
    schema.softwareVersion = "1.0";
    schema.keywords = [
      app.primary_keyword,
      ...app.secondary_keywords,
      "permit test",
      "written driving exam",
      "road signs",
      "CDL practice",
      "motorcycle permit",
      "Class C driver license",
      "examen de manejo",
      "prueba de manejo",
      "licencia de conducir Estados Unidos",
      "preguntas para licencia de conducir USA",
    ].join(", ");
    schema.featureList = [
      "DMV permit test practice",
      "All 50 U.S. states study coverage",
      "CDL topic review",
      "Motorcycle permit practice",
      "Class C written exam prep",
      "Road signs and traffic rules",
      "Independent, non-government study app",
      "Spanish-search support for U.S. DMV learners",
    ];
  }

  if (app.id === "lgv-theory-test") {
    schema.applicationSubCategory = "Driver Education";
    schema.contentRating = "4+";
    schema.softwareRequirements = "Requires iOS";
    schema.keywords = [
      app.primary_keyword,
      ...app.secondary_keywords,
      "LGV theory test UK",
      "HGV theory test UK",
      "DVSA lorry theory test",
      "Driver CPC part 1",
      "LGV hazard perception",
      "lorry multiple choice questions",
      "UK lorry driver revision",
    ].join(", ");
    schema.featureList = [
      "UK LGV theory test revision",
      "HGV theory test practice",
      "DVSA-style multiple choice study",
      "LGV hazard perception practice",
      "Driver CPC revision support",
      "GB App Store install path",
      "Independent, non-government study app",
    ];
  }

  if (app.id === "pokewert") {
    schema.applicationSubCategory = "Trading Card Utility";
    schema.contentRating = "4+";
    schema.softwareRequirements = "Requires iOS";
    schema.keywords = [
      app.primary_keyword,
      ...app.secondary_keywords,
      "Kartenwert Scanner",
      "Pokemon Karten Preise Euro",
      "DACH TCG collector app",
    ].join(", ");
    schema.featureList = [
      "Karten Wert Scanner",
      "Cardmarket-style EUR price context",
      "Trading card collection tracker",
      "Wishlist tracking",
      "Germany, Austria, and Switzerland collector workflow",
      "Independent TCG utility",
    ];
  }
  if (app.rating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: app.rating,
      bestRating: 5,
    };
  }

  if (!schema.keywords) {
    schema.keywords = [app.primary_keyword, ...app.secondary_keywords].join(", ");
  }

  if (!schema.featureList && app.features.length > 0) {
    schema.featureList = app.features.map((feature) => feature.title);
  }

  Object.assign(schema, {
    downloadUrl: downloadUrl.length === 1 ? downloadUrl[0] : downloadUrl,
    sameAs: downloadUrl,
    inLanguage: app.id === "pokewert" ? ["de-DE", "en-US"] : app.id === "lgv-theory-test" ? "en-GB" : "en-US",
    audience: {
      "@type": "Audience",
      audienceType: app.id === "dmv-practice-test"
        ? "U.S. learner drivers, CDL learners, permit test learners, and Spanish-speaking U.S. driver exam learners in the United States and Mexico"
        : app.id === "lgv-theory-test"
          ? "United Kingdom learner lorry drivers preparing for LGV, HGV, DVSA theory, hazard perception, and Driver CPC revision"
        : app.id === "ai-tanning"
          ? "U.S. and Mexico beachgoers, vacation travelers, summer skincare users, and Spanish-speaking UV safety learners"
          : app.id === "hair-cut"
            ? "United States and Canada iPhone users comparing hairstyles, hair colors, highlights, ombre, balayage, and salon looks"
            : app.id === "pokewert"
              ? "German-speaking trading card collectors in Germany, Austria, Switzerland, Luxembourg, and Liechtenstein"
              : `${app.category} app users`,
      geographicArea: app.id === "dmv-practice-test" || app.id === "ai-tanning"
        ? [
            { "@type": "Country", name: "United States" },
            { "@type": "Country", name: "Mexico" },
          ]
        : app.id === "lgv-theory-test"
          ? [
              { "@type": "Country", name: "United Kingdom" },
            ]
        : app.id === "hair-cut"
          ? [
              { "@type": "Country", name: "United States" },
              { "@type": "Country", name: "Canada" },
            ]
          : app.id === "pokewert"
            ? [
                { "@type": "Country", name: "Germany" },
                { "@type": "Country", name: "Austria" },
                { "@type": "Country", name: "Switzerland" },
                { "@type": "Country", name: "Luxembourg" },
                { "@type": "Country", name: "Liechtenstein" },
              ]
            : undefined,
    },
  });

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
