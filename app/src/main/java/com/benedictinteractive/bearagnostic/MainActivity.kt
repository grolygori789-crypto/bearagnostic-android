package com.benedictinteractive.bearagnostic

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONArray
import org.json.JSONObject

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private lateinit var nativeBridge: NativeBridge
    private lateinit var scanner: FileHealthScanner

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        applyImmersiveMode()
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT

        webView = WebView(this)
        nativeBridge = NativeBridge(this)

        webView.setBackgroundColor(Color.rgb(246, 249, 253))
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                return url?.startsWith("file:///android_asset/") != true
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                webView.postDelayed({ forceAppVisibleIfLaunchStalled() }, 6_500L)
            }
        }

        webView.settings.apply {
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

        webView.addJavascriptInterface(nativeBridge, NativeBridge.JS_INTERFACE_NAME)
        setContentView(webView)
        applyImmersiveMode()
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

    private fun forceAppVisibleIfLaunchStalled() {
        if (!::webView.isInitialized || isFinishing || isDestroyed) return
        webView.evaluateJavascript(
            "(function(){var l=document.getElementById('launch');var a=document.getElementById('appRoot');" +
                "if(a&&a.hidden){a.hidden=false;}if(l&&!l.hidden){l.hidden=true;}return true;})()",
            null,
        )
    }

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

    private fun pushNativeStateToWebOnUiThread() {
        if (!::webView.isInitialized) return
        runOnUiThread { pushNativeStateToWeb() }
    }

    override fun onDestroy() {
        if (::scanner.isInitialized) scanner.shutdown()
        if (::webView.isInitialized) {
            webView.removeJavascriptInterface(NativeBridge.JS_INTERFACE_NAME)
            webView.destroy()
        }
        super.onDestroy()
    }
}
