package com.magickstudio.app.feature.singleedit

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Flip
import androidx.compose.material.icons.filled.RotateRight
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
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

@Composable
fun SingleEditScreen(
    imageUri: Uri?,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var originalBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var previewBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var originalSizeBytes by remember { mutableLongStateOf(0L) }
    var estimatedSizeBytes by remember { mutableLongStateOf(0L) }
    var isSaving by remember { mutableStateOf(false) }

    // Filter controls
    var brightness by remember { mutableFloatStateOf(0f) }
    var contrast by remember { mutableFloatStateOf(0f) }
    var saturation by remember { mutableFloatStateOf(0f) }
    var rotation by remember { mutableFloatStateOf(0f) }
    var flipH by remember { mutableStateOf(false) }
    var flipV by remember { mutableStateOf(false) }
    var selectedPreset by remember { mutableStateOf("Original") }

    // Export settings
    var selectedFormat by remember { mutableStateOf(ImageFormat.JPEG) }
    var quality by remember { mutableIntStateOf(85) }

    val presets = listOf("Original", "Vibrant", "B&W", "Sepia", "Invert")

    // Load initial bitmap
    LaunchedEffect(imageUri) {
        if (imageUri != null) {
            val bmp = PlatformEngine.loadBitmap(context, imageUri)
            if (bmp != null) {
                originalBitmap = bmp
                previewBitmap = bmp
                val size = context.contentResolver.openFileDescriptor(imageUri, "r")?.statSize ?: (bmp.width * bmp.height * 4L)
                originalSizeBytes = size
            }
        }
    }

    // Live filter and size estimate updates
    LaunchedEffect(originalBitmap, brightness, contrast, saturation, rotation, flipH, flipV, selectedPreset, selectedFormat, quality) {
        val orig = originalBitmap ?: return@LaunchedEffect

        val filters = when (selectedPreset) {
            "Vibrant" -> FilterSettings(brightness = brightness, contrast = contrast + 20f, saturation = saturation + 40f, rotation = rotation, flipH = flipH, flipV = flipV)
            "B&W" -> FilterSettings(brightness = brightness, contrast = contrast, grayscale = true, rotation = rotation, flipH = flipH, flipV = flipV)
            "Sepia" -> FilterSettings(brightness = brightness, contrast = contrast, sepia = true, rotation = rotation, flipH = flipH, flipV = flipV)
            "Invert" -> FilterSettings(brightness = brightness, contrast = contrast, invert = true, rotation = rotation, flipH = flipH, flipV = flipV)
            else -> FilterSettings(brightness = brightness, contrast = contrast, saturation = saturation, rotation = rotation, flipH = flipH, flipV = flipV)
        }

        val filtered = PlatformEngine.applyFilters(orig, filters)
        previewBitmap = filtered

        val est = PlatformEngine.estimateSize(filtered, ExportSettings(format = selectedFormat, quality = quality))
        estimatedSizeBytes = est
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = "Single Edit",
                onBackClick = onBackClick,
                originalSizeBytes = originalSizeBytes,
                estimatedSizeBytes = estimatedSizeBytes
            )
        },
        bottomBar = {
            MagickActionBar(
                primaryText = "Save Image",
                secondaryText = "Reset",
                isLoading = isSaving,
                enabled = previewBitmap != null,
                onPrimaryClick = {
                    val bmp = previewBitmap ?: return@MagickActionBar
                    isSaving = true
                    coroutineScope.launch {
                        val uri = PlatformEngine.exportImage(
                            context = context,
                            bitmap = bmp,
                            settings = ExportSettings(format = selectedFormat, quality = quality)
                        )
                        isSaving = false
                        if (uri != null) {
                            Toast.makeText(context, "Saved successfully to Pictures/MagickStudio!", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(context, "Failed to save image", Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                onSecondaryClick = {
                    brightness = 0f
                    contrast = 0f
                    saturation = 0f
                    rotation = 0f
                    flipH = false
                    flipV = false
                    selectedPreset = "Original"
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
            // Sticky Preview Card
            StickyPreviewCard(
                previewBitmap = previewBitmap,
                originalBitmap = originalBitmap,
                width = previewBitmap?.width ?: 0,
                height = previewBitmap?.height ?: 0,
                onResetClick = {
                    brightness = 0f
                    contrast = 0f
                    saturation = 0f
                    rotation = 0f
                    flipH = false
                    flipV = false
                    selectedPreset = "Original"
                }
            )

            // Preset Filters
            ToolChipRow(
                items = presets,
                selectedItem = selectedPreset,
                onItemSelected = { selectedPreset = it }
            )

            // Adjustments Card
            SettingsCard(
                title = "Tonal Adjustments",
                subtitle = "Fine-tune exposure, contrast and color vibrance"
            ) {
                QualitySlider(
                    value = brightness,
                    onValueChange = { brightness = it },
                    title = "Brightness",
                    valueRange = -100f..100f,
                    unitSuffix = ""
                )
                Spacer(modifier = Modifier.height(12.dp))
                QualitySlider(
                    value = contrast,
                    onValueChange = { contrast = it },
                    title = "Contrast",
                    valueRange = -100f..100f,
                    unitSuffix = ""
                )
                Spacer(modifier = Modifier.height(12.dp))
                QualitySlider(
                    value = saturation,
                    onValueChange = { saturation = it },
                    title = "Saturation",
                    valueRange = -100f..100f,
                    unitSuffix = ""
                )
            }

            // Geometry Transformations Card
            SettingsCard(
                title = "Transform & Orientation",
                subtitle = "Rotate and flip the canvas"
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    FilledTonalButton(
                        onClick = { rotation = (rotation + 90f) % 360f },
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(imageVector = Icons.Default.RotateRight, contentDescription = null)
                        Spacer(modifier = Modifier.padding(2.dp))
                        Text("90°")
                    }

                    FilledTonalButton(
                        onClick = { flipH = !flipH },
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(imageVector = Icons.Default.Flip, contentDescription = null)
                        Spacer(modifier = Modifier.padding(2.dp))
                        Text("Flip H")
                    }

                    FilledTonalButton(
                        onClick = { flipV = !flipV },
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(imageVector = Icons.Default.Flip, contentDescription = null)
                        Spacer(modifier = Modifier.padding(2.dp))
                        Text("Flip V")
                    }
                }
            }

            // Export & Compression Card
            SettingsCard(
                title = "Format & Quality",
                subtitle = "Select output codec and compression target"
            ) {
                ToolChipRow(
                    items = listOf(ImageFormat.JPEG, ImageFormat.PNG, ImageFormat.WEBP),
                    selectedItem = selectedFormat,
                    onItemSelected = { selectedFormat = it },
                    labelProvider = { it.displayName }
                )

                if (selectedFormat != ImageFormat.PNG) {
                    Spacer(modifier = Modifier.height(16.dp))
                    QualitySlider(
                        value = quality.toFloat(),
                        onValueChange = { quality = it.toInt() },
                        title = "Compression Quality",
                        valueRange = 1f..100f,
                        unitSuffix = "%"
                    )
                }
            }
        }
    }
}
