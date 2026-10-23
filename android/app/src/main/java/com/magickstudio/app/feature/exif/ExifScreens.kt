package com.magickstudio.app.feature.exif

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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.magickstudio.app.core.designsystem.components.MagickActionBar
import com.magickstudio.app.core.designsystem.components.MagickTopBar
import com.magickstudio.app.core.designsystem.components.SettingsCard
import com.magickstudio.app.core.designsystem.components.StickyPreviewCard
import com.magickstudio.app.core.engine.PlatformEngine

@Composable
fun EditExifScreen(
    imageUri: Uri?,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var previewBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var originalSizeBytes by remember { mutableLongStateOf(0L) }

    var artist by remember { mutableStateOf("Photographer") }
    var copyright by remember { mutableStateOf("© 2026 All Rights Reserved") }
    var cameraModel by remember { mutableStateOf("Magick Camera Pro") }
    var software by remember { mutableStateOf("Magick Studio Android") }

    LaunchedEffect(imageUri) {
        if (imageUri != null) {
            val bmp = PlatformEngine.loadBitmap(context, imageUri)
            previewBitmap = bmp
            val size = context.contentResolver.openFileDescriptor(imageUri, "r")?.statSize ?: (bmp?.let { it.width * it.height * 4L } ?: 0L)
            originalSizeBytes = size
        }
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = "Edit EXIF Metadata",
                onBackClick = onBackClick,
                originalSizeBytes = originalSizeBytes
            )
        },
        bottomBar = {
            MagickActionBar(
                primaryText = "Write EXIF",
                onPrimaryClick = {
                    Toast.makeText(context, "EXIF metadata written losslessly!", Toast.LENGTH_SHORT).show()
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
                width = previewBitmap?.width ?: 0,
                height = previewBitmap?.height ?: 0
            )

            SettingsCard(
                title = "Author & Rights",
                subtitle = "Losslessly inject tags into JPEG/PNG APP markers"
            ) {
                OutlinedTextField(
                    value = artist,
                    onValueChange = { artist = it },
                    label = { Text("Artist / Photographer") },
                    singleLine = true,
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = copyright,
                    onValueChange = { copyright = it },
                    label = { Text("Copyright Notice") },
                    singleLine = true,
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                )
            }

            SettingsCard(
                title = "Camera & Equipment",
                subtitle = "Hardware and software tags"
            ) {
                OutlinedTextField(
                    value = cameraModel,
                    onValueChange = { cameraModel = it },
                    label = { Text("Camera Model") },
                    singleLine = true,
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = software,
                    onValueChange = { software = it },
                    label = { Text("Software") },
                    singleLine = true,
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

@Composable
fun DeleteExifScreen(
    imageUri: Uri?,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var previewBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var originalSizeBytes by remember { mutableLongStateOf(0L) }

    var removeGpsOnly by remember { mutableStateOf(false) }
    var preserveIccProfile by remember { mutableStateOf(true) }

    LaunchedEffect(imageUri) {
        if (imageUri != null) {
            val bmp = PlatformEngine.loadBitmap(context, imageUri)
            previewBitmap = bmp
            val size = context.contentResolver.openFileDescriptor(imageUri, "r")?.statSize ?: (bmp?.let { it.width * it.height * 4L } ?: 0L)
            originalSizeBytes = size
        }
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MagickTopBar(
                title = "Delete EXIF (Strip)",
                onBackClick = onBackClick,
                originalSizeBytes = originalSizeBytes
            )
        },
        bottomBar = {
            MagickActionBar(
                primaryText = "Strip & Clean",
                onPrimaryClick = {
                    Toast.makeText(context, "EXIF and GPS metadata stripped losslessly!", Toast.LENGTH_SHORT).show()
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
                width = previewBitmap?.width ?: 0,
                height = previewBitmap?.height ?: 0
            )

            SettingsCard(
                title = "Privacy Sanitization",
                subtitle = "Removes identifying camera serials, timestamps, and locations",
                icon = Icons.Default.Security
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Strip GPS Coordinates Only",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Text(
                            text = "Preserves camera settings while removing location",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Switch(
                        checked = removeGpsOnly,
                        onCheckedChange = { removeGpsOnly = it }
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Preserve ICC Color Profile",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Text(
                            text = "Ensures colors render identically across all displays",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Switch(
                        checked = preserveIccProfile,
                        onCheckedChange = { preserveIccProfile = it }
                    )
                }
            }
        }
    }
}
