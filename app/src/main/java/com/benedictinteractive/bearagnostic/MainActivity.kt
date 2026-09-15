package com.benedictinteractive.bearagnostic

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.os.StatFs
import android.os.SystemClock
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.animation.DecelerateInterpolator
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.Executors

class MainActivity : Activity() {
    private lateinit var rootView: FrameLayout
    private lateinit var webView: WebView
    private lateinit var nativeBridge: NativeBridge
    private lateinit var shareCardBridge: ShareCardBridge
    private lateinit var scanner: FileHealthScanner
    private lateinit var reviewMediaProvider: ReviewMediaProvider

    private lateinit var launchOverlay: FrameLayout
    private lateinit var studioStage: LinearLayout
    private lateinit var productStage: LinearLayout
    private lateinit var studioLogo: ImageView
    private lateinit var studioAccentBase: View
    private lateinit var studioAccentSweep: View
    private lateinit var studioLaunchLabel: TextView
    private lateinit var studioPromise: TextView
    private lateinit var productHero: ImageView

    private val reviewMediaExecutor = Executors.newSingleThreadExecutor { runnable ->
        Thread(runnable, "BearagnosticReviewMedia").apply { priority = Thread.NORM_PRIORITY - 1 }
    }
    private var launchStartedAt = 0L
    private var launchDismissed = false
    private var webContentReady = false
    private var pendingLaunchDismiss: Runnable? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        applyImmersiveMode()
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT

        rootView = FrameLayout(this).apply {
            setBackgroundColor(Color.rgb(247, 250, 253))
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
            )
        }

        webView = WebView(this).apply {
            setBackgroundColor(Color.rgb(246, 249, 253))
            alpha = 0f
            visibility = View.INVISIBLE
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT,
            )
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                    if (url?.startsWith("file:///android_asset/") == true) return false
                    if (!url.isNullOrBlank()) openExternalUrl(url)
                    return true
                }

                override fun onPageCommitVisible(view: WebView?, url: String?) {
                    super.onPageCommitVisible(view, url)
                    prepareWebContentForNativeLaunch()
                }

                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    webView.postDelayed({ forceAppVisibleIfLaunchStalled() }, 6_500L)
                    prepareWebContentForNativeLaunch()
                }
            }
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                allowFileAccess = true
                allowContentAccess = false
                setSupportZoom(false)
                builtInZoomControls = false
                displayZoomControls = false
                mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                javaScriptCanOpenWindowsAutomatically = false
                mediaPlaybackRequiresUserGesture = true
            }
        }

        nativeBridge = NativeBridge(this)
        shareCardBridge = ShareCardBridge(this)
        webView.addJavascriptInterface(nativeBridge, NativeBridge.JS_INTERFACE_NAME)
        webView.addJavascriptInterface(shareCardBridge, ShareCardBridge.JS_INTERFACE_NAME)

        launchOverlay = createLaunchOverlay()
        rootView.addView(webView)
        rootView.addView(launchOverlay)
        setContentView(rootView)
        applyImmersiveMode()
        startNativeLaunchIntro()
        webView.loadUrl("file:///android_asset/ui/index.html")
    }

    override fun onResume() {
        super.onResume()
        applyImmersiveMode()
        if (::webView.isInitialized) webView.post { pushNativeStateToWeb() }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) applyImmersiveMode()
    }

    @Suppress("DEPRECATION")
    private fun applyImmersiveMode() {
        window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
    }

    private fun createLaunchOverlay(): FrameLayout {
        val overlay = FrameLayout(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT,
            )
            setBackgroundColor(Color.rgb(247, 250, 253))
            isClickable = true
            isFocusable = true
        }

        studioStage = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.CENTER,
            ).apply {
                leftMargin = dp(30)
                rightMargin = dp(30)
            }
        }

        studioLogo = ImageView(this).apply {
            setImageResource(R.drawable.benedict_interactive_launch_logo)
            adjustViewBounds = true
            alpha = 0f
            scaleX = 0.985f
            scaleY = 0.985f
            translationY = dp(9).toFloat()
            layoutParams = LinearLayout.LayoutParams(dp(260), LinearLayout.LayoutParams.WRAP_CONTENT)
        }

        val accentHolder = FrameLayout(this).apply {
            alpha = 0f
            translationY = dp(6).toFloat()
            layoutParams = LinearLayout.LayoutParams(dp(92), dp(5)).apply {
                topMargin = dp(12)
            }
        }
        studioAccentBase = View(this).apply {
            background = GradientDrawable(
                GradientDrawable.Orientation.LEFT_RIGHT,
                intArrayOf(
                    Color.parseColor("#001A8FEA"),
                    Color.parseColor("#552DAFEA"),
                    Color.parseColor("#001A8FEA"),
                ),
            ).apply { cornerRadius = dp(999).toFloat() }
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                dp(2),
                Gravity.CENTER_VERTICAL,
            )
        }
        studioAccentSweep = View(this).apply {
            alpha = 0f
            translationX = -dp(38).toFloat()
            background = GradientDrawable(
                GradientDrawable.Orientation.LEFT_RIGHT,
                intArrayOf(
                    Color.parseColor("#00168FEA"),
                    Color.parseColor("#BB258FF4"),
                    Color.parseColor("#FF53DBFF"),
                    Color.parseColor("#D8B7F3FF"),
                    Color.parseColor("#00168FEA"),
                ),
            ).apply { cornerRadius = dp(999).toFloat() }
            layoutParams = FrameLayout.LayoutParams(dp(34), dp(3), Gravity.START or Gravity.CENTER_VERTICAL)
        }
        accentHolder.addView(studioAccentBase)
        accentHolder.addView(studioAccentSweep)

        studioLaunchLabel = TextView(this).apply {
            text = nativeText("launching")
            setTextColor(Color.parseColor("#334F70"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 13.5f)
            letterSpacing = 0.055f
            gravity = Gravity.CENTER
            alpha = 0f
            translationY = dp(7).toFloat()
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT,
            ).apply { topMargin = dp(18) }
        }

        studioPromise = TextView(this).apply {
            text = nativeText("promise")
            setTextColor(Color.parseColor("#7B8DA0"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 12.5f)
            gravity = Gravity.CENTER
            alpha = 0f
            translationY = dp(7).toFloat()
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT,
            ).apply {
                topMargin = dp(11)
                leftMargin = dp(10)
                rightMargin = dp(10)
            }
        }

        studioStage.addView(studioLogo)
        studioStage.addView(accentHolder)
        studioStage.addView(studioLaunchLabel)
        studioStage.addView(studioPromise)

        productStage = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            alpha = 0f
            visibility = View.INVISIBLE
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.CENTER,
            ).apply {
                leftMargin = dp(18)
                rightMargin = dp(18)
            }
        }

        productHero = ImageView(this).apply {
            setImageResource(R.drawable.bearagnostic_launch_hero)
            adjustViewBounds = true
            alpha = 0f
            scaleX = 0.992f
            scaleY = 0.992f
            translationY = dp(8).toFloat()
            layoutParams = LinearLayout.LayoutParams(dp(304), LinearLayout.LayoutParams.WRAP_CONTENT)
        }

        productStage.addView(productHero)

        overlay.addView(studioStage)
        overlay.addView(productStage)
        return overlay
    }

    private fun startNativeLaunchIntro() {
        launchStartedAt = SystemClock.uptimeMillis()

        studioLogo.animate()
            .alpha(1f)
            .translationY(0f)
            .scaleX(1f)
            .scaleY(1f)
            .setStartDelay(120L)
            .setDuration(390L)
            .setInterpolator(DecelerateInterpolator())
            .start()

        studioLaunchLabel.animate()
            .alpha(1f)
            .translationY(0f)
            .setStartDelay(330L)
            .setDuration(300L)
            .setInterpolator(DecelerateInterpolator())
            .start()

        studioPromise.animate()
            .alpha(1f)
            .translationY(0f)
            .setStartDelay(455L)
            .setDuration(320L)
            .setInterpolator(DecelerateInterpolator())
            .start()

        (studioAccentBase.parent as View).animate()
            .alpha(1f)
            .translationY(0f)
            .setStartDelay(430L)
            .setDuration(220L)
            .setInterpolator(DecelerateInterpolator())
            .withEndAction { playStudioAccentSweep() }
            .start()

        launchOverlay.postDelayed({
            if (!isFinishing && !isDestroyed && !launchDismissed) transitionToProductStage()
        }, STUDIO_STAGE_MILLIS)
    }

    private fun playStudioAccentSweep() {
        studioAccentSweep.alpha = 0f
        studioAccentSweep.translationX = -dp(38).toFloat()
        studioAccentSweep.animate()
            .alpha(1f)
            .translationX(dp(96).toFloat())
            .setDuration(470L)
            .setInterpolator(DecelerateInterpolator())
            .withEndAction {
                studioAccentSweep.animate()
                    .alpha(0f)
                    .setDuration(110L)
                    .setInterpolator(DecelerateInterpolator())
                    .start()
            }
            .start()
    }

    private fun transitionToProductStage() {
        productStage.visibility = View.VISIBLE
        productStage.alpha = 0f

        studioStage.animate()
            .alpha(0f)
            .translationY(-dp(5).toFloat())
            .setDuration(240L)
            .setInterpolator(DecelerateInterpolator())
            .start()

        productStage.animate()
            .alpha(1f)
            .setDuration(320L)
            .setInterpolator(DecelerateInterpolator())
            .start()

        productHero.animate()
            .alpha(1f)
            .translationY(0f)
            .scaleX(1f)
            .scaleY(1f)
            .setStartDelay(90L)
            .setDuration(420L)
            .setInterpolator(DecelerateInterpolator())
            .start()
    }

    private fun prepareWebContentForNativeLaunch() {
        if (!::webView.isInitialized || isFinishing || isDestroyed) return
        webView.evaluateJavascript(WEB_LAUNCH_BYPASS_SCRIPT) {
            webContentReady = true
            reinforceWebLaunchBypass()
            dismissLaunchOverlayWhenAppropriate(force = false)
        }
    }

    private fun reinforceWebLaunchBypass() {
        if (!::webView.isInitialized) return
        webView.post { webView.evaluateJavascript(WEB_LAUNCH_BYPASS_SCRIPT, null) }
        webView.postDelayed({ webView.evaluateJavascript(WEB_LAUNCH_BYPASS_SCRIPT, null) }, 120L)
        webView.postDelayed({ webView.evaluateJavascript(WEB_LAUNCH_BYPASS_SCRIPT, null) }, 380L)
    }

    private fun dismissLaunchOverlayWhenAppropriate(force: Boolean) {
        if (launchDismissed || !::launchOverlay.isInitialized) return
        if (!force && !webContentReady) return

        val elapsed = SystemClock.uptimeMillis() - launchStartedAt
        val remaining = (MINIMUM_BRAND_REVEAL_MILLIS - elapsed).coerceAtLeast(0L)
        if (!force && remaining > 0L) {
            if (pendingLaunchDismiss == null) {
                val runnable = Runnable {
                    pendingLaunchDismiss = null
                    dismissLaunchOverlayWhenAppropriate(force = false)
                }
                pendingLaunchDismiss = runnable
                launchOverlay.postDelayed(runnable, remaining)
            }
            return
        }

        pendingLaunchDismiss?.let {
            launchOverlay.removeCallbacks(it)
            pendingLaunchDismiss = null
        }

        reinforceWebLaunchBypass()
        webView.visibility = View.VISIBLE
        webView.animate()
            .alpha(1f)
            .setDuration(260L)
            .setInterpolator(DecelerateInterpolator())
            .start()

        launchOverlay.animate()
            .alpha(0f)
            .setDuration(280L)
            .setInterpolator(DecelerateInterpolator())
            .setListener(object : AnimatorListenerAdapter() {
                override fun onAnimationEnd(animation: Animator) {
                    if (!launchDismissed) {
                        launchDismissed = true
                        rootView.removeView(launchOverlay)
                    }
                    launchOverlay.animate().setListener(null)
                }
            })
            .start()
    }

    private fun forceAppVisibleIfLaunchStalled() {
        if (!::webView.isInitialized || isFinishing || isDestroyed) return
        webContentReady = true
        reinforceWebLaunchBypass()
        dismissLaunchOverlayWhenAppropriate(force = true)
    }

    private fun dp(value: Int): Int = TypedValue.applyDimension(
        TypedValue.COMPLEX_UNIT_DIP,
        value.toFloat(),
        resources.displayMetrics,
    ).toInt()

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray,
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == StorageAccessController.LEGACY_READ_REQUEST_CODE) pushNativeStateToWeb()
    }

    fun pushNativeStateToWeb() {
        if (!::webView.isInitialized) return
        val json = nativeBridge.statusJson()
        webView.evaluateJavascript(
            "window.BearagnosticAndroid && window.BearagnosticAndroid.onNativeStateChanged($json);",
            null,
        )
    }

    fun isScannerRunning(): Boolean = ::scanner.isInitialized && scanner.isRunning()
    fun startScan(mode: String, customScopesJson: String, verifyDuplicates: Boolean): String {
        if (!StorageAccessController.hasAccess(this)) {
            return JSONObject().apply {
                put("accepted", false)
                put("reason", "storage_access_required")
            }.toString()
        }
        ensureScanner()
        val scanMode = FileHealthScanner.ScanMode.fromWire(mode)
        val customScopes = parseCustomScopes(customScopesJson)
        val request = FileHealthScanner.ScanRequest(
            mode = scanMode,
            customScopes = customScopes,
            verifyDuplicates = verifyDuplicates,
        )
        val accepted = scanner.start(request, object : FileHealthScanner.Listener {
            override fun onProgress(json: String) { pushScanEvent("onScanProgress", json) }
            override fun onComplete(json: String) {
                pushScanEvent("onScanComplete", json)
                pushNativeStateToWebOnUiThread()
            }
            override fun onCancelled(json: String) {
                pushScanEvent("onScanCancelled", json)
                pushNativeStateToWebOnUiThread()
            }
            override fun onError(json: String) {
                pushScanEvent("onScanError", json)
                pushNativeStateToWebOnUiThread()
            }
        })
        if (accepted) pushNativeStateToWebOnUiThread()

        return JSONObject().apply {
            put("accepted", accepted)
            put("scanMode", scanMode.wireName)
            if (!accepted) put("reason", "scan_already_running")
        }.toString()
    }

    fun startOneTapScan(): String = startScan(
        mode = FileHealthScanner.ScanMode.SMART.wireName,
        customScopesJson = "[]",
        verifyDuplicates = true,
    )

    fun cancelOneTapScan(): String {
        val wasRunning = isScannerRunning()
        if (wasRunning && ::scanner.isInitialized) scanner.cancel()
        return JSONObject().apply {
            put("accepted", wasRunning)
            if (!wasRunning) put("reason", "no_scan_running")
        }.toString()
    }

    fun reviewSummaryJson(): String = if (::scanner.isInitialized) {
        scanner.reviewSummaryJson()
    } else {
        JSONObject().apply { put("available", false); put("candidateCount", 0) }.toString()
    }

    fun reviewCandidatesJson(category: String, offset: Int, limit: Int): String = if (::scanner.isInitialized) {
        scanner.reviewCandidatesJson(category, offset, limit)
    } else {
        JSONObject().apply { put("available", false); put("items", JSONArray()); put("totalCount", 0) }.toString()
    }

    fun deleteReviewCandidates(idsJson: String): String = if (::scanner.isInitialized) {
        scanner.deleteReviewCandidates(idsJson)
    } else {
        JSONObject().apply { put("accepted", false); put("reason", "no_review_snapshot") }.toString()
    }

    fun requestReviewMedia(id: String, variant: String, requestId: String): String {
        if (!::scanner.isInitialized) {
            return JSONObject().apply { put("accepted", false); put("reason", "no_review_snapshot") }.toString()
        }
        val safeRequestId = requestId.trim().take(64)
        if (!safeRequestId.matches(Regex("[A-Za-z0-9_-]{1,64}"))) {
            return JSONObject().apply { put("accepted", false); put("reason", "invalid_request_id") }.toString()
        }
        val source = scanner.reviewMediaSource(id)
            ?: return JSONObject().apply { put("accepted", false); put("reason", "review_item_unavailable") }.toString()
        val safeVariant = when (variant.trim().lowercase()) {
            "large" -> "large"
            "preview" -> "preview"
            else -> "compact"
        }
        reviewMediaExecutor.execute {
            if (!::reviewMediaProvider.isInitialized) reviewMediaProvider = ReviewMediaProvider(applicationContext)
            val result = reviewMediaProvider.describe(source, safeVariant)
            pushReviewMediaEvent(safeRequestId, result)
        }
        return JSONObject().apply {
            put("accepted", true)
            put("queued", true)
            put("requestId", safeRequestId)
        }.toString()
    }

    fun storageSnapshotJson(): String = try {
        @Suppress("DEPRECATION")
        val root = Environment.getExternalStorageDirectory()
        val stat = StatFs(root.absolutePath)
        val total = stat.totalBytes.coerceAtLeast(0L)
        val available = stat.availableBytes.coerceAtLeast(0L)
        val used = (total - available).coerceAtLeast(0L)
        val freePercent = if (total > 0L) (available.toDouble() / total.toDouble()) * 100.0 else 0.0
        JSONObject().apply {
            put("available", true)
            put("scope", "primary_shared_storage")
            put("totalBytes", total)
            put("availableBytes", available)
            put("usedBytes", used)
            put("freePercent", freePercent)
        }.toString()
    } catch (_: Exception) {
        JSONObject().apply {
            put("available", false)
            put("scope", "primary_shared_storage")
        }.toString()
    }

    fun openExternalUrl(rawUrl: String): String {
        val uri = try { Uri.parse(rawUrl.trim()) } catch (_: Exception) { null }
            ?: return JSONObject().apply {
                put("accepted", false)
                put("reason", "invalid_url")
            }.toString()
        val host = uri.host?.lowercase().orEmpty()
        val allowed = uri.scheme == "https" && host in ALLOWED_EXTERNAL_HOSTS
        if (!allowed) {
            return JSONObject().apply {
                put("accepted", false)
                put("reason", "url_not_allowed")
            }.toString()
        }
        val intent = Intent(Intent.ACTION_VIEW, uri)
        runOnUiThread {
            if (!isFinishing && !isDestroyed) {
                try {
                    startActivity(intent)
                } catch (_: Exception) {
                    Toast.makeText(this, nativeText("browser_unavailable"), Toast.LENGTH_LONG).show()
                }
            }
        }
        return JSONObject().apply {
            put("accepted", true)
            put("queued", true)
        }.toString()
    }

    fun shareText(title: String, body: String): String {
        if (body.isBlank()) {
            return JSONObject().apply {
                put("accepted", false)
                put("reason", "empty_share")
            }.toString()
        }
        val send = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_SUBJECT, title.take(120))
            putExtra(Intent.EXTRA_TEXT, body.take(8_000))
        }
        val chooser = Intent.createChooser(send, title.take(120))
        runOnUiThread {
            if (!isFinishing && !isDestroyed) {
                try {
                    startActivity(chooser)
                } catch (_: Exception) {
                    Toast.makeText(this, nativeText("share_unavailable"), Toast.LENGTH_LONG).show()
                }
            }
        }
        return JSONObject().apply {
            put("accepted", true)
            put("queued", true)
        }.toString()
    }

    fun setAppLanguage(rawLanguage: String): Boolean {
        val language = normalizeAppLanguage(rawLanguage)
        getSharedPreferences(UI_PREFS, MODE_PRIVATE).edit().putString(UI_LANGUAGE_KEY, language).apply()
        runOnUiThread {
            if (::studioLaunchLabel.isInitialized) studioLaunchLabel.text = nativeText("launching", language)
            if (::studioPromise.isInitialized) studioPromise.text = nativeText("promise", language)
        }
        return true
    }

    fun currentAppLanguage(): String {
        val stored = getSharedPreferences(UI_PREFS, MODE_PRIVATE).getString(UI_LANGUAGE_KEY, null)
        val systemLanguage = resources.configuration.locales.get(0)?.toLanguageTag() ?: "en"
        return normalizeAppLanguage(stored ?: systemLanguage)
    }

    fun nativeText(key: String, languageOverride: String? = null): String {
        val language = normalizeAppLanguage(languageOverride ?: currentAppLanguage())
        val copy = NATIVE_COPY[language] ?: NATIVE_COPY.getValue("en")
        return copy[key] ?: NATIVE_COPY.getValue("en")[key] ?: key
    }

    private fun normalizeAppLanguage(value: String): String {
        val v = value.trim().lowercase()
        return when {
            v.startsWith("th") -> "th"
            v.startsWith("ja") -> "ja"
            v.startsWith("es") -> "es"
            v == "pt-br" || v.startsWith("pt-br") || v.startsWith("pt_") -> "pt-BR"
            else -> "en"
        }
    }

    private fun ensureScanner() {
        if (!::scanner.isInitialized) scanner = FileHealthScanner(applicationContext)
    }

    private fun parseCustomScopes(raw: String): Set<String> {
        val allowed = setOf("downloads", "photos", "videos", "documents", "music")
        return try {
            val array = JSONArray(raw)
            buildSet {
                for (index in 0 until array.length()) {
                    val value = array.optString(index).trim().lowercase()
                    if (value in allowed) add(value)
                }
            }
        } catch (_: Exception) {
            emptySet()
        }
    }

    private fun pushScanEvent(callback: String, json: String) {
        if (!::webView.isInitialized) return
        runOnUiThread {
            if (!isFinishing && !isDestroyed) {
                webView.evaluateJavascript(
                    "window.BearagnosticAndroid && window.BearagnosticAndroid.$callback($json);",
                    null,
                )
            }
        }
    }

    private fun pushReviewMediaEvent(requestId: String, json: String) {
        if (!::webView.isInitialized) return
        val requestIdJson = JSONObject.quote(requestId)
        runOnUiThread {
            if (!isFinishing && !isDestroyed) {
                webView.evaluateJavascript(
                    "window.BearagnosticReviewMedia && window.BearagnosticReviewMedia.onMediaReady($requestIdJson,$json);",
                    null,
                )
            }
        }
    }

    private fun pushNativeStateToWebOnUiThread() {
        if (!::webView.isInitialized) return
        runOnUiThread { pushNativeStateToWeb() }
    }

    override fun onDestroy() {
        pendingLaunchDismiss?.let {
            if (::launchOverlay.isInitialized) launchOverlay.removeCallbacks(it)
            pendingLaunchDismiss = null
        }
        reviewMediaExecutor.shutdownNow()
        if (::scanner.isInitialized) scanner.shutdown()
        if (::webView.isInitialized) {
            webView.removeJavascriptInterface(NativeBridge.JS_INTERFACE_NAME)
            webView.removeJavascriptInterface(ShareCardBridge.JS_INTERFACE_NAME)
            webView.destroy()
        }
        super.onDestroy()
    }

    companion object {
        private const val UI_PREFS = "bearagnostic_ui"
        private const val UI_LANGUAGE_KEY = "language"
        private val NATIVE_COPY = mapOf(
            "en" to mapOf(
                "launching" to "Launching Bearagnostic",
                "promise" to "Find clutter. Explain the risk. Clean with confidence.",
                "browser_unavailable" to "No compatible browser is available for this link.",
                "share_unavailable" to "Android could not open the share sheet.",
            ),
            "th" to mapOf(
                "launching" to "กำลังเปิด Bearagnostic",
                "promise" to "ค้นหาไฟล์รก อธิบายความเสี่ยง แล้วจัดการอย่างมั่นใจ",
                "browser_unavailable" to "ไม่พบเบราว์เซอร์ที่รองรับลิงก์นี้",
                "share_unavailable" to "Android ไม่สามารถเปิดหน้าต่างแชร์ได้",
            ),
            "ja" to mapOf(
                "launching" to "Bearagnostic を起動中",
                "promise" to "不要なファイルを見つけ、リスクを説明し、安心して整理。",
                "browser_unavailable" to "このリンクを開ける対応ブラウザがありません。",
                "share_unavailable" to "Android で共有画面を開けませんでした。",
            ),
            "es" to mapOf(
                "launching" to "Abriendo Bearagnostic",
                "promise" to "Encuentra el desorden. Entiende el riesgo. Limpia con confianza.",
                "browser_unavailable" to "No hay un navegador compatible disponible para este enlace.",
                "share_unavailable" to "Android no pudo abrir el panel para compartir.",
            ),
            "pt-BR" to mapOf(
                "launching" to "Abrindo Bearagnostic",
                "promise" to "Encontre a bagunça. Entenda o risco. Limpe com confiança.",
                "browser_unavailable" to "Nenhum navegador compatível está disponível para este link.",
                "share_unavailable" to "O Android não conseguiu abrir a tela de compartilhamento.",
            ),
        )
        private const val STUDIO_STAGE_MILLIS = 980L
        private const val MINIMUM_BRAND_REVEAL_MILLIS = 2_650L
        private const val WEB_LAUNCH_BYPASS_SCRIPT =
            "(function(){try{var l=document.getElementById('launch');if(l){l.hidden=true;l.setAttribute('hidden','hidden');l.style.display='none';l.style.visibility='hidden';l.style.opacity='0';if(l.parentNode){l.parentNode.removeChild(l);}}var a=document.getElementById('appRoot');if(a){a.hidden=false;a.removeAttribute('hidden');a.style.display='';a.style.visibility='visible';a.style.opacity='1';}if(document.documentElement){document.documentElement.setAttribute('data-native-launch-bypass','1');}if(document.body){document.body.setAttribute('data-native-launch-bypass','1');}return true;}catch(e){return false;}})();"

        private val ALLOWED_EXTERNAL_HOSTS = setOf(
            "ko-fi.com",
            "www.ko-fi.com",
        )
    }
}
