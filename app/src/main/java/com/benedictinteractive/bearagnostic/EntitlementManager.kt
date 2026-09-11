package com.benedictinteractive.bearagnostic

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/**
 * Single source of truth for Bearagnostic Free/Pro access.
 *
 * Google Play Billing feeds ownership and localized product presentation into this
 * layer. Feature code never grants Pro directly. Debug builds may still apply a
 * local QA override, but release builds can become Pro only from cached ownership
 * that was established by a successful Google Play purchase query/update.
 */
class EntitlementManager(context: Context) {

    enum class Tier(val wireName: String) {
        FREE("free"),
        PRO("pro");

        companion object {
            fun fromWire(value: String?): Tier? = when (value?.trim()?.lowercase()) {
                "free" -> FREE
                "pro" -> PRO
                else -> null
            }
        }
    }

    enum class Capability(val wireName: String) {
        QUICK_SCAN("quick_scan"),
        SMART_SCAN("smart_scan"),
        BASIC_CLEANUP("basic_cleanup"),
        SAFETY_GUIDANCE("safety_guidance"),
        BASIC_REVIEW("basic_review"),
        SCAN_EVIDENCE("scan_evidence"),
        SHARE_RESULT("share_result"),
        DEEP_SCAN("deep_scan"),
        CUSTOM_SCAN("custom_scan"),
        ADVANCED_EXACT_DUPLICATES("advanced_exact_duplicates"),
        ADVANCED_MEDIA_REVIEW("advanced_media_review"),
        INSIGHTS_HISTORY("insights_history"),
        WHAT_CHANGED("what_changed"),
        FULL_CLEANUP_HISTORY("full_cleanup_history"),
        CUSTOM_EXCLUSIONS("custom_exclusions"),
        SCHEDULED_CHECKUPS("scheduled_checkups"),
    }

    data class BillingPresentation(
        val ready: Boolean = false,
        val canPurchase: Boolean = false,
        val productAvailable: Boolean = false,
        val purchasePending: Boolean = false,
        val status: String = "initializing",
        val formattedPrice: String? = null,
        val lastResponseCode: Int? = null,
        val lastSyncAtMs: Long = 0L,
    )

    private val preferences = context.applicationContext.getSharedPreferences(
        PREFS_NAME,
        Context.MODE_PRIVATE,
    )

    @Volatile
    private var billingPresentation = BillingPresentation()

    fun currentTier(): Tier {
        val debugTier = if (BuildConfig.DEBUG) {
            Tier.fromWire(preferences.getString(KEY_DEBUG_TIER, null))
        } else {
            null
        }
        if (debugTier != null) return debugTier
        return if (isPlayOwnedCached()) Tier.PRO else Tier.FREE
    }

    fun has(capability: Capability): Boolean =
        capability in FREE_CAPABILITIES || currentTier() == Tier.PRO

    fun isPlayOwnedCached(): Boolean = preferences.getBoolean(KEY_PLAY_OWNED, false)

    fun playOwnershipVerifiedAtMs(): Long = preferences.getLong(KEY_PLAY_VERIFIED_AT_MS, 0L)

    /** Called only after a successful Google Play ownership result or PURCHASED update. */
    fun updatePlayOwnership(owned: Boolean, verifiedAtMs: Long = System.currentTimeMillis()) {
        preferences.edit()
            .putBoolean(KEY_PLAY_OWNED, owned)
            .putLong(KEY_PLAY_VERIFIED_AT_MS, verifiedAtMs.coerceAtLeast(0L))
            .apply()
    }

    fun updateBillingPresentation(value: BillingPresentation) {
        billingPresentation = value.copy(
            status = value.status.trim().take(64).ifBlank { "unknown" },
            formattedPrice = value.formattedPrice?.trim()?.take(80)?.takeIf { it.isNotEmpty() },
            lastSyncAtMs = value.lastSyncAtMs.coerceAtLeast(0L),
        )
    }

    fun stateJson(): String = stateJsonObject().toString()

    fun stateJsonObject(): JSONObject {
        val tier = currentTier()
        val debugOverride = BuildConfig.DEBUG && preferences.contains(KEY_DEBUG_TIER)
        val playOwned = isPlayOwnedCached()
        val verifiedAtMs = playOwnershipVerifiedAtMs()
        val billing = billingPresentation
        val capabilities = JSONObject()
        Capability.values().forEach { capability ->
            capabilities.put(capability.wireName, has(capability))
        }

        val source = when {
            debugOverride -> "debug_override"
            playOwned || verifiedAtMs > 0L -> "google_play"
            else -> "local_default"
        }

        return JSONObject().apply {
            put("tier", tier.wireName)
            put("isPro", tier == Tier.PRO)
            put("source", source)
            put("debugControlsAvailable", BuildConfig.DEBUG)
            put("billingReady", billing.ready)
            put("canPurchase", billing.canPurchase && tier != Tier.PRO)
            put("productAvailable", billing.productAvailable)
            put("purchasePending", billing.purchasePending)
            put("billingStatus", billing.status)
            put("purchaseModel", "one_time_lifetime")
            put("productId", PRO_PRODUCT_ID)
            put("formattedPrice", billing.formattedPrice ?: JSONObject.NULL)
            put("playOwnershipCached", playOwned)
            put("ownershipVerifiedAtMs", verifiedAtMs)
            put("billingLastSyncAtMs", billing.lastSyncAtMs)
            if (billing.lastResponseCode != null) put("billingResponseCode", billing.lastResponseCode)
            put("noAccountRequired", true)
            put("ads", false)
            put("safetyAlwaysFree", true)
            put("capabilities", capabilities)
            put("implementedProCapabilities", JSONArray(listOf(
                Capability.DEEP_SCAN.wireName,
                Capability.CUSTOM_SCAN.wireName,
                Capability.ADVANCED_EXACT_DUPLICATES.wireName,
                Capability.ADVANCED_MEDIA_REVIEW.wireName,
                Capability.INSIGHTS_HISTORY.wireName,
                Capability.WHAT_CHANGED.wireName,
                Capability.FULL_CLEANUP_HISTORY.wireName,
            )))
            put("plannedProCapabilities", JSONArray(listOf(
                Capability.CUSTOM_EXCLUSIONS.wireName,
                Capability.SCHEDULED_CHECKUPS.wireName,
            )))
        }
    }

    fun setDebugTier(rawTier: String): String {
        if (!BuildConfig.DEBUG) {
            return JSONObject().apply {
                put("accepted", false)
                put("reason", "debug_controls_unavailable")
            }.toString()
        }

        val tier = Tier.fromWire(rawTier)
            ?: return JSONObject().apply {
                put("accepted", false)
                put("reason", "invalid_tier")
            }.toString()

        preferences.edit().putString(KEY_DEBUG_TIER, tier.wireName).apply()
        return JSONObject().apply {
            put("accepted", true)
            put("tier", tier.wireName)
            put("state", stateJsonObject())
        }.toString()
    }

    fun clearDebugTier(): String {
        if (!BuildConfig.DEBUG) {
            return JSONObject().apply {
                put("accepted", false)
                put("reason", "debug_controls_unavailable")
            }.toString()
        }
        preferences.edit().remove(KEY_DEBUG_TIER).apply()
        return JSONObject().apply {
            put("accepted", true)
            put("state", stateJsonObject())
        }.toString()
    }

    companion object {
        const val PRO_PRODUCT_ID = "bearagnostic_pro_lifetime"

        private const val PREFS_NAME = "bearagnostic_entitlement"
        private const val KEY_DEBUG_TIER = "debug_tier"
        private const val KEY_PLAY_OWNED = "play_owned"
        private const val KEY_PLAY_VERIFIED_AT_MS = "play_verified_at_ms"

        private val FREE_CAPABILITIES = setOf(
            Capability.QUICK_SCAN,
            Capability.SMART_SCAN,
            Capability.BASIC_CLEANUP,
            Capability.SAFETY_GUIDANCE,
            Capability.BASIC_REVIEW,
            Capability.SCAN_EVIDENCE,
            Capability.SHARE_RESULT,
        )
    }
}
