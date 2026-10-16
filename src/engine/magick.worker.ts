/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeImageMagickx64, ImageMagick, MagickFormat, Percentage, NoiseType } from "@imagemagick/magick-wasm";
import { OP_MAP } from "@/ops/definitions";
import type { WorkerRequest, WorkerResponse } from "./types";

/** Full-resolution source bytes — used for final export renders */
let original: Uint8Array | null = null;

/**
 * Pre-scaled 900px version of the original, encoded as PNG.
 * Built once on load. Used for ALL preview renders so we never
 * re-decode + re-resize a large image on every keystroke.
 */
let previewSource: Uint8Array | null = null;

/** Latest render ID — stale renders self-abort when they see a newer one */
let latestRenderId = 0;

const post = (m: WorkerResponse, t?: Transferable[]) =>
  (self as any).postMessage(m, t ?? []);

const FORMAT_MAP: Record<string, [any, string]> = {
  png:  [MagickFormat.Png,  "image/png"],
  jpeg: [MagickFormat.Jpeg, "image/jpeg"],
  jpg:  [MagickFormat.Jpeg, "image/jpeg"],
  webp: [MagickFormat.WebP, "image/webp"],
};

const PREVIEW_MAX = 1600;

/** Downscale an image in-place to fit within PREVIEW_MAX on its longest side */
function downscaleForPreview(img: any) {
  const largest = Math.max(img.width, img.height);
  if (largest > PREVIEW_MAX) {
    const s = PREVIEW_MAX / largest;
    img.resize(
      Math.max(1, Math.round(img.width * s)),
      Math.max(1, Math.round(img.height * s))
    );
  }
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data;
  try {
    // ── Init ────────────────────────────────────────────────────────────────
    if (msg.type === "init") {
      const wasmUrl = new URL("/wasm/magick.wasm", self.location.origin);
      const res = await fetch(wasmUrl);
      if (!res.ok) throw new Error(`Failed to fetch /wasm/magick.wasm: ${res.status} ${res.statusText}`);
      const buffer = await res.arrayBuffer();
      await initializeImageMagickx64(new Uint8Array(buffer));
      post({ type: "ready" });

    // ── Load ─────────────────────────────────────────────────────────────────
    } else if (msg.type === "load") {
      original = new Uint8Array(msg.bytes);

      // Build a cached 900px preview source once, right at load time.
      // Preview renders will use this instead of re-decoding `original` each time.
      ImageMagick.read(original, (img) => {
        const w = img.width;
        const h = img.height;
        downscaleForPreview(img);

        // Encode the pre-scaled image as PNG and cache it
        img.write(MagickFormat.Png, (data) => {
          previewSource = data.slice();
        });

        post({ type: "loaded", id: msg.id, width: w, height: h });
      });

    // ── Cancel ───────────────────────────────────────────────────────────────
    } else if (msg.type === "cancel") {
      latestRenderId = msg.upToId;

    // ── Render ───────────────────────────────────────────────────────────────
    } else if (msg.type === "render") {
      if (!original) throw new Error("No image loaded");

      latestRenderId = msg.id;
      const myId = msg.id;

      const fmtKey = (msg.format ?? "png").toLowerCase();
      const [fmt, mime] = msg.preview
        ? [MagickFormat.Png, "image/png"]
        : (FORMAT_MAP[fmtKey] ?? FORMAT_MAP.png);

      // For preview: read from the pre-scaled source (900px PNG, fast decode).
      // For export: read from the full original (full resolution).
      const source = msg.preview && previewSource ? previewSource : original;

      ImageMagick.read(source, (img) => {
        if (myId !== latestRenderId) return; // stale

        // Export renders still need downscaling if original is huge
        if (!msg.preview) {
          // (no downscale — export at full resolution)
        }
        // Preview source is already 900px — no resize needed ✓

        // Apply operations — bail between each step if superseded
        for (const step of msg.steps) {
          if (myId !== latestRenderId) return; // stale mid-pipeline
          if (!step.enabled) continue;
          const op = OP_MAP[step.opId];
          if (op) {
            try {
              op.apply(img, step.params, { Percentage, NoiseType });
            } catch (opErr) {
              console.warn(`[Worker] op "${step.opId}" failed:`, opErr);
            }
          }
        }

        if (myId !== latestRenderId) return; // stale pre-encode

        if (!msg.preview && msg.quality) {
          img.quality = msg.quality;
        }

        img.write(fmt, (data) => {
          if (myId !== latestRenderId) return; // stale post-encode
          const copy = data.slice().buffer;
          post(
            { type: "rendered", id: msg.id, bytes: copy, width: img.width, height: img.height, mime },
            [copy]
          );
        });
      });
    }
  } catch (err: any) {
    post({
      type: "error",
      id: (msg as any).id ?? -1,
      message: String(err?.message ?? err),
    });
  }
};
