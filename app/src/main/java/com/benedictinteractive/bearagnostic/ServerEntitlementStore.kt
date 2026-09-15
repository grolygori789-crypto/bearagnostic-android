package com.benedictinteractive.bearagnostic

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import org.json.JSONObject
import java.security.KeyStore
import java.util.UUID
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/**
 * Keystore-backed local storage for server-issued commerce credentials and the
 * short offline entitlement lease. AES-GCM gives confidentiality + integrity;
 * SharedPreferences never contains the device credential/session token in plaintext.
 */
class ServerEntitlementStore(context: Context) {
    data class ActiveLease(
        val entitlementId: String,
        val deviceCredential: String,
        val verifiedAtMs: Long,
        val leaseUntilMs: Long,
    )

    data class PendingPurchase(
        val sessionToken: String,
        val deviceCredential: String,
        val expiresAtMs: Long,
    )

    private val appContext = context.applicationContext
    private val preferences = appContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun installationId(): String {
        val existing = preferences.getString(KEY_INSTALLATION_ID, null)?.takeIf { it.length in 16..160 }
        if (existing != null) return existing
        val created = "inst_${UUID.randomUUID()}"
        preferences.edit().putString(KEY_INSTALLATION_ID, created).apply()
        return created
    }

    fun savePending(sessionToken: String, deviceCredential: String, expiresAtMs: Long) {
        val json = JSONObject().apply {
            put("sessionToken", sessionToken)
            put("deviceCredential", deviceCredential)
            put("expiresAtMs", expiresAtMs)
        }
        putSealed(KEY_PENDING, json.toString())
    }

    fun loadPending(nowMs: Long = System.currentTimeMillis()): PendingPurchase? {
        val raw = getSealed(KEY_PENDING) ?: return null
        return try {
            val json = JSONObject(raw)
            val value = PendingPurchase(
                sessionToken = json.optString("sessionToken"),
                deviceCredential = json.optString("deviceCredential"),
                expiresAtMs = json.optLong("expiresAtMs", 0L),
            )
            if (value.sessionToken.length < 32 || value.deviceCredential.length < 32 || value.expiresAtMs <= nowMs) {
                clearPending()
                null
            } else value
        } catch (_: Exception) {
            clearPending()
            null
        }
    }

    fun clearPending() {
        preferences.edit().remove(KEY_PENDING).apply()
    }

    fun saveActive(entitlementId: String, deviceCredential: String, verifiedAtMs: Long, leaseUntilMs: Long) {
        val json = JSONObject().apply {
            put("entitlementId", entitlementId)
            put("deviceCredential", deviceCredential)
            put("verifiedAtMs", verifiedAtMs)
            put("leaseUntilMs", leaseUntilMs)
        }
        putSealed(KEY_ACTIVE, json.toString())
    }

    fun loadActive(nowMs: Long = System.currentTimeMillis()): ActiveLease? {
        val raw = getSealed(KEY_ACTIVE) ?: return null
        return try {
            val json = JSONObject(raw)
            val value = ActiveLease(
                entitlementId = json.optString("entitlementId"),
                deviceCredential = json.optString("deviceCredential"),
                verifiedAtMs = json.optLong("verifiedAtMs", 0L),
                leaseUntilMs = json.optLong("leaseUntilMs", 0L),
            )
            if (value.entitlementId.length < 12 || value.deviceCredential.length < 32 || value.leaseUntilMs <= nowMs) {
                clearActive()
                null
            } else value
        } catch (_: Exception) {
            clearActive()
            null
        }
    }

    fun clearActive() {
        preferences.edit().remove(KEY_ACTIVE).apply()
    }

    private fun putSealed(key: String, plain: String) {
        try {
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.ENCRYPT_MODE, secretKey())
            val encrypted = cipher.doFinal(plain.toByteArray(Charsets.UTF_8))
            val iv = Base64.encodeToString(cipher.iv, Base64.NO_WRAP or Base64.URL_SAFE)
            val data = Base64.encodeToString(encrypted, Base64.NO_WRAP or Base64.URL_SAFE)
            preferences.edit().putString(key, "v1.$iv.$data").apply()
        } catch (_: Exception) {
            preferences.edit().remove(key).apply()
        }
    }

    private fun getSealed(key: String): String? {
        val value = preferences.getString(key, null) ?: return null
        return try {
            val parts = value.split('.')
            if (parts.size != 3 || parts[0] != "v1") return null
            val iv = Base64.decode(parts[1], Base64.NO_WRAP or Base64.URL_SAFE)
            val encrypted = Base64.decode(parts[2], Base64.NO_WRAP or Base64.URL_SAFE)
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.DECRYPT_MODE, secretKey(), GCMParameterSpec(128, iv))
            String(cipher.doFinal(encrypted), Charsets.UTF_8)
        } catch (_: Exception) {
            preferences.edit().remove(key).apply()
            null
        }
    }

    private fun secretKey(): SecretKey {
        val keyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        val existing = keyStore.getKey(KEY_ALIAS, null) as? SecretKey
        if (existing != null) return existing
        val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
        generator.init(
            KeyGenParameterSpec.Builder(
                KEY_ALIAS,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT,
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build(),
        )
        return generator.generateKey()
    }

    companion object {
        private const val PREFS_NAME = "bearagnostic_server_commerce"
        private const val KEY_INSTALLATION_ID = "installation_id"
        private const val KEY_PENDING = "pending_purchase_sealed"
        private const val KEY_ACTIVE = "active_entitlement_sealed"
        private const val KEY_ALIAS = "bearagnostic_server_commerce_v1"
        private const val TRANSFORMATION = "AES/GCM/NoPadding"
    }
}
