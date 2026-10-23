package com.magickstudio.app.core.designsystem.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SizeEstimatePill(
    originalSizeBytes: Long,
    estimatedSizeBytes: Long,
    modifier: Modifier = Modifier
) {
    if (estimatedSizeBytes <= 0L) return

    val originalText = formatFileSize(originalSizeBytes)
    val estimatedText = formatFileSize(estimatedSizeBytes)
    val ratio = if (originalSizeBytes > 0) {
        val diffPercent = ((estimatedSizeBytes - originalSizeBytes).toDouble() / originalSizeBytes * 100).toInt()
        if (diffPercent >= 0) "+$diffPercent%" else "$diffPercent%"
    } else ""

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(50))
            .background(MaterialTheme.colorScheme.primaryContainer)
            .padding(horizontal = 10.dp, vertical = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = estimatedText,
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
            if (ratio.isNotEmpty()) {
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "($ratio)",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontSize = 9.sp,
                        color = MaterialTheme.colorScheme.primary
                    )
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MagickTopBar(
    title: String,
    onBackClick: (() -> Unit)? = null,
    originalSizeBytes: Long = 0L,
    estimatedSizeBytes: Long = 0L,
    onShareClick: (() -> Unit)? = null,
    onInfoClick: (() -> Unit)? = null,
    actions: @Composable () -> Unit = {}
) {
    TopAppBar(
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                    maxLines = 1
                )
                if (estimatedSizeBytes > 0L) {
                    Spacer(modifier = Modifier.width(8.dp))
                    SizeEstimatePill(
                        originalSizeBytes = originalSizeBytes,
                        estimatedSizeBytes = estimatedSizeBytes
                    )
                }
            }
        },
        navigationIcon = {
            if (onBackClick != null) {
                IconButton(onClick = onBackClick) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back"
                    )
                }
            }
        },
        actions = {
            if (onShareClick != null) {
                IconButton(onClick = onShareClick) {
                    Icon(imageVector = Icons.Default.Share, contentDescription = "Share")
                }
            }
            if (onInfoClick != null) {
                IconButton(onClick = onInfoClick) {
                    Icon(imageVector = Icons.Default.Info, contentDescription = "Info")
                }
            }
            actions()
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    )
}

fun formatFileSize(bytes: Long): String {
    if (bytes <= 0) return "0 B"
    val kb = bytes / 1024.0
    val mb = kb / 1024.0
    return when {
        mb >= 1.0 -> String.format("%.2f MB", mb)
        kb >= 1.0 -> String.format("%.1f KB", kb)
        else -> "$bytes B"
    }
}
