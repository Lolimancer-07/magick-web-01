package com.magickstudio.app.feature.convert

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
import androidx.compose.runtime.mutableFloatStateOf
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
import com.magickstudio.app.core.designsystem.components.QualitySlider
import com.magickstudio.app.core.designsystem.components.SettingsCard
import com.magickstudio.app.core.designsystem.components.StickyPreviewCard
import com.magickstudio.app.core.designsystem.components.ToolChipRow
import com.magickstudio.app.core.engine.ExportSettings
import com.magickstudio.app.core.engine.ImageFormat
import com.magickstudio.app.core.engine.PlatformEngine
import com.magickstudio.app.core.designsystem.components.formatFileSize
import kotlinx.coroutines.launch

private val NativeFormats = setOf(ImageFormat.JPEG, ImageFormat.PNG, ImageFormat.WEBP)

@Composable
fun ConvertScreen(
    imageUri: Uri?,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var originalBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var originalSizeBytes by remember { mutableLongStateOf(0L) }
    var estimatedSizeBytes by remember { mutableLongStateOf(0L) }
    var isSaving by remember { mutableStateOf(false) }

    var format by remember { mutableStateOf(ImageFormat.JPEG) }
    var quality by remember { mutableFloatStateOf(90f) }

    LaunchedEffect(imageUri) {
        if (imageUri != null) {
            val bmp = PlatformEngine.loadBitmap(context, imageUri)
            if (bmp != null) {
                originalBitmap = bmp
                originalSizeBytes = context.contentResolver
                    .openFileDescriptor(imageUri, "r")?.statSize
                    ?: (bmp.width * bmp.height * 4L)
            }
        }
    }

    LaunchedEffect(originalBitmap, format, quality) {
        val bmp = originalBitmap ?: return@LaunchedEffect
        estimatedSizeBytes = PlatformEngine.estimateSize(
            bmp,
            ExportSettings(format = format, quality = quality.toInt())
        )
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = "Convert",
                onBackClick = onBackClick,
                originalSizeBytes = originalSizeBytes,
                estimatedSizeBytes = estimatedSizeBytes
            )
        },
        bottomBar = {
            MagickActionBar(
                primaryText = "Convert & Save",
                isLoading = isSaving,
                enabled = originalBitmap != null,
                onPrimaryClick = {
                    val bmp = originalBitmap ?: return@MagickActionBar
                    isSaving = true
                    scope.launch {
                        val uri = PlatformEngine.exportImage(
                            context = context,
                            bitmap = bmp,
                            settings = ExportSettings(
                                format = format,
                                quality = quality.toInt(),
                                width = bmp.width,
                                height = bmp.height
                            ),
                            filenamePrefix = "converted"
                        )
                        isSaving = false
                        Toast.makeText(
                            context,
                            if (uri != null) {
                                "Saved as ${format.displayName}"
                            } else {
                                "Conversion failed"
                            },
                            Toast.LENGTH_SHORT
                        ).show()
                    }
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
                previewBitmap = originalBitmap,
                originalBitmap = originalBitmap,
                width = originalBitmap?.width ?: 0,
                height = originalBitmap?.height ?: 0
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

            SettingsCard(title = "Output format") {
                ToolChipRow(
                    items = ImageFormat.entries,
                    selectedItem = format,
                    onItemSelected = { format = it },
                    labelProvider = { it.displayName }
                )
                if (format !in NativeFormats) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "${format.displayName} encoding is not wired up yet — this build " +
                            "falls back to JPEG bytes with a .${format.extension} name. " +
                            "JPEG, PNG and WebP are encoded natively.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.error
                    )
                }
            }

            SettingsCard(title = "Quality") {
                QualitySlider(
                    value = quality,
                    onValueChange = { quality = it },
                    title = "Compression quality",
                    valueRange = 1f..100f,
                    unitSuffix = "%"
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Original",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = formatFileSize(originalSizeBytes),
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Estimated output",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = formatFileSize(estimatedSizeBytes),
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }

            SettingsCard(title = "Source", subtitle = "Dimensions") {
                Text(
                    text = "${originalBitmap?.width ?: 0} × ${originalBitmap?.height ?: 0} px",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}
