import type { MetadataRoute } from "next";
import { CATEGORIES_LIST } from "@/data/categories";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  return CATEGORIES_LIST.map((category) => ({
    url: `${BASE_URL}/category/${category.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
}
