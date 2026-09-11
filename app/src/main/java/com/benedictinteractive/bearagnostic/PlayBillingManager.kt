package com.benedictinteractive.bearagnostic

import android.app.Activity
import android.app.Application
import android.os.Bundle
import com.android.billingclient.api.AcknowledgePurchaseParams
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.PendingPurchasesParams
import com.android.billingclient.api.ProductDetails
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.PurchasesUpdatedListener
import com.android.billingclient.api.QueryProductDetailsParams
import com.android.billingclient.api.QueryPurchasesParams
import org.json.JSONObject
import java.lang.ref.WeakReference

/**
 * Google Play Billing foundation for the one-time Bearagnostic Pro entitlement.
 *
 * This layer deliberately keeps purchase tokens, order IDs and raw purchase JSON out
 * of the WebView. JavaScript receives only presentation-safe product/ownership state.
 * The entitlement layer remains the single source of truth for feature access.
 *
 * B44 is client-side Play Billing foundation. A later release-validation batch still
 * has to prove the product configuration and purchase lifecycle through a Play test
 * track. Server-side verification can be added later without changing feature gates.
 */
class PlayBillingManager(
    activity: Activity,
    private val entitlement: EntitlementManager,
    private val onStateChanged: () -> Unit,
) : PurchasesUpdatedListener, Application.ActivityLifecycleCallbacks {

    private val application = activity.application
    private val activityRef = WeakReference(activity)
    private val lock = Any()

    @Volatile private var connected = false
    @Volatile private var connecting = false
    @Volatile private var productAvailable = false
    @Volatile private var purchasePending = false
    @Volatile private var status = "initializing"
    @Volatile private var formattedPrice: String? = null
    @Volatile private var lastResponseCode: Int? = null
    @Volatile private var lastDebugMessage: String? = null
    @Volatile private var lastSyncAtMs = 0L
    @Volatile private var lastEvent = "startup"

    private var productDetails: ProductDetails? = null
    private var offerToken: String? = null

    private val billingClient: BillingClient = BillingClient.newBuilder(application.applicationContext)
        .setListener(this)
        .enablePendingPurchases(
            PendingPurchasesParams.newBuilder()
                .enableOneTimeProducts()
                .build(),
        )
        .enableAutoServiceReconnection()
        .build()

    init {
        application.registerActivityLifecycleCallbacks(this)
        connect("startup")
    }

    fun stateJson(): String = stateJsonObject().toString()

    fun stateJsonObject(): JSONObject = synchronized(lock) {
        val playOwned = entitlement.isPlayOwnedCached()
        JSONObject().apply {
            put("available", true)
            put("libraryVersion", BILLING_LIBRARY_VERSION)
            put("productId", EntitlementManager.PRO_PRODUCT_ID)
            put("purchaseModel", "one_time_lifetime")
            put("connected", connected)
            put("connecting", connecting)
            put("billingReady", connected)
            put("productAvailable", productAvailable)
            put("canPurchase", connected && productAvailable && !playOwned && !purchasePending)
            put("formattedPrice", formattedPrice ?: JSONObject.NULL)
            put("playOwnershipCached", playOwned)
            put("ownershipVerifiedAtMs", entitlement.playOwnershipVerifiedAtMs())
            put("purchasePending", purchasePending)
            put("status", status)
            put("lastEvent", lastEvent)
            put("lastSyncAtMs", lastSyncAtMs)
            if (lastResponseCode != null) put("responseCode", lastResponseCode)
            if (!lastDebugMessage.isNullOrBlank()) put("debugMessage", lastDebugMessage)
            put("tokensExposedToWeb", false)
            put("serverVerification", false)
        }
    }

    fun refresh(): String {
        if (billingClient.isReady) {
            connected = true
            connecting = false
            queryProductAndOwnership("manual_refresh")
        } else {
            connect("manual_refresh")
        }
        return accepted("refresh_queued")
    }

    fun restore(): String {
        lastEvent = "restore_requested"
        if (billingClient.isReady) {
            connected = true
            connecting = false
            queryOwnership("restore")
        } else {
            connect("restore")
        }
        publish()
        return accepted("restore_queued")
    }

    fun launchPurchase(): String {
        if (entitlement.currentTier() == EntitlementManager.Tier.PRO && !isDebugOverrideFree()) {
            return rejected("already_pro")
        }
        if (purchasePending) return rejected("purchase_pending")

        val details: ProductDetails
        val selectedOfferToken: String
        synchronized(lock) {
            details = productDetails ?: return rejected("product_unavailable")
            selectedOfferToken = offerToken ?: return rejected("offer_unavailable")
        }
        val activity = activityRef.get() ?: return rejected("activity_unavailable")
        if (!billingClient.isReady) {
            connect("purchase")
            return rejected("billing_not_ready")
        }

        lastEvent = "purchase_requested"
        status = "launching_purchase"
        publish()

        activity.runOnUiThread {
            val productParams = BillingFlowParams.ProductDetailsParams.newBuilder()
                .setProductDetails(details)
                .setOfferToken(selectedOfferToken)
                .build()
            val flowParams = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(listOf(productParams))
                .build()
            val result = billingClient.launchBillingFlow(activity, flowParams)
            handleLaunchResult(result)
        }
        return accepted("purchase_flow_queued")
    }

    private fun connect(reason: String) {
        synchronized(lock) {
            if (billingClient.isReady) {
                connected = true
                connecting = false
                queryProductAndOwnership(reason)
                return
            }
            if (connecting) return
            connecting = true
            connected = false
            status = "connecting"
            lastEvent = reason
        }
        publish()

        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(result: BillingResult) {
                captureResult(result)
                if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                    connected = true
                    connecting = false
                    status = "connected"
                    publish()
                    queryProductAndOwnership(reason)
                } else {
                    connected = false
                    connecting = false
                    status = responseStatus(result.responseCode)
                    publish()
                }
            }

            override fun onBillingServiceDisconnected() {
                connected = false
                connecting = false
                status = "disconnected"
                lastEvent = "service_disconnected"
                updateEntitlementPresentation()
                publish()
            }
        })
    }

    private fun queryProductAndOwnership(reason: String) {
        queryProductDetails(reason)
        queryOwnership(reason)
    }

    private fun queryProductDetails(reason: String) {
        if (!billingClient.isReady) return
        val product = QueryProductDetailsParams.Product.newBuilder()
            .setProductId(EntitlementManager.PRO_PRODUCT_ID)
            .setProductType(BillingClient.ProductType.INAPP)
            .build()
        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(listOf(product))
            .build()

        billingClient.queryProductDetailsAsync(params) { result, queryResult ->
            captureResult(result)
            if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                val details = queryResult.productDetailsList
                    .firstOrNull { it.productId == EntitlementManager.PRO_PRODUCT_ID }
                val offer = details?.oneTimePurchaseOfferDetailsList
                    ?.firstOrNull { it.rentalDetails == null }
                synchronized(lock) {
                    productDetails = details
                    offerToken = offer?.offerToken
                    formattedPrice = offer?.formattedPrice
                    productAvailable = details != null && offer != null && !offer.offerToken.isNullOrBlank()
                    status = if (productAvailable) {
                        if (entitlement.isPlayOwnedCached()) "owned" else "ready"
                    } else {
                        "product_unavailable"
                    }
                    lastEvent = "product_query_$reason"
                    lastSyncAtMs = System.currentTimeMillis()
                }
            } else {
                synchronized(lock) {
                    productDetails = null
                    offerToken = null
                    formattedPrice = null
                    productAvailable = false
                    status = responseStatus(result.responseCode)
                    lastEvent = "product_query_failed"
                }
            }
            updateEntitlementPresentation()
            publish()
        }
    }

    private fun queryOwnership(reason: String) {
        if (!billingClient.isReady) return
        val params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.INAPP)
            .build()
        billingClient.queryPurchasesAsync(params) { result, purchases ->
            captureResult(result)
            if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                processOwnershipList(purchases, "ownership_query_$reason")
            } else {
                status = responseStatus(result.responseCode)
                lastEvent = "ownership_query_failed"
                updateEntitlementPresentation()
                publish()
            }
        }
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: List<Purchase>?) {
        captureResult(result)
        when (result.responseCode) {
            BillingClient.BillingResponseCode.OK -> processOwnershipList(purchases.orEmpty(), "purchase_update")
            BillingClient.BillingResponseCode.USER_CANCELED -> {
                status = if (entitlement.isPlayOwnedCached()) "owned" else "ready"
                lastEvent = "purchase_cancelled"
                updateEntitlementPresentation()
                publish()
            }
            BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> {
                lastEvent = "already_owned_refresh"
                queryOwnership("already_owned")
            }
            else -> {
                status = responseStatus(result.responseCode)
                lastEvent = "purchase_update_failed"
                updateEntitlementPresentation()
                publish()
            }
        }
    }

    private fun processOwnershipList(purchases: List<Purchase>, event: String) {
        val relevant = purchases.filter { EntitlementManager.PRO_PRODUCT_ID in it.products }
        val purchased = relevant.firstOrNull { it.purchaseState == Purchase.PurchaseState.PURCHASED }
        val pending = relevant.any { it.purchaseState == Purchase.PurchaseState.PENDING }
        purchasePending = pending && purchased == null
        lastSyncAtMs = System.currentTimeMillis()
        lastEvent = event

        if (purchased != null) {
            entitlement.updatePlayOwnership(true, lastSyncAtMs)
            purchasePending = false
            status = if (purchased.isAcknowledged) "owned" else "acknowledging"
            updateEntitlementPresentation()
            publish()
            if (!purchased.isAcknowledged) acknowledge(purchased)
            return
        }

        if (!pending) {
            // A successful ownership query is authoritative for the client-side cache.
            entitlement.updatePlayOwnership(false, lastSyncAtMs)
            status = if (productAvailable) "ready" else "product_unavailable"
        } else {
            status = "pending"
        }
        updateEntitlementPresentation()
        publish()
    }

    private fun acknowledge(purchase: Purchase) {
        val params = AcknowledgePurchaseParams.newBuilder()
            .setPurchaseToken(purchase.purchaseToken)
            .build()
        billingClient.acknowledgePurchase(params) { result ->
            captureResult(result)
            if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                status = "owned"
                lastEvent = "acknowledged"
            } else {
                // Keep the entitlement granted from PURCHASED; retry acknowledgment on resume/query.
                status = "owned_ack_pending"
                lastEvent = "acknowledge_failed"
            }
            updateEntitlementPresentation()
            publish()
        }
    }

    private fun handleLaunchResult(result: BillingResult) {
        captureResult(result)
        when (result.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                status = "purchase_flow_open"
                lastEvent = "purchase_flow_open"
            }
            BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> {
                status = "checking_ownership"
                lastEvent = "already_owned_refresh"
                queryOwnership("launch_already_owned")
            }
            BillingClient.BillingResponseCode.USER_CANCELED -> {
                status = if (entitlement.isPlayOwnedCached()) "owned" else "ready"
                lastEvent = "purchase_cancelled"
            }
            else -> {
                status = responseStatus(result.responseCode)
                lastEvent = "purchase_launch_failed"
            }
        }
        updateEntitlementPresentation()
        publish()
    }

    private fun captureResult(result: BillingResult) {
        lastResponseCode = result.responseCode
        lastDebugMessage = result.debugMessage.trim().take(160).takeIf { it.isNotEmpty() }
    }

    private fun updateEntitlementPresentation() {
        entitlement.updateBillingPresentation(
            EntitlementManager.BillingPresentation(
                ready = connected,
                canPurchase = connected && productAvailable && !entitlement.isPlayOwnedCached() && !purchasePending,
                productAvailable = productAvailable,
                purchasePending = purchasePending,
                status = status,
                formattedPrice = formattedPrice,
                lastResponseCode = lastResponseCode,
                lastSyncAtMs = lastSyncAtMs,
            ),
        )
    }

    private fun publish() {
        updateEntitlementPresentation()
        try { onStateChanged() } catch (_: Throwable) { }
    }

    private fun responseStatus(code: Int): String = when (code) {
        BillingClient.BillingResponseCode.OK -> "ready"
        BillingClient.BillingResponseCode.USER_CANCELED -> "cancelled"
        BillingClient.BillingResponseCode.SERVICE_UNAVAILABLE -> "service_unavailable"
        BillingClient.BillingResponseCode.BILLING_UNAVAILABLE -> "billing_unavailable"
        BillingClient.BillingResponseCode.ITEM_UNAVAILABLE -> "product_unavailable"
        BillingClient.BillingResponseCode.DEVELOPER_ERROR -> "configuration_error"
        BillingClient.BillingResponseCode.ERROR -> "error"
        BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> "already_owned"
        BillingClient.BillingResponseCode.ITEM_NOT_OWNED -> "not_owned"
        BillingClient.BillingResponseCode.SERVICE_DISCONNECTED -> "disconnected"
        BillingClient.BillingResponseCode.NETWORK_ERROR -> "network_error"
        else -> "billing_error_$code"
    }

    private fun isDebugOverrideFree(): Boolean {
        val state = entitlement.stateJsonObject()
        return state.optString("source") == "debug_override" && !state.optBoolean("isPro", false)
    }

    private fun accepted(reason: String): String = JSONObject().apply {
        put("accepted", true)
        put("reason", reason)
        put("state", stateJsonObject())
    }.toString()

    private fun rejected(reason: String): String = JSONObject().apply {
        put("accepted", false)
        put("reason", reason)
        put("state", stateJsonObject())
    }.toString()

    override fun onActivityResumed(activity: Activity) {
        if (activity === activityRef.get()) refresh()
    }

    override fun onActivityDestroyed(activity: Activity) {
        if (activity !== activityRef.get()) return
        try { billingClient.endConnection() } catch (_: Throwable) { }
        try { application.unregisterActivityLifecycleCallbacks(this) } catch (_: Throwable) { }
        activityRef.clear()
    }

    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) = Unit
    override fun onActivityStarted(activity: Activity) = Unit
    override fun onActivityPaused(activity: Activity) = Unit
    override fun onActivityStopped(activity: Activity) = Unit
    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) = Unit

    companion object {
        const val BILLING_LIBRARY_VERSION = "9.1.0"
    }
}
