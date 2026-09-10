package com.benedictinteractive.bearagnostic

import android.content.Context
import android.os.Build
import android.os.Environment
import android.os.storage.StorageManager
import org.json.JSONArray
import java.io.File
import java.util.LinkedHashMap
import java.util.Locale

/**
 * Native guardrails for runtime contracts that must not rely on frontend behavior.
 *
 * This layer intentionally does not alter scanner algorithms. It validates scan requests
 * before they reach MainActivity and blocks destructive actions when review evidence is stale.
 */
object RuntimeContractGuard {
    const val REVIEW_SNAPSHOT_MAX_AGE_MS = 15L * 60L * 1000L

    private val ALLOWED_SCAN_MODES = setOf("smart", "quick", "deep", "custom")
    private val ALLOWED_CUSTOM_SCOPES = setOf("downloads", "photos", "videos", "documents", "music")

    data class CustomScopeDecision(
        val accepted: Boolean,
        val scopes: Set<String> = emptySet(),
        val reason: String = "",
    )

    fun normalizeScanMode(raw: String): String? {
        val normalized = raw.trim().lowercase(Locale.ROOT)
        return normalized.takeIf { it in ALLOWED_SCAN_MODES }
    }

    fun validateCustomScopes(rawJson: String): CustomScopeDecision {
        val array = try {
            JSONArray(rawJson)
        } catch (_: Exception) {
            return CustomScopeDecision(false, reason = "invalid_custom_scope")
        }

        val scopes = linkedSetOf<String>()
        for (index in 0 until array.length()) {
            val raw = array.optString(index, "").trim().lowercase(Locale.ROOT)
            if (raw.isEmpty() || raw !in ALLOWED_CUSTOM_SCOPES) {
                return CustomScopeDecision(false, reason = "invalid_custom_scope")
            }
            scopes += raw
        }

        if (scopes.isEmpty()) {
            return CustomScopeDecision(false, reason = "no_custom_scope_selected")
        }
        return CustomScopeDecision(true, scopes = scopes)
    }

    /**
     * Confirms that at least one directory represented by the selected Custom scopes
     * currently exists and is readable. This prevents the scanner's defensive internal
     * fallback from broadening a user-selected Custom request when no selected target exists.
     */
    fun hasAccessibleCustomTarget(context: Context, scopes: Set<String>): Boolean {
        if (scopes.isEmpty() || scopes.any { it !in ALLOWED_CUSTOM_SCOPES }) return false

        val roots = LinkedHashMap<String, File>()
        fun addRoot(file: File?) {
            if (file == null) return
            val canonical = try { file.canonicalFile } catch (_: Exception) { file.absoluteFile }
            if (canonical.exists() && canonical.isDirectory && canonical.canRead()) {
                roots[canonical.absolutePath] = canonical
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            context.getSystemService(StorageManager::class.java)?.storageVolumes?.forEach { addRoot(it.directory) }
        }
        @Suppress("DEPRECATION")
        addRoot(Environment.getExternalStorageDirectory())

        return roots.values.any { root ->
            scopeDirectories(root, scopes).any { directory ->
                directory.exists() && directory.isDirectory && directory.canRead()
            }
        }
    }

    fun isReviewSnapshotFresh(
        generatedAtMs: Long,
        nowMs: Long = System.currentTimeMillis(),
    ): Boolean {
        if (generatedAtMs <= 0L || nowMs < generatedAtMs) return false
        return nowMs - generatedAtMs <= REVIEW_SNAPSHOT_MAX_AGE_MS
    }

    private fun scopeDirectories(root: File, scopes: Set<String>): List<File> {
        val output = mutableListOf<File>()
        fun add(type: String) { output += File(root, type) }

        if ("downloads" in scopes) add(Environment.DIRECTORY_DOWNLOADS)
        if ("photos" in scopes) {
            add(Environment.DIRECTORY_DCIM)
            add(Environment.DIRECTORY_PICTURES)
        }
        if ("videos" in scopes) add(Environment.DIRECTORY_MOVIES)
        if ("documents" in scopes) add(Environment.DIRECTORY_DOCUMENTS)
        if ("music" in scopes) add(Environment.DIRECTORY_MUSIC)
        return output
    }
}
