package com.magickstudio.app.feature.ai

import android.graphics.Bitmap
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LinearProgressIndicator
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
import com.magickstudio.app.core.designsystem.components.SettingsCard
import com.magickstudio.app.core.designsystem.components.StickyPreviewCard
import com.magickstudio.app.core.designsystem.components.ToolChipRow
import com.magickstudio.app.core.engine.AiEngine
import com.magickstudio.app.core.engine.ExportSettings
import com.magickstudio.app.core.engine.ImageFormat
import com.magickstudio.app.core.engine.PlatformEngine
import kotlinx.coroutines.launch

@Composable
fun DepthEffectsScreen(
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

    var effect by remember { mutableStateOf(AiEngine.DepthEffect.BackgroundBlur) }
    var strength by remember { mutableFloatStateOf(65f) }
    var focus by remember { mutableFloatStateOf(50f) }

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

    LaunchedEffect(originalBitmap, effect, strength, focus) {
        val src = originalBitmap ?: return@LaunchedEffect
        isProcessing = true
        val rendered = AiEngine.applyDepthEffect(
            bitmap = src,
            effect = effect,
            params = AiEngine.DepthParams(
                strength = strength / 100f,
                focus = focus / 100f
            )
        )
        previewBitmap = rendered
        estimatedSizeBytes = PlatformEngine.estimateSize(
            rendered,
            ExportSettings(format = ImageFormat.PNG, quality = 100)
        )
        isProcessing = false
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = "Depth Effects",
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
                            settings = ExportSettings(format = ImageFormat.PNG, quality = 100),
                            filenamePrefix = "depth_${effect.name.lowercase()}"
                        )
                        isSaving = false
                        Toast.makeText(
                            context,
                            if (uri != null) "Saved to Pictures/MagickStudio" else "Save failed",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                },
                onSecondaryClick = {
                    strength = 65f
                    focus = 50f
                    previewBitmap = originalBitmap
                }
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

            SettingsCard(
                title = "Effect",
                subtitle = "${AiEngine.DepthEffect.entries.size} depth-based looks"
            ) {
                ToolChipRow(
                    items = AiEngine.DepthEffect.entries,
                    selectedItem = effect,
                    onItemSelected = { effect = it },
                    labelProvider = { it.label }
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = effectDescription(effect),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            SettingsCard(title = "Parameters") {
                QualitySlider(
                    value = strength,
                    onValueChange = { strength = it },
                    title = "Strength"
                )
                if (effect == AiEngine.DepthEffect.FocusColor) {
                    Spacer(modifier = Modifier.height(12.dp))
                    QualitySlider(
                        value = focus,
                        onValueChange = { focus = it },
                        title = "Focus depth"
                    )
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
                            text = "Rendering…",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            SettingsCard(
                title = "How the depth map is made",
                subtitle = "On-device, no model download"
            ) {
                Text(
                    text = "A saliency proxy is computed from local luminance contrast and a " +
                        "centre-weighted prior, then used as the depth mask. Swap in the bundled " +
                        "u2netp.onnx model later for neural accuracy — the UI stays identical.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(10.dp))
                LinearProgressIndicator(
                    progress = { strength / 100f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(4.dp),
                    color = MaterialTheme.colorScheme.primary,
                    trackColor = MaterialTheme.colorScheme.surfaceVariant
                )
            }
        }
    }
}

private fun effectDescription(effect: AiEngine.DepthEffect): String = when (effect) {
    AiEngine.DepthEffect.BackgroundBlur -> "Keeps the subject sharp and blurs everything the depth map marks as background."
    AiEngine.DepthEffect.LensBlur -> "Stronger optical blur with a natural corner falloff."
    AiEngine.DepthEffect.Portrait -> "Background blur plus a gentle warm skin-tone lift."
    AiEngine.DepthEffect.ColorGrade -> "Warm highlights near the subject, cool shadows in the distance."
    AiEngine.DepthEffect.Cutout -> "Cuts the subject out onto a transparent background."
    AiEngine.DepthEffect.DepthEdges -> "Sobel edges of the depth map — great for contour masks."
    AiEngine.DepthEffect.DepthMask -> "The raw greyscale depth mask."
    AiEngine.DepthEffect.FocusColor -> "Keeps one depth band in colour and desaturates the rest."
    AiEngine.DepthEffect.Fog -> "Adds atmospheric haze that increases with distance."
    AiEngine.DepthEffect.Map -> "False-colour depth visualisation."
    AiEngine.DepthEffect.NormalMap -> "Surface normals derived from the depth gradient."
    AiEngine.DepthEffect.Relight -> "Directional light from the top-left, modulated by depth."
    AiEngine.DepthEffect.Stereo -> "Red/cyan anaglyph with depth-driven parallax."
}
