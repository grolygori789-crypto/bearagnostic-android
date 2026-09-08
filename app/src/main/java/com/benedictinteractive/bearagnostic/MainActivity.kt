package com.benedictinteractive.bearagnostic

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONObject

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private lateinit var nativeBridge: NativeBridge
    private lateinit var scanner: FileHealthScanner

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.statusBarColor = Color.rgb(246, 250, 253)
        window.navigationBarColor = Color.rgb(246, 250, 253)

        scanner = FileHealthScanner(applicationContext)
        webView = WebView(this)
        nativeBridge = NativeBridge(this)

        webView.setBackgroundColor(Color.TRANSPARENT)
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                return url?.startsWith("file:///android_asset/") != true
            }
        }

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = false
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
        webView.loadUrl("file:///android_asset/ui/index.html")
    }

    override fun onResume() {
        super.onResume()
        if (::webView.isInitialized) {
            webView.post { pushNativeStateToWeb() }
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray,
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == StorageAccessController.LEGACY_READ_REQUEST_CODE) {
            pushNativeStateToWeb()
        }
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

    fun startOneTapScan(): String {
        if (!StorageAccessController.hasAccess(this)) {
            return JSONObject().apply {
                put("accepted", false)
                put("reason", "storage_access_required")
            }.toString()
        }

        val accepted = scanner.start(object : FileHealthScanner.Listener {
            override fun onProgress(json: String) {
                pushScanEvent("onScanProgress", json)
            }

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
            if (!accepted) put("reason", "scan_already_running")
        }.toString()
    }

    fun cancelOneTapScan(): String {
        val wasRunning = isScannerRunning()
        if (wasRunning) scanner.cancel()
        return JSONObject().apply {
            put("accepted", wasRunning)
            if (!wasRunning) put("reason", "no_scan_running")
        }.toString()
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
