package com.magickstudio.app.feature.resizeweight

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
import androidx.compose.material3.Text
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.magickstudio.app.core.designsystem.components.MagickActionBar
import com.magickstudio.app.core.designsystem.components.MagickTopBar
import com.magickstudio.app.core.designsystem.components.NumberField
import com.magickstudio.app.core.designsystem.components.SegmentedControl
import com.magickstudio.app.core.designsystem.components.SettingsCard
import com.magickstudio.app.core.designsystem.components.StickyPreviewCard
import com.magickstudio.app.core.designsystem.components.ToolChipRow
import com.magickstudio.app.core.designsystem.components.formatFileSize
import com.magickstudio.app.core.engine.ExportSettings
import com.magickstudio.app.core.engine.ImageFormat
import com.magickstudio.app.core.engine.PlatformEngine
import kotlinx.coroutines.launch

enum class WeightMode(val displayName: String, val id: String) {
    NEVER_EXCEED("Never Exceed", "never-exceed"),
    CLOSEST("Closest Possible", "closest")
}

@Composable
fun ResizeByWeightScreen(
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

    var targetKb by remember { mutableIntStateOf(350) }
    var selectedFormat by remember { mutableStateOf(ImageFormat.JPEG) }
    var selectedMode by remember { mutableStateOf(WeightMode.NEVER_EXCEED) }
    var achievedQuality by remember { mutableIntStateOf(85) }

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

    LaunchedEffect(originalBitmap, targetKb, selectedFormat, selectedMode) {
        val orig = originalBitmap ?: return@LaunchedEffect
        val targetBytes = targetKb * 1024L
        val (bmp, q) = PlatformEngine.runResizeByWeight(orig, targetBytes, selectedFormat, selectedMode.id)
        achievedQuality = q
        previewBitmap = bmp
        estimatedSizeBytes = PlatformEngine.estimateSize(bmp, ExportSettings(format = selectedFormat, quality = q))
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = "Resize by Weight",
                onBackClick = onBackClick,
                originalSizeBytes = originalSizeBytes,
                estimatedSizeBytes = estimatedSizeBytes
            )
        },
        bottomBar = {
            MagickActionBar(
                primaryText = "Export At Target Size",
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
                            settings = ExportSettings(format = selectedFormat, quality = achievedQuality),
                            filenamePrefix = "target_${targetKb}kb"
                        )
                        isSaving = false
                        if (uri != null) {
                            Toast.makeText(context, "Saved image within ${targetKb} KB!", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(context, "Export failed", Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                onSecondaryClick = {
                    targetKb = 350
                    selectedMode = WeightMode.NEVER_EXCEED
                    selectedFormat = ImageFormat.JPEG
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

            // Target Size Input
            SettingsCard(
                title = "Target Weight",
                subtitle = "Binary search will iteratively tune encoder quality to match target"
            ) {
                NumberField(
                    value = targetKb,
                    onValueChange = { targetKb = it },
                    label = "Target Size",
                    unitSuffix = "KB",
                    step = 50,
                    minValue = 10,
                    maxValue = 50000
                )

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Achieved Quality: $achievedQuality%",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "Target: ${formatFileSize(targetKb * 1024L)}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Target Mode
            SettingsCard(
                title = "Constraint Rule",
                subtitle = "Never-exceed guarantees output is strictly under or equal to target size"
            ) {
                SegmentedControl(
                    items = WeightMode.entries,
                    selectedItem = selectedMode,
                    onItemSelected = { selectedMode = it },
                    labelProvider = { it.displayName }
                )
            }

            // Codec Selection
            SettingsCard(
                title = "Output Codec",
                subtitle = "Lossy formats offer continuous compression curves"
            ) {
                ToolChipRow(
                    items = listOf(ImageFormat.JPEG, ImageFormat.WEBP, ImageFormat.AVIF),
                    selectedItem = selectedFormat,
                    onItemSelected = { selectedFormat = it },
                    labelProvider = { it.displayName }
                )
            }
        }
    }
}
