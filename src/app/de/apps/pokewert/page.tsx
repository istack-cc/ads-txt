import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  IOS_DEVELOPER_URL,
  getAppBySlug,
  type App,
  type AppFaq,
} from "@/data/apps";
import { getStoreUrl } from "@/lib/storeUrl";
import {
  generateBreadcrumbListSchema,
  generateFAQPageSchema,
  generateGraph,
  generateHowToSchema,
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
} from "@/lib/schema";
import { PremiumAppLandingPage } from "@/components/premium-app-landing-page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";
const CANONICAL = "/de/apps/pokewert/";
const ENGLISH_CANONICAL = "/apps/pokewert/";
const OG_IMAGE = "/generated/pokewert-og.jpg";

type DescSection = {
  heading?: string;
  body: string;
};

const germanDescription = `PokeWert ist ein Karten Wert Scanner für iPhone-Nutzer in Deutschland, Österreich, der Schweiz, Luxemburg und Liechtenstein. Die App hilft deutschsprachigen Sammlern, Karten zu scannen, EUR-Werte zu prüfen, Preisverläufe einzuordnen und Sammlungen oder Wunschlisten zu verwalten.

Karten Wert Scanner für Deutschland
Scanne eine Karte und prüfe deutschen Marktwert-Kontext in Euro. Die Seite ist für Suchanfragen wie Karten Wert Scanner, Kartenwert Scanner, Pokemon Karten Wert Scanner, TCG Karten Scanner Deutschland, Sammelkarten Preise und Cardmarket Preise App geschrieben.

EUR-Werte, Verlauf und Sammlung
PokeWert ist auf Euro-Werte, Sammlungswert, Kaufpreisnotizen, Wunschlisten und DACH-Workflows ausgelegt. Sammler müssen nicht zuerst US-Dollar-Werte umrechnen, wenn sie nach deutschen Kartenpreisen suchen.

Für echte Sammler
Die App verbindet Scan-Erkennung, Wertprüfung, Watchlist, Sets und Sammlungsverwaltung in einem iPhone-Workflow. Das passt zu Sammlern, die unterwegs im Laden, auf Börsen oder zu Hause Kartenwerte einschätzen wollen.

Unabhängiges Tool
PokeWert ist ein unabhängiges iStack Tool für Sammler. Es ist nicht mit Nintendo, The Pokemon Company, Pokemon, Cardmarket oder einem Kartenherausgeber verbunden, gesponsert oder offiziell bestätigt.

Verfügbarkeit
Die Portfolio-Seite verlinkt auf die deutsche App Store Storefront. Verfügbarkeit, Premium-Optionen, Kompatibilität und Marktdaten können sich ändern; prüfe aktuelle Details direkt im App Store.`;

const germanFaq: AppFaq[] = [
  {
    question: "Was ist PokeWert?",
    answer:
      "PokeWert ist ein iPhone Karten Wert Scanner für deutschsprachige TCG-Sammler. Die App scannt Karten, zeigt Euro-Wertkontext und hilft beim Verwalten von Sammlung, Wunschliste und Portfolio.",
  },
  {
    question: "Ist PokeWert für Deutschland, Österreich und die Schweiz gedacht?",
    answer:
      "Ja. Die Seite ist für Deutschland, Österreich, die Schweiz, Luxemburg und Liechtenstein optimiert und nutzt Suchbegriffe wie Karten Wert Scanner, Kartenwert Scanner, TCG Karten Scanner und Sammelkarten Preise.",
  },
  {
    question: "Zeigt PokeWert Werte in Euro?",
    answer:
      "Ja. PokeWert ist auf Euro-Werte und deutschsprachige Sammler-Workflows ausgelegt, damit Kartenpreise nicht zuerst aus US-Dollar-Märkten abgeleitet werden müssen.",
  },
  {
    question: "Ist PokeWert mit Pokemon, Nintendo oder Cardmarket verbunden?",
    answer:
      "Nein. PokeWert ist ein unabhängiges Sammler-Tool von iStack und nicht mit Nintendo, The Pokemon Company, Pokemon, Cardmarket oder einem Marktplatz verbunden.",
  },
  {
    question: "Wo kann ich PokeWert laden?",
    answer:
      "Die Portfolio-Seite verlinkt auf die deutsche App Store Storefront. Verfügbarkeit und Premium-Optionen können je nach Land und App-Store-Einstellungen variieren.",
  },
];

const germanHowTo = [
  {
    name: "PokeWert aus dem deutschen App Store laden",
    text:
      "Installiere PokeWert auf dem iPhone und öffne die App, bevor du Karten zu Hause, im Laden oder auf einer Sammlerbörse prüfst.",
  },
  {
    name: "Karte scannen und EUR-Wert prüfen",
    text:
      "Nutze den Scanner, um eine Karte zu erkennen und deutschen Marktwert-Kontext wie Euro-Preis, Trend, niedrige Angebote und Durchschnittswerte einzuordnen.",
  },
  {
    name: "Sammlung und Wunschliste verwalten",
    text:
      "Speichere Karten in deiner Sammlung oder Watchlist, damit du Sammlungswert, fehlende Karten und Veränderungen im Portfolio verfolgen kannst.",
  },
];

function toAbsoluteUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

function parseDescriptionSections(text: string): DescSection[] {
  return text
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const nlIdx = block.indexOf("\n");
      const firstLine = nlIdx === -1 ? block : block.slice(0, nlIdx).trim();
      const rest = nlIdx === -1 ? "" : block.slice(nlIdx + 1).trim();
      if (!rest) return { body: block };
      return { heading: firstLine, body: rest };
    });
}

function getGermanPokeWertApp(): App {
  const app = getAppBySlug("pokewert");
  if (!app) notFound();

  return {
    ...app,
    subtitle: "Karten scannen und EUR-Werte prüfen",
    short_description:
      "PokeWert scannt Karten auf dem iPhone, prüft Euro-Werte und hilft deutschsprachigen Sammlern beim Verwalten von Sammlung, Wunschliste und Portfolio.",
    long_description: germanDescription,
    primary_keyword: "Karten Wert Scanner Deutschland",
    secondary_keywords: [
      "Pokemon Karten Wert Scanner",
      "Kartenwert Scanner iPhone",
      "TCG Karten Scanner Deutschland",
      "Sammelkarten Wert Scanner",
      "Cardmarket Preise App",
      "Pokemon Karten Preise Euro",
      "Karten Scanner Österreich",
      "Karten Scanner Schweiz",
      "TCG Sammlung Tracker",
      "Wunschliste Karten App",
    ],
    features: [
      {
        title: "Kartenwert in Euro prüfen",
        description:
          "Scanne Karten und prüfe deutschen Marktwert-Kontext in Euro, inklusive Trend, Durchschnitt und niedrigen Preis-Signalen.",
      },
      {
        title: "Sammlung und Watchlist verwalten",
        description:
          "Speichere Karten in Sammlung oder Wunschliste und verfolge Sammlungswert, Kaufpreisnotizen und fehlende Karten.",
      },
      {
        title: "Für DACH-Sammler optimiert",
        description:
          "Positioniert für Sammler in Deutschland, Österreich, der Schweiz, Luxemburg und Liechtenstein, die nach Karten Wert Scanner und Sammelkarten Preisen suchen.",
      },
    ],
    faq: germanFaq,
  };
}

export const metadata: Metadata = {
  title: "PokeWert Karten Wert Scanner Deutschland | iStack",
  description:
    "Karten auf dem iPhone scannen, EUR-Werte prüfen und Sammlung oder Wunschliste verwalten. PokeWert für Deutschland, Österreich und die Schweiz.",
  keywords: [
    "Karten Wert Scanner Deutschland",
    "Pokemon Karten Wert Scanner",
    "Kartenwert Scanner",
    "TCG Karten Scanner Deutschland",
    "Sammelkarten Wert Scanner",
    "Pokemon Karten Preise Euro",
    "Cardmarket Preise App",
  ],
  alternates: {
    canonical: CANONICAL,
    languages: {
      "de-DE": CANONICAL,
      "de-AT": CANONICAL,
      "de-CH": CANONICAL,
      "de-LU": CANONICAL,
      "de-LI": CANONICAL,
      "en-US": ENGLISH_CANONICAL,
      "x-default": ENGLISH_CANONICAL,
    },
  },
  openGraph: {
    title: "PokeWert Karten Wert Scanner Deutschland | iStack",
    description:
      "Karten scannen, EUR-Werte prüfen und Sammlungen für deutschsprachige TCG-Sammler verwalten.",
    type: "website",
    url: CANONICAL,
    locale: "de_DE",
    alternateLocale: ["de_AT", "de_CH", "de_LU", "de_LI", "en_US"],
    images: [
      {
        url: toAbsoluteUrl(OG_IMAGE),
        width: 1200,
        height: 675,
        alt: "PokeWert Karten Wert Scanner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PokeWert Karten Wert Scanner Deutschland | iStack",
    description:
      "Karten scannen, EUR-Werte prüfen und Sammlung oder Wunschliste auf dem iPhone verwalten.",
    images: [toAbsoluteUrl(OG_IMAGE)],
  },
  other: {
    "content-language": "de-DE",
    "article:section": "Dienstprogramme",
  },
};

export default function GermanPokeWertPage() {
  const app = getGermanPokeWertApp();
  const heroUrl = getStoreUrl(app, "app-page", "hero");
  const footerUrl = getStoreUrl(app, "app-page", "footer");
  const descSections = parseDescriptionSections(app.long_description);
  const category = {
    name: "Dienstprogramme",
    slug: "utilities",
  };

  const jsonLd = generateGraph([
    generateOrganizationSchema(),
    generateSoftwareApplicationSchema(app),
    generateBreadcrumbListSchema([
      { name: "Startseite", item: SITE_URL },
      { name: "Dienstprogramme", item: `${SITE_URL}/category/utilities/` },
      { name: app.name, item: `${SITE_URL}${CANONICAL}` },
    ]),
    generateFAQPageSchema(germanFaq),
    generateHowToSchema({
      name: "So nutzt du PokeWert",
      description: app.short_description,
      steps: germanHowTo,
    }),
  ]);

  return (
    <PremiumAppLandingPage
      app={app}
      category={category}
      descSections={descSections}
      faqs={germanFaq}
      howToSteps={germanHowTo}
      relatedApps={[]}
      relatedSeoLinks={[]}
      heroUrl={heroUrl}
      footerUrl={footerUrl}
      devUrl={IOS_DEVELOPER_URL}
      jsonLd={jsonLd}
    />
  );
}
