package com.benedictinteractive.bearagnostic

/**
 * Non-secret endpoint configuration for Benedict server commerce.
 *
 * K3 intentionally ships fail-closed: keep BASE_URL empty until the Benedict
 * Cloudflare backend host has been selected and K1/K2 is deployed. Secrets never
 * belong in this file or in the APK.
 */
object CommerceConfig {
    const val BASE_URL = ""
    const val PRODUCT_CODE = "bearagnostic_pro_lifetime"

    fun normalizedBaseUrl(): String {
        val value = BASE_URL.trim().trimEnd('/')
        return if (value.startsWith("https://")) value else ""
    }

    fun isConfigured(): Boolean = normalizedBaseUrl().isNotEmpty()
}
