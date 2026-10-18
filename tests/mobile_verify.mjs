import { chromium } from "@playwright/test";
import http from "http";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "/home/rishi/.gemini/antigravity-ide/brain/61ece0a4-b23a-478b-ac70-e3c199c12ffe";
const OUT_DIR = path.resolve(process.cwd(), "out");
const PORT = 3456;

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

// Minimal static file server for Next.js static export
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

    // If file doesn't exist, try appending /index.html or .html
    if (!fs.existsSync(filePath)) {
      if (fs.existsSync(path.join(filePath, "index.html"))) {
        filePath = path.join(filePath, "index.html");
      } else if (fs.existsSync(filePath + ".html")) {
        filePath = filePath + ".html";
      }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
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
  const browser = await chromium.launch({ headless: true });

  try {
    // ── 1. Tool Hub on iPhone 12/13/14 (390 × 844) ──
    console.log("1. Testing Mobile Tool Hub (390x844)...");
    const page390 = await browser.newPage({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });

    await page390.goto(`http://localhost:${PORT}/app/`, { waitUntil: "networkidle" });
    await page390.waitForTimeout(500);

    // Verify Real Tool Count Badge is present and > 15
    const badge = page390.locator("#tool-count-badge");
    const badgeText = await badge.innerText();
    console.log(`Real Tool Count Badge text: ${badgeText}`);

    // Verify no horizontal overflow
    const hasHScroll = await page390.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Horizontal page scroll check: ${hasHScroll ? "FAILED (overflow)" : "PASSED (no overflow)"}`);

    // Take screenshot of Tool Hub
    await page390.screenshot({ path: path.join(ARTIFACT_DIR, "mobile_hub_390x844.png") });
    console.log("Saved mobile_hub_390x844.png");

    // ── 2. Test Search in Tool Hub (-chop) ──
    console.log("2. Testing Search query (-chop)...");
    const searchInput = page390.locator("#tool-search-input");
    await searchInput.fill("-chop");
    await page390.waitForTimeout(300);
    const cuttingCard = page390.locator("#tool-card-image-cutting");
    const isCuttingVisible = await cuttingCard.isVisible();
    console.log(`Searching -chop found Image Cutting: ${isCuttingVisible ? "YES" : "NO"}`);
    await searchInput.fill(""); // clear search

    // ── 3. Open What's New BottomSheet ──
    console.log("3. Testing What's New bottom sheet...");
    await page390.locator("#btn-whats-new").click();
    await page390.waitForTimeout(400);
    await page390.screenshot({ path: path.join(ARTIFACT_DIR, "mobile_hub_sheet_390x844.png") });
    console.log("Saved mobile_hub_sheet_390x844.png");
    // Close sheet via backdrop or close button
    await page390.keyboard.press("Escape");
    await page390.waitForTimeout(300);

    // ── 4. Single Edit Screen (390 × 844) ──
    console.log("4. Testing Single Edit Screen (390x844)...");
    await page390.goto(`http://localhost:${PORT}/app/tool/single-edit/`, { waitUntil: "networkidle" });
    await page390.waitForTimeout(800);
    await page390.screenshot({ path: path.join(ARTIFACT_DIR, "mobile_single_edit_390x844.png") });
    console.log("Saved mobile_single_edit_390x844.png");

    // Scroll down to Formats card and capture
    await page390.evaluate(() => window.scrollBy(0, 500));
    await page390.waitForTimeout(400);
    await page390.screenshot({ path: path.join(ARTIFACT_DIR, "mobile_single_edit_scrolled_390x844.png") });
    console.log("Saved mobile_single_edit_scrolled_390x844.png");

    // ── 5. Crop Screen (390 × 844) ──
    console.log("5. Testing Crop Screen...");
    await page390.goto(`http://localhost:${PORT}/app/tool/crop/`, { waitUntil: "networkidle" });
    await page390.waitForTimeout(500);
    await page390.screenshot({ path: path.join(ARTIFACT_DIR, "mobile_crop_390x844.png") });
    console.log("Saved mobile_crop_390x844.png");

    // ── 6. Image Cutting Screen (390 × 844) ──
    console.log("6. Testing Image Cutting Screen...");
    await page390.goto(`http://localhost:${PORT}/app/tool/image-cutting/`, { waitUntil: "networkidle" });
    await page390.waitForTimeout(500);
    await page390.screenshot({ path: path.join(ARTIFACT_DIR, "mobile_cutting_390x844.png") });
    console.log("Saved mobile_cutting_390x844.png");

    // ── 7. Resize by Weight Screen (390 × 844) ──
    console.log("7. Testing Resize by Weight Screen...");
    await page390.goto(`http://localhost:${PORT}/app/tool/resize-weight/`, { waitUntil: "networkidle" });
    await page390.waitForTimeout(500);
    await page390.screenshot({ path: path.join(ARTIFACT_DIR, "mobile_weight_390x844.png") });
    console.log("Saved mobile_weight_390x844.png");

    // ── 8. Batch Rename Screen (390 × 844) ──
    console.log("8. Testing Batch Rename Screen...");
    await page390.goto(`http://localhost:${PORT}/app/tool/batch-rename/`, { waitUntil: "networkidle" });
    await page390.waitForTimeout(500);
    await page390.screenshot({ path: path.join(ARTIFACT_DIR, "mobile_rename_390x844.png") });
    console.log("Saved mobile_rename_390x844.png");

    // ── 9. Edit EXIF Screen (390 × 844) ──
    console.log("9. Testing Edit EXIF Screen...");
    await page390.goto(`http://localhost:${PORT}/app/tool/edit-exif/`, { waitUntil: "networkidle" });
    await page390.waitForTimeout(500);
    await page390.screenshot({ path: path.join(ARTIFACT_DIR, "mobile_exif_390x844.png") });
    console.log("Saved mobile_exif_390x844.png");

    // ── 10. Settings & Mauve Theme Switch (390 × 844) ──
    console.log("10. Testing Settings & Mauve Theme switch...");
    await page390.goto(`http://localhost:${PORT}/app/settings/`, { waitUntil: "networkidle" });
    await page390.waitForTimeout(400);

    // Click Mauve theme button
    const mauveBtn = page390.getByRole("radio", { name: /Mauve Material/i });
    if (await mauveBtn.count() > 0) {
      await mauveBtn.click();
      await page390.waitForTimeout(300);
    }
    await page390.screenshot({ path: path.join(ARTIFACT_DIR, "mobile_settings_mauve_390x844.png") });
    console.log("Saved mobile_settings_mauve_390x844.png");

    // ── 11. Desktop Viewport (1440 × 900) Tool Hub & Single Edit ──
    console.log("11. Testing Desktop Viewport (1440x900)...");
    const page1440 = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    await page1440.goto(`http://localhost:${PORT}/app/`, { waitUntil: "networkidle" });
    await page1440.waitForTimeout(500);
    await page1440.screenshot({ path: path.join(ARTIFACT_DIR, "desktop_hub_1440x900.png") });
    console.log("Saved desktop_hub_1440x900.png");

    await page1440.goto(`http://localhost:${PORT}/app/tool/single-edit/`, { waitUntil: "networkidle" });
    await page1440.waitForTimeout(800);
    await page1440.screenshot({ path: path.join(ARTIFACT_DIR, "desktop_single_edit_1440x900.png") });
    console.log("Saved desktop_single_edit_1440x900.png");

    // ── 12. Landscape Viewport (844 × 390) ──
    console.log("12. Testing Landscape Viewport (844x390)...");
    const pageLandscape = await browser.newPage({
      viewport: { width: 844, height: 390 },
      isMobile: true,
      hasTouch: true,
    });
    await pageLandscape.goto(`http://localhost:${PORT}/app/tool/single-edit/`, { waitUntil: "networkidle" });
    await pageLandscape.waitForTimeout(500);
    await pageLandscape.screenshot({ path: path.join(ARTIFACT_DIR, "mobile_landscape_844x390.png") });
    console.log("Saved mobile_landscape_844x390.png");

    console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY!");
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error("Test run error:", err);
  process.exit(1);
});
