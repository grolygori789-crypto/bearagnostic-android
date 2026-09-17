# Bearagnostic Pro Debug Bridge V3

This fixes the actual testing problem shown in the screenshot.

The payment card saying “Waiting for payment confirmation” is the **real Ko-fi production path**.
Pressing “Check again” cannot unlock Pro without a verified Ko-fi order.

V3 restores the already-designed Developer Entitlement Test inside the SAME Bearagnostic Pro sheet:

- Debug build: `Test as PRO`, `Test as FREE`, `Reset`
- No ADB
- No second launcher
- No second app
- No change to the frozen `android-pro-ui.js`
- Release build: debug controls are not rendered because `BuildConfig.DEBUG == false`
- Release bridge rejects debug entitlement changes even if called directly

Reset removes only the debug override and returns to the real Benedict/Ko-fi entitlement state.
