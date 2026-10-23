package com.magickstudio.app.core.designsystem.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = MauvePrimaryDark,
    secondary = MauveSecondary,
    tertiary = AccentMint,
    background = SurfaceDark,
    surface = SurfaceDark,
    surfaceContainer = SurfaceContainerDark,
    surfaceContainerHigh = SurfaceContainerHighDark,
    primaryContainer = MauveContainerDark
)

private val LightColorScheme = lightColorScheme(
    primary = MauvePrimary,
    secondary = MauveSecondary,
    tertiary = AccentMint,
    background = SurfaceLight,
    surface = SurfaceLight,
    surfaceContainer = SurfaceContainerLight,
    surfaceContainerHigh = SurfaceContainerHighLight,
    primaryContainer = MauveContainer
)

private val AmoledColorScheme = darkColorScheme(
    primary = MauvePrimaryDark,
    secondary = MauveSecondary,
    tertiary = AccentMint,
    background = AmoledBlack,
    surface = AmoledBlack,
    surfaceContainer = AmoledSurface,
    surfaceContainerHigh = AmoledContainer,
    primaryContainer = MauveContainerDark
)

@Composable
fun MagickStudioTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    amoledMode: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        amoledMode && darkTheme -> AmoledColorScheme
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        shapes = Shapes,
        content = content
    )
}
