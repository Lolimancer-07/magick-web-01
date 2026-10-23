package com.magickstudio.app.core.designsystem.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

// 24dp to 28dp rounded corners matching reference screenshots
val Shapes = Shapes(
    extraSmall = RoundedCornerShape(8.dp),
    small = RoundedCornerShape(12.dp),
    medium = RoundedCornerShape(20.dp),
    large = RoundedCornerShape(24.dp),
    extraLarge = RoundedCornerShape(28.dp)
)

val CardShape = RoundedCornerShape(24.dp)
val PillShape = RoundedCornerShape(50)
val SheetShape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)
