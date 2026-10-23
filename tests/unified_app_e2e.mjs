import { chromium } from "@playwright/test";
import http from "http";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "/home/rishi/.gemini/antigravity-ide/brain/677b3734-e7ab-4844-b20b-53981d205d83";
const OUT_DIR = path.resolve(process.cwd(), "out");
const PORT = 3456;

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

function startStaticServer() {
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".wasm": "application/wasm",
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split("?")[0]);
    if (reqPath.endsWith("/")) reqPath += "index.html";

    let filePath = path.join(OUT_DIR, reqPath);

    if (!fs.existsSync(filePath)) {
      if (fs.existsSync(path.join(filePath, "index.html"))) {
        filePath = path.join(filePath, "index.html");
      } else if (fs.existsSync(filePath + ".html")) {
        filePath = filePath + ".html";
      }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Static server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startStaticServer();

  try {
    const browser = await chromium.launch({ headless: true });

    // ── 1. Landing Page (Mobile 390x844) ──
    console.log("Testing Landing Page on Mobile (390x844)...");
    const mobilePage = await browser.newPage({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });

    await mobilePage.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
    const hasLandingOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Landing Mobile Horizontal Overflow: ${hasLandingOverflow ? "FAILED (overflow)" : "PASSED (none)"}`);

    // Verify single primary CTA "Open Editor"
    const openEditorBtn = mobilePage.locator("#hero-open-editor-btn");
    const btnVisible = await openEditorBtn.isVisible();
    console.log(`Hero Primary CTA "Open Editor" visible: ${btnVisible ? "PASSED" : "FAILED"}`);

    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, "landing_mobile_390x844.png"), fullPage: false });
    console.log("Saved landing_mobile_390x844.png");

    // ── 2. Unified App (Mobile 390x844) ──
    console.log("Testing Unified App on Mobile (390x844)...");
    await mobilePage.goto(`http://localhost:${PORT}/app/`, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(600);

    const hasAppOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`App Mobile Horizontal Overflow: ${hasAppOverflow ? "FAILED (overflow)" : "PASSED (none)"}`);

    // Verify empty state buttons: Browse, Take Photo, Paste, Search
    const browseBtn = mobilePage.locator("#empty-state-browse-btn");
    const photoBtn = mobilePage.locator("#empty-state-photo-btn");
    const pasteBtn = mobilePage.locator("#empty-state-paste-btn");
    const searchBtn = mobilePage.locator("#empty-state-search-btn");

    console.log(`Browse Button visible: ${await browseBtn.isVisible() ? "PASSED" : "FAILED"}`);
    console.log(`Take Photo Button visible: ${await photoBtn.isVisible() ? "PASSED" : "FAILED"}`);
    console.log(`Paste Button visible: ${await pasteBtn.isVisible() ? "PASSED" : "FAILED"}`);
    console.log(`Quick Search Button visible: ${await searchBtn.isVisible() ? "PASSED" : "FAILED"}`);

    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, "app_mobile_empty_390x844.png"), fullPage: false });
    console.log("Saved app_mobile_empty_390x844.png");

    // ── 3. Unified App (Desktop 1440x900) ──
    console.log("Testing Unified App on Desktop (1440x900)...");
    const desktopPage = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });

    await desktopPage.goto(`http://localhost:${PORT}/app/`, { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(600);

    await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, "app_desktop_empty_1440x900.png"), fullPage: false });
    console.log("Saved app_desktop_empty_1440x900.png");

    // ── 4. Redirect test: /editor?op=blur -> /app/?op=blur ──
    console.log("Testing /editor?op=blur redirect...");
    await desktopPage.goto(`http://localhost:${PORT}/editor/?op=blur`, { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(600);
    const finalUrl = desktopPage.url();
    console.log(`Redirect /editor/?op=blur ended at: ${finalUrl}`);
    const redirectPassed = finalUrl.includes("/app/") && finalUrl.includes("op=blur");
    console.log(`Redirect preserving query: ${redirectPassed ? "PASSED" : "FAILED"}`);

    await browser.close();
    console.log("All E2E checks completed successfully!");
  } finally {
    server.close();
  }
}

run().catch((err) => {
  console.error("E2E Test Error:", err);
  process.exit(1);
});
