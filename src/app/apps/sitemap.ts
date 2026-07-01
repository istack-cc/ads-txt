import type { MetadataRoute } from "next";
import { APPS } from "@/data/apps";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";
const FALLBACK_LASTMOD = "2026-06-09T00:00:00.000Z";

function appLastModified(app: (typeof APPS)[number]) {
  return new Date(app.playStoreUpdatedOn ?? app.release_date ?? FALLBACK_LASTMOD);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrls = APPS.map((app) => ({
    url: `${BASE_URL}/apps/${app.id}/`,
    lastModified: appLastModified(app),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...appUrls,
    {
      url: `${BASE_URL}/de/apps/pokewert/`,
      lastModified: appLastModified(APPS.find((app) => app.id === "pokewert") ?? APPS[0]),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
  ];
}
