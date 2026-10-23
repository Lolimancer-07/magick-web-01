package com.magickstudio.app.core.designsystem.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun MagickActionBar(
    primaryText: String,
    onPrimaryClick: () -> Unit,
    modifier: Modifier = Modifier,
    secondaryText: String? = null,
    onSecondaryClick: (() -> Unit)? = null,
    isLoading: Boolean = false,
    enabled: Boolean = true
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .shadow(elevation = 12.dp),
        color = MaterialTheme.colorScheme.surfaceContainer
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (secondaryText != null && onSecondaryClick != null) {
                FilledTonalButton(
                    onClick = onSecondaryClick,
                    shape = RoundedCornerShape(50),
                    modifier = Modifier
                        .weight(1f)
                        .height(52.dp),
                    enabled = !isLoading
                ) {
                    Text(
                        text = secondaryText,
                        style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.SemiBold)
                    )
                }
            }

            Button(
                onClick = onPrimaryClick,
                shape = RoundedCornerShape(50),
                modifier = Modifier
                    .weight(if (secondaryText != null) 1.2f else 1f)
                    .height(52.dp),
                enabled = enabled && !isLoading,
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary
                )
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(22.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                        strokeWidth = 2.5.dp
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                }
                Text(
                    text = primaryText,
                    style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold)
                )
            }
        }
    }
}
