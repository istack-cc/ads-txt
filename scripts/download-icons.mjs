import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APPS_FILE = path.join(ROOT, "src", "data", "apps.ts");
const ICON_DIR = path.join(ROOT, "public", "app-icons");
const MAP_FILE = path.join(ROOT, "src", "data", "local-icon-map.ts");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36";

function detectExtension(buffer) {
  if (buffer.length >= 12) {
    // PNG
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return "png";
    }
    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      return "jpg";
    }
    // WebP (RIFF....WEBP)
    if (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    ) {
      return "webp";
    }
    // GIF
    const gifHeader = buffer.toString("ascii", 0, 6);
    if (gifHeader === "GIF87a" || gifHeader === "GIF89a") {
      return "gif";
    }
  }
  return "png";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toSafeFileBase(packageId) {
  return packageId.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function parseAppsSource(source) {
  const regex =
    /packageId:\s*"([^"]+)"[\s\S]*?iconUrl:\s*icon\("([^"]+)"\)/g;
  const entries = [];
  for (const match of source.matchAll(regex)) {
    const packageId = match[1];
    const hash = match[2];
    entries.push({
      packageId,
      remoteUrl: `https://play-lh.googleusercontent.com/${hash}=w240-h480-rw`,
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
        const waitMs = Math.min(1200 * i, 8000);
        await sleep(waitMs);
        continue;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      lastError = error;
      const waitMs = Math.min(900 * i, 5000);
      await sleep(waitMs);
    }
  }
  throw lastError ?? new Error("Failed to download icon");
}

async function main() {
  const src = await fs.readFile(APPS_FILE, "utf8");
  const apps = parseAppsSource(src);

  if (apps.length === 0) {
    throw new Error("No app icon entries found in src/data/apps.ts");
  }

  await fs.mkdir(ICON_DIR, { recursive: true });

  const localMap = {};
  const failures = [];

  for (const app of apps) {
    try {
      const buffer = await downloadWithRetry(app.remoteUrl);
      const ext = detectExtension(buffer);
      const filename = `${toSafeFileBase(app.packageId)}.${ext}`;
      const outPath = path.join(ICON_DIR, filename);
      await fs.writeFile(outPath, buffer);
      localMap[app.packageId] = `/app-icons/${filename}`;
      process.stdout.write(`Downloaded ${app.packageId} -> ${filename}\n`);
    } catch (error) {
      failures.push({
        packageId: app.packageId,
        remoteUrl: app.remoteUrl,
        error: String(error),
      });
      process.stdout.write(`FAILED ${app.packageId}: ${String(error)}\n`);
    }
  }

  const mapFileContent = `export const LOCAL_ICON_MAP: Record<string, string> = ${JSON.stringify(
    localMap,
    null,
    2
  )};\n`;
  await fs.writeFile(MAP_FILE, mapFileContent, "utf8");

  process.stdout.write(
    `\nSaved ${Object.keys(localMap).length}/${apps.length} icons to public/app-icons.\n`
  );

  if (failures.length > 0) {
    process.stdout.write("\nMissing icons:\n");
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
