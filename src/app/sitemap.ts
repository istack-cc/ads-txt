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
    {
      url: `${BASE_URL}/research/free-app-landscape-2026/`,
      lastModified: new Date("2026-04-19"),
      changeFrequency: "yearly",
      priority: 0.9,
    },
  ];
}
