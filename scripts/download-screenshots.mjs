#!/usr/bin/env node
/**
 * Scrape phone screenshots from Google Play & Apple App Store listings.
 * Play's current HTML ships screenshot hashes as landscape crops
 * (=w1052-h592-rw). We re-request each hash with =h2048 to get the native
 * portrait source, then keep only portrait-oriented results.
 *
 * Output:
 *   public/app-screenshots/<packageId>/N.<ext>
 *   src/data/local-screenshot-map.ts  (Record<packageId, string[]>)
 *
 * Usage:
 *   node scripts/download-screenshots.mjs
 *   node scripts/download-screenshots.mjs --only com.istack.home_workout
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APPS_FILE = path.join(ROOT, "src", "data", "apps.ts");
const SHOT_DIR = path.join(ROOT, "public", "app-screenshots");
const MAP_FILE = path.join(ROOT, "src", "data", "local-screenshot-map.ts");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const MAX_SHOTS_PER_APP = 6;
const DELAY_MS = 1000;

const args = process.argv.slice(2);
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

/* ─── helpers ─────────────────────────────────────────── */
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function detectExt(buf) {
  if (buf.length < 12) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  )
    return "webp";
  return "jpg";
}

/** Read width/height from JPEG/PNG/WebP buffer. Returns null if unknown. */
function readImageSize(buf) {
  // PNG
  if (
    buf.length >= 24 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  // JPEG — scan SOF markers
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) break;
      const marker = buf[i + 1];
      i += 2;
      // SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        return { h: buf.readUInt16BE(i + 3), w: buf.readUInt16BE(i + 5) };
      }
      const len = buf.readUInt16BE(i);
      i += len;
    }
  }
  // WebP VP8/VP8L/VP8X — skip detailed parsing, fall back null
  return null;
}

const SAFARI_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

async function fetchText(url, ua = UA) {
  const r = await fetch(url, {
    headers: { "User-Agent": ua, "Accept-Language": "en-US,en;q=0.9" },
    redirect: "follow",
  });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return await r.text();
}

async function fetchBuffer(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

/* ─── parse apps.ts ──────────────────────────────────── */
async function parseApps() {
  const src = await fs.readFile(APPS_FILE, "utf8");
  // Split into per-app blocks starting at `id: "..."` and ending before gradientTo.
  const blockRe =
    /id:\s*"([^"]+)"[\s\S]*?packageId:\s*"([^"]+)"[\s\S]*?gradientTo:/g;
  const entries = [];
  let m;
  while ((m = blockRe.exec(src))) {
    const [block, id, packageId] = m;
    const platformMatch = block.match(/platform:\s*"(ios|android)"/);
    const appStoreMatch = block.match(/appStoreId:\s*"(\d+)"/);
    // Fallback: packageId starting with "ios." → iOS
    const platform =
      platformMatch?.[1] ??
      (packageId.startsWith("ios.") ? "ios" : "android");
    entries.push({
      id,
      packageId,
      platform,
      appStoreId: appStoreMatch?.[1],
    });
  }
  return entries;
}

/* ─── Play Store extraction ──────────────────────────── */
/**
 * Collect unique Play image hashes that look like screenshot carousel
 * items: they appear with BOTH a 526x296 and 1052x592 crop.
 * Returns the list of hashes (without host or size).
 */
function extractPlayScreenshotHashes(html) {
  const re = /play-lh\.googleusercontent\.com\/([A-Za-z0-9_-]+)=w(\d+)-h(\d+)-rw/g;
  const sizesByHash = new Map();
  let m;
  while ((m = re.exec(html))) {
    const [, hash, w, h] = m;
    if (!sizesByHash.has(hash)) sizesByHash.set(hash, new Set());
    sizesByHash.get(hash).add(`${w}x${h}`);
  }
  const screenshots = [];
  for (const [hash, sizes] of sizesByHash.entries()) {
    // Screenshot carousel items consistently ship both crops
    if (sizes.has("526x296") && sizes.has("1052x592")) {
      screenshots.push(hash);
    }
  }
  return screenshots.slice(0, MAX_SHOTS_PER_APP);
}

async function scrapePlay(packageId) {
  const url = `https://play.google.com/store/apps/details?id=${packageId}&hl=en&gl=US`;
  try {
    const html = await fetchText(url);
    const hashes = extractPlayScreenshotHashes(html);
    return hashes.map(
      (h) => `https://play-lh.googleusercontent.com/${h}=h2048`
    );
  } catch (e) {
    console.warn(`  [play] ${packageId} — ${e.message}`);
    return [];
  }
}

/* ─── App Store extraction ───────────────────────────── */
function extractAppStoreScreenshots(html) {
  // Apple serves screenshots as e.g. …/<uuid>/<name>.png/600x1300bb.webp.
  // Each screenshot has a unique folder (the UUID segment), so we dedupe
  // on the folder path rather than the final transform URL.
  const re =
    /https:\/\/is[0-9]-ssl\.mzstatic\.com\/image\/thumb\/([^"' \t<>]+?)\/(\d+)x(\d+)bb(?:-\d+)?\.(?:png|jpg|jpeg|webp)/g;
  const byFolder = new Map(); // folder → { w, h, ext, folderPath }
  let m;
  while ((m = re.exec(html))) {
    const [, folder, wStr, hStr] = m;
    const w = parseInt(wStr, 10);
    const h = parseInt(hStr, 10);
    if (h <= w) continue; // skip landscape / square
    if (w < 200) continue; // skip micro thumbs
    // Prefer the largest crop we see for each folder
    const prev = byFolder.get(folder);
    if (!prev || w * h > prev.w * prev.h) {
      byFolder.set(folder, { folder, w, h });
    }
  }
  // Now build normalized URLs at a high-res size
  const urls = [];
  for (const { folder } of byFolder.values()) {
    urls.push(
      `https://is1-ssl.mzstatic.com/image/thumb/${folder}/1170x2532bb.webp`
    );
  }
  return urls.slice(0, MAX_SHOTS_PER_APP);
}

async function scrapeAppStore(id, appStoreId) {
  const url = `https://apps.apple.com/us/app/${id}/id${appStoreId}`;
  try {
    const html = await fetchText(url, SAFARI_UA);
    return extractAppStoreScreenshots(html);
  } catch (e) {
    console.warn(`  [apple] ${id} — ${e.message}`);
    return [];
  }
}

/* ─── Save screenshots ───────────────────────────────── */
async function saveShots(packageId, urls) {
  if (!urls.length) return [];
  const dir = path.join(SHOT_DIR, packageId);
  await fs.mkdir(dir, { recursive: true });

  const localPaths = [];
  let index = 0;
  for (const u of urls) {
    try {
      const buf = await fetchBuffer(u);
      const size = readImageSize(buf);
      // Keep only portrait images (h > w)
      if (size && size.h <= size.w) {
        process.stdout.write("-");
        continue;
      }
      const ext = detectExt(buf);
      index += 1;
      const fname = `${index}.${ext}`;
      await fs.writeFile(path.join(dir, fname), buf);
      localPaths.push(`/app-screenshots/${packageId}/${fname}`);
      process.stdout.write(".");
    } catch (e) {
      process.stdout.write("x");
    }
  }
  return localPaths;
}

/* ─── Main ────────────────────────────────────────────── */
async function main() {
  await fs.mkdir(SHOT_DIR, { recursive: true });

  const apps = await parseApps();
  const targets = ONLY
    ? apps.filter((a) => a.packageId === ONLY || a.id === ONLY)
    : apps;

  console.log(`Scraping screenshots for ${targets.length} apps…\n`);

  // Preserve existing map
  const map = {};
  try {
    const existing = await fs.readFile(MAP_FILE, "utf8");
    const m = existing.match(/=\s*({[\s\S]*})\s*;/);
    if (m) Object.assign(map, JSON.parse(m[1]));
  } catch {
    /* first run */
  }

  for (const app of targets) {
    const prefix = `[${app.platform}] ${app.id.padEnd(28)}`;
    process.stdout.write(`${prefix} `);

    let urls = [];
    if (app.platform === "ios" && app.appStoreId) {
      urls = await scrapeAppStore(app.id, app.appStoreId);
    } else {
      urls = await scrapePlay(app.packageId);
      if (!urls.length && app.appStoreId) {
        urls = await scrapeAppStore(app.id, app.appStoreId);
      }
    }

    if (!urls.length) {
      console.log(`✗  no screenshots found`);
      continue;
    }

    process.stdout.write(`${urls.length} urls `);
    const local = await saveShots(app.packageId, urls);
    if (local.length) map[app.packageId] = local;
    console.log(` ✓ ${local.length}`);

    await sleep(DELAY_MS);
  }

  // Emit TS map
  const header = `// Auto-generated by scripts/download-screenshots.mjs. Do not edit.\n`;
  const body =
    `export const LOCAL_SCREENSHOT_MAP: Record<string, string[]> = ${JSON.stringify(
      map,
      null,
      2
    )};\n`;
  await fs.writeFile(MAP_FILE, header + body);

  const covered = Object.keys(map).length;
  console.log(
    `\nDone. ${covered}/${targets.length} apps have screenshots. Map: ${path.relative(
      ROOT,
      MAP_FILE
    )}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
