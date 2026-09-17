package com.benedictinteractive.bearagnostic

/**
 * Non-secret endpoint configuration for Benedict server commerce.
 *
 * Production server commerce connects only to the canonical HTTPS Benedict origin.
 * Secrets never belong in this file or in the APK.
 */
object CommerceConfig {
    const val BASE_URL = "https://benedictinteractive.com"
    const val PRODUCT_CODE = "bearagnostic_pro_lifetime"

    fun normalizedBaseUrl(): String {
        val value = BASE_URL.trim().trimEnd('/')
        return if (value.startsWith("https://")) value else ""
    }

    fun isConfigured(): Boolean = normalizedBaseUrl().isNotEmpty()
}
