package com.magickstudio.app.core.designsystem.components

import android.graphics.Bitmap
import android.net.Uri
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Compare
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.ZoomIn
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.magickstudio.app.core.designsystem.theme.CardShape

@Composable
fun StickyPreviewCard(
    previewBitmap: Bitmap? = null,
    imageUri: Uri? = null,
    originalBitmap: Bitmap? = null,
    width: Int = 0,
    height: Int = 0,
    modifier: Modifier = Modifier,
    onResetClick: (() -> Unit)? = null
) {
    var showOriginal by remember { mutableStateOf(false) }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .height(260.dp),
        shape = CardShape,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainerHigh
        )
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            val bitmapToDisplay = if (showOriginal && originalBitmap != null) {
                originalBitmap
            } else {
                previewBitmap
            }

            if (bitmapToDisplay != null) {
                Image(
                    bitmap = bitmapToDisplay.asImageBitmap(),
                    contentDescription = "Image Preview",
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.fillMaxSize()
                )
            } else if (imageUri != null) {
                AsyncImage(
                    model = ImageRequest.Builder(LocalContext.current)
                        .data(imageUri)
                        .crossfade(true)
                        .build(),
                    contentDescription = "Image Preview",
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.fillMaxSize()
                )
            } else {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No image selected",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Top-left dimensions pill
            if (width > 0 && height > 0) {
                Box(
                    modifier = Modifier
                        .padding(12.dp)
                        .align(Alignment.TopStart)
                        .clip(RoundedCornerShape(50))
                        .background(MaterialTheme.colorScheme.surface.copy(alpha = 0.85f))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "$width × $height",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }

            // Top-right action controls: Compare & Reset
            Row(
                modifier = Modifier
                    .padding(12.dp)
                    .align(Alignment.TopEnd),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (originalBitmap != null && previewBitmap != null) {
                    FilledTonalIconButton(
                        onClick = { showOriginal = !showOriginal },
                        modifier = Modifier.size(36.dp),
                        colors = IconButtonDefaults.filledTonalIconButtonColors(
                            containerColor = if (showOriginal) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface.copy(alpha = 0.85f)
                        )
                    ) {
                        Icon(
                            imageVector = Icons.Default.Compare,
                            contentDescription = "Compare Before/After",
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                }

                if (onResetClick != null) {
                    FilledTonalIconButton(
                        onClick = onResetClick,
                        modifier = Modifier.size(36.dp),
                        colors = IconButtonDefaults.filledTonalIconButtonColors(
                            containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.85f)
                        )
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Reset Changes",
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            // Before/After indicator badge
            if (showOriginal) {
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 12.dp)
                        .clip(RoundedCornerShape(50))
                        .background(MaterialTheme.colorScheme.primary)
                        .padding(horizontal = 14.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "Original Image",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimary
                        )
                    )
                }
            }
        }
    }
}
