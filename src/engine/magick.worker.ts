/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeImageMagickx64, ImageMagick, MagickFormat, Percentage, NoiseType } from "@imagemagick/magick-wasm";
import { OP_MAP } from "@/ops/definitions";
import type { WorkerRequest, WorkerResponse } from "./types";

let original: Uint8Array | null = null;
const post = (m: WorkerResponse, t?: Transferable[]) =>
  (self as any).postMessage(m, t ?? []);

const FORMAT_MAP: Record<string, [any, string]> = {
  png:  [MagickFormat.Png,  "image/png"],
  jpeg: [MagickFormat.Jpeg, "image/jpeg"],
  jpg:  [MagickFormat.Jpeg, "image/jpeg"],
  webp: [MagickFormat.WebP, "image/webp"],
};

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data;
  try {
    if (msg.type === "init") {
      const res = await fetch("/wasm/magick.wasm");
      if (!res.ok) {
        throw new Error(`Failed to fetch /wasm/magick.wasm: ${res.status} ${res.statusText}`);
      }
      const buffer = await res.arrayBuffer();
      const wasmBytes = new Uint8Array(buffer);
      await initializeImageMagickx64(wasmBytes);
      post({ type: "ready" });

    } else if (msg.type === "load") {
      original = new Uint8Array(msg.bytes);
      ImageMagick.read(original, (img) =>
        post({ type: "loaded", id: msg.id, width: img.width, height: img.height })
      );

    } else if (msg.type === "render") {
      if (!original) throw new Error("No image loaded");

      const fmtKey = (msg.format ?? "png").toLowerCase();
      const [fmt, mime] = msg.preview
        ? [MagickFormat.Png, "image/png"]
        : (FORMAT_MAP[fmtKey] ?? FORMAT_MAP.png);

      ImageMagick.read(original, (img) => {
        // Downscale preview for speed
        if (msg.preview) {
          const max = 1600;
          if (Math.max(img.width, img.height) > max) {
            const s = max / Math.max(img.width, img.height);
            img.resize(
              Math.max(1, Math.round(img.width * s)),
              Math.max(1, Math.round(img.height * s))
            );
          }
        }

        // Apply operations
        for (const step of msg.steps) {
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

        if (!msg.preview && msg.quality) {
          img.quality = msg.quality;
        }

        img.write(fmt, (data) => {
          const copy = data.slice().buffer;
          post(
            {
              type: "rendered",
              id: msg.id,
              bytes: copy,
              width: img.width,
              height: img.height,
              mime,
            },
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
