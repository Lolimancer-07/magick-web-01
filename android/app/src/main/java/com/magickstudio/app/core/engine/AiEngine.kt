package com.magickstudio.app.core.engine

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlin.math.abs
import kotlin.math.exp
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt
import kotlin.math.sqrt

/**
 * On-device image intelligence.
 *
 * Everything here is pure CPU bitmap work with no model download, so it runs
 * offline and starts instantly. The depth maps are heuristic proxies rather
 * than neural output; [DepthEstimator] is the seam where a bundled ONNX model
 * (u2netp.onnx / face_detection_yunet) can be dropped in later without
 * touching any UI code.
 */
object AiEngine {

    // ---------------------------------------------------------------- detection

    enum class Verdict(val label: String) {
        LIKELY_AI("Likely AI"),
        LIKELY_HUMAN("Likely human"),
        UNCERTAIN("Uncertain")
    }

    data class DetectionReport(
        val verdict: Verdict,
        val aiProbability: Float,
        val saturationScore: Float,
        val noiseScore: Float,
        val edgeScore: Float,
        val smoothnessScore: Float,
        val elapsedMs: Long
    )

    /**
     * Scores an image on signals that separate camera captures from generative
     * output: sensor noise floor, local edge statistics, saturation bias and
     * the fraction of unnaturally smooth flat regions.
     */
    suspend fun detectAi(bitmap: Bitmap): DetectionReport = withContext(Dispatchers.Default) {
        val started = System.currentTimeMillis()
        val sample = downscale(bitmap, 384)
        val w = sample.width
        val h = sample.height
        val px = IntArray(w * h)
        sample.getPixels(px, 0, w, 0, 0, w, h)

        val luma = FloatArray(w * h)
        var saturationSum = 0f
        for (i in px.indices) {
            val p = px[i]
            val r = (p shr 16) and 0xFF
            val g = (p shr 8) and 0xFF
            val b = p and 0xFF
            luma[i] = 0.299f * r + 0.587f * g + 0.114f * b
            val mx = max(r, max(g, b))
            val mn = min(r, min(g, b))
            saturationSum += if (mx == 0) 0f else (mx - mn).toFloat() / mx
        }
        val saturation = saturationSum / px.size

        // Laplacian response separates sensor grain from generator smoothness.
        var lapAbsSum = 0.0
        var smoothPixels = 0
        var edgePixels = 0
        var counted = 0
        for (y in 1 until h - 1) {
            for (x in 1 until w - 1) {
                val i = y * w + x
                val lap = 4f * luma[i] -
                    luma[i - 1] - luma[i + 1] - luma[i - w] - luma[i + w]
                val a = abs(lap)
                lapAbsSum += a
                if (a < 1.5f) smoothPixels++
                if (a > 24f) edgePixels++
                counted++
            }
        }
        if (counted == 0) {
            return@withContext DetectionReport(Verdict.UNCERTAIN, 0.5f, 0f, 0f, 0f, 0f, 0)
        }

        val noise = (lapAbsSum / counted / 12.0).toFloat().coerceIn(0f, 1f)
        val smoothness = smoothPixels.toFloat() / counted
        val edge = edgePixels.toFloat() / counted

        // Generative output: very low grain, large smooth areas, punchy colour.
        // Camera output: measurable grain, broader edge spread, muted average.
        val saturationBias = ((saturation - 0.32f) / 0.45f).coerceIn(0f, 1f)
        val smoothBias = ((smoothness - 0.55f) / 0.40f).coerceIn(0f, 1f)
        val noiseBias = 1f - ((noise - 0.05f) / 0.55f).coerceIn(0f, 1f)
        val edgeBias = 1f - ((edge - 0.04f) / 0.22f).coerceIn(0f, 1f)

        val ai = (0.34f * smoothBias + 0.26f * noiseBias +
            0.22f * saturationBias + 0.18f * edgeBias).coerceIn(0f, 1f)

        val verdict = when {
            ai >= 0.62f -> Verdict.LIKELY_AI
            ai <= 0.40f -> Verdict.LIKELY_HUMAN
            else -> Verdict.UNCERTAIN
        }

        DetectionReport(
            verdict = verdict,
            aiProbability = ai,
            saturationScore = saturation,
            noiseScore = noise,
            edgeScore = edge,
            smoothnessScore = smoothness,
            elapsedMs = System.currentTimeMillis() - started
        )
    }

    // ------------------------------------------------------------------- depth

    /** The 13 depth effects exposed by Image Toolbox. */
    enum class DepthEffect(val label: String) {
        BackgroundBlur("Background blur"),
        ColorGrade("Colour grade"),
        Cutout("Cutout"),
        DepthEdges("Depth edges"),
        DepthMask("Depth mask"),
        FocusColor("Focus colour"),
        Fog("Fog"),
        LensBlur("Lens blur"),
        Map("Depth map"),
        NormalMap("Normal map"),
        Portrait("Portrait"),
        Relight("Relight"),
        Stereo("Stereo")
    }

    data class DepthParams(
        val strength: Float = 0.6f,
        val focus: Float = 0.5f
    )

    data class DepthMap(
        val width: Int,
        val height: Int,
        val values: FloatArray
    )

    /** Swap this out for an ONNX implementation without changing callers. */
    interface DepthEstimator {
        suspend fun estimate(bitmap: Bitmap): DepthMap
    }

    /**
     * Saliency-based depth proxy: subject pixels differ from a heavily blurred
     * version of themselves and cluster near the centre of the frame.
     */
    object HeuristicDepthEstimator : DepthEstimator {
        override suspend fun estimate(bitmap: Bitmap): DepthMap = withContext(Dispatchers.Default) {
            val sample = downscale(bitmap, 192)
            val w = sample.width
            val h = sample.height
            val px = IntArray(w * h)
            sample.getPixels(px, 0, w, 0, 0, w, h)

            val luma = FloatArray(w * h) { i ->
                val p = px[i]
                0.299f * ((p shr 16) and 0xFF) +
                    0.587f * ((p shr 8) and 0xFF) +
                    0.114f * (p and 0xFF)
            }

            val background = boxBlur(luma, w, h, radius = (min(w, h) / 12).coerceAtLeast(2))

            val saliency = FloatArray(w * h)
            val cx = (w - 1) / 2f
            val cy = (h - 1) / 2f
            val maxR = sqrt(cx * cx + cy * cy).coerceAtLeast(1f)
            for (y in 0 until h) {
                for (x in 0 until w) {
                    val i = y * w + x
                    val localContrast = abs(luma[i] - background[i]) / 96f
                    val dx = (x - cx) / maxR
                    val dy = (y - cy) / maxR
                    val centreBias = exp(-2.4f * (dx * dx + dy * dy))
                    saliency[i] = (localContrast.coerceIn(0f, 1f) * 0.72f +
                        centreBias * 0.28f)
                }
            }

            val smoothed = boxBlur(saliency, w, h, radius = (min(w, h) / 40).coerceAtLeast(1))
            normalize(smoothed)
            DepthMap(w, h, smoothed)
        }
    }

    suspend fun applyDepthEffect(
        bitmap: Bitmap,
        effect: DepthEffect,
        params: DepthParams = DepthParams()
    ): Bitmap = withContext(Dispatchers.Default) {
        val depth = HeuristicDepthEstimator.estimate(bitmap)
        val mask = resample(depth, bitmap.width, bitmap.height)
        val strength = params.strength.coerceIn(0f, 1f)
        when (effect) {
            DepthEffect.DepthMask -> depthToBitmap(mask, bitmap.width, bitmap.height)
            DepthEffect.Map -> depthToFalseColour(mask, bitmap.width, bitmap.height)
            DepthEffect.NormalMap -> depthToNormalMap(mask, bitmap.width, bitmap.height)
            DepthEffect.DepthEdges -> depthEdges(mask, bitmap.width, bitmap.height)
            DepthEffect.Cutout -> cutout(bitmap, mask)
            DepthEffect.BackgroundBlur -> backgroundBlur(bitmap, mask, strength, 24f)
            DepthEffect.LensBlur -> backgroundBlur(bitmap, mask, strength, 40f, vignette = true)
            DepthEffect.Portrait -> portrait(bitmap, mask, strength)
            DepthEffect.Fog -> fog(bitmap, mask, strength)
            DepthEffect.Relight -> relight(bitmap, mask, strength)
            DepthEffect.Stereo -> stereo(bitmap, mask, strength)
            DepthEffect.ColorGrade -> colourGrade(bitmap, mask, strength)
            DepthEffect.FocusColor -> focusColour(bitmap, mask, params.focus)
        }
    }

    // ------------------------------------------------------------ enhancement

    suspend fun removeBackground(bitmap: Bitmap): Bitmap = withContext(Dispatchers.Default) {
        val depth = HeuristicDepthEstimator.estimate(bitmap)
        cutout(bitmap, resample(depth, bitmap.width, bitmap.height))
    }
    suspend fun upscale(bitmap: Bitmap, factor: Float): Bitmap = withContext(Dispatchers.Default) {
        val f = factor.coerceIn(1f, 4f)
        if (f <= 1.01f) return@withContext bitmap
        val targetW = (bitmap.width * f).roundToInt().coerceAtLeast(1)
        val targetH = (bitmap.height * f).roundToInt().coerceAtLeast(1)
        val scaled = Bitmap.createScaledBitmap(bitmap, targetW, targetH, true)
        unsharpMask(scaled, amount = 0.35f)
    }

    suspend fun denoise(bitmap: Bitmap, strength: Float): Bitmap = withContext(Dispatchers.Default) {
        val s = strength.coerceIn(0f, 1f)
        if (s <= 0.01f) return@withContext bitmap
        val blurred = blurBitmap(bitmap, radius = 1.2f + s * 3.0f)
        // Blend back the sharp original where local contrast is high so edges
        // survive, and take the smoothed version in flat, noisy regions.
        edgeAwareBlend(bitmap, blurred, s)
    }

    // ------------------------------------------------------------- primitives

    private fun downscale(src: Bitmap, maxDim: Int): Bitmap {
        val longest = max(src.width, src.height)
        if (longest <= maxDim) return src
        val scale = maxDim.toFloat() / longest
        val w = (src.width * scale).roundToInt().coerceAtLeast(1)
        val h = (src.height * scale).roundToInt().coerceAtLeast(1)
        return Bitmap.createScaledBitmap(src, w, h, true)
    }

    private fun boxBlur(src: FloatArray, w: Int, h: Int, radius: Int): FloatArray {
        if (radius <= 0) return src.copyOf()
        val tmp = FloatArray(w * h)
        val out = FloatArray(w * h)
        val window = radius * 2 + 1

        for (y in 0 until h) {
            var acc = 0f
            for (x in -radius..radius) acc += src[y * w + x.coerceIn(0, w - 1)]
            for (x in 0 until w) {
                tmp[y * w + x] = acc / window
                acc -= src[y * w + (x - radius).coerceIn(0, w - 1)]
                acc += src[y * w + (x + radius + 1).coerceIn(0, w - 1)]
            }
        }
        for (x in 0 until w) {
            var acc = 0f
            for (y in -radius..radius) acc += tmp[y.coerceIn(0, h - 1) * w + x]
            for (y in 0 until h) {
                out[y * w + x] = acc / window
                acc -= tmp[(y - radius).coerceIn(0, h - 1) * w + x]
                acc += tmp[(y + radius + 1).coerceIn(0, h - 1) * w + x]
            }
        }
        return out
    }

    private fun normalize(values: FloatArray) {
        var lo = Float.MAX_VALUE
        var hi = -Float.MAX_VALUE
        for (v in values) {
            if (v < lo) lo = v
            if (v > hi) hi = v
        }
        val span = (hi - lo).takeIf { it > 1e-5f } ?: return
        for (i in values.indices) values[i] = (values[i] - lo) / span
    }

    private fun resample(map: DepthMap, targetW: Int, targetH: Int): FloatArray {
        val src = map.values
        val srcW = map.width
        val srcH = map.height
        if (srcW == targetW && srcH == targetH) return src.copyOf()

        val out = FloatArray(targetW * targetH)
        for (y in 0 until targetH) {
            val sy = ((y.toFloat() / targetH) * srcH).toInt().coerceIn(0, srcH - 1)
            for (x in 0 until targetW) {
                val sx = ((x.toFloat() / targetW) * srcW).toInt().coerceIn(0, srcW - 1)
                out[y * targetW + x] = src[sy * srcW + sx]
            }
        }
        return out
    }

    private fun blurBitmap(src: Bitmap, radius: Float): Bitmap {
        if (radius <= 0f) return src
        val div = max(2, (radius * 2).roundToInt())
        val smallW = max(1, src.width / div)
        val smallH = max(1, src.height / div)
        val small = Bitmap.createScaledBitmap(src, smallW, smallH, true)
        return Bitmap.createScaledBitmap(small, src.width, src.height, true)
    }

    private fun unsharpMask(src: Bitmap, amount: Float): Bitmap {
        val w = src.width
        val h = src.height
        val original = IntArray(w * h)
        src.getPixels(original, 0, w, 0, 0, w, h)
        val soft = blurBitmap(src, 1.0f)
        val softPx = IntArray(w * h)
        soft.getPixels(softPx, 0, w, 0, 0, w, h)

        val out = IntArray(w * h)
        for (i in original.indices) {
            val o = original[i]
            val s = softPx[i]
            val r = sharpenChannel((o shr 16) and 0xFF, (s shr 16) and 0xFF, amount)
            val g = sharpenChannel((o shr 8) and 0xFF, (s shr 8) and 0xFF, amount)
            val b = sharpenChannel(o and 0xFF, s and 0xFF, amount)
            out[i] = (0xFF shl 24) or (r shl 16) or (g shl 8) or b
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun sharpenChannel(orig: Int, soft: Int, amount: Float): Int =
        (orig + (orig - soft) * amount).roundToInt().coerceIn(0, 255)

    private fun edgeAwareBlend(sharp: Bitmap, soft: Bitmap, strength: Float): Bitmap {
        val w = sharp.width
        val h = sharp.height
        val a = IntArray(w * h)
        val b = IntArray(w * h)
        sharp.getPixels(a, 0, w, 0, 0, w, h)
        soft.getPixels(b, 0, w, 0, 0, w, h)

        val out = IntArray(w * h)
        for (i in a.indices) {
            val pa = a[i]
            val pb = b[i]
            val la = lumaOf(pa)
            val lb = lumaOf(pb)
            val detail = abs(la - lb) / 48f
            val wSoft = (strength * (1f - detail.coerceIn(0f, 1f))).coerceIn(0f, 1f)
            out[i] = blend(pa, pb, wSoft)
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun lumaOf(p: Int): Float =
        0.299f * ((p shr 16) and 0xFF) + 0.587f * ((p shr 8) and 0xFF) + 0.114f * (p and 0xFF)

    private fun blend(a: Int, b: Int, t: Float): Int {
        val aa = ((a ushr 24) and 0xFF)
        val ba = ((b ushr 24) and 0xFF)
        val ar = (a shr 16) and 0xFF
        val ag = (a shr 8) and 0xFF
        val ab = a and 0xFF
        val br = (b shr 16) and 0xFF
        val bg = (b shr 8) and 0xFF
        val bb = b and 0xFF
        val alpha = (aa + (ba - aa) * t).roundToInt().coerceIn(0, 255)
        val r = (ar + (br - ar) * t).roundToInt().coerceIn(0, 255)
        val g = (ag + (bg - ag) * t).roundToInt().coerceIn(0, 255)
        val bl = (ab + (bb - ab) * t).roundToInt().coerceIn(0, 255)
        return (alpha shl 24) or (r shl 16) or (g shl 8) or bl
    }

    // ------------------------------------------------------------- effect impls

    private fun cutout(src: Bitmap, mask: FloatArray): Bitmap {
        val w = src.width
        val h = src.height
        val px = IntArray(w * h)
        src.getPixels(px, 0, w, 0, 0, w, h)
        val out = IntArray(w * h)
        for (i in px.indices) {
            val p = px[i]
            // Feather the matte so edges do not look like a hard poster cut.
            val a = (mask[i].coerceIn(0f, 1f) * 1.35f).coerceIn(0f, 1f)
            val alpha = (a * 255).roundToInt()
            out[i] = (alpha shl 24) or (p and 0x00FFFFFF)
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun backgroundBlur(
        src: Bitmap,
        mask: FloatArray,
        strength: Float,
        radius: Float,
        vignette: Boolean = false
    ): Bitmap {
        val w = src.width
        val h = src.height
        val sharp = IntArray(w * h)
        src.getPixels(sharp, 0, w, 0, 0, w, h)
        val blurred = blurBitmap(src, radius)
        val soft = IntArray(w * h)
        blurred.getPixels(soft, 0, w, 0, 0, w, h)

        val out = IntArray(w * h)
        val cx = (w - 1) / 2f
        val cy = (h - 1) / 2f
        val maxR = sqrt(cx * cx + cy * cy).coerceAtLeast(1f)
        for (y in 0 until h) {
            for (x in 0 until w) {
                val i = y * w + x
                // mask ~1 = subject, ~0 = background
                val subject = mask[i].coerceIn(0f, 1f)
                var bgAmount = (1f - subject) * strength
                if (vignette) {
                    val dx = (x - cx) / maxR
                    val dy = (y - cy) / maxR
                    bgAmount = (bgAmount + 0.25f * (dx * dx + dy * dy)).coerceIn(0f, 1f)
                }
                out[i] = blend(sharp[i], soft[i], bgAmount)
            }
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun portrait(src: Bitmap, mask: FloatArray, strength: Float): Bitmap {
        val blurred = backgroundBlur(src, mask, strength, 32f)
        val w = blurred.width
        val h = blurred.height
        val px = IntArray(w * h)
        blurred.getPixels(px, 0, w, 0, 0, w, h)
        val out = IntArray(w * h)
        for (i in px.indices) {
            val p = px[i]
            val r = ((p shr 16) and 0xFF)
            val g = ((p shr 8) and 0xFF)
            val b = (p and 0xFF)
            // Gentle warm skin-tone lift, the classic portrait look.
            val nr = (r * 1.05f + 6).roundToInt().coerceIn(0, 255)
            val ng = (g * 1.01f + 2).roundToInt().coerceIn(0, 255)
            val nb = (b * 0.97f).roundToInt().coerceIn(0, 255)
            out[i] = (0xFF shl 24) or (nr shl 16) or (ng shl 8) or nb
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun fog(src: Bitmap, mask: FloatArray, strength: Float): Bitmap {
        val w = src.width
        val h = src.height
        val px = IntArray(w * h)
        src.getPixels(px, 0, w, 0, 0, w, h)
        val out = IntArray(w * h)
        val tint = 0xFFF2F4F7.toInt()
        for (i in px.indices) {
            // Far things (low mask) get more fog.
            val far = (1f - mask[i].coerceIn(0f, 1f)) * strength
            out[i] = blend(px[i], tint, (far * 0.75f).coerceIn(0f, 1f))
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun relight(src: Bitmap, mask: FloatArray, strength: Float): Bitmap {
        val w = src.width
        val h = src.height
        val px = IntArray(w * h)
        src.getPixels(px, 0, w, 0, 0, w, h)
        val out = IntArray(w * h)
        val lightX = 0.32f
        val lightY = 0.22f
        for (y in 0 until h) {
            for (x in 0 until w) {
                val i = y * w + x
                val dx = x.toFloat() / w - lightX
                val dy = y.toFloat() / h - lightY
                val dist = sqrt(dx * dx + dy * dy).coerceAtMost(1.4f)
                val falloff = (1f - dist / 1.4f).coerceIn(0f, 1f)
                val depthGain = 0.65f + 0.35f * mask[i].coerceIn(0f, 1f)
                val gain = (1f + (falloff * depthGain - 0.5f) * strength * 1.4f)
                    .coerceIn(0.35f, 1.9f)
                val p = px[i]
                val r = (((p shr 16) and 0xFF) * gain).roundToInt().coerceIn(0, 255)
                val g = (((p shr 8) and 0xFF) * gain).roundToInt().coerceIn(0, 255)
                val b = ((p and 0xFF) * gain).roundToInt().coerceIn(0, 255)
                out[i] = (0xFF shl 24) or (r shl 16) or (g shl 8) or b
            }
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun stereo(src: Bitmap, mask: FloatArray, strength: Float): Bitmap {
        val w = src.width
        val h = src.height
        val px = IntArray(w * h)
        src.getPixels(px, 0, w, 0, 0, w, h)
        val out = IntArray(w * h)
        val maxShift = (w * 0.02f * strength).roundToInt().coerceAtLeast(1)
        for (y in 0 until h) {
            for (x in 0 until w) {
                val i = y * w + x
                val shift = (mask[i].coerceIn(0f, 1f) * maxShift).roundToInt()
                val leftIdx = y * w + (x - shift).coerceIn(0, w - 1)
                val rightIdx = y * w + (x + shift).coerceIn(0, w - 1)
                val left = px[leftIdx]
                val right = px[rightIdx]
                val r = (left shr 16) and 0xFF
                val g = (((left shr 8) and 0xFF) + ((right shr 8) and 0xFF)) / 2
                val b = right and 0xFF
                out[i] = (0xFF shl 24) or (r shl 16) or (g shl 8) or b
            }
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun colourGrade(src: Bitmap, mask: FloatArray, strength: Float): Bitmap {
        val w = src.width
        val h = src.height
        val px = IntArray(w * h)
        src.getPixels(px, 0, w, 0, 0, w, h)
        val out = IntArray(w * h)
        for (i in px.indices) {
            val p = px[i]
            val r = ((p shr 16) and 0xFF).toFloat()
            val g = ((p shr 8) and 0xFF).toFloat()
            val b = (p and 0xFF).toFloat()
            val near = mask[i].coerceIn(0f, 1f)
            // Near: warm highlights. Far: cool, slightly desaturated.
            val warm = 1f - near
            val nr = (r * (1f + 0.10f * near) + 14f * warm * strength).coerceIn(0f, 255f)
            val ng = (g * (1f + 0.03f * near)).coerceIn(0f, 255f)
            val nb = (b * (1f - 0.06f * warm) + 18f * warm * strength).coerceIn(0f, 255f)
            out[i] = (0xFF shl 24) or
                (nr.roundToInt() shl 16) or (ng.roundToInt() shl 8) or nb.roundToInt()
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun focusColour(src: Bitmap, mask: FloatArray, focus: Float): Bitmap {
        val w = src.width
        val h = src.height
        val px = IntArray(w * h)
        src.getPixels(px, 0, w, 0, 0, w, h)
        val out = IntArray(w * h)
        val pivot = focus.coerceIn(0.05f, 0.95f)
        for (i in px.indices) {
            val p = px[i]
            val r = (p shr 16) and 0xFF
            val g = (p shr 8) and 0xFF
            val b = p and 0xFF
            val distance = abs(mask[i].coerceIn(0f, 1f) - pivot)
            val keepColour = (1f - distance / 0.45f).coerceIn(0f, 1f)
            val grey = (0.299f * r + 0.587f * g + 0.114f * b)
            val nr = (grey + (r - grey) * keepColour).roundToInt().coerceIn(0, 255)
            val ng = (grey + (g - grey) * keepColour).roundToInt().coerceIn(0, 255)
            val nb = (grey + (b - grey) * keepColour).roundToInt().coerceIn(0, 255)
            out[i] = (0xFF shl 24) or (nr shl 16) or (ng shl 8) or nb
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun depthToBitmap(mask: FloatArray, w: Int, h: Int): Bitmap {
        val out = IntArray(w * h)
        for (i in mask.indices) {
            val v = (mask[i].coerceIn(0f, 1f) * 255).roundToInt()
            out[i] = (0xFF shl 24) or (v shl 16) or (v shl 8) or v
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun depthToFalseColour(mask: FloatArray, w: Int, h: Int): Bitmap {
        val out = IntArray(w * h)
        for (i in mask.indices) {
            val t = mask[i].coerceIn(0f, 1f)
            // Blue -> cyan -> green -> yellow -> red ramp.
            val r = (255f * (t * 1.6f - 0.4f)).coerceIn(0f, 255f)
            val g = (255f * (1f - abs(t - 0.55f) / 0.55f)).coerceIn(0f, 255f)
            val b = (255f * (1.2f - t * 1.5f)).coerceIn(0f, 255f)
            out[i] = (0xFF shl 24) or (r.roundToInt() shl 16) or
                (g.roundToInt() shl 8) or b.roundToInt()
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun depthToNormalMap(mask: FloatArray, w: Int, h: Int): Bitmap {
        val out = IntArray(w * h)
        for (y in 0 until h) {
            for (x in 0 until w) {
                val i = y * w + x
                val l = mask[y * w + (x - 1).coerceIn(0, w - 1)]
                val r = mask[y * w + (x + 1).coerceIn(0, w - 1)]
                val u = mask[(y - 1).coerceIn(0, h - 1) * w + x]
                val d = mask[(y + 1).coerceIn(0, h - 1) * w + x]
                var nx = (l - r) * 4f
                var ny = (u - d) * 4f
                var nz = 1f
                val len = sqrt(nx * nx + ny * ny + nz * nz).coerceAtLeast(1e-4f)
                nx /= len; ny /= len; nz /= len
                val rr = ((nx * 0.5f + 0.5f) * 255).roundToInt().coerceIn(0, 255)
                val gg = ((ny * 0.5f + 0.5f) * 255).roundToInt().coerceIn(0, 255)
                val bb = ((nz * 0.5f + 0.5f) * 255).roundToInt().coerceIn(0, 255)
                out[i] = (0xFF shl 24) or (rr shl 16) or (gg shl 8) or bb
            }
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    private fun depthEdges(mask: FloatArray, w: Int, h: Int): Bitmap {
        val out = IntArray(w * h)
        for (y in 1 until h - 1) {
            for (x in 1 until w - 1) {
                val i = y * w + x
                val gx = -mask[i - w - 1] - 2 * mask[i - 1] - mask[i + w - 1] +
                    mask[i - w + 1] + 2 * mask[i + 1] + mask[i + w + 1]
                val gy = -mask[i - w - 1] - 2 * mask[i - w] - mask[i - w + 1] +
                    mask[i + w - 1] + 2 * mask[i + w] + mask[i + w + 1]
                val mag = (sqrt(gx * gx + gy * gy) * 255f).coerceIn(0f, 255f)
                val v = mag.roundToInt()
                out[i] = (0xFF shl 24) or (v shl 16) or (v shl 8) or v
            }
        }
        // Fill the 1px border so the bitmap is not left transparent.
        for (x in 0 until w) {
            out[x] = out[w + x]
            out[(h - 1) * w + x] = out[(h - 2) * w + x]
        }
        for (y in 0 until h) {
            out[y * w] = out[y * w + 1]
            out[y * w + w - 1] = out[y * w + w - 2]
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    /** Checkerboard-backed render so transparent results read clearly in-app. */
    fun checkerboard(width: Int, height: Int, cell: Int = 16): Bitmap {
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        val light = Paint().apply { color = Color.parseColor("#E9E9EE") }
        val dark = Paint().apply { color = Color.parseColor("#CFCFD8") }
        for (y in 0 until height step cell) {
            for (x in 0 until width step cell) {
                val paint = if (((x / cell) + (y / cell)) % 2 == 0) light else dark
                canvas.drawRect(x.toFloat(), y.toFloat(),
                    (x + cell).toFloat(), (y + cell).toFloat(), paint)
            }
        }
        return bitmap
    }

    fun compositeOnCheckerboard(src: Bitmap): Bitmap {
        val bg = checkerboard(src.width, src.height)
        val canvas = Canvas(bg)
        canvas.drawBitmap(src, 0f, 0f, Paint(Paint.FILTER_BITMAP_FLAG))
        return bg
    }
}
