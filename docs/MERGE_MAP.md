# MERGE MAP — Phase 0 Audit

_Generated: 2026-10-23. Updated after each phase._

---

## 1. Route inventory (pre-merge)

| Route | Component | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` → landing | Two CTAs: `/app` (Tool Hub) + `/editor` (Desktop Editor) |
| `/app/` | `src/app/app/page.tsx` → `ToolHubContent` | Mobile hub, uses `mobileImageStore` |
| `/app/editor/` | `src/app/app/editor/page.tsx` → `EditorShell` | Alias of `/editor/` |
| `/editor/` | `src/app/editor/page.tsx` → `EditorShell` | Desktop editor, uses `editorStore` |
| `/app/settings/` | Settings page (hub-side) | |
| `/app/tool/[id]/` | Per-tool deep-link pages | |

**Target:** `/app/` becomes the unified app. `/editor/` → `/app/` (preserve query).

---

## 2. Feature merge map

### Hub features → Unified Library

| Feature | Hub component | Unified location |
|---|---|---|
| Resize and Convert | `ToolHubContent` | Library workflow → Export + Resize panels |
| Resize by Weight | `ResizeByWeightScreen` | Library workflow |
| Resize by Limits | `ResizeByLimitsScreen` | Library workflow |
| Format Conversion | `FormatConversionScreen` | Library workflow → Export panel |
| Crop | `CropScreen` | Library workflow → canvas overlay |
| Image Cutting | `ImageCuttingScreen` | Library workflow → canvas overlay |
| Edit EXIF | `EditExifScreen` | Library workflow → Metadata panel |
| Delete EXIF | `DeleteExifScreen` | Library workflow |
| Batch Rename | `BatchRenameScreen` | Library workflow → batch dialog |
| Collage & Stitch | `CollageScreen` | Library workflow (proposed) |
| Image Info | `ImageInfoScreen` | Library workflow |
| Histogram | `HistogramScreen` | Library workflow |
| Palette Extractor | `PaletteExtractorScreen` | Library workflow |
| Compare Images | `CompareImagesScreen` | Library workflow |
| All Options | `AllOptionsScreen` | Library category "All Options" |
| Favorites | `mobileImageStore.favoriteToolIds` | Unified store |
| Batch images | `mobileImageStore.batchImages` | Unified store image strip |

### Editor features → Unified Library

| Feature | Editor component | Unified location |
|---|---|---|
| Canvas view + zoom/pan | `CanvasView`, `ZoomToolbar` | Canvas area (all modes) |
| Pipeline list | `PipelineList`, `StepRow` | Edits panel / sheet |
| Step parameters | `ParamPanel`, `Inspector` | Adjust panel / sheet |
| Tool Library (ops) | `ToolLibrary`, `ToolRow` | Left sidebar / Tools sheet |
| Command palette | `CommandPalette` | Top bar + Ctrl+K |
| Export dialog | `ExportDialog` | Export panel / sheet |
| Compare slider | `CompareSlider` | Canvas floating controls |
| History | `HistoryPanel` | Edits panel |
| Info tab | `InfoTab` | Info sheet |
| Drag-and-drop | `Dropzone` | Unified empty state |

### Duplicates to eliminate

| Feature | Hub | Editor | Keep |
|---|---|---|---|
| Image file open | `ToolHubContent` (input[file]) | `Dropzone` (react-dropzone) | Unified Dropzone + input |
| Image state | `mobileImageStore` | `editorStore` | Unified store |
| Settings | `settings/page.tsx` | none | Sheet inside app |

---

## 3. Android failure hypotheses

| # | Hypothesis | Evidence | Status |
|---|---|---|---|
| 1 | Fixed `100vh` + px-width sidebars clip on narrow screens | `EditorShell` uses `100vh`, asides are `280px`/`320px` fixed | **LIKELY** |
| 2 | No camera/Take Photo button on mobile; `open()` from react-dropzone may not fire on Android | Hub has camera input; editor uses dropzone `open()` | **LIKELY** |
| 3 | `Ctrl+V` / `Ctrl+K` are only paste/search entry points | No visible paste or search button on phones | **CONFIRMED** |
| 4 | Mouse events + tiny targets in inspector | `900px` media query but no phone UI replacement | **LIKELY** |
| 5 | Large photos crash low-memory devices | No downscale proxy in EditorShell | **POSSIBLE** |
| 6 | WASM MIME / CSP — no `vercel.json` headers | Confirmed: no `vercel.json` | **POSSIBLE** |
| 7 | Stale SW: `CACHE_NAME = "magick-studio-v1"` never rotates on deploy | `sw.js` confirmed | **LIKELY** |
| 8 | EXIF orientation not handled | Not in Dropzone code | **POSSIBLE** |
| 9 | On-screen keyboard resizes viewport; no `visualViewport` handling | Not present | **LIKELY** |
| 10 | `<a download>` may not trigger on Android Chrome | ExportDialog pending inspection | **POSSIBLE** |

---

## 4. Landing page claim audit

| Claim | Verdict |
|---|---|
| "261 CLI options" | **OK** — coverage.json has 261 keys; generate from data |
| "227 WASM tools" | **CHECK** — compute from COVERAGE_STATS.ui |
| "16 desktop operators" | **CHECK** — compute from COVERAGE_STATS.nativeOnly |
| "280+ formats" | **OK** — engine-capabilities.json lists 280 format names |
| "Network Activity 0.0 KB/s" decorative stats | **REMOVE** — not real |
| "Hardware-accelerated preview" | **SOFTEN** → "real-time preview" |
| "24-Bit HDRI" in hero card | **REMOVE** — unverified in WASM build |
| "Zero latency" | **REMOVE** |
| "multi-threaded FFTW, OpenMP" | **CLARIFY** — desktop native build only |
| "Auto Enhance AI", "Smart Fill" | **REMOVE** — not ImageMagick features |
| "Offline-Capable" | **CAVEAT** — SW exists but cache not versioned; fix before claiming |
| "Download App" → ImageMagick GitHub | **FIX** → own repo or hide button |
| Footer links → `#` | **FIX** → create pages or remove links |

---

## 5. Phase status

- [x] Phase 0: Audit complete
- [x] Phase 1: Single registry and store (`src/store/appStore.ts`, selectors re-exported)
- [x] Phase 2: Unified shell (`AppShell.tsx`, `useLayoutMode.ts`, responsive dock + sheets)
- [x] Phase 3: File intake (Android-safe: `UnifiedEmptyState.tsx`, Browse, Take Photo, Paste, 50MB guard)
- [x] Phase 4: Library merge (`ToolLibrary.tsx`, operations, workflows, categories, search, recents)
- [x] Phase 5: Phone optimization (48px targets, touch zoom/pan, sheets with gestures, visualViewport & dvh)
- [x] Phase 6: Routes, redirects, landing (one CTA "Open Editor", dynamic stats, unverified claims removed, redirects)
- [x] Phase 7: Remove old surfaces (`/app/` is single unified UI; `/editor` & `/app/editor` redirect)
- [x] Phase 8: Quality gates (vitest 36/36 passed, TypeScript 0 errors, next build succeeded)
