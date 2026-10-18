import { describe, it, expect } from "vitest";
import { runResizeByWeight, EncodeCallback } from "@/utils/resizeByWeight";
import { computeBatchRenameList } from "@/utils/batchRename";

describe("Algorithms: Resize by Weight & Batch Rename", () => {
  it("Resize by Weight: finds optimal quality for target size within tolerance", async () => {
    // Mock encoder: size increases monotonically with quality
    const mockEncoder: EncodeCallback = async (quality, scale) => {
      // Model size: scale^2 * (10,000 + quality * 1,000) bytes
      const base = 10000 + quality * 1000;
      const size = Math.round(base * scale * scale);
      return new Uint8Array(size);
    };

    const targetBytes = 50000;
    const result = await runResizeByWeight(mockEncoder, {
      targetBytes,
      mode: "never-exceed",
      tolerance: 0.05,
      format: "jpeg",
    });

    expect(result.achievedBytes).toBeLessThanOrEqual(targetBytes);
    expect(result.achievedBytes).toBeGreaterThan(45000);
    expect(result.status).toBe("success");
    expect(result.quality).toBeGreaterThanOrEqual(20);
    expect(result.quality).toBeLessThanOrEqual(100);
  });

  it("Resize by Weight: falls back to downscaling when minimum quality exceeds target", async () => {
    // Mock encoder where even quality 20 at scale 1.0 is 100,000 bytes
    const mockEncoder: EncodeCallback = async (quality, scale) => {
      const base = 50000 + quality * 2500; // at q=20, base = 100,000
      const size = Math.round(base * scale * scale);
      return new Uint8Array(size);
    };

    const targetBytes = 25000;
    const result = await runResizeByWeight(mockEncoder, {
      targetBytes,
      mode: "never-exceed",
      tolerance: 0.05,
      format: "jpeg",
    });

    expect(result.achievedBytes).toBeLessThanOrEqual(targetBytes);
    expect(result.scale).toBeLessThan(1.0);
    expect(result.status).toBe("success");
  });

  it("Batch Rename: evaluates tokens and handles duplicate conflicts with auto-suffix", () => {
    const files = [
      { name: "IMG_001.JPG", width: 1920, height: 1080 },
      { name: "IMG_002.JPG", width: 1920, height: 1080 },
      { name: "IMG_003.JPG", width: 1920, height: 1080 },
    ];

    // Case 1: Sequential indexing
    const results = computeBatchRenameList(files, "vacation_{index}", {
      start: 1,
      step: 1,
      padding: 3,
    });

    expect(results[0].conflictResolvedName).toBe("vacation_001.JPG");
    expect(results[1].conflictResolvedName).toBe("vacation_002.JPG");
    expect(results[2].conflictResolvedName).toBe("vacation_003.JPG");
    expect(results[0].hasConflict).toBe(false);

    // Case 2: Conflict handling when pattern causes duplicates
    const duplicatePattern = computeBatchRenameList(files, "photo", {});
    expect(duplicatePattern[0].conflictResolvedName).toBe("photo.JPG");
    expect(duplicatePattern[1].conflictResolvedName).toBe("photo(1).JPG");
    expect(duplicatePattern[2].conflictResolvedName).toBe("photo(2).JPG");
    expect(duplicatePattern[1].hasConflict).toBe(true);
  });
});
