package com.magickstudio.app.feature.ai

import android.graphics.Bitmap
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.magickstudio.app.core.designsystem.components.MagickActionBar
import com.magickstudio.app.core.designsystem.components.MagickTopBar
import com.magickstudio.app.core.designsystem.components.QualitySlider
import com.magickstudio.app.core.designsystem.components.SegmentedControl
import com.magickstudio.app.core.designsystem.components.SettingsCard
import com.magickstudio.app.core.designsystem.components.StickyPreviewCard
import com.magickstudio.app.core.engine.AiEngine
import com.magickstudio.app.core.engine.ExportSettings
import com.magickstudio.app.core.engine.ImageFormat
import com.magickstudio.app.core.engine.PlatformEngine
import kotlinx.coroutines.launch

enum class EnhanceMode(val title: String, val blurb: String) {
    RemoveBackground(
        "Background Remover",
        "Builds a soft matte from the depth proxy and cuts the subject out."
    ),
    Upscale(
        "Upscale",
        "Resamples with high-quality filtering, then recovers detail with an unsharp mask."
    ),
    Denoise(
        "Denoise",
        "Edge-aware smoothing: flat noisy regions are cleaned, strong edges are preserved."
    )
}

@Composable
fun AiEnhanceScreen(
    mode: EnhanceMode,
    imageUri: Uri?,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var originalBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var previewBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var originalSizeBytes by remember { mutableLongStateOf(0L) }
    var estimatedSizeBytes by remember { mutableLongStateOf(0L) }
    var isSaving by remember { mutableStateOf(false) }
    var isProcessing by remember { mutableStateOf(false) }

    var scale by remember { mutableFloatStateOf(2f) }
    var denoiseStrength by remember { mutableFloatStateOf(55f) }

    val exportFormat = if (mode == EnhanceMode.RemoveBackground) ImageFormat.PNG else ImageFormat.JPEG

    LaunchedEffect(imageUri) {
        if (imageUri != null) {
            val bmp = PlatformEngine.loadBitmap(context, imageUri)
            if (bmp != null) {
                originalBitmap = bmp
                previewBitmap = bmp
                originalSizeBytes = context.contentResolver
                    .openFileDescriptor(imageUri, "r")?.statSize
                    ?: (bmp.width * bmp.height * 4L)
            }
        }
    }

    LaunchedEffect(originalBitmap, mode, scale, denoiseStrength) {
        val src = originalBitmap ?: return@LaunchedEffect
        isProcessing = true
        val rendered = when (mode) {
            EnhanceMode.RemoveBackground -> AiEngine.removeBackground(src)
            EnhanceMode.Upscale -> AiEngine.upscale(src, scale)
            EnhanceMode.Denoise -> AiEngine.denoise(src, denoiseStrength / 100f)
        }
        previewBitmap = rendered
        estimatedSizeBytes = PlatformEngine.estimateSize(
            rendered,
            ExportSettings(format = exportFormat, quality = 92)
        )
        isProcessing = false
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = mode.title,
                onBackClick = onBackClick,
                originalSizeBytes = originalSizeBytes,
                estimatedSizeBytes = estimatedSizeBytes
            )
        },
        bottomBar = {
            MagickActionBar(
                primaryText = "Save Result",
                secondaryText = "Reset",
                isLoading = isSaving,
                enabled = previewBitmap != null,
                onPrimaryClick = {
                    val bmp = previewBitmap ?: return@MagickActionBar
                    isSaving = true
                    scope.launch {
                        val uri = PlatformEngine.exportImage(
                            context = context,
                            bitmap = bmp,
                            settings = ExportSettings(
                                format = exportFormat,
                                quality = 92,
                                width = bmp.width,
                                height = bmp.height
                            ),
                            filenamePrefix = mode.name.lowercase()
                        )
                        isSaving = false
                        Toast.makeText(
                            context,
                            if (uri != null) "Saved to Pictures/MagickStudio" else "Save failed",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                },
                onSecondaryClick = { previewBitmap = originalBitmap }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.background)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            StickyPreviewCard(
                previewBitmap = previewBitmap,
                originalBitmap = originalBitmap,
                width = previewBitmap?.width ?: 0,
                height = previewBitmap?.height ?: 0
            )

            if (originalBitmap == null) {
                SettingsCard(title = "No image selected", subtitle = "Pick an image from the hub first") {
                    Text(
                        text = "Open the hub, tap the photo button, then choose this tool again.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                return@Column
            }

            SettingsCard(title = "About this tool") {
                Text(
                    text = mode.blurb,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }

            SettingsCard(title = "Settings") {
                when (mode) {
                    EnhanceMode.Upscale -> {
                        SegmentedControl(
                            items = listOf(2f, 3f, 4f),
                            selectedItem = scale,
                            onItemSelected = { scale = it },
                            labelProvider = { "${it.toInt()}×" }
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "Output: ${((originalBitmap?.width ?: 0) * scale).toInt()} × " +
                                "${((originalBitmap?.height ?: 0) * scale).toInt()} px",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    EnhanceMode.Denoise -> {
                        QualitySlider(
                            value = denoiseStrength,
                            onValueChange = { denoiseStrength = it },
                            title = "Strength"
                        )
                    }
                    EnhanceMode.RemoveBackground -> {
                        Text(
                            text = "Result is saved as PNG so the transparent background survives.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                if (isProcessing) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                        Text(
                            text = "Processing…",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            SettingsCard(title = "Engine", subtitle = "Pure CPU, offline") {
                Text(
                    text = "No model file or network call is required. The neural path " +
                        "(u2netp.onnx via ONNX Runtime) plugs into AiEngine.DepthEstimator " +
                        "without changing this screen.",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Normal),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
