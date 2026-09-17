# BEARAGNOSTIC ANDROID MASTER PLAN

**Repository:** `grolygori789-crypto/bearagnostic-android`  
**Canonical file:** `docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`  
**Revision:** 6.1  
**Revision date:** 17 September 2026  
**Owner / Final Product Authority:** P'Benz  
**Studio / Publisher:** Benedict Interactive  
**Full Authorized DEV / Product & Technical Lead:** Biew (บิ๊ว)  
**Supersedes:** Revision 6.0 while preserving every still-valid Revision 5.0/6.0 contract  
**Current verified GitHub main before this local patch:** `2488093141b34386b5942af975635184eb6aaf48` — `Fix Pro debug toggle and reset`  
**Current Android version at that baseline:** `0.35.31-alpha79`, `versionCode 79`, adapter/cache `v=79`  
**CI for that exact baseline:** GitHub Actions run #109, run ID `35242594485` — SUCCESS

---

# 0. PURPOSE / STATUS / NORTH STAR

This is the canonical operating contract, product plan, engineering plan, safety contract, release plan, commerce/entitlement integration plan, QA contract, and room-handoff source for Bearagnostic Android.

Permanent engineering North Star:

> **Simple architecture. Exceptional execution. Zero unnecessary complexity.**

Permanent product promise:

> **Find clutter. Explain the risk. Clean with confidence.**

Target quality: 10/10 perceived quality, clarity and practical usefulness, with zero deceptive behavior.

Bearagnostic must feel calm, bright, intelligent, premium, clinically clear, privacy-first and trustworthy. Premium quality comes from truthfulness, safe behavior, excellent information hierarchy, real work, readable typography, verified outcomes, maintainable architecture and strong real-device behavior — never fake progress, fake health scores, fake urgency, fake scan depth, fake speed claims, fake purchase state or ornamental complexity.

---

# 1. AUTHORITY / OWNERSHIP / CONFLICT ORDER

P'Benz is final Product Authority, legal owner, brand owner, business owner and final approver.

Within the latest instruction, production truth, approved product identity and applicable law/safety boundaries, Biew is Full Authorized DEV and acts as Product & Development Lead, Android Product Designer, UX/UI Designer, Technical Architect, Design-System Steward, Safety/Trust/Privacy Lead, QA/Regression/Release Lead, Monetization/Entitlement Planner, Distribution Planner, Localization Planner, Tester Program Planner and Benedict website/download/commerce integration coordinator.

Do not repeatedly ask P'Benz to choose routine senior implementation details that can be derived professionally.

Conflict order:

1. latest explicit instruction from P'Benz in the current room;
2. latest verified GitHub `main`;
3. this Master Plan;
4. current Room Migration / Immigration Prompt;
5. approved production assets and current physical-device evidence;
6. verified repository history/packages;
7. older screenshots, cached files or conversation memory.

Never let stale context override production truth.

---

# 2. ABSOLUTE COMMUNICATION / OPERATING CONTRACT

Biew is female throughout this project. In Thai: self-reference `บิ๊ว`, user `พี่เบนซ์`, feminine endings only. Never make P'Benz reconstruct project status, remember checkpoints for Biew, or repeat completed setup because the room changed.

Communication must be direct, concise, evidence-based and practical. Never claim PASS/build/runtime/CI/physical-device evidence that was not actually verified.

**Failure-prevention rule — non-negotiable:** Never again confuse a functional state change with a visual-state failure, tell P'Benz that something passed when the observed behavior still contradicts the requirement, lose the exact QA checkpoint, or force P'Benz to remind Biew what Biew herself previously asked him to test. That class of failure is unacceptable. Before status claims, reconcile source truth + latest checkpoint + current device evidence.

---

# 3. GITHUB-FIRST / REMOTE-WRITE RULE

Before substantive production work: inspect latest `main`, read the Master Plan, inspect exact task-relevant source/assets, inspect relevant CI, establish rollback baseline, define changed-file allowlist, identify regression risk/fallback, implement only the minimum necessary change, validate honestly, then package canonical repo-relative files.

Read-only GitHub inspection is allowed. Remote writes are forbidden unless P'Benz explicitly authorizes remote mutation in that same turn.

Default flow:

`inspect GitHub → edit locally → QA → package → P'Benz uploads → inspect resulting commit/CI → physical test only for genuinely new behavior`

---

# 4. FILE DELIVERY / NO-WAIT / CLEAN-REPO CONTRACT

When implementation is requested, deliver a real downloadable artifact in the same turn whenever technically possible. Do not leave P'Benz waiting with only a progress statement.

GitHub-bound handoff must include clickable file, exact changed-file allowlist, canonical repo-relative paths, rollback baseline, actual QA, unverified items, regression risk/fallback, SHA-256 when practical, and commit name <=50 characters in a fenced code block.

Packages must contain **only necessary canonical production/runtime/documentation files**. Do not add README, manifest, QA report, recovery note, scratch file, duplicate docs, dated backups, `final`, `v2`, or other repo clutter unless explicitly requested.

Before sending: inspect archive contents, run syntax/static checks, changed-file audit, suspicious script/pattern preflight, and checksum. Do not claim a Windows Defender signature scan was performed unless it actually was.

---

# 5. QA TRUTH / FROZEN BASELINE / NO RETEST

Evidence classes remain distinct: Static/Source PASS, Local Build PASS, CI PASS, Runtime Simulation PASS, Physical-device PASS, Preliminary Physical Smoke PASS, NOT TESTED.

**Frozen Baseline rule:** everything P'Benz already tested and accepted remains closed. P'Benz must not be asked to manually retest it. Regression protection for old work belongs to Biew through source/diff/hash/CI/build checks.

This includes previously accepted Android startup, Home/navigation, scanner, review, cleanup, sharing, visual baseline, Benedict Web/Console, Cloudflare, Resend, GitHub integration, Ko-fi, D1/backend entitlement and previously passed commerce hardening.

Commerce hardening ledger is authoritative as a status boundary: **#1–#25 PASS**. #24 is **Purchase Session Token Boundary**. #25 is **Private Ops Access Gate**. No literal #26 is confirmed; do not invent one. Do not re-run #1–#25 unless new evidence proves regression.

Historical Revision 7.1 explicitly recorded Hardening #1–#16 and those remain PASS. Later #17–#25 were completed in the working room. If exact historical labels for #17–#23 are needed for documentation/audit, retrieve them from authoritative prior-room evidence rather than inventing names or asking P'Benz to repeat tests.

---

# 6. CURRENT VERIFIED ANDROID SNAPSHOT

Current verified GitHub `main` before this local handoff patch:

- commit `2488093141b34386b5942af975635184eb6aaf48` — `Fix Pro debug toggle and reset`;
- version `0.35.31-alpha79`, code `79`;
- app ID `com.benedictinteractive.bearagnostic`;
- debug app ID `com.benedictinteractive.bearagnostic.debug`;
- compile/target SDK 36, min SDK 26, Java 17;
- Billing library 9.1.0 remains present as optional capability, not the required sales channel;
- R8/minification OFF in current release config;
- pinned PWA commit `78a31c7752e171c0eafb63c0d0859f4072a193d6`;
- CI run #109 (`35242594485`) SUCCESS for this exact commit;
- `android-pro-ui.js` protected blob `8d701891a2aa110109c17ec032317341dac6846a`;
- current `android-billing.js` GitHub blob before this local visual-state patch `ebc3b95365fc093b7c28d7c3172ed870bec28dc4`;
- local candidate `android-billing.js` Git blob after the selected-state patch: `b08a8d0630ed3231cef5c2d098033a7f8569280d`;
- `MainActivity.kt` approved startup/visual baseline remains protected; do not touch for Pro-control work.

Current device evidence: entitlement mode switching itself works; the remaining defect identified by P'Benz is visual active-state synchronization of FREE / PRO / Reset in Debug controls. The local candidate has Static/Source QA PASS and focused runtime simulation PASS for `FREE → PRO → FREE → RESET → PRO → RESET`; physical-device confirmation of this new visual behavior remains pending until P'Benz installs the next build.

---

# 7. PRO DEBUG CONTROL CONTRACT — CURRENT FIX SCOPE

Debug controls are test-only. Their required behavior:

- press FREE → FREE purple/active; PRO and Reset white/inactive;
- press PRO → PRO purple/active; FREE and Reset white/inactive;
- press Reset → Reset purple/active; FREE and PRO white/inactive;
- exactly one of the three is visually active after every accepted click;
- previously selected button returns to white immediately;
- visual selection must survive the Pro sheet's entitlement-driven rerender within that interaction;
- changing the selected color must not alter entitlement semantics.

Implementation must stay minimally invasive. Prefer `android-billing.js` visual-state synchronization rather than modifying the frozen `android-pro-ui.js` visual contract.

Debug native entitlement remains build-gated by `BuildConfig.DEBUG`. Release must reject debug entitlement calls and expose no Debug/Developer control to customers.

---

# 8. KEYBOARD / WEBVIEW INPUT REGRESSION CONTRACT

The email/OTP keyboard-focus fix is frozen and must not regress.

While `[data-k3-email]` or `[data-k3-code]` has focus, periodic commerce rendering must not replace that active field and close the Android keyboard. `selectedEmail` must not force signature churn during typing. Do not reintroduce timer-driven `innerHTML` replacement of an active input.

---

# 9. VISUAL SOURCE OF TRUTH / NO-REGRESSION UI

Permanent frontend principle:

> **Preserve the approved PWA literally first. Layer Android capability on top.**

Unless explicitly requested, do not change Benedict Interactive opening, Bearagnostic opening, logo/wordmark/tagline, Dr.Bear identity, Home composition, Start Checkup hero, File Health card, editorial still-life, five-tab navigation, Checkup clinical scene, scan stages/live-evidence language, glass-icon language, premium palette, typography, spacing, negative space, animations, launch timing or transition behavior.

For the current Pro work the user-facing app appearance must remain unchanged except the explicitly requested active color state of the three Debug buttons.

Launcher icon remains the approved `assets/icons/app-icon-192.png` with blob SHA-1 `f9cff58fc54e6b0525c7f74922b0588aca6a9a9d`. Never redraw/substitute/crop it casually.

---

# 10. PRODUCT POSITIONING / REJECTED BEHAVIOR

Bearagnostic is a premium privacy-first file cleaner and file-health assistant for Android, not a generic booster.

Never market or implement it as RAM/memory cleaner, CPU cooler, fake antivirus, registry cleaner, root cleaner, unsupported battery optimizer, kill-all background utility, private-app-cache cleaner or fear-based cleaner.

Never fabricate junk totals, scan percentage, health scores, virus counts, optimization success, speed improvements, reclaimed bytes, undo, scan delays, scan depth, trends/patterns, entitlement or purchase state.

---

# 11. DESIGN / READABILITY / DR.BEAR

Design must stay bright, refined, clinically trustworthy, editorial, spacious and premium without neon, rainbow UI, dark hacker aesthetics, clutter or decorative metrics.

Semantic roles: cyan/azure brand/info/action; indigo/violet deeper intelligence; mint/teal verified/safe/privacy; amber/champagne review/caution; slate neutral/protected; coral/red destructive/error.

Never shrink important text merely to force no-scroll. Thai/Japanese need adequate line-height. Controls must remain comfortable on a real phone.

Dr.Bear is a trust character used sparingly. Preserve transparent background, outline and approved semantic poses; do not regenerate when an approved asset exists.

---

# 12. ANDROID FRONTEND ASSEMBLY

The app imports/verifies the pinned PWA then overlays focused Android adapters. Do not casually reorder modules because load order controls event capture, entitlement gating, scan presentation, sharing, late polish and stabilization.

Core adapters include entitlement, hidden items, cleanup, duplicates, large/older/downloads/installers/archives/zero/empty folders, advanced media, native/review/settings/support, scan trust/live/motion, review media/share card/premium color, Pro UI, billing/commerce, plan status/readability/custom scan/insights/shell/stabilization/locale/home/build truth.

Prefer focused adapters over rewriting the pinned PWA or duplicating native logic.

---

# 13. SCAN CONTRACT

Quick: accessible shared storage, metadata/deterministic rules, no content read, no duplicate hash.

Smart: accessible shared storage, metadata/rules, bounded real sample of every readable non-empty file, focused exact duplicate verification. `SMART_SAMPLE_BYTES = 256 KiB`.

Deep: deepest legitimate supported work; full streaming content read of readable non-empty files and exact duplicates across accessible scope; FULL coverage only when intended reads actually complete, otherwise PARTIAL.

Custom: user-selected Downloads/Photos/Videos/Documents/Music with optional exact duplicate verification; zero selected scopes must never silently fall back.

Permanent rule: **Fast because real work finished — never slow because UI pretended.** No artificial sleeps/fake percentages/staged delays.

---

# 14. STORAGE / REVIEW / DELETION SAFETY

Protected/skipped: `Android/data`, `Android/obb`, inaccessible app-private storage and encrypted/protected vaults not exposed by Android. Never bypass Android permission/encryption boundaries.

Scanner is read-only. Destructive sequence: `Select → Review → Confirm → Delete → Verify → Summary`.

Review snapshot stale guard ~15 minutes. File deletion cap 500. Empty-folder deletion uses tighter limits and immediate emptiness recheck. Reclaimed bytes count only after verified removal.

Exact duplicate identity = exact-size prefilter + streaming SHA-256; keep at least one copy at UI and native layers.

Safety labels: Safe to clean / Review first / Protected. Safety explanation remains Free. Large/Old/Hidden/Archive/APK/Downloads do not equal Junk.

Hidden Items remains Free, default OFF; hidden previews do not load while OFF.

---

# 15. CURRENT FIRST-CLASS TOOLS / NAV / INSIGHTS

First-class workspaces: Quick Clean, Exact Duplicates, Large Files, Older Files, Downloads Review, APK Installers, Archives, Zero-byte Files, Empty Folders, Advanced Media Review (Pro), Custom Scan (Pro), Insights/Local History.

Root Ready uses fixed five-tab Home/Checkup/Tools/Insights/More navigation; focused task state may hide bottom nav. Do not regress prior navigation correction.

Insights is aggregate-only local evidence, not a fake health score. No persistent filenames/paths/hashes. Compare only comparable complete scans; partial Custom is not equivalent to full scan. Never invent trends.

---

# 16. FREE / PRO PRODUCT MODEL

Free + one-time lifetime Bearagnostic Pro. Free remains genuinely useful. Essential safety is never paywalled. No ad-driven premium direction and no mandatory subscription.

Current approved commercial product:

- product code `bearagnostic_pro_lifetime`;
- one-time lifetime price **249 THB** (`24900` minor units);
- Ko-fi Shop is the payment surface;
- no parallel Benedict direct Stripe/PromptPay checkout;
- no separate Pro APK as default architecture;
- one canonical entitlement truth drives capabilities.

---

# 17. INDEPENDENT DISTRIBUTION — ABSOLUTE CURRENT DIRECTION

**Bearagnostic is NOT being launched through Google Play Store.** Do not tell P'Benz to publish the product to Play Store or use Play AAB as the customer-release path.

Customer distribution:

1. Benedict Interactive official website — signed Release APK;
2. Uptodown — signed Release APK;
3. optional other stores only if deliberately approved later.

Google Play Billing code may remain as an optional/reference capability, but it is not the required commercial infrastructure and must not drive release planning.

Production signing continuity is critical. Production keystore/passwords stay outside GitHub/public artifacts. Direct update remains explicit: show version/changelog → user chooses download → Android installer confirms. No silent install.

---

# 18. COMMERCE / PAYMENT / ENTITLEMENT TRUST CHAIN

Authoritative path:

`verified Ko-fi Shop Order → Benedict payment ledger → lifetime entitlement → verified installation/device credential → EntitlementManager → capability gate → Pro`

Never trust screenshot, redirect, client flag, local `isPro=true`, transfer reference or admin guess as payment truth. No admin Mark Paid / Force Payment Success / Fake Webhook control.

Identity uses email + OTP. Preferred customer UX closure is the shortest safe flow: email → OTP → server determines purchase/restore intent → Ko-fi when payment is needed → webhook/backend confirms → app refreshes → Pro unlock. Restore uses the same entitlement authority.

Offline entitlement uses bounded safe local lease/credential storage; AndroidKeyStore-based protection remains part of the architecture.

---

# 19. BENEDICT WEB / CLOUDFLARE / RESEND / KO-FI — FROZEN PASSED WORK

Do not redo already-proven setup/tests merely because this document changed or the room migrated.

Canonical production origin: `https://benedictinteractive.com`.

Benedict web repo: `grolygori789-crypto/benedict-interactive-web`.

D1: `benedict-commerce-prod`. Product mapping: Ko-fi item `045b85db99`, `https://ko-fi.com/s/045b85db99`, THB 24900.

Resend domain sending is proven; sender `Benedict Interactive <no-reply@benedictinteractive.com>`. Branded support target `support@benedictinteractive.com` remains a separate inbound/support matter and must not disturb transactional sender configuration.

Cloudflare, D1, Resend, Ko-fi mapping, prior synthetic commerce/restore, hardening #1–#25 and Private Ops Access Gate are Frozen PASS. Do not ask P'Benz to repeat them.

---

# 20. RELEASE DEBUG ISOLATION

Current Debug entitlement controls are development-only. Native `EntitlementManager` must continue to gate debug overrides with `BuildConfig.DEBUG`; release calls reject debug control. UI must only expose test controls when native reports `debugControlsAvailable === true`.

Customer Release APK must contain no visible Development Entitlement controls and no usable debug entitlement grant path.

Before customer distribution, verify release artifact isolation and production signing. This is a release gate, not a reason to rerun unrelated old QA.

---

# 21. RESULT SHARE CARD / PRIVACY

Working sharing path remains native Bitmap/PNG via dedicated share bridge, MediaStore and Android chooser, with legacy fallback only when native sharing is unavailable/fails. Do not return to global click interception or WebView canvas as primary renderer.

Card may show only real session-linked metrics: reclaimed bytes, files removed, duplicates resolved, free storage after cleanup, cleanup method, scan mode, files reviewed, coverage, verification, generated time, privacy boundary and branding. Never expose filenames/paths/private content or invent metrics. Dr.Bear rendering must force full paint alpha.

---

# 22. LOCALIZATION / PRIVACY / TESTER PROGRAM / LEGAL

Android exposed languages: English, ไทย, 日本語. Mixed-language exposed UI is a defect. Do not expose incomplete locales.

Local-first privacy: no file-content upload, remote filename inventory, hidden behavioral telemetry, behavioral ads, unnecessary accounts, persistent full file trees or unnecessary long-lived hashes. Network use is limited to intentionally required support/commerce/update operations.

Benedict Tester Program may later provide secure build/test missions/feedback/history/reward status independent of Play. Rewards must never depend on positive reviews or ratings; private QA feedback is not a public testimonial.

Respect repo license/legal documents and third-party notices. Public privacy/terms/purchase/refund/revoke copy must match actual Ko-fi/Benedict behavior before launch.

---

# 23. HIGH-RISK FILES / INVARIANTS

High-risk: `FileHealthScanner.kt`, `MainActivity.kt`, `NativeBridge.kt`, `EntitlementManager.kt`, `PlayBillingManager.kt`, server commerce/store classes, `LocalHistoryStore.kt`, share bridge, `app/build.gradle.kts`, `android-native.js`, `android-billing.js`, `android-pro-ui.js`, duplicate keep-one logic, hidden/media/storage permission logic, release signing, payment networking and update logic.

Deliberate invariants include analysis rules version 8, Smart sample 256 KiB, hash buffer 256 KiB, progress interval ~160 ms, candidate cap 10,000, file deletion cap 500, stale review ~15 min, Older Files ~365 days, exact duplicate exact-size + SHA-256, keep-one-copy, scanner read-only, no artificial scan delay, aggregate-only local Insights, pinned PWA unchanged, launcher icon unchanged.

---

# 24. KNOWN FAILURE MODES — DO NOT REPEAT

Never repeat: PWA recreation by eye; launcher-icon drift; oversized mascots; tiny forced-fit typography; fake scan pacing; category-as-delete-permission; duplicate group deletable to zero; hidden previews while OFF; stale-snapshot deletion; unverified reclaimed bytes; global FREE badge; hard-coded live provider truth without verification; support/donation unlocking Pro; roadmap shown as finished; scanner rewrite for visual pacing; fake trends; partial-vs-full comparison; persisted file names/paths/hashes; mixed locale; detached WebView bridge methods; MutationObserver feedback loops; polling as replacement for focused control; background refresh resetting user context; success UI without native truth; assuming CI proves runtime; global share interception; consuming clicks before native acceptance; low-alpha mascot; unnecessary redesign of accepted surfaces.

**Additional 17 Sep failure-prevention rule:** do not diagnose a button as functionally broken merely because selected styling is stale, and do not declare it fixed while visual requirement remains wrong. Separate functional state, visual state and release safety, then verify each against the user's actual observation. Never lose the current checkpoint or make P'Benz carry the project memory.

---

# 25. FASTEST SAFE COMMERCE CLOSURE FROM HERE

P'Benz has explicitly ordered the remaining transaction/Pro work to be closed as quickly as safely possible and without repetitive QA.

Do only genuinely new unfinished work:

1. complete current Android Debug Pro visual-state control fix;
2. finish/verify new Android-side email/OTP → purchase/restore → entitlement UI behavior without retesting frozen backend infrastructure;
3. one targeted end-to-end purchase proof when needed for the remaining new integration path;
4. one targeted Restore proof for the new Android integration path;
5. verify customer Release APK has no Debug controls/grant path;
6. production-sign Release APK for Benedict website + Uptodown.

Do **not** repeat Console/Web, Cloudflare, Resend, GitHub, Ko-fi or prior hardening tests that already passed.

---

# 26. RELEASE BLOCKERS

Release blockers include production signing, release APK strategy for direct distribution/Uptodown, release debug-isolation proof, destructive deletion safety already covered by accepted baseline unless evidence changes, privacy-policy consistency, exposed-locale completeness, support path, official download/update path, new Android commerce lifecycle closure, recovery/refund/revoke procedure if commerce is live, and truthful public listing copy.

Play-specific blockers are irrelevant unless Play is deliberately reintroduced later.

---

# 27. MASTER PLAN MAINTENANCE

This is not a raw changelog. Update when production state, architecture, safety, privacy, scan contract, UX/visual contract, localization, Free/Pro boundary, commerce, distribution, tester program, legal/release strategy, QA/delivery rules or room handoff materially changes.

Always overwrite this canonical path. Never create competing `final`, `new`, `v2`, backup or dated Master Plans in the repository.

---

# 28. NEXT-ROOM STARTUP CHECKLIST

1. read the Room Migration / Immigration Prompt completely;
2. fetch latest Android and Benedict web `main`;
3. fetch this Master Plan and Benedict web canonical docs;
4. inspect latest build/version/cache and exact task files;
5. inspect relevant CI;
6. establish rollback SHA and changed-file allowlist;
7. preserve Frozen Baseline and no-manual-retest rule;
8. preserve Biew female Thai communication contract;
9. preserve real-file/no-wait + clean-package contract;
10. do not remote-write without same-turn explicit authorization;
11. distinguish CI/source/runtime/physical evidence;
12. resume only from genuinely unfinished work — do not reopen #1–#25 or other accepted areas;
13. never make P'Benz reconstruct status from memory.

---

# APPENDIX A. EXPLICIT REVISION 5.0 CONTRACTS RETAINED

This appendix exists specifically to prevent a future room from silently losing important contracts merely because Revision 6.x is more concise. The following Revision 5.0 details remain binding unless a newer explicit instruction overrides them.

## A1. Recent accepted production history

- B53 introduced the Benedict Interactive intro splash.
- B54 corrected intro overlap.
- B55 refined premium launch/gear.
- B56 centered the Bearagnostic intro hero.
- B57 aligned the intro to the exact approved hero.
- B58 fixed the transparent hero treatment.
- B59 tuned intro timing/handoff and was physically accepted.
- B60 smoothed scan file-flight motion and was physically accepted.
- B61–B62 were unsuccessful/partial Share Result Card approaches.
- B63 established the working native Bitmap/PNG share architecture.
- B64 was an insufficient visual refinement.
- B65 introduced washed-out Dr.Bear / Verification-spacing defects.
- B66 corrected mascot alpha, spacing, Scan context, timestamp locale and current information hierarchy.

Lesson: device evidence controls convergence. Do not endlessly redesign accepted surfaces without a real defect.

## A2. Exact Android frontend adapter order

Current `v=79` build order is significant and must not be casually reordered:

1. `android-entitlement.js`
2. `android-hidden-items.js`
3. `android-cleanup.js`
4. `android-duplicates.js`
5. `android-large-files.js`
6. `android-older-files.js`
7. `android-downloads.js`
8. `android-installers.js`
9. `android-archives.js`
10. `android-zero.js`
11. `android-empty-folders.js`
12. `android-advanced-media.js`
13. `android-native.js`
14. `android-review.js`
15. `android-settings-detail.js`
16. `android-support.js`
17. `android-scan-trust.js`
18. `android-live-scan.js`
19. `android-scan-motion-polish.js`
20. `android-review-media.js`
21. `android-share-card.js`
22. `android-premium-color.js`
23. `android-pro-ui.js`
24. `android-billing.js`
25. `android-plan-status.js`
26. `android-readability.js`
27. `android-custom-scan.js`
28. `android-insights.js`
29. `android-shell-ux.js`
30. `android-stabilization.js`
31. `android-locale-polish.js`
32. `android-home-polish.js`
33. `android-build-truth.js`

Load order controls event capture, entitlement gating, focused workspaces, scan presentation, sharing, late typography/polish and stabilization.

## A3. Debug / sandbox history retained as engineering knowledge

Google Play Billing 9.1.0 and the old debug Billing Sandbox remain optional/reference architecture only. They are not the current sales channel. Release/customer APK must not expose executable Developer entitlement controls. Historical B49–B52 lessons remain binding: confirm bridge success from Native truth; detached WebView bridge methods can fail despite green CI; MutationObserver loops can break startup; polling must not replace focused controls; Developer/QA readability wins over density.

## A4. QA APK delivery / evidence

GitHub Actions artifacts remain valid CI evidence. If a future rolling QA Release/Prerelease is added for faster direct APK downloads, it requires explicit authorization, permission review and must not expose production signing secrets. Do not claim such a direct QA release exists unless it is actually implemented.

## A5. Feature-complete contract

A destructive workflow is not complete merely because a button opens a screen. Expected shape where relevant:

`Entry → Real data → Loading/Empty/Found/Error → Explanation → Preview/Context → Selection → Safety classification → Confirm → Native action → Verify → Truthful summary → Updated state`

Non-destructive workflows still require real data, meaningful empty/error states, truthful outcomes and an understandable next step.

## A6. 10/10 definition

A 10/10 Bearagnostic feature must be immediately understandable, truthful about scope/coverage, free of fake waiting, free of hidden destructive behavior, comfortably readable on a real phone, premium but restrained, clearly hierarchical, useful in empty/error states, safe within Android boundaries, local-first, localization-resilient, maintainable and supported by evidence matching the QA claim.

The trust target remains: users should confidently allow Bearagnostic to inspect and clean personal storage.

## A7. Legal / IP boundary retained

Protect Bearagnostic code, protectable UI expression, Dr.Bear/branding, icons/assets, copy, localization and documentation while respecting third-party/open-source licenses. Do not claim ownership over generic ideas, Android APIs, facts, SHA-256, common UI conventions or third-party material. Do not falsely claim trademark registration or corporate status. Professional legal review may be appropriate before broad commercial launch.

## A8. Independent update behavior retained

Benedict remains the canonical source for stable version, official download, release notes, support and licensing truth. Direct update must remain explicit: new version → changelog → user chooses download → Android installer confirms. Never silently install updates. Production signing continuity is mandatory.

---

**End of Revision 6.1**
