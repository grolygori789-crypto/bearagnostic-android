package com.benedictinteractive.bearagnostic

import android.os.Build
import android.webkit.JavascriptInterface
import org.json.JSONObject

class NativeBridge(private val activity: MainActivity) {

    @JavascriptInterface
    fun getNativeState(): String = statusJson()

    @JavascriptInterface
    fun requestBroadStorageAccess() {
        activity.runOnUiThread { StorageAccessController.request(activity) }
    }

    @JavascriptInterface
    fun refreshNativeState() {
        activity.runOnUiThread { activity.pushNativeStateToWeb() }
    }

    @JavascriptInterface
    fun startScan(mode: String, customScopesJson: String, verifyDuplicates: Boolean): String =
        activity.startScan(mode, customScopesJson, verifyDuplicates)

    @JavascriptInterface
    fun startOneTapScan(): String = activity.startOneTapScan()

    @JavascriptInterface
    fun cancelOneTapScan(): String = activity.cancelOneTapScan()

    fun statusJson(): String = JSONObject().apply {
        put("platform", "android")
        put("bridgeVersion", BRIDGE_VERSION)
        put("versionName", BuildConfig.VERSION_NAME)
        put("versionCode", BuildConfig.VERSION_CODE)
        put("apiLevel", Build.VERSION.SDK_INT)
        put("broadStorageAccess", StorageAccessController.hasAccess(activity))
        put("scannerReady", true)
        put("scannerRunning", activity.isScannerRunning())
        put("scanScope", "accessible_shared_storage")
        put("scanModes", "smart,quick,deep,custom")
        put("analysisRulesVersion", FileHealthScanner.ANALYSIS_RULES_VERSION)
        put("scannerCapabilities", "metadata,categories,old,large,temp,apk,archives,zero_byte,empty_folders,screenshots,media,downloads,sha256_duplicates")
    }.toString()

    companion object {
        const val JS_INTERFACE_NAME = "BearagnosticNative"
        const val BRIDGE_VERSION = 4
    }
}
