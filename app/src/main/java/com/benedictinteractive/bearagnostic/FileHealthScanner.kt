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

    private val executor = Executors.newSingleThreadExecutor { runnable ->
        Thread(runnable, "BearagnosticFileScanner").apply { priority = Thread.NORM_PRIORITY - 1 }
    }
    private val cancelRequested = AtomicBoolean(false)

    @Volatile
    private var running = false

    fun isRunning(): Boolean = running

    @Synchronized
    fun start(listener: Listener): Boolean {
        if (running) return false
        running = true
        cancelRequested.set(false)
        executor.execute { runScan(listener) }
        return true
    }

    fun cancel() {
        cancelRequested.set(true)
    }

    fun shutdown() {
        cancelRequested.set(true)
        executor.shutdownNow()
    }

    private fun runScan(listener: Listener) {
        val startedAt = SystemClock.elapsedRealtime()
        try {
            val roots = discoverRoots()
            if (roots.isEmpty()) {
                running = false
                listener.onError(errorJson("no_accessible_storage"))
                return
            }

            emit(
                listener,
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
            roots.forEach(queue::addLast)

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
                ensureNotCancelled(listener, startedAt, reviewed) ?: return
                val current = queue.removeFirst()

                if (current.isDirectory) {
                    if (shouldSkipDirectory(current, roots)) continue
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

                if (size > 0L) {
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
                        listener,
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

            emit(
                listener,
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

            var hashedFiles = 0L
            var hashedBytes = 0L
            var duplicateGroups = 0L
            var duplicateCopies = 0L
            var reclaimableBytes = 0L
            var hashReadFailures = 0L
            lastProgressAt = 0L

            for ((size, files) in sameSizeGroups) {
                ensureNotCancelled(listener, startedAt, reviewed) ?: return
                val byHash = HashMap<String, Int>()

                for (file in files) {
                    ensureNotCancelled(listener, startedAt, reviewed) ?: return
                    val digest = hashFile(file) { bytesRead ->
                        hashedBytes = safeAdd(hashedBytes, bytesRead)
                        val now = SystemClock.elapsedRealtime()
                        if (now - lastProgressAt >= 180L) {
                            lastProgressAt = now
                            emit(
                                listener,
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

            emit(
                listener,
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
                put("rootsScanned", roots.size)
                put("durationMs", SystemClock.elapsedRealtime() - startedAt)
                put("largeFileThresholdBytes", LARGE_FILE_BYTES)
                put("olderThanDays", OLDER_THAN_DAYS)
                put("scope", "accessible_shared_storage")
                put("deletionPerformed", false)
            }
            running = false
            listener.onComplete(result.toString())
        } catch (_: Throwable) {
            running = false
            if (cancelRequested.get()) {
                listener.onCancelled(cancelJson(startedAt, 0))
            } else {
                listener.onError(errorJson("scan_failed"))
            }
        } finally {
            running = false
            cancelRequested.set(false)
        }
    }

    private fun discoverRoots(): List<File> {
        val roots = LinkedHashMap<String, File>()

        fun addRoot(file: File?) {
            if (file == null) return
            val canonical = try {
                file.canonicalFile
            } catch (_: Exception) {
                file.absoluteFile
            }
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

    private fun shouldSkipDirectory(directory: File, roots: List<File>): Boolean {
        val path = try {
            directory.canonicalPath
        } catch (_: Exception) {
            directory.absolutePath
        }

        if (roots.any { path == it.absolutePath }) return false

        val normalized = path.replace('\\', '/').lowercase()
        return normalized.endsWith("/android/data") ||
            normalized.contains("/android/data/") ||
            normalized.endsWith("/android/obb") ||
            normalized.contains("/android/obb/")
    }

    private fun isSymbolicLink(file: File): Boolean {
        return try {
            Files.isSymbolicLink(file.toPath())
        } catch (_: Exception) {
            false
        }
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

    private fun ensureNotCancelled(listener: Listener, startedAt: Long, reviewed: Long): Unit? {
        if (!cancelRequested.get()) return Unit
        running = false
        listener.onCancelled(cancelJson(startedAt, reviewed))
        return null
    }

    private fun emit(
        listener: Listener,
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

    private fun cancelJson(startedAt: Long, reviewed: Long): String = JSONObject().apply {
        put("state", "cancelled")
        put("reviewedFiles", reviewed)
        put("durationMs", SystemClock.elapsedRealtime() - startedAt)
    }.toString()

    private fun errorJson(code: String): String = JSONObject().apply {
        put("state", "error")
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
    }
}
