import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APPS_FILE = path.join(ROOT, "src", "data", "apps.ts");
const BANNER_DIR = path.join(ROOT, "public", "app-banners");
const MAP_FILE = path.join(ROOT, "src", "data", "local-banner-map.ts");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36";

function detectExtension(buffer) {
  if (buffer.length >= 12) {
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return "png";
    }
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      return "jpg";
    }
    if (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    ) {
      return "webp";
    }
    const gifHeader = buffer.toString("ascii", 0, 6);
    if (gifHeader === "GIF87a" || gifHeader === "GIF89a") {
      return "gif";
    }
  }
  return "webp";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toSafeFileBase(packageId) {
  return packageId.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function parseBannerEntries(source) {
  const regex =
    /packageId:\s*"([^"]+)"[\s\S]*?bannerUrl:\s*banner\("([^"]+)"\)/g;
  const entries = [];
  for (const match of source.matchAll(regex)) {
    const packageId = match[1];
    const hash = match[2];
    entries.push({
      packageId,
      // s0 requests original/source resolution to avoid quality loss on larger layouts.
      remoteUrl: `https://play-lh.googleusercontent.com/${hash}=s0`,
    });
  }
  return entries;
}

async function downloadWithRetry(url, attempts = 7) {
  let lastError;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent": USER_AGENT,
          accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
      });
      if (res.status === 429) {
        await sleep(Math.min(1200 * i, 8000));
        continue;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (error) {
      lastError = error;
      await sleep(Math.min(900 * i, 5000));
    }
  }
  throw lastError ?? new Error("Failed to download banner");
}

async function main() {
  const src = await fs.readFile(APPS_FILE, "utf8");
  const entries = parseBannerEntries(src);
  if (entries.length === 0) {
    throw new Error("No banner entries found in src/data/apps.ts");
  }

  await fs.mkdir(BANNER_DIR, { recursive: true });
  const existing = await fs.readdir(BANNER_DIR);
  for (const file of existing) {
    await fs.unlink(path.join(BANNER_DIR, file));
  }

  const localMap = {};
  const failures = [];

  for (const entry of entries) {
    try {
      const buffer = await downloadWithRetry(entry.remoteUrl);
      const ext = detectExtension(buffer);
      const filename = `${toSafeFileBase(entry.packageId)}.${ext}`;
      await fs.writeFile(path.join(BANNER_DIR, filename), buffer);
      localMap[entry.packageId] = `/app-banners/${filename}`;
      process.stdout.write(`Downloaded ${entry.packageId} -> ${filename}\n`);
    } catch (error) {
      failures.push({
        packageId: entry.packageId,
        remoteUrl: entry.remoteUrl,
        error: String(error),
      });
      process.stdout.write(`FAILED ${entry.packageId}: ${String(error)}\n`);
    }
  }

  await fs.writeFile(
    MAP_FILE,
    `export const LOCAL_BANNER_MAP: Record<string, string> = ${JSON.stringify(
      localMap,
      null,
      2
    )};\n`,
    "utf8"
  );

  process.stdout.write(
    `\nSaved ${Object.keys(localMap).length}/${entries.length} banners to public/app-banners.\n`
  );

  if (failures.length > 0) {
    process.stdout.write("\nMissing banners:\n");
    for (const item of failures) {
      process.stdout.write(
        `- ${item.packageId} (${item.remoteUrl}) -> ${item.error}\n`
      );
    }
    process.exitCode = 2;
  }
}

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? String(error)}\n`);
  process.exit(1);
});
