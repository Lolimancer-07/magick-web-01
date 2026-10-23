package com.magickstudio.app.feature.rename

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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.magickstudio.app.core.designsystem.components.MagickActionBar
import com.magickstudio.app.core.designsystem.components.MagickTopBar
import com.magickstudio.app.core.designsystem.components.NumberField
import com.magickstudio.app.core.designsystem.components.SettingsCard
import com.magickstudio.app.core.designsystem.theme.CardShape
import com.magickstudio.app.core.engine.PlatformEngine

@Composable
fun BatchRenameScreen(
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current

    var pattern by remember { mutableStateOf("{name}_{index}") }
    var startIdx by remember { mutableIntStateOf(1) }
    var step by remember { mutableIntStateOf(1) }
    var padding by remember { mutableIntStateOf(3) }

    // Sample batch files to preview
    val sampleFiles = remember {
        listOf(
            "IMG_20261023_001.jpg",
            "IMG_20261023_002.jpg",
            "vacation_photo.png",
            "sunset_panorama.jpg",
            "document_scan.jpg"
        )
    }

    val renamedList by remember(pattern, startIdx, step, padding) {
        derivedStateOf {
            PlatformEngine.computeBatchRename(sampleFiles, pattern, startIdx, step, padding)
        }
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = "Batch Rename",
                onBackClick = onBackClick
            )
        },
        bottomBar = {
            MagickActionBar(
                primaryText = "Rename Files",
                secondaryText = "Reset",
                onPrimaryClick = {
                    Toast.makeText(context, "Batch pattern ready for output folder!", Toast.LENGTH_SHORT).show()
                },
                onSecondaryClick = {
                    pattern = "{name}_{index}"
                    startIdx = 1
                    step = 1
                    padding = 3
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
            // Pattern Card
            SettingsCard(
                title = "Naming Pattern",
                subtitle = "Insert dynamic tokens to format output filenames"
            ) {
                OutlinedTextField(
                    value = pattern,
                    onValueChange = { pattern = it },
                    label = { Text("Pattern") },
                    singleLine = true,
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "Quick Token Inserts:",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val tokens = listOf("{name}", "{index}", "{date}", "{ext}")
                    tokens.forEach { token ->
                        FilledTonalButton(
                            onClick = { pattern += token },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(text = token, style = MaterialTheme.typography.labelSmall)
                        }
                    }
                }
            }

            // Indexing Parameters
            SettingsCard(
                title = "Sequence Indexing",
                subtitle = "Counter parameters and zero padding"
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    NumberField(
                        value = startIdx,
                        onValueChange = { startIdx = it },
                        label = "Start Index",
                        unitSuffix = "",
                        step = 1,
                        minValue = 0,
                        modifier = Modifier.weight(1f)
                    )

                    NumberField(
                        value = step,
                        onValueChange = { step = it },
                        label = "Step",
                        unitSuffix = "",
                        step = 1,
                        minValue = 1,
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                NumberField(
                    value = padding,
                    onValueChange = { padding = it },
                    label = "Zero Padding (digits)",
                    unitSuffix = "digits",
                    step = 1,
                    minValue = 1,
                    maxValue = 8
                )
            }

            // Live Preview Table
            SettingsCard(
                title = "Live Rename Preview",
                subtitle = "Resolves duplicates automatically with (1), (2)"
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.surfaceContainerHigh, CardShape)
                        .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    renamedList.forEachIndexed { idx, (orig, renamed) ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = orig,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.weight(1f)
                            )
                            Text(
                                text = "→",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(horizontal = 8.dp)
                            )
                            Text(
                                text = renamed,
                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                                color = MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.weight(1f)
                            )
                        }
                        if (idx < renamedList.size - 1) {
                            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f))
                        }
                    }
                }
            }
        }
    }
}
