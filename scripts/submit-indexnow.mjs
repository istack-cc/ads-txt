/**
 * IndexNow URL submission script
 * Run this after each deployment to notify Bing, Yandex, and other IndexNow
 * search engines about updated pages.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs
 *
 * Requires: INDEXNOW_KEY env var (or set it inline below)
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ──────────────────────────────────────────────────────────────────

const SITE_URL = "https://istack.cc";
const KEY = process.env.INDEXNOW_KEY ?? "b7e3f2d1a8c4e9b6d3f0a2c5e8b1d4f7";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

// ─── URL list ─────────────────────────────────────────────────────────────────

// Load app slugs from the data directory
let appSlugs = [];
let categorySlugs = [];
let howToSlugs = [];
let compareSlugs = [];
let bestOfSlugs = [];
let glossaryTerms = [];

try {
  // Read apps data - extract IDs
  const appsFile = readFileSync(
    join(__dirname, "../src/data/apps.ts"),
    "utf-8"
  );
  const appMatches = appsFile.match(/id:\s*["']([^"']+)["']/g) ?? [];
  appSlugs = appMatches
    .map((m) => m.match(/["']([^"']+)["']/)?.[1])
    .filter(Boolean);
} catch {
  console.warn("Could not read app slugs from apps.ts");
}

try {
  const catFile = readFileSync(
    join(__dirname, "../src/data/categories.ts"),
    "utf-8"
  );
  const catMatches = catFile.match(/slug:\s*["']([^"']+)["']/g) ?? [];
  categorySlugs = catMatches
    .map((m) => m.match(/["']([^"']+)["']/)?.[1])
    .filter(Boolean);
} catch {
  console.warn("Could not read category slugs");
}

// Build the full URL list
const urls = [
  `${SITE_URL}/`,
  `${SITE_URL}/privacy/`,
  `${SITE_URL}/terms/`,
  `${SITE_URL}/research/free-app-landscape-2026/`,
  ...categorySlugs.map((s) => `${SITE_URL}/category/${s}/`),
  ...appSlugs.map((s) => `${SITE_URL}/apps/${s}/`),
  ...howToSlugs.map((s) => `${SITE_URL}/how-to/${s}/`),
  ...compareSlugs.map((s) => `${SITE_URL}/compare/${s}/`),
  ...bestOfSlugs.map((s) => `${SITE_URL}/best/${s}/`),
  ...glossaryTerms.map((t) => `${SITE_URL}/glossary/${t}/`),
];

console.log(`\nIndexNow submission`);
console.log(`Site: ${SITE_URL}`);
console.log(`Key:  ${KEY}`);
console.log(`URLs: ${urls.length}\n`);

// ─── Submit ───────────────────────────────────────────────────────────────────

const payload = {
  host: new URL(SITE_URL).hostname,
  key: KEY,
  keyLocation: `${SITE_URL}/${KEY}.txt`,
  urlList: urls,
};

try {
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    console.log(`✓ Submitted ${urls.length} URLs to IndexNow (HTTP ${res.status})`);
  } else {
    const text = await res.text();
    console.error(`✗ IndexNow returned HTTP ${res.status}: ${text}`);
    process.exit(1);
  }
} catch (err) {
  console.error("✗ Network error:", err.message);
  process.exit(1);
}
