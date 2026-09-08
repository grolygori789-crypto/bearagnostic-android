package com.benedictinteractive.bearagnostic

import android.content.Context
import android.os.Build
import android.os.Environment
import android.os.SystemClock
import android.os.storage.StorageManager
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
import java.util.Locale
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Truth-first, read-only shared-storage scanner.
 *
 * QUICK  = priority shared folders; metadata/rule analysis; no duplicate hashing.
 * SMART  = all accessible shared storage; metadata/rule analysis; focused exact duplicates.
 * DEEP   = all accessible shared storage; multi-pass analysis; real content probes on every
 *          readable non-empty file; exact duplicate verification across the accessible scope.
 * CUSTOM = selected shared folders with optional exact duplicate verification.
 *
 * There is deliberately no artificial scan delay. Every stage shown by the UI corresponds to
 * native work that has actually run. The temporary inventory is stored only in app cache for the
 * duration of one scan and is deleted in finally; it keeps traversal memory bounded.
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

    private data class ScanPlan(
        val targets: List<File>,
        val duplicateEligibleRoots: List<File>,
        val verifyDuplicates: Boolean,
        val contentProbe: Boolean,
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

    private val executor = Executors.newSingleThreadExecutor { runnable ->
        Thread(runnable, "BearagnosticFileScanner").apply { priority = Thread.NORM_PRIORITY - 1 }
    }
    private val cancelRequested = AtomicBoolean(false)

    @Volatile private var running = false

    fun isRunning(): Boolean = running

    @Synchronized
    fun start(request: ScanRequest, listener: Listener): Boolean {
        if (running) return false
        running = true
        cancelRequested.set(false)
        executor.execute { runScan(request, listener) }
        return true
    }

    fun cancel() { cancelRequested.set(true) }
    fun shutdown() { cancelRequested.set(true); executor.shutdownNow() }

    private fun runScan(request: ScanRequest, listener: Listener) {
        val startedAt = SystemClock.elapsedRealtime()
        val counters = Counters()
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
            discoverIntoInventory(
                plan = plan,
                inventory = inventory,
                counters = counters,
                listener = listener,
                request = request,
                startedAt = startedAt,
            )

            if (counters.discoveredFiles == 0L) {
                emit(listener, request, plan, "finalizing", counters)
                val result = buildResult(
                    request, plan, counters, startedAt,
                    candidateFiles = 0, candidateBytes = 0,
                    hashedFiles = 0, hashedBytes = 0,
                    duplicateGroups = 0, duplicateCopies = 0,
                    duplicateReclaimableBytes = 0, hashReadFailures = 0,
                    rootsScanned = plan.targets.size,
                )
                listener.onComplete(result)
                return
            }

            // Stage 2: File Details — type/context classification and, in Deep mode,
            // a real bounded content read from every readable non-empty file.
            var processed = 0L
            var lastProgressAt = 0L
            forEachInventory(inventory) { file ->
                ensureNotCancelled(listener, startedAt, counters.reviewedFiles, request.mode) ?: return
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
                        if (plan.contentProbe && size > 0L) {
                            val probed = probeFile(file)
                            if (probed < 0L) counters.contentProbeFailures++ else {
                                counters.contentProbedFiles++
                                counters.contentProbeBytes = safeAdd(counters.contentProbeBytes, probed)
                            }
                        }
                    }
                }
                val now = SystemClock.elapsedRealtime()
                if (processed % 64L == 0L || now - lastProgressAt >= 180L) {
                    lastProgressAt = now
                    emit(listener, request, plan, "file_details", counters, phaseProcessed = processed, phaseTotal = counters.discoveredFiles)
                }
            }
            emit(listener, request, plan, "file_details", counters, phaseProcessed = processed, phaseTotal = counters.discoveredFiles)

            // Stage 3: File Sizes — truthful storage totals, large/zero-byte rules, and the
            // cheap exact-size prefilter used by duplicate verification.
            val firstBySize = HashMap<Long, File>(4096)
            val sameSizeGroups = HashMap<Long, MutableList<File>>()
            processed = 0L
            lastProgressAt = 0L
            forEachInventory(inventory) { file ->
                ensureNotCancelled(listener, startedAt, counters.reviewedFiles, request.mode) ?: return
                processed++
                if (file.exists() && file.isFile) {
                    val size = safeLength(file)
                    if (size != null) {
                        counters.totalBytes = safeAdd(counters.totalBytes, size)
                        if (size == 0L) counters.zeroByteFiles++
                        if (size >= LARGE_FILE_BYTES) {
                            counters.largeFiles++
                            counters.largeFileBytes = safeAdd(counters.largeFileBytes, size)
                        }
                        if (plan.verifyDuplicates && size > 0L && isDuplicateEligible(file, plan.duplicateEligibleRoots)) {
                            val group = sameSizeGroups[size]
                            if (group != null) {
                                group.add(file)
                            } else {
                                val first = firstBySize.putIfAbsent(size, file)
                                if (first != null) sameSizeGroups[size] = mutableListOf(first, file)
                            }
                        }
                    }
                }
                val now = SystemClock.elapsedRealtime()
                if (processed % 96L == 0L || now - lastProgressAt >= 180L) {
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

            // Stage 4: Duplicates — byte-for-byte SHA-256 only after exact-size filtering.
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
                    ensureNotCancelled(listener, startedAt, counters.reviewedFiles, request.mode) ?: return
                    val byHash = HashMap<String, Int>()
                    for (file in files) {
                        ensureNotCancelled(listener, startedAt, counters.reviewedFiles, request.mode) ?: return
                        val digest = hashFile(file) { bytesRead ->
                            hashedBytes = safeAdd(hashedBytes, bytesRead)
                            val now = SystemClock.elapsedRealtime()
                            if (now - lastProgressAt >= 160L) {
                                lastProgressAt = now
                                emit(
                                    listener, request, plan, "duplicates", counters,
                                    candidateFiles, candidateBytes, hashedFiles, hashedBytes,
                                )
                            }
                        }
                        if (digest == null) {
                            hashReadFailures++
                        } else {
                            hashedFiles++
                            byHash[digest] = (byHash[digest] ?: 0) + 1
                        }
                    }
                    for (count in byHash.values) {
                        if (count > 1) {
                            duplicateGroups++
                            val copies = count - 1L
                            duplicateCopies = safeAdd(duplicateCopies, copies)
                            duplicateReclaimableBytes = safeAdd(
                                duplicateReclaimableBytes,
                                safeMultiply(size, copies),
                            )
                        }
                    }
                }
            } else {
                // Quick genuinely skips hashing; the UI receives this real stage transition.
                emit(listener, request, plan, "duplicates", counters, 0, 0, 0, 0)
            }

            // Stage 5: Modified Dates — a separate real pass so the six-stage legacy rail is
            // not decorative theatre.
            val olderThan = System.currentTimeMillis() - OLDER_THAN_MS
            processed = 0L
            lastProgressAt = 0L
            forEachInventory(inventory) { file ->
                ensureNotCancelled(listener, startedAt, counters.reviewedFiles, request.mode) ?: return
                processed++
                if (file.exists() && file.isFile) {
                    val modified = try { file.lastModified() } catch (_: SecurityException) { 0L }
                    val size = safeLength(file) ?: 0L
                    if (modified in 1 until olderThan) {
                        counters.olderFiles++
                        counters.olderFileBytes = safeAdd(counters.olderFileBytes, size)
                    }
                }
                val now = SystemClock.elapsedRealtime()
                if (processed % 96L == 0L || now - lastProgressAt >= 180L) {
                    lastProgressAt = now
                    emit(listener, request, plan, "modified_dates", counters, phaseProcessed = processed, phaseTotal = counters.discoveredFiles)
                }
            }
            emit(listener, request, plan, "modified_dates", counters, phaseProcessed = processed, phaseTotal = counters.discoveredFiles)

            emit(
                listener, request, plan, "finalizing", counters,
                candidateFiles, candidateBytes, hashedFiles, hashedBytes,
            )

            listener.onComplete(
                buildResult(
                    request, plan, counters, startedAt,
                    candidateFiles, candidateBytes, hashedFiles, hashedBytes,
                    duplicateGroups, duplicateCopies, duplicateReclaimableBytes,
                    hashReadFailures, plan.targets.size,
                ),
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
                ensureNotCancelled(listener, startedAt, counters.reviewedFiles, request.mode)
                    ?: throw ScanCancelledException()
                val current = queue.removeFirst()

                if (current.isDirectory) {
                    if (shouldSkipDirectory(current, plan.targets)) continue
                    counters.directoriesVisited++
                    val children = try { current.listFiles() } catch (_: SecurityException) { null }
                    if (children == null) {
                        counters.inaccessibleFolders++
                    } else {
                        if (children.isEmpty() && !isTargetRoot(current, plan.targets)) counters.emptyFolders++
                        for (child in children) {
                            if (!isSymbolicLink(child)) queue.addLast(child)
                        }
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
            ext in IMAGE_EXTENSIONS -> {
                c.imageFiles++
                c.imageBytes = safeAdd(c.imageBytes, size)
            }
            ext in VIDEO_EXTENSIONS -> {
                c.videoFiles++
                c.videoBytes = safeAdd(c.videoBytes, size)
            }
            ext in AUDIO_EXTENSIONS -> {
                c.audioFiles++
                c.audioBytes = safeAdd(c.audioBytes, size)
            }
            ext in DOCUMENT_EXTENSIONS -> {
                c.documentFiles++
                c.documentBytes = safeAdd(c.documentBytes, size)
            }
        }
    }

    private fun probeFile(file: File): Long = try {
        // Deep Scan performs a bounded real content-read on every readable non-empty file.
        // This is not a timer: it validates that content can actually be read while keeping
        // I/O bounded. Exact duplicates are still SHA-256 verified only after size filtering.
        FileInputStream(file).use { input ->
            val buffer = ByteArray(minOf(CONTENT_PROBE_BYTES, 16 * 1024))
            var total = 0L
            while (total < CONTENT_PROBE_BYTES) {
                if (cancelRequested.get()) throw ScanCancelledException()
                val remaining = (CONTENT_PROBE_BYTES - total).toInt()
                val read = input.read(buffer, 0, minOf(buffer.size, remaining))
                if (read < 0) break
                if (read == 0) continue
                total += read.toLong()
            }
            total
        }
    } catch (_: ScanCancelledException) {
        throw ScanCancelledException()
    } catch (_: Exception) {
        -1L
    }

    private fun safeLength(file: File): Long? = try {
        file.length().coerceAtLeast(0L)
    } catch (_: SecurityException) {
        null
    }

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
        put("contentProbePerformed", plan.contentProbe)
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
        put("durationMs", SystemClock.elapsedRealtime() - startedAt)
        put("largeFileThresholdBytes", LARGE_FILE_BYTES)
        put("olderThanDays", OLDER_THAN_DAYS)
        put(
            "coverageStatus",
            if (c.inaccessibleFolders == 0L && c.missingDuringScan == 0L && c.contentProbeFailures == 0L && hashReadFailures == 0L) {
                "complete_accessible_scope"
            } else {
                "partial_accessible_scope"
            },
        )
        put("deletionPerformed", false)
    }.toString()

    private fun buildPlan(request: ScanRequest, storageRoots: List<File>): ScanPlan {
        val priority = uniqueDirectories(storageRoots.flatMap(::priorityDirectories))
        return when (request.mode) {
            ScanMode.QUICK -> ScanPlan(
                targets = priority.ifEmpty { storageRoots },
                duplicateEligibleRoots = emptyList(),
                verifyDuplicates = false,
                contentProbe = false,
                scope = if (priority.isNotEmpty()) "priority_shared_locations" else "accessible_shared_storage",
                duplicateCoverage = "none",
                analysisDepth = "quick_multi_pass_metadata",
            )
            ScanMode.SMART -> ScanPlan(
                targets = storageRoots,
                duplicateEligibleRoots = priority.ifEmpty { storageRoots },
                verifyDuplicates = true,
                contentProbe = false,
                scope = "accessible_shared_storage",
                duplicateCoverage = if (priority.isNotEmpty()) "priority_locations" else "all_accessible",
                analysisDepth = "smart_multi_pass_full_metadata_focused_duplicates",
            )
            ScanMode.DEEP -> ScanPlan(
                targets = storageRoots,
                duplicateEligibleRoots = storageRoots,
                verifyDuplicates = true,
                contentProbe = true,
                scope = "accessible_shared_storage",
                duplicateCoverage = "all_accessible",
                analysisDepth = "deep_multi_pass_content_probe_full_duplicates",
            )
            ScanMode.CUSTOM -> {
                val customTargets = uniqueDirectories(storageRoots.flatMap { root ->
                    customDirectories(root, request.customScopes)
                })
                val targets = customTargets.ifEmpty { priority.ifEmpty { storageRoots } }
                val verify = request.verifyDuplicates
                ScanPlan(
                    targets = targets,
                    duplicateEligibleRoots = if (verify) targets else emptyList(),
                    verifyDuplicates = verify,
                    contentProbe = false,
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
            if (canonical.exists() && canonical.isDirectory && canonical.canRead()) {
                roots[canonical.absolutePath] = canonical
            }
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val storageManager = context.getSystemService(StorageManager::class.java)
            storageManager?.storageVolumes?.forEach { volume -> addRoot(volume.directory) }
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
            if (canonical.exists() && canonical.isDirectory && canonical.canRead()) {
                unique[canonical.absolutePath] = canonical
            }
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

    private fun normalizedPath(file: File): String = canonicalFile(file).absolutePath
        .replace('\\', '/')
        .lowercase(Locale.ROOT)

    private fun isDownloadPath(path: String): Boolean =
        path.contains("/download/") || path.endsWith("/download") ||
            path.contains("/downloads/") || path.endsWith("/downloads")

    private fun isTemporaryArtifact(name: String, ext: String, path: String): Boolean {
        if (ext in STRONG_TEMP_EXTENSIONS) return true
        if (name.endsWith(".download") || name.endsWith(".opdownload")) return true
        return ext in WEAK_TEMP_EXTENSIONS && isDownloadPath(path)
    }

    private fun isScreenshot(name: String, path: String): Boolean =
        path.contains("/screenshots/") || name.contains("screenshot") || name.contains("screen_shot")

    private fun canonicalFile(file: File): File = try { file.canonicalFile } catch (_: Exception) { file.absoluteFile }
    private fun isSymbolicLink(file: File): Boolean = try { Files.isSymbolicLink(file.toPath()) } catch (_: Exception) { false }

    private fun hashFile(file: File, onBytes: (Long) -> Unit): String? = try {
        val digest = MessageDigest.getInstance("SHA-256")
        FileInputStream(file).use { input ->
            val buffer = ByteArray(HASH_BUFFER_BYTES)
            while (true) {
                if (cancelRequested.get()) throw ScanCancelledException()
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

    private fun ensureNotCancelled(listener: Listener, startedAt: Long, reviewed: Long, mode: ScanMode): Unit? {
        if (!cancelRequested.get()) return Unit
        throw ScanCancelledException()
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
    ) {
        listener.onProgress(JSONObject().apply {
            put("state", "running")
            put("phase", phase)
            put("scanMode", request.mode.wireName)
            put("scope", plan.scope)
            put("analysisDepth", plan.analysisDepth)
            put("duplicateCoverage", plan.duplicateCoverage)
            put("duplicateVerificationEnabled", plan.verifyDuplicates)
            put("contentProbeEnabled", plan.contentProbe)
            putCounters(this, c)
            put("duplicateCandidateFiles", candidateFiles)
            put("duplicateCandidateBytes", candidateBytes)
            put("hashedFiles", hashedFiles)
            put("hashedBytes", hashedBytes)
            put("phaseProcessedFiles", phaseProcessed)
            put("phaseTotalFiles", phaseTotal)
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
        const val ANALYSIS_RULES_VERSION = 3
        const val LARGE_FILE_BYTES = 100L * 1024L * 1024L
        const val OLDER_THAN_DAYS = 365L
        const val OLDER_THAN_MS = OLDER_THAN_DAYS * 24L * 60L * 60L * 1000L
        const val HASH_BUFFER_BYTES = 256 * 1024
        const val CONTENT_PROBE_BYTES = 64 * 1024
        const val INVENTORY_BUFFER_BYTES = 64 * 1024

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
