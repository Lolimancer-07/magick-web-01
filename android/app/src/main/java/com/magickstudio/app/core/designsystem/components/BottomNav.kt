package com.magickstudio.app.core.designsystem.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Image
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector

enum class NavTab(val id: String, val title: String, val icon: ImageVector) {
    EDIT("edit", "Edit", Icons.Default.Edit),
    CREATE("create", "Create", Icons.Default.AutoAwesome),
    IMAGE("image", "Image", Icons.Default.Image),
    TOOLS("tools", "Tools", Icons.Default.Build)
}

@Composable
fun MagickBottomNav(
    selectedTab: NavTab,
    onTabSelected: (NavTab) -> Unit,
    modifier: Modifier = Modifier
) {
    NavigationBar(
        modifier = modifier,
        containerColor = MaterialTheme.colorScheme.surfaceContainer
    ) {
        NavTab.entries.forEach { tab ->
            val selected = tab == selectedTab
            NavigationBarItem(
                selected = selected,
                onClick = { onTabSelected(tab) },
                icon = {
                    Icon(
                        imageVector = tab.icon,
                        contentDescription = tab.title
                    )
                },
                label = {
                    Text(
                        text = tab.title,
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            )
        }
    }
}
