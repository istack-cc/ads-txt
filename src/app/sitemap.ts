import type { MetadataRoute } from "next";
import { APPS } from "@/data/apps";

export const dynamic = "force-static";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const appEntries: MetadataRoute.Sitemap = APPS.map((app) => ({
    url: `${BASE_URL}/apps/${app.id}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/privacy/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...appEntries,
  ];
}
