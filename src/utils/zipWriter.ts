
// CRC32 Table
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

export interface ZipFileInput {
  name: string;
  data: Uint8Array;
}

export function createZip(files: ZipFileInput[]): Blob {
  const parts: Uint8Array[] = [];
  const centralDirParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const dataBytes = file.data;
    const fileCrc = crc32(dataBytes);
    const uncompressedSize = dataBytes.length;
    const compressedSize = dataBytes.length;

    // ── Local File Header (30 bytes + nameLen) ──
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lhView = new DataView(localHeader.buffer);

    lhView.setUint32(0, 0x04034b50, true); // Local file header signature
    lhView.setUint16(4, 20, true);         // Version needed to extract (2.0)
    lhView.setUint16(6, 0, true);          // General purpose bit flag
    lhView.setUint16(8, 0, true);          // Compression method (0 = Store)
    lhView.setUint16(10, 0, true);         // File last mod time
    lhView.setUint16(12, 0, true);         // File last mod date
    lhView.setUint32(14, fileCrc, true);   // CRC-32
    lhView.setUint32(18, compressedSize, true); // Compressed size
    lhView.setUint32(22, uncompressedSize, true); // Uncompressed size
    lhView.setUint16(26, nameBytes.length, true); // File name length
    lhView.setUint16(28, 0, true);         // Extra field length
    localHeader.set(nameBytes, 30);

    parts.push(localHeader);
    parts.push(dataBytes);

    // ── Central Directory File Header (46 bytes + nameLen) ──
    const cdHeader = new Uint8Array(46 + nameBytes.length);
    const cdView = new DataView(cdHeader.buffer);

    cdView.setUint32(0, 0x02014b50, true); // Central directory header signature
    cdView.setUint16(4, 20, true);         // Version made by
    cdView.setUint16(6, 20, true);         // Version needed to extract
    cdView.setUint16(8, 0, true);          // General purpose bit flag
    cdView.setUint16(10, 0, true);         // Compression method (0 = Store)
    cdView.setUint16(12, 0, true);         // Last mod time
    cdView.setUint16(14, 0, true);         // Last mod date
    cdView.setUint32(16, fileCrc, true);   // CRC-32
    cdView.setUint32(20, compressedSize, true); // Compressed size
    cdView.setUint32(24, uncompressedSize, true); // Uncompressed size
    cdView.setUint16(28, nameBytes.length, true); // File name length
    cdView.setUint16(30, 0, true);         // Extra field length
    cdView.setUint16(32, 0, true);         // Comment length
    cdView.setUint16(34, 0, true);         // Disk number start
    cdView.setUint16(36, 0, true);         // Internal file attributes
    cdView.setUint32(38, 0, true);         // External file attributes
    cdView.setUint32(42, offset, true);    // Relative offset of local header
    cdHeader.set(nameBytes, 46);

    centralDirParts.push(cdHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const centralDirStart = offset;
  let centralDirSize = 0;
  for (const p of centralDirParts) {
    centralDirSize += p.length;
    parts.push(p);
  }

  // ── End of Central Directory Record (22 bytes) ──
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);

  eocdView.setUint32(0, 0x06054b50, true); // EOCD signature
  eocdView.setUint16(4, 0, true);          // Disk number
  eocdView.setUint16(6, 0, true);          // Disk where central directory starts
  eocdView.setUint16(8, files.length, true); // Entries on this disk
  eocdView.setUint16(10, files.length, true); // Total entries
  eocdView.setUint32(12, centralDirSize, true); // Size of central directory
  eocdView.setUint32(16, centralDirStart, true); // Offset of central directory
  eocdView.setUint16(20, 0, true);         // Comment length

  parts.push(eocd);

  return new Blob(parts as BlobPart[], { type: "application/zip" });
}

/** Trigger client-side browser file download */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
