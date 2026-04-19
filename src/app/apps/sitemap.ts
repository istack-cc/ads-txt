import type { MetadataRoute } from "next";
import { APPS } from "@/data/apps";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  return APPS.map((app) => ({
    url: `${BASE_URL}/apps/${app.id}/`,
    lastModified: app.playStoreUpdatedOn
      ? new Date(app.playStoreUpdatedOn)
      : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}
