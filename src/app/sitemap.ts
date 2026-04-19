import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";
const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/`,
      lastModified: NOW,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/privacy/`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms/`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
