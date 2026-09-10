package com.benedictinteractive.bearagnostic

import android.os.Build
import android.webkit.JavascriptInterface
import org.json.JSONObject

class NativeBridge(private val activity: MainActivity) {
    private val entitlement = EntitlementManager(activity.applicationContext)

    @JavascriptInterface
    fun getNativeState(): String = statusJson()

    @JavascriptInterface
    fun getEntitlementState(): String = entitlement.stateJson()

    @JavascriptInterface
    fun setDebugEntitlement(tier: String): String {
        val result = entitlement.setDebugTier(tier)
        activity.runOnUiThread { activity.pushNativeStateToWeb() }
        return result
    }

    @JavascriptInterface
    fun clearDebugEntitlement(): String {
        val result = entitlement.clearDebugTier()
        activity.runOnUiThread { activity.pushNativeStateToWeb() }
        return result
    }

    @JavascriptInterface
    fun requestBroadStorageAccess() {
        activity.runOnUiThread { StorageAccessController.request(activity) }
    }

    @JavascriptInterface
    fun refreshNativeState() {
        activity.runOnUiThread { activity.pushNativeStateToWeb() }
    }

    @JavascriptInterface
    fun startScan(mode: String, customScopesJson: String, verifyDuplicates: Boolean): String {
        val normalizedMode = mode.trim().lowercase()
        val requiredCapability = when (normalizedMode) {
            "deep" -> EntitlementManager.Capability.DEEP_SCAN
            "custom" -> EntitlementManager.Capability.CUSTOM_SCAN
            else -> null
        }
        if (requiredCapability != null && !entitlement.has(requiredCapability)) {
            return JSONObject().apply {
                put("accepted", false)
                put("reason", "pro_required")
                put("capability", requiredCapability.wireName)
                put("entitlement", entitlement.stateJsonObject())
            }.toString()
        }
        return activity.startScan(mode, customScopesJson, verifyDuplicates)
    }

    @JavascriptInterface
    fun startOneTapScan(): String = activity.startOneTapScan()

    @JavascriptInterface
    fun cancelOneTapScan(): String = activity.cancelOneTapScan()

    @JavascriptInterface
    fun getReviewSummary(): String = activity.reviewSummaryJson()

    @JavascriptInterface
    fun getReviewCandidates(category: String, offset: Int, limit: Int): String =
        activity.reviewCandidatesJson(category, offset, limit)

    @JavascriptInterface
    fun requestReviewMedia(id: String, variant: String, requestId: String): String =
        activity.requestReviewMedia(id, variant, requestId)

    @JavascriptInterface
    fun deleteReviewCandidates(idsJson: String): String = activity.deleteReviewCandidates(idsJson)

    @JavascriptInterface
    fun getStorageSnapshot(): String = activity.storageSnapshotJson()

    @JavascriptInterface
    fun openExternalUrl(url: String): String = activity.openExternalUrl(url)

    @JavascriptInterface
    fun saveSupportQr(): String = activity.saveSupportQr()

    @JavascriptInterface
    fun shareText(title: String, body: String): String = activity.shareText(title, body)

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
        put("supportNetwork", "user_initiated_only")
        put("supportQrSave", "native_download_manager")
        put("shareAvailable", true)
        put("entitlement", entitlement.stateJsonObject())
        put("proProductId", EntitlementManager.PRO_PRODUCT_ID)
        put("billingReady", false)
        put("scannerCapabilities", "multi_pass,metadata,content_probe,categories,old,large,temp,apk,archives,zero_byte,empty_folders,screenshots,media,downloads,sha256_duplicates,review_candidates,live_activity,local_review_previews,verified_delete")
    }.toString()

    companion object {
        const val JS_INTERFACE_NAME = "BearagnosticNative"
        const val BRIDGE_VERSION = 10
    }
}
