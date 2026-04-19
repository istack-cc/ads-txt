export const ORGANIZATION = {
  name: "iStack",
  url: "https://istack.cc",
  logo: "https://istack.cc/favicon.ico",
  founder: {
    name: "Mohamed Haizoun",
    url: "https://istack.cc",
  },
  sameAs: [
    "https://play.google.com/store/apps/developer?id=iStack",
    "https://apps.apple.com/us/developer/mohamed-haizoun/id1788796086",
    "https://github.com/istackdev",
    "https://sites.google.com/view/istack",
  ],
  contact_email: "contact@istack.cc",
  aggregate_stats: {
    total_apps: 45,
    total_installs: 419000,
    avg_rating: 4.6,
  },
} as const;

export type Organization = typeof ORGANIZATION;
