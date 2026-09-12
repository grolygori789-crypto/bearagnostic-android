package com.benedictinteractive.bearagnostic

import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Base64
import android.webkit.JavascriptInterface
import android.widget.Toast
import org.json.JSONObject

class ShareCardBridge(
    private val activity: Activity,
) {
    @JavascriptInterface
    fun shareImage(title: String, dataUrl: String): String {
        val trimmedTitle = title.trim().ifBlank { "Bearagnostic Result" }.take(120)
        val payload = dataUrl.substringAfter(",", missingDelimiterValue = "").trim()
        if (payload.isBlank()) {
            return JSONObject().apply {
                put("accepted", false)
                put("reason", "empty_image")
            }.toString()
        }
        return try {
            val bytes = Base64.decode(payload, Base64.DEFAULT)
            val imageUri = savePngToMediaStore(trimmedTitle, bytes)
                ?: return JSONObject().apply {
                    put("accepted", false)
                    put("reason", "image_store_failed")
                }.toString()

            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "image/png"
                putExtra(Intent.EXTRA_SUBJECT, trimmedTitle)
                putExtra(Intent.EXTRA_STREAM, imageUri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                clipData = android.content.ClipData.newUri(activity.contentResolver, trimmedTitle, imageUri)
            }
            val chooser = Intent.createChooser(shareIntent, trimmedTitle)
            activity.runOnUiThread {
                if (!activity.isFinishing && !activity.isDestroyed) {
                    try {
                        activity.startActivity(chooser)
                    } catch (_: Exception) {
                        Toast.makeText(activity, "Android could not open the share sheet.", Toast.LENGTH_LONG).show()
                    }
                }
            }
            JSONObject().apply {
                put("accepted", true)
                put("queued", true)
                put("uri", imageUri.toString())
            }.toString()
        } catch (error: Exception) {
            JSONObject().apply {
                put("accepted", false)
                put("reason", "share_image_failed")
                put("error", error.javaClass.simpleName)
            }.toString()
        }
    }

    private fun savePngToMediaStore(title: String, bytes: ByteArray): Uri? {
        val safeName = title.replace(Regex("[^A-Za-z0-9._-]+"), "-").trim('-').ifBlank { "Bearagnostic-Result" }
        val fileName = "$safeName-${System.currentTimeMillis()}.png"
        val resolver = activity.contentResolver

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val values = ContentValues().apply {
                put(MediaStore.Images.Media.DISPLAY_NAME, fileName)
                put(MediaStore.Images.Media.MIME_TYPE, "image/png")
                put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/Bearagnostic")
                put(MediaStore.Images.Media.IS_PENDING, 1)
            }
            val uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values) ?: return null
            resolver.openOutputStream(uri)?.use { it.write(bytes) } ?: return null
            values.clear()
            values.put(MediaStore.Images.Media.IS_PENDING, 0)
            resolver.update(uri, values, null, null)
            uri
        } else {
            @Suppress("DEPRECATION")
            val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size) ?: return null
            @Suppress("DEPRECATION")
            val inserted = MediaStore.Images.Media.insertImage(
                resolver,
                bitmap,
                fileName,
                "Bearagnostic premium result card",
            ) ?: return null
            Uri.parse(inserted)
        }
    }

    companion object {
        const val JS_INTERFACE_NAME = "BearagnosticShareBridge"
    }
}
