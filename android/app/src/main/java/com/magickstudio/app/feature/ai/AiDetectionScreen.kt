package com.magickstudio.app.feature.ai

import android.graphics.Bitmap
import android.net.Uri
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.magickstudio.app.core.designsystem.components.MagickTopBar
import com.magickstudio.app.core.designsystem.components.SettingsCard
import com.magickstudio.app.core.designsystem.components.StickyPreviewCard
import com.magickstudio.app.core.engine.AiEngine
import com.magickstudio.app.core.engine.PlatformEngine
import kotlinx.coroutines.launch

@Composable
fun AiDetectionScreen(
    imageUri: Uri?,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var bitmap by remember { mutableStateOf<Bitmap?>(null) }
    var report by remember { mutableStateOf<AiEngine.DetectionReport?>(null) }
    var isRunning by remember { mutableStateOf(false) }

    LaunchedEffect(imageUri) {
        if (imageUri != null) {
            bitmap = PlatformEngine.loadBitmap(context, imageUri)
        }
    }

    LaunchedEffect(bitmap) {
        val bmp = bitmap ?: return@LaunchedEffect
        isRunning = true
        report = AiEngine.detectAi(bmp)
        isRunning = false
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = { MagickTopBar(title = "AI Detector", onBackClick = onBackClick) }
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
                previewBitmap = bitmap,
                originalBitmap = bitmap,
                width = bitmap?.width ?: 0,
                height = bitmap?.height ?: 0
            )

            if (bitmap == null) {
                SettingsCard(title = "No image selected", subtitle = "Pick an image from the hub first") {
                    Text(
                        text = "Open the hub, tap the photo button, then choose this tool again.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            if (isRunning) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    CircularProgressIndicator()
                }
            }

            report?.let { result ->
                VerdictCard(result)

                SettingsCard(title = "Signal breakdown") {
                    SignalRow(
                        label = "Smoothness",
                        value = result.smoothnessScore,
                        hint = "Share of unnaturally flat pixels"
                    )
                    SignalRow(
                        label = "Colour punch",
                        value = result.saturationScore,
                        hint = "Average saturation"
                    )
                    SignalRow(
                        label = "Grain",
                        value = result.noiseScore,
                        hint = "Sensor noise floor"
                    )
                    SignalRow(
                        label = "Edge spread",
                        value = result.edgeScore,
                        hint = "Density of strong edges"
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Analysed in ${result.elapsedMs} ms on device.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                if (bitmap != null) {
                    Button(
                        onClick = {
                            scope.launch {
                                isRunning = true
                                bitmap?.let { report = AiEngine.detectAi(it) }
                                isRunning = false
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Re-run analysis")
                    }
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Disclaimer",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "This is a statistical estimate, not proof. Compression, editing, " +
                            "screenshots and generators outside the training distribution all shift " +
                            "the score. Treat it as a hint, never as evidence.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Composable
private fun VerdictCard(report: AiEngine.DetectionReport) {
    val accent = when (report.verdict) {
        AiEngine.Verdict.LIKELY_AI -> MaterialTheme.colorScheme.error
        AiEngine.Verdict.LIKELY_HUMAN -> MaterialTheme.colorScheme.tertiary
        AiEngine.Verdict.UNCERTAIN -> MaterialTheme.colorScheme.primary
    }

    SettingsCard(title = "Verdict", subtitle = "Heuristic on-device classifier") {
        Text(
            text = report.verdict.label,
            style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold),
            color = accent
        )
        Spacer(modifier = Modifier.height(10.dp))
        LinearProgressIndicator(
            progress = { report.aiProbability },
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp),
            color = accent,
            trackColor = MaterialTheme.colorScheme.surfaceVariant
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "AI likelihood ${(report.aiProbability * 100).toInt()}%",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

@Composable
private fun SignalRow(label: String, value: Float, hint: String) {
    Column(modifier = Modifier.padding(vertical = 6.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "${(value.coerceIn(0f, 1f) * 100).toInt()}%",
                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        LinearProgressIndicator(
            progress = { value.coerceIn(0f, 1f) },
            modifier = Modifier
                .fillMaxWidth()
                .height(4.dp),
            color = MaterialTheme.colorScheme.primary,
            trackColor = MaterialTheme.colorScheme.surfaceVariant
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = hint,
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
