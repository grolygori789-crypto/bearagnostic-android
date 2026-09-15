# Bearagnostic Android — Ko-fi / Benedict Server Entitlement K3

**Baseline:** `c0a3cc16f9da293778cdf884ff0638e3d7cce15c`

K3 adds a second trusted ownership source to the existing `EntitlementManager` without removing Google Play Billing.

Priority remains:

1. Debug override (Debug only)
2. Billing Sandbox (Debug only)
3. Benedict server entitlement
4. Google Play cached ownership
5. Free

## Fail-closed configuration

`CommerceConfig.BASE_URL` is intentionally empty in this package.

After K1/K2 has been deployed to the correct Cloudflare host, set it to that **HTTPS** Benedict backend origin and rebuild the alpha. Do not put secrets in the APK.

## Flow

- Pro surface detects that Benedict server commerce is configured.
- User enters the email they will use on Ko-fi.
- App starts Benedict OTP verification.
- After the 6-digit code is verified, backend returns an opaque purchase-session token, device credential and Ko-fi Shop URL.
- App stores the pending secrets encrypted with Android Keystore AES-GCM and opens Ko-fi.
- App polls only the Benedict backend; it never trusts the Ko-fi browser redirect.
- Verified Ko-fi webhook creates the entitlement and matching device binding.
- App receives `active`, stores a seven-day server lease encrypted with Android Keystore, and `EntitlementManager` unlocks all existing Pro gates.
- Restore Pro verifies the purchase email and rotates a device credential without a Bearagnostic password account.

## Offline behavior

A server-confirmed entitlement is cached locally only for the lease window returned by Benedict. The credential/lease blob is AES-GCM protected by an AndroidKeyStore key. When online, the app renews/refreshes from Benedict. If the lease expires without server confirmation, server-derived Pro access fails closed; Google Play ownership (if any) remains an independent valid source.

## Important

The package does not enable real commerce by itself. K1/K2 must be deployed/configured, `CommerceConfig.BASE_URL` must point to the correct host, Ko-fi/OTP secrets must remain server-side, and controlled end-to-end QA is required before real sales.
