import type { MetadataRoute } from "next";
import { BEST_OF_ARTICLES } from "@/data/best-of";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  return BEST_OF_ARTICLES.map((a) => ({
    url: `${SITE_URL}/best/${a.slug}/`,
    lastModified: new Date(a.last_updated),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
}
