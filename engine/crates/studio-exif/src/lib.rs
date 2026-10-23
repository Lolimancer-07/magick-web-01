use studio_core::EngineError;

/// Losslessly strips APP1 (EXIF) and other metadata markers from a JPEG stream without touching scan data
pub fn strip_jpeg_exif(data: &[u8]) -> Result<Vec<u8>, EngineError> {
    if data.len() < 4 || data[0] != 0xFF || data[1] != 0xD8 {
        return Err(EngineError::DecodeError("Not a valid JPEG".into()));
    }

    let mut out = Vec::with_capacity(data.len());
    out.push(0xFF);
    out.push(0xD8); // SOI

    let mut pos = 2;
    while pos < data.len() {
        if data[pos] != 0xFF {
            // Raw scan data or byte stream, copy remainder
            out.extend_from_slice(&data[pos..]);
            break;
        }

        let marker = data[pos + 1];
        pos += 2;

        if marker == 0xD9 {
            // EOI
            out.push(0xFF);
            out.push(0xD9);
            break;
        }

        if marker == 0xDA {
            // SOS (Start of Scan), copy SOS marker and header length, then remainder
            out.push(0xFF);
            out.push(0xDA);
            out.extend_from_slice(&data[pos..]);
            break;
        }

        if pos + 2 > data.len() {
            break;
        }

        let len = ((data[pos] as usize) << 8) | (data[pos + 1] as usize);
        if pos + len > data.len() {
            break;
        }

        // Strip APP1 (0xE1: EXIF), APP2 (0xE2: FlashPix/ICC), APP13 (0xED: Photoshop), COM (0xFE: Comment)
        let is_metadata = marker == 0xE1 || marker == 0xFE || marker == 0xED;
        if !is_metadata {
            out.push(0xFF);
            out.push(marker);
            out.extend_from_slice(&data[pos..pos + len]);
        }

        pos += len;
    }

    Ok(out)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_strip_jpeg_exif() {
        // Construct minimal valid JPEG SOI + APP1 (EXIF) + SOS + scan data + EOI
        let jpeg = vec![
            0xFF, 0xD8, // SOI
            0xFF, 0xE1, 0x00, 0x08, b'E', b'x', b'i', b'f', 0x00, 0x00, // APP1 marker + 6-byte header
            0xFF, 0xDA, 0x00, 0x03, 0x01, // SOS marker + header
            0xAA, 0xBB, // scan data
            0xFF, 0xD9, // EOI
        ];

        let stripped = strip_jpeg_exif(&jpeg).unwrap();
        // APP1 (0xE1) marker should be stripped
        assert!(!stripped.windows(2).any(|w| w == [0xFF, 0xE1]));
        // SOI (0xFF, 0xD8) and EOI (0xFF, 0xD9) must be preserved
        assert_eq!(&stripped[..2], &[0xFF, 0xD8]);
        assert_eq!(&stripped[stripped.len() - 2..], &[0xFF, 0xD9]);
    }
}

