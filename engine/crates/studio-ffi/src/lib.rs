pub use studio_codecs as codecs;
pub use studio_core as core;
pub use studio_exif as exif;
pub use studio_ops as ops;

use core::RgbaBuffer;

#[no_mangle]
pub extern "C" fn studio_engine_version() -> *const std::os::raw::c_char {
    c"1.0.0".as_ptr()
}

#[no_mangle]
pub extern "C" fn studio_probe_capabilities() -> u32 {
    // Bitmask: 1 = SSE/NEON SIMD, 2 = Multithreaded, 4 = Lossless EXIF
    1 | 2 | 4
}

/// Simple C-compatible FFI entry point for fast image resizing
#[no_mangle]
pub extern "C" fn studio_resize_rgba(
    src_ptr: *const u8,
    src_w: u32,
    src_h: u32,
    dst_w: u32,
    dst_h: u32,
    dst_out: *mut u8,
) -> i32 {
    if src_ptr.is_null() || dst_out.is_null() || src_w == 0 || src_h == 0 || dst_w == 0 || dst_h == 0 {
        return -1;
    }

    let src_slice = unsafe {
        std::slice::from_raw_parts(src_ptr, (src_w * src_h * 4) as usize)
    };

    let buffer = RgbaBuffer {
        width: src_w,
        height: src_h,
        data: src_slice.to_vec(),
    };

    match ops::resize(&buffer, dst_w, dst_h, ops::ResizeFilter::Bilinear) {
        Ok(result) => {
            unsafe {
                std::ptr::copy_nonoverlapping(result.data.as_ptr(), dst_out, result.data.len());
            }
            0
        }
        Err(_) => -2,
    }
}
