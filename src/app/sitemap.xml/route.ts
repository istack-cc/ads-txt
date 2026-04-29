// Sitemap INDEX — links the 6 section sitemaps + a "core" sitemap of misc pages.
// Replaces the flat sitemap.ts that Google was reading as the only entrypoint.

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";
const NOW = new Date().toISOString();

const SECTION_SITEMAPS = [
  "/sitemap-core.xml",
  "/apps/sitemap.xml",
  "/category/sitemap.xml",
  "/best/sitemap.xml",
  "/compare/sitemap.xml",
  "/how-to/sitemap.xml",
  "/glossary/sitemap.xml",
];

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SECTION_SITEMAPS.map(
  (path) => `  <sitemap>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${NOW}</lastmod>
  </sitemap>`,
).join("\n")}
</sitemapindex>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
