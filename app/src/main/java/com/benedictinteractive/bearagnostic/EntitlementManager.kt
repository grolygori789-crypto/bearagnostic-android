package com.benedictinteractive.bearagnostic

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/**
 * Single source of truth for Bearagnostic Free/Pro access.
 *
 * Billing intentionally does not live here yet. The next Play Billing batch will
 * feed verified ownership into this layer instead of teaching feature code about
 * purchases. Until then release builds are Free; debug builds may use a local
 * override solely for QA of both entitlement states.
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

    private val preferences = context.applicationContext.getSharedPreferences(
        PREFS_NAME,
        Context.MODE_PRIVATE,
    )

    fun currentTier(): Tier {
        if (!BuildConfig.DEBUG) return Tier.FREE
        return Tier.fromWire(preferences.getString(KEY_DEBUG_TIER, null)) ?: Tier.FREE
    }

    fun has(capability: Capability): Boolean =
        capability in FREE_CAPABILITIES || currentTier() == Tier.PRO

    fun stateJson(): String = stateJsonObject().toString()

    fun stateJsonObject(): JSONObject {
        val tier = currentTier()
        val debugOverride = BuildConfig.DEBUG && preferences.contains(KEY_DEBUG_TIER)
        val capabilities = JSONObject()
        Capability.values().forEach { capability ->
            capabilities.put(capability.wireName, has(capability))
        }

        return JSONObject().apply {
            put("tier", tier.wireName)
            put("isPro", tier == Tier.PRO)
            put("source", if (debugOverride) "debug_override" else "local_default")
            put("debugControlsAvailable", BuildConfig.DEBUG)
            put("billingReady", false)
            put("canPurchase", false)
            put("purchaseModel", "one_time_lifetime")
            put("productId", PRO_PRODUCT_ID)
            put("formattedPrice", JSONObject.NULL)
            put("noAccountRequired", true)
            put("ads", false)
            put("safetyAlwaysFree", true)
            put("capabilities", capabilities)
            put("implementedProCapabilities", JSONArray(listOf(
                Capability.DEEP_SCAN.wireName,
                Capability.CUSTOM_SCAN.wireName,
                Capability.ADVANCED_EXACT_DUPLICATES.wireName,
            )))
            put("plannedProCapabilities", JSONArray(listOf(
                Capability.ADVANCED_MEDIA_REVIEW.wireName,
                Capability.INSIGHTS_HISTORY.wireName,
                Capability.WHAT_CHANGED.wireName,
                Capability.FULL_CLEANUP_HISTORY.wireName,
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
