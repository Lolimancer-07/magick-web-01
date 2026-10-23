package com.magickstudio.app.core.engine

enum class ImageFormat(val extension: String, val mimeType: String, val displayName: String) {
    JPEG("jpg", "image/jpeg", "JPEG"),
    PNG("png", "image/png", "PNG"),
    WEBP("webp", "image/webp", "WebP"),
    AVIF("avif", "image/avif", "AVIF"),
    GIF("gif", "image/gif", "GIF"),
    BMP("bmp", "image/bmp", "BMP")
}

enum class ResizeType(val displayName: String) {
    PIXELS("Pixels"),
    PERCENTAGE("Percentage"),
    TARGET_WEIGHT("Target Size")
}

enum class ScaleMode(val displayName: String) {
    FIT("Fit (Pad)"),
    FILL("Fill (Crop)"),
    STRETCH("Exact Stretch"),
    SHRINK_ONLY("Shrink Only")
}

data class FilterSettings(
    val brightness: Float = 0f, // -100 to 100
    val contrast: Float = 0f,   // -100 to 100
    val saturation: Float = 0f, // -100 to 100
    val blur: Float = 0f,       // 0 to 25
    val sharpen: Float = 0f,    // 0 to 100
    val rotation: Float = 0f,   // 0, 90, 180, 270
    val flipH: Boolean = false,
    val flipV: Boolean = false,
    val grayscale: Boolean = false,
    val invert: Boolean = false,
    val sepia: Boolean = false
)

data class ExportSettings(
    val format: ImageFormat = ImageFormat.JPEG,
    val quality: Int = 85,
    val width: Int = 0,
    val height: Int = 0,
    val backgroundColorHex: String = "none",
    val stripExif: Boolean = false,
    val resizeType: ResizeType = ResizeType.PIXELS,
    val scaleMode: ScaleMode = ScaleMode.FIT
)

data class SizeEstimate(
    val originalSizeBytes: Long,
    val estimatedSizeBytes: Long,
    val width: Int,
    val height: Int
)
