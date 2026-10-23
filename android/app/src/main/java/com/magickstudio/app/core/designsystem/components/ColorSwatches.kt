package com.magickstudio.app.core.designsystem.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

data class SwatchItem(val name: String, val color: Color, val hex: String)

val DefaultSwatches = listOf(
    SwatchItem("Transparent", Color.Transparent, "none"),
    SwatchItem("White", Color.White, "#FFFFFF"),
    SwatchItem("Black", Color.Black, "#000000"),
    SwatchItem("Off White", Color(0xFFF5F5F7), "#F5F5F7"),
    SwatchItem("Mauve", Color(0xFF735BF2), "#735BF2"),
    SwatchItem("Mint", Color(0xFF28B78D), "#28B78D"),
    SwatchItem("Amber", Color(0xFFF39C12), "#F39C12"),
    SwatchItem("Dark Gray", Color(0xFF1E1E24), "#1E1E24")
)

@Composable
fun ColorSwatches(
    selectedHex: String,
    onColorSelected: (SwatchItem) -> Unit,
    modifier: Modifier = Modifier,
    swatches: List<SwatchItem> = DefaultSwatches
) {
    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = "Background Color",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface
        )
        Spacer(modifier = Modifier.height(8.dp))
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            swatches.forEach { swatch ->
                val isSelected = swatch.hex.equals(selectedHex, ignoreCase = true)
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(
                            if (swatch.color == Color.Transparent) MaterialTheme.colorScheme.surfaceContainerHigh else swatch.color
                        )
                        .border(
                            width = if (isSelected) 2.5.dp else 1.dp,
                            color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outlineVariant,
                            shape = CircleShape
                        )
                        .clickable { onColorSelected(swatch) },
                    contentAlignment = Alignment.Center
                ) {
                    if (isSelected) {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = "Selected",
                            tint = if (swatch.color == Color.Black || swatch.color == Color(0xFF1E1E24)) Color.White else Color.Black,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        }
    }
}
