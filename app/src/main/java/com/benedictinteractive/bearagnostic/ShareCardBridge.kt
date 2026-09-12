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
        val paint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.SUBPIXEL_TEXT_FLAG).apply { isDither = true }

        val regular = Typeface.create("sans-serif", Typeface.NORMAL)
        val medium = Typeface.create("sans-serif-medium", Typeface.NORMAL)
        val bold = Typeface.create("sans-serif", Typeface.BOLD)

        val ink = Color.rgb(20, 47, 76)
        val blue = Color.rgb(32, 160, 234)
        val cyan = Color.rgb(91, 211, 246)
        val mint = Color.rgb(60, 173, 145)
        val mintSoft = Color.rgb(234, 248, 243)
        val surface = Color.rgb(255, 255, 255)
        val panel = Color.rgb(246, 250, 253)
        val panel2 = Color.rgb(241, 248, 252)
        val border = Color.argb(16, 24, 58, 88)
        val subtle = Color.rgb(105, 125, 144)
        val verySubtle = Color.rgb(149, 164, 178)
        val bgTop = Color.rgb(245, 251, 255)
        val bgBottom = Color.rgb(232, 246, 253)

        // Background
        paint.shader = LinearGradient(0f, 0f, 0f, height.toFloat(), bgTop, bgBottom, Shader.TileMode.CLAMP)
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)
        paint.shader = null
        paint.color = Color.argb(22, 108, 197, 243)
        canvas.drawCircle(990f, 86f, 240f, paint)
        paint.color = Color.argb(16, 83, 204, 221)
        canvas.drawCircle(48f, 1290f, 230f, paint)

        // Main sheet
        val sheet = RectF(44f, 44f, 1036f, 1306f)
        paint.setShadowLayer(32f, 0f, 18f, Color.argb(26, 17, 44, 69))
        paint.color = surface
        canvas.drawRoundRect(sheet, 44f, 44f, paint)
        paint.clearShadowLayer()
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 2f
        paint.color = border
        canvas.drawRoundRect(sheet, 44f, 44f, paint)
        paint.style = Paint.Style.FILL

        // Header
        paint.typeface = bold
        paint.textSize = 58f
        paint.color = ink
        canvas.drawText("Bear", 92f, 124f, paint)
        val bearWidth = paint.measureText("Bear")
        paint.color = blue
        canvas.drawText("agnostic", 92f + bearWidth + 4f, 124f, paint)

        paint.typeface = medium
        paint.textSize = 18f
        paint.letterSpacing = 0.14f
        paint.color = subtle
        canvas.drawText(payload.optString("brandLine", "FILE HEALTH • BRIGHTER DAYS"), 94f, 166f, paint)
        paint.letterSpacing = 0f

        val verifiedRect = RectF(790f, 84f, 954f, 144f)
        paint.color = mintSoft
        canvas.drawRoundRect(verifiedRect, 32f, 32f, paint)
        paint.typeface = medium
        paint.textSize = 18f
        paint.color = mint
        drawCenteredText(canvas, "VERIFIED", verifiedRect, paint)

        // Hero
        val hero = RectF(72f, 198f, 1008f, 516f)
        paint.setShadowLayer(18f, 0f, 10f, Color.argb(12, 21, 62, 91))
        paint.shader = LinearGradient(hero.left, hero.top, hero.right, hero.bottom, intArrayOf(Color.rgb(240, 250, 246), Color.WHITE, Color.rgb(240, 248, 253)), floatArrayOf(0f, 0.55f, 1f), Shader.TileMode.CLAMP)
        canvas.drawRoundRect(hero, 40f, 40f, paint)
        paint.clearShadowLayer()
        paint.shader = null
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 1.8f
        paint.color = Color.argb(20, 36, 127, 153)
        canvas.drawRoundRect(hero, 40f, 40f, paint)
        paint.style = Paint.Style.FILL

        val accentRail = RectF(92f, 224f, 106f, 490f)
        paint.shader = LinearGradient(accentRail.left, accentRail.top, accentRail.left, accentRail.bottom, mint, blue, Shader.TileMode.CLAMP)
        canvas.drawRoundRect(accentRail, 7f, 7f, paint)
        paint.shader = null

        paint.typeface = medium
        paint.textSize = 21f
        paint.letterSpacing = 0.18f
        paint.color = mint
        canvas.drawText(payload.optString("kicker", "Cleanup impact").uppercase(), 132f, 258f, paint)
        paint.letterSpacing = 0f

        val reclaimed = payload.optString("reclaimed", "—")
        paint.typeface = bold
        paint.textSize = fitTextSize(paint, reclaimed, 470f, 88f, 46f)
        paint.shader = LinearGradient(132f, 0f, 510f, 0f, cyan, blue, Shader.TileMode.CLAMP)
        canvas.drawText(reclaimed, 132f, 352f, paint)
        paint.shader = null

        paint.typeface = bold
        paint.textSize = 26f
        paint.color = ink
        canvas.drawText(payload.optString("title", "Cleanup impact"), 132f, 402f, paint)

        paint.typeface = medium
        paint.textSize = 22f
        paint.color = subtle
        canvas.drawText(payload.optString("resultLine", "—"), 132f, 440f, paint)

        paint.typeface = regular
        paint.textSize = 18f
        paint.color = subtle
        drawWrappedText(canvas, payload.optString("verifiedSpace", "Verified space reclaimed"), 132f, 476f, 446f, 24f, paint, 2)

        val chipTop = 470f
        drawChip(canvas, paint, RectF(132f, chipTop, 302f, chipTop + 40f), payload.optString("methodValue", "Manual review"), Color.rgb(236, 245, 252), ink, medium)
        drawChip(canvas, paint, RectF(316f, chipTop, 520f, chipTop + 40f), "On-device verified", Color.rgb(238, 249, 245), mint, medium)

        paint.color = Color.argb(18, 86, 198, 243)
        canvas.drawCircle(848f, 356f, 118f, paint)
        paint.color = Color.argb(14, 58, 170, 232)
        canvas.drawCircle(888f, 394f, 138f, paint)

        val mascot = try {
            activity.assets.open("ui/assets/native/mascot/drbear-success.png").use { BitmapFactory.decodeStream(it) }
        } catch (_: Exception) {
            null
        }
        mascot?.let {
            val src = Rect(0, 0, it.width, it.height)
            val dest = fitCenterRect(it.width, it.height, RectF(640f, 220f, 970f, 512f))
            canvas.drawBitmap(it, src, dest, paint)
            it.recycle()
        }

        // What changed
        paint.typeface = bold
        paint.textSize = 28f
        paint.color = ink
        canvas.drawText("What changed", 72f, 582f, paint)

        val cardTop = 614f
        val cardHeight = 176f
        val cardWidth = 300f
        val gap = 18f
        drawMiniStatCard(canvas, paint, RectF(72f, cardTop, 72f + cardWidth, cardTop + cardHeight), payload.optString("filesValue", "0"), payload.optString("filesLabel", "Files removed"), payload.optString("resultLine", ""), ink, subtle, panel, border, bold, medium, regular)
        drawMiniStatCard(canvas, paint, RectF(72f + cardWidth + gap, cardTop, 72f + cardWidth * 2 + gap, cardTop + cardHeight), payload.optString("duplicatesValue", "0"), payload.optString("duplicatesLabel", "Duplicate copies resolved"), payload.optString("detailsLine", ""), ink, subtle, panel, border, bold, medium, regular)

        val freeBefore = payload.optString("freeBefore", "—")
        val freeAfter = payload.optString("freeAfter", freeBefore)
        val freeChanged = payload.optBoolean("freeChanged", false)
        val freeDisplay = if (freeChanged && freeBefore.isNotBlank() && freeAfter.isNotBlank()) "$freeBefore → $freeAfter" else freeAfter.ifBlank { payload.optString("freeValue", "—") }
        drawMiniStatCard(canvas, paint, RectF(72f + (cardWidth + gap) * 2, cardTop, 72f + cardWidth * 3 + gap * 2, cardTop + cardHeight), freeDisplay, payload.optString("freeLabel", "Free storage"), payload.optString("deltaNote", ""), ink, subtle, panel, border, bold, medium, regular)

        // Context section
        paint.typeface = bold
        paint.textSize = 28f
        paint.color = ink
        canvas.drawText("Session notes", 72f, 834f, paint)

        val notes = RectF(72f, 862f, 1008f, 1128f)
        paint.setShadowLayer(12f, 0f, 8f, Color.argb(10, 17, 44, 69))
        paint.color = Color.WHITE
        canvas.drawRoundRect(notes, 34f, 34f, paint)
        paint.clearShadowLayer()
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 1.6f
        paint.color = border
        canvas.drawRoundRect(notes, 34f, 34f, paint)
        paint.style = Paint.Style.FILL

        // left column
        paint.color = blue
        canvas.drawCircle(110f, 918f, 10f, paint)
        paint.typeface = medium
        paint.textSize = 18f
        paint.color = verySubtle
        canvas.drawText("Cleanup method", 130f, 924f, paint)
        paint.typeface = bold
        paint.textSize = 34f
        paint.color = ink
        canvas.drawText(payload.optString("methodValue", "Manual review"), 108f, 976f, paint)
        paint.typeface = regular
        paint.textSize = 18f
        paint.color = subtle
        drawWrappedText(canvas, payload.optString("methodLabel", "Low-risk cleanup resolved"), 108f, 1008f, 330f, 24f, paint, 2)

        paint.color = mint
        canvas.drawCircle(110f, 1070f, 10f, paint)
        paint.typeface = medium
        paint.textSize = 18f
        paint.color = verySubtle
        canvas.drawText("Verification", 130f, 1076f, paint)
        paint.typeface = regular
        paint.textSize = 19f
        paint.color = subtle
        drawWrappedText(canvas, payload.optString("proof", "Only files Android confirmed as deleted are counted."), 108f, 1108f, 330f, 24f, paint, 3)

        // divider
        paint.color = Color.argb(18, 24, 58, 88)
        canvas.drawRect(518f, 896f, 520f, 1096f, paint)

        // right column
        paint.color = mint
        canvas.drawCircle(560f, 918f, 10f, paint)
        paint.typeface = medium
        paint.textSize = 18f
        paint.color = verySubtle
        canvas.drawText("Generated", 580f, 924f, paint)
        paint.typeface = bold
        paint.textSize = 28f
        paint.color = ink
        drawWrappedText(canvas, payload.optString("generatedAt", ""), 558f, 970f, 370f, 34f, paint, 2)

        paint.color = blue
        canvas.drawCircle(560f, 1048f, 10f, paint)
        paint.typeface = medium
        paint.textSize = 18f
        paint.color = verySubtle
        canvas.drawText("Storage note", 580f, 1054f, paint)
        paint.typeface = regular
        paint.textSize = 19f
        paint.color = subtle
        drawWrappedText(canvas, payload.optString("deltaNote", ""), 558f, 1088f, 370f, 24f, paint, 3)

        // footer
        paint.color = Color.argb(18, 24, 58, 88)
        canvas.drawRect(72f, 1178f, 1008f, 1180f, paint)
        paint.typeface = bold
        paint.textSize = 18f
        paint.color = ink
        canvas.drawText("Bearagnostic", 72f, 1236f, paint)
        paint.typeface = regular
        paint.textSize = 16f
        paint.color = subtle
        canvas.drawText("Benedict Interactive · On-device verified result", 72f, 1266f, paint)
        drawChip(canvas, paint, RectF(734f, 1212f, 1008f, 1254f), "Private by design", panel2, subtle, medium)

        val output = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, output)
        bitmap.recycle()
        return output.toByteArray()
    }

    private fun drawMiniStatCard(
        canvas: Canvas,
        paint: Paint,
        rect: RectF,
        value: String,
        label: String,
        detail: String,
        ink: Int,
        subtle: Int,
        fill: Int,
        border: Int,
        bold: Typeface,
        medium: Typeface,
        regular: Typeface,
    ) {
        paint.color = fill
        canvas.drawRoundRect(rect, 30f, 30f, paint)
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 1.5f
        paint.color = border
        canvas.drawRoundRect(rect, 30f, 30f, paint)
        paint.style = Paint.Style.FILL

        paint.typeface = bold
        val preferredSize = if (value.length > 12) 31f else 39f
        paint.textSize = fitTextSize(paint, value, rect.width() - 44f, preferredSize, 22f)
        paint.color = ink
        canvas.drawText(value, rect.left + 22f, rect.top + 58f, paint)

        paint.typeface = medium
        paint.textSize = 18f
        paint.color = subtle
        drawWrappedText(canvas, label, rect.left + 22f, rect.top + 92f, rect.width() - 44f, 22f, paint, 2)

        if (detail.isNotBlank()) {
            paint.typeface = regular
            paint.textSize = 15f
            paint.color = subtle
            drawWrappedText(canvas, detail, rect.left + 22f, rect.top + 130f, rect.width() - 44f, 20f, paint, 2)
        }
    }

    private fun drawChip(
        canvas: Canvas,
        paint: Paint,
        rect: RectF,
        label: String,
        fill: Int,
        textColor: Int,
        typeface: Typeface,
    ) {
        paint.color = fill
        canvas.drawRoundRect(rect, rect.height() / 2f, rect.height() / 2f, paint)
        paint.typeface = typeface
        paint.textSize = 16f
        paint.color = textColor
        drawCenteredText(canvas, label, rect, paint)
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
