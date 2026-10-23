package com.magickstudio.app.core.engine

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

data class ToolDef(
    val id: String,
    val tab: String, // "edit", "create", "image", "tools"
    val title: String,
    val description: String,
    val icon: String,
    val input: String, // "single", "multi", "none", "pair"
    val route: String,
    val keywords: List<String>,
    val cliFlags: List<String>
)

object ToolRegistry {
    private var cachedTools: List<ToolDef>? = null

    fun getTools(context: Context): List<ToolDef> {
        cachedTools?.let { return it }

        val list = mutableListOf<ToolDef>()
        try {
            val jsonString = context.assets.open("tools.json").bufferedReader().use { it.readText() }
            val array = JSONArray(jsonString)
            for (i in 0 until array.length()) {
                val obj = array.getJSONObject(i)
                val keywords = mutableListOf<String>()
                val kwArray = obj.optJSONArray("keywords")
                if (kwArray != null) {
                    for (k in 0 until kwArray.length()) {
                        keywords.add(kwArray.getString(k))
                    }
                }

                val flags = mutableListOf<String>()
                val flagArray = obj.optJSONArray("cliFlags")
                if (flagArray != null) {
                    for (f in 0 until flagArray.length()) {
                        flags.add(flagArray.getString(f))
                    }
                }

                list.add(
                    ToolDef(
                        id = obj.getString("id"),
                        tab = obj.getString("tab"),
                        title = obj.getString("title"),
                        description = obj.getString("description"),
                        icon = obj.getString("icon"),
                        input = obj.getString("input"),
                        route = obj.getString("route"),
                        keywords = keywords,
                        cliFlags = flags
                    )
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        cachedTools = list
        return list
    }

    fun getToolById(context: Context, id: String): ToolDef? {
        return getTools(context).firstOrNull { it.id == id || it.route == id }
    }
}
