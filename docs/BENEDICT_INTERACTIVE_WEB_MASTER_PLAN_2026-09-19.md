# Benedict Interactive Web — Master Plan

**Document:** Canonical Project Master Plan  
**Revision:** 8.0  
**Revision date:** 19 September 2026  
**Repository:** `grolygori789-crypto/benedict-interactive-web`  
**Default branch:** `main`  
**Product authority:** P'Benz / Benedict Interactive  
**Full Authorized DEV / Product-Design-Engineering Partner:** Biew (บิ๊ว)  
**Current inspected repository `main`:** `30779427766ec220b0d5ffcb3081f58937f71a4f` — `Update commerce hardening checkpoint`  
**Cross-repo Android main inspected:** `0acacf1077a305888a615c54e0e24b1fb32b272d` — `Add release isolation workflow`  
**Project status:** Pre-launch. Core payment/entitlement trust chain and real-email Restore have physical evidence. Public commerce remains disabled. Release-isolation physical proof, production signing, final customer-journey polish/legal/support, production transition and distribution remain unfinished.

---

# 0. PURPOSE / NORTH STAR / CURRENT PRIORITY

This file is the canonical product, brand, website, commerce, security, legal, support, distribution, QA and cross-repo Bearagnostic integration plan for Benedict Interactive.

Permanent principles:

> **Premium enough to feel world-class; simple enough for one person to run well.**

> **Independent by default. Stores by choice.**

> **เร็วแต่ตรวจไม่ครบ = ยังไม่เสร็จ**

Current product-critical path:

`trusted payment → Benedict server entitlement → verified app entitlement → Bearagnostic Pro → safe Restore → production-signed distribution`

Public commerce remains fail-closed until final gates are complete.

---

# 1. AUTHORITY / COMMUNICATION / CONFLICT ORDER

P'Benz is final Product Authority, legal/brand/business owner and final approver.

Biew is female Full Authorized DEV / Product-Design-Engineering partner. Thai self-reference `บิ๊ว`, address `พี่เบนซ์`, feminine endings only.

Conflict order:

1. latest explicit P'Benz instruction;
2. latest GitHub `main`;
3. this Master Plan;
4. `docs/REPOSITORY_MAP.md` / commerce runbook;
5. approved assets/current browser/device evidence;
6. Git history;
7. older conversation context.

Do not let stale docs override production truth.

---

# 2. GITHUB / FILE / QA CONTRACT

Before substantive work: inspect latest main, read Master Plan, Repo Map, relevant runbook/source, establish rollback, define allowlist, identify regression risk, implement minimally, validate honestly.

No remote GitHub mutation without same-turn explicit authorization.

Evidence types are separate: Source PASS, Build PASS, CI PASS, Browser Runtime PASS, Physical-device PASS, NOT TESTED.

Every GitHub-bound handoff includes canonical paths, rollback, actual QA, unverified items, fallback, checksum when practical and <=50-character commit name.

For `.github/...` hidden paths, expect P'Benz may need GitHub Create-file/manual edit rather than upload.

---

# 3. BRAND / WEBSITE DIRECTION — RETAINED

Benedict Interactive is the official parent independent software studio, product showroom, support home and distribution authority.

Brand line: `Ideas for a brighter everyday`.

Visual language: `Bright Humanist Computing` — porcelain/white, graphite/navy, Benedict blue/cyan, restrained violet/amber/green, generous whitespace and editorial clarity. Macintosh inspiration = spirit only, never copied trade dress.

Founder Hero approved copy/assets and the rejected founder-sun experiment remain frozen unless explicitly reopened.

Public website must remain a Benedict studio site, not a Bearagnostic microsite wearing a parent logo.

---

# 4. COMMERCIAL MODEL / PAYMENT SURFACE

Bearagnostic Pro:

- `bearagnostic_pro_lifetime`;
- one-time lifetime entitlement;
- production price **249 THB** (`24900` minor units);
- **Ko-fi only** payment surface;
- no direct Benedict Stripe/PromptPay checkout;
- no subscription.

Canonical trust chain:

`Ko-fi verified Shop Order webhook → Benedict payment ledger → lifetime entitlement → verified installation/device → Bearagnostic Pro`

Never trust screenshots, redirect flags, client `isPro`, transfer references or admin guesses.

---

# 5. CURRENT DOMAIN / BACKEND / EMAIL FOUNDATION

Canonical production domain:

`https://benedictinteractive.com`

D1 database:

`benedict-commerce-prod`

Canonical product row remains Ko-fi item `045b85db99`, URL `https://ko-fi.com/s/045b85db99`, currency THB, current production amount `24900`, active controlled-test product.

Resend sender remains:

`Benedict Interactive <no-reply@benedictinteractive.com>`

Existing domain/DNS/D1/Resend/Ko-fi mapping and commerce hardening #1–#25 are Frozen PASS. Do not repeat merely because docs changed.

---

# 6. CURRENT CLOUDFLARE COMMERCE STATE

Current controlled test state:

```text
BENEDICT_COMMERCE_PUBLIC_ENABLED = false
BENEDICT_COMMERCE_TEST_MODE = true
BENEDICT_PUBLIC_ORIGIN = https://benedictinteractive.com
BENEDICT_EMAIL_PROVIDER = resend
BENEDICT_EMAIL_FROM = Benedict Interactive <no-reply@benedictinteractive.com>
BENEDICT_EMAIL_TEST_DELIVERY = true
BENEDICT_EMAIL_TEST_RECIPIENT = [SECRET / ALLOWLIST]
BENEDICT_OTP_TEST_CODE = absent / removed
```

Secret keys/tokens remain server-side and must never be requested in chat.

In TEST MODE only the allowlisted recipient gets a live Resend OTP. Other recipients produce `delivery=test` / `dispatch_status=test`. The app can still show `Verify your email` because a challenge was created; that UI state alone does **not** prove delivery. With the static test code removed, live-delivery challenges use fresh random OTPs.

Operational rules for controlled testing:

- Cloudflare secret values may require delete/recreate rather than in-place editing; after any environment change, wait for a **successful deployment** before testing against it.
- Identity challenge throttling is currently **5 challenges per 15-minute rolling window** when either the same email identity or installation matches. Avoid repeated OTP requests that only consume the rate limit.

---

# 7. LIVE COMMERCE PROOF — UPDATED 18 SEP

A controlled real-money Ko-fi Shop Order was performed at a temporary **10 THB** price to prove the live trust chain. Ko-fi webhook processing created real payment and active entitlement truth.

The temporary price was then restored and D1 product mapping rechecked at **249 THB / 24900**.

The live entitlement initially stayed unclaimed because app email did not match the actual Ko-fi checkout email. Backend correctly refused to guess across identities.

Android added `Restore paid purchase` recovery using the actual checkout email. Recovery + real OTP now works on physical hardware.

Do not misstate the earlier proof as an exact-price 249 THB real purchase; it was a temporary 10 THB live proof.

---

# 8. REAL EMAIL / RESTORE AFTER REINSTALL — PASS

P'Benz physically tested:

`uninstall app → reinstall → Restore with real Ko-fi checkout email → real OTP delivered → verify → Pro restored`

D1 latest proof showed:

- `purpose=restore`;
- `dispatch_status=sent`;
- non-null verified timestamp.

Therefore server entitlement persistence + live email Restore after reinstall is Physical-device PASS.

This customer truth must appear in website/App copy: lifetime entitlement survives uninstall/reinstall and device change; recovery uses the same checkout/purchase email + OTP.

---

# 9. PURCHASE / RESTORE CUSTOMER FLOW

Current Android runtime has separate Purchase / Restore actions and a paid-purchase recovery path.

Current safe behavior:

- Purchase email + OTP → purchase session → Ko-fi only when payment is needed → webhook/ledger → Pro;
- Restore email + OTP → existing active entitlement → device binding/credential → Pro;
- paid purchase with different checkout email → recovery Restore using that checkout email;
- ambiguity is never guessed.

Previously approved simplification remains unresolved: **Email + OTP first → server decides Buy vs Restore automatically**. Resolve before public launch unless P'Benz explicitly approves retaining the separate flow after final UX review.

---

# 10. FINAL WEBSITE CUSTOMER JOURNEY — REQUIRED

After system/release blockers are stable, perform one deliberate final website polish pass.

Bearagnostic product/download experience must cover:

- official product positioning and privacy/safety promise;
- Free vs Pro truth without invented features;
- Lifetime Pro, 249 THB, no subscription;
- `Upgrade to Pro` journey;
- how purchase works;
- what happens after Ko-fi checkout;
- which email matters;
- how to Restore Pro;
- paid-but-not-unlocked recovery;
- app-email vs checkout-email mismatch;
- OTP troubleshooting;
- uninstall/reinstall and device-change recovery;
- official APK download;
- current version + release notes/changelog;
- install/update guidance;
- checksum/authenticity information where appropriate;
- support and legal links.

Keep IA simple: `Products → Bearagnostic → Upgrade to Pro`; do not create a giant generic pricing site for one product.

---

# 11. APP + WEB + KO-FI COPY MUST MATCH

Final polish is cross-surface, not isolated poster work.

All three surfaces must agree on:

- product name and 249 THB price;
- Lifetime / no subscription;
- purchase email identity;
- OTP verification;
- Ko-fi as payment surface;
- Restore with checkout email;
- paid-but-not-unlocked recovery;
- uninstall/reinstall/device-change entitlement persistence;
- support path;
- refund/reversal consequences;
- no fake automation promises.

After purchase, tell customers to retain access to the checkout email because it is the durable Restore identity.

---

# 12. KO-FI PUBLIC-LAUNCH POLISH

Before public sale, inspect actual Ko-fi Shop state and polish:

- professional product cover/asset;
- exact 249 THB price;
- one-time Lifetime / no subscription;
- activation steps;
- same-checkout-email Restore instruction;
- post-purchase message telling buyer to retain email access;
- support route;
- concise refund/purchase terms consistent with Benedict legal copy;
- public/Draft state explicitly rechecked.

Do not assume old publication state.

---

# 13. FAQ / Q&A — REQUIRED BEFORE LAUNCH

Static/help FAQ/Q&A is part of launch polish and is not the same thing as the larger after-sales ticket platform.

Minimum questions:

1. What is Bearagnostic Pro?
2. Is it lifetime or subscription?
3. What does it cost?
4. How do I buy it?
5. Which email do I enter before purchase?
6. Which email do I use for Restore?
7. What if Ko-fi used a different email?
8. What if I paid but Pro did not unlock?
9. What if I do not receive an OTP?
10. Does uninstall/reinstall remove Pro?
11. What happens when I change device?
12. How do I Restore Pro?
13. What happens after a refund/reversal/dispute?
14. What is the refund policy?
15. Where do I contact support?
16. Where do I get the official APK/update and how do I verify it?

The full Ticket / Case Number / after-sales management system remains deferred until core commerce is production-ready.

---

# 14. SUPPORT / BRANDED EMAIL

Current public fallback support email remains `benedict.support@gmail.com` until branded inbound routing and reply identity are actually proven.

Approved target:

`support@benedictinteractive.com`

Before replacing public copy:

- inbound routing must work;
- support email must reach the intended mailbox;
- reply-from identity/process must be deliberate and proven;
- transactional `no-reply@benedictinteractive.com` remains separate.

---

# 15. REFUND / LEGAL / PRIVACY COPY

Required policy direction:

- Lifetime digital entitlement;
- generally non-refundable after successful activation;
- exceptions include duplicate charge, entitlement not delivered/unresolvable, or applicable law;
- refunded/reversed/disputed entitlement may be revoked;
- never say `No refunds under any circumstances`;
- never remove mandatory consumer rights.

Public Privacy/Terms/License/purchase/refund/revoke/dispute copy must match actual Ko-fi + Benedict + email/OTP behavior and retention/minimization practices.

Founder privacy remains a mandatory real-checkout review: inspect buyer-visible merchant/contact identity, payment method, receipt/email and processor descriptor.

---

# 16. ANDROID RELEASE CROSS-PROJECT STATE

Android main: `0acacf1077a305888a615c54e0e24b1fb32b272d`.

Release-Isolation workflow run #1 / ID `35368006094` succeeded. P'Benz downloaded the artifact; physical device verification is still pending.

Debug and Release are separate lanes:

- Debug package `.debug` retains QA controls;
- Release package has customer behavior and must contain no usable debug grant path.

The current Release-Isolation APK is test-signed, not for customers. Production signing remains unfinished.

---

# 17. WEBSITE DISTRIBUTION / UPDATE RESPONSIBILITY

Benedict official website is a canonical customer distribution source for the production-signed APK.

Before launch website must publish/maintain:

- exact production-signed APK;
- version/release notes;
- clear installation/update instructions;
- checksum/authenticity info when appropriate;
- support/legal links;
- no silent-install promise.

Customer distribution is Benedict website + Uptodown, not Google Play.

Benedict should remain the canonical source of official version, download, support and licensing truth even when Uptodown mirrors distribution.

---

# 18. REMAINING LAUNCH PATH

Do only unfinished/new work:

1. physical Android Release-Isolation proof;
2. production signing + permanent key custody/backup;
3. production-signed Release APK verification + physical install proof;
4. App/Web/Ko-fi final customer-journey polish;
5. FAQ/Q&A + branded support + legal/refund/revoke/dispute closure;
6. official website download/version/changelog/checksum path;
7. FK-safe cleanup of synthetic QA records after evidence no longer needed;
8. disable/remove test-only OTP/email overrides and exit TEST MODE;
9. final controlled public-commerce enablement;
10. final production smoke: real OTP + purchase/restore + webhook/payment ledger + entitlement + Pro;
11. because earlier real-money proof used 10 THB, exact **249 THB** clean-identity live purchase is the strongest final proof if P'Benz approves the charge; otherwise record a deliberate risk exception;
12. final website download/install proof + Uptodown listing/binary verification;
13. final support/legal/customer-copy/no-Dev/version/signature readiness review;
14. public launch + post-launch monitoring.

Do not repeat Frozen #1–#25.

---

# 19. SYNTHETIC QA DATA CLEANUP

Controlled QA data remains in production D1, including provider events, anomalies, payments, entitlements, identity challenges and sessions.

Do not casually delete rows. Cleanup must be deliberate and FK-safe after evidence is no longer required.

Never delete the real active entitlement needed for Restore testing unless P'Benz explicitly decides to retire that test entitlement.

---

# 20. SEARCH / PERFORMANCE / ACCESSIBILITY / PRIVACY

Retain static-first, fast, accessible, responsive website quality. Before public launch deliberately review indexing/canonical/sitemap/hreflang/social assets/locale/legal links rather than adding SEO cosmetics prematurely.

Avoid unnecessary third-party scripts, heavy libraries, giant font bundles and decorative network work.

Maintain semantic HTML, keyboard/focus, contrast, touch targets, reduced motion, responsive typography, correct language/direction and no horizontal overflow.

Custom analytics must not fingerprint or collect unnecessary identifiers. No fake reviews/install counts.

---

# 21. OPERATIONAL BACKLOG

GitHub Actions artifact downloads around 22 MB have taken minutes on both PC and mobile despite fast internet. Customer downloads must not use Actions artifacts. After release blockers, investigate a faster internal QA build-delivery path without exposing production signing secrets.

A Cloudflare build stalled once at `npm install`; retry succeeded. Repeated same-stage stalls should trigger build/runner investigation, not endless retries.

Windows Defender previously flagged a JS-containing handoff ZIP heuristically. Do not tell users to disable antivirus. Keep handoffs minimal/canonical and reduce suspicious script patterns where feasible.

---

# 22. CLOSED / DO-NOT-REGRESS DECISIONS

- Ko-fi only; no direct Benedict Stripe/PromptPay checkout.
- 249 THB lifetime; no subscription.
- public commerce stays off until launch gates.
- no fake admin payment override.
- no fake reviews/analytics/install claims.
- no cookie banner for appearance.
- no founder-sun experiment.
- do not re-run domain/DNS/D1/Resend/Ko-fi hardening without regression evidence.
- do not ask for secret values in chat.
- hardening #1–#25 Frozen PASS; no invented #26.
- `/api/commerce/sessions/status` remains POST-only; old GET 405 was a QA-method mistake.
- Ticket/Case management platform deferred until commerce is production-ready.
- customer Restore/reinstall/device-change/purchase-email instructions are mandatory final-polish content.

---

# 23. NEXT-ROOM STARTUP

At new-room start:

1. read current Room Migration prompt;
2. inspect latest web + Android main;
3. read this plan + Android plan + Repo Map/runbook;
4. preserve Frozen #1–#25;
5. first determine whether Release-Isolation physical proof has been completed;
6. continue only from the first unfinished item in Section 18;
7. never make P'Benz reconstruct commerce, Restore, signing or customer-polish requirements from memory.

---

# 24. FINAL OPERATING PRINCIPLE

Benedict Interactive should remain technically serious without becoming needlessly complex.

Choose the smallest coherent architecture that preserves truth, security, customer clarity, maintainability and future readiness.

**End of Revision 8.0**
