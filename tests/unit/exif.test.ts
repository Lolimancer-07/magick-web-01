import { describe, it, expect } from "vitest";
import {
  deleteJpegExif,
  editJpegExif,
  parseJpegExif,
  extractJpegScanData,
  deletePngMetadata,
  extractPngIdat,
  deleteWebpMetadata,
} from "@/utils/losslessExif";

describe("Lossless EXIF & Metadata Segment Editor (Spec 5.6)", () => {
  // Synthesize a valid minimal JPEG with SOI, APP1 (EXIF), DQT, SOF0, DHT, SOS, Scanlines, EOI
  function createTestJpeg(): Uint8Array {
    const parts: number[] = [
      0xff, 0xd8, // SOI
      // APP1 with Exif
      0xff, 0xe1, 0x00, 0x22, // length = 34
      0x45, 0x78, 0x69, 0x66, 0x00, 0x00, // "Exif\0\0"
      0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, // TIFF II, offset 8
      0x01, 0x00, // 1 entry
      0x12, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, // Orientation = 6
      0x00, 0x00, 0x00, 0x00, // next IFD = 0
      // DQT marker (0xFFDB)
      0xff, 0xdb, 0x00, 0x06, 0x00, 0x10, 0x20, 0x30,
      // SOF0 marker (0xFFC0)
      0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x64, 0x00, 0x64, 0x01, 0x01, 0x11, 0x00,
      // SOS marker (0xFFDA) with 50 bytes of pseudo-DCT entropy scanlines
      0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00,
      // SCANLINE DATA:
      0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
      0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
      0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00,
      0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
      // EOI
      0xff, 0xd9,
    ];
    return new Uint8Array(parts);
  }

  it("extractJpegScanData extracts SOS scanline bytes accurately", () => {
    const jpeg = createTestJpeg();
    const scanData = extractJpegScanData(jpeg);
    expect(scanData.length).toBeGreaterThan(30);
    expect(scanData[0]).toBe(0xff);
    expect(scanData[1]).toBe(0xda); // SOS marker
  });

  it("deleteJpegExif leaves scan data byte-for-byte identical (Zero recompression)", () => {
    const origJpeg = createTestJpeg();
    const origScan = extractJpegScanData(origJpeg);

    const strippedJpeg = deleteJpegExif(origJpeg, "all", false);
    const strippedScan = extractJpegScanData(strippedJpeg);

    // Byte-by-byte comparison of compressed image scan data
    expect(strippedScan.length).toBe(origScan.length);
    expect(Array.from(strippedScan)).toEqual(Array.from(origScan));
  });

  it("editJpegExif leaves scan data byte-for-byte identical", () => {
    const origJpeg = createTestJpeg();
    const origScan = extractJpegScanData(origJpeg);

    const editedJpeg = editJpegExif(origJpeg, {
      make: "Canon",
      model: "EOS R5",
      artist: "Magick Pair",
      orientation: 1,
    });
    const editedScan = extractJpegScanData(editedJpeg);

    // Verify scan data is untouched
    expect(editedScan.length).toBe(origScan.length);
    expect(Array.from(editedScan)).toEqual(Array.from(origScan));

    // Verify metadata was updated
    const parsed = parseJpegExif(editedJpeg);
    expect(parsed.make).toBe("Canon");
    expect(parsed.model).toBe("EOS R5");
    expect(parsed.artist).toBe("Magick Pair");
  });

  it("deletePngMetadata strips ancillary metadata while preserving IDAT pixel chunks byte-for-byte", () => {
    // Construct minimal PNG with IHDR, tEXt, IDAT, IEND
    const pngHeader = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    const ihdr = [
      0x00, 0x00, 0x00, 0x0d, // len 13
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00,
      0x90, 0x77, 0x53, 0xde, // CRC
    ];
    const textChunk = [
      0x00, 0x00, 0x00, 0x0b, // len 11
      0x74, 0x45, 0x58, 0x74, // tEXt
      0x41, 0x75, 0x74, 0x68, 0x6f, 0x72, 0x00, 0x55, 0x73, 0x65, 0x72, // Author\0User
      0x11, 0x22, 0x33, 0x44, // CRC
    ];
    const idatChunk = [
      0x00, 0x00, 0x00, 0x0c, // len 12
      0x49, 0x44, 0x41, 0x54, // IDAT
      0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, // pixel data
      0xaa, 0xbb, 0xcc, 0xdd, // CRC
    ];
    const iendChunk = [
      0x00, 0x00, 0x00, 0x00,
      0x49, 0x45, 0x4e, 0x44,
      0xae, 0x42, 0x60, 0x82,
    ];

    const fullPng = new Uint8Array([...pngHeader, ...ihdr, ...textChunk, ...idatChunk, ...iendChunk]);
    const origIdat = extractPngIdat(fullPng);

    const cleanPng = deletePngMetadata(fullPng);
    const cleanIdat = extractPngIdat(cleanPng);

    expect(cleanIdat.length).toBe(origIdat.length);
    expect(Array.from(cleanIdat)).toEqual(Array.from(origIdat));
    // Verify tEXt was removed
    const hasText = String.fromCharCode(...cleanPng).includes("tEXt");
    expect(hasText).toBe(false);
  });

  it("deleteWebpMetadata removes EXIF chunk from RIFF container", () => {
    // Construct minimal WebP RIFF
    const riffHeader = [0x52, 0x49, 0x46, 0x46, 0x20, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]; // RIFF 32 WEBP
    const exifChunk = [0x45, 0x58, 0x49, 0x46, 0x04, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04]; // EXIF len 4
    const vp8Chunk = [0x56, 0x50, 0x38, 0x20, 0x04, 0x00, 0x00, 0x00, 0xaa, 0xbb, 0xcc, 0xdd]; // VP8 len 4

    const webp = new Uint8Array([...riffHeader, ...exifChunk, ...vp8Chunk]);
    const clean = deleteWebpMetadata(webp);

    const hasExif = String.fromCharCode(...clean).includes("EXIF");
    const hasVp8 = String.fromCharCode(...clean).includes("VP8 ");
    expect(hasExif).toBe(false);
    expect(hasVp8).toBe(true);
  });
});
