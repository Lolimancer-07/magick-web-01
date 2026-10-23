use rayon::prelude::*;
use studio_core::{EngineError, RgbaBuffer};

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum ResizeFilter {
    Nearest,
    Bilinear,
    Bicubic,
    Lanczos3,
    Mitchell,
    CatmullRom,
}

pub fn resize(
    src: &RgbaBuffer,
    dst_w: u32,
    dst_h: u32,
    _filter: ResizeFilter,
) -> Result<RgbaBuffer, EngineError> {
    if dst_w == 0 || dst_h == 0 {
        return Err(EngineError::InvalidParameters("Dimensions must be > 0".into()));
    }

    let mut dst = RgbaBuffer::new(dst_w, dst_h);
    let x_ratio = (src.width as f32) / (dst_w as f32);
    let y_ratio = (src.height as f32) / (dst_h as f32);

    // High performance bilinear resampler across threads
    dst.data
        .par_chunks_exact_mut((dst_w as usize) * 4)
        .enumerate()
        .for_each(|(y, row)| {
            let src_y = (y as f32) * y_ratio;
            let y1 = (src_y.floor() as u32).min(src.height - 1);
            let y2 = (y1 + 1).min(src.height - 1);
            let y_diff = src_y - (y1 as f32);

            for x in 0..(dst_w as usize) {
                let src_x = (x as f32) * x_ratio;
                let x1 = (src_x.floor() as u32).min(src.width - 1);
                let x2 = (x1 + 1).min(src.width - 1);
                let x_diff = src_x - (x1 as f32);

                let p11 = ((y1 * src.width + x1) * 4) as usize;
                let p12 = ((y1 * src.width + x2) * 4) as usize;
                let p21 = ((y2 * src.width + x1) * 4) as usize;
                let p22 = ((y2 * src.width + x2) * 4) as usize;

                let row_offset = x * 4;
                for c in 0..4 {
                    let v11 = src.data[p11 + c] as f32;
                    let v12 = src.data[p12 + c] as f32;
                    let v21 = src.data[p21 + c] as f32;
                    let v22 = src.data[p22 + c] as f32;

                    let top = v11 + (v12 - v11) * x_diff;
                    let bottom = v21 + (v22 - v21) * x_diff;
                    let val = top + (bottom - top) * y_diff;

                    row[row_offset + c] = val.round().clamp(0.0, 255.0) as u8;
                }
            }
        });

    Ok(dst)
}

pub fn rotate_90(src: &RgbaBuffer) -> RgbaBuffer {
    let mut dst = RgbaBuffer::new(src.height, src.width);
    for y in 0..src.height {
        for x in 0..src.width {
            let src_idx = ((y * src.width + x) * 4) as usize;
            let dst_x = src.height - 1 - y;
            let dst_y = x;
            let dst_idx = ((dst_y * dst.width + dst_x) * 4) as usize;
            dst.data[dst_idx..dst_idx + 4].copy_from_slice(&src.data[src_idx..src_idx + 4]);
        }
    }
    dst
}

pub fn flip_horizontal(src: &RgbaBuffer) -> RgbaBuffer {
    let mut dst = RgbaBuffer::new(src.width, src.height);
    for y in 0..src.height {
        for x in 0..src.width {
            let src_idx = ((y * src.width + x) * 4) as usize;
            let dst_x = src.width - 1 - x;
            let dst_idx = ((y * dst.width + dst_x) * 4) as usize;
            dst.data[dst_idx..dst_idx + 4].copy_from_slice(&src.data[src_idx..src_idx + 4]);
        }
    }
    dst
}

pub fn adjust_tonal(
    src: &mut RgbaBuffer,
    brightness: f32, // -100 to 100
    contrast: f32,   // -100 to 100
    saturation: f32, // -100 to 100
) {
    let b_offset = brightness * 2.55;
    let factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
    let sat_factor = 1.0 + (saturation / 100.0);

    src.data.par_chunks_exact_mut(4).for_each(|pixel| {
        let mut r = pixel[0] as f32;
        let mut g = pixel[1] as f32;
        let mut b = pixel[2] as f32;

        // Contrast & Brightness
        r = factor * (r - 128.0) + 128.0 + b_offset;
        g = factor * (g - 128.0) + 128.0 + b_offset;
        b = factor * (b - 128.0) + 128.0 + b_offset;

        // Saturation
        let gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
        r = gray + sat_factor * (r - gray);
        g = gray + sat_factor * (g - gray);
        b = gray + sat_factor * (b - gray);

        pixel[0] = r.round().clamp(0.0, 255.0) as u8;
        pixel[1] = g.round().clamp(0.0, 255.0) as u8;
        pixel[2] = b.round().clamp(0.0, 255.0) as u8;
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_resize_bilinear() {
        let src = RgbaBuffer {
            width: 2,
            height: 2,
            data: vec![
                255, 0, 0, 255,   0, 255, 0, 255,
                0, 0, 255, 255,   255, 255, 255, 255
            ],
        };
        let resized = resize(&src, 4, 4, ResizeFilter::Bilinear).unwrap();
        assert_eq!(resized.width, 4);
        assert_eq!(resized.height, 4);
        assert_eq!(resized.data.len(), 4 * 4 * 4);
    }

    #[test]
    fn test_rotate_90() {
        let src = RgbaBuffer {
            width: 2,
            height: 1,
            data: vec![
                255, 0, 0, 255,   0, 255, 0, 255
            ],
        };
        let rotated = rotate_90(&src);
        assert_eq!(rotated.width, 1);
        assert_eq!(rotated.height, 2);
    }

    #[test]
    fn test_tonal_adjustments() {
        let mut buf = RgbaBuffer {
            width: 1,
            height: 1,
            data: vec![128, 128, 128, 255],
        };
        adjust_tonal(&mut buf, 10.0, 0.0, 0.0);
        assert!(buf.data[0] > 128);
    }
}

