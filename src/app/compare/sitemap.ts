import type { MetadataRoute } from "next";
import { COMPARISON_ARTICLES } from "@/data/compare";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  return COMPARISON_ARTICLES.map((article) => ({
    url: `${BASE_URL}/compare/${article.slug}/`,
    lastModified: new Date(article.last_updated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}
