import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Amazonbot",
  "DuckAssistBot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((bot) => ({ userAgent: bot, allow: "/" })),
    ],
    // Single sitemap index — Google follows it to discover all child sitemaps.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
