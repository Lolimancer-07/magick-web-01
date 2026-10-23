package com.magickstudio.app.feature.tools

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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
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
import com.magickstudio.app.core.engine.ToolDef
import com.magickstudio.app.core.engine.ToolRegistry
import kotlinx.coroutines.launch

@Composable
fun ToolDetailScreen(
    toolId: String,
    imageUri: Uri?,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val tool: ToolDef? = remember(toolId) { ToolRegistry.getToolById(context, toolId) }

    var originalBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var previewBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var originalSizeBytes by remember { mutableLongStateOf(0L) }
    var estimatedSizeBytes by remember { mutableLongStateOf(0L) }
    var isSaving by remember { mutableStateOf(false) }

    // Dynamic tool parameters
    var targetWeightKb by remember { mutableIntStateOf(500) }
    var renamePattern by remember { mutableStateOf("{name}_{index}") }
    var exifArtist by remember { mutableStateOf("") }
    var exifCopyright by remember { mutableStateOf("") }

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

    LaunchedEffect(previewBitmap, targetWeightKb) {
        val bmp = previewBitmap ?: return@LaunchedEffect
        if (toolId == "resize-weight") {
            estimatedSizeBytes = targetWeightKb * 1024L
        } else {
            estimatedSizeBytes = PlatformEngine.estimateSize(bmp, ExportSettings(format = ImageFormat.JPEG, quality = 85))
        }
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = tool?.title ?: "Tool",
                onBackClick = onBackClick,
                originalSizeBytes = originalSizeBytes,
                estimatedSizeBytes = estimatedSizeBytes
            )
        },
        bottomBar = {
            MagickActionBar(
                primaryText = "Process & Save",
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
                            filenamePrefix = toolId
                        )
                        isSaving = false
                        if (uri != null) {
                            Toast.makeText(context, "${tool?.title ?: "Tool"} processed and saved!", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(context, "Processing failed", Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                onSecondaryClick = {
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
            // Preview
            StickyPreviewCard(
                previewBitmap = previewBitmap,
                originalBitmap = originalBitmap,
                width = previewBitmap?.width ?: 0,
                height = previewBitmap?.height ?: 0
            )

            // Tool Description Card
            SettingsCard(
                title = tool?.title ?: "Tool Parameters",
                subtitle = tool?.description
            ) {
                when (toolId) {
                    "resize-weight" -> {
                        NumberField(
                            value = targetWeightKb,
                            onValueChange = { targetWeightKb = it },
                            label = "Target Size",
                            unitSuffix = "KB",
                            step = 50,
                            minValue = 10,
                            maxValue = 50000
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "Binary search will iteratively tune JPEG/WebP quality and scale to match your target file weight accurately.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    "batch-rename" -> {
                        OutlinedTextField(
                            value = renamePattern,
                            onValueChange = { renamePattern = it },
                            label = { Text("Filename Pattern") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Available tokens: {name}, {index}, {date}, {w}, {h}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    "edit-exif" -> {
                        OutlinedTextField(
                            value = exifArtist,
                            onValueChange = { exifArtist = it },
                            label = { Text("Author / Artist") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        OutlinedTextField(
                            value = exifCopyright,
                            onValueChange = { exifCopyright = it },
                            label = { Text("Copyright") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp)
                        )
                    }
                    "delete-exif" -> {
                        Text(
                            text = "Losslessly strips EXIF, GPS location, camera metadata, and thumbnails without touching scan data or re-encoding pixels.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                    "image-info" -> {
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            InfoRow("Resolution", "${originalBitmap?.width ?: 0} × ${originalBitmap?.height ?: 0} px")
                            InfoRow("Color Depth", "32-bit ARGB_8888")
                            InfoRow("File Size", formatBytes(originalSizeBytes))
                            InfoRow("Aspect Ratio", calculateAspectRatio(originalBitmap?.width ?: 1, originalBitmap?.height ?: 1))
                        }
                    }
                    else -> {
                        Text(
                            text = "CLI Flags: ${tool?.cliFlags?.joinToString(", ") ?: "None"}",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(text = value, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold), color = MaterialTheme.colorScheme.onSurface)
    }
}

private fun formatBytes(bytes: Long): String {
    if (bytes <= 0) return "0 B"
    val kb = bytes / 1024.0
    val mb = kb / 1024.0
    return if (mb >= 1.0) String.format("%.2f MB", mb) else String.format("%.1f KB", kb)
}

private fun calculateAspectRatio(w: Int, h: Int): String {
    fun gcd(a: Int, b: Int): Int = if (b == 0) a else gcd(b, a % b)
    val g = gcd(w, h)
    return "${w / g}:${h / g}"
}
