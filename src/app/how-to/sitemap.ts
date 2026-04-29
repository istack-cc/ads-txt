import type { MetadataRoute } from "next";
import { HOW_TO_ARTICLES } from "@/data/how-to";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  return HOW_TO_ARTICLES.map((article) => ({
    url: `${BASE_URL}/how-to/${article.slug}/`,
    lastModified: new Date(article.last_updated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}
