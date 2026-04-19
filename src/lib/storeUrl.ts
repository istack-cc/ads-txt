import type { App } from "@/data/apps";

export type StoreSource = "homepage" | "category" | "app-page" | "how-to" | "compare" | "best-of";
export type StorePosition = "hero" | "mid" | "footer" | "entry";

const PLAY_STORE_BASE = "https://play.google.com/store/apps/details";
const APP_STORE_BASE = "https://apps.apple.com/us/app";

export function getStoreUrl(
  app: App,
  source: StoreSource = "app-page",
  position: StorePosition = "mid"
): string {
  const content = `${app.id}-${source}-${position}`;

  if (app.platform === "ios") {
    const name = app.id;
    const id = app.appStoreId ?? "";
    const ct = encodeURIComponent(content);
    return `${APP_STORE_BASE}/${name}/id${id}?pt=ISTACK&ct=${ct}`;
  }

  // android or both
  const params = new URLSearchParams({
    id: app.packageId,
    utm_source: "istack",
    utm_medium: "web",
    utm_campaign: "organic",
    utm_content: content,
  });
  return `${PLAY_STORE_BASE}?${params.toString()}`;
}

export function getPlayStoreUrl(
  app: App,
  source: StoreSource = "app-page",
  position: StorePosition = "mid"
): string {
  const content = `${app.id}-${source}-${position}`;
  const params = new URLSearchParams({
    id: app.packageId,
    utm_source: "istack",
    utm_medium: "web",
    utm_campaign: "organic",
    utm_content: content,
  });
  return `${PLAY_STORE_BASE}?${params.toString()}`;
}

export function getAppStoreUrl(
  app: App,
  source: StoreSource = "app-page",
  position: StorePosition = "mid"
): string {
  if (!app.appStoreId) return "";
  const content = `${app.id}-${source}-${position}`;
  const ct = encodeURIComponent(content);
  return `${APP_STORE_BASE}/${app.id}/id${app.appStoreId}?pt=ISTACK&ct=${ct}`;
}
