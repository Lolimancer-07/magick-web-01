import { chromium } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = '/home/rishi/.gemini/antigravity-ide/brain/19305dd4-65b6-4c8c-8065-9cbcae3b00fe';

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  // ── 1. Desktop Viewport (1440 × 900) Empty State ──
  console.log('1. Testing Desktop (1440x900) Empty State...');
  const page1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page1440.goto('http://localhost:3000/editor/', { waitUntil: 'networkidle' });
  await page1440.waitForTimeout(1000);
  await page1440.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_1440_empty.png') });
  console.log('Saved redesign_1440_empty.png');

  // ── 2. Mobile Viewport (375 × 667) Empty State ──
  console.log('2. Testing Mobile (375x667) Empty State...');
  const page375 = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page375.goto('http://localhost:3000/editor/', { waitUntil: 'networkidle' });
  await page375.waitForTimeout(1000);
  await page375.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_375_empty.png') });
  console.log('Saved redesign_375_empty.png');

  // ── 3. Desktop: Load Image via Sample Image Button ──
  console.log('3. Clicking "Try Sample Image"...');
  const sampleBtn = page1440.getByRole('button', { name: /Try Sample Image/i });
  await sampleBtn.click();
  await page1440.waitForTimeout(2500);
  await page1440.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_1440_loaded.png') });
  console.log('Saved redesign_1440_loaded.png');

  // ── 4. Add a tool (Sepia) and inspect parameters ──
  console.log('4. Adding Sepia filter tool...');
  const sepiaTool = page1440.getByRole('button', { name: /Sepia/i });
  if (await sepiaTool.count() > 0) {
    await sepiaTool.first().click();
    await page1440.waitForTimeout(1500);
  }
  await page1440.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_1440_tool_applied.png') });
  console.log('Saved redesign_1440_tool_applied.png');

  // ── 5. Toggle Compare Slider ──
  console.log('5. Clicking Compare toggle...');
  const compareBtn = page1440.getByRole('button', { name: /Compare/i });
  if (await compareBtn.count() > 0) {
    await compareBtn.first().click();
    await page1440.waitForTimeout(1000);
  }
  await page1440.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_1440_compare.png') });
  console.log('Saved redesign_1440_compare.png');

  // ── 6. Mobile Viewport (375 × 667) with image loaded & bottom tabs ──
  console.log('6. Mobile view with image loaded...');
  const sampleBtnMobile = page375.getByRole('button', { name: /Try Sample Image/i });
  await sampleBtnMobile.click();
  await page375.waitForTimeout(2500);
  await page375.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_375_loaded.png') });
  console.log('Saved redesign_375_loaded.png');

  // Open Tools sheet on mobile
  const toolsTab = page375.getByRole('button', { name: /Tools/i });
  if (await toolsTab.count() > 0) {
    await toolsTab.first().click();
    await page375.waitForTimeout(800);
    await page375.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_375_sheet.png') });
    console.log('Saved redesign_375_sheet.png');
  }

  // ── 7. Export Dialog on Desktop ──
  console.log('7. Testing Export Dialog...');
  const exportBtn = page1440.getByRole('button', { name: /Export/i });
  await exportBtn.first().click();
  await page1440.waitForTimeout(800);
  await page1440.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_1440_export.png') });
  console.log('Saved redesign_1440_export.png');

  await browser.close();
  console.log('Verification run complete!');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
