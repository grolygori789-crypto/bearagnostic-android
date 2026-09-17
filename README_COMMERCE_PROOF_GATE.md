# Bearagnostic Commerce Proof-Gated Patch

Base: `6a435c81e64b97ee71991ebaccc6943604bf18d2`

Frozen package previously confirmed to open:
`8850ce748792167b5fe5f4d13ad11ecc759606e4e2e09b9d82b7d16a5071bdc3`

## This patch changes only NEW commerce scope

- Production `android-billing.js`: Ko-fi/Benedict purchase + restore UI, dormant until the existing Pro sheet is opened.
- Debug-only `CommerceQaActivity`: separate QA launcher for synthetic success/pending/fail/restore/offline/refund/revoke/chargeback states without real payment.
- Debug-only manifest entry.
- Automated source + APK verifier.
- Fail-closed CI workflow that builds both Debug and Release and proves release APK excludes the QA activity.

## Frozen and NOT included

- `MainActivity.kt`
- `android-pro-ui.js`
- `android-entitlement.js`
- logos / Dr.Bear / startup visuals
- Home/navigation/scan/review/cleanup adapters

## Manual QA policy

Previously passed work is frozen. Do not ask the user to manually retest it.
Only NEW commerce/Pro behavior may be manually exercised.

## Release rule

Do not distribute a Release APK unless `Verify Release Commerce` passes.


## V2 launcher regression fix

`CommerceQaActivity` is debug-only and deliberately has **no MAIN/LAUNCHER intent filter**.
Opening Bearagnostic normally must continue to launch the existing production `MainActivity`.
The QA activity can only be opened explicitly for developer testing.
