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

class ShareCardBridge(private val activity: Activity) {
    @JavascriptInterface
    fun shareCleanupCard(payloadJson: String): String = try {
        val payload = JSONObject(payloadJson)
        val title = payload.optString("shareTitle", "Bearagnostic Cleanup Impact").trim().ifBlank { "Bearagnostic Cleanup Impact" }.take(120)
        sharePng(title, renderCleanupCard(payload))
    } catch (error: Exception) {
        JSONObject().apply {
            put("accepted", false)
            put("reason", "cleanup_card_failed")
            put("error", error.javaClass.simpleName)
        }.toString()
    }

    @JavascriptInterface
    fun shareImage(title: String, dataUrl: String): String {
        val trimmedTitle = title.trim().ifBlank { "Bearagnostic Result" }.take(120)
        val payload = dataUrl.substringAfter(",", missingDelimiterValue = "").trim()
        if (payload.isBlank()) return JSONObject().apply {
            put("accepted", false)
            put("reason", "empty_image")
        }.toString()
        return try { sharePng(trimmedTitle, Base64.decode(payload, Base64.DEFAULT)) }
        catch (error: Exception) {
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
        val paint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.SUBPIXEL_TEXT_FLAG).apply { isDither = true; alpha = 255 }
        val regular = Typeface.create("sans-serif", Typeface.NORMAL)
        val medium = Typeface.create("sans-serif-medium", Typeface.NORMAL)
        val bold = Typeface.create("sans-serif", Typeface.BOLD)

        val ink = Color.rgb(20, 47, 76)
        val blue = Color.rgb(32, 160, 234)
        val cyan = Color.rgb(91, 211, 246)
        val mint = Color.rgb(60, 173, 145)
        val subtle = Color.rgb(102, 123, 142)
        val quiet = Color.rgb(148, 164, 178)
        val panel = Color.rgb(246, 250, 253)
        val border = Color.argb(18, 24, 58, 88)

        paint.shader = LinearGradient(0f, 0f, 0f, height.toFloat(), Color.rgb(246, 251, 255), Color.rgb(232, 246, 253), Shader.TileMode.CLAMP)
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)
        paint.shader = null
        paint.color = Color.argb(18, 90, 193, 238); canvas.drawCircle(1010f, 82f, 245f, paint)
        paint.color = Color.argb(14, 83, 204, 221); canvas.drawCircle(38f, 1300f, 230f, paint)

        val sheet = RectF(44f, 44f, 1036f, 1306f)
        paint.alpha = 255
        paint.setShadowLayer(32f, 0f, 18f, Color.argb(26, 17, 44, 69))
        paint.color = Color.WHITE; canvas.drawRoundRect(sheet, 44f, 44f, paint)
        paint.clearShadowLayer()
        paint.style = Paint.Style.STROKE; paint.strokeWidth = 2f; paint.color = border; canvas.drawRoundRect(sheet, 44f, 44f, paint); paint.style = Paint.Style.FILL

        paint.typeface = bold; paint.textSize = 58f; paint.color = ink; canvas.drawText("Bear", 92f, 124f, paint)
        val bearWidth = paint.measureText("Bear")
        paint.color = blue; canvas.drawText("agnostic", 92f + bearWidth + 4f, 124f, paint)
        paint.typeface = medium; paint.textSize = 18f; paint.letterSpacing = 0.14f; paint.color = subtle
        canvas.drawText(payload.optString("brandLine", "FILE HEALTH • BRIGHTER DAYS"), 94f, 166f, paint); paint.letterSpacing = 0f

        val verifiedRect = RectF(790f, 84f, 954f, 144f)
        paint.color = Color.rgb(234, 248, 243); canvas.drawRoundRect(verifiedRect, 32f, 32f, paint)
        paint.typeface = medium; paint.textSize = 18f; paint.color = mint; drawCenteredText(canvas, "VERIFIED", verifiedRect, paint)

        val hero = RectF(72f, 196f, 1008f, 486f)
        paint.shader = LinearGradient(hero.left, hero.top, hero.right, hero.bottom,
            intArrayOf(Color.rgb(239, 250, 246), Color.WHITE, Color.rgb(240, 248, 253)), floatArrayOf(0f, 0.56f, 1f), Shader.TileMode.CLAMP)
        canvas.drawRoundRect(hero, 40f, 40f, paint); paint.shader = null
        paint.style = Paint.Style.STROKE; paint.strokeWidth = 1.8f; paint.color = Color.argb(20, 36, 127, 153); canvas.drawRoundRect(hero, 40f, 40f, paint); paint.style = Paint.Style.FILL
        paint.shader = LinearGradient(0f, 222f, 0f, 458f, mint, blue, Shader.TileMode.CLAMP)
        canvas.drawRoundRect(RectF(92f, 222f, 106f, 458f), 7f, 7f, paint); paint.shader = null

        paint.typeface = medium; paint.textSize = 20f; paint.letterSpacing = 0.18f; paint.color = mint
        canvas.drawText(payload.optString("kicker", "Cleanup impact").uppercase(), 132f, 254f, paint); paint.letterSpacing = 0f
        val reclaimed = payload.optString("reclaimed", "—")
        paint.typeface = bold; paint.textSize = fitTextSize(paint, reclaimed, 466f, 86f, 46f)
        paint.shader = LinearGradient(132f, 0f, 510f, 0f, cyan, blue, Shader.TileMode.CLAMP); canvas.drawText(reclaimed, 132f, 344f, paint); paint.shader = null
        paint.typeface = medium; paint.textSize = 22f; paint.color = ink; canvas.drawText(payload.optString("verifiedSpace", "Verified space reclaimed"), 132f, 388f, paint)
        paint.typeface = regular; paint.textSize = 18f; paint.color = subtle; canvas.drawText(payload.optString("resultLine", "—"), 132f, 424f, paint)

        drawChip(canvas, paint, RectF(132f, 440f, 304f, 476f), payload.optString("methodValue", "Manual review"), Color.rgb(236, 245, 252), ink, medium)
        drawChip(canvas, paint, RectF(316f, 440f, 522f, 476f), payload.optString("onDeviceVerified", "On-device verified"), Color.rgb(238, 249, 245), mint, medium)

        val mascot = try { activity.assets.open("ui/assets/native/mascot/drbear-success.png").use { BitmapFactory.decodeStream(it) } } catch (_: Exception) { null }
        mascot?.let {
            paint.alpha = 255
            val src = Rect(0, 0, it.width, it.height)
            val dest = fitCenterRect(it.width, it.height, RectF(642f, 208f, 968f, 480f))
            canvas.drawBitmap(it, src, dest, paint)
            paint.alpha = 255
            it.recycle()
        }

        paint.typeface = bold; paint.textSize = 28f; paint.color = ink
        canvas.drawText(payload.optString("whatChangedLabel", "What changed"), 72f, 548f, paint)
        val statTop = 578f; val statHeight = 160f; val statWidth = 300f; val statGap = 18f
        drawStatCard(canvas, paint, RectF(72f, statTop, 372f, statTop + statHeight), payload.optString("filesValue", "0"), payload.optString("filesLabel", "Files removed"), payload.optString("filesDetail", "Android-confirmed deletion"), ink, subtle, panel, border, bold, medium, regular)
        drawStatCard(canvas, paint, RectF(390f, statTop, 690f, statTop + statHeight), payload.optString("duplicatesValue", "0"), payload.optString("duplicatesLabel", "Duplicate copies resolved"), payload.optString("duplicatesDetail", ""), ink, subtle, panel, border, bold, medium, regular)
        val freeBefore = payload.optString("freeBefore", "—"); val freeAfter = payload.optString("freeAfter", freeBefore); val freeChanged = payload.optBoolean("freeChanged", false)
        val freeDisplay = if (freeChanged && freeBefore.isNotBlank() && freeAfter.isNotBlank()) "$freeBefore → $freeAfter" else freeAfter.ifBlank { payload.optString("freeValue", "—") }
        drawStatCard(canvas, paint, RectF(708f, statTop, 1008f, statTop + statHeight), freeDisplay, payload.optString("freeLabel", "Free storage after cleanup"), payload.optString("freeDetail", ""), ink, subtle, panel, border, bold, medium, regular)

        paint.typeface = bold; paint.textSize = 24f; paint.color = ink
        canvas.drawText(payload.optString("scanContextLabel", "Scan context"), 72f, 786f, paint)
        val context = RectF(72f, 806f, 1008f, 884f)
        paint.color = Color.rgb(248, 251, 253); canvas.drawRoundRect(context, 28f, 28f, paint)
        paint.style = Paint.Style.STROKE; paint.strokeWidth = 1.4f; paint.color = border; canvas.drawRoundRect(context, 28f, 28f, paint); paint.style = Paint.Style.FILL
        drawContextItem(canvas, paint, 102f, 832f, payload.optString("scanModeLabel", "Scan mode"), payload.optString("scanMode", "—"), blue, ink, subtle, medium, bold)
        drawContextItem(canvas, paint, 402f, 832f, payload.optString("filesReviewedLabel", "Files reviewed"), payload.optString("filesReviewed", "—"), mint, ink, subtle, medium, bold)
        drawContextItem(canvas, paint, 700f, 832f, payload.optString("coverageLabel", "Coverage"), payload.optString("coverage", "—"), Color.rgb(126, 108, 205), ink, subtle, medium, bold)

        paint.typeface = bold; paint.textSize = 26f; paint.color = ink
        canvas.drawText(payload.optString("sessionNotesLabel", "Result details"), 72f, 932f, paint)
        val details = RectF(72f, 954f, 1008f, 1148f)
        paint.color = Color.WHITE; canvas.drawRoundRect(details, 32f, 32f, paint)
        paint.style = Paint.Style.STROKE; paint.strokeWidth = 1.5f; paint.color = border; canvas.drawRoundRect(details, 32f, 32f, paint); paint.style = Paint.Style.FILL
        val leftX = 108f; val rightX = 562f
        paint.color = Color.argb(18, 24, 58, 88); canvas.drawRect(524f, 982f, 526f, 1120f, paint)

        drawDetailHeading(canvas, paint, leftX, 994f, blue, payload.optString("methodLabel", "Cleanup method"), medium, quiet)
        val methodValue = payload.optString("methodValue", "Manual review")
        paint.typeface = bold; paint.textSize = fitTextSize(paint, methodValue, 356f, 29f, 21f); paint.color = ink; canvas.drawText(methodValue, leftX, 1036f, paint)
        drawDetailHeading(canvas, paint, leftX, 1078f, mint, payload.optString("verificationLabel", "Verification"), medium, quiet)
        paint.typeface = regular; paint.textSize = 16.5f; paint.color = subtle
        drawWrappedText(canvas, payload.optString("proof", "Only files Android confirmed as deleted are counted."), leftX, 1110f, 356f, 21f, paint, 2)

        drawDetailHeading(canvas, paint, rightX, 994f, mint, payload.optString("generatedLabel", "Generated"), medium, quiet)
        val generatedAt = payload.optString("generatedAt", "")
        paint.typeface = bold; paint.textSize = fitTextSize(paint, generatedAt, 390f, 25f, 18f); paint.color = ink; canvas.drawText(generatedAt, rightX, 1036f, paint)
        drawDetailHeading(canvas, paint, rightX, 1078f, blue, payload.optString("privacyLabel", "Privacy boundary"), medium, quiet)
        paint.typeface = regular; paint.textSize = 16.5f; paint.color = subtle
        drawWrappedText(canvas, payload.optString("privacyValue", "Analyzed on device · no file content uploaded"), rightX, 1110f, 390f, 21f, paint, 2)

        paint.color = Color.argb(18, 24, 58, 88); canvas.drawRect(72f, 1186f, 1008f, 1188f, paint)
        paint.typeface = bold; paint.textSize = 18f; paint.color = ink; canvas.drawText("Bearagnostic", 72f, 1240f, paint)
        paint.typeface = regular; paint.textSize = 16f; paint.color = subtle; canvas.drawText("Benedict Interactive · On-device verified result", 72f, 1270f, paint)
        drawChip(canvas, paint, RectF(742f, 1212f, 1008f, 1254f), payload.optString("privateByDesign", "Private by design"), Color.rgb(241, 248, 252), subtle, medium)

        val output = ByteArrayOutputStream(); bitmap.compress(Bitmap.CompressFormat.PNG, 100, output); bitmap.recycle(); return output.toByteArray()
    }

    private fun drawStatCard(canvas: Canvas, paint: Paint, rect: RectF, value: String, label: String, detail: String, ink: Int, subtle: Int, fill: Int, border: Int, bold: Typeface, medium: Typeface, regular: Typeface) {
        paint.alpha = 255; paint.color = fill; canvas.drawRoundRect(rect, 28f, 28f, paint)
        paint.style = Paint.Style.STROKE; paint.strokeWidth = 1.4f; paint.color = border; canvas.drawRoundRect(rect, 28f, 28f, paint); paint.style = Paint.Style.FILL
        paint.typeface = bold; paint.textSize = fitTextSize(paint, value, rect.width() - 44f, 38f, 21f); paint.color = ink; canvas.drawText(value, rect.left + 22f, rect.top + 54f, paint)
        paint.typeface = medium; paint.textSize = 17f; paint.color = subtle; drawWrappedText(canvas, label, rect.left + 22f, rect.top + 88f, rect.width() - 44f, 21f, paint, 2)
        if (detail.isNotBlank()) { paint.typeface = regular; paint.textSize = 14.5f; paint.color = subtle; drawWrappedText(canvas, detail, rect.left + 22f, rect.top + 126f, rect.width() - 44f, 19f, paint, 2) }
    }

    private fun drawContextItem(canvas: Canvas, paint: Paint, x: Float, y: Float, label: String, value: String, dotColor: Int, ink: Int, subtle: Int, medium: Typeface, bold: Typeface) {
        paint.color = dotColor; canvas.drawCircle(x, y, 7f, paint)
        paint.typeface = medium; paint.textSize = 14.5f; paint.color = subtle; canvas.drawText(label, x + 16f, y + 5f, paint)
        paint.typeface = bold; paint.textSize = fitTextSize(paint, value, 240f, 22f, 16f); paint.color = ink; canvas.drawText(value, x, y + 35f, paint)
    }

    private fun drawDetailHeading(canvas: Canvas, paint: Paint, x: Float, baseline: Float, dotColor: Int, label: String, typeface: Typeface, textColor: Int) {
        paint.color = dotColor; canvas.drawCircle(x, baseline - 6f, 8f, paint)
        paint.typeface = typeface; paint.textSize = 16f; paint.color = textColor; canvas.drawText(label, x + 20f, baseline, paint)
    }

    private fun drawChip(canvas: Canvas, paint: Paint, rect: RectF, label: String, fill: Int, textColor: Int, typeface: Typeface) {
        paint.alpha = 255; paint.color = fill; canvas.drawRoundRect(rect, rect.height() / 2f, rect.height() / 2f, paint)
        paint.typeface = typeface; paint.textSize = fitTextSize(paint, label, rect.width() - 24f, 15f, 12f); paint.color = textColor; drawCenteredText(canvas, label, rect, paint)
    }

    private fun drawCenteredText(canvas: Canvas, text: String, rect: RectF, paint: Paint) {
        val fm = paint.fontMetrics; canvas.drawText(text, rect.centerX() - paint.measureText(text) / 2f, rect.centerY() - (fm.ascent + fm.descent) / 2f, paint)
    }

    private fun drawWrappedText(canvas: Canvas, text: String, x: Float, startY: Float, maxWidth: Float, lineHeight: Float, paint: Paint, maxLines: Int): Float {
        val words = text.trim().split(Regex("\\s+")).filter { it.isNotBlank() }; if (words.isEmpty()) return startY
        var line = ""; var y = startY; var lines = 0; var index = 0
        while (index < words.size && lines < maxLines) {
            val candidate = if (line.isBlank()) words[index] else "$line ${words[index]}"
            if (paint.measureText(candidate) <= maxWidth || line.isBlank()) { line = candidate; index++ }
            else { canvas.drawText(line, x, y, paint); y += lineHeight; lines++; line = "" }
        }
        if (line.isNotBlank() && lines < maxLines) {
            var finalLine = line
            if (index < words.size) { while (finalLine.length > 1 && paint.measureText("$finalLine…") > maxWidth) finalLine = finalLine.dropLast(1); finalLine += "…" }
            canvas.drawText(finalLine, x, y, paint)
        }
        return y
    }

    private fun fitTextSize(paint: Paint, text: String, maxWidth: Float, preferred: Float, minimum: Float): Float {
        var size = preferred; paint.textSize = size
        while (size > minimum && paint.measureText(text) > maxWidth) { size -= 1f; paint.textSize = size }
        return size
    }

    private fun fitCenterRect(sourceWidth: Int, sourceHeight: Int, bounds: RectF): RectF {
        if (sourceWidth <= 0 || sourceHeight <= 0) return RectF(bounds)
        val scale = minOf(bounds.width() / sourceWidth.toFloat(), bounds.height() / sourceHeight.toFloat())
        val w = sourceWidth * scale; val h = sourceHeight * scale; val left = bounds.centerX() - w / 2f; val top = bounds.centerY() - h / 2f
        return RectF(left, top, left + w, top + h)
    }

    private fun sharePng(title: String, bytes: ByteArray): String {
        val imageUri = savePngToMediaStore(title, bytes) ?: return JSONObject().apply { put("accepted", false); put("reason", "image_store_failed") }.toString()
        val send = Intent(Intent.ACTION_SEND).apply {
            type = "image/png"; putExtra(Intent.EXTRA_SUBJECT, title); putExtra(Intent.EXTRA_STREAM, imageUri); addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            clipData = android.content.ClipData.newUri(activity.contentResolver, title, imageUri)
        }
        val chooser = Intent.createChooser(send, title)
        activity.runOnUiThread {
            if (!activity.isFinishing && !activity.isDestroyed) try { activity.startActivity(chooser) }
            catch (_: Exception) { Toast.makeText(activity, "Android could not open the share sheet.", Toast.LENGTH_LONG).show() }
        }
        return JSONObject().apply { put("accepted", true); put("queued", true); put("uri", imageUri.toString()) }.toString()
    }

    private fun savePngToMediaStore(title: String, bytes: ByteArray): Uri? {
        val safeName = title.replace(Regex("[^A-Za-z0-9._-]+"), "-").trim('-').ifBlank { "Bearagnostic-Result" }
        val fileName = "$safeName-${System.currentTimeMillis()}.png"; val resolver = activity.contentResolver
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val values = ContentValues().apply {
                put(MediaStore.Images.Media.DISPLAY_NAME, fileName); put(MediaStore.Images.Media.MIME_TYPE, "image/png")
                put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/Bearagnostic"); put(MediaStore.Images.Media.IS_PENDING, 1)
            }
            val uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values) ?: return null
            try {
                resolver.openOutputStream(uri)?.use { it.write(bytes) } ?: run { resolver.delete(uri, null, null); return null }
                values.clear(); values.put(MediaStore.Images.Media.IS_PENDING, 0); resolver.update(uri, values, null, null); uri
            } catch (error: Exception) { resolver.delete(uri, null, null); throw error }
        } else {
            @Suppress("DEPRECATION") val bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.size) ?: return null
            @Suppress("DEPRECATION") val inserted = MediaStore.Images.Media.insertImage(resolver, bmp, fileName, "Bearagnostic premium result card") ?: return null
            bmp.recycle(); Uri.parse(inserted)
        }
    }

    companion object { const val JS_INTERFACE_NAME = "BearagnosticShareBridge" }
}
