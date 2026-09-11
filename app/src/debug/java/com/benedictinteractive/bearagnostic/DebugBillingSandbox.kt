package com.benedictinteractive.bearagnostic

import android.content.Context
import android.os.Handler
import android.os.Looper
import org.json.JSONArray
import org.json.JSONObject
import java.util.Locale

/**
 * Debug-only, dual-sided Google Play Billing simulator for Bearagnostic Pro.
 *
 * Customer-side behavior and owner/store-side controls share one persisted local ledger.
 * The authoritative mock store state is deliberately separate from the app entitlement
 * cache so QA can exercise purchase, pending, restore, reinstall, refund, revoke,
 * chargeback, acknowledgement failures, network failures and ownership resync.
 *
 * This class lives under src/debug and is excluded from release variants.
 */
class DebugBillingSandbox(
    context: Context,
    private val entitlement: EntitlementManager,
) {
    private val prefs = context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    private val handler = Handler(Looper.getMainLooper())
    private val lock = Any()
    private var generation = 0L

    init {
        synchronized(lock) {
            ensureDefaultsLocked()
            if (isEnabledLocked()) syncOwnershipLocked("startup_query_purchases", emitQueryEvent = true)
            else entitlement.setDebugSandboxOwnership(false)
        }
    }

    fun stateJson(): String = synchronized(lock) { stateJsonLocked().toString() }

    fun setDeveloperMode(enabled: Boolean): String = synchronized(lock) {
        prefs.edit().putBoolean(KEY_DEV_MODE, enabled).apply()
        appendEventLocked("DEV_MODE", if (enabled) "Developer mode enabled" else "Developer mode disabled")
        if (enabled) {
            setEnabledLocked(true, "developer_mode_enabled")
        } else {
            setEnabledLocked(false, "developer_mode_disabled")
        }
        acceptedLocked(if (enabled) "developer_mode_enabled" else "developer_mode_disabled")
    }

    fun setEnabled(enabled: Boolean): String = synchronized(lock) {
        setEnabledLocked(enabled, if (enabled) "sandbox_enabled" else "sandbox_disabled")
        acceptedLocked(if (enabled) "sandbox_enabled" else "sandbox_disabled")
    }

    fun setMarket(raw: String): String = synchronized(lock) {
        val market = normalizeMarket(raw) ?: return rejectedLocked("invalid_market")
        prefs.edit().putString(KEY_MARKET, market).apply()
        appendEventLocked("CATALOG", "Market changed to $market")
        acceptedLocked("market_updated")
    }

    fun setNetworkMode(raw: String): String = synchronized(lock) {
        val mode = normalizeNetwork(raw) ?: return rejectedLocked("invalid_network_mode")
        prefs.edit().putString(KEY_NETWORK, mode).apply()
        appendEventLocked("NETWORK", "Network mode changed to $mode")
        acceptedLocked("network_updated")
    }

    fun setPaymentBehavior(raw: String): String = synchronized(lock) {
        val behavior = normalizePayment(raw) ?: return rejectedLocked("invalid_payment_behavior")
        prefs.edit().putString(KEY_PAYMENT, behavior).apply()
        appendEventLocked("PAYMENT_RULE", "Payment behavior changed to $behavior")
        acceptedLocked("payment_behavior_updated")
    }

    fun setAcknowledgeMode(raw: String): String = synchronized(lock) {
        val mode = normalizeAcknowledge(raw) ?: return rejectedLocked("invalid_acknowledge_mode")
        prefs.edit().putString(KEY_ACK_MODE, mode).putBoolean(KEY_ACK_FAIL_ONCE_USED, false).apply()
        appendEventLocked("ACK_RULE", "Acknowledgement mode changed to $mode")
        acceptedLocked("acknowledge_mode_updated")
    }

    // Backward-compatible scenario setter used by the B48 customer presentation adapter.
    fun setScenario(rawScenario: String): String = synchronized(lock) {
        val mapped = when (rawScenario.trim().lowercase(Locale.US)) {
            "success" -> PAYMENT_APPROVE
            "pending" -> PAYMENT_PENDING
            "cancel", "error" -> PAYMENT_DECLINE
            "already_owned" -> PAYMENT_APPROVE
            "network_error" -> PAYMENT_APPROVE
            "billing_unavailable" -> PAYMENT_APPROVE
            else -> return rejectedLocked("invalid_scenario")
        }
        if (rawScenario == "network_error") prefs.edit().putString(KEY_NETWORK, NETWORK_OFFLINE).apply()
        else if (rawScenario == "billing_unavailable") prefs.edit().putBoolean(KEY_STORE_AVAILABLE, false).apply()
        else prefs.edit().putBoolean(KEY_STORE_AVAILABLE, true).apply()
        prefs.edit().putString(KEY_PAYMENT, mapped).apply()
        appendEventLocked("SCENARIO", "Legacy scenario mapped to $rawScenario")
        acceptedLocked("scenario_updated")
    }

    fun launchPurchase(): String = synchronized(lock) {
        ensureUsableLocked()?.let { reason ->
            setStatusLocked(if (reason == "network_error") STATUS_NETWORK_ERROR else STATUS_BILLING_UNAVAILABLE, reason)
            appendEventLocked("PURCHASE_BLOCKED", "Purchase could not start: $reason")
            return rejectedLocked(reason)
        }
        generation += 1L
        entitlement.clearDebugTier()

        if (storeOwnedLocked()) {
            setStatusLocked(STATUS_CHECKING_OWNERSHIP, "already_owned_query")
            appendEventLocked("QUERY_PURCHASES", "Store reports this product is already owned")
            schedule(generation, networkDelayLocked()) { syncOwnershipLocked("already_owned_restored", false) }
            return acceptedLocked("already_owned_refresh")
        }

        prefs.edit().putBoolean(KEY_CHECKOUT_OPEN, true).putBoolean(KEY_PENDING, false).apply()
        setStatusLocked(STATUS_CHECKOUT_OPEN, "checkout_open")
        appendEventLocked("CUSTOMER", "Purchase sheet opened for ${EntitlementManager.PRO_PRODUCT_ID}")
        acceptedLocked("purchase_flow_open")
    }

    fun confirmCheckout(): String = synchronized(lock) {
        ensureUsableLocked()?.let { return rejectedLocked(it) }
        if (!prefs.getBoolean(KEY_CHECKOUT_OPEN, false)) return rejectedLocked("checkout_not_open")
        generation += 1L
        val token = generation
        prefs.edit().putBoolean(KEY_CHECKOUT_OPEN, false).apply()

        if (networkLocked() == NETWORK_OFFLINE) {
            setStatusLocked(STATUS_NETWORK_ERROR, "purchase_network_error")
            appendEventLocked("NETWORK_ERROR", "Payment request could not reach the mock store")
            return acceptedLocked("checkout_confirmed")
        }

        val transaction = newTransactionLocked()
        setStatusLocked(STATUS_PROCESSING, "payment_processing")
        appendEventLocked("TRANSACTION", "${transaction.optString("id")} created")
        schedule(token, networkDelayLocked()) {
            when (paymentLocked()) {
                PAYMENT_APPROVE -> settlePurchasedLocked(token, transaction.optString("id"), chargebackAfter = false)
                PAYMENT_PENDING -> markPendingLocked(transaction.optString("id"))
                PAYMENT_DECLINE -> markDeclinedLocked(transaction.optString("id"), "payment_declined")
                PAYMENT_CHARGEBACK -> settlePurchasedLocked(token, transaction.optString("id"), chargebackAfter = true)
            }
        }
        acceptedLocked("checkout_confirmed")
    }

    fun cancelCheckout(): String = synchronized(lock) {
        generation += 1L
        prefs.edit().putBoolean(KEY_CHECKOUT_OPEN, false).putBoolean(KEY_PENDING, false).apply()
        setStatusLocked(STATUS_CANCELLED, "purchase_cancelled")
        appendEventLocked("CUSTOMER", "Purchase sheet cancelled by customer")
        acceptedLocked("purchase_cancelled")
    }

    fun completePending(): String = synchronized(lock) {
        if (!prefs.getBoolean(KEY_PENDING, false)) return rejectedLocked("no_pending_purchase")
        generation += 1L
        val token = generation
        val id = currentTransactionIdLocked() ?: return rejectedLocked("transaction_missing")
        prefs.edit().putBoolean(KEY_PENDING, false).apply()
        setStatusLocked(STATUS_PROCESSING, "pending_payment_confirming")
        appendEventLocked("OWNER", "Pending payment manually confirmed")
        schedule(token, networkDelayLocked()) { settlePurchasedLocked(token, id, chargebackAfter = false) }
        acceptedLocked("pending_completion_started")
    }

    fun declinePending(): String = synchronized(lock) {
        if (!prefs.getBoolean(KEY_PENDING, false)) return rejectedLocked("no_pending_purchase")
        generation += 1L
        val id = currentTransactionIdLocked() ?: return rejectedLocked("transaction_missing")
        prefs.edit().putBoolean(KEY_PENDING, false).apply()
        markDeclinedLocked(id, "pending_payment_cancelled")
        acceptedLocked("pending_declined")
    }

    fun restore(): String = synchronized(lock) {
        ensureUsableLocked(ignoreOwnership = true)?.let { reason ->
            setStatusLocked(if (reason == "network_error") STATUS_NETWORK_ERROR else STATUS_BILLING_UNAVAILABLE, reason)
            appendEventLocked("RESTORE_BLOCKED", "Restore could not start: $reason")
            return rejectedLocked(reason)
        }
        generation += 1L
        val token = generation
        entitlement.clearDebugTier()
        setStatusLocked(STATUS_CHECKING_OWNERSHIP, "restore_requested")
        appendEventLocked("QUERY_PURCHASES", "Restore requested from customer side")
        schedule(token, networkDelayLocked()) { syncOwnershipLocked("restore_completed", false) }
        acceptedLocked("restore_queued")
    }

    fun syncOwnership(): String = synchronized(lock) {
        ensureUsableLocked(ignoreOwnership = true)?.let { reason ->
            setStatusLocked(if (reason == "network_error") STATUS_NETWORK_ERROR else STATUS_BILLING_UNAVAILABLE, reason)
            appendEventLocked("SYNC_BLOCKED", "Ownership sync could not start: $reason")
            return rejectedLocked(reason)
        }
        generation += 1L
        val token = generation
        setStatusLocked(STATUS_CHECKING_OWNERSHIP, "owner_sync_requested")
        appendEventLocked("QUERY_PURCHASES", "Owner console requested ownership sync")
        schedule(token, networkDelayLocked()) { syncOwnershipLocked("ownership_synced", false) }
        acceptedLocked("sync_queued")
    }

    fun forgetLocalEntitlement(): String = synchronized(lock) {
        generation += 1L
        entitlement.setDebugSandboxOwnership(false)
        entitlement.clearDebugTier()
        appendEventLocked("APP_CACHE", "Local entitlement cache cleared; store ledger preserved")
        setStatusLocked(if (storeOwnedLocked()) STATUS_LOCAL_CACHE_CLEARED else STATUS_READY, "local_entitlement_cleared")
        acceptedLocked("local_entitlement_cleared")
    }

    fun simulateReinstall(): String = synchronized(lock) {
        ensureUsableLocked(ignoreOwnership = true)?.let { reason ->
            appendEventLocked("REINSTALL_BLOCKED", "Startup ownership query could not run: $reason")
            return rejectedLocked(reason)
        }
        generation += 1L
        val token = generation
        entitlement.setDebugSandboxOwnership(false)
        entitlement.clearDebugTier()
        appendEventLocked("APP_REINSTALL", "App entitlement cleared; mock store ownership retained")
        setStatusLocked(STATUS_CHECKING_OWNERSHIP, "reinstall_startup_query")
        schedule(token, networkDelayLocked().coerceAtLeast(650L)) { syncOwnershipLocked("reinstall_ownership_restored", false) }
        acceptedLocked("reinstall_simulated")
    }

    fun retryAcknowledgement(): String = synchronized(lock) {
        val id = currentTransactionIdLocked() ?: return rejectedLocked("transaction_missing")
        val tx = transactionByIdLocked(id) ?: return rejectedLocked("transaction_missing")
        if (tx.optString("purchaseState") != PURCHASE_PURCHASED || tx.optBoolean("acknowledged")) {
            return rejectedLocked("acknowledgement_not_required")
        }
        generation += 1L
        val token = generation
        setStatusLocked(STATUS_ACKNOWLEDGING, "acknowledgement_retry")
        appendEventLocked("ACK", "Acknowledgement retry requested")
        schedule(token, networkDelayLocked()) { performAcknowledgementLocked(id, forceRetry = true) }
        acceptedLocked("acknowledgement_retry_queued")
    }

    fun refundKeepAccess(): String = synchronized(lock) {
        if (!storeOwnedLocked()) return rejectedLocked("not_owned")
        val id = currentTransactionIdLocked() ?: return rejectedLocked("transaction_missing")
        mutateTransactionLocked(id) { tx ->
            tx.put("paymentState", PAYMENT_REFUNDED)
            tx.put("refundState", "refunded_access_retained")
            tx.put("updatedAtMs", System.currentTimeMillis())
        }
        appendEventLocked("REFUND", "Order refunded without revoking access")
        setStatusLocked(STATUS_OWNED, "refund_access_retained")
        acceptedLocked("refund_access_retained")
    }

    fun refundAndRevoke(): String = synchronized(lock) {
        if (!storeOwnedLocked()) return rejectedLocked("not_owned")
        voidCurrentLocked("refunded_and_revoked", PAYMENT_REFUNDED, "Refund completed and access revoked")
        acceptedLocked("refund_and_revoke_completed")
    }

    fun revoke(): String = synchronized(lock) {
        if (!storeOwnedLocked()) return rejectedLocked("not_owned")
        voidCurrentLocked("revoked", PAYMENT_CONFIRMED, "Store ownership revoked")
        acceptedLocked("revoke_completed")
    }

    fun chargeback(): String = synchronized(lock) {
        if (!storeOwnedLocked()) return rejectedLocked("not_owned")
        voidCurrentLocked("chargeback", PAYMENT_CHARGED_BACK, "Chargeback/voided purchase simulated")
        acceptedLocked("chargeback_completed")
    }

    fun expireUnacknowledged(): String = synchronized(lock) {
        val id = currentTransactionIdLocked() ?: return rejectedLocked("transaction_missing")
        val tx = transactionByIdLocked(id) ?: return rejectedLocked("transaction_missing")
        if (tx.optString("purchaseState") != PURCHASE_PURCHASED || tx.optBoolean("acknowledged")) {
            return rejectedLocked("unacknowledged_purchase_not_found")
        }
        voidCurrentLocked("auto_refund_unacknowledged", PAYMENT_REFUNDED, "Three-day acknowledgement deadline simulated")
        appendEventLocked("AUTO_REFUND", "Unacknowledged purchase auto-refunded and revoked")
        acceptedLocked("acknowledgement_deadline_expired")
    }

    fun setStoreAvailable(available: Boolean): String = synchronized(lock) {
        prefs.edit().putBoolean(KEY_STORE_AVAILABLE, available).apply()
        appendEventLocked("STORE", if (available) "Mock store available" else "Mock store unavailable")
        acceptedLocked("store_availability_updated")
    }

    fun clearEvents(): String = synchronized(lock) {
        prefs.edit().putString(KEY_EVENTS, "[]").apply()
        appendEventLocked("EVENT_LOG", "Event log cleared")
        acceptedLocked("events_cleared")
    }

    fun resetPurchase(): String = synchronized(lock) {
        generation += 1L
        entitlement.setDebugSandboxOwnership(false)
        entitlement.clearDebugTier()
        val dev = prefs.getBoolean(KEY_DEV_MODE, false)
        val enabled = prefs.getBoolean(KEY_ENABLED, true)
        val market = marketLocked()
        val network = networkLocked()
        val payment = paymentLocked()
        val ack = acknowledgeLocked()
        prefs.edit().clear().apply()
        prefs.edit()
            .putBoolean(KEY_DEV_MODE, dev)
            .putBoolean(KEY_ENABLED, enabled)
            .putBoolean(KEY_STORE_AVAILABLE, true)
            .putString(KEY_MARKET, market)
            .putString(KEY_NETWORK, network)
            .putString(KEY_PAYMENT, payment)
            .putString(KEY_ACK_MODE, ack)
            .putString(KEY_STATUS, if (enabled) STATUS_READY else STATUS_DISABLED)
            .putString(KEY_TRANSACTIONS, "[]")
            .putString(KEY_EVENTS, "[]")
            .apply()
        appendEventLocked("RESET", "Billing Sandbox reset; product configuration preserved")
        acceptedLocked("sandbox_reset")
    }

    private fun ensureDefaultsLocked() {
        val editor = prefs.edit()
        if (!prefs.contains(KEY_DEV_MODE)) editor.putBoolean(KEY_DEV_MODE, false)
        if (!prefs.contains(KEY_ENABLED)) editor.putBoolean(KEY_ENABLED, false)
        if (!prefs.contains(KEY_STORE_AVAILABLE)) editor.putBoolean(KEY_STORE_AVAILABLE, true)
        if (!prefs.contains(KEY_MARKET)) editor.putString(KEY_MARKET, defaultMarket())
        if (!prefs.contains(KEY_NETWORK)) editor.putString(KEY_NETWORK, NETWORK_ONLINE)
        if (!prefs.contains(KEY_PAYMENT)) editor.putString(KEY_PAYMENT, PAYMENT_APPROVE)
        if (!prefs.contains(KEY_ACK_MODE)) editor.putString(KEY_ACK_MODE, ACK_SUCCESS)
        if (!prefs.contains(KEY_STATUS)) editor.putString(KEY_STATUS, STATUS_READY)
        if (!prefs.contains(KEY_TRANSACTIONS)) editor.putString(KEY_TRANSACTIONS, "[]")
        if (!prefs.contains(KEY_EVENTS)) editor.putString(KEY_EVENTS, "[]")
        editor.apply()
    }

    private fun setEnabledLocked(enabled: Boolean, event: String) {
        generation += 1L
        prefs.edit()
            .putBoolean(KEY_ENABLED, enabled)
            .putBoolean(KEY_PENDING, false)
            .putBoolean(KEY_CHECKOUT_OPEN, false)
            .putString(KEY_STATUS, if (enabled) STATUS_READY else STATUS_DISABLED)
            .putString(KEY_LAST_EVENT, event)
            .apply()
        if (!enabled) entitlement.setDebugSandboxOwnership(false)
        else {
            entitlement.clearDebugTier()
            syncOwnershipLocked("sandbox_enabled_sync", false)
        }
        appendEventLocked("PROVIDER", if (enabled) "Sandbox Store provider enabled" else "Sandbox Store provider disabled")
    }

    private fun ensureUsableLocked(ignoreOwnership: Boolean = false): String? {
        if (!isEnabledLocked()) return "sandbox_disabled"
        if (!prefs.getBoolean(KEY_STORE_AVAILABLE, true)) return "billing_unavailable"
        if (networkLocked() == NETWORK_OFFLINE) return "network_error"
        if (!ignoreOwnership && prefs.getBoolean(KEY_PENDING, false)) return "purchase_pending"
        return null
    }

    private fun newTransactionLocked(): JSONObject {
        val seq = prefs.getLong(KEY_TX_SEQ, 0L) + 1L
        prefs.edit().putLong(KEY_TX_SEQ, seq).apply()
        val now = System.currentTimeMillis()
        val id = "BGS-TEST-%06d".format(Locale.US, seq)
        val tx = JSONObject().apply {
            put("id", id)
            put("productId", EntitlementManager.PRO_PRODUCT_ID)
            put("market", marketLocked())
            put("formattedPrice", formattedPriceLocked())
            put("paymentState", PAYMENT_PROCESSING)
            put("purchaseState", PURCHASE_UNSPECIFIED)
            put("acknowledged", false)
            put("refundState", "none")
            put("entitlement", "free")
            put("createdAtMs", now)
            put("updatedAtMs", now)
            put("testOnly", true)
        }
        val arr = transactionsLocked()
        arr.put(tx)
        while (arr.length() > MAX_TRANSACTIONS) removeFirst(arr)
        prefs.edit()
            .putString(KEY_TRANSACTIONS, arr.toString())
            .putString(KEY_CURRENT_TX, id)
            .apply()
        return tx
    }

    private fun markPendingLocked(id: String) {
        mutateTransactionLocked(id) { tx ->
            tx.put("paymentState", PAYMENT_PENDING_STATE)
            tx.put("purchaseState", PURCHASE_PENDING)
            tx.put("updatedAtMs", System.currentTimeMillis())
        }
        entitlement.setDebugSandboxOwnership(false)
        prefs.edit().putBoolean(KEY_PENDING, true).putBoolean(KEY_STORE_OWNED, false).apply()
        setStatusLocked(STATUS_PENDING, "purchase_pending")
        appendEventLocked("PURCHASE_STATE", "$id → PENDING; entitlement remains FREE")
    }

    private fun markDeclinedLocked(id: String, event: String) {
        mutateTransactionLocked(id) { tx ->
            tx.put("paymentState", PAYMENT_DECLINED_STATE)
            tx.put("purchaseState", PURCHASE_CANCELED)
            tx.put("updatedAtMs", System.currentTimeMillis())
        }
        entitlement.setDebugSandboxOwnership(false)
        prefs.edit().putBoolean(KEY_PENDING, false).putBoolean(KEY_STORE_OWNED, false).apply()
        setStatusLocked(STATUS_CANCELLED, event)
        appendEventLocked("ONE_TIME_PRODUCT_CANCELED", "$id payment cancelled/declined")
    }

    private fun settlePurchasedLocked(token: Long, id: String, chargebackAfter: Boolean) {
        val now = System.currentTimeMillis()
        mutateTransactionLocked(id) { tx ->
            tx.put("paymentState", PAYMENT_CONFIRMED)
            tx.put("purchaseState", PURCHASE_PURCHASED)
            tx.put("acknowledged", false)
            tx.put("entitlement", "pro")
            tx.put("updatedAtMs", now)
        }
        prefs.edit()
            .putBoolean(KEY_PENDING, false)
            .putBoolean(KEY_STORE_OWNED, true)
            .putBoolean(KEY_ACKNOWLEDGED, false)
            .putLong(KEY_PURCHASE_CONFIRMED_AT_MS, now)
            .putLong(KEY_LAST_SYNC_AT_MS, now)
            .apply()
        entitlement.setDebugSandboxOwnership(true, now)
        setStatusLocked(STATUS_PURCHASED_UNACKNOWLEDGED, "purchase_update_purchased")
        appendEventLocked("ONE_TIME_PRODUCT_PURCHASED", "$id → PURCHASED")
        appendEventLocked("ENTITLEMENT", "Bearagnostic Pro granted after PURCHASED confirmation")

        schedule(token, 460L) { performAcknowledgementLocked(id, forceRetry = false) }
        if (chargebackAfter) {
            schedule(token, 2100L) {
                if (storeOwnedLocked()) voidCurrentLocked("chargeback", PAYMENT_CHARGED_BACK, "Approved purchase later charged back")
            }
        }
    }

    private fun performAcknowledgementLocked(id: String, forceRetry: Boolean) {
        val mode = acknowledgeLocked()
        val failOnceUsed = prefs.getBoolean(KEY_ACK_FAIL_ONCE_USED, false)
        val shouldFail = when (mode) {
            ACK_FAIL_ALWAYS -> true
            ACK_FAIL_ONCE -> !failOnceUsed && !forceRetry
            else -> false
        }
        if (shouldFail) {
            if (mode == ACK_FAIL_ONCE) prefs.edit().putBoolean(KEY_ACK_FAIL_ONCE_USED, true).apply()
            setStatusLocked(STATUS_OWNED_ACK_PENDING, "acknowledge_failed")
            appendEventLocked("ACK_ERROR", "$id acknowledgement failed; entitlement remains PRO")
            if (mode == ACK_FAIL_ONCE) {
                schedule(generation, 1100L) { performAcknowledgementLocked(id, forceRetry = true) }
            }
            return
        }

        mutateTransactionLocked(id) { tx ->
            tx.put("acknowledged", true)
            tx.put("updatedAtMs", System.currentTimeMillis())
        }
        prefs.edit().putBoolean(KEY_ACKNOWLEDGED, true).putLong(KEY_LAST_SYNC_AT_MS, System.currentTimeMillis()).apply()
        setStatusLocked(STATUS_OWNED, "acknowledged")
        appendEventLocked("PURCHASE_ACKNOWLEDGED", "$id acknowledged")
    }

    private fun syncOwnershipLocked(event: String, emitQueryEvent: Boolean) {
        if (emitQueryEvent) appendEventLocked("QUERY_PURCHASES", "Startup ownership query")
        val now = System.currentTimeMillis()
        val owned = storeOwnedLocked()
        entitlement.clearDebugTier()
        entitlement.setDebugSandboxOwnership(owned, now)
        prefs.edit().putLong(KEY_LAST_SYNC_AT_MS, now).apply()
        setStatusLocked(if (owned) {
            if (prefs.getBoolean(KEY_ACKNOWLEDGED, false)) STATUS_OWNED else STATUS_OWNED_ACK_PENDING
        } else STATUS_NOT_OWNED, event)
        appendEventLocked("ENTITLEMENT_SYNC", if (owned) "Store ownership restored Pro" else "Store reports no ownership; app remains Free")
    }

    private fun voidCurrentLocked(event: String, paymentState: String, message: String) {
        generation += 1L
        val id = currentTransactionIdLocked()
        if (id != null) {
            mutateTransactionLocked(id) { tx ->
                tx.put("paymentState", paymentState)
                tx.put("purchaseState", PURCHASE_VOIDED)
                tx.put("refundState", event)
                tx.put("entitlement", "free")
                tx.put("updatedAtMs", System.currentTimeMillis())
            }
        }
        prefs.edit()
            .putBoolean(KEY_STORE_OWNED, false)
            .putBoolean(KEY_ACKNOWLEDGED, false)
            .putBoolean(KEY_PENDING, false)
            .apply()
        entitlement.setDebugSandboxOwnership(false)
        setStatusLocked(STATUS_REVOKED, event)
        appendEventLocked("VOIDED_PURCHASE", message)
        appendEventLocked("ENTITLEMENT", "Bearagnostic Pro revoked")
    }

    private fun setStatusLocked(status: String, event: String) {
        prefs.edit()
            .putString(KEY_STATUS, status)
            .putString(KEY_LAST_EVENT, event)
            .putLong(KEY_LAST_SYNC_AT_MS, System.currentTimeMillis())
            .apply()
    }

    private fun mutateTransactionLocked(id: String, block: (JSONObject) -> Unit) {
        val arr = transactionsLocked()
        for (i in 0 until arr.length()) {
            val tx = arr.optJSONObject(i) ?: continue
            if (tx.optString("id") == id) {
                block(tx)
                break
            }
        }
        prefs.edit().putString(KEY_TRANSACTIONS, arr.toString()).apply()
    }

    private fun transactionByIdLocked(id: String): JSONObject? {
        val arr = transactionsLocked()
        for (i in 0 until arr.length()) {
            val tx = arr.optJSONObject(i) ?: continue
            if (tx.optString("id") == id) return JSONObject(tx.toString())
        }
        return null
    }

    private fun currentTransactionIdLocked(): String? = prefs.getString(KEY_CURRENT_TX, null)
    private fun currentTransactionLocked(): JSONObject? = currentTransactionIdLocked()?.let { transactionByIdLocked(it) }

    private fun transactionsLocked(): JSONArray = try {
        JSONArray(prefs.getString(KEY_TRANSACTIONS, "[]") ?: "[]")
    } catch (_: Throwable) { JSONArray() }

    private fun eventsLocked(): JSONArray = try {
        JSONArray(prefs.getString(KEY_EVENTS, "[]") ?: "[]")
    } catch (_: Throwable) { JSONArray() }

    private fun appendEventLocked(type: String, message: String) {
        val arr = eventsLocked()
        arr.put(JSONObject().apply {
            put("atMs", System.currentTimeMillis())
            put("type", type.take(48))
            put("message", message.take(180))
        })
        while (arr.length() > MAX_EVENTS) removeFirst(arr)
        prefs.edit().putString(KEY_EVENTS, arr.toString()).apply()
    }

    private fun removeFirst(array: JSONArray) {
        if (array.length() <= 0) return
        val next = JSONArray()
        for (i in 1 until array.length()) next.put(array.opt(i))
        // JSONArray cannot be reassigned in-place; copy the retained values back.
        while (array.length() > 0) array.remove(0)
        for (i in 0 until next.length()) array.put(next.opt(i))
    }

    private fun stateJsonLocked(): JSONObject {
        val tx = currentTransactionLocked()
        val transactions = transactionsLocked()
        val events = eventsLocked()
        val storeOwned = storeOwnedLocked()
        val sandboxOwned = entitlement.isDebugSandboxOwned()
        val status = prefs.getString(KEY_STATUS, STATUS_READY) ?: STATUS_READY
        return JSONObject().apply {
            put("available", true)
            put("debugOnly", true)
            put("releaseIncluded", false)
            put("label", "TEST PURCHASE · DEBUG ONLY")
            put("devModeEnabled", prefs.getBoolean(KEY_DEV_MODE, false))
            put("enabled", isEnabledLocked())
            put("provider", "sandbox_store")
            put("accountLabel", "License Tester A")
            put("storeAvailable", prefs.getBoolean(KEY_STORE_AVAILABLE, true))
            put("market", marketLocked())
            put("formattedPrice", formattedPriceLocked())
            put("priceIsTestOnly", true)
            put("networkMode", networkLocked())
            put("paymentBehavior", paymentLocked())
            put("acknowledgeMode", acknowledgeLocked())
            put("scenario", legacyScenarioLocked())
            put("status", status)
            put("productId", EntitlementManager.PRO_PRODUCT_ID)
            put("purchaseModel", "one_time_lifetime")
            put("storeOwned", storeOwned)
            put("accountOwned", storeOwned)
            put("entitlementApplied", sandboxOwned)
            put("acknowledged", prefs.getBoolean(KEY_ACKNOWLEDGED, false))
            put("purchasePending", prefs.getBoolean(KEY_PENDING, false))
            put("checkoutOpen", prefs.getBoolean(KEY_CHECKOUT_OPEN, false))
            put("canPurchase", isEnabledLocked() && prefs.getBoolean(KEY_STORE_AVAILABLE, true) && networkLocked() != NETWORK_OFFLINE && !storeOwned && !prefs.getBoolean(KEY_PENDING, false) && status !in BUSY_STATUSES)
            put("canRestore", isEnabledLocked())
            put("lastEvent", prefs.getString(KEY_LAST_EVENT, "startup"))
            put("purchaseConfirmedAtMs", prefs.getLong(KEY_PURCHASE_CONFIRMED_AT_MS, 0L))
            put("lastSyncAtMs", prefs.getLong(KEY_LAST_SYNC_AT_MS, 0L))
            put("currentTransaction", tx ?: JSONObject.NULL)
            put("transactions", transactions)
            put("events", events)
            put("tokensExposedToWeb", false)
            put("chargesRealMoney", false)
            put("contactsGooglePlay", false)
            put("storeAndAppStateSeparated", true)
        }
    }

    private fun acceptedLocked(reason: String): String = JSONObject().apply {
        put("accepted", true)
        put("reason", reason)
        put("state", stateJsonLocked())
    }.toString()

    private fun rejectedLocked(reason: String): String = JSONObject().apply {
        put("accepted", false)
        put("reason", reason)
        put("state", stateJsonLocked())
    }.toString()

    private fun schedule(token: Long, delayMs: Long, block: () -> Unit) {
        handler.postDelayed({
            synchronized(lock) {
                if (token != generation || !isEnabledLocked()) return@synchronized
                block()
            }
        }, delayMs)
    }

    private fun isEnabledLocked(): Boolean = prefs.getBoolean(KEY_ENABLED, false)
    private fun storeOwnedLocked(): Boolean = prefs.getBoolean(KEY_STORE_OWNED, false)
    private fun marketLocked(): String = normalizeMarket(prefs.getString(KEY_MARKET, defaultMarket())) ?: defaultMarket()
    private fun networkLocked(): String = normalizeNetwork(prefs.getString(KEY_NETWORK, NETWORK_ONLINE)) ?: NETWORK_ONLINE
    private fun paymentLocked(): String = normalizePayment(prefs.getString(KEY_PAYMENT, PAYMENT_APPROVE)) ?: PAYMENT_APPROVE
    private fun acknowledgeLocked(): String = normalizeAcknowledge(prefs.getString(KEY_ACK_MODE, ACK_SUCCESS)) ?: ACK_SUCCESS

    private fun networkDelayLocked(): Long = when (networkLocked()) {
        NETWORK_SLOW -> 1_650L
        else -> 420L
    }

    private fun legacyScenarioLocked(): String = when {
        !prefs.getBoolean(KEY_STORE_AVAILABLE, true) -> "billing_unavailable"
        networkLocked() == NETWORK_OFFLINE -> "network_error"
        paymentLocked() == PAYMENT_PENDING -> "pending"
        paymentLocked() == PAYMENT_DECLINE -> "cancel"
        else -> "success"
    }

    private fun formattedPriceLocked(): String = when (marketLocked()) {
        MARKET_TH -> "฿199.00"
        MARKET_JP -> "¥900"
        MARKET_EU -> "€5.99"
        MARKET_BR -> "R$ 29,90"
        else -> "$5.99"
    }

    private fun defaultMarket(): String = when (Locale.getDefault().country.uppercase(Locale.US)) {
        "TH" -> MARKET_TH
        "JP" -> MARKET_JP
        "BR" -> MARKET_BR
        in setOf("DE", "FR", "IT", "ES", "NL", "BE", "PT", "AT", "IE", "FI") -> MARKET_EU
        else -> MARKET_US
    }

    private fun normalizeMarket(raw: String?): String? = when (raw?.trim()?.lowercase(Locale.US)) {
        MARKET_TH, MARKET_US, MARKET_JP, MARKET_EU, MARKET_BR -> raw.trim().lowercase(Locale.US)
        else -> null
    }

    private fun normalizeNetwork(raw: String?): String? = when (raw?.trim()?.lowercase(Locale.US)) {
        NETWORK_ONLINE, NETWORK_SLOW, NETWORK_OFFLINE -> raw.trim().lowercase(Locale.US)
        else -> null
    }

    private fun normalizePayment(raw: String?): String? = when (raw?.trim()?.lowercase(Locale.US)) {
        PAYMENT_APPROVE, PAYMENT_PENDING, PAYMENT_DECLINE, PAYMENT_CHARGEBACK -> raw.trim().lowercase(Locale.US)
        else -> null
    }

    private fun normalizeAcknowledge(raw: String?): String? = when (raw?.trim()?.lowercase(Locale.US)) {
        ACK_SUCCESS, ACK_FAIL_ONCE, ACK_FAIL_ALWAYS -> raw.trim().lowercase(Locale.US)
        else -> null
    }

    companion object {
        private const val PREFS_NAME = "bearagnostic_debug_billing_sandbox_v2"
        private const val KEY_DEV_MODE = "developer_mode"
        private const val KEY_ENABLED = "enabled"
        private const val KEY_STORE_AVAILABLE = "store_available"
        private const val KEY_MARKET = "market"
        private const val KEY_NETWORK = "network_mode"
        private const val KEY_PAYMENT = "payment_behavior"
        private const val KEY_ACK_MODE = "acknowledge_mode"
        private const val KEY_ACK_FAIL_ONCE_USED = "ack_fail_once_used"
        private const val KEY_STATUS = "status"
        private const val KEY_STORE_OWNED = "store_owned"
        private const val KEY_ACKNOWLEDGED = "acknowledged"
        private const val KEY_PENDING = "pending"
        private const val KEY_CHECKOUT_OPEN = "checkout_open"
        private const val KEY_LAST_EVENT = "last_event"
        private const val KEY_PURCHASE_CONFIRMED_AT_MS = "purchase_confirmed_at_ms"
        private const val KEY_LAST_SYNC_AT_MS = "last_sync_at_ms"
        private const val KEY_TX_SEQ = "transaction_seq"
        private const val KEY_CURRENT_TX = "current_transaction"
        private const val KEY_TRANSACTIONS = "transactions_json"
        private const val KEY_EVENTS = "events_json"

        private const val MARKET_TH = "th"
        private const val MARKET_US = "us"
        private const val MARKET_JP = "jp"
        private const val MARKET_EU = "eu"
        private const val MARKET_BR = "br"

        private const val NETWORK_ONLINE = "online"
        private const val NETWORK_SLOW = "slow"
        private const val NETWORK_OFFLINE = "offline"

        private const val PAYMENT_APPROVE = "approve"
        private const val PAYMENT_PENDING = "pending"
        private const val PAYMENT_DECLINE = "decline"
        private const val PAYMENT_CHARGEBACK = "chargeback"
        private const val PAYMENT_PROCESSING = "processing"
        private const val PAYMENT_PENDING_STATE = "pending"
        private const val PAYMENT_CONFIRMED = "confirmed"
        private const val PAYMENT_DECLINED_STATE = "declined"
        private const val PAYMENT_REFUNDED = "refunded"
        private const val PAYMENT_CHARGED_BACK = "charged_back"

        private const val ACK_SUCCESS = "success"
        private const val ACK_FAIL_ONCE = "fail_once"
        private const val ACK_FAIL_ALWAYS = "fail_always"

        private const val PURCHASE_UNSPECIFIED = "unspecified"
        private const val PURCHASE_PENDING = "pending"
        private const val PURCHASE_PURCHASED = "purchased"
        private const val PURCHASE_CANCELED = "canceled"
        private const val PURCHASE_VOIDED = "voided"

        private const val STATUS_DISABLED = "disabled"
        private const val STATUS_READY = "ready"
        private const val STATUS_CHECKOUT_OPEN = "checkout_open"
        private const val STATUS_PROCESSING = "processing_payment"
        private const val STATUS_PURCHASED_UNACKNOWLEDGED = "purchased_unacknowledged"
        private const val STATUS_ACKNOWLEDGING = "acknowledging"
        private const val STATUS_OWNED = "owned"
        private const val STATUS_OWNED_ACK_PENDING = "owned_ack_pending"
        private const val STATUS_PENDING = "pending"
        private const val STATUS_CANCELLED = "cancelled"
        private const val STATUS_NETWORK_ERROR = "network_error"
        private const val STATUS_BILLING_UNAVAILABLE = "billing_unavailable"
        private const val STATUS_CHECKING_OWNERSHIP = "checking_ownership"
        private const val STATUS_NOT_OWNED = "not_owned"
        private const val STATUS_LOCAL_CACHE_CLEARED = "local_cache_cleared"
        private const val STATUS_REVOKED = "revoked"

        private const val MAX_TRANSACTIONS = 40
        private const val MAX_EVENTS = 80

        private val BUSY_STATUSES = setOf(
            STATUS_CHECKOUT_OPEN,
            STATUS_PROCESSING,
            STATUS_PURCHASED_UNACKNOWLEDGED,
            STATUS_ACKNOWLEDGING,
            STATUS_CHECKING_OWNERSHIP,
        )
    }
}
