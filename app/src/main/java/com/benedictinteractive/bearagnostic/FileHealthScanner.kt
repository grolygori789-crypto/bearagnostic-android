package com.benedictinteractive.bearagnostic

import android.content.Context
import android.os.Build
import android.os.Environment
import android.os.SystemClock
import android.os.storage.StorageManager
import org.json.JSONObject
import java.io.File
import java.io.FileInputStream
import java.nio.file.Files
import java.security.MessageDigest
import java.util.ArrayDeque
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

class FileHealthScanner(private val context: Context) {
    interface Listener {
        fun onProgress(json: String)
        fun onComplete(json: String)
        fun onCancelled(json: String)
        fun onError(json: String)
    }

    enum class ScanMode(val wireName: String) {
        SMART("smart"),
        QUICK("quick"),
        DEEP("deep"),
        CUSTOM("custom");

        companion object {
            fun fromWire(raw: String): ScanMode = entries.firstOrNull {
                it.wireName == raw.trim().lowercase()
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
        val scope: String,
        val duplicateCoverage: String,
    )

    private val executor = Executors.newSingleThreadExecutor { runnable ->
        Thread(runnable, "BearagnosticFileScanner").apply { priority = Thread.NORM_PRIORITY - 1 }
    }
    private val cancelRequested = AtomicBoolean(false)

    @Volatile
    private var running = false

    fun isRunning(): Boolean = running

    @Synchronized
    fun start(request: ScanRequest, listener: Listener): Boolean {
        if (running) return false
        running = true
        cancelRequested.set(false)
        executor.execute { runScan(request, listener) }
        return true
    }

    fun cancel() {
        cancelRequested.set(true)
    }

    fun shutdown() {
        cancelRequested.set(true)
        executor.shutdownNow()
    }

    private fun runScan(request: ScanRequest, listener: Listener) {
        val startedAt = SystemClock.elapsedRealtime()
        try {
            val storageRoots = discoverRoots()
            if (storageRoots.isEmpty()) {
                running = false
                listener.onError(errorJson("no_accessible_storage", request.mode))
                return
            }

            val plan = buildPlan(request, storageRoots)
            if (plan.targets.isEmpty()) {
                running = false
                listener.onError(errorJson("no_matching_scan_locations", request.mode))
                return
            }

            emit(
                listener = listener,
                request = request,
                plan = plan,
                phase = "preparing",
                reviewed = 0,
                totalBytes = 0,
                largeFiles = 0,
                olderFiles = 0,
                unreadableFiles = 0,
                inaccessibleFolders = 0,
                candidateFiles = 0,
                candidateBytes = 0,
                hashedFiles = 0,
                hashedBytes = 0,
            )

            val firstBySize = HashMap<Long, File>(4096)
            val sameSizeGroups = HashMap<Long, MutableList<File>>()
            val queue = ArrayDeque<File>()
            plan.targets.forEach(queue::addLast)

            var reviewed = 0L
            var totalBytes = 0L
            var largeFiles = 0L
            var olderFiles = 0L
            var unreadableFiles = 0L
            var inaccessibleFolders = 0L
            var directoriesVisited = 0L
            val olderThan = System.currentTimeMillis() - OLDER_THAN_MS
            var lastProgressAt = 0L

            while (queue.isNotEmpty()) {
                ensureNotCancelled(listener, startedAt, reviewed, request.mode) ?: return
                val current = queue.removeFirst()

                if (current.isDirectory) {
                    if (shouldSkipDirectory(current, plan.targets)) continue
                    directoriesVisited++
                    val children = try {
                        current.listFiles()
                    } catch (_: SecurityException) {
                        null
                    }
                    if (children == null) {
                        inaccessibleFolders++
                    } else {
                        for (child in children) {
                            if (!isSymbolicLink(child)) queue.addLast(child)
                        }
                    }
                    continue
                }

                if (!current.isFile) continue

                val size = try {
                    current.length().coerceAtLeast(0L)
                } catch (_: SecurityException) {
                    unreadableFiles++
                    continue
                }

                reviewed++
                totalBytes = safeAdd(totalBytes, size)
                if (size >= LARGE_FILE_BYTES) largeFiles++

                val modified = try {
                    current.lastModified()
                } catch (_: SecurityException) {
                    0L
                }
                if (modified in 1 until olderThan) olderFiles++

                if (plan.verifyDuplicates && size > 0L && isDuplicateEligible(current, plan.duplicateEligibleRoots)) {
                    val group = sameSizeGroups[size]
                    if (group != null) {
                        group.add(current)
                    } else {
                        val first = firstBySize.putIfAbsent(size, current)
                        if (first != null) {
                            sameSizeGroups[size] = mutableListOf(first, current)
                        }
                    }
                }

                val now = SystemClock.elapsedRealtime()
                if (reviewed % 96L == 0L || now - lastProgressAt >= 220L) {
                    lastProgressAt = now
                    emit(
                        listener = listener,
                        request = request,
                        plan = plan,
                        phase = "files",
                        reviewed = reviewed,
                        totalBytes = totalBytes,
                        largeFiles = largeFiles,
                        olderFiles = olderFiles,
                        unreadableFiles = unreadableFiles,
                        inaccessibleFolders = inaccessibleFolders,
                        candidateFiles = 0,
                        candidateBytes = 0,
                        hashedFiles = 0,
                        hashedBytes = 0,
                        directoriesVisited = directoriesVisited,
                    )
                }
            }

            firstBySize.clear()

            var candidateFiles = 0L
            var candidateBytes = 0L
            for ((size, files) in sameSizeGroups) {
                candidateFiles = safeAdd(candidateFiles, files.size.toLong())
                candidateBytes = safeAdd(candidateBytes, safeMultiply(size, files.size.toLong()))
            }

            if (plan.verifyDuplicates) {
                emit(
                    listener = listener,
                    request = request,
                    plan = plan,
                    phase = "duplicates",
                    reviewed = reviewed,
                    totalBytes = totalBytes,
                    largeFiles = largeFiles,
                    olderFiles = olderFiles,
                    unreadableFiles = unreadableFiles,
                    inaccessibleFolders = inaccessibleFolders,
                    candidateFiles = candidateFiles,
                    candidateBytes = candidateBytes,
                    hashedFiles = 0,
                    hashedBytes = 0,
                    directoriesVisited = directoriesVisited,
                )
            }

            var hashedFiles = 0L
            var hashedBytes = 0L
            var duplicateGroups = 0L
            var duplicateCopies = 0L
            var reclaimableBytes = 0L
            var hashReadFailures = 0L
            lastProgressAt = 0L

            if (plan.verifyDuplicates) {
                for ((size, files) in sameSizeGroups) {
                    ensureNotCancelled(listener, startedAt, reviewed, request.mode) ?: return
                    val byHash = HashMap<String, Int>()

                    for (file in files) {
                        ensureNotCancelled(listener, startedAt, reviewed, request.mode) ?: return
                        val digest = hashFile(file) { bytesRead ->
                            hashedBytes = safeAdd(hashedBytes, bytesRead)
                            val now = SystemClock.elapsedRealtime()
                            if (now - lastProgressAt >= 180L) {
                                lastProgressAt = now
                                emit(
                                    listener = listener,
                                    request = request,
                                    plan = plan,
                                    phase = "duplicates",
                                    reviewed = reviewed,
                                    totalBytes = totalBytes,
                                    largeFiles = largeFiles,
                                    olderFiles = olderFiles,
                                    unreadableFiles = unreadableFiles,
                                    inaccessibleFolders = inaccessibleFolders,
                                    candidateFiles = candidateFiles,
                                    candidateBytes = candidateBytes,
                                    hashedFiles = hashedFiles,
                                    hashedBytes = hashedBytes,
                                    directoriesVisited = directoriesVisited,
                                )
                            }
                        }

                        if (digest == null) {
                            hashReadFailures++
                            continue
                        }
                        hashedFiles++
                        byHash[digest] = (byHash[digest] ?: 0) + 1
                    }

                    for (count in byHash.values) {
                        if (count > 1) {
                            duplicateGroups++
                            val copies = count - 1L
                            duplicateCopies = safeAdd(duplicateCopies, copies)
                            reclaimableBytes = safeAdd(reclaimableBytes, safeMultiply(size, copies))
                        }
                    }
                }
            }

            emit(
                listener = listener,
                request = request,
                plan = plan,
                phase = "finalizing",
                reviewed = reviewed,
                totalBytes = totalBytes,
                largeFiles = largeFiles,
                olderFiles = olderFiles,
                unreadableFiles = unreadableFiles,
                inaccessibleFolders = inaccessibleFolders,
                candidateFiles = candidateFiles,
                candidateBytes = candidateBytes,
                hashedFiles = hashedFiles,
                hashedBytes = hashedBytes,
                directoriesVisited = directoriesVisited,
            )

            val result = JSONObject().apply {
                put("state", "complete")
                put("scanMode", request.mode.wireName)
                put("scope", plan.scope)
                put("duplicateCoverage", plan.duplicateCoverage)
                put("duplicateVerificationPerformed", plan.verifyDuplicates)
                put("reviewedFiles", reviewed)
                put("directoriesVisited", directoriesVisited)
                put("totalBytes", totalBytes)
                put("largeFiles", largeFiles)
                put("olderFiles", olderFiles)
                put("duplicateGroups", duplicateGroups)
                put("duplicateCopies", duplicateCopies)
                put("duplicateReclaimableBytes", reclaimableBytes)
                put("duplicateCandidateFiles", candidateFiles)
                put("duplicateCandidateBytes", candidateBytes)
                put("hashedFiles", hashedFiles)
                put("hashedBytes", hashedBytes)
                put("unreadableFiles", unreadableFiles)
                put("inaccessibleFolders", inaccessibleFolders)
                put("hashReadFailures", hashReadFailures)
                put("rootsScanned", plan.targets.size)
                put("durationMs", SystemClock.elapsedRealtime() - startedAt)
                put("largeFileThresholdBytes", LARGE_FILE_BYTES)
                put("olderThanDays", OLDER_THAN_DAYS)
                put("deletionPerformed", false)
            }
            running = false
            listener.onComplete(result.toString())
        } catch (_: Throwable) {
            running = false
            if (cancelRequested.get()) {
                listener.onCancelled(cancelJson(startedAt, 0, request.mode))
            } else {
                listener.onError(errorJson("scan_failed", request.mode))
            }
        } finally {
            running = false
            cancelRequested.set(false)
        }
    }

    private fun buildPlan(request: ScanRequest, storageRoots: List<File>): ScanPlan {
        val priority = uniqueDirectories(storageRoots.flatMap(::priorityDirectories))

        return when (request.mode) {
            ScanMode.QUICK -> ScanPlan(
                targets = if (priority.isNotEmpty()) priority else storageRoots,
                duplicateEligibleRoots = emptyList(),
                verifyDuplicates = false,
                scope = if (priority.isNotEmpty()) "priority_shared_locations" else "accessible_shared_storage",
                duplicateCoverage = "none",
            )

            ScanMode.SMART -> ScanPlan(
                targets = storageRoots,
                duplicateEligibleRoots = if (priority.isNotEmpty()) priority else storageRoots,
                verifyDuplicates = true,
                scope = "accessible_shared_storage",
                duplicateCoverage = if (priority.isNotEmpty()) "priority_locations" else "all_accessible",
            )

            ScanMode.DEEP -> ScanPlan(
                targets = storageRoots,
                duplicateEligibleRoots = storageRoots,
                verifyDuplicates = true,
                scope = "accessible_shared_storage",
                duplicateCoverage = "all_accessible",
            )

            ScanMode.CUSTOM -> {
                val customTargets = uniqueDirectories(storageRoots.flatMap { root ->
                    customDirectories(root, request.customScopes)
                })
                val targets = if (customTargets.isNotEmpty()) customTargets else priority.ifEmpty { storageRoots }
                ScanPlan(
                    targets = targets,
                    duplicateEligibleRoots = if (request.verifyDuplicates) targets else emptyList(),
                    verifyDuplicates = request.verifyDuplicates,
                    scope = if (customTargets.isNotEmpty()) "custom_shared_locations" else "priority_shared_locations",
                    duplicateCoverage = if (request.verifyDuplicates) "selected_locations" else "none",
                )
            }
        }
    }

    private fun discoverRoots(): List<File> {
        val roots = LinkedHashMap<String, File>()

        fun addRoot(file: File?) {
            if (file == null) return
            val canonical = canonicalFile(file)
            if (canonical.exists() && canonical.isDirectory) {
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
    ).map { File(root, it) }.filter { it.exists() && it.isDirectory }

    private fun customDirectories(root: File, scopes: Set<String>): List<File> {
        val requested = if (scopes.isEmpty()) DEFAULT_CUSTOM_SCOPES else scopes
        val output = mutableListOf<File>()

        fun add(type: String) {
            val file = File(root, type)
            if (file.exists() && file.isDirectory) output += file
        }

        if ("downloads" in requested) add(Environment.DIRECTORY_DOWNLOADS)
        if ("photos" in requested) {
            add(Environment.DIRECTORY_DCIM)
            add(Environment.DIRECTORY_PICTURES)
        }
        if ("videos" in requested) add(Environment.DIRECTORY_MOVIES)
        if ("documents" in requested) add(Environment.DIRECTORY_DOCUMENTS)
        if ("music" in requested) add(Environment.DIRECTORY_MUSIC)
        return output
    }

    private fun uniqueDirectories(files: List<File>): List<File> {
        val unique = LinkedHashMap<String, File>()
        for (file in files) {
            val canonical = canonicalFile(file)
            unique[canonical.absolutePath] = canonical
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

        val normalized = path.replace('\\', '/').lowercase()
        return normalized.endsWith("/android/data") ||
            normalized.contains("/android/data/") ||
            normalized.endsWith("/android/obb") ||
            normalized.contains("/android/obb/")
    }

    private fun canonicalFile(file: File): File = try {
        file.canonicalFile
    } catch (_: Exception) {
        file.absoluteFile
    }

    private fun isSymbolicLink(file: File): Boolean = try {
        Files.isSymbolicLink(file.toPath())
    } catch (_: Exception) {
        false
    }

    private fun hashFile(file: File, onBytes: (Long) -> Unit): String? {
        return try {
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
    }

    private fun ensureNotCancelled(
        listener: Listener,
        startedAt: Long,
        reviewed: Long,
        mode: ScanMode,
    ): Unit? {
        if (!cancelRequested.get()) return Unit
        running = false
        listener.onCancelled(cancelJson(startedAt, reviewed, mode))
        return null
    }

    private fun emit(
        listener: Listener,
        request: ScanRequest,
        plan: ScanPlan,
        phase: String,
        reviewed: Long,
        totalBytes: Long,
        largeFiles: Long,
        olderFiles: Long,
        unreadableFiles: Long,
        inaccessibleFolders: Long,
        candidateFiles: Long,
        candidateBytes: Long,
        hashedFiles: Long,
        hashedBytes: Long,
        directoriesVisited: Long = 0,
    ) {
        listener.onProgress(JSONObject().apply {
            put("state", "running")
            put("phase", phase)
            put("scanMode", request.mode.wireName)
            put("scope", plan.scope)
            put("duplicateCoverage", plan.duplicateCoverage)
            put("duplicateVerificationEnabled", plan.verifyDuplicates)
            put("reviewedFiles", reviewed)
            put("directoriesVisited", directoriesVisited)
            put("totalBytes", totalBytes)
            put("largeFiles", largeFiles)
            put("olderFiles", olderFiles)
            put("unreadableFiles", unreadableFiles)
            put("inaccessibleFolders", inaccessibleFolders)
            put("duplicateCandidateFiles", candidateFiles)
            put("duplicateCandidateBytes", candidateBytes)
            put("hashedFiles", hashedFiles)
            put("hashedBytes", hashedBytes)
        }.toString())
    }

    private fun cancelJson(startedAt: Long, reviewed: Long, mode: ScanMode): String = JSONObject().apply {
        put("state", "cancelled")
        put("scanMode", mode.wireName)
        put("reviewedFiles", reviewed)
        put("durationMs", SystemClock.elapsedRealtime() - startedAt)
    }.toString()

    private fun errorJson(code: String, mode: ScanMode): String = JSONObject().apply {
        put("state", "error")
        put("scanMode", mode.wireName)
        put("code", code)
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
        const val LARGE_FILE_BYTES = 100L * 1024L * 1024L
        const val OLDER_THAN_DAYS = 365L
        const val OLDER_THAN_MS = OLDER_THAN_DAYS * 24L * 60L * 60L * 1000L
        const val HASH_BUFFER_BYTES = 256 * 1024
        val DEFAULT_CUSTOM_SCOPES = setOf("downloads", "photos", "videos", "documents")
    }
}
