# Bearagnostic B48 — Billing Sandbox QA

## Purpose

B48 provides a **debug-only dual-sided billing simulator** for the one-time Bearagnostic Pro product (`bearagnostic_pro_lifetime`). It is designed to validate Bearagnostic's purchase UX, entitlement transitions, restore behavior, pending payments, failure recovery, refund/revocation handling, and acknowledgement behavior before Google Play Internal Testing is configured.

It does **not** contact Google Play and cannot charge real money.

## Developer Mode

1. Open **More**.
2. Tap the build/version text inside **About Bearagnostic** seven times.
3. `Developer Tools` appears in More.
4. Open it to access the **Billing QA Console**.

Developer Mode enables the Sandbox Store provider. Disabling Developer Mode disables the sandbox entitlement provider and returns the Pro purchase UI to the real Google Play path.

## Two linked sides

### Customer side

Use the normal **Bearagnostic Pro** purchase surface. The customer sees product, test-localized price, a clearly labelled test checkout, simulated payment method, Pending/Processing/Success/Failure states, Restore, and the resulting Pro access.

The customer side cannot directly choose Success or Failure. Store behavior is controlled from the owner console so the purchase flow remains realistic.

### Owner / Store side

The Billing QA Console provides:

- mock product/market pricing (TH / US / JP / EU / BR);
- Store availability;
- Online / Slow / Offline network conditions;
- Approve / Pending / Decline / Approve-then-chargeback payment behavior;
- Acknowledgement Success / Fail once / Always fail;
- manual Pending approval or cancellation;
- ownership resync;
- local-entitlement clear;
- reinstall simulation;
- refund without revocation;
- refund plus revocation;
- direct revocation;
- chargeback / voided purchase;
- simulated three-day unacknowledged purchase refund/revocation;
- transaction ledger;
- event timeline.

## Source-of-truth model

The Sandbox Store ledger and Bearagnostic's local entitlement cache are intentionally separate.

`Sandbox Store ownership -> ownership query / purchase update -> EntitlementManager -> Pro capability gates`

This separation lets QA verify cases where the Store owns the product but the local app cache is empty, such as restore or reinstall scenarios.

## Required acceptance matrix

| Scenario | Store state | App entitlement | Expected customer result |
| --- | --- | --- | --- |
| Immediate approval | PURCHASED | PRO | Pro unlocks only after PURCHASED |
| Pending | PENDING | FREE | No Pro until Store confirms payment |
| Pending approved | PURCHASED | PRO | Pro unlocks after owner-side confirmation |
| Pending declined | CANCELED | FREE | Purchase ends without Pro |
| Customer cancel | No purchase | FREE | No Pro |
| Offline | No completed purchase | unchanged/FREE | Clear network failure state |
| Already owned / restore | PURCHASED | PRO after sync | Ownership restored without repurchase |
| Clear local entitlement | Store still owns | FREE | Demonstrates cache/store separation |
| Restore after local clear | Store owns | PRO | Pro restored from mock Store |
| Simulated reinstall | Store owns | PRO after startup query | Ownership automatically restored |
| Ack fails once | PURCHASED | PRO | Pro remains; acknowledgement retry succeeds |
| Ack always fails | PURCHASED | PRO | `owned_ack_pending`; manual retry remains testable |
| 3-day ack deadline | VOIDED | FREE | Auto-refund/revoke simulation |
| Refund only | PURCHASED/refunded | PRO | Access retained by explicit Store policy |
| Refund + revoke | VOIDED | FREE | Pro removed |
| Revoke | VOIDED | FREE | Pro removed |
| Chargeback | VOIDED | FREE | Pro removed |

## Release isolation

The state-machine implementation is under `app/src/debug/.../DebugBillingSandbox.kt`; it is not part of the release source set. Main-code discovery is debug-gated and reflective. CI builds a release APK and checks that the debug sandbox class descriptor and debug ledger preference namespace are absent from release DEX.

Before public Play Store release, the remaining inert QA presentation hooks should also be stripped during final release hardening, then real Google Play Internal Testing must validate ProductDetails, purchase sheet, license tester behavior, account ownership, pending purchases, refunds/voids, and real Play lifecycle callbacks.
