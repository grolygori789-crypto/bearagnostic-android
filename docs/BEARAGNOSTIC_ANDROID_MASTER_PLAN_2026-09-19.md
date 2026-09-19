# BEARAGNOSTIC ANDROID MASTER PLAN

**Repository:** `grolygori789-crypto/bearagnostic-android`  
**Canonical file:** `docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`  
**Revision:** 7.0  
**Revision date:** 19 September 2026  
**Owner / Final Product Authority:** P'Benz  
**Studio / Publisher:** Benedict Interactive  
**Full Authorized DEV / Product & Technical Lead:** Biew (บิ๊ว)  
**Current inspected GitHub main:** `0acacf1077a305888a615c54e0e24b1fb32b272d` — `Add release isolation workflow`  
**Current Android version:** `0.35.31-alpha79`, `versionCode 79`, adapter/cache `v=79`  
**Current Debug CI:** run #116 / ID `35368005879` — SUCCESS  
**Current Release-Isolation CI:** run #1 / ID `35368006094` — SUCCESS  
**Supersedes:** Revision 6.1 while preserving all still-valid product, scanner, safety, UI, privacy, distribution and QA contracts.

---

# 0. PURPOSE / NORTH STAR / CURRENT STATUS

This is the canonical operating contract, product plan, engineering plan, safety contract, commerce/entitlement plan, release plan, QA contract and room-handoff source for Bearagnostic Android.

Permanent engineering North Star:

> **Simple architecture. Exceptional execution. Zero unnecessary complexity.**

Permanent product promise:

> **Find clutter. Explain the risk. Clean with confidence.**

Bearagnostic must remain truthful, calm, bright, premium, privacy-first, local-first and safety-first. Never trade trust for fake progress, fake health scores, fake scan depth, fake speed, fake entitlement or ornamental complexity.

Current status: commerce/entitlement and real-email Restore are proven on physical hardware; the next release blocker is physical verification of the new Release-Isolation artifact. Public customer release is not yet approved.

---

# 1. AUTHORITY / COMMUNICATION / CONFLICT ORDER

P'Benz is final Product Authority, legal/brand/business owner and final approver.

Biew is female Full Authorized DEV / Product & Technical Lead. In Thai: self-reference `บิ๊ว`, address `พี่เบนซ์`, feminine endings only.

Conflict order:

1. latest explicit P'Benz instruction;
2. latest GitHub `main`;
3. this Master Plan;
4. current Room Migration / Immigration Prompt;
5. approved assets + current physical evidence;
6. repository history;
7. older chat/screenshots/caches.

Do not make P'Benz reconstruct project memory.

---

# 2. GITHUB / FILE HANDOFF / QA TRUTH

Before substantive work: inspect latest main, read this plan, inspect exact source/workflows, establish rollback SHA, define changed-file allowlist, identify regression risk, implement the minimum necessary change, validate honestly, package canonical repo paths.

Remote GitHub mutation is forbidden unless explicitly authorized in the same turn.

Evidence labels remain distinct: Static/Source PASS, Local Build PASS, CI PASS, Runtime Simulation PASS, Physical-device PASS, NOT TESTED.

GitHub-bound handoff requires clickable artifact, allowlist, canonical paths, rollback baseline, actual QA, unverified items, fallback, SHA-256 when practical and a <=50-character commit name in a fenced block.

Packages contain only required files; no README/QA-report/scratch/final/v2/backup clutter.

For `.github/...` or other hidden-dot paths, P'Benz may need GitHub **Create new file** instead of upload. Plan handoff accordingly.

Do not advise disabling Windows Defender. Minimize suspicious JS patterns, preflight static strings and keep archives minimal.

---

# 3. FROZEN BASELINE / NO RETEST

Everything already accepted remains closed unless directly affected by new code or new regression evidence.

Commerce hardening **#1–#25 = Frozen PASS**. #24 = Purchase Session Token Boundary. #25 = Private Ops Access Gate. No authoritative #26 exists.

Do not re-run old Cloudflare/D1/Resend/Ko-fi/backend/scanner/UI/share-card tests simply because the room or documentation changed.

---

# 4. VERIFIED ANDROID SNAPSHOT / IMPORTANT COMMITS

Current main: `0acacf1077a305888a615c54e0e24b1fb32b272d`.

Important recent commerce commits:

- `f09b27e193abfb4d0e7b0c66fc38c62748226c1b` — checkout-email purchase recovery;
- `6fc152dafd2419ae460b292ed9c6fc526cddd68b` — protect OTP recovery from purchase polling;
- `0acacf1077a305888a615c54e0e24b1fb32b272d` — release-isolation workflow.

Technical baseline:

- release app ID `com.benedictinteractive.bearagnostic`;
- debug app ID `com.benedictinteractive.bearagnostic.debug`;
- compile/target SDK 36, min SDK 26, Java 17;
- Billing 9.1.0 remains optional/reference, not the launch payment path;
- release minification currently off; do not change late without a specific reason;
- pinned PWA commit remains `78a31c7752e171c0eafb63c0d0859f4072a193d6`;
- approved adapter/cache version remains 79.

---

# 5. PRODUCT / SCANNER / DELETION / UI INVARIANTS

Bearagnostic is a premium privacy-first file-health/cleaning assistant, never a RAM booster, CPU cooler, fake antivirus, registry cleaner, root cleaner, fear-based cleaner or unverifiable optimizer.

Never fabricate scan percentages, junk totals, virus counts, health scores, reclaimed bytes, speed improvements, undo, purchase state or trends.

Quick = metadata/deterministic rules, no content read, no duplicate hash.  
Smart = bounded real content sample + focused exact duplicate verification (`256 KiB`).  
Deep = full streaming readable-content work + exact duplicates where accessible.  
Custom = user-selected scopes; zero selected scopes never silently fall back.

Scanner remains read-only. Destructive path remains:

`Select → Review → Confirm → Delete → Verify → Summary`

Keep-one-copy for exact duplicates, stale-review guard, file delete cap, protected Android/data + Android/obb boundaries, truthful safety labels and verified reclaimed-byte accounting remain binding.

Preserve approved startup/Home/navigation/Dr.Bear/share-card visual/runtime baseline unless a real defect or explicit requirement appears.

---

# 6. FREE / PRO / COMMERCIAL MODEL

Free remains genuinely useful; essential safety stays free.

Pro:

- product code `bearagnostic_pro_lifetime`;
- one-time lifetime entitlement;
- price **249 THB** / `24900` minor units;
- no subscription;
- Ko-fi Shop only payment surface;
- no separate Pro APK architecture;
- EntitlementManager remains canonical capability truth.

No direct Benedict Stripe/PromptPay checkout. No fake admin `Mark Paid` / `Force Payment Success` / `Fake Webhook` path.

---

# 7. INDEPENDENT DISTRIBUTION / TWO BUILD LANES

Bearagnostic is **not** launching through Google Play Store.

Customer distribution:

1. Benedict Interactive website — production-signed Release APK;
2. Uptodown — same production-signed Release APK;
3. other stores only if explicitly approved later.

Keep two development lanes permanently:

### Debug / DEV

`com.benedictinteractive.bearagnostic.debug`

May expose Development Entitlement Test / Test FREE / Test PRO / Reset and QA tools. Never distribute to customers.

### Release / Customer behavior

`com.benedictinteractive.bearagnostic`

No visible Dev controls and no usable debug grant path. Final customer binary must use the permanent production signing key.

Both packages may coexist on a device.

---

# 8. COMMERCE / ENTITLEMENT TRUST CHAIN

Authoritative path:

`verified Ko-fi Shop Order → Benedict payment ledger → lifetime entitlement → verified installation/device credential → EntitlementManager → Pro`

Never trust screenshot, redirect, client flag or local isPro as payment truth.

Identity uses email + OTP. Current UI has Purchase, Restore and paid-purchase recovery. A previously approved target remains: **Email + OTP first, server decides Buy vs Restore automatically**. Resolve that UX gap before public launch unless P'Benz explicitly approves the separate flow after final review.

Offline ownership remains protected by bounded server lease/device credential storage using AndroidKeyStore-based protection.

---

# 9. REAL-MONEY / EMAIL-MISMATCH / RECOVERY TRUTH

A controlled real-money Ko-fi purchase was completed at a temporary **10 THB** test price. The verified Shop Order created payment/entitlement truth successfully. The product was then restored and rechecked at **249 THB**.

The purchase initially remained unclaimed because app email differed from Ko-fi checkout email. Backend correctly refused cross-identity guessing.

The app therefore added a recovery path:

`Already paid? → email used at Ko-fi checkout → Restore paid purchase`

This is required customer behavior and must remain available as long as the separate purchase flow can create this mismatch state.

---

# 10. OTP / POLLING REGRESSION — FIXED + PHYSICALLY PROVEN

Old purchase polling once overwrote the OTP phase during recovery Restore, destroying input focus and collapsing the keyboard.

Commit `6fc152d...` now makes identity verification own the phase while sending/entering/verifying OTP and cancels stale purchase polling when Restore begins. In-flight refresh/poll responses are guarded before mutating state.

Physical-device proof passed: OTP entry remained stable and Restore completed.

Do not reintroduce timer-driven UI rebuild while active email/OTP/recovery input has focus.

---

# 11. REAL-EMAIL RESTORE AFTER REINSTALL — PASS

Static `BENEDICT_OTP_TEST_CODE` was removed. With TEST MODE allowlisted live delivery, P'Benz performed:

`uninstall → reinstall → Restore using actual Ko-fi checkout email → receive random OTP by email → verify → Pro restored`

D1 showed `purpose=restore`, `dispatch_status=sent`, verified timestamp present.

This is Physical-device PASS and proves lifetime entitlement survives local app removal.

Customer copy must clearly state:

- uninstall/reinstall does not erase lifetime Pro;
- changing device does not erase server entitlement;
- use the same Ko-fi checkout/purchase email to Restore;
- OTP verifies ownership;
- retain access to the purchase email.

---

# 12. CURRENT TEST ENVIRONMENT

Current controlled QA state:

```text
BENEDICT_COMMERCE_PUBLIC_ENABLED = false
BENEDICT_COMMERCE_TEST_MODE = true
BENEDICT_EMAIL_TEST_DELIVERY = true
BENEDICT_EMAIL_TEST_RECIPIENT = [SECRET / ALLOWLIST]
BENEDICT_OTP_TEST_CODE = absent
```

Only the allowlisted test recipient gets a live email while TEST MODE is true. Other test recipients produce `dispatch_status=test`. A challenge may still advance the app to `Verify your email` when `dispatch_status=test`; that means the challenge exists, not that an email was sent.

Operational test rules:

- Cloudflare secret values may be non-editable in-place; delete/recreate only when necessary, then require a **successful deployment** before trusting the new environment value.
- Identity challenge throttling is currently **5 challenges within 15 minutes** when either the same email identity or installation matches; do not spam Purchase/Restore while testing.
- Never request stored secrets in chat.

---

# 13. RELEASE DEBUG ISOLATION — CURRENT BLOCKER

Workflow `.github/workflows/android-release-isolation.yml` exists on main and run #1 / `35368006094` succeeded.

It verifies source debug gates, assembles Release, test-signs for installability, verifies signature/application ID, checks `debuggable=false` and uploads report/checksum.

P'Benz has downloaded the artifact; **physical test remains pending**.

Required physical result: no Development Entitlement UI and no usable debug entitlement grant path.

The Release-Isolation key is test-only. The artifact must not be published.

Because the Release-Isolation app uses customer package ID with a test signature, later production-signed APK will normally require uninstalling this test-signed Release-Isolation app first. Debug app can remain installed.

---

# 14. FINAL APP POLISH — AFTER SYSTEM BLOCKERS

P'Benz ordered **system first, polish later**. After release isolation + signing are stable, perform one deliberate final App polish pass.

Customer Pro UI must clearly communicate:

- one-time Lifetime Pro / 249 THB / no subscription;
- purchase email + OTP;
- Restore email + OTP;
- email used at Ko-fi checkout is the recovery identity;
- paid-but-not-unlocked recovery;
- waiting/payment-confirmation state;
- OTP not received / incorrect / expired / rate-limited states;
- no active entitlement state;
- success state;
- reinstall/device-change restore;
- support/legal links where appropriate;
- no Developer wording in Release.

Resolve the unified Email+OTP server-decision UX gap before launch or record explicit P'Benz approval to keep the separate flow.

---

# 15. WEB / KO-FI / FAQ CUSTOMER EXPERIENCE — CROSS-REPO REQUIREMENT

Android launch is incomplete if the customer-facing website/Ko-fi instructions contradict the app.

Final cross-surface polish must include:

- Benedict product/download page with official signed APK, version, changelog and authenticity/checksum info;
- how to buy Pro;
- what happens after Ko-fi payment;
- how to Restore;
- what to do if Ko-fi used a different email;
- paid-but-not-unlocked recovery;
- uninstall/reinstall/device-change guidance;
- OTP troubleshooting;
- support contact;
- Privacy/Terms/License/Refund links;
- Ko-fi product cover/description/activation/post-purchase instructions aligned with the app.

FAQ/Q&A before launch must answer purchase, price, lifetime/subscription, email choice, OTP, Restore, email mismatch, reinstall/device change, refund/reversal, support and official download/update questions.

The larger Ticket/Case Number/after-sales platform remains deferred until core commerce is production-ready.

---

# 16. REFUND / LEGAL DIRECTION

Required customer-policy direction:

- lifetime digital entitlement;
- generally non-refundable after successful activation;
- exceptions: duplicate charge, entitlement not delivered/unresolvable, or applicable law;
- refund/reversal/dispute may revoke the corresponding entitlement;
- never write `No refunds under any circumstances`;
- preserve mandatory consumer rights.

Legal/privacy copy must accurately describe Ko-fi payment infrastructure, Benedict entitlement authority, purchase/restore email, OTP, support, refund/revoke/dispute consequences and provider roles.

Founder-privacy real-checkout inspection remains a launch gate.

---

# 17. REMAINING TEST / RELEASE PATH

Run only genuinely unfinished/new scope in this order:

1. physical Release-Isolation proof;
2. production signing key creation/custody/backup outside GitHub;
3. production-signed Release APK build + signature/package/non-debuggable verification;
4. physical install/update proof of production-signed candidate;
5. final App/Web/Ko-fi polish + FAQ/Q&A + support/legal/refund closure;
6. official website download/update path with exact signed APK/version/changelog/checksum;
7. FK-safe cleanup of synthetic QA data after evidence is no longer needed;
8. remove/disable test-only live-email/OTP overrides, exit TEST MODE;
9. deliberate public-commerce enablement for final controlled production smoke;
10. final real OTP + purchase/restore + entitlement/Pro smoke. Earlier real-money proof used 10 THB; exact-price **249 THB** clean-identity proof is the strongest final evidence if P'Benz approves the charge, otherwise record an explicit exception;
11. final Restore proof on production candidate if signing/storage changes could materially affect it;
12. publish/download proof from Benedict site + Uptodown;
13. final no-Dev/legal/support/version/signature/customer-journey smoke;
14. launch and monitor real delivery/webhook/support anomalies.

Do not rerun Frozen #1–#25 or unrelated old UI/scanner tests.

---

# 18. PRODUCTION SIGNING / UPDATE CONTRACT

Production keystore/passwords/secrets stay outside GitHub/public artifacts.

Document secure custody + backup + recovery. Signing continuity is mandatory; losing the signing key breaks seamless updates for direct distribution.

Direct update remains explicit:

`new version → release notes/changelog → user chooses download → Android installer confirms`

Never silently install updates.

---

# 19. OPERATIONAL BUILD DELIVERY BACKLOG

GitHub Actions artifacts around 22 MB have downloaded unusually slowly (minutes) on both PC and mobile despite fast internet, pointing to Actions artifact/CDN/route behavior rather than one device.

This is a future workflow-quality task: improve internal QA artifact delivery without weakening signing/security. Customer distribution must never depend on Actions artifacts; use Benedict website + Uptodown.

A Cloudflare build once stalled on `npm install`; retry succeeded. If repeated at the same stage, investigate build config/runner instead of indefinite retries.

---

# 20. PRIVACY / LOCALIZATION / SUPPORT

Android exposed languages remain English, ไทย, 日本語; mixed-language exposed UI is a defect.

Local-first privacy remains: no file-content upload, remote filename inventory, hidden behavioral telemetry, ads, unnecessary accounts, persistent full file trees or unnecessary long-lived hashes. Network use only for intentional commerce/support/update functions.

Approved branded support target is `support@benedictinteractive.com`, but public switch happens only after inbound routing and reply identity are proven.

---

# 21. KNOWN FAILURE MODES — DO NOT REPEAT

Do not repeat PWA recreation, launcher drift, fake scan pacing, destructive-category assumptions, delete-to-zero duplicate groups, hidden previews while off, stale delete snapshot, unverified reclaimed bytes, fake trends, mixed locale, detached bridge calls, MutationObserver loops, polling replacing focused controls, background refresh resetting active user context, success UI without native truth, assuming CI proves runtime, global share interception, consuming clicks before native acceptance, low-alpha mascot, unnecessary redesign, or confusing functional state with visual selected state.

Additional commerce failure prevention:

- old purchase polling must never collapse OTP recovery;
- identity mismatch must never be auto-guessed;
- customer Release must never expose Dev entitlement;
- TEST MODE delivery semantics must never be mistaken for production delivery;
- never claim exact-price real-money proof if only the temporary 10 THB live proof occurred.

---

# 22. MASTER PLAN MAINTENANCE / NEXT ROOM

Always update this canonical path in place. No competing final/v2/dated Master Plans in repo.

At next-room startup:

1. read current Room Migration prompt;
2. fetch latest Android + web main;
3. read both canonical Master Plans;
4. preserve Frozen #1–#25;
5. inspect current workflows/build/version;
6. establish rollback/allowlist;
7. resume from the first unfinished item in Section 17;
8. never make P'Benz restate completed commerce or release strategy.

---

# APPENDIX A. RETAINED CORE CONTRACTS FROM REVISION 6.1

Still binding unless explicitly superseded:

- approved frontend adapter order remains significant and must not be casually reordered;
- Debug Billing sandbox / Play Billing are engineering references only, not current sales channel;
- working native Bitmap/PNG Result Share Card architecture remains accepted;
- Dr.Bear assets/approved visual identity remain protected;
- feature completeness for destructive workflows remains `Entry → Real data → Loading/Empty/Found/Error → Explanation → Preview/Context → Selection → Safety → Confirm → Native action → Verify → Truthful summary → Updated state`;
- a 10/10 feature must be truthful, readable, premium, useful in empty/error states, safe, local-first, localization-resilient, maintainable and evidence-backed;
- protect code/brand/assets/copy while respecting third-party licenses; do not falsely claim trademark/corporate status;
- Benedict remains canonical source for stable version, official download, release notes, support and licensing truth.

**End of Revision 7.0**
