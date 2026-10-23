package com.magickstudio.app.core.designsystem.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp

@Composable
fun NumberField(
    value: Int,
    onValueChange: (Int) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    unitSuffix: String = "px",
    step: Int = 10,
    minValue: Int = 1,
    maxValue: Int = 20000
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        OutlinedTextField(
            value = if (value > 0) value.toString() else "",
            onValueChange = { text ->
                val filtered = text.filter { it.isDigit() }
                val num = filtered.toIntOrNull() ?: 0
                if (num in 0..maxValue) {
                    onValueChange(num)
                }
            },
            label = { Text(label) },
            suffix = {
                Text(
                    text = unitSuffix,
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            },
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.weight(1f),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant
            )
        )

        Spacer(modifier = Modifier.width(8.dp))

        FilledTonalIconButton(
            onClick = {
                val next = (value - step).coerceAtLeast(minValue)
                onValueChange(next)
            },
            modifier = Modifier.size(44.dp)
        ) {
            Icon(imageVector = Icons.Default.Remove, contentDescription = "Decrement")
        }

        Spacer(modifier = Modifier.width(4.dp))

        FilledTonalIconButton(
            onClick = {
                val next = (value + step).coerceAtMost(maxValue)
                onValueChange(next)
            },
            modifier = Modifier.size(44.dp)
        ) {
            Icon(imageVector = Icons.Default.Add, contentDescription = "Increment")
        }
    }
}
