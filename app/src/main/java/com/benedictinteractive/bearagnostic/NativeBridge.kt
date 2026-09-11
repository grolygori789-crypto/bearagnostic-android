package com.benedictinteractive.bearagnostic

import android.os.Build
import android.webkit.JavascriptInterface
import org.json.JSONArray
import org.json.JSONObject

class NativeBridge(private val activity: MainActivity) {
    private val entitlement = EntitlementManager(activity.applicationContext)
    private val billing = PlayBillingManager(activity, entitlement) {
        activity.runOnUiThread { activity.pushNativeStateToWeb() }
    }
    private val emptyFolders = EmptyFolderManager(activity.applicationContext)
    private val history = LocalHistoryStore(activity.applicationContext)

    @JavascriptInterface
    fun getNativeState(): String = statusJson()

    @JavascriptInterface
    fun getEntitlementState(): String = entitlement.stateJson()

    @JavascriptInterface
    fun getBillingState(): String = billing.stateJson()

    @JavascriptInterface
    fun refreshBilling(): String = billing.refresh()

    @JavascriptInterface
    fun purchasePro(): String = billing.launchPurchase()

    @JavascriptInterface
    fun restoreProPurchase(): String = billing.restore()

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
        val normalizedMode = RuntimeContractGuard.normalizeScanMode(mode)
            ?: return rejected("invalid_scan_mode")

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

        var effectiveCustomScopesJson = customScopesJson
        if (normalizedMode == "custom") {
            val scopeDecision = RuntimeContractGuard.validateCustomScopes(customScopesJson)
            if (!scopeDecision.accepted) return rejected(scopeDecision.reason)
            if (!RuntimeContractGuard.hasAccessibleCustomTarget(activity, scopeDecision.scopes)) {
                return rejected("no_matching_scan_locations")
            }
            effectiveCustomScopesJson = JSONArray(scopeDecision.scopes.toList()).toString()
        }

        return activity.startScan(normalizedMode, effectiveCustomScopesJson, verifyDuplicates)
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
    fun deleteReviewCandidates(idsJson: String): String {
        val summary = try {
            JSONObject(activity.reviewSummaryJson())
        } catch (_: Exception) {
            null
        }
        if (summary?.optBoolean("available", false) == true) {
            val generatedAtMs = summary.optLong("generatedAtMs", 0L)
            if (!RuntimeContractGuard.isReviewSnapshotFresh(generatedAtMs)) {
                return JSONObject().apply {
                    put("accepted", false)
                    put("reason", "stale_review_snapshot")
                    put("maxAgeMs", RuntimeContractGuard.REVIEW_SNAPSHOT_MAX_AGE_MS)
                }.toString()
            }
        }
        val result = activity.deleteReviewCandidates(idsJson)
        try { history.recordFileCleanup(result) } catch (_: Exception) { }
        return result
    }

    @JavascriptInterface
    fun recordInsightsScan(scanJson: String): String =
        history.recordScan(scanJson, activity.storageSnapshotJson())

    @JavascriptInterface
    fun getInsightsHistory(): String = history.historyJson(entitlement)

    @JavascriptInterface
    fun clearInsightsHistory(): String = history.clear()

    @JavascriptInterface
    fun startEmptyFolderScan(): String {
        if (!StorageAccessController.hasAccess(activity)) return rejected("storage_access_required")
        if (activity.isScannerRunning()) return rejected("scan_running")
        return emptyFolders.start()
    }

    @JavascriptInterface
    fun getEmptyFolderSummary(): String = emptyFolders.summaryJson()

    @JavascriptInterface
    fun getEmptyFolderCandidates(offset: Int, limit: Int): String =
        emptyFolders.candidatesJson(offset, limit)

    @JavascriptInterface
    fun deleteEmptyFolderCandidates(idsJson: String): String {
        if (activity.isScannerRunning()) return rejected("scan_running")
        val result = emptyFolders.delete(idsJson)
        try { history.recordEmptyFolderCleanup(result) } catch (_: Exception) { }
        return result
    }

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
        put("emptyFolderReviewRunning", JSONObject(emptyFolders.summaryJson()).optBoolean("running", false))
        put("scanScope", "accessible_shared_storage")
        put("scanModes", "smart,quick,deep,custom")
        put("analysisRulesVersion", FileHealthScanner.ANALYSIS_RULES_VERSION)
        put("supportNetwork", "user_initiated_only")
        put("supportQrSave", "native_download_manager")
        put("shareAvailable", true)
        put("entitlement", entitlement.stateJsonObject())
        put("proProductId", EntitlementManager.PRO_PRODUCT_ID)
        put("billingReady", billing.stateJsonObject().optBoolean("billingReady", false))
        put("billing", billing.stateJsonObject())
        put("scannerCapabilities", "multi_pass,metadata,content_probe,categories,old,large,temp,apk,archives,zero_byte,empty_folders,empty_folder_review,verified_empty_folder_delete,screenshots,media,downloads,sha256_duplicates,review_candidates,live_activity,local_review_previews,verified_delete,aggregate_local_history,insights,what_changed,verified_cleanup_history,play_billing_foundation")
    }.toString()

    private fun rejected(reason: String): String = JSONObject().apply {
        put("accepted", false)
        put("reason", reason)
    }.toString()

    companion object {
        const val JS_INTERFACE_NAME = "BearagnosticNative"
        const val BRIDGE_VERSION = 14
    }
}
