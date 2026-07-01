import { APPS } from "@/data/apps";
import { BEST_OF_ARTICLES } from "@/data/best-of";
import { CATEGORIES_LIST } from "@/data/categories";
import { COMPARISON_ARTICLES } from "@/data/compare";
import { GLOSSARY_TERMS } from "@/data/glossary";
import { HOW_TO_ARTICLES } from "@/data/how-to";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";
const NOW = new Date().toISOString();
const FALLBACK_LASTMOD = "2026-06-09T00:00:00.000Z";

type SitemapUrl = {
  loc: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
};

function toIsoDate(value?: string) {
  const date = new Date(value ?? FALLBACK_LASTMOD);
  return Number.isNaN(date.getTime()) ? FALLBACK_LASTMOD : date.toISOString();
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildUrls(): SitemapUrl[] {
  const coreUrls: SitemapUrl[] = [
    { loc: "/", changefreq: "daily", priority: "1.0", lastmod: NOW },
    {
      loc: "/research/free-app-landscape-2026/",
      changefreq: "yearly",
      priority: "0.9",
      lastmod: "2026-04-19T00:00:00.000Z",
    },
    { loc: "/privacy/", changefreq: "monthly", priority: "0.3", lastmod: NOW },
    { loc: "/terms/", changefreq: "monthly", priority: "0.3", lastmod: NOW },
  ];

  const appUrls: SitemapUrl[] = APPS.map((app) => ({
    loc: `/apps/${app.id}/`,
    lastmod: toIsoDate(app.playStoreUpdatedOn ?? app.release_date),
    changefreq: "weekly",
    priority: "0.8",
  }));

  const pokewert = APPS.find((app) => app.id === "pokewert");
  appUrls.push({
    loc: "/de/apps/pokewert/",
    lastmod: toIsoDate(pokewert?.playStoreUpdatedOn ?? pokewert?.release_date),
    changefreq: "weekly",
    priority: "0.85",
  });

  const categoryUrls: SitemapUrl[] = CATEGORIES_LIST.map((category) => ({
    loc: `/category/${category.slug}/`,
    lastmod: NOW,
    changefreq: "weekly",
    priority: "0.9",
  }));

  const bestUrls: SitemapUrl[] = BEST_OF_ARTICLES.map((article) => ({
    loc: `/best/${article.slug}/`,
    lastmod: toIsoDate(article.last_updated),
    changefreq: "monthly",
    priority: "0.8",
  }));

  const compareUrls: SitemapUrl[] = COMPARISON_ARTICLES.map((article) => ({
    loc: `/compare/${article.slug}/`,
    lastmod: toIsoDate(article.last_updated),
    changefreq: "monthly",
    priority: "0.7",
  }));

  const howToUrls: SitemapUrl[] = HOW_TO_ARTICLES.map((article) => ({
    loc: `/how-to/${article.slug}/`,
    lastmod: toIsoDate(article.last_updated),
    changefreq: "monthly",
    priority: article.app_id === "gimin" || article.app_id === "lgv-theory-test" ? "0.8" : "0.7",
  }));

  const glossaryUrls: SitemapUrl[] = GLOSSARY_TERMS.map((term) => ({
    loc: `/glossary/${term.term}/`,
    lastmod: NOW,
    changefreq: "monthly",
    priority: "0.6",
  }));

  return [
    ...coreUrls,
    ...appUrls,
    ...categoryUrls,
    ...bestUrls,
    ...compareUrls,
    ...howToUrls,
    ...glossaryUrls,
  ];
}

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${buildUrls().map(
  (url) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${url.loc}`)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
