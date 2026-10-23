package com.magickstudio.app.core.designsystem.components

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentPaste
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun FloatingPasteFab(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    expanded: Boolean = true
) {
    ExtendedFloatingActionButton(
        onClick = onClick,
        modifier = modifier,
        shape = RoundedCornerShape(20.dp),
        containerColor = MaterialTheme.colorScheme.primaryContainer,
        contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
        elevation = FloatingActionButtonDefaults.elevation(defaultElevation = 6.dp),
        icon = {
            Icon(
                imageVector = Icons.Default.ContentPaste,
                contentDescription = "Paste Image",
                modifier = Modifier.size(24.dp)
            )
        },
        text = {
            if (expanded) {
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "Paste image",
                    style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold)
                )
            }
        }
    )
}
