package com.benedictinteractive.bearagnostic

import android.content.Context
import android.util.Patterns
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.util.Locale
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.TimeUnit

/**
 * Benedict server-entitlement client. Ko-fi is never contacted for payment truth
 * from the app; the app only asks the Benedict backend, which is fed by the
 * verified Ko-fi webhook.
 */
class ServerCommerceClient(
    context: Context,
    private val entitlement: EntitlementManager,
    private val onStateChanged: () -> Unit,
    private val openExternalUrl: (String) -> Unit,
) {
    private val store = ServerEntitlementStore(context.applicationContext)
    private val executor = Executors.newSingleThreadScheduledExecutor()
    @Volatile private var phase = if (CommerceConfig.isConfigured()) "ready" else "unconfigured"
    @Volatile private var purpose = "purchase"
    @Volatile private var challengeId: String? = null
    @Volatile private var lastError: String? = null
    @Volatile private var lastSyncAtMs = 0L
    @Volatile private var waitingSinceMs = 0L
    private var pollFuture: ScheduledFuture<*>? = null

    init {
        if (CommerceConfig.isConfigured()) refresh()
    }

    fun stateJson(): String = JSONObject().apply {
        put("configured", CommerceConfig.isConfigured())
        put("phase", phase)
        put("purpose", purpose)
        put("otpRequired", phase == "otp_required")
        put("waitingForPayment", phase == "waiting_payment")
        put("lastError", lastError ?: JSONObject.NULL)
        put("lastSyncAtMs", lastSyncAtMs)
        put("hasPendingSession", store.loadPending() != null)
        put("hasLocalServerLease", entitlement.isServerOwnedCached())
        put("productCode", CommerceConfig.PRODUCT_CODE)
    }.toString()

    fun startPurchase(email: String): String = startIdentity("purchase", email)
    fun startRestore(email: String): String = startIdentity("restore", email)

    fun verifyCode(code: String): String {
        if (!CommerceConfig.isConfigured()) return rejected("server_commerce_unconfigured")
        val challenge = challengeId ?: return rejected("verification_not_started")
        if (!Regex("^\\d{6}$").matches(code.trim())) return rejected("invalid_verification_code")
        phase = "verifying_code"; lastError = null; changed()
        executor.execute {
            try {
                val result = postJson("/api/commerce/identity/verify", JSONObject().apply {
                    put("challengeId", challenge)
                    put("code", code.trim())
                })
                if (purpose == "restore") {
                    val credential = result.optString("deviceCredential")
                    val entitlementId = result.optString("entitlementId")
                    val verifiedAt = result.optLong("verifiedAt", System.currentTimeMillis())
                    val leaseUntil = result.optLong("leaseUntil", 0L)
                    if (!result.optBoolean("isPro", false) || credential.length < 32 || entitlementId.isBlank() || leaseUntil <= verifiedAt) {
                        throw CommerceFailure("restore_response_invalid")
                    }
                    entitlement.updateServerOwnership(true, entitlementId, credential, verifiedAt, leaseUntil)
                    store.clearPending()
                    phase = "active"; lastSyncAtMs = System.currentTimeMillis(); challengeId = null
                    changed()
                } else {
                    val token = result.optString("sessionToken")
                    val credential = result.optString("deviceCredential")
                    val shopUrl = result.optString("shopUrl")
                    val expiresAt = result.optLong("expiresAt", 0L)
                    if (token.length < 32 || credential.length < 32 || !shopUrl.startsWith("https://") || expiresAt <= System.currentTimeMillis()) {
                        throw CommerceFailure("purchase_session_invalid")
                    }
                    store.savePending(token, credential, expiresAt)
                    phase = "opening_kofi"; lastSyncAtMs = System.currentTimeMillis(); challengeId = null
                    changed()
                    openExternalUrl(shopUrl)
                    phase = "waiting_payment"; waitingSinceMs = System.currentTimeMillis(); changed()
                    startPolling()
                }
            } catch (failure: CommerceFailure) { fail(failure.code) }
            catch (_: Exception) { fail("network_error") }
        }
        return accepted()
    }

    fun refresh(): String {
        if (!CommerceConfig.isConfigured()) return rejected("server_commerce_unconfigured")
        executor.execute { refreshNow() }
        return accepted()
    }

    fun resetFlow(): String {
        pollFuture?.cancel(false); pollFuture = null
        challengeId = null; lastError = null; purpose = "purchase"
        phase = if (entitlement.isServerOwnedCached()) "active" else "ready"
        changed()
        return accepted()
    }

    private fun startIdentity(nextPurpose: String, rawEmail: String): String {
        if (!CommerceConfig.isConfigured()) return rejected("server_commerce_unconfigured")
        val email = rawEmail.trim().lowercase(Locale.ROOT)
        if (email.length !in 3..254 || !Patterns.EMAIL_ADDRESS.matcher(email).matches()) return rejected("valid_email_required")
        if (nextPurpose !in setOf("purchase", "restore")) return rejected("invalid_purpose")
        if (nextPurpose == "purchase" && entitlement.currentTier() == EntitlementManager.Tier.PRO) return rejected("pro_already_active")
        purpose = nextPurpose; phase = "sending_code"; lastError = null; changed()
        executor.execute {
            try {
                val result = postJson("/api/commerce/identity/start", JSONObject().apply {
                    put("email", email)
                    put("purpose", nextPurpose)
                    put("installationId", store.installationId())
                    put("locale", Locale.getDefault().toLanguageTag().lowercase(Locale.ROOT))
                    put("productCode", CommerceConfig.PRODUCT_CODE)
                })
                val id = result.optString("challengeId")
                if (!id.startsWith("idv_")) throw CommerceFailure("challenge_response_invalid")
                challengeId = id; phase = "otp_required"; lastSyncAtMs = System.currentTimeMillis(); changed()
            } catch (failure: CommerceFailure) { fail(failure.code) }
            catch (_: Exception) { fail("network_error") }
        }
        return accepted()
    }

    private fun refreshNow() {
        val active = entitlement.serverLease()
        if (active != null) {
            try {
                val result = postJson("/api/commerce/entitlements/status", JSONObject().apply {
                    put("installationId", store.installationId())
                    put("deviceCredential", active.deviceCredential)
                })
                val isPro = result.optBoolean("isPro", false)
                val entitlementId = result.optString("entitlementId")
                val verifiedAt = result.optLong("verifiedAt", System.currentTimeMillis())
                val leaseUntil = result.optLong("leaseUntil", 0L)
                if (isPro && entitlementId.isNotBlank() && leaseUntil > verifiedAt) {
                    entitlement.updateServerOwnership(true, entitlementId, active.deviceCredential, verifiedAt, leaseUntil)
                    phase = "active"
                } else {
                    entitlement.clearServerOwnership(); phase = "ready"
                }
                lastError = null; lastSyncAtMs = System.currentTimeMillis(); changed(); return
            } catch (_: Exception) {
                if (entitlement.isServerOwnedCached()) {
                    phase = "offline_cached"; lastError = "network_error"; changed(); return
                }
            }
        }
        if (store.loadPending() != null) {
            phase = "waiting_payment"; changed(); pollPendingOnce(); startPolling(); return
        }
        phase = "ready"; lastError = null; changed()
    }

    private fun startPolling() {
        if (pollFuture?.isCancelled == false && pollFuture?.isDone == false) return
        pollFuture = executor.scheduleWithFixedDelay({ pollPendingOnce() }, 1, 3, TimeUnit.SECONDS)
    }

    private fun pollPendingOnce() {
        val pending = store.loadPending() ?: run {
            pollFuture?.cancel(false); pollFuture = null
            if (!entitlement.isServerOwnedCached()) phase = "ready"
            changed(); return
        }
        try {
            val result = postJson("/api/commerce/sessions/status", JSONObject(), "Bearer ${pending.sessionToken}")
            when (result.optString("state")) {
                "active" -> {
                    val entitlementId = result.optString("entitlementId")
                    val verifiedAt = result.optLong("verifiedAt", System.currentTimeMillis())
                    val leaseUntil = result.optLong("leaseUntil", 0L)
                    if (!result.optBoolean("isPro", false) || entitlementId.isBlank() || leaseUntil <= verifiedAt) {
                        throw CommerceFailure("entitlement_response_invalid")
                    }
                    entitlement.updateServerOwnership(true, entitlementId, pending.deviceCredential, verifiedAt, leaseUntil)
                    store.clearPending(); phase = "active"; lastError = null; lastSyncAtMs = System.currentTimeMillis()
                    pollFuture?.cancel(false); pollFuture = null; changed()
                }
                "expired", "cancelled" -> {
                    store.clearPending(); phase = "error"; lastError = "purchase_session_${result.optString("state")}";
                    pollFuture?.cancel(false); pollFuture = null; changed()
                }
                else -> {
                    phase = "waiting_payment"; lastError = null; lastSyncAtMs = System.currentTimeMillis(); changed()
                }
            }
        } catch (failure: CommerceFailure) {
            phase = "waiting_payment"; lastError = failure.code; changed()
        } catch (_: Exception) {
            phase = "waiting_payment"; lastError = "network_error"; changed()
        }
    }

    private fun postJson(path: String, body: JSONObject, authorization: String? = null): JSONObject {
        val base = CommerceConfig.normalizedBaseUrl()
        if (base.isEmpty()) throw CommerceFailure("server_commerce_unconfigured")
        val connection = URL(base + path).openConnection() as HttpURLConnection
        try {
            connection.requestMethod = "POST"
            connection.connectTimeout = 10_000
            connection.readTimeout = 12_000
            connection.doOutput = true
            connection.setRequestProperty("Content-Type", "application/json; charset=utf-8")
            connection.setRequestProperty("Accept", "application/json")
            connection.setRequestProperty("User-Agent", "Bearagnostic/${BuildConfig.VERSION_NAME}")
            if (!authorization.isNullOrBlank()) connection.setRequestProperty("Authorization", authorization)
            connection.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
            val code = connection.responseCode
            val stream = if (code in 200..299) connection.inputStream else connection.errorStream
            val text = if (stream != null) BufferedReader(InputStreamReader(stream, Charsets.UTF_8)).use { it.readText() } else "{}"
            val json = try { JSONObject(text) } catch (_: Exception) { JSONObject() }
            if (code !in 200..299 || json.optBoolean("ok", true) == false) {
                throw CommerceFailure(json.optString("error").ifBlank { "http_$code" })
            }
            return json
        } finally { connection.disconnect() }
    }

    private fun fail(code: String) {
        phase = "error"; lastError = code.take(80); lastSyncAtMs = System.currentTimeMillis(); changed()
    }

    private fun changed() {
        try { onStateChanged() } catch (_: Exception) { }
    }

    private fun accepted(): String = JSONObject().apply { put("accepted", true); put("state", JSONObject(stateJson())) }.toString()
    private fun rejected(reason: String): String = JSONObject().apply { put("accepted", false); put("reason", reason) }.toString()
    private class CommerceFailure(val code: String) : Exception(code)
}
