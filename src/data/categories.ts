import type { SeoCategory } from "./apps";

export interface CategoryData {
  id: SeoCategory;
  name: string;
  slug: string;
  hub_keyword: string;
  description: string;
  icon?: string;
}

export const CATEGORY_DATA: Record<SeoCategory, CategoryData> = {
  productivity: {
    id: "productivity",
    name: "Productivity",
    slug: "productivity",
    hub_keyword: "free productivity apps",
    description: "",
  },
  "ai-photo": {
    id: "ai-photo",
    name: "AI & Photo",
    slug: "ai-photo",
    hub_keyword: "best free ai photo apps",
    description: "",
  },
  utilities: {
    id: "utilities",
    name: "Utilities",
    slug: "utilities",
    hub_keyword: "best free phone utilities",
    description: "",
  },
  health: {
    id: "health",
    name: "Health & Fitness",
    slug: "health",
    hub_keyword: "free health apps no subscription",
    description: "",
  },
  education: {
    id: "education",
    name: "Education",
    slug: "education",
    hub_keyword: "free ai learning apps",
    description: "",
  },
  personalization: {
    id: "personalization",
    name: "Personalization",
    slug: "personalization",
    hub_keyword: "free wallpaper and clock apps",
    description: "",
  },
  voice: {
    id: "voice",
    name: "Voice & Commands",
    slug: "voice-commands",
    hub_keyword: "voice command apps android",
    description: "",
  },
};

export const CATEGORIES_LIST: CategoryData[] = Object.values(CATEGORY_DATA);

export function getCategoryBySlug(slug: string): CategoryData | undefined {
  return CATEGORIES_LIST.find((c) => c.slug === slug);
}
