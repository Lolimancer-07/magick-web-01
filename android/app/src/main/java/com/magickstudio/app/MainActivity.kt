package com.magickstudio.app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.magickstudio.app.core.designsystem.theme.MagickStudioTheme
import com.magickstudio.app.feature.hub.HubScreen
import com.magickstudio.app.feature.resizeconvert.ResizeConvertScreen
import com.magickstudio.app.feature.singleedit.SingleEditScreen
import com.magickstudio.app.feature.tools.ToolDetailScreen

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val initialUri = extractImageUri(intent)

        setContent {
            MagickStudioTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MagickStudioApp(initialImageUri = initialUri)
                }
            }
        }
    }

    private fun extractImageUri(intent: Intent?): Uri? {
        if (intent == null) return null
        return when (intent.action) {
            Intent.ACTION_SEND -> {
                intent.getParcelableExtra(Intent.EXTRA_STREAM)
            }
            Intent.ACTION_VIEW, Intent.ACTION_EDIT -> {
                intent.data
            }
            else -> null
        }
    }
}

@Composable
fun MagickStudioApp(initialImageUri: Uri?) {
    val navController = rememberNavController()
    var currentImageUri by remember { mutableStateOf(initialImageUri) }

    val startDestination = if (initialImageUri != null) "single-edit" else "hub"

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable("hub") {
            HubScreen(
                onToolClick = { tool ->
                    when (tool.id) {
                        "single-edit" -> navController.navigate("single-edit")
                        "resize-convert" -> navController.navigate("resize-convert")
                        else -> navController.navigate("tool/${tool.id}")
                    }
                },
                onImageSelected = { uri ->
                    currentImageUri = uri
                    navController.navigate("single-edit")
                }
            )
        }

        composable("single-edit") {
            SingleEditScreen(
                imageUri = currentImageUri,
                onBackClick = { navController.popBackStack() }
            )
        }

        composable("resize-convert") {
            ResizeConvertScreen(
                imageUri = currentImageUri,
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(
            route = "tool/{toolId}",
            arguments = listOf(navArgument("toolId") { type = NavType.StringType })
        ) { backStackEntry ->
            val toolId = backStackEntry.arguments?.getString("toolId") ?: "all-options"
            ToolDetailScreen(
                toolId = toolId,
                imageUri = currentImageUri,
                onBackClick = { navController.popBackStack() }
            )
        }
    }
}
