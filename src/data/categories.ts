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
    description:
      "Free productivity apps for Android and iOS, including document scanners, PDF tools, office readers, signature makers, form utilities, font generators, and translation apps. These tools focus on everyday work without subscriptions, forced accounts, or heavy setup.",
  },
  "ai-photo": {
    id: "ai-photo",
    name: "AI & Photo",
    slug: "ai-photo",
    hub_keyword: "best free ai photo apps",
    description:
      "Free AI and photo apps for quick editing, background removal, beauty filters, collages, sticker creation, hairstyle previews, and creative image effects. Built for fast mobile edits that are easy to save and share.",
  },
  utilities: {
    id: "utilities",
    name: "Utilities",
    slug: "utilities",
    hub_keyword: "best free phone utilities",
    description:
      "Free phone utility apps for speed tests, NFC reading, speaker cleaning, guitar tuning, AR measuring, screen mirroring, color picking, GPS tools, compass navigation, and voice commands. Each utility is designed for one practical task.",
  },
  health: {
    id: "health",
    name: "Health & Fitness",
    slug: "health",
    hub_keyword: "free health apps no subscription",
    description:
      "Free health and fitness apps for home workouts, step counting, safe UV planning, and simple activity tracking. These apps help users build daily habits without mandatory accounts or subscription gates.",
  },
  education: {
    id: "education",
    name: "Education",
    slug: "education",
    hub_keyword: "free ai learning apps",
    description:
      "Free education apps for AI-powered learning, homework support, math solving, and practical study help. The focus is on fast answers, clear workflows, and mobile-first learning tools.",
  },
  personalization: {
    id: "personalization",
    name: "Personalization",
    slug: "personalization",
    hub_keyword: "free wallpaper and clock apps",
    description:
      "Free personalization apps for wallpapers, watch faces, LED banners, neon clocks, edge lighting, greeting cards, wedding invitations, and home design ideas. These apps help users customize their phone and create shareable visuals.",
  },
  voice: {
    id: "voice",
    name: "Voice & Commands",
    slug: "voice-commands",
    hub_keyword: "voice command apps android",
    description:
      "Free voice command and assistant apps for triggering phone actions faster with spoken commands and preset workflows. These tools are built for hands-free shortcuts and quicker everyday navigation.",
  },
};

export const CATEGORIES_LIST: CategoryData[] = Object.values(CATEGORY_DATA);

export function getCategoryBySlug(slug: string): CategoryData | undefined {
  return CATEGORIES_LIST.find((c) => c.slug === slug);
}
