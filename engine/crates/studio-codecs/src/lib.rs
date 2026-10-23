use image::codecs::jpeg::JpegEncoder;
use image::codecs::png::PngEncoder;
use image::{ColorType, ImageEncoder, ImageReader};
use std::io::Cursor;
use studio_core::{EngineError, RgbaBuffer};

pub fn decode(bytes: &[u8]) -> Result<RgbaBuffer, EngineError> {
    let reader = ImageReader::new(Cursor::new(bytes))
        .with_guessed_format()
        .map_err(|e| EngineError::DecodeError(e.to_string()))?;

    let dynamic = reader
        .decode()
        .map_err(|e| EngineError::DecodeError(e.to_string()))?;

    let rgba = dynamic.to_rgba8();
    let (width, height) = rgba.dimensions();

    Ok(RgbaBuffer {
        width,
        height,
        data: rgba.into_raw(),
    })
}

pub fn encode_jpeg(buffer: &RgbaBuffer, quality: u8) -> Result<Vec<u8>, EngineError> {
    let mut out = Vec::new();
    let encoder = JpegEncoder::new_with_quality(&mut out, quality.clamp(1, 100));

    // Convert RGBA to RGB for JPEG
    let mut rgb = Vec::with_capacity((buffer.width * buffer.height * 3) as usize);
    for chunk in buffer.data.chunks_exact(4) {
        rgb.push(chunk[0]);
        rgb.push(chunk[1]);
        rgb.push(chunk[2]);
    }

    encoder
        .write_image(&rgb, buffer.width, buffer.height, ColorType::Rgb8.into())
        .map_err(|e| EngineError::EncodeError(e.to_string()))?;

    Ok(out)
}

pub fn encode_png(buffer: &RgbaBuffer) -> Result<Vec<u8>, EngineError> {
    let mut out = Vec::new();
    let encoder = PngEncoder::new(&mut out);

    encoder
        .write_image(&buffer.data, buffer.width, buffer.height, ColorType::Rgba8.into())
        .map_err(|e| EngineError::EncodeError(e.to_string()))?;

    Ok(out)
}
