package com.benedictinteractive.bearagnostic

import android.content.Context
import android.os.Build
import android.os.Environment
import android.os.storage.StorageManager
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.nio.file.Files
import java.util.ArrayDeque
import java.util.LinkedHashMap
import java.util.Locale
import java.util.concurrent.Executors

/**
 * Dedicated Review-First engine for empty shared-storage folders.
 *
 * It never treats "empty" as "junk", never auto-selects anything, and never reuses the
 * file-deletion path. Deletion is allowed only for an ID from the current in-memory
 * folder snapshot. Every directory is revalidated immediately before deletion and
 * File.delete() must confirm the directory is absent afterwards.
 */
class EmptyFolderManager(private val context: Context) {
    private data class Candidate(
        val id: String,
        val path: String,
        val name: String,
        val location: String,
        val modifiedMs: Long,
        val depth: Int,
    )

    private data class Snapshot(
        val generatedAtMs: Long,
        val items: LinkedHashMap<String, Candidate>,
        val visitedFolders: Long,
        val protectedEmptyFolders: Long,
        val inaccessibleFolders: Long,
        val truncated: Boolean,
    )

    private val executor = Executors.newSingleThreadExecutor { runnable ->
        Thread(runnable, "BearagnosticEmptyFolders").apply {
            priority = Thread.NORM_PRIORITY - 1
            isDaemon = true
        }
    }

    @Volatile private var running = false
    @Volatile private var visitedFolders = 0L
    @Volatile private var protectedEmptyFolders = 0L
    @Volatile private var inaccessibleFolders = 0L
    @Volatile private var lastError: String? = null
    @Volatile private var snapshot: Snapshot? = null

    @Synchronized
    fun start(): String {
        if (running) return rejected("folder_scan_running")
        running = true
        visitedFolders = 0L
        protectedEmptyFolders = 0L
        inaccessibleFolders = 0L
        lastError = null
        snapshot = null
        executor.execute(::scan)
        return JSONObject().apply {
            put("accepted", true)
            put("running", true)
        }.toString()
    }

    fun summaryJson(): String {
        val current = snapshot
        return JSONObject().apply {
            put("running", running)
            put("visitedFolders", visitedFolders)
            put("protectedEmptyFolders", protectedEmptyFolders)
            put("inaccessibleFolders", inaccessibleFolders)
            lastError?.let { put("error", it) }
            if (current == null) {
                put("available", false)
                put("candidateCount", 0)
                put("state", if (running) "running" else if (lastError != null) "error" else "idle")
            } else {
                put("available", true)
                put("state", "ready")
                put("generatedAtMs", current.generatedAtMs)
                put("candidateCount", current.items.size)
                put("visitedFolders", current.visitedFolders)
                put("protectedEmptyFolders", current.protectedEmptyFolders)
                put("inaccessibleFolders", current.inaccessibleFolders)
                put("detailsTruncated", current.truncated)
                put("maxDeleteSelection", MAX_DELETE_SELECTION)
                put("scope", "accessible_shared_storage")
            }
        }.toString()
    }

    fun candidatesJson(offset: Int, limit: Int): String {
        val current = snapshot ?: return JSONObject().apply {
            put("available", false)
            put("items", JSONArray())
            put("totalCount", 0)
        }.toString()
        val values = current.items.values.toList()
            .sortedWith(compareBy<Candidate> { it.location.lowercase(Locale.ROOT) }.thenBy { it.name.lowercase(Locale.ROOT) })
        val safeOffset = offset.coerceAtLeast(0).coerceAtMost(values.size)
        val safeLimit = limit.coerceIn(1, MAX_PAGE_SIZE)
        val end = (safeOffset + safeLimit).coerceAtMost(values.size)
        val items = JSONArray()
        for (index in safeOffset until end) {
            val item = values[index]
            items.put(JSONObject().apply {
                put("id", item.id)
                put("name", item.name)
                put("location", item.location)
                put("modifiedMs", item.modifiedMs)
                put("depth", item.depth)
            })
        }
        return JSONObject().apply {
            put("available", true)
            put("offset", safeOffset)
            put("returnedCount", items.length())
            put("totalCount", values.size)
            put("hasMore", end < values.size)
            put("detailsTruncated", current.truncated)
            put("items", items)
        }.toString()
    }

    @Synchronized
    fun delete(idsJson: String): String {
        if (running) return rejected("folder_scan_running")
        val current = snapshot ?: return rejected("no_folder_snapshot")
        if (!RuntimeContractGuard.isReviewSnapshotFresh(current.generatedAtMs)) {
            return JSONObject().apply {
                put("accepted", false)
                put("reason", "stale_review_snapshot")
                put("maxAgeMs", RuntimeContractGuard.REVIEW_SNAPSHOT_MAX_AGE_MS)
            }.toString()
        }

        val requested = LinkedHashSet<String>()
        try {
            val array = JSONArray(idsJson)
            for (index in 0 until array.length()) {
                val id = array.optString(index).trim()
                if (id.isNotEmpty() && current.items.containsKey(id)) requested += id
                if (requested.size >= MAX_DELETE_SELECTION) break
            }
        } catch (_: Exception) {
            return rejected("invalid_selection")
        }
        if (requested.isEmpty()) return rejected("empty_selection")

        // Deepest first is conservative if nested candidates ever become representable.
        val selected = requested.mapNotNull(current.items::get).sortedByDescending { it.depth }
        val remaining = LinkedHashMap(current.items)
        val deletedIds = JSONArray()
        val failed = JSONArray()
        var deletedCount = 0
        var becameNonEmptyCount = 0
        var protectedCount = 0

        val roots = discoverRoots()
        for (candidate in selected) {
            // Keep the original snapshot path long enough to reject a directory that was
            // replaced by a symbolic link after the scan. Canonicalization must not hide that.
            val snapshotPath = File(candidate.path)
            val snapshotPathIsLink = isSymbolicLink(snapshotPath)
            val folder = canonicalFile(snapshotPath)
            val root = roots.firstOrNull { isWithin(folder, it) }
            val failureReason = when {
                snapshotPathIsLink -> "protected_path"
                root == null || !isSafeCandidate(folder, root) -> "protected_path"
                !snapshotPath.exists() || !snapshotPath.isDirectory -> "missing"
                else -> {
                    // Re-check the original path and live children immediately before delete.
                    // If anything appeared, or the path changed into a link, refuse deletion.
                    if (isSymbolicLink(snapshotPath)) {
                        "protected_path"
                    } else {
                        val children = try { snapshotPath.listFiles() } catch (_: SecurityException) { null }
                        when {
                            children == null -> "unreadable"
                            children.isNotEmpty() -> "folder_not_empty"
                            isSymbolicLink(snapshotPath) -> "protected_path"
                            else -> null
                        }
                    }
                }
            }

            if (failureReason != null) {
                if (failureReason == "folder_not_empty") becameNonEmptyCount++
                if (failureReason == "protected_path") protectedCount++
                failed.put(JSONObject().apply {
                    put("id", candidate.id)
                    put("name", candidate.name)
                    put("reason", failureReason)
                })
                continue
            }

            val deleted = try { snapshotPath.delete() && !snapshotPath.exists() } catch (_: Exception) { false }
            if (deleted) {
                deletedCount++
                deletedIds.put(candidate.id)
                remaining.remove(candidate.id)
            } else {
                failed.put(JSONObject().apply {
                    put("id", candidate.id)
                    put("name", candidate.name)
                    put("reason", "delete_failed")
                })
            }
        }

        snapshot = current.copy(items = remaining)
        return JSONObject().apply {
            put("accepted", true)
            put("deletionPerformed", deletedCount > 0)
            put("deletedCount", deletedCount)
            put("becameNonEmptyCount", becameNonEmptyCount)
            put("protectedCount", protectedCount)
            put("failedCount", failed.length())
            put("deletedIds", deletedIds)
            put("failed", failed)
            // Empty folders do not get a reclaimed-space claim. The product reports only verified removals.
            put("reviewSummary", JSONObject(summaryJson()))
        }.toString()
    }

    private fun scan() {
        val candidates = LinkedHashMap<String, Candidate>()
        var truncated = false
        try {
            val roots = discoverRoots()
            if (roots.isEmpty()) {
                lastError = "no_accessible_storage"
                return
            }
            var nextId = 1
            for (root in roots) {
                val queue = ArrayDeque<File>()
                queue.add(root)
                while (queue.isNotEmpty()) {
                    val queued = queue.removeFirst()
                    if (isSymbolicLink(queued)) continue
                    val current = canonicalFile(queued)
                    if (isSymbolicLink(queued) || !current.exists() || !current.isDirectory) continue
                    if (!isWithin(current, root)) continue
                    if (shouldSkipTraversal(current, root)) continue

                    visitedFolders++
                    val children = try { current.listFiles() } catch (_: SecurityException) { null }
                    if (children == null) {
                        inaccessibleFolders++
                        continue
                    }
                    if (children.isEmpty()) {
                        if (isSafeCandidate(current, root)) {
                            if (candidates.size < MAX_CANDIDATES) {
                                val id = "d${nextId++}"
                                candidates[id] = Candidate(
                                    id = id,
                                    path = current.absolutePath,
                                    name = current.name.ifBlank { "(unnamed folder)" },
                                    location = displayParentLocation(current, root),
                                    modifiedMs = safeModified(current),
                                    depth = relativeSegments(current, root).size,
                                )
                            } else {
                                truncated = true
                            }
                        } else if (current != root) {
                            protectedEmptyFolders++
                        }
                        continue
                    }
                    for (child in children) {
                        if (child.isDirectory && !isSymbolicLink(child)) queue.addLast(child)
                    }
                }
            }
            snapshot = Snapshot(
                generatedAtMs = System.currentTimeMillis(),
                items = candidates,
                visitedFolders = visitedFolders,
                protectedEmptyFolders = protectedEmptyFolders,
                inaccessibleFolders = inaccessibleFolders,
                truncated = truncated,
            )
        } catch (_: Throwable) {
            lastError = "folder_scan_failed"
        } finally {
            running = false
        }
    }

    private fun discoverRoots(): List<File> {
        val unique = LinkedHashMap<String, File>()
        fun add(file: File?) {
            if (file == null) return
            val canonical = canonicalFile(file)
            if (canonical.exists() && canonical.isDirectory && canonical.canRead()) unique[canonical.absolutePath] = canonical
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            context.getSystemService(StorageManager::class.java)?.storageVolumes?.forEach { add(it.directory) }
        }
        @Suppress("DEPRECATION")
        add(Environment.getExternalStorageDirectory())
        return unique.values.toList()
    }

    private fun isSafeCandidate(folder: File, root: File): Boolean {
        if (!isWithin(folder, root)) return false
        if (folder == root || isSymbolicLink(folder)) return false
        if (!folder.canRead() || !folder.canWrite()) return false
        val parent = folder.parentFile ?: return false
        if (!parent.canWrite()) return false
        val relativeSegments = relativeSegments(folder, root)
        // Never offer a shared-storage root or a top-level public/system directory for deletion.
        if (relativeSegments.size < 2) return false
        if (relativeSegments.any { it.startsWith('.') }) return false
        val lower = relativeSegments.map { it.lowercase(Locale.ROOT) }
        if (lower.firstOrNull() == "android" || lower.firstOrNull() == "lost.dir") return false
        return true
    }

    private fun shouldSkipTraversal(folder: File, root: File): Boolean {
        if (folder == root) return false
        val segments = relativeSegments(folder, root)
        if (segments.isEmpty()) return false
        val lower = segments.map { it.lowercase(Locale.ROOT) }
        if (lower.first() == "android" || lower.first() == "lost.dir") return true
        // Hidden control trees are deliberately outside Empty Folders review.
        return segments.any { it.startsWith('.') }
    }

    private fun relativeSegments(folder: File, root: File): List<String> {
        val rootPath = canonicalFile(root).absolutePath.trimEnd(File.separatorChar)
        val path = canonicalFile(folder).absolutePath
        if (path == rootPath || !path.startsWith(rootPath + File.separator)) return emptyList()
        return path.removePrefix(rootPath + File.separator).split(File.separatorChar).filter { it.isNotBlank() }
    }

    private fun displayParentLocation(folder: File, root: File): String {
        val segments = relativeSegments(folder, root)
        if (segments.size <= 1) return "Shared storage"
        return segments.dropLast(1).joinToString("/").take(MAX_LOCATION_CHARS)
    }

    private fun isWithin(file: File, root: File): Boolean {
        val rootPath = canonicalFile(root).absolutePath.trimEnd(File.separatorChar)
        val path = canonicalFile(file).absolutePath
        return path == rootPath || path.startsWith(rootPath + File.separator)
    }

    private fun canonicalFile(file: File): File = try { file.canonicalFile } catch (_: Exception) { file.absoluteFile }
    private fun isSymbolicLink(file: File): Boolean = try { Files.isSymbolicLink(file.toPath()) } catch (_: Exception) { true }
    private fun safeModified(file: File): Long = try { file.lastModified().coerceAtLeast(0L) } catch (_: Exception) { 0L }

    private fun rejected(reason: String): String = JSONObject().apply {
        put("accepted", false)
        put("reason", reason)
    }.toString()

    companion object {
        const val MAX_CANDIDATES = 2_000
        const val MAX_PAGE_SIZE = 250
        const val MAX_DELETE_SELECTION = 100
        private const val MAX_LOCATION_CHARS = 180
    }
}
