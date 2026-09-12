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
import android.graphics.Path
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

        val navy = Color.rgb(18, 47, 78)
        val slate = Color.rgb(99, 121, 141)
        val steel = Color.rgb(150, 167, 182)
        val blue = Color.rgb(30, 154, 227)
        val cyan = Color.rgb(73, 196, 239)
        val mint = Color.rgb(59, 171, 142)
        val bgTop = Color.rgb(246, 251, 255)
        val bgBottom = Color.rgb(236, 247, 253)
        val cardStroke = Color.argb(16, 21, 63, 92)
        val paleBlue = Color.rgb(244, 249, 253)
        val paleMint = Color.rgb(238, 249, 245)

        paint.shader = LinearGradient(
            0f, 0f, 0f, height.toFloat(),
            intArrayOf(bgTop, bgBottom),
            floatArrayOf(0f, 1f),
            Shader.TileMode.CLAMP,
        )
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)
        paint.shader = null

        paint.color = Color.argb(22, 58, 178, 230)
        canvas.drawCircle(1000f, 104f, 250f, paint)
        paint.color = Color.argb(20, 99, 212, 230)
        canvas.drawCircle(66f, 1284f, 220f, paint)

        val outer = RectF(48f, 46f, 1032f, 1298f)
        paint.setShadowLayer(28f, 0f, 18f, Color.argb(28, 22, 56, 86))
        paint.color = Color.WHITE
        canvas.drawRoundRect(outer, 44f, 44f, paint)
        paint.clearShadowLayer()
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 2f
        paint.color = cardStroke
        canvas.drawRoundRect(outer, 44f, 44f, paint)
        paint.style = Paint.Style.FILL

        // Header
        paint.typeface = bold
        paint.textSize = 58f
        paint.color = navy
        canvas.drawText("Bear", 94f, 128f, paint)
        val bearWidth = paint.measureText("Bear")
        paint.color = blue
        canvas.drawText("agnostic", 94f + bearWidth + 4f, 128f, paint)

        paint.typeface = medium
        paint.textSize = 18f
        paint.letterSpacing = 0.14f
        paint.color = slate
        canvas.drawText(payload.optString("brandLine", "FILE HEALTH • BRIGHTER DAYS"), 96f, 168f, paint)
        paint.letterSpacing = 0f

        val pillRect = RectF(782f, 86f, 949f, 146f)
        paint.color = Color.rgb(234, 248, 242)
        canvas.drawRoundRect(pillRect, 30f, 30f, paint)
        paint.typeface = medium
        paint.textSize = 18f
        paint.color = mint
        drawCenteredText(canvas, "VERIFIED", pillRect, paint)

        // Hero card
        val hero = RectF(92f, 214f, 988f, 508f)
        paint.shader = LinearGradient(
            hero.left, hero.top, hero.right, hero.bottom,
            intArrayOf(paleMint, Color.WHITE, Color.rgb(239, 248, 253)),
            floatArrayOf(0f, 0.52f, 1f),
            Shader.TileMode.CLAMP,
        )
        canvas.drawRoundRect(hero, 38f, 38f, paint)
        paint.shader = null
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 2f
        paint.color = Color.argb(18, 36, 121, 149)
        canvas.drawRoundRect(hero, 38f, 38f, paint)
        paint.style = Paint.Style.FILL

        paint.typeface = medium
        paint.textSize = 20f
        paint.letterSpacing = 0.18f
        paint.color = Color.rgb(63, 143, 121)
        canvas.drawText(payload.optString("kicker", "Cleanup impact").uppercase(), 132f, 272f, paint)
        paint.letterSpacing = 0f

        val reclaimed = payload.optString("reclaimed", "—")
        paint.typeface = bold
        paint.textSize = fitTextSize(paint, reclaimed, 470f, 82f, 46f)
        paint.shader = LinearGradient(132f, 0f, 520f, 0f, cyan, blue, Shader.TileMode.CLAMP)
        canvas.drawText(reclaimed, 132f, 368f, paint)
        paint.shader = null

        paint.typeface = bold
        paint.textSize = 26f
        paint.color = navy
        canvas.drawText(payload.optString("title", "Cleanup impact"), 134f, 420f, paint)

        paint.typeface = medium
        paint.textSize = 21f
        paint.color = slate
        canvas.drawText(payload.optString("resultLine", "—"), 134f, 456f, paint)

        paint.typeface = regular
        paint.textSize = 18f
        paint.color = slate
        drawWrappedText(canvas, payload.optString("verifiedSpace", "Verified space reclaimed"), 134f, 488f, 460f, 24f, paint, 2)

        val mascot = try {
            activity.assets.open("ui/assets/native/mascot/drbear-success.png").use { BitmapFactory.decodeStream(it) }
        } catch (_: Exception) {
            null
        }
        mascot?.let {
            val src = Rect(0, 0, it.width, it.height)
            val dest = fitCenterRect(it.width, it.height, RectF(654f, 220f, 948f, 502f))
            canvas.drawBitmap(it, src, dest, paint)
            it.recycle()
        }

        // Section label
        paint.typeface = bold
        paint.textSize = 24f
        paint.color = navy
        canvas.drawText("Verified cleanup summary", 92f, 562f, paint)

        // metric cards
        val metricTop = 606f
        val metricW = 428f
        val metricH = 154f
        val gapX = 28f
        val gapY = 24f

        drawMetricCard(canvas, paint, regular, medium, bold, RectF(92f, metricTop, 92f + metricW, metricTop + metricH), payload.optString("filesValue", "0"), payload.optString("filesLabel", "Files removed"), null, navy, slate, paleBlue, cardStroke)
        drawMetricCard(canvas, paint, regular, medium, bold, RectF(92f + metricW + gapX, metricTop, 92f + metricW + gapX + metricW, metricTop + metricH), payload.optString("duplicatesValue", "0"), payload.optString("duplicatesLabel", "Duplicate copies resolved"), null, navy, slate, paleBlue, cardStroke)

        val methodValue = payload.optString("methodValue", "—")
        val methodLabel = payload.optString("methodLabel", "Cleanup method")
        drawMetricCard(canvas, paint, regular, medium, bold, RectF(92f, metricTop + metricH + gapY, 92f + metricW, metricTop + metricH + gapY + metricH), methodValue, methodLabel, null, navy, slate, paleBlue, cardStroke)

        val freeBefore = payload.optString("freeBefore", "—")
        val freeAfter = payload.optString("freeAfter", freeBefore)
        val freeChanged = payload.optBoolean("freeChanged", false)
        val freeDisplay = if (freeChanged && freeBefore.isNotBlank() && freeAfter.isNotBlank()) "$freeBefore → $freeAfter" else freeAfter.ifBlank { payload.optString("freeValue", "—") }
        val freeDetail = if (freeChanged) "Before cleanup → after cleanup" else "No visible percentage change after cleanup"
        drawMetricCard(canvas, paint, regular, medium, bold, RectF(92f + metricW + gapX, metricTop + metricH + gapY, 92f + metricW + gapX + metricW, metricTop + metricH + gapY + metricH), freeDisplay, payload.optString("freeLabel", "Free storage"), freeDetail, navy, slate, paleBlue, cardStroke)

        // proof / details card
        val proofRect = RectF(92f, 962f, 988f, 1116f)
        paint.color = Color.rgb(248, 251, 253)
        canvas.drawRoundRect(proofRect, 28f, 28f, paint)
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 1.5f
        paint.color = cardStroke
        canvas.drawRoundRect(proofRect, 28f, 28f, paint)
        paint.style = Paint.Style.FILL

        paint.color = mint
        canvas.drawCircle(130f, 1020f, 10f, paint)
        paint.typeface = medium
        paint.textSize = 20f
        paint.color = navy
        canvas.drawText("Verification", 158f, 1026f, paint)
        paint.typeface = regular
        paint.textSize = 18f
        paint.color = slate
        drawWrappedText(canvas, payload.optString("proof", "Only files Android confirmed as deleted are counted."), 158f, 1060f, 784f, 25f, paint, 2)

        paint.color = steel
        canvas.drawRect(156f, 1088f, 924f, 1090f, paint)
        paint.typeface = medium
        paint.textSize = 17f
        paint.color = slate
        canvas.drawText("Generated", 158f, 1148f, paint)
        paint.typeface = regular
        paint.textSize = 17f
        drawRightAlignedText(canvas, payload.optString("generatedAt", ""), 922f, 1148f, paint)

        // footer
        paint.color = Color.argb(20, 18, 47, 78)
        canvas.drawRect(92f, 1188f, 988f, 1190f, paint)
        paint.typeface = bold
        paint.textSize = 18f
        paint.color = navy
        canvas.drawText("Bearagnostic", 92f, 1242f, paint)
        paint.typeface = regular
        paint.textSize = 16f
        paint.color = slate
        canvas.drawText("Benedict Interactive · On-device verified result", 92f, 1272f, paint)

        val output = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, output)
        bitmap.recycle()
        return output.toByteArray()
    }

    private fun drawMetricCard(
        canvas: Canvas,
        paint: Paint,
        regular: Typeface,
        medium: Typeface,
        bold: Typeface,
        rect: RectF,
        value: String,
        label: String,
        detail: String?,
        navy: Int,
        slate: Int,
        fill: Int,
        stroke: Int,
    ) {
        paint.color = fill
        canvas.drawRoundRect(rect, 28f, 28f, paint)
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 1.5f
        paint.color = stroke
        canvas.drawRoundRect(rect, 28f, 28f, paint)
        paint.style = Paint.Style.FILL

        paint.typeface = bold
        val numericLike = value.any { it.isDigit() }
        paint.textSize = fitTextSize(paint, value, rect.width() - 52f, if (numericLike) 34f else 30f, 20f)
        paint.color = navy
        canvas.drawText(value, rect.left + 28f, rect.top + 60f, paint)

        paint.typeface = medium
        paint.textSize = 18f
        paint.color = slate
        drawWrappedText(canvas, label, rect.left + 28f, rect.top + 92f, rect.width() - 56f, 22f, paint, 2)

        if (!detail.isNullOrBlank()) {
            paint.typeface = regular
            paint.textSize = 15f
            paint.color = slate
            drawWrappedText(canvas, detail, rect.left + 28f, rect.top + 126f, rect.width() - 56f, 20f, paint, 2)
        }
    }

    private fun drawCenteredText(canvas: Canvas, text: String, rect: RectF, paint: Paint) {
        val metrics = paint.fontMetrics
        val x = rect.centerX() - paint.measureText(text) / 2f
        val y = rect.centerY() - (metrics.ascent + metrics.descent) / 2f
        canvas.drawText(text, x, y, paint)
    }

    private fun drawRightAlignedText(canvas: Canvas, text: String, right: Float, baseline: Float, paint: Paint) {
        canvas.drawText(text, right - paint.measureText(text), baseline, paint)
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
