package com.magickstudio.app.feature.resizeconvert

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.magickstudio.app.core.designsystem.components.ColorSwatches
import com.magickstudio.app.core.designsystem.components.MagickActionBar
import com.magickstudio.app.core.designsystem.components.MagickTopBar
import com.magickstudio.app.core.designsystem.components.NumberField
import com.magickstudio.app.core.designsystem.components.QualitySlider
import com.magickstudio.app.core.designsystem.components.SegmentedControl
import com.magickstudio.app.core.designsystem.components.SettingsCard
import com.magickstudio.app.core.designsystem.components.StickyPreviewCard
import com.magickstudio.app.core.designsystem.components.ToolChipRow
import com.magickstudio.app.core.engine.ExportSettings
import com.magickstudio.app.core.engine.ImageFormat
import com.magickstudio.app.core.engine.PlatformEngine
import com.magickstudio.app.core.engine.ResizeType
import com.magickstudio.app.core.engine.ScaleMode
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

@Composable
fun ResizeConvertScreen(
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

    // Resize state
    var resizeType by remember { mutableStateOf(ResizeType.PIXELS) }
    var targetWidth by remember { mutableIntStateOf(1080) }
    var targetHeight by remember { mutableIntStateOf(1080) }
    var percentage by remember { mutableIntStateOf(100) }
    var scaleMode by remember { mutableStateOf(ScaleMode.FIT) }
    var bgColorHex by remember { mutableStateOf("none") }

    // Format & Quality state
    var selectedFormat by remember { mutableStateOf(ImageFormat.JPEG) }
    var quality by remember { mutableIntStateOf(85) }

    // Load initial image
    LaunchedEffect(imageUri) {
        if (imageUri != null) {
            val bmp = PlatformEngine.loadBitmap(context, imageUri)
            if (bmp != null) {
                originalBitmap = bmp
                previewBitmap = bmp
                targetWidth = bmp.width
                targetHeight = bmp.height
                val size = context.contentResolver.openFileDescriptor(imageUri, "r")?.statSize ?: (bmp.width * bmp.height * 4L)
                originalSizeBytes = size
            }
        }
    }

    // Live resize and size estimate
    LaunchedEffect(originalBitmap, resizeType, targetWidth, targetHeight, percentage, scaleMode, bgColorHex, selectedFormat, quality) {
        val orig = originalBitmap ?: return@LaunchedEffect

        val finalW = when (resizeType) {
            ResizeType.PERCENTAGE -> (orig.width * (percentage / 100f)).roundToInt().coerceAtLeast(1)
            else -> targetWidth.coerceAtLeast(1)
        }
        val finalH = when (resizeType) {
            ResizeType.PERCENTAGE -> (orig.height * (percentage / 100f)).roundToInt().coerceAtLeast(1)
            else -> targetHeight.coerceAtLeast(1)
        }

        val resized = PlatformEngine.resizeBitmap(orig, finalW, finalH, scaleMode, bgColorHex)
        previewBitmap = resized

        val est = PlatformEngine.estimateSize(
            resized,
            ExportSettings(
                format = selectedFormat,
                quality = quality,
                width = finalW,
                height = finalH
            )
        )
        estimatedSizeBytes = est
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = "Resize & Convert",
                onBackClick = onBackClick,
                originalSizeBytes = originalSizeBytes,
                estimatedSizeBytes = estimatedSizeBytes
            )
        },
        bottomBar = {
            MagickActionBar(
                primaryText = "Save Converted",
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
                            settings = ExportSettings(
                                format = selectedFormat,
                                quality = quality,
                                width = bmp.width,
                                height = bmp.height,
                                backgroundColorHex = bgColorHex,
                                scaleMode = scaleMode
                            )
                        )
                        isSaving = false
                        if (uri != null) {
                            Toast.makeText(context, "Saved successfully to Pictures/MagickStudio!", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(context, "Failed to export image", Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                onSecondaryClick = {
                    val orig = originalBitmap ?: return@MagickActionBar
                    targetWidth = orig.width
                    targetHeight = orig.height
                    percentage = 100
                    scaleMode = ScaleMode.FIT
                    bgColorHex = "none"
                    selectedFormat = ImageFormat.JPEG
                    quality = 85
                    previewBitmap = orig
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
                width = previewBitmap?.width ?: targetWidth,
                height = previewBitmap?.height ?: targetHeight,
                onResetClick = {
                    val orig = originalBitmap ?: return@StickyPreviewCard
                    targetWidth = orig.width
                    targetHeight = orig.height
                }
            )

            // Resize Type Selector
            SettingsCard(
                title = "Resize Dimensions",
                subtitle = "Choose sizing method and bounding box"
            ) {
                SegmentedControl(
                    items = ResizeType.entries,
                    selectedItem = resizeType,
                    onItemSelected = { resizeType = it },
                    labelProvider = { it.displayName }
                )

                Spacer(modifier = Modifier.height(16.dp))

                if (resizeType == ResizeType.PERCENTAGE) {
                    QualitySlider(
                        value = percentage.toFloat(),
                        onValueChange = { percentage = it.roundToInt() },
                        title = "Scale Percentage",
                        valueRange = 10f..400f,
                        unitSuffix = "%"
                    )
                } else {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        NumberField(
                            value = targetWidth,
                            onValueChange = { targetWidth = it },
                            label = "Width",
                            unitSuffix = "px",
                            modifier = Modifier.weight(1f)
                        )
                        NumberField(
                            value = targetHeight,
                            onValueChange = { targetHeight = it },
                            label = "Height",
                            unitSuffix = "px",
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            // Scale Mode Selector
            SettingsCard(
                title = "Scale Mode",
                subtitle = "Controls aspect ratio fitting and cropping"
            ) {
                SegmentedControl(
                    items = ScaleMode.entries,
                    selectedItem = scaleMode,
                    onItemSelected = { scaleMode = it },
                    labelProvider = { it.displayName }
                )
            }

            // Background Color for padding / matte
            SettingsCard(
                title = "Background / Matte Color",
                subtitle = "Used when scaling with fit padding or transparency flattening",
                collapsible = true,
                initiallyExpanded = false
            ) {
                ColorSwatches(
                    selectedHex = bgColorHex,
                    onColorSelected = { bgColorHex = it.hex }
                )
            }

            // Format & Quality Card
            SettingsCard(
                title = "Format & Codec",
                subtitle = "Convert output format and tune compression"
            ) {
                ToolChipRow(
                    items = ImageFormat.entries,
                    selectedItem = selectedFormat,
                    onItemSelected = { selectedFormat = it },
                    labelProvider = { it.displayName }
                )

                if (selectedFormat != ImageFormat.PNG && selectedFormat != ImageFormat.BMP) {
                    Spacer(modifier = Modifier.height(16.dp))
                    QualitySlider(
                        value = quality.toFloat(),
                        onValueChange = { quality = it.toInt() },
                        title = "Quality",
                        valueRange = 1f..100f,
                        unitSuffix = "%"
                    )
                }
            }
        }
    }
}
