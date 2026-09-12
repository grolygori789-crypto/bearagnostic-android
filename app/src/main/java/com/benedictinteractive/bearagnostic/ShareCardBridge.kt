package com.benedictinteractive.bearagnostic

import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.RectF
import android.graphics.Shader
import android.graphics.Typeface
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Base64
import android.webkit.JavascriptInterface
import android.widget.Toast
import org.json.JSONObject
import java.io.ByteArrayOutputStream

class ShareCardBridge(
    private val activity: Activity,
) {
    @JavascriptInterface
    fun shareCleanupCard(payloadJson: String): String {
        return try {
            val payload = JSONObject(payloadJson)
            val title = payload.optString("shareTitle", "Bearagnostic Cleanup Impact").trim().ifBlank {
                "Bearagnostic Cleanup Impact"
            }.take(120)
            val bytes = renderCleanupCard(payload)
            sharePng(title, bytes)
        } catch (error: Exception) {
            JSONObject().apply {
                put("accepted", false)
                put("reason", "cleanup_card_failed")
                put("error", error.javaClass.simpleName)
            }.toString()
        }
    }

    // Retained for compatibility with B61/B62 callers. B63 no longer routes the
    // cleanup-result path through a WebView canvas/data URL.
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
            sharePng(trimmedTitle, Base64.decode(payload, Base64.DEFAULT))
        } catch (error: Exception) {
            JSONObject().apply {
                put("accepted", false)
                put("reason", "share_image_failed")
                put("error", error.javaClass.simpleName)
            }.toString()
        }
    }

    private fun renderCleanupCard(payload: JSONObject): ByteArray {
        val width = 1080
        val height = 1350
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)

        val paint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.SUBPIXEL_TEXT_FLAG).apply {
            isDither = true
        }
        val regular = Typeface.create("sans-serif", Typeface.NORMAL)
        val medium = Typeface.create("sans-serif-medium", Typeface.NORMAL)
        val bold = Typeface.create("sans-serif", Typeface.BOLD)

        val navy = Color.rgb(20, 50, 75)
        val slate = Color.rgb(104, 127, 145)
        val blue = Color.rgb(24, 153, 226)
        val cyan = Color.rgb(45, 190, 232)
        val mint = Color.rgb(54, 170, 145)
        val paleBlue = Color.rgb(241, 248, 253)
        val paleMint = Color.rgb(237, 249, 246)

        paint.shader = LinearGradient(
            0f,
            0f,
            width.toFloat(),
            height.toFloat(),
            intArrayOf(Color.rgb(248, 252, 255), Color.rgb(232, 246, 253), Color.rgb(247, 252, 255)),
            floatArrayOf(0f, 0.56f, 1f),
            Shader.TileMode.CLAMP,
        )
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)
        paint.shader = null

        // Soft brand atmosphere; deliberately restrained so the data remains primary.
        paint.color = Color.argb(26, 47, 183, 232)
        canvas.drawCircle(930f, 170f, 210f, paint)
        paint.color = Color.argb(20, 61, 180, 151)
        canvas.drawCircle(120f, 1210f, 220f, paint)

        val outer = RectF(44f, 44f, 1036f, 1306f)
        paint.color = Color.argb(22, 29, 70, 101)
        paint.setShadowLayer(30f, 0f, 16f, Color.argb(30, 28, 65, 94))
        canvas.drawRoundRect(outer, 46f, 46f, paint)
        paint.clearShadowLayer()
        paint.color = Color.WHITE
        canvas.drawRoundRect(outer, 46f, 46f, paint)

        // Brand wordmark.
        paint.typeface = bold
        paint.textSize = 48f
        paint.color = navy
        canvas.drawText("Bear", 92f, 130f, paint)
        val bearWidth = paint.measureText("Bear")
        paint.color = blue
        canvas.drawText("agnostic", 92f + bearWidth + 4f, 130f, paint)

        paint.typeface = medium
        paint.textSize = 17f
        paint.letterSpacing = 0.16f
        paint.color = slate
        canvas.drawText(payload.optString("brandLine", "FILE HEALTH • BRIGHTER DAYS"), 95f, 167f, paint)
        paint.letterSpacing = 0f

        // Verified pill.
        val pill = RectF(775f, 88f, 946f, 147f)
        paint.color = Color.rgb(234, 248, 243)
        canvas.drawRoundRect(pill, 30f, 30f, paint)
        paint.typeface = medium
        paint.textSize = 18f
        paint.color = mint
        drawCenteredText(canvas, "VERIFIED", pill, paint)

        // Hero panel.
        val hero = RectF(90f, 215f, 990f, 535f)
        paint.shader = LinearGradient(
            hero.left,
            hero.top,
            hero.right,
            hero.bottom,
            intArrayOf(paleMint, Color.rgb(249, 253, 255), Color.rgb(233, 247, 255)),
            null,
            Shader.TileMode.CLAMP,
        )
        canvas.drawRoundRect(hero, 36f, 36f, paint)
        paint.shader = null
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 2f
        paint.color = Color.argb(24, 37, 118, 147)
        canvas.drawRoundRect(hero, 36f, 36f, paint)
        paint.style = Paint.Style.FILL

        paint.typeface = medium
        paint.textSize = 18f
        paint.letterSpacing = 0.18f
        paint.color = Color.rgb(61, 139, 119)
        canvas.drawText(payload.optString("kicker", "CLEANUP IMPACT").uppercase(), 130f, 276f, paint)
        paint.letterSpacing = 0f

        val reclaimed = payload.optString("reclaimed", "—")
        paint.typeface = bold
        paint.textSize = fitTextSize(paint, reclaimed, 460f, 74f, 42f)
        paint.shader = LinearGradient(130f, 0f, 505f, 0f, cyan, blue, Shader.TileMode.CLAMP)
        canvas.drawText(reclaimed, 130f, 372f, paint)
        paint.shader = null

        paint.typeface = medium
        paint.textSize = 23f
        paint.color = navy
        canvas.drawText(payload.optString("title", "Cleanup impact"), 132f, 420f, paint)
        paint.typeface = regular
        paint.textSize = 18f
        paint.color = slate
        drawWrappedText(canvas, payload.optString("verifiedSpace", "Verified space reclaimed"), 132f, 456f, 480f, 26f, paint, 2)

        // Dr.Bear success pose comes from the approved native mascot set already packaged in the app.
        val mascot = try {
            activity.assets.open("ui/assets/native/mascot/drbear-success.png").use { BitmapFactory.decodeStream(it) }
        } catch (_: Exception) {
            null
        }
        mascot?.let {
            val src = Rect(0, 0, it.width, it.height)
            val dest = fitCenterRect(it.width, it.height, RectF(655f, 238f, 950f, 525f))
            paint.alpha = 255
            canvas.drawBitmap(it, src, dest, paint)
            it.recycle()
        }

        paint.typeface = medium
        paint.textSize = 24f
        paint.color = navy
        canvas.drawText("Result summary", 92f, 595f, paint)

        val metrics = listOf(
            Pair(payload.optString("freeValue", "—"), payload.optString("freeLabel", "Free storage")),
            Pair(payload.optString("filesValue", "0"), payload.optString("filesLabel", "Files removed")),
            Pair(payload.optString("duplicatesValue", "0"), payload.optString("duplicatesLabel", "Duplicate copies resolved")),
            Pair(payload.optString("resolvedValue", "—"), payload.optString("resolvedLabel", "Low-risk cleanup resolved")),
        )

        val startX = 92f
        val startY = 630f
        val cellW = 426f
        val cellH = 172f
        val gapX = 30f
        val gapY = 26f
        metrics.forEachIndexed { index, metric ->
            val col = index % 2
            val row = index / 2
            val left = startX + col * (cellW + gapX)
            val top = startY + row * (cellH + gapY)
            val rect = RectF(left, top, left + cellW, top + cellH)
            paint.color = paleBlue
            canvas.drawRoundRect(rect, 28f, 28f, paint)
            paint.style = Paint.Style.STROKE
            paint.strokeWidth = 1.5f
            paint.color = Color.argb(18, 56, 102, 137)
            canvas.drawRoundRect(rect, 28f, 28f, paint)
            paint.style = Paint.Style.FILL

            paint.typeface = medium
            paint.color = navy
            paint.textSize = fitTextSize(paint, metric.first, cellW - 56f, 35f, 24f)
            canvas.drawText(metric.first, left + 28f, top + 67f, paint)
            paint.typeface = regular
            paint.textSize = 18f
            paint.color = slate
            drawWrappedText(canvas, metric.second, left + 28f, top + 108f, cellW - 56f, 24f, paint, 2)
        }

        // Verification note.
        val note = RectF(92f, 1024f, 988f, 1144f)
        paint.color = Color.rgb(248, 251, 253)
        canvas.drawRoundRect(note, 26f, 26f, paint)
        paint.color = mint
        canvas.drawCircle(127f, 1084f, 11f, paint)
        paint.typeface = regular
        paint.textSize = 18f
        paint.color = slate
        drawWrappedText(canvas, payload.optString("proof", "Only files Android confirmed as deleted are counted."), 158f, 1068f, 770f, 27f, paint, 3)

        // Footer.
        paint.color = Color.argb(18, 20, 50, 75)
        canvas.drawRect(92f, 1198f, 988f, 1200f, paint)
        paint.typeface = medium
        paint.textSize = 19f
        paint.color = navy
        canvas.drawText("Bearagnostic", 92f, 1250f, paint)
        paint.typeface = regular
        paint.textSize = 16f
        paint.color = slate
        canvas.drawText("Benedict Interactive · On-device result", 92f, 1280f, paint)

        val output = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, output)
        bitmap.recycle()
        return output.toByteArray()
    }

    private fun drawCenteredText(canvas: Canvas, text: String, rect: RectF, paint: Paint) {
        val metrics = paint.fontMetrics
        val x = rect.centerX() - paint.measureText(text) / 2f
        val y = rect.centerY() - (metrics.ascent + metrics.descent) / 2f
        canvas.drawText(text, x, y, paint)
    }

    private fun drawWrappedText(
        canvas: Canvas,
        text: String,
        x: Float,
        startY: Float,
        maxWidth: Float,
        lineHeight: Float,
        paint: Paint,
        maxLines: Int,
    ): Float {
        val words = text.trim().split(Regex("\\s+")).filter { it.isNotBlank() }
        if (words.isEmpty()) return startY
        var line = ""
        var y = startY
        var lines = 0
        var index = 0
        while (index < words.size && lines < maxLines) {
            val candidate = if (line.isBlank()) words[index] else "$line ${words[index]}"
            if (paint.measureText(candidate) <= maxWidth || line.isBlank()) {
                line = candidate
                index++
            } else {
                canvas.drawText(line, x, y, paint)
                y += lineHeight
                lines++
                line = ""
            }
        }
        if (line.isNotBlank() && lines < maxLines) {
            var finalLine = line
            if (index < words.size) {
                while (finalLine.length > 1 && paint.measureText("$finalLine…") > maxWidth) {
                    finalLine = finalLine.dropLast(1)
                }
                finalLine += "…"
            }
            canvas.drawText(finalLine, x, y, paint)
        }
        return y
    }

    private fun fitTextSize(paint: Paint, text: String, maxWidth: Float, preferred: Float, minimum: Float): Float {
        var size = preferred
        paint.textSize = size
        while (size > minimum && paint.measureText(text) > maxWidth) {
            size -= 1f
            paint.textSize = size
        }
        return size
    }

    private fun fitCenterRect(sourceWidth: Int, sourceHeight: Int, bounds: RectF): RectF {
        if (sourceWidth <= 0 || sourceHeight <= 0) return RectF(bounds)
        val scale = minOf(bounds.width() / sourceWidth.toFloat(), bounds.height() / sourceHeight.toFloat())
        val width = sourceWidth * scale
        val height = sourceHeight * scale
        val left = bounds.centerX() - width / 2f
        val top = bounds.centerY() - height / 2f
        return RectF(left, top, left + width, top + height)
    }

    private fun sharePng(title: String, bytes: ByteArray): String {
        val imageUri = savePngToMediaStore(title, bytes)
            ?: return JSONObject().apply {
                put("accepted", false)
                put("reason", "image_store_failed")
            }.toString()

        val send = Intent(Intent.ACTION_SEND).apply {
            type = "image/png"
            putExtra(Intent.EXTRA_SUBJECT, title)
            putExtra(Intent.EXTRA_STREAM, imageUri)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            clipData = android.content.ClipData.newUri(activity.contentResolver, title, imageUri)
        }
        val chooser = Intent.createChooser(send, title)
        activity.runOnUiThread {
            if (!activity.isFinishing && !activity.isDestroyed) {
                try {
                    activity.startActivity(chooser)
                } catch (_: Exception) {
                    Toast.makeText(activity, "Android could not open the share sheet.", Toast.LENGTH_LONG).show()
                }
            }
        }
        return JSONObject().apply {
            put("accepted", true)
            put("queued", true)
            put("uri", imageUri.toString())
        }.toString()
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
            try {
                resolver.openOutputStream(uri)?.use { it.write(bytes) } ?: run {
                    resolver.delete(uri, null, null)
                    return null
                }
                values.clear()
                values.put(MediaStore.Images.Media.IS_PENDING, 0)
                resolver.update(uri, values, null, null)
                uri
            } catch (error: Exception) {
                resolver.delete(uri, null, null)
                throw error
            }
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
            bitmap.recycle()
            Uri.parse(inserted)
        }
    }

    companion object {
        const val JS_INTERFACE_NAME = "BearagnosticShareBridge"
    }
}
