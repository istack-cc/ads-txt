import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APPS_FILE = path.join(ROOT, "src", "data", "apps.ts");
const OUT_FILE = path.join(ROOT, "src", "data", "play-store-full-descriptions.ts");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function decodeHtmlEntities(input) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    );
}

function normalizeDescription(rawHtml) {
  return decodeHtmlEntities(rawHtml)
    .replace(/<br\s*\/?>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractPackageIds(source) {
  const ids = new Set();
  for (const match of source.matchAll(/packageId:\s*"([^"]+)"/g)) {
    ids.add(match[1]);
  }
  return [...ids];
}

function extractPlayDescription(html) {
  const match = html.match(/data-g-id="description">([\s\S]*?)<\/div>/i);
  if (!match?.[1]) return null;
  return normalizeDescription(match[1]);
}

async function fetchWithRetry(url, attempts = 5) {
  let lastError;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent": USER_AGENT,
          accept: "text/html,application/xhtml+xml",
        },
      });
      if (!res.ok) {
        if (res.status === 429 || res.status >= 500) {
          await delay(Math.min(1000 * i, 6000));
          continue;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.text();
    } catch (error) {
      lastError = error;
      await delay(Math.min(1000 * i, 6000));
    }
  }
  throw lastError ?? new Error("Failed to fetch page");
}

function toLiteral(value) {
  return JSON.stringify(value).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

async function main() {
  const appsSource = await fs.readFile(APPS_FILE, "utf8");
  const packageIds = extractPackageIds(appsSource);

  if (packageIds.length === 0) {
    throw new Error("No packageId values found in src/data/apps.ts");
  }

  const map = {};
  const failures = [];

  for (const packageId of packageIds) {
    const url = `https://play.google.com/store/apps/details?id=${packageId}&hl=en`;
    try {
      const html = await fetchWithRetry(url);
      const description = extractPlayDescription(html);
      if (!description) {
        failures.push(`${packageId}: missing description node`);
        continue;
      }
      map[packageId] = description;
      process.stdout.write(`OK ${packageId} (${description.length} chars)\n`);
      await delay(250);
    } catch (error) {
      failures.push(`${packageId}: ${String(error)}`);
      process.stdout.write(`FAILED ${packageId}: ${String(error)}\n`);
    }
  }

  const entries = Object.entries(map)
    .map(([k, v]) => `  ${toLiteral(k)}: ${toLiteral(v)},`)
    .join("\n");

  const output = `export const PLAY_STORE_FULL_DESCRIPTIONS: Record<string, string> = {\n${entries}\n};\n`;
  await fs.writeFile(OUT_FILE, output, "utf8");

  process.stdout.write(
    `\nSaved ${Object.keys(map).length}/${packageIds.length} Play Store full descriptions to ${path.relative(
      ROOT,
      OUT_FILE
    )}\n`
  );

  if (failures.length > 0) {
    process.stdout.write("\nFailures:\n");
    for (const item of failures) {
      process.stdout.write(`- ${item}\n`);
    }
    process.exitCode = 2;
  }
}

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? String(error)}\n`);
  process.exit(1);
});
