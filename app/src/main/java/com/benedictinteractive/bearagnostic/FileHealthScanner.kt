package com.benedictinteractive.bearagnostic

import android.content.Context
import android.os.Build
import android.os.Environment
import android.os.SystemClock
import android.os.storage.StorageManager
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedInputStream
import java.io.BufferedOutputStream
import java.io.DataInputStream
import java.io.DataOutputStream
import java.io.EOFException
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.nio.file.Files
import java.security.MessageDigest
import java.util.ArrayDeque
import java.util.LinkedHashMap
import java.util.Locale
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Truth-first shared-storage scanner and review-driven cleanup engine.
 * Scanning is read-only. Deletion is exposed only for IDs issued by the most recent
 * in-memory review snapshot and requires explicit user selection/confirmation in the UI.
 *
 * QUICK  = all accessible shared storage; metadata/rule analysis only; no content reads or duplicate hashing.
 * SMART  = all accessible shared storage; metadata/rules; bounded real content sampling on every
 *          readable non-empty file; focused exact duplicate verification in high-value folders.
 * DEEP   = all accessible shared storage; metadata/rules; full streaming content read of every
 *          readable non-empty file; exact duplicate verification across the accessible scope.
 * CUSTOM = selected shared folders; metadata/rules; optional exact duplicate verification.
 *
 * No artificial delay is used. Scan duration is determined by actual filesystem work. The scanner
 * stays bounded by streaming reads and a temporary on-disk inventory that is deleted after each run.
 */
class FileHealthScanner(private val context: Context) {
    interface Listener {
        fun onProgress(json: String)
        fun onComplete(json: String)
        fun onCancelled(json: String)
        fun onError(json: String)
    }

    enum class ScanMode(val wireName: String) {
        SMART("smart"), QUICK("quick"), DEEP("deep"), CUSTOM("custom");

        companion object {
            fun fromWire(raw: String): ScanMode = entries.firstOrNull {
                it.wireName == raw.trim().lowercase(Locale.ROOT)
            } ?: SMART
        }
    }

    data class ScanRequest(
        val mode: ScanMode,
        val customScopes: Set<String> = emptySet(),
        val verifyDuplicates: Boolean = true,
    )

    private enum class ContentReadMode(val wireName: String) {
        NONE("none"), SAMPLE("sample"), FULL("full")
    }

    private data class ScanPlan(
        val targets: List<File>,
        val duplicateEligibleRoots: List<File>,
        val verifyDuplicates: Boolean,
        val contentReadMode: ContentReadMode,
        val contentReadLimitBytes: Long,
        val scope: String,
        val duplicateCoverage: String,
        val analysisDepth: String,
    )

    private data class Counters(
        var discoveredFiles: Long = 0,
        var reviewedFiles: Long = 0,
        var totalBytes: Long = 0,
        var directoriesVisited: Long = 0,
        var emptyFolders: Long = 0,
        var unreadableFiles: Long = 0,
        var inaccessibleFolders: Long = 0,
        var missingDuringScan: Long = 0,
        var contentProbedFiles: Long = 0,
        var contentProbeBytes: Long = 0,
        var contentProbeFailures: Long = 0,
        var contentExpectedBytes: Long = 0,
        var contentFullyReadFiles: Long = 0,
        var contentPartialReadFiles: Long = 0,
        var largeFiles: Long = 0,
        var largeFileBytes: Long = 0,
        var olderFiles: Long = 0,
        var olderFileBytes: Long = 0,
        var zeroByteFiles: Long = 0,
        var temporaryArtifactFiles: Long = 0,
        var temporaryArtifactBytes: Long = 0,
        var apkInstallerFiles: Long = 0,
        var apkInstallerBytes: Long = 0,
        var archiveFiles: Long = 0,
        var archiveBytes: Long = 0,
        var screenshotFiles: Long = 0,
        var screenshotBytes: Long = 0,
        var imageFiles: Long = 0,
        var imageBytes: Long = 0,
        var videoFiles: Long = 0,
        var videoBytes: Long = 0,
        var audioFiles: Long = 0,
        var audioBytes: Long = 0,
        var documentFiles: Long = 0,
        var documentBytes: Long = 0,
        var downloadFiles: Long = 0,
        var downloadBytes: Long = 0,
        var hiddenFiles: Long = 0,
        var hiddenBytes: Long = 0,
    )

    private data class CandidateBuilder(
        val path: String,
        val name: String,
        val location: String,
        var sizeBytes: Long,
        var modifiedMs: Long,
        val categories: LinkedHashSet<String> = linkedSetOf(),
        var riskLevel: Int = 0,
        var junkConfidence: Int = 0,
        var suggestedSelected: Boolean = false,
        var autoCleanEligible: Boolean = false,
        var reasonCode: String = "review",
        var duplicateGroupId: String? = null,
        var duplicateKeepSuggested: Boolean = false,
    )

    private data class ReviewCandidate(
        val id: String,
        val path: String,
        val name: String,
        val location: String,
        val sizeBytes: Long,
        val modifiedMs: Long,
        val categories: Set<String>,
        val riskLevel: Int,
        val junkConfidence: Int,
        val suggestedSelected: Boolean,
        val autoCleanEligible: Boolean,
        val reasonCode: String,
        val duplicateGroupId: String?,
        val duplicateKeepSuggested: Boolean,
    )

    private data class ReviewSnapshot(
        val generatedAtMs: Long,
        val scanMode: String,
        val items: LinkedHashMap<String, ReviewCandidate>,
        val detailsTruncated: Boolean,
    )

    private class CandidateAccumulator {
        val items = LinkedHashMap<String, CandidateBuilder>()
        var truncated = false

        fun add(
            path: String,
            name: String,
            location: String,
            sizeBytes: Long,
            modifiedMs: Long,
            category: String,
            riskLevel: Int,
            junkConfidence: Int,
            suggestedSelected: Boolean,
            autoCleanEligible: Boolean,
            reasonCode: String,
            duplicateGroupId: String? = null,
            duplicateKeepSuggested: Boolean = false,
        ) {
            val existing = items[path]
            if (existing == null && items.size >= MAX_REVIEW_CANDIDATES) {
                truncated = true
                return
            }
            val item = existing ?: CandidateBuilder(
                path = path, name = name, location = location,
                sizeBytes = sizeBytes, modifiedMs = modifiedMs,
            ).also { items[path] = it }
            item.sizeBytes = maxOf(item.sizeBytes, sizeBytes)
            if (modifiedMs > 0L) item.modifiedMs = modifiedMs
            item.categories += category
            item.riskLevel = maxOf(item.riskLevel, riskLevel)
            item.junkConfidence = maxOf(item.junkConfidence, junkConfidence)
            item.suggestedSelected = item.suggestedSelected || suggestedSelected
            item.autoCleanEligible = item.autoCleanEligible || autoCleanEligible
            if (junkConfidence >= item.junkConfidence || item.reasonCode == "review") item.reasonCode = reasonCode
            if (duplicateGroupId != null) item.duplicateGroupId = duplicateGroupId
            if (duplicateKeepSuggested) item.duplicateKeepSuggested = true
        }

        fun snapshot(mode: ScanMode): ReviewSnapshot {
            val out = LinkedHashMap<String, ReviewCandidate>(items.size)
            var index = 1
            for (builder in items.values) {
                val id = "r${index++}"
                out[id] = ReviewCandidate(
                    id = id, path = builder.path, name = builder.name, location = builder.location,
                    sizeBytes = builder.sizeBytes, modifiedMs = builder.modifiedMs,
                    categories = builder.categories.toSet(), riskLevel = builder.riskLevel,
                    junkConfidence = builder.junkConfidence, suggestedSelected = builder.suggestedSelected,
                    autoCleanEligible = builder.autoCleanEligible, reasonCode = builder.reasonCode,
                    duplicateGroupId = builder.duplicateGroupId,
                    duplicateKeepSuggested = builder.duplicateKeepSuggested,
                )
            }
            return ReviewSnapshot(System.currentTimeMillis(), mode.wireName, out, truncated)
        }
    }

    private val executor = Executors.newSingleThreadExecutor { runnable ->
        Thread(runnable, "BearagnosticFileScanner").apply { priority = Thread.NORM_PRIORITY - 1 }
    }
    private val cancelRequested = AtomicBoolean(false)

    @Volatile private var running = false
    @Volatile private var reviewSnapshot: ReviewSnapshot? = null

    fun isRunning(): Boolean = running

    @Synchronized
    fun start(request: ScanRequest, listener: Listener): Boolean {
        if (running) return false
        running = true
        cancelRequested.set(false)
        executor.execute { runScan(request, listener) }
        return true
    }

    fun reviewSummaryJson(): String = reviewSummaryObject(reviewSnapshot).toString()

    fun reviewCandidatesJson(category: String, offset: Int, limit: Int): String {
        val snapshot = reviewSnapshot
        if (snapshot == null) return JSONObject().apply {
            put("available", false); put("items", JSONArray()); put("totalCount", 0)
        }.toString()
        val normalized = category.trim().lowercase(Locale.ROOT)
        val filtered = snapshot.items.values.filter { candidateMatchesCategory(it, normalized) }.let { list ->
            when (normalized) {
                "large" -> list.sortedByDescending { it.sizeBytes }
                "old" -> list.sortedWith(compareBy<ReviewCandidate> { if (it.modifiedMs <= 0L) Long.MAX_VALUE else it.modifiedMs }.thenByDescending { it.sizeBytes })
                "duplicates" -> list.sortedWith(compareBy<ReviewCandidate> { it.duplicateGroupId ?: "" }.thenBy { it.duplicateKeepSuggested }.thenByDescending { it.sizeBytes })
                else -> list.sortedByDescending { it.sizeBytes }
            }
        }
        val safeOffset = offset.coerceAtLeast(0).coerceAtMost(filtered.size)
        val safeLimit = limit.coerceIn(1, MAX_REVIEW_PAGE_SIZE)
        val end = (safeOffset + safeLimit).coerceAtMost(filtered.size)
        val array = JSONArray()
        for (i in safeOffset until end) array.put(candidateJson(filtered[i]))
        return JSONObject().apply {
            put("available", true)
            put("category", normalized)
            put("offset", safeOffset)
            put("returnedCount", array.length())
            put("totalCount", filtered.size)
            put("hasMore", end < filtered.size)
            put("detailsTruncated", snapshot.detailsTruncated)
            put("items", array)
        }.toString()
    }

    @Synchronized
    fun deleteReviewCandidates(idsJson: String): String {
        if (running) return JSONObject().apply { put("accepted", false); put("reason", "scan_running") }.toString()
        val snapshot = reviewSnapshot ?: return JSONObject().apply { put("accepted", false); put("reason", "no_review_snapshot") }.toString()
        val ids = LinkedHashSet<String>()
        try {
            val array = JSONArray(idsJson)
            for (i in 0 until array.length()) {
                val id = array.optString(i).trim()
                if (id.isNotEmpty() && snapshot.items.containsKey(id)) ids += id
                if (ids.size >= MAX_DELETE_SELECTION) break
            }
        } catch (_: Exception) {
            return JSONObject().apply { put("accepted", false); put("reason", "invalid_selection") }.toString()
        }
        if (ids.isEmpty()) return JSONObject().apply { put("accepted", false); put("reason", "empty_selection") }.toString()

        val protectedIds = LinkedHashSet<String>()
        val groups = snapshot.items.values.filter { it.duplicateGroupId != null }.groupBy { it.duplicateGroupId!! }
        for ((_, members) in groups) {
            val existing = members.filter { File(it.path).exists() }
            if (existing.isNotEmpty() && existing.all { it.id in ids }) {
                val keep = existing.firstOrNull { it.duplicateKeepSuggested } ?: existing.first()
                ids.remove(keep.id)
                protectedIds += keep.id
            }
        }

        var deletedCount = 0
        var reclaimedBytes = 0L
        val deletedIds = JSONArray()
        val failed = JSONArray()
        val remaining = LinkedHashMap(snapshot.items)
        for (id in ids) {
            val candidate = snapshot.items[id] ?: continue
            val file = File(candidate.path)
            val before = safeLength(file) ?: candidate.sizeBytes
            val deleted = try { file.exists() && file.isFile && file.delete() && !file.exists() } catch (_: Exception) { false }
            if (deleted) {
                deletedCount++
                reclaimedBytes = safeAdd(reclaimedBytes, before)
                deletedIds.put(id)
                remaining.remove(id)
            } else {
                failed.put(JSONObject().apply { put("id", id); put("name", candidate.name); put("reason", "delete_failed") })
            }
        }
        reviewSnapshot = snapshot.copy(items = remaining)
        return JSONObject().apply {
            put("accepted", true)
            put("deletionPerformed", deletedCount > 0)
            put("deletedCount", deletedCount)
            put("reclaimedBytes", reclaimedBytes)
            put("deletedIds", deletedIds)
            put("protectedIds", JSONArray(protectedIds.toList()))
            put("failed", failed)
            put("reviewSummary", reviewSummaryObject(reviewSnapshot))
        }.toString()
    }

    fun cancel() { cancelRequested.set(true) }
    fun shutdown() { cancelRequested.set(true); executor.shutdownNow() }

    private fun runScan(request: ScanRequest, listener: Listener) {
        val startedAt = SystemClock.elapsedRealtime()
        val counters = Counters()
        val reviewCandidates = CandidateAccumulator()
        reviewSnapshot = null
        var inventory: File? = null

        try {
            val storageRoots = discoverRoots()
            if (storageRoots.isEmpty()) {
                listener.onError(errorJson("no_accessible_storage", request.mode))
                return
            }

            val plan = buildPlan(request, storageRoots)
            if (plan.targets.isEmpty()) {
                listener.onError(errorJson("no_matching_scan_locations", request.mode))
                return
            }

            inventory = File.createTempFile("bearagnostic_inventory_", ".bin", context.cacheDir)
            emit(listener, request, plan, "preparing", counters)
            discoverIntoInventory(plan, inventory, counters, listener, request, startedAt)

            if (counters.discoveredFiles == 0L) {
                emit(listener, request, plan, "finalizing", counters)
                reviewSnapshot = reviewCandidates.snapshot(request.mode)
                listener.onComplete(
                    buildResult(
                        request, plan, counters, startedAt,
                        candidateFiles = 0, candidateBytes = 0,
                        hashedFiles = 0, hashedBytes = 0,
                        duplicateGroups = 0, duplicateCopies = 0,
                        duplicateReclaimableBytes = 0, hashReadFailures = 0,
                        rootsScanned = plan.targets.size,
                    )
                )
                return
            }

            // Stage 2: File Details. Smart performs a real bounded content sample. Deep performs a
            // complete streaming read of every readable non-empty file. This is actual I/O, not UI pacing.
            var processed = 0L
            var lastProgressAt = 0L
            forEachInventory(inventory) { file ->
                ensureNotCancelled()
                processed++
                if (!file.exists() || !file.isFile) {
                    counters.missingDuringScan++
                } else {
                    val size = safeLength(file)
                    if (size == null) {
                        counters.unreadableFiles++
                    } else {
                        counters.reviewedFiles++
                        classifyDetails(file, size, counters)
                        recordDetailCandidates(file, size, reviewCandidates)
                        if (plan.contentReadMode != ContentReadMode.NONE && size > 0L) {
                            val expectedForFile = if (plan.contentReadMode == ContentReadMode.FULL) size else minOf(size, plan.contentReadLimitBytes)
                            counters.contentExpectedBytes = safeAdd(counters.contentExpectedBytes, expectedForFile)
                            val bytesRead = readContent(file, plan.contentReadLimitBytes) { delta ->
                                counters.contentProbeBytes = safeAdd(counters.contentProbeBytes, delta)
                                val now = SystemClock.elapsedRealtime()
                                if (now - lastProgressAt >= PROGRESS_INTERVAL_MS) {
                                    lastProgressAt = now
                                    emit(
                                        listener, request, plan, "file_details", counters,
                                        phaseProcessed = processed - 1L,
                                        phaseTotal = counters.discoveredFiles,
                                        activeFileBytesRead = counters.contentProbeBytes,
                                    )
                                }
                            }
                            if (bytesRead < 0L) {
                                counters.contentProbeFailures++
                            } else {
                                counters.contentProbedFiles++
                                if (plan.contentReadMode == ContentReadMode.FULL) {
                                    if (bytesRead == expectedForFile) counters.contentFullyReadFiles++
                                    else counters.contentPartialReadFiles++
                                }
                            }
                        }
                    }
                }
                val now = SystemClock.elapsedRealtime()
                if (processed % 48L == 0L || now - lastProgressAt >= PROGRESS_INTERVAL_MS) {
                    lastProgressAt = now
                    emit(
                        listener, request, plan, "file_details", counters,
                        phaseProcessed = processed,
                        phaseTotal = counters.discoveredFiles,
                    )
                }
            }
            emit(
                listener, request, plan, "file_details", counters,
                phaseProcessed = processed,
                phaseTotal = counters.discoveredFiles,
            )

            // Stage 3: truthful byte totals, large/zero-byte rules, and duplicate size prefilter.
            val firstBySize = HashMap<Long, File>(4096)
            val sameSizeGroups = HashMap<Long, MutableList<File>>()
            processed = 0L
            lastProgressAt = 0L
            forEachInventory(inventory) { file ->
                ensureNotCancelled()
                processed++
                if (file.exists() && file.isFile) {
                    val size = safeLength(file)
                    if (size != null) {
                        counters.totalBytes = safeAdd(counters.totalBytes, size)
                        if (size == 0L) {
                            counters.zeroByteFiles++
                            addReviewCandidate(reviewCandidates, file, size, "zero", 2, 45, false, false, "zero_byte")
                        }
                        if (size >= LARGE_FILE_BYTES) {
                            counters.largeFiles++
                            counters.largeFileBytes = safeAdd(counters.largeFileBytes, size)
                            addReviewCandidate(reviewCandidates, file, size, "large", 2, 0, false, false, "large_file")
                        }
                        if (plan.verifyDuplicates && size > 0L && isDuplicateEligible(file, plan.duplicateEligibleRoots)) {
                            val existingGroup = sameSizeGroups[size]
                            if (existingGroup != null) {
                                existingGroup.add(file)
                            } else {
                                val first = firstBySize.putIfAbsent(size, file)
                                if (first != null) sameSizeGroups[size] = mutableListOf(first, file)
                            }
                        }
                    }
                }
                val now = SystemClock.elapsedRealtime()
                if (processed % 96L == 0L || now - lastProgressAt >= PROGRESS_INTERVAL_MS) {
                    lastProgressAt = now
                    emit(listener, request, plan, "file_sizes", counters, phaseProcessed = processed, phaseTotal = counters.discoveredFiles)
                }
            }
            firstBySize.clear()
            emit(listener, request, plan, "file_sizes", counters, phaseProcessed = processed, phaseTotal = counters.discoveredFiles)

            var candidateFiles = 0L
            var candidateBytes = 0L
            for ((size, files) in sameSizeGroups) {
                candidateFiles = safeAdd(candidateFiles, files.size.toLong())
                candidateBytes = safeAdd(candidateBytes, safeMultiply(size, files.size.toLong()))
            }

            // Stage 4: exact duplicate verification = exact size, then streaming SHA-256.
            var hashedFiles = 0L
            var hashedBytes = 0L
            var duplicateGroups = 0L
            var duplicateCopies = 0L
            var duplicateReclaimableBytes = 0L
            var hashReadFailures = 0L
            if (plan.verifyDuplicates) {
                emit(listener, request, plan, "duplicates", counters, candidateFiles, candidateBytes, hashedFiles, hashedBytes)
                lastProgressAt = 0L
                for ((size, files) in sameSizeGroups) {
                    ensureNotCancelled()
                    val byHash = HashMap<String, MutableList<File>>()
                    for (file in files) {
                        ensureNotCancelled()
                        val digest = hashFile(file) { delta ->
                            hashedBytes = safeAdd(hashedBytes, delta)
                            val now = SystemClock.elapsedRealtime()
                            if (now - lastProgressAt >= PROGRESS_INTERVAL_MS) {
                                lastProgressAt = now
                                emit(listener, request, plan, "duplicates", counters, candidateFiles, candidateBytes, hashedFiles, hashedBytes)
                            }
                        }
                        if (digest == null) {
                            hashReadFailures++
                        } else {
                            hashedFiles++
                            byHash.getOrPut(digest) { mutableListOf() }.add(file)
                        }
                    }
                    for ((digest, members) in byHash) {
                        if (members.size > 1) {
                            duplicateGroups++
                            val copies = members.size - 1L
                            duplicateCopies = safeAdd(duplicateCopies, copies)
                            duplicateReclaimableBytes = safeAdd(duplicateReclaimableBytes, safeMultiply(size, copies))
                            val keep = members.maxWithOrNull(compareBy<File> { safeModified(it) }.thenBy { it.absolutePath.length }) ?: members.first()
                            val groupId = "${size}_${digest.take(16)}"
                            for (member in members) {
                                addReviewCandidate(
                                    reviewCandidates, member, size, "duplicates", 2, 100,
                                    suggestedSelected = member != keep, autoCleanEligible = false,
                                    reasonCode = "verified_duplicate", duplicateGroupId = groupId,
                                    duplicateKeepSuggested = member == keep,
                                )
                            }
                        }
                    }
                }
                emit(listener, request, plan, "duplicates", counters, candidateFiles, candidateBytes, hashedFiles, hashedBytes)
            } else {
                emit(listener, request, plan, "duplicates", counters)
            }

            // Stage 5: separate modification-date pass so the stage rail corresponds to real work.
            val olderThan = System.currentTimeMillis() - OLDER_THAN_MS
            processed = 0L
            lastProgressAt = 0L
            forEachInventory(inventory) { file ->
                ensureNotCancelled()
                processed++
                if (file.exists() && file.isFile) {
                    val modified = try { file.lastModified() } catch (_: SecurityException) { 0L }
                    val size = safeLength(file) ?: 0L
                    if (modified in 1 until olderThan) {
                        counters.olderFiles++
                        counters.olderFileBytes = safeAdd(counters.olderFileBytes, size)
                        addReviewCandidate(reviewCandidates, file, size, "old", 2, 0, false, false, "old_file", modifiedMs = modified)
                    }
                }
                val now = SystemClock.elapsedRealtime()
                if (processed % 96L == 0L || now - lastProgressAt >= PROGRESS_INTERVAL_MS) {
                    lastProgressAt = now
                    emit(listener, request, plan, "modified_dates", counters, phaseProcessed = processed, phaseTotal = counters.discoveredFiles)
                }
            }
            emit(listener, request, plan, "modified_dates", counters, phaseProcessed = processed, phaseTotal = counters.discoveredFiles)

            emit(listener, request, plan, "finalizing", counters, candidateFiles, candidateBytes, hashedFiles, hashedBytes)
            reviewSnapshot = reviewCandidates.snapshot(request.mode)
            listener.onComplete(
                buildResult(
                    request, plan, counters, startedAt,
                    candidateFiles, candidateBytes, hashedFiles, hashedBytes,
                    duplicateGroups, duplicateCopies, duplicateReclaimableBytes,
                    hashReadFailures, plan.targets.size,
                )
            )
        } catch (_: ScanCancelledException) {
            listener.onCancelled(cancelJson(startedAt, counters.reviewedFiles, request.mode))
        } catch (_: Throwable) {
            if (cancelRequested.get()) {
                listener.onCancelled(cancelJson(startedAt, counters.reviewedFiles, request.mode))
            } else {
                listener.onError(errorJson("scan_failed", request.mode))
            }
        } finally {
            try { inventory?.delete() } catch (_: Exception) {}
            running = false
            cancelRequested.set(false)
        }
    }

    private fun discoverIntoInventory(
        plan: ScanPlan,
        inventory: File,
        counters: Counters,
        listener: Listener,
        request: ScanRequest,
        startedAt: Long,
    ) {
        DataOutputStream(BufferedOutputStream(FileOutputStream(inventory), INVENTORY_BUFFER_BYTES)).use { output ->
            val queue = ArrayDeque<File>()
            plan.targets.forEach(queue::addLast)
            var lastProgressAt = 0L
            while (queue.isNotEmpty()) {
                ensureNotCancelled()
                val current = queue.removeFirst()
                if (current.isDirectory) {
                    if (shouldSkipDirectory(current, plan.targets)) continue
                    counters.directoriesVisited++
                    val children = try { current.listFiles() } catch (_: SecurityException) { null }
                    if (children == null) {
                        counters.inaccessibleFolders++
                    } else {
                        if (children.isEmpty() && !isTargetRoot(current, plan.targets)) counters.emptyFolders++
                        for (child in children) if (!isSymbolicLink(child)) queue.addLast(child)
                    }
                } else if (current.isFile) {
                    output.writeUTF(canonicalFile(current).absolutePath)
                    counters.discoveredFiles++
                }

                val now = SystemClock.elapsedRealtime()
                if (counters.discoveredFiles % 96L == 0L || now - lastProgressAt >= 200L) {
                    lastProgressAt = now
                    emit(listener, request, plan, "preparing", counters)
                }
            }
            output.flush()
        }
    }

    private inline fun forEachInventory(inventory: File, block: (File) -> Unit) {
        DataInputStream(BufferedInputStream(FileInputStream(inventory), INVENTORY_BUFFER_BYTES)).use { input ->
            while (true) {
                val path = try { input.readUTF() } catch (_: EOFException) { break }
                block(File(path))
            }
        }
    }

    private fun readContent(file: File, limitBytes: Long, onBytes: (Long) -> Unit): Long = try {
        FileInputStream(file).use { input ->
            val buffer = ByteArray(CONTENT_BUFFER_BYTES)
            var total = 0L
            while (limitBytes == Long.MAX_VALUE || total < limitBytes) {
                ensureNotCancelled()
                val wanted = if (limitBytes == Long.MAX_VALUE) {
                    buffer.size
                } else {
                    minOf(buffer.size.toLong(), limitBytes - total).toInt()
                }
                if (wanted <= 0) break
                val read = input.read(buffer, 0, wanted)
                if (read < 0) break
                if (read == 0) continue
                total += read.toLong()
                onBytes(read.toLong())
            }
            total
        }
    } catch (_: ScanCancelledException) {
        throw ScanCancelledException()
    } catch (_: Exception) {
        -1L
    }

    private fun classifyDetails(file: File, size: Long, c: Counters) {
        val name = file.name.lowercase(Locale.ROOT)
        val ext = file.extension.lowercase(Locale.ROOT)
        val path = normalizedPath(file)
        if (name.startsWith('.')) {
            c.hiddenFiles++
            c.hiddenBytes = safeAdd(c.hiddenBytes, size)
        }
        if (isDownloadPath(path)) {
            c.downloadFiles++
            c.downloadBytes = safeAdd(c.downloadBytes, size)
        }
        if (isTemporaryArtifact(name, ext, path)) {
            c.temporaryArtifactFiles++
            c.temporaryArtifactBytes = safeAdd(c.temporaryArtifactBytes, size)
        }
        if (ext == "apk") {
            c.apkInstallerFiles++
            c.apkInstallerBytes = safeAdd(c.apkInstallerBytes, size)
        }
        if (ext in ARCHIVE_EXTENSIONS) {
            c.archiveFiles++
            c.archiveBytes = safeAdd(c.archiveBytes, size)
        }
        if (isScreenshot(name, path)) {
            c.screenshotFiles++
            c.screenshotBytes = safeAdd(c.screenshotBytes, size)
        }
        when {
            ext in IMAGE_EXTENSIONS -> { c.imageFiles++; c.imageBytes = safeAdd(c.imageBytes, size) }
            ext in VIDEO_EXTENSIONS -> { c.videoFiles++; c.videoBytes = safeAdd(c.videoBytes, size) }
            ext in AUDIO_EXTENSIONS -> { c.audioFiles++; c.audioBytes = safeAdd(c.audioBytes, size) }
            ext in DOCUMENT_EXTENSIONS -> { c.documentFiles++; c.documentBytes = safeAdd(c.documentBytes, size) }
        }
    }

    private fun recordDetailCandidates(file: File, size: Long, review: CandidateAccumulator) {
        val name = file.name.lowercase(Locale.ROOT)
        val ext = file.extension.lowercase(Locale.ROOT)
        val path = normalizedPath(file)
        val modified = safeModified(file)
        if (isTemporaryArtifact(name, ext, path)) {
            val strong = ext in STRONG_TEMP_EXTENSIONS || name.endsWith(".download") || name.endsWith(".opdownload")
            val oldEnough = modified > 0L && System.currentTimeMillis() - modified >= AUTO_CLEAN_TEMP_MIN_AGE_MS
            val auto = strong && isDownloadPath(path) && oldEnough
            addReviewCandidate(review, file, size, "temporary", if (auto) 1 else 2, if (auto) 95 else 72, auto, auto, if (auto) "stale_incomplete_download" else "temporary_artifact", modifiedMs = modified)
        }
        if (ext == "apk") addReviewCandidate(review, file, size, "installers", 2, 62, false, false, "apk_installer", modifiedMs = modified)
        if (ext in ARCHIVE_EXTENSIONS) addReviewCandidate(review, file, size, "archives", 2, 20, false, false, "archive_file", modifiedMs = modified)
    }

    private fun addReviewCandidate(
        review: CandidateAccumulator,
        file: File,
        size: Long,
        category: String,
        riskLevel: Int,
        junkConfidence: Int,
        suggestedSelected: Boolean,
        autoCleanEligible: Boolean,
        reasonCode: String,
        duplicateGroupId: String? = null,
        duplicateKeepSuggested: Boolean = false,
        modifiedMs: Long = safeModified(file),
    ) {
        val canonical = canonicalFile(file)
        review.add(
            path = canonical.absolutePath,
            name = canonical.name.ifBlank { "(unnamed)" },
            location = displayLocation(canonical),
            sizeBytes = size.coerceAtLeast(0L),
            modifiedMs = modifiedMs,
            category = category, riskLevel = riskLevel.coerceIn(0, 4),
            junkConfidence = junkConfidence.coerceIn(0, 100),
            suggestedSelected = suggestedSelected, autoCleanEligible = autoCleanEligible,
            reasonCode = reasonCode, duplicateGroupId = duplicateGroupId,
            duplicateKeepSuggested = duplicateKeepSuggested,
        )
    }

    private fun candidateMatchesCategory(candidate: ReviewCandidate, category: String): Boolean = when (category) {
        "lowrisk" -> candidate.autoCleanEligible
        "duplicates" -> "duplicates" in candidate.categories
        "large" -> "large" in candidate.categories
        "old" -> "old" in candidate.categories
        "temporary" -> "temporary" in candidate.categories
        "installers" -> "installers" in candidate.categories
        "archives" -> "archives" in candidate.categories
        "zero" -> "zero" in candidate.categories
        "all" -> true
        else -> false
    }

    private fun candidateJson(candidate: ReviewCandidate): JSONObject = JSONObject().apply {
        put("id", candidate.id)
        put("name", candidate.name)
        put("location", candidate.location)
        put("sizeBytes", candidate.sizeBytes)
        put("modifiedMs", candidate.modifiedMs)
        put("categories", JSONArray(candidate.categories.toList()))
        put("riskLevel", candidate.riskLevel)
        put("junkConfidence", candidate.junkConfidence)
        put("suggestedSelected", candidate.suggestedSelected)
        put("autoCleanEligible", candidate.autoCleanEligible)
        put("reasonCode", candidate.reasonCode)
        put("duplicateGroupId", candidate.duplicateGroupId)
        put("duplicateKeepSuggested", candidate.duplicateKeepSuggested)
    }

    private fun reviewSummaryObject(snapshot: ReviewSnapshot?): JSONObject = JSONObject().apply {
        if (snapshot == null) {
            put("available", false)
            put("candidateCount", 0)
            return@apply
        }
        val values = snapshot.items.values
        fun count(category: String) = values.count { candidateMatchesCategory(it, category) }
        fun bytes(category: String) = values.filter { candidateMatchesCategory(it, category) }.fold(0L) { total, item -> safeAdd(total, item.sizeBytes) }
        put("available", true)
        put("generatedAtMs", snapshot.generatedAtMs)
        put("scanMode", snapshot.scanMode)
        put("candidateCount", values.size)
        put("detailsTruncated", snapshot.detailsTruncated)
        for (category in listOf("lowrisk", "duplicates", "large", "old", "temporary", "installers", "archives", "zero")) {
            put("${category}Count", count(category))
            put("${category}Bytes", bytes(category))
        }
    }

    private fun displayLocation(file: File): String {
        val parent = file.parentFile ?: return "Shared storage"
        val grand = parent.parentFile
        return when {
            grand == null -> parent.name.ifBlank { "Shared storage" }
            parent.name.isBlank() -> grand.name.ifBlank { "Shared storage" }
            grand.name.isBlank() -> parent.name
            else -> "${grand.name}/${parent.name}"
        }
    }

    private fun safeModified(file: File): Long = try { file.lastModified().coerceAtLeast(0L) } catch (_: Exception) { 0L }

    private fun buildResult(
        request: ScanRequest,
        plan: ScanPlan,
        c: Counters,
        startedAt: Long,
        candidateFiles: Long,
        candidateBytes: Long,
        hashedFiles: Long,
        hashedBytes: Long,
        duplicateGroups: Long,
        duplicateCopies: Long,
        duplicateReclaimableBytes: Long,
        hashReadFailures: Long,
        rootsScanned: Int,
    ): String = JSONObject().apply {
        put("state", "complete")
        put("scanMode", request.mode.wireName)
        put("scope", plan.scope)
        put("analysisDepth", plan.analysisDepth)
        put("analysisRulesVersion", ANALYSIS_RULES_VERSION)
        put("duplicateCoverage", plan.duplicateCoverage)
        put("duplicateVerificationPerformed", plan.verifyDuplicates)
        put("contentProbePerformed", plan.contentReadMode != ContentReadMode.NONE)
        put("contentReadMode", plan.contentReadMode.wireName)
        put("contentReadLimitBytes", plan.contentReadLimitBytes)
        putCounters(this, c)
        put("duplicateGroups", duplicateGroups)
        put("duplicateCopies", duplicateCopies)
        put("duplicateReclaimableBytes", duplicateReclaimableBytes)
        put("duplicateCandidateFiles", candidateFiles)
        put("duplicateCandidateBytes", candidateBytes)
        put("hashedFiles", hashedFiles)
        put("hashedBytes", hashedBytes)
        put("hashReadFailures", hashReadFailures)
        put("rootsScanned", rootsScanned)
        val durationMs = SystemClock.elapsedRealtime() - startedAt
        put("durationMs", durationMs)
        put("largeFileThresholdBytes", LARGE_FILE_BYTES)
        put("olderThanDays", OLDER_THAN_DAYS)
        put("scanEvidenceVersion", 1)
        put("contentExpectedBytes", c.contentExpectedBytes)
        put("contentFullyReadFiles", c.contentFullyReadFiles)
        put("contentPartialReadFiles", c.contentPartialReadFiles)
        val deepCoverageVerified = request.mode != ScanMode.DEEP || (
            c.contentProbeFailures == 0L &&
            c.contentPartialReadFiles == 0L &&
            c.contentProbeBytes == c.contentExpectedBytes &&
            c.contentFullyReadFiles == c.contentProbedFiles
        )
        put("deepCoverageVerified", deepCoverageVerified)
        put(
            "coverageStatus",
            if (
                c.inaccessibleFolders == 0L &&
                c.missingDuringScan == 0L &&
                c.contentProbeFailures == 0L &&
                hashReadFailures == 0L &&
                deepCoverageVerified
            ) {
                "complete_accessible_scope"
            } else {
                "partial_accessible_scope"
            },
        )
        val review = reviewSnapshot
        put("reviewAvailable", review != null)
        put("reviewCandidateCount", review?.items?.size ?: 0)
        put("autoCleanCandidateCount", review?.items?.values?.count { it.autoCleanEligible } ?: 0)
        put("autoCleanCandidateBytes", review?.items?.values?.filter { it.autoCleanEligible }?.fold(0L) { total, item -> safeAdd(total, item.sizeBytes) } ?: 0L)
        put("reviewDetailsTruncated", review?.detailsTruncated ?: false)
        put("deletionPerformed", false)
    }.toString()

    private fun buildPlan(request: ScanRequest, storageRoots: List<File>): ScanPlan {
        val priority = uniqueDirectories(storageRoots.flatMap(::priorityDirectories))
        return when (request.mode) {
            ScanMode.QUICK -> ScanPlan(
                targets = storageRoots,
                duplicateEligibleRoots = emptyList(),
                verifyDuplicates = false,
                contentReadMode = ContentReadMode.NONE,
                contentReadLimitBytes = 0L,
                scope = "accessible_shared_storage",
                duplicateCoverage = "none",
                analysisDepth = "quick_full_scope_multi_pass_metadata",
            )
            ScanMode.SMART -> ScanPlan(
                targets = storageRoots,
                duplicateEligibleRoots = priority.ifEmpty { storageRoots },
                verifyDuplicates = true,
                contentReadMode = ContentReadMode.SAMPLE,
                contentReadLimitBytes = SMART_SAMPLE_BYTES,
                scope = "accessible_shared_storage",
                duplicateCoverage = if (priority.isNotEmpty()) "priority_locations" else "all_accessible",
                analysisDepth = "smart_multi_pass_content_sample_focused_duplicates",
            )
            ScanMode.DEEP -> ScanPlan(
                targets = storageRoots,
                duplicateEligibleRoots = storageRoots,
                verifyDuplicates = true,
                contentReadMode = ContentReadMode.FULL,
                contentReadLimitBytes = Long.MAX_VALUE,
                scope = "accessible_shared_storage",
                duplicateCoverage = "all_accessible",
                analysisDepth = "deep_multi_pass_full_content_read_full_duplicates",
            )
            ScanMode.CUSTOM -> {
                val customTargets = uniqueDirectories(storageRoots.flatMap { root -> customDirectories(root, request.customScopes) })
                val targets = customTargets.ifEmpty { priority.ifEmpty { storageRoots } }
                val verify = request.verifyDuplicates
                ScanPlan(
                    targets = targets,
                    duplicateEligibleRoots = if (verify) targets else emptyList(),
                    verifyDuplicates = verify,
                    contentReadMode = ContentReadMode.NONE,
                    contentReadLimitBytes = 0L,
                    scope = if (customTargets.isNotEmpty()) "custom_shared_locations" else "priority_shared_locations",
                    duplicateCoverage = if (verify) "selected_locations" else "none",
                    analysisDepth = if (verify) "custom_multi_pass_exact_duplicates" else "custom_multi_pass_metadata",
                )
            }
        }
    }

    private fun discoverRoots(): List<File> {
        val roots = LinkedHashMap<String, File>()
        fun addRoot(file: File?) {
            if (file == null) return
            val canonical = canonicalFile(file)
            if (canonical.exists() && canonical.isDirectory && canonical.canRead()) roots[canonical.absolutePath] = canonical
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            context.getSystemService(StorageManager::class.java)?.storageVolumes?.forEach { addRoot(it.directory) }
        }
        addRoot(Environment.getExternalStorageDirectory())
        return roots.values.toList()
    }

    private fun priorityDirectories(root: File): List<File> = listOf(
        Environment.DIRECTORY_DOWNLOADS,
        Environment.DIRECTORY_DCIM,
        Environment.DIRECTORY_PICTURES,
        Environment.DIRECTORY_MOVIES,
        Environment.DIRECTORY_DOCUMENTS,
        Environment.DIRECTORY_MUSIC,
    ).map { File(root, it) }.filter { it.exists() && it.isDirectory && it.canRead() }

    private fun customDirectories(root: File, scopes: Set<String>): List<File> {
        val requested = if (scopes.isEmpty()) DEFAULT_CUSTOM_SCOPES else scopes
        val output = mutableListOf<File>()
        fun add(type: String) {
            val file = File(root, type)
            if (file.exists() && file.isDirectory && file.canRead()) output += file
        }
        if ("downloads" in requested) add(Environment.DIRECTORY_DOWNLOADS)
        if ("photos" in requested) { add(Environment.DIRECTORY_DCIM); add(Environment.DIRECTORY_PICTURES) }
        if ("videos" in requested) add(Environment.DIRECTORY_MOVIES)
        if ("documents" in requested) add(Environment.DIRECTORY_DOCUMENTS)
        if ("music" in requested) add(Environment.DIRECTORY_MUSIC)
        return output
    }

    private fun uniqueDirectories(files: List<File>): List<File> {
        val unique = LinkedHashMap<String, File>()
        for (file in files) {
            val canonical = canonicalFile(file)
            if (canonical.exists() && canonical.isDirectory && canonical.canRead()) unique[canonical.absolutePath] = canonical
        }
        return unique.values.toList()
    }

    private fun isDuplicateEligible(file: File, eligibleRoots: List<File>): Boolean {
        if (eligibleRoots.isEmpty()) return false
        val path = canonicalFile(file).absolutePath
        return eligibleRoots.any { root ->
            val rootPath = canonicalFile(root).absolutePath.trimEnd(File.separatorChar)
            path == rootPath || path.startsWith(rootPath + File.separator)
        }
    }

    private fun shouldSkipDirectory(directory: File, targets: List<File>): Boolean {
        val path = canonicalFile(directory).absolutePath
        if (targets.any { path == canonicalFile(it).absolutePath }) return false
        val normalized = path.replace('\\', '/').lowercase(Locale.ROOT)
        return normalized.endsWith("/android/data") || normalized.contains("/android/data/") ||
            normalized.endsWith("/android/obb") || normalized.contains("/android/obb/")
    }

    private fun isTargetRoot(directory: File, targets: List<File>): Boolean {
        val path = canonicalFile(directory).absolutePath
        return targets.any { path == canonicalFile(it).absolutePath }
    }

    private fun safeLength(file: File): Long? = try { file.length().coerceAtLeast(0L) } catch (_: SecurityException) { null }
    private fun normalizedPath(file: File): String = canonicalFile(file).absolutePath.replace('\\', '/').lowercase(Locale.ROOT)
    private fun isDownloadPath(path: String): Boolean = path.contains("/download/") || path.endsWith("/download") || path.contains("/downloads/") || path.endsWith("/downloads")
    private fun isTemporaryArtifact(name: String, ext: String, path: String): Boolean =
        ext in STRONG_TEMP_EXTENSIONS || name.endsWith(".download") || name.endsWith(".opdownload") || (ext in WEAK_TEMP_EXTENSIONS && isDownloadPath(path))
    private fun isScreenshot(name: String, path: String): Boolean = path.contains("/screenshots/") || name.contains("screenshot") || name.contains("screen_shot")
    private fun canonicalFile(file: File): File = try { file.canonicalFile } catch (_: Exception) { file.absoluteFile }
    private fun isSymbolicLink(file: File): Boolean = try { Files.isSymbolicLink(file.toPath()) } catch (_: Exception) { false }

    private fun hashFile(file: File, onBytes: (Long) -> Unit): String? = try {
        val digest = MessageDigest.getInstance("SHA-256")
        FileInputStream(file).use { input ->
            val buffer = ByteArray(HASH_BUFFER_BYTES)
            while (true) {
                ensureNotCancelled()
                val read = input.read(buffer)
                if (read < 0) break
                if (read == 0) continue
                digest.update(buffer, 0, read)
                onBytes(read.toLong())
            }
        }
        digest.digest().joinToString(separator = "") { byte -> "%02x".format(byte) }
    } catch (_: ScanCancelledException) {
        throw ScanCancelledException()
    } catch (_: Exception) {
        null
    }

    private fun ensureNotCancelled() {
        if (cancelRequested.get()) throw ScanCancelledException()
    }

    private fun emit(
        listener: Listener,
        request: ScanRequest,
        plan: ScanPlan,
        phase: String,
        c: Counters,
        candidateFiles: Long = 0,
        candidateBytes: Long = 0,
        hashedFiles: Long = 0,
        hashedBytes: Long = 0,
        phaseProcessed: Long = 0,
        phaseTotal: Long = 0,
        activeFileBytesRead: Long = 0,
    ) {
        listener.onProgress(JSONObject().apply {
            put("state", "running")
            put("phase", phase)
            put("scanMode", request.mode.wireName)
            put("scope", plan.scope)
            put("analysisDepth", plan.analysisDepth)
            put("duplicateCoverage", plan.duplicateCoverage)
            put("duplicateVerificationEnabled", plan.verifyDuplicates)
            put("contentProbeEnabled", plan.contentReadMode != ContentReadMode.NONE)
            put("contentReadMode", plan.contentReadMode.wireName)
            put("contentReadLimitBytes", plan.contentReadLimitBytes)
            putCounters(this, c)
            put("duplicateCandidateFiles", candidateFiles)
            put("duplicateCandidateBytes", candidateBytes)
            put("hashedFiles", hashedFiles)
            put("hashedBytes", hashedBytes)
            put("phaseProcessedFiles", phaseProcessed)
            put("phaseTotalFiles", phaseTotal)
            put("activeFileBytesRead", activeFileBytesRead)
        }.toString())
    }

    private fun putCounters(json: JSONObject, c: Counters) {
        json.put("discoveredFiles", c.discoveredFiles)
        json.put("reviewedFiles", c.reviewedFiles)
        json.put("directoriesVisited", c.directoriesVisited)
        json.put("totalBytes", c.totalBytes)
        json.put("largeFiles", c.largeFiles)
        json.put("largeFileBytes", c.largeFileBytes)
        json.put("olderFiles", c.olderFiles)
        json.put("olderFileBytes", c.olderFileBytes)
        json.put("zeroByteFiles", c.zeroByteFiles)
        json.put("emptyFolders", c.emptyFolders)
        json.put("temporaryArtifactFiles", c.temporaryArtifactFiles)
        json.put("temporaryArtifactBytes", c.temporaryArtifactBytes)
        json.put("apkInstallerFiles", c.apkInstallerFiles)
        json.put("apkInstallerBytes", c.apkInstallerBytes)
        json.put("archiveFiles", c.archiveFiles)
        json.put("archiveBytes", c.archiveBytes)
        json.put("screenshotFiles", c.screenshotFiles)
        json.put("screenshotBytes", c.screenshotBytes)
        json.put("imageFiles", c.imageFiles)
        json.put("imageBytes", c.imageBytes)
        json.put("videoFiles", c.videoFiles)
        json.put("videoBytes", c.videoBytes)
        json.put("audioFiles", c.audioFiles)
        json.put("audioBytes", c.audioBytes)
        json.put("documentFiles", c.documentFiles)
        json.put("documentBytes", c.documentBytes)
        json.put("downloadFiles", c.downloadFiles)
        json.put("downloadBytes", c.downloadBytes)
        json.put("hiddenFiles", c.hiddenFiles)
        json.put("hiddenBytes", c.hiddenBytes)
        json.put("unreadableFiles", c.unreadableFiles)
        json.put("inaccessibleFolders", c.inaccessibleFolders)
        json.put("missingDuringScan", c.missingDuringScan)
        json.put("contentProbedFiles", c.contentProbedFiles)
        json.put("contentProbeBytes", c.contentProbeBytes)
        json.put("contentProbeFailures", c.contentProbeFailures)
        json.put("contentExpectedBytes", c.contentExpectedBytes)
        json.put("contentFullyReadFiles", c.contentFullyReadFiles)
        json.put("contentPartialReadFiles", c.contentPartialReadFiles)
    }

    private fun cancelJson(startedAt: Long, reviewed: Long, mode: ScanMode): String = JSONObject().apply {
        put("state", "cancelled")
        put("scanMode", mode.wireName)
        put("reviewedFiles", reviewed)
        put("durationMs", SystemClock.elapsedRealtime() - startedAt)
        put("deletionPerformed", false)
    }.toString()

    private fun errorJson(code: String, mode: ScanMode): String = JSONObject().apply {
        put("state", "error")
        put("scanMode", mode.wireName)
        put("code", code)
        put("deletionPerformed", false)
    }.toString()

    private fun safeAdd(a: Long, b: Long): Long {
        if (b <= 0L) return a
        return if (a > Long.MAX_VALUE - b) Long.MAX_VALUE else a + b
    }

    private fun safeMultiply(a: Long, b: Long): Long {
        if (a <= 0L || b <= 0L) return 0L
        return if (a > Long.MAX_VALUE / b) Long.MAX_VALUE else a * b
    }

    private class ScanCancelledException : RuntimeException()

    companion object {
        const val ANALYSIS_RULES_VERSION = 6
        const val LARGE_FILE_BYTES = 100L * 1024L * 1024L
        const val OLDER_THAN_DAYS = 365L
        const val OLDER_THAN_MS = OLDER_THAN_DAYS * 24L * 60L * 60L * 1000L
        const val SMART_SAMPLE_BYTES = 256L * 1024L
        const val HASH_BUFFER_BYTES = 256 * 1024
        const val CONTENT_BUFFER_BYTES = 256 * 1024
        const val INVENTORY_BUFFER_BYTES = 64 * 1024
        const val PROGRESS_INTERVAL_MS = 160L
        const val MAX_REVIEW_CANDIDATES = 10_000
        const val MAX_REVIEW_PAGE_SIZE = 250
        const val MAX_DELETE_SELECTION = 500
        const val AUTO_CLEAN_TEMP_MIN_AGE_MS = 7L * 24L * 60L * 60L * 1000L

        val DEFAULT_CUSTOM_SCOPES = setOf("downloads", "photos", "videos", "documents")
        val STRONG_TEMP_EXTENSIONS = setOf("part", "partial", "crdownload")
        val WEAK_TEMP_EXTENSIONS = setOf("tmp", "temp")
        val ARCHIVE_EXTENSIONS = setOf("zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz")
        val IMAGE_EXTENSIONS = setOf("jpg", "jpeg", "png", "webp", "gif", "bmp", "heic", "heif", "avif", "dng")
        val VIDEO_EXTENSIONS = setOf("mp4", "mkv", "mov", "avi", "webm", "m4v", "3gp", "ts", "mts", "m2ts")
        val AUDIO_EXTENSIONS = setOf("mp3", "m4a", "aac", "wav", "flac", "ogg", "opus", "wma", "amr")
        val DOCUMENT_EXTENSIONS = setOf(
            "pdf", "txt", "rtf", "md", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
            "csv", "json", "xml", "epub", "odt", "ods", "odp",
        )
    }
}
