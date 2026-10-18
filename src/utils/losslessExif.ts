export interface ExifMetadata {
  dateTaken?: string;
  make?: string;
  model?: string;
  lensModel?: string;
  exposureTime?: string;
  fNumber?: string;
  iso?: number;
  orientation?: number;
  artist?: string;
  copyright?: string;
  description?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
}

export type DeleteExifMode = "all" | "onlyGps" | "onlyExifKeepIcc";

// ── CRC32 for PNG ──
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c;
}

function crc32(buf: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// ── JPEG Segment Parser & Lossless Stripper ──

export interface JpegScanExtraction {
  headerBytes: Uint8Array;
  scanDataBytes: Uint8Array; // from SOS marker (0xFFDA) to EOI (0xFFD9)
}

export function extractJpegScanData(jpegBytes: Uint8Array): Uint8Array {
  let offset = 2; // skip SOI
  while (offset < jpegBytes.length) {
    if (jpegBytes[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = jpegBytes[offset + 1];
    if (marker === 0xda) {
      // SOS marker reached!
      return jpegBytes.slice(offset);
    }
    if (marker === 0xd9) break; // EOI
    if (marker === 0x00 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const len = (jpegBytes[offset + 2] << 8) | jpegBytes[offset + 3];
    offset += 2 + len;
  }
  return new Uint8Array(0);
}

export function deleteJpegExif(
  bytes: Uint8Array,
  mode: DeleteExifMode = "all",
  preserveOrientation = true
): Uint8Array {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error("Invalid JPEG: missing SOI marker (0xFFD8)");
  }

  // Extract orientation tag if we need to preserve it
  let existingOrientation = 1;
  if (preserveOrientation) {
    const meta = parseJpegExif(bytes);
    if (meta.orientation) existingOrientation = meta.orientation;
  }

  const chunks: Uint8Array[] = [new Uint8Array([0xff, 0xd8])];
  let offset = 2;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = bytes[offset + 1];

    // Check if we hit SOS (Start of Scan)
    if (marker === 0xda) {
      // Copy entire remainder of file (SOS header + scanlines + EOI) verbatim
      chunks.push(bytes.slice(offset));
      break;
    }

    if (marker === 0xd9) {
      chunks.push(bytes.slice(offset, offset + 2));
      break;
    }

    // Standalone markers
    if (marker === 0x00 || (marker >= 0xd0 && marker <= 0xd7)) {
      chunks.push(bytes.slice(offset, offset + 2));
      offset += 2;
      continue;
    }

    const len = (bytes[offset + 2] << 8) | bytes[offset + 3];
    const segment = bytes.slice(offset, offset + 2 + len);

    let keepSegment = true;

    if (marker === 0xe1) {
      // APP1: EXIF or XMP
      if (mode === "all" || mode === "onlyExifKeepIcc") {
        keepSegment = false;
      } else if (mode === "onlyGps") {
        // Strip GPS from APP1
        const strippedApp1 = stripGpsFromApp1(segment);
        chunks.push(strippedApp1);
        offset += 2 + len;
        continue;
      }
    } else if (marker === 0xed) {
      // APP13: Photoshop IRB / IPTC
      if (mode === "all" || mode === "onlyExifKeepIcc") {
        keepSegment = false;
      }
    } else if (marker === 0xfe) {
      // COM: Comment
      if (mode === "all") keepSegment = false;
    } else if (marker === 0xe2) {
      // APP2: ICC Color Profile
      if (mode === "all") keepSegment = false;
      // In onlyExifKeepIcc mode, keepSegment remains true ✓
    }

    if (keepSegment) {
      chunks.push(segment);
    }

    offset += 2 + len;
  }

  // If preserving orientation and APP1 was removed, inject minimal orientation-only APP1
  if (preserveOrientation && existingOrientation > 1 && (mode === "all" || mode === "onlyExifKeepIcc")) {
    const orientationApp1 = createMinimalOrientationApp1(existingOrientation);
    // Insert right after SOI
    chunks.splice(1, 0, orientationApp1);
  }

  // Assemble final bytes
  return concatenateBuffers(chunks);
}

/**
 * Losslessly parse common EXIF tags from JPEG APP1
 */
export function parseJpegExif(bytes: Uint8Array): ExifMetadata {
  const meta: ExifMetadata = {};
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return meta;

  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = bytes[offset + 1];
    if (marker === 0xda || marker === 0xd9) break;

    const len = (bytes[offset + 2] << 8) | bytes[offset + 3];

    // Check APP1 (0xE1)
    if (marker === 0xe1 && len > 14) {
      const headerStr = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
      if (headerStr === "Exif") {
        parseTiffBlock(bytes.slice(offset + 10, offset + 2 + len), meta);
      }
    }
    offset += 2 + len;
  }
  return meta;
}

/**
 * Losslessly edit / rewrite EXIF tags in a JPEG file.
 * Scan data remains 100% byte-for-byte untouched.
 */
export function editJpegExif(bytes: Uint8Array, newMeta: ExifMetadata): Uint8Array {
  // First strip existing APP1
  const cleanJpeg = deleteJpegExif(bytes, "onlyExifKeepIcc", false);

  // Build new APP1 segment containing newMeta
  const newApp1 = buildApp1Segment(newMeta);

  // Splice new APP1 immediately after SOI (bytes 0..1)
  const chunks: Uint8Array[] = [
    cleanJpeg.slice(0, 2), // SOI
    newApp1,               // New APP1 segment
    cleanJpeg.slice(2),    // All other segments + SOS + Scanlines
  ];

  return concatenateBuffers(chunks);
}

// ── PNG Lossless Chunk Editor ──

const PNG_SIG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function deletePngMetadata(bytes: Uint8Array): Uint8Array {
  for (let i = 0; i < 8; i++) {
    if (bytes[i] !== PNG_SIG[i]) throw new Error("Invalid PNG signature");
  }

  const chunks: Uint8Array[] = [PNG_SIG];
  let offset = 8;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  // Dropped metadata chunk types
  const METADATA_TYPES = new Set(["eXIf", "tEXt", "iTXt", "zTXt", "tIME"]);

  while (offset < bytes.length) {
    const len = view.getUint32(offset);
    const typeStr = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
    const totalChunkLen = 12 + len; // 4 len + 4 type + data + 4 crc

    if (!METADATA_TYPES.has(typeStr)) {
      chunks.push(bytes.slice(offset, offset + totalChunkLen));
    }
    offset += totalChunkLen;
  }

  return concatenateBuffers(chunks);
}

/**
 * Extract combined IDAT pixel bytes from PNG for verification tests
 */
export function extractPngIdat(bytes: Uint8Array): Uint8Array {
  const idats: Uint8Array[] = [];
  let offset = 8;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  while (offset < bytes.length) {
    const len = view.getUint32(offset);
    const typeStr = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
    if (typeStr === "IDAT") {
      idats.push(bytes.slice(offset + 8, offset + 8 + len));
    }
    offset += 12 + len;
  }
  return concatenateBuffers(idats);
}

// ── WebP Lossless RIFF Editor ──

export function deleteWebpMetadata(bytes: Uint8Array): Uint8Array {
  const headerStr = String.fromCharCode(...bytes.slice(0, 4));
  const formatStr = String.fromCharCode(...bytes.slice(8, 12));
  if (headerStr !== "RIFF" || formatStr !== "WEBP") {
    throw new Error("Invalid WebP container");
  }

  const chunks: Uint8Array[] = [];
  let offset = 12;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  while (offset < bytes.length) {
    const fourCC = String.fromCharCode(...bytes.slice(offset, offset + 4));
    const size = view.getUint32(offset + 4, true);
    const paddedSize = size + (size % 2);
    const totalLen = 8 + paddedSize;

    if (fourCC === "EXIF" || fourCC === "XMP ") {
      // Drop metadata chunk
    } else if (fourCC === "VP8X") {
      // Modify VP8X chunk flags: clear EXIF (bit 3) and XMP (bit 2)
      const chunkCopy = bytes.slice(offset, offset + totalLen);
      chunkCopy[8] = chunkCopy[8] & ~0x18; // clear bits 3 and 4
      chunks.push(chunkCopy);
    } else {
      chunks.push(bytes.slice(offset, offset + totalLen));
    }
    offset += totalLen;
  }

  const body = concatenateBuffers(chunks);
  const newRiff = new Uint8Array(12 + body.length);
  newRiff.set(bytes.slice(0, 4), 0); // "RIFF"
  const riffView = new DataView(newRiff.buffer);
  riffView.setUint32(4, 4 + body.length, true);
  newRiff.set(bytes.slice(8, 12), 8); // "WEBP"
  newRiff.set(body, 12);
  return newRiff;
}

// ── TIFF / Helper Routines ──

function parseTiffBlock(tiffBytes: Uint8Array, meta: ExifMetadata) {
  if (tiffBytes.length < 8) return;
  const isLE = tiffBytes[0] === 0x49 && tiffBytes[1] === 0x49; // "II" vs "MM"
  const view = new DataView(tiffBytes.buffer, tiffBytes.byteOffset, tiffBytes.byteLength);

  const ifd0Offset = view.getUint32(4, isLE);
  if (ifd0Offset >= tiffBytes.length) return;

  parseIfd(tiffBytes, view, ifd0Offset, isLE, meta, false);
}

function parseIfd(
  tiffBytes: Uint8Array,
  view: DataView,
  ifdOffset: number,
  isLE: boolean,
  meta: ExifMetadata,
  isGps: boolean
) {
  if (ifdOffset + 2 > tiffBytes.length) return;
  const numEntries = view.getUint16(ifdOffset, isLE);
  let p = ifdOffset + 2;

  for (let i = 0; i < numEntries; i++) {
    if (p + 12 > tiffBytes.length) break;
    const tag = view.getUint16(p, isLE);
    const type = view.getUint16(p + 2, isLE);
    const count = view.getUint32(p + 4, isLE);
    const valueOrOffset = view.getUint32(p + 8, isLE);

    if (isGps) {
      if (tag === 0x0002) {
        // Latitude
        meta.gpsLatitude = parseGpsCoord(tiffBytes, view, valueOrOffset, isLE);
      } else if (tag === 0x0004) {
        // Longitude
        meta.gpsLongitude = parseGpsCoord(tiffBytes, view, valueOrOffset, isLE);
      }
    } else {
      switch (tag) {
        case 0x010f: // Make
          meta.make = readAscii(tiffBytes, valueOrOffset, count);
          break;
        case 0x0110: // Model
          meta.model = readAscii(tiffBytes, valueOrOffset, count);
          break;
        case 0x0112: // Orientation
          meta.orientation = view.getUint16(p + 8, isLE);
          break;
        case 0x010e: // Description
          meta.description = readAscii(tiffBytes, valueOrOffset, count);
          break;
        case 0x013b: // Artist
          meta.artist = readAscii(tiffBytes, valueOrOffset, count);
          break;
        case 0x8298: // Copyright
          meta.copyright = readAscii(tiffBytes, valueOrOffset, count);
          break;
        case 0x9003: // Date Taken
        case 0x0132: // Modify Date
          if (!meta.dateTaken) meta.dateTaken = readAscii(tiffBytes, valueOrOffset, count);
          break;
        case 0x8769: // Exif IFD Pointer
          parseIfd(tiffBytes, view, valueOrOffset, isLE, meta, false);
          break;
        case 0x8825: // GPS IFD Pointer
          parseIfd(tiffBytes, view, valueOrOffset, isLE, meta, true);
          break;
      }
    }
    p += 12;
  }
}

function parseGpsCoord(tiffBytes: Uint8Array, view: DataView, offset: number, isLE: boolean): number | undefined {
  if (offset + 24 > tiffBytes.length) return undefined;
  const degNum = view.getUint32(offset, isLE);
  const degDen = view.getUint32(offset + 4, isLE) || 1;
  const minNum = view.getUint32(offset + 8, isLE);
  const minDen = view.getUint32(offset + 12, isLE) || 1;
  const secNum = view.getUint32(offset + 16, isLE);
  const secDen = view.getUint32(offset + 20, isLE) || 1;

  return degNum / degDen + minNum / minDen / 60 + secNum / secDen / 3600;
}

function readAscii(tiffBytes: Uint8Array, offset: number, count: number): string {
  if (offset + count > tiffBytes.length) return "";
  const slice = tiffBytes.slice(offset, offset + count);
  return String.fromCharCode(...slice).replace(/\0+$/, "").trim();
}

/**
 * Remove GPS IFD tag from APP1 segment
 */
function stripGpsFromApp1(app1Bytes: Uint8Array): Uint8Array {
  // Parse and zero the GPS pointer tag (0x8825) if present
  const copy = app1Bytes.slice();
  const tiff = copy.slice(10);
  if (tiff.length < 8) return copy;

  const isLE = tiff[0] === 0x49;
  const view = new DataView(tiff.buffer, tiff.byteOffset, tiff.byteLength);
  const ifd0 = view.getUint32(4, isLE);
  if (ifd0 + 2 > tiff.length) return copy;

  const entries = view.getUint16(ifd0, isLE);
  let p = ifd0 + 2;

  for (let i = 0; i < entries; i++) {
    if (p + 12 > tiff.length) break;
    const tag = view.getUint16(p, isLE);
    if (tag === 0x8825) {
      // Overwrite tag to undefined/padding (0x0000)
      view.setUint16(p, 0x0000, isLE);
      view.setUint32(p + 8, 0x0000, isLE);
      break;
    }
    p += 12;
  }
  return copy;
}

function createMinimalOrientationApp1(orientation: number): Uint8Array {
  // Construct minimal valid APP1 segment with only Orientation tag
  // 2 bytes 0xFFE1 + 2 bytes len + "Exif\0\0" (6) + TIFF II header (8) + 1 entry (12) + next IFD (4)
  const len = 34;
  const buf = new Uint8Array(len);
  const v = new DataView(buf.buffer);

  buf[0] = 0xff;
  buf[1] = 0xe1;
  v.setUint16(2, len - 2); // 32
  buf.set([0x45, 0x78, 0x69, 0x66, 0x00, 0x00], 4); // "Exif\0\0"

  const t = 10;
  buf[t] = 0x49; // 'I'
  buf[t + 1] = 0x49; // 'I'
  v.setUint16(t + 2, 0x002a, true); // 42
  v.setUint32(t + 4, 8, true); // IFD0 offset

  const ifd = t + 8;
  v.setUint16(ifd, 1, true); // 1 entry
  v.setUint16(ifd + 2, 0x0112, true); // Tag: Orientation
  v.setUint16(ifd + 4, 3, true); // Type: SHORT
  v.setUint32(ifd + 6, 1, true); // Count: 1
  v.setUint16(ifd + 10, orientation, true); // Value
  v.setUint32(ifd + 14, 0, true); // Next IFD = 0
  return buf;
}

function buildApp1Segment(meta: ExifMetadata): Uint8Array {
  // Build a clean, well-formed TIFF APP1 segment
  const entries: { tag: number; type: number; count: number; valOrOffset: number }[] = [];
  const stringData: { offset: number; bytes: Uint8Array }[] = [];

  // Start with orientation
  const orient = meta.orientation ?? 1;
  entries.push({ tag: 0x0112, type: 3, count: 1, valOrOffset: orient });

  // Calculate base offsets
  // TIFF header (8) + numEntries (2) + entries (12 * N) + nextIFD (4)
  let currentStringOffset = 8 + 2 + (entries.length + 5) * 12 + 4; // reserve room for up to 6 entries

  const addAscii = (tag: number, str?: string) => {
    if (!str) return;
    const bytes = new TextEncoder().encode(str + "\0");
    entries.push({ tag, type: 2, count: bytes.length, valOrOffset: currentStringOffset });
    stringData.push({ offset: currentStringOffset, bytes });
    currentStringOffset += bytes.length;
  };

  addAscii(0x010f, meta.make);
  addAscii(0x0110, meta.model);
  addAscii(0x010e, meta.description);
  addAscii(0x013b, meta.artist);
  addAscii(0x8298, meta.copyright);
  addAscii(0x9003, meta.dateTaken);

  // Total TIFF payload size
  const tiffSize = currentStringOffset;
  const app1Len = 2 + 2 + 6 + tiffSize; // 0xFFE1 + length(2) + "Exif\0\0"(6) + TIFF
  const buf = new Uint8Array(app1Len);
  const view = new DataView(buf.buffer);

  buf[0] = 0xff;
  buf[1] = 0xe1;
  view.setUint16(2, app1Len - 2);
  buf.set([0x45, 0x78, 0x69, 0x66, 0x00, 0x00], 4);

  const tiffStart = 10;
  // Little-Endian "II"
  buf[tiffStart] = 0x49;
  buf[tiffStart + 1] = 0x49;
  view.setUint16(tiffStart + 2, 42, true);
  view.setUint32(tiffStart + 4, 8, true);

  const ifd0 = tiffStart + 8;
  view.setUint16(ifd0, entries.length, true);

  let p = ifd0 + 2;
  for (const entry of entries) {
    view.setUint16(p, entry.tag, true);
    view.setUint16(p + 2, entry.type, true);
    view.setUint32(p + 4, entry.count, true);
    if (entry.type === 3) {
      view.setUint16(p + 8, entry.valOrOffset, true);
      view.setUint16(p + 10, 0, true);
    } else {
      view.setUint32(p + 8, entry.valOrOffset, true);
    }
    p += 12;
  }
  view.setUint32(p, 0, true); // End of IFD0

  // Write string data payloads
  for (const item of stringData) {
    buf.set(item.bytes, tiffStart + item.offset);
  }

  return buf;
}

function concatenateBuffers(buffers: Uint8Array[]): Uint8Array {
  let totalLen = 0;
  for (const b of buffers) totalLen += b.length;
  const result = new Uint8Array(totalLen);
  let pos = 0;
  for (const b of buffers) {
    result.set(b, pos);
    pos += b.length;
  }
  return result;
}
