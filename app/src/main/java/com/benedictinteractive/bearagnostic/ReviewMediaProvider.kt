package com.benedictinteractive.bearagnostic

import android.content.Context
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.media.MediaMetadataRetriever
import android.os.Build
import android.util.Base64
import android.webkit.MimeTypeMap
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.io.File
import java.security.MessageDigest
import kotlin.math.max
import kotlin.math.roundToInt

/**
 * On-demand, local-only media description for the current review snapshot.
 *
 * This provider never writes thumbnails to disk, never accepts an arbitrary path from JavaScript,
 * and never persists file names, paths or media metadata. The scanner resolves a review ID first;
 * this class only renders that already-authorized in-memory review item.
 */
class ReviewMediaProvider(private val context: Context) {

    fun describe(source: FileHealthScanner.ReviewMediaSource, requestedVariant: String): String {
        val file = File(source.path)
        if (!file.exists() || !file.isFile) return unavailable("missing")

        val variant = when (requestedVariant.trim().lowercase()) {
            "large" -> "large"
            "preview" -> "preview"
            else -> "compact"
        }
        val kind = source.fileKind
        val extension = source.extension.lowercase()

        return try {
            JSONObject().apply {
                put("available", true)
                put("id", source.id)
                put("kind", kind)
                put("extension", extension)
                put("mimeType", mimeType(extension, kind))
                put("variant", variant)
                when (kind) {
                    "image" -> describeImage(file, variant, this)
                    "video" -> describeVideo(file, variant, this)
                    "audio" -> describeAudio(file, variant, this)
                    "apk" -> describeApk(file, variant, this)
                    "document" -> put("documentType", extension.uppercase().ifBlank { "DOC" })
                    "archive" -> put("archiveType", extension.uppercase().ifBlank { "ARCHIVE" })
                    else -> Unit
                }
            }.toString()
        } catch (_: Throwable) {
            unavailable("preview_failed")
        }
    }

    private fun describeImage(file: File, variant: String, json: JSONObject) {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeFile(file.absolutePath, bounds)
        if (bounds.outWidth > 0 && bounds.outHeight > 0) {
            json.put("width", bounds.outWidth)
            json.put("height", bounds.outHeight)
        }
        val maxDimension = when (variant) {
            "large" -> 720
            "preview" -> 180
            else -> 0
        }
        if (maxDimension > 0) {
            decodeSampledBitmap(file, bounds, maxDimension)?.useBitmap { bitmap ->
                bitmapDataUrl(bitmap)?.let { json.put("previewDataUrl", it) }
            }
        }
    }

    private fun describeVideo(file: File, variant: String, json: JSONObject) {
        val retriever = MediaMetadataRetriever()
        try {
            retriever.setDataSource(file.absolutePath)
            putLongMetadata(retriever, MediaMetadataRetriever.METADATA_KEY_DURATION, "durationMs", json)
            putIntMetadata(retriever, MediaMetadataRetriever.METADATA_KEY_VIDEO_WIDTH, "width", json)
            putIntMetadata(retriever, MediaMetadataRetriever.METADATA_KEY_VIDEO_HEIGHT, "height", json)
            val maxDimension = when (variant) {
                "large" -> 560
                "preview" -> 200
                else -> 0
            }
            if (maxDimension > 0) {
                val frame = try {
                    retriever.getFrameAtTime(0L, MediaMetadataRetriever.OPTION_CLOSEST_SYNC)
                } catch (_: Exception) {
                    null
                }
                frame?.useBitmap { raw ->
                    val scaled = scaleBitmap(raw, maxDimension)
                    try {
                        bitmapDataUrl(scaled)?.let { json.put("previewDataUrl", it) }
                    } finally {
                        if (scaled !== raw && !scaled.isRecycled) scaled.recycle()
                    }
                }
            }
        } finally {
            try { retriever.release() } catch (_: Exception) {}
        }
    }

    private fun describeAudio(file: File, variant: String, json: JSONObject) {
        val retriever = MediaMetadataRetriever()
        try {
            retriever.setDataSource(file.absolutePath)
            putStringMetadata(retriever, MediaMetadataRetriever.METADATA_KEY_TITLE, "title", json)
            putStringMetadata(retriever, MediaMetadataRetriever.METADATA_KEY_ARTIST, "artist", json)
            putStringMetadata(retriever, MediaMetadataRetriever.METADATA_KEY_ALBUM, "album", json)
            putLongMetadata(retriever, MediaMetadataRetriever.METADATA_KEY_DURATION, "durationMs", json)
            if (variant != "compact") {
                val art = try { retriever.embeddedPicture } catch (_: Exception) { null }
                if (art != null && art.isNotEmpty() && art.size <= MAX_EMBEDDED_ART_BYTES) {
                    val raw = BitmapFactory.decodeByteArray(art, 0, art.size)
                    raw?.useBitmap { bitmap ->
                        val scaled = scaleBitmap(bitmap, if (variant == "large") 320 else 180)
                        try {
                            bitmapDataUrl(scaled)?.let { json.put("previewDataUrl", it) }
                        } finally {
                            if (scaled !== bitmap && !scaled.isRecycled) scaled.recycle()
                        }
                    }
                }
            }
        } finally {
            try { retriever.release() } catch (_: Exception) {}
        }
    }

    /**
     * Reads APK metadata only when the user opens a review surface. This is deliberately
     * separate from Quick Scan so Quick remains metadata-only at the filesystem layer.
     *
     * Android 11+ package visibility can make an installed-package lookup inconclusive.
     * In that case the provider returns `not_confirmed`, never the stronger `not_installed`.
     */
    private fun describeApk(file: File, variant: String, json: JSONObject) {
        val packageManager = context.packageManager
        val archiveInfo = packageArchiveInfo(packageManager, file.absolutePath)
        if (archiveInfo == null) {
            json.put("apkMetadataStatus", "unavailable")
            json.put("installStatus", "metadata_unavailable")
            return
        }

        json.put("apkMetadataStatus", "available")
        val packageName = archiveInfo.packageName.orEmpty().trim().take(MAX_TEXT_CHARS)
        if (packageName.isNotEmpty()) json.put("packageName", packageName)
        archiveInfo.versionName?.trim()?.takeIf { it.isNotEmpty() }?.let {
            json.put("appVersion", it.take(MAX_TEXT_CHARS))
        }
        val archiveVersionCode = packageVersionCode(archiveInfo)
        if (archiveVersionCode >= 0L) json.put("versionCode", archiveVersionCode)

        val applicationInfo = archiveInfo.applicationInfo
        if (applicationInfo != null) {
            applicationInfo.sourceDir = file.absolutePath
            applicationInfo.publicSourceDir = file.absolutePath
            try {
                val label = packageManager.getApplicationLabel(applicationInfo).toString().trim()
                if (label.isNotEmpty()) json.put("appName", label.take(MAX_TEXT_CHARS))
            } catch (_: Exception) {}
        }

        val archiveSigning = signingDigests(archiveInfo)
        if (archiveSigning.isNotEmpty()) json.put("archiveSigningAvailable", true)

        val installedInfo = packageName.takeIf { it.isNotEmpty() }?.let {
            installedPackageInfo(packageManager, it)
        }

        if (installedInfo == null) {
            val visibilityLimited = Build.VERSION.SDK_INT >= Build.VERSION_CODES.R
            json.put("installedMatchConfirmed", false)
            json.put("packageVisibilityLimited", visibilityLimited)
            json.put("signingStatus", "not_checked")
            json.put("installStatus", if (visibilityLimited) "not_confirmed" else "not_installed")
        } else {
            json.put("installedMatchConfirmed", true)
            installedInfo.versionName?.trim()?.takeIf { it.isNotEmpty() }?.let {
                json.put("installedVersion", it.take(MAX_TEXT_CHARS))
            }
            val installedVersionCode = packageVersionCode(installedInfo)
            if (installedVersionCode >= 0L) json.put("installedVersionCode", installedVersionCode)

            val installedSigning = signingDigests(installedInfo)
            val signingStatus = when {
                archiveSigning.isNotEmpty() && installedSigning.isNotEmpty() && archiveSigning.any { it in installedSigning } -> "verified_match"
                archiveSigning.isNotEmpty() && installedSigning.isNotEmpty() -> "mismatch"
                else -> "unavailable"
            }
            json.put("signingStatus", signingStatus)

            val installStatus = when {
                signingStatus == "mismatch" -> "identity_mismatch"
                signingStatus != "verified_match" -> "installed_unverified_identity"
                archiveVersionCode >= 0L && installedVersionCode >= 0L && archiveVersionCode < installedVersionCode -> "older_installer"
                archiveVersionCode >= 0L && installedVersionCode >= 0L && archiveVersionCode == installedVersionCode -> "same_version_installed"
                archiveVersionCode >= 0L && installedVersionCode >= 0L && archiveVersionCode > installedVersionCode -> "newer_installer"
                else -> "installed_confirmed"
            }
            json.put("installStatus", installStatus)
        }

        if (variant != "compact" && applicationInfo != null) {
            try {
                val drawable = packageManager.getApplicationIcon(applicationInfo)
                drawableToBitmap(drawable, if (variant == "large") 220 else 128)?.useBitmap { bitmap ->
                    bitmapDataUrl(bitmap)?.let { json.put("previewDataUrl", it) }
                }
            } catch (_: Exception) {}
        }
    }

    private fun packageArchiveInfo(packageManager: PackageManager, path: String): PackageInfo? {
        val flags = signingFlags()
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                packageManager.getPackageArchiveInfo(
                    path,
                    PackageManager.PackageInfoFlags.of(flags.toLong()),
                )
            } else {
                @Suppress("DEPRECATION")
                packageManager.getPackageArchiveInfo(path, flags)
            }
        } catch (_: Throwable) {
            null
        }
    }

    private fun installedPackageInfo(packageManager: PackageManager, packageName: String): PackageInfo? {
        val flags = signingFlags()
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                packageManager.getPackageInfo(
                    packageName,
                    PackageManager.PackageInfoFlags.of(flags.toLong()),
                )
            } else {
                @Suppress("DEPRECATION")
                packageManager.getPackageInfo(packageName, flags)
            }
        } catch (_: PackageManager.NameNotFoundException) {
            null
        } catch (_: SecurityException) {
            null
        } catch (_: Throwable) {
            null
        }
    }

    private fun signingFlags(): Int = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        PackageManager.GET_SIGNING_CERTIFICATES
    } else {
        @Suppress("DEPRECATION")
        PackageManager.GET_SIGNATURES
    }

    private fun packageVersionCode(info: PackageInfo): Long = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        info.longVersionCode.coerceAtLeast(0L)
    } else {
        @Suppress("DEPRECATION")
        info.versionCode.toLong().coerceAtLeast(0L)
    }

    private fun signingDigests(info: PackageInfo): Set<String> {
        val signatures = try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                val signingInfo = info.signingInfo ?: return emptySet()
                if (signingInfo.hasMultipleSigners()) {
                    signingInfo.apkContentsSigners
                } else {
                    signingInfo.signingCertificateHistory
                }
            } else {
                @Suppress("DEPRECATION")
                info.signatures
            }
        } catch (_: Throwable) {
            null
        } ?: return emptySet()

        return signatures.mapNotNullTo(linkedSetOf()) { signature ->
            try {
                val digest = MessageDigest.getInstance("SHA-256").digest(signature.toByteArray())
                digest.joinToString(separator = "") { byte -> "%02x".format(byte) }
            } catch (_: Throwable) {
                null
            }
        }
    }

    private fun decodeSampledBitmap(file: File, bounds: BitmapFactory.Options, maxDimension: Int): Bitmap? {
        val width = max(1, bounds.outWidth)
        val height = max(1, bounds.outHeight)
        var sample = 1
        while (max(width / sample, height / sample) > maxDimension * 2) sample *= 2
        val options = BitmapFactory.Options().apply {
            inSampleSize = max(1, sample)
            inPreferredConfig = Bitmap.Config.ARGB_8888
        }
        val decoded = try { BitmapFactory.decodeFile(file.absolutePath, options) } catch (_: Throwable) { null } ?: return null
        return scaleBitmap(decoded, maxDimension).also { scaled ->
            if (scaled !== decoded && !decoded.isRecycled) decoded.recycle()
        }
    }

    private fun scaleBitmap(bitmap: Bitmap, maxDimension: Int): Bitmap {
        if (maxDimension <= 0 || max(bitmap.width, bitmap.height) <= maxDimension) return bitmap
        val ratio = maxDimension.toFloat() / max(bitmap.width, bitmap.height).toFloat()
        val width = max(1, (bitmap.width * ratio).roundToInt())
        val height = max(1, (bitmap.height * ratio).roundToInt())
        return Bitmap.createScaledBitmap(bitmap, width, height, true)
    }

    private fun drawableToBitmap(drawable: Drawable, maxDimension: Int): Bitmap? = try {
        val intrinsicWidth = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else maxDimension
        val intrinsicHeight = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else maxDimension
        val ratio = minOf(1f, maxDimension.toFloat() / max(intrinsicWidth, intrinsicHeight).toFloat())
        val width = max(1, (intrinsicWidth * ratio).roundToInt())
        val height = max(1, (intrinsicHeight * ratio).roundToInt())
        Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888).also { bitmap ->
            val canvas = Canvas(bitmap)
            drawable.setBounds(0, 0, canvas.width, canvas.height)
            drawable.draw(canvas)
        }
    } catch (_: Throwable) {
        null
    }

    private fun bitmapDataUrl(bitmap: Bitmap): String? {
        return try {
            val output = ByteArrayOutputStream()
            val hasAlpha = bitmap.hasAlpha()
            val format = if (hasAlpha) Bitmap.CompressFormat.PNG else Bitmap.CompressFormat.JPEG
            val quality = if (hasAlpha) 100 else 84
            if (!bitmap.compress(format, quality, output)) {
                null
            } else {
                val bytes = output.toByteArray()
                if (bytes.size > MAX_PREVIEW_BYTES) {
                    null
                } else {
                    val mime = if (hasAlpha) "image/png" else "image/jpeg"
                    "data:$mime;base64," + Base64.encodeToString(bytes, Base64.NO_WRAP)
                }
            }
        } catch (_: Throwable) {
            null
        }
    }

    private fun putStringMetadata(retriever: MediaMetadataRetriever, key: Int, jsonKey: String, json: JSONObject) {
        val value = try { retriever.extractMetadata(key)?.trim() } catch (_: Exception) { null }
        if (!value.isNullOrEmpty()) json.put(jsonKey, value.take(MAX_TEXT_CHARS))
    }

    private fun putLongMetadata(retriever: MediaMetadataRetriever, key: Int, jsonKey: String, json: JSONObject) {
        val value = try { retriever.extractMetadata(key)?.toLongOrNull() } catch (_: Exception) { null }
        if (value != null && value >= 0L) json.put(jsonKey, value)
    }

    private fun putIntMetadata(retriever: MediaMetadataRetriever, key: Int, jsonKey: String, json: JSONObject) {
        val value = try { retriever.extractMetadata(key)?.toIntOrNull() } catch (_: Exception) { null }
        if (value != null && value > 0) json.put(jsonKey, value)
    }

    private fun mimeType(extension: String, kind: String): String {
        val mapped = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension.lowercase())
        if (!mapped.isNullOrBlank()) return mapped
        return when (kind) {
            "image" -> "image/*"
            "video" -> "video/*"
            "audio" -> "audio/*"
            "apk" -> "application/vnd.android.package-archive"
            "archive" -> "application/octet-stream"
            "document" -> "application/octet-stream"
            else -> "application/octet-stream"
        }
    }

    private inline fun <T> Bitmap.useBitmap(block: (Bitmap) -> T): T {
        return try { block(this) } finally { if (!isRecycled) recycle() }
    }

    private fun unavailable(reason: String): String = JSONObject().apply {
        put("available", false)
        put("reason", reason)
    }.toString()

    companion object {
        private const val MAX_TEXT_CHARS = 160
        private const val MAX_EMBEDDED_ART_BYTES = 8 * 1024 * 1024
        private const val MAX_PREVIEW_BYTES = 600_000
    }
}
