package com.benedictinteractive.bearagnostic

import android.content.Context
import android.util.AtomicFile
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.nio.charset.StandardCharsets
import java.security.MessageDigest

/**
 * Aggregate-only, on-device history for Bearagnostic Insights.
 *
 * The store intentionally never persists file names, paths, review IDs, hashes,
 * or file contents. It keeps only bounded scan totals and verified cleanup totals.
 */
class LocalHistoryStore(context: Context) {
    private val atomicFile = AtomicFile(File(context.applicationContext.filesDir, FILE_NAME))
    private val lock = Any()

    fun recordScan(scanJson: String, storageSnapshotJson: String): String = synchronized(lock) {
        val scan = try { JSONObject(scanJson) } catch (_: Exception) {
            return@synchronized rejected("invalid_scan_result")
        }
        if (scan.optString("state") != "complete") return@synchronized rejected("scan_not_complete")

        val now = System.currentTimeMillis()
        val record = JSONObject().apply {
            put("capturedAtMs", now)
            put("scanMode", safeText(scan.optString("scanMode"), 24, "unknown"))
            put("scope", safeText(scan.optString("scope"), 48, "unknown"))
            put("coverageStatus", safeText(scan.optString("coverageStatus"), 48, "unknown"))
            put("analysisDepth", safeText(scan.optString("analysisDepth"), 96, "unknown"))
            put("reviewedFiles", positive(scan, "reviewedFiles"))
            put("directoriesVisited", positive(scan, "directoriesVisited"))
            put("totalBytes", positive(scan, "totalBytes"))
            put("largeFiles", positive(scan, "largeFiles"))
            put("largeFileBytes", positive(scan, "largeFileBytes"))
            put("olderFiles", positive(scan, "olderFiles"))
            put("olderFileBytes", positive(scan, "olderFileBytes"))
            put("zeroByteFiles", positive(scan, "zeroByteFiles"))
            put("emptyFolders", positive(scan, "emptyFolders"))
            put("temporaryArtifactFiles", positive(scan, "temporaryArtifactFiles"))
            put("temporaryArtifactBytes", positive(scan, "temporaryArtifactBytes"))
            put("apkInstallerFiles", positive(scan, "apkInstallerFiles"))
            put("apkInstallerBytes", positive(scan, "apkInstallerBytes"))
            put("archiveFiles", positive(scan, "archiveFiles"))
            put("archiveBytes", positive(scan, "archiveBytes"))
            put("screenshotFiles", positive(scan, "screenshotFiles"))
            put("screenshotBytes", positive(scan, "screenshotBytes"))
            put("imageFiles", positive(scan, "imageFiles"))
            put("imageBytes", positive(scan, "imageBytes"))
            put("videoFiles", positive(scan, "videoFiles"))
            put("videoBytes", positive(scan, "videoBytes"))
            put("audioFiles", positive(scan, "audioFiles"))
            put("audioBytes", positive(scan, "audioBytes"))
            put("documentFiles", positive(scan, "documentFiles"))
            put("documentBytes", positive(scan, "documentBytes"))
            put("downloadFiles", positive(scan, "downloadFiles"))
            put("downloadBytes", positive(scan, "downloadBytes"))
            put("hiddenFiles", positive(scan, "hiddenFiles"))
            put("hiddenBytes", positive(scan, "hiddenBytes"))
            put("duplicateGroups", positive(scan, "duplicateGroups"))
            put("duplicateCopies", positive(scan, "duplicateCopies"))
            put("duplicateReclaimableBytes", positive(scan, "duplicateReclaimableBytes"))
            put("reviewCandidateCount", positive(scan, "reviewCandidateCount"))
            put("autoCleanCandidateCount", positive(scan, "autoCleanCandidateCount"))
            put("autoCleanCandidateBytes", positive(scan, "autoCleanCandidateBytes"))
            put("durationMs", positive(scan, "durationMs"))
            put("detailsTruncated", scan.optBoolean("reviewDetailsTruncated", false))
            put("sourceVersionCode", BuildConfig.VERSION_CODE)
            put("comparable", scan.optString("scope") == FULL_SCOPE)
        }

        val storage = try { JSONObject(storageSnapshotJson) } catch (_: Exception) { JSONObject() }
        if (storage.optBoolean("available", false)) {
            record.put("deviceStorage", JSONObject().apply {
                put("scope", safeText(storage.optString("scope"), 48, "primary_shared_storage"))
                put("totalBytes", positive(storage, "totalBytes"))
                put("usedBytes", positive(storage, "usedBytes"))
                put("availableBytes", positive(storage, "availableBytes"))
            })
        }

        val recordFingerprint = fingerprint(record)
        val root = loadRoot()
        val scans = root.optJSONArray("scans") ?: JSONArray()
        val last = if (scans.length() > 0) scans.optJSONObject(scans.length() - 1) else null
        if (last != null && fingerprint(last) == recordFingerprint &&
            now - last.optLong("capturedAtMs", 0L) in 0..DUPLICATE_CAPTURE_WINDOW_MS
        ) {
            return@synchronized JSONObject().apply {
                put("accepted", true)
                put("recorded", false)
                put("reason", "duplicate_capture")
                put("scanCount", scans.length())
            }.toString()
        }

        scans.put(record)
        root.put("scans", trimTail(scans, MAX_SCAN_RECORDS))
        root.put("schemaVersion", SCHEMA_VERSION)
        if (!saveRoot(root)) return@synchronized rejected("history_write_failed")
        JSONObject().apply {
            put("accepted", true)
            put("recorded", true)
            put("scanCount", root.optJSONArray("scans")?.length() ?: 0)
        }.toString()
    }

    fun recordFileCleanup(resultJson: String): String =
        recordCleanup(resultJson, "files", includeReclaimedBytes = true)

    fun recordEmptyFolderCleanup(resultJson: String): String =
        recordCleanup(resultJson, "empty_folders", includeReclaimedBytes = false)

    fun historyJson(entitlement: EntitlementManager): String = synchronized(lock) {
        val root = loadRoot()
        val allScans = root.optJSONArray("scans") ?: JSONArray()
        val allCleanups = root.optJSONArray("cleanups") ?: JSONArray()
        val hasHistory = entitlement.has(EntitlementManager.Capability.INSIGHTS_HISTORY)
        val hasWhatChanged = entitlement.has(EntitlementManager.Capability.WHAT_CHANGED)
        val hasCleanupHistory = entitlement.has(EntitlementManager.Capability.FULL_CLEANUP_HISTORY)

        val latest = if (allScans.length() > 0) allScans.optJSONObject(allScans.length() - 1) else null
        val scans = if (hasHistory) copyArray(allScans) else JSONArray().apply { if (latest != null) put(JSONObject(latest.toString())) }
        val cleanups = if (hasCleanupHistory) copyArray(allCleanups) else JSONArray()

        val verifiedCleanupCount = countCleanupDeleted(allCleanups)
        val verifiedCleanupBytes = sumCleanupBytes(allCleanups)

        JSONObject().apply {
            put("available", latest != null)
            put("schemaVersion", SCHEMA_VERSION)
            put("localOnly", true)
            put("aggregateOnly", true)
            put("retainedScanLimit", MAX_SCAN_RECORDS)
            put("retainedCleanupLimit", MAX_CLEANUP_RECORDS)
            put("scanCount", allScans.length())
            put("cleanupEventCount", allCleanups.length())
            put("verifiedCleanupCount", verifiedCleanupCount)
            put("verifiedCleanupBytes", verifiedCleanupBytes)
            put("latest", latest?.let { JSONObject(it.toString()) } ?: JSONObject.NULL)
            put("scans", scans)
            put("cleanups", cleanups)
            put("access", JSONObject().apply {
                put("history", hasHistory)
                put("whatChanged", hasWhatChanged)
                put("cleanupHistory", hasCleanupHistory)
            })
        }.toString()
    }

    fun clear(): String = synchronized(lock) {
        val fresh = freshRoot()
        if (!saveRoot(fresh)) return@synchronized rejected("history_write_failed")
        JSONObject().apply {
            put("accepted", true)
            put("cleared", true)
        }.toString()
    }

    private fun recordCleanup(resultJson: String, kind: String, includeReclaimedBytes: Boolean): String = synchronized(lock) {
        val result = try { JSONObject(resultJson) } catch (_: Exception) {
            return@synchronized rejected("invalid_cleanup_result")
        }
        if (!result.optBoolean("accepted", false)) return@synchronized rejected("cleanup_not_accepted")
        val deletedCount = positive(result, "deletedCount")
        if (deletedCount <= 0L) {
            return@synchronized JSONObject().apply {
                put("accepted", true)
                put("recorded", false)
                put("reason", "nothing_deleted")
            }.toString()
        }

        val now = System.currentTimeMillis()
        val event = JSONObject().apply {
            put("capturedAtMs", now)
            put("kind", kind)
            put("deletedCount", deletedCount)
            put("reclaimedBytes", if (includeReclaimedBytes) positive(result, "reclaimedBytes") else 0L)
            put("protectedCount", arrayLength(result, "protectedIds"))
            put("failedCount", arrayLength(result, "failed"))
            put("verified", true)
            put("sourceVersionCode", BuildConfig.VERSION_CODE)
        }
        val eventFingerprint = fingerprint(event)
        val root = loadRoot()
        val cleanups = root.optJSONArray("cleanups") ?: JSONArray()
        val last = if (cleanups.length() > 0) cleanups.optJSONObject(cleanups.length() - 1) else null
        if (last != null && fingerprint(last) == eventFingerprint &&
            now - last.optLong("capturedAtMs", 0L) in 0..DUPLICATE_CAPTURE_WINDOW_MS
        ) {
            return@synchronized JSONObject().apply {
                put("accepted", true)
                put("recorded", false)
                put("reason", "duplicate_capture")
            }.toString()
        }

        cleanups.put(event)
        root.put("cleanups", trimTail(cleanups, MAX_CLEANUP_RECORDS))
        root.put("schemaVersion", SCHEMA_VERSION)
        if (!saveRoot(root)) return@synchronized rejected("history_write_failed")
        JSONObject().apply {
            put("accepted", true)
            put("recorded", true)
            put("cleanupEventCount", root.optJSONArray("cleanups")?.length() ?: 0)
        }.toString()
    }

    private fun loadRoot(): JSONObject {
        return try {
            atomicFile.openRead().use { input ->
                val text = input.readBytes().toString(StandardCharsets.UTF_8)
                val parsed = JSONObject(text)
                if (parsed.optInt("schemaVersion", SCHEMA_VERSION) != SCHEMA_VERSION) freshRoot() else parsed
            }
        } catch (_: Exception) {
            freshRoot()
        }
    }

    private fun saveRoot(root: JSONObject): Boolean {
        var output: java.io.FileOutputStream? = null
        return try {
            output = atomicFile.startWrite()
            output.write(root.toString().toByteArray(StandardCharsets.UTF_8))
            output.flush()
            atomicFile.finishWrite(output)
            true
        } catch (_: Exception) {
            if (output != null) atomicFile.failWrite(output)
            false
        }
    }

    private fun freshRoot(): JSONObject = JSONObject().apply {
        put("schemaVersion", SCHEMA_VERSION)
        put("scans", JSONArray())
        put("cleanups", JSONArray())
    }

    private fun trimTail(source: JSONArray, maxItems: Int): JSONArray {
        val out = JSONArray()
        val start = (source.length() - maxItems).coerceAtLeast(0)
        for (index in start until source.length()) {
            val item = source.opt(index)
            if (item != null) out.put(item)
        }
        return out
    }

    private fun copyArray(source: JSONArray): JSONArray = JSONArray(source.toString())

    private fun positive(json: JSONObject, key: String): Long = json.optLong(key, 0L).coerceAtLeast(0L)

    private fun arrayLength(json: JSONObject, key: String): Int = json.optJSONArray(key)?.length() ?: 0

    private fun safeText(value: String?, maxChars: Int, fallback: String): String =
        value?.trim()?.take(maxChars)?.ifBlank { fallback } ?: fallback

    private fun countCleanupDeleted(cleanups: JSONArray): Long {
        var total = 0L
        for (index in 0 until cleanups.length()) total = safeAdd(total, cleanups.optJSONObject(index)?.optLong("deletedCount", 0L) ?: 0L)
        return total
    }

    private fun sumCleanupBytes(cleanups: JSONArray): Long {
        var total = 0L
        for (index in 0 until cleanups.length()) total = safeAdd(total, cleanups.optJSONObject(index)?.optLong("reclaimedBytes", 0L) ?: 0L)
        return total
    }

    private fun safeAdd(a: Long, b: Long): Long {
        if (b <= 0L) return a
        return if (a > Long.MAX_VALUE - b) Long.MAX_VALUE else a + b
    }

    private fun fingerprint(json: JSONObject): String {
        val canonical = json.toString().replace(Regex("\\\"capturedAtMs\\\":\\d+,?"), "")
        val digest = MessageDigest.getInstance("SHA-256").digest(canonical.toByteArray(StandardCharsets.UTF_8))
        return digest.take(12).joinToString("") { "%02x".format(it) }
    }

    private fun rejected(reason: String): String = JSONObject().apply {
        put("accepted", false)
        put("reason", reason)
    }.toString()

    companion object {
        const val SCHEMA_VERSION = 1
        const val MAX_SCAN_RECORDS = 30
        const val MAX_CLEANUP_RECORDS = 50
        private const val FILE_NAME = "bearagnostic_local_history_v1.json"
        private const val FULL_SCOPE = "accessible_shared_storage"
        private const val DUPLICATE_CAPTURE_WINDOW_MS = 5_000L
    }
}
