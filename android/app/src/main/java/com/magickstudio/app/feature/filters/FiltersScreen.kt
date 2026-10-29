package com.magickstudio.app.feature.filters

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
import androidx.compose.ui.unit.dp
import com.magickstudio.app.core.designsystem.components.MagickActionBar
import com.magickstudio.app.core.designsystem.components.MagickTopBar
import com.magickstudio.app.core.designsystem.components.QualitySlider
import com.magickstudio.app.core.designsystem.components.SettingsCard
import com.magickstudio.app.core.designsystem.components.StickyPreviewCard
import com.magickstudio.app.core.designsystem.components.ToolChipRow
import com.magickstudio.app.core.engine.ExportSettings
import com.magickstudio.app.core.engine.FilterSettings
import com.magickstudio.app.core.engine.ImageFormat
import com.magickstudio.app.core.engine.PlatformEngine
import kotlinx.coroutines.launch

private data class FilterPreset(
    val id: String,
    val label: String,
    val settings: FilterSettings
)

private val Presets = listOf(
    FilterPreset("none", "Original", FilterSettings()),
    FilterPreset("vivid", "Vivid", FilterSettings(saturation = 35f, contrast = 12f)),
    FilterPreset("punch", "Punch", FilterSettings(contrast = 30f, saturation = 20f)),
    FilterPreset("mono", "Mono", FilterSettings(grayscale = true)),
    FilterPreset("noir", "Noir", FilterSettings(grayscale = true, contrast = 40f)),
    FilterPreset("sepia", "Sepia", FilterSettings(sepia = true)),
    FilterPreset("fade", "Fade", FilterSettings(contrast = -25f, brightness = 6f, saturation = -10f)),
    FilterPreset("bright", "Bright", FilterSettings(brightness = 25f)),
    FilterPreset("dark", "Dark", FilterSettings(brightness = -25f)),
    FilterPreset("invert", "Invert", FilterSettings(invert = true)),
    FilterPreset("soft", "Soft", FilterSettings(contrast = -12f, saturation = 8f)),
    FilterPreset("chrome", "Chrome", FilterSettings(contrast = 22f, saturation = 30f, brightness = 4f))
)

@Composable
fun FiltersScreen(
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

    var preset by remember { mutableStateOf(Presets[0]) }
    var brightness by remember { mutableFloatStateOf(0f) }
    var contrast by remember { mutableFloatStateOf(0f) }
    var saturation by remember { mutableFloatStateOf(0f) }

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

    LaunchedEffect(preset) {
        brightness = preset.settings.brightness
        contrast = preset.settings.contrast
        saturation = preset.settings.saturation
    }

    LaunchedEffect(originalBitmap, preset, brightness, contrast, saturation) {
        val src = originalBitmap ?: return@LaunchedEffect
        isProcessing = true
        val merged = preset.settings.copy(
            brightness = brightness,
            contrast = contrast,
            saturation = saturation
        )
        val rendered = PlatformEngine.applyFilters(src, merged)
        previewBitmap = rendered
        estimatedSizeBytes = PlatformEngine.estimateSize(
            rendered,
            ExportSettings(format = ImageFormat.JPEG, quality = 92)
        )
        isProcessing = false
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = "Filters",
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
                            settings = ExportSettings(format = ImageFormat.JPEG, quality = 92),
                            filenamePrefix = "filter_${preset.id}"
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
                    preset = Presets[0]
                    brightness = 0f
                    contrast = 0f
                    saturation = 0f
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

            SettingsCard(title = "Presets", subtitle = "${Presets.size} looks") {
                ToolChipRow(
                    items = Presets,
                    selectedItem = preset,
                    onItemSelected = { preset = it },
                    labelProvider = { it.label }
                )
            }

            SettingsCard(title = "Adjustments") {
                QualitySlider(
                    value = brightness,
                    onValueChange = { brightness = it },
                    title = "Brightness",
                    valueRange = -100f..100f,
                    unitSuffix = ""
                )
                Spacer(modifier = Modifier.height(8.dp))
                QualitySlider(
                    value = contrast,
                    onValueChange = { contrast = it },
                    title = "Contrast",
                    valueRange = -100f..100f,
                    unitSuffix = ""
                )
                Spacer(modifier = Modifier.height(8.dp))
                QualitySlider(
                    value = saturation,
                    onValueChange = { saturation = it },
                    title = "Saturation",
                    valueRange = -100f..100f,
                    unitSuffix = ""
                )

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
        }
    }
}
