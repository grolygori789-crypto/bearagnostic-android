package com.benedictinteractive.bearagnostic

import android.content.Context
import org.json.JSONObject

/**
 * Debug-only commerce QA harness.
 *
 * This file lives under src/debug, therefore the implementation is excluded from
 * release variants by the Android source-set model.
 *
 * There is no Developer Mode on/off state transition. QA scenarios are explicit
 * one-shot actions and feed the SAME EntitlementManager capability gate used by
 * production Pro access.
 */
class DebugCommerceQaHarness private constructor() {
    companion object {
        @JvmStatic
        fun run(
            context: Context,
            entitlement: EntitlementManager,
            scenario: String,
        ): String {
            val normalized = scenario.trim().lowercase()
            val now = System.currentTimeMillis()

            fun grant(hours: Long, label: String) {
                entitlement.updatePlayOwnership(false, now)
                val credential = "qa_" + label + "_" + "x".repeat(64)
                entitlement.updateServerOwnership(
                    owned = true,
                    entitlementId = "ent_qa_${label}_$now",
                    deviceCredential = credential,
                    verifiedAtMs = now,
                    leaseUntilMs = now + hours * 60L * 60L * 1000L,
                )
            }

            fun clear() {
                entitlement.clearServerOwnership()
                entitlement.updatePlayOwnership(false, now)
            }

            when (normalized) {
                "success" -> grant(24, "success")
                "restore" -> grant(24, "restore")
                "offline" -> grant(1, "offline")

                "pending",
                "failed",
                "cancelled",
                "refunded",
                "revoked",
                "chargeback",
                "reset" -> clear()

                else -> {
                    return JSONObject().apply {
                        put("accepted", false)
                        put("reason", "invalid_qa_scenario")
                    }.toString()
                }
            }

            val state = entitlement.stateJsonObject()
            val capabilities = state.optJSONObject("capabilities")

            return JSONObject().apply {
                put("accepted", true)
                put("scenario", normalized)
                put("tier", state.optString("tier"))
                put("isPro", state.optBoolean("isPro", false))
                put("source", state.optString("source"))
                put("deepScan", capabilities?.optBoolean("deep_scan", false) == true)
                put("customScan", capabilities?.optBoolean("custom_scan", false) == true)
                put("productionPaymentTouched", false)
                put("realPaymentRequired", false)
            }.toString()
        }
    }
}
