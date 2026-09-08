package com.benedictinteractive.bearagnostic

import android.os.Build
import android.webkit.JavascriptInterface
import org.json.JSONObject

class NativeBridge(private val activity: MainActivity) {

    @JavascriptInterface
    fun getNativeState(): String = statusJson()

    @JavascriptInterface
    fun requestBroadStorageAccess() {
        activity.runOnUiThread {
            StorageAccessController.request(activity)
        }
    }

    @JavascriptInterface
    fun refreshNativeState() {
        activity.runOnUiThread {
            activity.pushNativeStateToWeb()
        }
    }

    fun statusJson(): String = JSONObject().apply {
        put("platform", "android")
        put("bridgeVersion", BRIDGE_VERSION)
        put("versionName", BuildConfig.VERSION_NAME)
        put("versionCode", BuildConfig.VERSION_CODE)
        put("apiLevel", Build.VERSION.SDK_INT)
        put("broadStorageAccess", StorageAccessController.hasAccess(activity))
        put("scannerReady", false)
    }.toString()

    companion object {
        const val JS_INTERFACE_NAME = "BearagnosticNative"
        const val BRIDGE_VERSION = 1
    }
}
