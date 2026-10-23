package com.magickstudio.app.feature.crop

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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.LockOpen
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.magickstudio.app.core.designsystem.components.MagickActionBar
import com.magickstudio.app.core.designsystem.components.MagickTopBar
import com.magickstudio.app.core.designsystem.components.NumberField
import com.magickstudio.app.core.designsystem.components.QualitySlider
import com.magickstudio.app.core.designsystem.components.SettingsCard
import com.magickstudio.app.core.designsystem.components.StickyPreviewCard
import com.magickstudio.app.core.designsystem.components.ToolChipRow
import com.magickstudio.app.core.engine.ExportSettings
import com.magickstudio.app.core.engine.ImageFormat
import com.magickstudio.app.core.engine.PlatformEngine
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

data class AspectPreset(val id: String, val label: String, val ratio: Float?)

val AspectPresets = listOf(
    AspectPreset("free", "Free", null),
    AspectPreset("1:1", "1:1 Square", 1.0f),
    AspectPreset("4:3", "4:3 Classic", 4f / 3f),
    AspectPreset("3:2", "3:2 Photo", 3f / 2f),
    AspectPreset("16:9", "16:9 Screen", 16f / 9f),
    AspectPreset("9:16", "9:16 Story", 9f / 16f),
    AspectPreset("original", "Original", null)
)

@Composable
fun CropScreen(
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

    var selectedAspect by remember { mutableStateOf(AspectPresets[0]) }
    var isAspectLocked by remember { mutableStateOf(false) }
    var straightenAngle by remember { mutableFloatStateOf(0f) }

    var cropX by remember { mutableIntStateOf(0) }
    var cropY by remember { mutableIntStateOf(0) }
    var cropW by remember { mutableIntStateOf(1080) }
    var cropH by remember { mutableIntStateOf(1080) }

    LaunchedEffect(imageUri) {
        if (imageUri != null) {
            val bmp = PlatformEngine.loadBitmap(context, imageUri)
            if (bmp != null) {
                originalBitmap = bmp
                previewBitmap = bmp
                cropW = bmp.width
                cropH = bmp.height
                val size = context.contentResolver.openFileDescriptor(imageUri, "r")?.statSize ?: (bmp.width * bmp.height * 4L)
                originalSizeBytes = size
            }
        }
    }

    // Recalculate crop bounds when aspect preset changes
    LaunchedEffect(selectedAspect) {
        val orig = originalBitmap ?: return@LaunchedEffect
        val ratio = when (selectedAspect.id) {
            "1:1" -> 1.0f
            "4:3" -> 4f / 3f
            "3:2" -> 3f / 2f
            "16:9" -> 16f / 9f
            "9:16" -> 9f / 16f
            "original" -> orig.width.toFloat() / orig.height
            else -> null
        }
        if (ratio != null) {
            isAspectLocked = true
            cropH = (cropW / ratio).roundToInt().coerceIn(10, orig.height)
        }
    }

    // Live cropped preview
    LaunchedEffect(originalBitmap, cropX, cropY, cropW, cropH, straightenAngle) {
        val orig = originalBitmap ?: return@LaunchedEffect
        val cropped = PlatformEngine.cropBitmap(orig, cropX, cropY, cropW, cropH, straightenAngle)
        previewBitmap = cropped
        estimatedSizeBytes = PlatformEngine.estimateSize(cropped, ExportSettings(format = ImageFormat.JPEG, quality = 85))
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = "Crop & Straighten",
                onBackClick = onBackClick,
                originalSizeBytes = originalSizeBytes,
                estimatedSizeBytes = estimatedSizeBytes
            )
        },
        bottomBar = {
            MagickActionBar(
                primaryText = "Save Cropped",
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
                            settings = ExportSettings(format = ImageFormat.JPEG, quality = 85),
                            filenamePrefix = "cropped"
                        )
                        isSaving = false
                        if (uri != null) {
                            Toast.makeText(context, "Cropped image saved successfully!", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(context, "Failed to save cropped image", Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                onSecondaryClick = {
                    val orig = originalBitmap ?: return@MagickActionBar
                    cropX = 0
                    cropY = 0
                    cropW = orig.width
                    cropH = orig.height
                    straightenAngle = 0f
                    selectedAspect = AspectPresets[0]
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
                width = previewBitmap?.width ?: cropW,
                height = previewBitmap?.height ?: cropH
            )

            // Aspect Presets
            SettingsCard(
                title = "Aspect Ratio",
                subtitle = "Constrain crop box to standard photography or social formats"
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isAspectLocked) "Aspect Ratio: Locked" else "Aspect Ratio: Free",
                        style = MaterialTheme.typography.bodyMedium
                    )
                    IconButton(onClick = { isAspectLocked = !isAspectLocked }) {
                        Icon(
                            imageVector = if (isAspectLocked) Icons.Default.Lock else Icons.Default.LockOpen,
                            contentDescription = "Toggle Lock",
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                ToolChipRow(
                    items = AspectPresets,
                    selectedItem = selectedAspect,
                    onItemSelected = { selectedAspect = it },
                    labelProvider = { it.label }
                )
            }

            // Straighten slider
            SettingsCard(
                title = "Straighten & Level",
                subtitle = "Correct tilted horizons or angle precisely"
            ) {
                QualitySlider(
                    value = straightenAngle,
                    onValueChange = { straightenAngle = it },
                    title = "Angle",
                    valueRange = -45f..45f,
                    unitSuffix = "°"
                )
            }

            // Pixel Bounds NumberFields
            SettingsCard(
                title = "Crop Dimensions & Offsets",
                subtitle = "Manual pixel coordinates"
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    NumberField(
                        value = cropW,
                        onValueChange = {
                            cropW = it
                            if (isAspectLocked && selectedAspect.ratio != null) {
                                cropH = (it / selectedAspect.ratio!!).roundToInt()
                            }
                        },
                        label = "Width",
                        modifier = Modifier.weight(1f)
                    )
                    NumberField(
                        value = cropH,
                        onValueChange = {
                            cropH = it
                            if (isAspectLocked && selectedAspect.ratio != null) {
                                cropW = (it * selectedAspect.ratio!!).roundToInt()
                            }
                        },
                        label = "Height",
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    NumberField(
                        value = cropX,
                        onValueChange = { cropX = it },
                        label = "X Offset",
                        modifier = Modifier.weight(1f)
                    )
                    NumberField(
                        value = cropY,
                        onValueChange = { cropY = it },
                        label = "Y Offset",
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}
