/**
 * Resize by Weight Algorithm (Spec 4.6 & 5.5)
 * Binary-search quality and scale factors to reach a target byte size.
 */

export interface ResizeByWeightOptions {
  targetBytes: number;
  mode: "never-exceed" | "closest";
  tolerance?: number; // default 0.03 (3%)
  format: "jpeg" | "webp" | "avif" | "png";
  floorQuality?: number; // default 20
  onProgress?: (iteration: number, currentBytes: number, quality: number, scale: number) => void;
  isCancelled?: () => boolean;
}

export interface ResizeByWeightResult {
  achievedBytes: number;
  targetBytes: number;
  quality: number;
  scale: number;
  iterations: number;
  status: "success" | "closest" | "failed";
  message: string;
  resultBytes?: Uint8Array;
}

export interface EncodeCallback {
  (quality: number, scale: number, colors?: number): Promise<Uint8Array>;
}

export async function runResizeByWeight(
  encoder: EncodeCallback,
  options: ResizeByWeightOptions
): Promise<ResizeByWeightResult> {
  const {
    targetBytes,
    mode,
    tolerance = 0.03,
    format,
    floorQuality = 20,
    onProgress,
    isCancelled,
  } = options;

  let bestResult: { bytes: Uint8Array; size: number; q: number; s: number } | null = null;
  let closestResult: { bytes: Uint8Array; size: number; q: number; s: number } | null = null;
  let iterations = 0;
  const maxIterations = 14;

  const isLossy = format !== "png";

  if (isLossy) {
    // Phase 1: Keep scale 1.0, binary search quality between floorQuality and 100
    let lowQ = floorQuality;
    let highQ = 100;
    let currentScale = 1.0;

    for (let i = 0; i < 8; i++) {
      if (isCancelled?.()) throw new Error("cancelled");
      iterations++;
      const midQ = Math.round((lowQ + highQ) / 2);
      const encoded = await encoder(midQ, currentScale);
      const size = encoded.length;

      onProgress?.(iterations, size, midQ, currentScale);

      // Track closest overall
      if (!closestResult || Math.abs(size - targetBytes) < Math.abs(closestResult.size - targetBytes)) {
        closestResult = { bytes: encoded, size, q: midQ, s: currentScale };
      }

      // Track valid result meeting "never-exceed"
      if (size <= targetBytes) {
        if (!bestResult || size > bestResult.size) {
          bestResult = { bytes: encoded, size, q: midQ, s: currentScale };
        }
      }

      // Check within tolerance
      const diff = Math.abs(size - targetBytes) / targetBytes;
      if (diff <= tolerance) {
        if (mode === "closest" || size <= targetBytes) {
          return {
            achievedBytes: size,
            targetBytes,
            quality: midQ,
            scale: currentScale,
            iterations,
            status: "success",
            message: `Target reached within ${(diff * 100).toFixed(1)}% tolerance`,
            resultBytes: encoded,
          };
        }
      }

      if (size > targetBytes) {
        highQ = midQ - 1;
      } else {
        lowQ = midQ + 1;
      }

      if (lowQ > highQ) break;
    }

    // Phase 2: If lowest quality still exceeds target, binary-search scale factor at quality 80
    if ((!bestResult || bestResult.size > targetBytes) && iterations < maxIterations) {
      let lowScale = 0.1;
      let highScale = 0.95;
      const fixedQ = 80;

      while (iterations < maxIterations && highScale - lowScale > 0.05) {
        if (isCancelled?.()) throw new Error("cancelled");
        iterations++;
        const midScale = Number(((lowScale + highScale) / 2).toFixed(2));
        const encoded = await encoder(fixedQ, midScale);
        const size = encoded.length;

        onProgress?.(iterations, size, fixedQ, midScale);

        if (!closestResult || Math.abs(size - targetBytes) < Math.abs(closestResult.size - targetBytes)) {
          closestResult = { bytes: encoded, size, q: fixedQ, s: midScale };
        }

        if (size <= targetBytes) {
          if (!bestResult || size > bestResult.size) {
            bestResult = { bytes: encoded, size, q: fixedQ, s: midScale };
          }
        }

        const diff = Math.abs(size - targetBytes) / targetBytes;
        if (diff <= tolerance && (mode === "closest" || size <= targetBytes)) {
          return {
            achievedBytes: size,
            targetBytes,
            quality: fixedQ,
            scale: midScale,
            iterations,
            status: "success",
            message: `Target reached with scaling within ${(diff * 100).toFixed(1)}% tolerance`,
            resultBytes: encoded,
          };
        }

        if (size > targetBytes) {
          highScale = midScale;
        } else {
          lowScale = midScale;
        }
      }
    }
  } else {
    // Lossless (PNG): binary search palette size (256 down to 16) and scale
    let lowColors = 16;
    let highColors = 256;
    let scale = 1.0;

    for (let i = 0; i < 6; i++) {
      if (isCancelled?.()) throw new Error("cancelled");
      iterations++;
      const midColors = Math.round((lowColors + highColors) / 2);
      const encoded = await encoder(100, scale, midColors);
      const size = encoded.length;

      onProgress?.(iterations, size, 100, scale);

      if (!closestResult || Math.abs(size - targetBytes) < Math.abs(closestResult.size - targetBytes)) {
        closestResult = { bytes: encoded, size, q: 100, s: scale };
      }

      if (size <= targetBytes) {
        if (!bestResult || size > bestResult.size) {
          bestResult = { bytes: encoded, size, q: 100, s: scale };
        }
      }

      if (size > targetBytes) {
        highColors = midColors - 1;
      } else {
        lowColors = midColors + 1;
      }
      if (lowColors > highColors) break;
    }
  }

  // Return best compliant result or closest fallback
  if (mode === "never-exceed" && bestResult) {
    return {
      achievedBytes: bestResult.size,
      targetBytes,
      quality: bestResult.q,
      scale: bestResult.s,
      iterations,
      status: "success",
      message: `Optimal size found without exceeding ${targetBytes} bytes`,
      resultBytes: bestResult.bytes,
    };
  }

  if (closestResult) {
    return {
      achievedBytes: closestResult.size,
      targetBytes,
      quality: closestResult.q,
      scale: closestResult.s,
      iterations,
      status: "closest",
      message: `Closest achievable size: ${closestResult.size} bytes (${closestResult.size > targetBytes ? "exceeds" : "under"} target)`,
      resultBytes: closestResult.bytes,
    };
  }

  return {
    achievedBytes: 0,
    targetBytes,
    quality: floorQuality,
    scale: 1,
    iterations,
    status: "failed",
    message: "Could not achieve target size with current limits",
  };
}
