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
}
