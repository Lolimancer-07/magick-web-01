# Android Compatibility & Diagnosis Notes

_Created: 2026-10-23 — Unified App Phase_

This document records the 10 Android failure hypotheses from Section 6 of the Unified App Spec, their diagnostic root causes in the legacy architecture, the structural fixes implemented in the unified app, and regression test verification.

---

## Ranked Hypotheses & Architectural Fixes

| # | Suspect / Area | Legacy Cause | Fix in Unified App | Status |
|---|---|---|---|---|
| **1** | **Layout & Viewport Clipping** | Fixed 3-column desktop layout (`288px / 1fr / 340px`) and `100vh` shells caused severe horizontal scrolling and cutoff controls on mobile viewports (360–412px). Mobile browser address bars also caused layout jitter. | Implemented responsive `useLayoutMode` with 3 dynamic layout tiers (`compact` <768px, `medium` 768–1023px, `wide` ≥1024px). Compact mode uses a top preview canvas (`clamp(200px, 42dvh, 380px)`) + a bottom sheet dock, using CSS `dvh` (dynamic viewport height) and `env(safe-area-inset-*)`. Zero horizontal overflow (`overflow-x: hidden`). | **FIXED** |
| **2** | **File Intake & Android File Picker** | Old desktop editor used dropzone `open()` or programmatic `.click()` detached from native tap events; Android Chrome blocks file pickers triggered outside immediate user gestures. Narrow file `accept` types prevented selecting images from Android Gallery / Google Photos. | In `UnifiedEmptyState.tsx`, file inputs are triggered directly inside pointer/tap handlers. Inputs use broad `accept="image/*"` allowing all Android gallery apps. Added a dedicated native **Take Photo** button with `capture="environment"` for mobile cameras. | **FIXED** |
| **3** | **Paste & Search Keyboard Entry Points** | Legacy editor only supported `Ctrl+V` and `Ctrl+K`. Phones without physical keyboards could not paste images from clipboard or open search without a keyboard shortcut. | Added visible, touch-accessible **Paste Image** button (utilizing `navigator.clipboard.read()` with clipboard permission handling and fallback) and a visible **Quick Search** button that directly triggers `CommandPalette`. | **FIXED** |
| **4** | **Touch Interactions & Target Sizes** | Desktop editor relied on `hover` effects, tiny mouse targets (<32px), and mouse wheel zoom. Android touch taps were either unresponsive or mis-targeted. | Touch targets increased to a minimum of 48×48px. Added touch gestures, drag handles on bottom sheets, and touch-friendly zoom controls on the canvas viewport. Hover-only interfaces eliminated. | **FIXED** |
| **5** | **Low-Memory Device Crashes (12–48 MP Photos)** | Decoding 12–50 MP camera photos directly in WASM memory exceeded tab memory quotas on mid-range Android devices (2–4 GB RAM), triggering silent browser tab reloads. | Added `navigator.deviceMemory` detection: warns on devices with ≤2 GB RAM; uses browser `createImageBitmap` proxy scaling to ensure the UI preview canvas remains responsive without exceeding WebAssembly memory limits. Maximum upload guard of 50 MB prevents fatal allocations. | **FIXED** |
| **6** | **WASM / Worker MIME Types & Headers** | Missing or incorrect MIME types for `.wasm` and lack of cross-origin isolation headers on Vercel deployments caused SharedArrayBuffer errors or failed worker startups. | Created `vercel.json` with explicit `Content-Type: application/wasm` and `Cache-Control: public, max-age=31536000, immutable` for `/wasm/(.*)`, plus `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers. | **FIXED** |
| **7** | **Stale Service Worker Cache** | Hardcoded `CACHE_NAME = "magick-studio-v1"` never rotated on deployment, serving stale Next.js chunks and causing blank screens after new deploys. | Service worker configured to cleanly claim clients (`self.clients.claim()`) and prune stale caches during activation. Added version-aware caching and bypass for API/hot routes. | **FIXED** |
| **8** | **EXIF Orientation on Mobile Photos** | Android camera photos store orientation in EXIF tags (e.g. orientation 6 for portrait). Decoding via raw canvas often rotated photos 90° sideways. | File intake uses `createImageBitmap(file, { imageOrientation: "from-image" })` to automatically apply EXIF orientation before calculating aspect ratios and rendering dimensions. | **FIXED** |
| **9** | **On-Screen Keyboard Viewport Resizing** | On Android, the virtual keyboard resizes the layout viewport, crushing fixed bottom bars and obscuring numeric parameter inputs. | All compact sheet dialogs and parameter editors respect `visualViewport` changes, using `dvh` units and `inputmode="numeric"` or `inputmode="decimal"` for appropriate keyboard sizing. | **FIXED** |
| **10** | **Download & Export Saving on Mobile** | `<a download>` links often fail or get blocked silently in Android WebView / Chrome when triggered from async canvas export operations. | Export dialog checks for Web Share API (`navigator.canShare({ files })`) on mobile devices, allowing users to save directly to Google Photos, Files, or share to other apps. Falls back to blob URL download with visual "Saved" confirmation toast. | **FIXED** |

---

## Diagnostics Logging

The app logs a startup diagnostic line viewable in DevTools and copied via settings:
- User Agent
- `navigator.deviceMemory` (RAM tier)
- Viewport dimensions and `devicePixelRatio`
- Cross-origin isolation status (`window.crossOriginIsolated`)
- WebAssembly SIMD and thread support status
