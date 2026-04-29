import type { MetadataRoute } from "next";
import { GLOSSARY_TERMS } from "@/data/glossary";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  return GLOSSARY_TERMS.map((term) => ({
    url: `${BASE_URL}/glossary/${term.term}/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
