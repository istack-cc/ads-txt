export type Product = {
  id: "fitflow" | "storeops" | "adkit" | "launchpad";
  name: string;
  shortName: string;
  category: string;
  summary: string;
  detail: string;
  accent: string;
  secondaryAccent: string;
};

export const products: Product[] = [
  {
    id: "fitflow",
    name: "FitFlow",
    shortName: "FIT",
    category: "Wellness App",
    summary: "Habit coaching with streaks, recovery signals, and weekly momentum.",
    detail:
      "A polished wellness product concept for people who want habit tracking to feel calm instead of clinical.",
    accent: "#13d6aa",
    secondaryAccent: "#204cff",
  },
  {
    id: "storeops",
    name: "StoreOps",
    shortName: "OPS",
    category: "App Store Operations",
    summary: "Release checklists, listing assets, and review-ready launch workflows.",
    detail:
      "A store operations concept for teams that need launch discipline, asset control, and fewer last-minute mistakes.",
    accent: "#f7fbff",
    secondaryAccent: "#8de8ff",
  },
  {
    id: "adkit",
    name: "AdKit",
    shortName: "ADS",
    category: "Monetization Toolkit",
    summary:
      "Ad placement planning, compliance review, and revenue experiment tracking.",
    detail:
      "A monetization concept focused on sustainable ads, policy clarity, and product-quality guardrails.",
    accent: "#ffcf43",
    secondaryAccent: "#f2475e",
  },
  {
    id: "launchpad",
    name: "LaunchPad",
    shortName: "GO",
    category: "Launch Workflow",
    summary:
      "Screenshot planning, release notes, and rollout milestones in one place.",
    detail:
      "A release-planning concept for makers who need an organized path from build complete to store-ready.",
    accent: "#b887ff",
    secondaryAccent: "#c9f65f",
  },
];
