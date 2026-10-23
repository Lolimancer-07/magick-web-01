package com.magickstudio.app.core.engine

import android.content.ContentValues
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Matrix
import android.graphics.Paint
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import kotlin.math.roundToInt

object PlatformEngine {

    suspend fun loadBitmap(context: Context, uri: Uri, maxDimension: Int = 2048): Bitmap? = withContext(Dispatchers.IO) {
        try {
            val options = BitmapFactory.Options().apply { inJustDecodeBounds = true }
            context.contentResolver.openInputStream(uri)?.use { stream ->
                BitmapFactory.decodeStream(stream, null, options)
            }

            val origWidth = options.outWidth
            val origHeight = options.outHeight
            if (origWidth <= 0 || origHeight <= 0) return@withContext null

            var sampleSize = 1
            var w = origWidth
            var h = origHeight
            while (w > maxDimension || h > maxDimension) {
                sampleSize *= 2
                w /= 2
                h /= 2
            }

            val decodeOptions = BitmapFactory.Options().apply {
                inSampleSize = sampleSize
                inPreferredConfig = Bitmap.Config.ARGB_8888
            }

            context.contentResolver.openInputStream(uri)?.use { stream ->
                BitmapFactory.decodeStream(stream, null, decodeOptions)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    suspend fun applyFilters(
        src: Bitmap,
        filters: FilterSettings
    ): Bitmap = withContext(Dispatchers.Default) {
        val matrix = Matrix()
        if (filters.rotation != 0f) {
            matrix.postRotate(filters.rotation)
        }
        val scaleX = if (filters.flipH) -1f else 1f
        val scaleY = if (filters.flipV) -1f else 1f
        if (filters.flipH || filters.flipV) {
            matrix.postScale(scaleX, scaleY)
        }

        val transformed = if (!matrix.isIdentity) {
            Bitmap.createBitmap(src, 0, 0, src.width, src.height, matrix, true)
        } else {
            src
        }

        // Apply color adjustments via ColorMatrix
        val cm = ColorMatrix()

        // Saturation
        if (filters.grayscale) {
            cm.setSaturation(0f)
        } else if (filters.saturation != 0f) {
            val sat = 1f + (filters.saturation / 100f)
            cm.setSaturation(sat.coerceAtLeast(0f))
        }

        // Contrast & Brightness
        if (filters.contrast != 0f || filters.brightness != 0f) {
            val scale = 1f + (filters.contrast / 100f)
            val translate = filters.brightness * 2.55f
            val cmCB = ColorMatrix(
                floatArrayOf(
                    scale, 0f, 0f, 0f, translate,
                    0f, scale, 0f, 0f, translate,
                    0f, 0f, scale, 0f, translate,
                    0f, 0f, 0f, 1f, 0f
                )
            )
            cm.postConcat(cmCB)
        }

        // Invert
        if (filters.invert) {
            val cmInvert = ColorMatrix(
                floatArrayOf(
                    -1f, 0f, 0f, 0f, 255f,
                    0f, -1f, 0f, 0f, 255f,
                    0f, 0f, -1f, 0f, 255f,
                    0f, 0f, 0f, 1f, 0f
                )
            )
            cm.postConcat(cmInvert)
        }

        // Sepia
        if (filters.sepia) {
            val cmSepia = ColorMatrix(
                floatArrayOf(
                    0.393f, 0.769f, 0.189f, 0f, 0f,
                    0.349f, 0.686f, 0.168f, 0f, 0f,
                    0.272f, 0.534f, 0.131f, 0f, 0f,
                    0f, 0f, 0f, 1f, 0f
                )
            )
            cm.postConcat(cmSepia)
        }

        val resultBitmap = Bitmap.createBitmap(transformed.width, transformed.height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(resultBitmap)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.FILTER_BITMAP_FLAG).apply {
            colorFilter = ColorMatrixColorFilter(cm)
        }
        canvas.drawBitmap(transformed, 0f, 0f, paint)

        resultBitmap
    }

    suspend fun resizeBitmap(
        src: Bitmap,
        targetWidth: Int,
        targetHeight: Int,
        scaleMode: ScaleMode,
        bgColorHex: String = "none"
    ): Bitmap = withContext(Dispatchers.Default) {
        if (targetWidth <= 0 || targetHeight <= 0) return@withContext src
        if (targetWidth == src.width && targetHeight == src.height) return@withContext src

        when (scaleMode) {
            ScaleMode.STRETCH -> {
                Bitmap.createScaledBitmap(src, targetWidth, targetHeight, true)
            }
            ScaleMode.FIT -> {
                val ratioW = targetWidth.toFloat() / src.width
                val ratioH = targetHeight.toFloat() / src.height
                val scale = minOf(ratioW, ratioH)
                val fitW = (src.width * scale).roundToInt().coerceAtLeast(1)
                val fitH = (src.height * scale).roundToInt().coerceAtLeast(1)

                val scaled = Bitmap.createScaledBitmap(src, fitW, fitH, true)
                if (fitW == targetWidth && fitH == targetHeight && bgColorHex == "none") {
                    scaled
                } else {
                    val result = Bitmap.createBitmap(targetWidth, targetHeight, Bitmap.Config.ARGB_8888)
                    val canvas = Canvas(result)
                    if (bgColorHex != "none" && bgColorHex.startsWith("#")) {
                        try {
                            canvas.drawColor(Color.parseColor(bgColorHex))
                        } catch (_: Exception) {}
                    }
                    val left = (targetWidth - fitW) / 2f
                    val top = (targetHeight - fitH) / 2f
                    canvas.drawBitmap(scaled, left, top, Paint(Paint.FILTER_BITMAP_FLAG))
                    result
                }
            }
            ScaleMode.FILL -> {
                val ratioW = targetWidth.toFloat() / src.width
                val ratioH = targetHeight.toFloat() / src.height
                val scale = maxOf(ratioW, ratioH)
                val fillW = (src.width * scale).roundToInt().coerceAtLeast(1)
                val fillH = (src.height * scale).roundToInt().coerceAtLeast(1)

                val scaled = Bitmap.createScaledBitmap(src, fillW, fillH, true)
                val cropX = ((fillW - targetWidth) / 2).coerceAtLeast(0)
                val cropY = ((fillH - targetHeight) / 2).coerceAtLeast(0)
                Bitmap.createBitmap(scaled, cropX, cropY, targetWidth, targetHeight)
            }
            ScaleMode.SHRINK_ONLY -> {
                if (src.width <= targetWidth && src.height <= targetHeight) {
                    src
                } else {
                    resizeBitmap(src, targetWidth, targetHeight, ScaleMode.FIT, bgColorHex)
                }
            }
        }
    }

    suspend fun estimateSize(
        src: Bitmap,
        settings: ExportSettings
    ): Long = withContext(Dispatchers.Default) {
        val targetW = if (settings.width > 0) settings.width else src.width
        val targetH = if (settings.height > 0) settings.height else src.height
        val totalPixels = targetW.toLong() * targetH.toLong()

        when (settings.format) {
            ImageFormat.PNG -> {
                // PNG averages 1.2 to 2.5 bytes per pixel depending on complexity
                (totalPixels * 1.5).toLong()
            }
            ImageFormat.JPEG -> {
                // JPEG compression curve based on quality
                val bpp = when {
                    settings.quality >= 95 -> 1.8f
                    settings.quality >= 85 -> 1.0f
                    settings.quality >= 70 -> 0.6f
                    settings.quality >= 50 -> 0.4f
                    else -> 0.25f
                }
                (totalPixels * bpp / 3.0).toLong()
            }
            ImageFormat.WEBP -> {
                val baseJpeg = (totalPixels * 0.8 / 3.0)
                (baseJpeg * (settings.quality / 100f)).toLong().coerceAtLeast(1024L)
            }
            ImageFormat.AVIF -> {
                val base = (totalPixels * 0.5 / 3.0)
                (base * (settings.quality / 100f)).toLong().coerceAtLeast(1024L)
            }
            ImageFormat.BMP -> {
                // Uncompressed 24-bit + 54 byte header
                totalPixels * 3 + 54
            }
            ImageFormat.GIF -> {
                // Indexed 8-bit palette
                totalPixels + 1024
            }
        }
    }

    suspend fun exportImage(
        context: Context,
        bitmap: Bitmap,
        settings: ExportSettings,
        filenamePrefix: String = "MagickStudio"
    ): Uri? = withContext(Dispatchers.IO) {
        try {
            val compressFormat = when (settings.format) {
                ImageFormat.PNG -> Bitmap.CompressFormat.PNG
                ImageFormat.WEBP -> {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                        Bitmap.CompressFormat.WEBP_LOSSY
                    } else {
                        @Suppress("DEPRECATION")
                        Bitmap.CompressFormat.WEBP
                    }
                }
                else -> Bitmap.CompressFormat.JPEG
            }

            val filename = "${filenamePrefix}_${System.currentTimeMillis()}.${settings.format.extension}"
            val contentValues = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, filename)
                put(MediaStore.MediaColumns.MIME_TYPE, settings.format.mimeType)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/MagickStudio")
                    put(MediaStore.MediaColumns.IS_PENDING, 1)
                }
            }

            val resolver = context.contentResolver
            val uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues) ?: return@withContext null

            resolver.openOutputStream(uri)?.use { outStream ->
                bitmap.compress(compressFormat, settings.quality.coerceIn(1, 100), outStream)
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                contentValues.clear()
                contentValues.put(MediaStore.MediaColumns.IS_PENDING, 0)
                resolver.update(uri, contentValues, null, null)
            }

            uri
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    suspend fun cropBitmap(
        src: Bitmap,
        x: Int,
        y: Int,
        w: Int,
        h: Int,
        straightenAngle: Float = 0f
    ): Bitmap = withContext(Dispatchers.Default) {
        val rotated = if (straightenAngle != 0f) {
            val matrix = Matrix().apply { postRotate(straightenAngle) }
            Bitmap.createBitmap(src, 0, 0, src.width, src.height, matrix, true)
        } else {
            src
        }

        val clampX = x.coerceIn(0, rotated.width - 1)
        val clampY = y.coerceIn(0, rotated.height - 1)
        val clampW = w.coerceIn(1, rotated.width - clampX)
        val clampH = h.coerceIn(1, rotated.height - clampY)

        Bitmap.createBitmap(rotated, clampX, clampY, clampW, clampH)
    }

    suspend fun chopBitmap(
        src: Bitmap,
        isVertical: Boolean,
        startPct: Float, // 0..100
        endPct: Float,   // 0..100
        isInverse: Boolean = false
    ): Bitmap = withContext(Dispatchers.Default) {
        val s = (startPct / 100f).coerceIn(0f, 1f)
        val e = (endPct / 100f).coerceIn(s, 1f)

        if (isVertical) {
            // Cut or keep vertical slice
            val xStart = (src.width * s).roundToInt()
            val xEnd = (src.width * e).roundToInt()
            val sliceW = (xEnd - xStart).coerceAtLeast(1)

            if (isInverse) {
                // Keep slice
                Bitmap.createBitmap(src, xStart, 0, sliceW, src.height)
            } else {
                // Remove slice and join left + right
                val leftW = xStart
                val rightW = (src.width - xEnd).coerceAtLeast(0)
                val newW = (leftW + rightW).coerceAtLeast(1)

                val result = Bitmap.createBitmap(newW, src.height, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(result)
                if (leftW > 0) {
                    canvas.drawBitmap(Bitmap.createBitmap(src, 0, 0, leftW, src.height), 0f, 0f, null)
                }
                if (rightW > 0) {
                    canvas.drawBitmap(Bitmap.createBitmap(src, xEnd, 0, rightW, src.height), leftW.toFloat(), 0f, null)
                }
                result
            }
        } else {
            // Horizontal cut
            val yStart = (src.height * s).roundToInt()
            val yEnd = (src.height * e).roundToInt()
            val sliceH = (yEnd - yStart).coerceAtLeast(1)

            if (isInverse) {
                Bitmap.createBitmap(src, 0, yStart, src.width, sliceH)
            } else {
                val topH = yStart
                val bottomH = (src.height - yEnd).coerceAtLeast(0)
                val newH = (topH + bottomH).coerceAtLeast(1)

                val result = Bitmap.createBitmap(src.width, newH, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(result)
                if (topH > 0) {
                    canvas.drawBitmap(Bitmap.createBitmap(src, 0, 0, src.width, topH), 0f, 0f, null)
                }
                if (bottomH > 0) {
                    canvas.drawBitmap(Bitmap.createBitmap(src, 0, yEnd, src.width, bottomH), 0f, topH.toFloat(), null)
                }
                result
            }
        }
    }

    suspend fun runResizeByWeight(
        src: Bitmap,
        targetBytes: Long,
        format: ImageFormat,
        mode: String = "never-exceed"
    ): Pair<Bitmap, Int> = withContext(Dispatchers.Default) {
        var lowQ = 20
        var highQ = 100
        var bestQ = 80
        var bestDiff = Long.MAX_VALUE

        for (i in 0 until 8) {
            val midQ = (lowQ + highQ) / 2
            val est = estimateSize(src, ExportSettings(format = format, quality = midQ))
            val diff = kotlin.math.abs(est - targetBytes)

            if (mode == "never-exceed") {
                if (est <= targetBytes) {
                    bestQ = midQ
                    lowQ = midQ + 1
                } else {
                    highQ = midQ - 1
                }
            } else {
                if (diff < bestDiff) {
                    bestDiff = diff
                    bestQ = midQ
                }
                if (est > targetBytes) highQ = midQ - 1 else lowQ = midQ + 1
            }
            if (lowQ > highQ) break
        }

        Pair(src, bestQ)
    }

    fun computeBatchRename(
        names: List<String>,
        pattern: String,
        start: Int = 1,
        step: Int = 1,
        padding: Int = 2
    ): List<Pair<String, String>> {
        val raw = names.mapIndexed { idx, name ->
            val lastDot = name.lastIndexOf('.')
            val base = if (lastDot > 0) name.substring(0, lastDot) else name
            val ext = if (lastDot > 0) name.substring(lastDot + 1) else ""
            val num = start + idx * step
            val paddedNum = num.toString().padStart(padding, '0')

            var res = pattern
                .replace("{name}", base, ignoreCase = true)
                .replace("{index}", paddedNum, ignoreCase = true)
                .replace("{counter}", num.toString(), ignoreCase = true)
                .replace("{ext}", ext, ignoreCase = true)

            if (!res.contains('.') && ext.isNotEmpty()) {
                res = "$res.$ext"
            }
            res
        }

        // Duplicate conflict resolution
        val counts = mutableMapOf<String, Int>()
        raw.forEach { counts[it] = (counts[it] ?: 0) + 1 }

        val seen = mutableMapOf<String, Int>()
        return names.zip(raw).map { (orig, formatted) ->
            if ((counts[formatted] ?: 0) > 1) {
                val occ = (seen[formatted] ?: 0) + 1
                seen[formatted] = occ
                if (occ > 1) {
                    val lastDot = formatted.lastIndexOf('.')
                    val resolved = if (lastDot > 0) {
                        "${formatted.substring(0, lastDot)}(${occ - 1}).${formatted.substring(lastDot + 1)}"
                    } else {
                        "${formatted}(${occ - 1})"
                    }
                    Pair(orig, resolved)
                } else {
                    Pair(orig, formatted)
                }
            } else {
                Pair(orig, formatted)
            }
        }
    }
}

