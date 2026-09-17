package com.benedictinteractive.bearagnostic

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import org.json.JSONObject

/**
 * DEBUG SOURCE SET ONLY.
 *
 * This is a separate QA launcher. It never runs as part of MainActivity startup
 * and is not packaged in release builds.
 *
 * It simulates the verified entitlement RESULT through ServerEntitlementStore,
 * then reads the same EntitlementManager capability gate used by the production app.
 */
class CommerceQaActivity : Activity() {
    private lateinit var status: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (!BuildConfig.DEBUG) {
            finish()
            return
        }

        val content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(24), dp(20), dp(24))
            setBackgroundColor(Color.rgb(247, 250, 253))
        }

        content.addView(TextView(this).apply {
            text = "Bearagnostic Commerce QA"
            textSize = 22f
            setTextColor(Color.rgb(35, 58, 82))
        })

        content.addView(TextView(this).apply {
            text = "Debug build only · no real payment · production UI is untouched"
            textSize = 13f
            setTextColor(Color.rgb(102, 121, 140))
            setPadding(0, dp(6), 0, dp(18))
        })

        status = TextView(this).apply {
            textSize = 13f
            setTextColor(Color.rgb(42, 64, 84))
            setPadding(dp(12), dp(12), dp(12), dp(12))
            setBackgroundColor(Color.WHITE)
        }
        content.addView(
            status,
            LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
            ).apply { bottomMargin = dp(16) },
        )

        addScenarioButton(content, "SUCCESS → Pro", "success")
        addScenarioButton(content, "PENDING → Free", "pending")
        addScenarioButton(content, "FAILED → Free", "failed")
        addScenarioButton(content, "RESTORE → Pro", "restore")
        addScenarioButton(content, "OFFLINE LEASE → Pro", "offline")
        addScenarioButton(content, "REFUND → Free", "refunded")
        addScenarioButton(content, "REVOKE → Free", "revoked")
        addScenarioButton(content, "CHARGEBACK → Free", "chargeback")
        addScenarioButton(content, "RESET → Free", "reset")

        content.addView(TextView(this).apply {
            text = "QA PASS rule: SUCCESS / RESTORE / OFFLINE must report Pro with Deep + Custom enabled. All negative scenarios must report Free with Deep + Custom disabled."
            textSize = 12f
            setTextColor(Color.rgb(114, 133, 150))
            setPadding(0, dp(16), 0, 0)
        })

        val scroll = ScrollView(this).apply {
            addView(content)
        }
        setContentView(scroll)
        renderStatus("ready")
    }

    private fun addScenarioButton(container: LinearLayout, label: String, scenario: String) {
        container.addView(
            Button(this).apply {
                text = label
                isAllCaps = false
                setOnClickListener { applyScenario(scenario) }
            },
            LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(48),
            ).apply { bottomMargin = dp(8) },
        )
    }

    private fun applyScenario(scenario: String) {
        val now = System.currentTimeMillis()
        val store = ServerEntitlementStore(applicationContext)
        val entitlement = EntitlementManager(applicationContext)

        entitlement.updatePlayOwnership(false, now)

        when (scenario) {
            "success", "restore" -> {
                store.saveActive(
                    entitlementId = "ent_qa_${scenario}_$now",
                    deviceCredential = "qa_${scenario}_" + "x".repeat(64),
                    verifiedAtMs = now,
                    leaseUntilMs = now + 24L * 60L * 60L * 1000L,
                )
            }

            "offline" -> {
                store.saveActive(
                    entitlementId = "ent_qa_offline_$now",
                    deviceCredential = "qa_offline_" + "o".repeat(64),
                    verifiedAtMs = now,
                    leaseUntilMs = now + 60L * 60L * 1000L,
                )
            }

            "pending", "failed", "refunded", "revoked", "chargeback", "reset" -> {
                store.clearActive()
            }
        }

        renderStatus(scenario)
    }

    private fun renderStatus(scenario: String) {
        val state = EntitlementManager(applicationContext).stateJsonObject()
        val capabilities = state.optJSONObject("capabilities") ?: JSONObject()
        val deep = capabilities.optBoolean("deep_scan", false)
        val custom = capabilities.optBoolean("custom_scan", false)

        val expectedPro = scenario in setOf("success", "restore", "offline")
        val actualPro = state.optBoolean("isPro", false)
        val pass = if (scenario == "ready") {
            true
        } else if (expectedPro) {
            actualPro && deep && custom
        } else {
            !actualPro && !deep && !custom
        }

        status.text = buildString {
            append("Scenario: ").append(scenario).append('\n')
            append("Tier: ").append(state.optString("tier")).append('\n')
            append("Source: ").append(state.optString("source")).append('\n')
            append("Deep Scan: ").append(deep).append('\n')
            append("Custom Scan: ").append(custom).append('\n')
            append("Result: ").append(if (pass) "PASS" else "FAIL")
        }
    }

    private fun dp(value: Int): Int =
        (value * resources.displayMetrics.density).toInt()
}
