// Core URLs that don't fit the section sitemaps (home, privacy, terms, research).
// Linked from /sitemap.xml.

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";
const NOW = new Date().toISOString();

const URLS = [
  { loc: "/", changefreq: "daily", priority: "1.0", lastmod: NOW },
  { loc: "/research/free-app-landscape-2026/", changefreq: "yearly", priority: "0.9", lastmod: "2026-04-19T00:00:00.000Z" },
  { loc: "/privacy/", changefreq: "monthly", priority: "0.3", lastmod: NOW },
  { loc: "/terms/", changefreq: "monthly", priority: "0.3", lastmod: NOW },
];

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${URLS.map(
  (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
