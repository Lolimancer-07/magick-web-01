package com.magickstudio.app.feature.cutting

import android.graphics.Bitmap
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
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
import com.magickstudio.app.core.designsystem.components.SegmentedControl
import com.magickstudio.app.core.designsystem.components.SettingsCard
import com.magickstudio.app.core.designsystem.components.StickyPreviewCard
import com.magickstudio.app.core.engine.ExportSettings
import com.magickstudio.app.core.engine.ImageFormat
import com.magickstudio.app.core.engine.PlatformEngine
import kotlinx.coroutines.launch

enum class CutMode(val displayName: String) {
    CHOP("Chop (Remove Band)"),
    INVERSE("Keep Slice")
}

enum class CutOrientation(val displayName: String) {
    HORIZONTAL("Horizontal Cut"),
    VERTICAL("Vertical Cut")
}

@Composable
fun ImageCuttingScreen(
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

    var mode by remember { mutableStateOf(CutMode.CHOP) }
    var orientation by remember { mutableStateOf(CutOrientation.HORIZONTAL) }
    var startPct by remember { mutableFloatStateOf(30f) }
    var endPct by remember { mutableFloatStateOf(60f) }

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

    LaunchedEffect(originalBitmap, mode, orientation, startPct, endPct) {
        val orig = originalBitmap ?: return@LaunchedEffect
        val cut = PlatformEngine.chopBitmap(
            src = orig,
            isVertical = orientation == CutOrientation.VERTICAL,
            startPct = startPct,
            endPct = endPct.coerceAtLeast(startPct + 1f),
            isInverse = mode == CutMode.INVERSE
        )
        previewBitmap = cut
        estimatedSizeBytes = PlatformEngine.estimateSize(cut, ExportSettings(format = ImageFormat.JPEG, quality = 85))
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = "Image Cutting (-chop)",
                onBackClick = onBackClick,
                originalSizeBytes = originalSizeBytes,
                estimatedSizeBytes = estimatedSizeBytes
            )
        },
        bottomBar = {
            MagickActionBar(
                primaryText = "Save Cut Image",
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
                            filenamePrefix = "cut"
                        )
                        isSaving = false
                        if (uri != null) {
                            Toast.makeText(context, "Cut image saved to Pictures/MagickStudio!", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(context, "Failed to save cut image", Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                onSecondaryClick = {
                    startPct = 30f
                    endPct = 60f
                    mode = CutMode.CHOP
                    orientation = CutOrientation.HORIZONTAL
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

            // Mode Selector
            SettingsCard(
                title = "Operation Mode",
                subtitle = "Chop removes the selected section and stitches the rest together"
            ) {
                SegmentedControl(
                    items = CutMode.entries,
                    selectedItem = mode,
                    onItemSelected = { mode = it },
                    labelProvider = { it.displayName }
                )
            }

            // Orientation Selector
            SettingsCard(
                title = "Cut Orientation",
                subtitle = "Split along horizontal or vertical axis"
            ) {
                SegmentedControl(
                    items = CutOrientation.entries,
                    selectedItem = orientation,
                    onItemSelected = { orientation = it },
                    labelProvider = { it.displayName }
                )
            }

            // Cut range sliders
            SettingsCard(
                title = "Band Boundaries",
                subtitle = "Define starting and ending cut lines (0% to 100%)"
            ) {
                QualitySlider(
                    value = startPct,
                    onValueChange = {
                        startPct = it
                        if (endPct <= it) endPct = (it + 5f).coerceAtMost(100f)
                    },
                    title = "Band Start",
                    valueRange = 0f..95f,
                    unitSuffix = "%"
                )

                Spacer(modifier = Modifier.height(16.dp))

                QualitySlider(
                    value = endPct,
                    onValueChange = {
                        endPct = it
                        if (startPct >= it) startPct = (it - 5f).coerceAtLeast(0f)
                    },
                    title = "Band End",
                    valueRange = 5f..100f,
                    unitSuffix = "%"
                )
            }
        }
    }
}
