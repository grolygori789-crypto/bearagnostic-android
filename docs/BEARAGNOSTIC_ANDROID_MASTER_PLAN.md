# BEARAGNOSTIC ANDROID MASTER PLAN

**Repository:** `grolygori789-crypto/bearagnostic-android`  
**Canonical file:** `docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`  
**Revision:** 2.4  
**Revision date:** 10 September 2026  
**Owner / Product Authority:** P’Benz  
**Studio / Publisher:** Benedict Interactive  
**Product & Development Lead:** Biu  

---

## 0. PURPOSE OF THIS DOCUMENT

This document is the primary operating contract for Bearagnostic for Android.

It exists to keep product direction, visual quality, Android engineering, cleanup safety, privacy, scan truthfulness, localization, monetization architecture, repository state, QA, packaging, and release work aligned as the product grows.

The permanent engineering North Star is:

> **Simple architecture. Exceptional execution. Zero unnecessary complexity.**

The permanent product-quality target is:

> **10/10 perceived quality, 10/10 clarity, 10/10 practical usefulness.**

Premium does not mean complicated. Every feature must earn its complexity.

Bearagnostic must feel calm, intelligent, expensive, trustworthy, clinically clear, useful, and intentionally designed. It must never become a noisy “phone booster” that relies on fear, fake scores, or impossible performance claims.

---

# 1. SOURCE OF TRUTH AND AUTHORITY

## 1.1 GitHub-first rule

Before proposing, designing, modifying, packaging, bug-fixing, or evaluating a substantive production change, inspect the current production repository first:

`grolygori789-crypto/bearagnostic-android`

At minimum, inspect:

1. default branch and latest `main` commit;
2. current tree;
3. the current canonical Master Plan from GitHub;
4. the actual files affected by the requested change;
5. the latest relevant CI state;
6. the known-good baseline and regression risk.

Do not base implementation on a stale local ZIP, an old screenshot, an old attachment, remembered chat history, or a superseded build when current GitHub production is available.

If the current canonical Master Plan cannot be retrieved, **stop substantive implementation** rather than silently using a stale copy.

## 1.2 Authority order

Resolve conflicts in this order:

1. latest explicit instruction from P’Benz;
2. current GitHub production;
3. this current canonical Master Plan;
4. current approved assets and references;
5. older chat/history/packages.

When a new explicit instruction overrides this plan, update this same canonical file at the next appropriate opportunity.

## 1.3 Remote-write rule

GitHub connector permissions never imply authorization to mutate the repository.

Default workflow:

`Inspect GitHub → modify locally → QA → package repo-relative changed files → P’Benz uploads manually → inspect uploaded commit → inspect CI`

Do not create, update, delete, push, merge, or otherwise mutate GitHub remotely unless P’Benz explicitly authorizes remote writes **in that same turn**.

---

# 2. CANONICAL FILE GOVERNANCE

The Master Plan must remain at exactly:

`docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`

Future updates must overwrite this file. Never create `v2`, `final`, `new`, `backup`, `copy`, dated variants, or other competing Master Plan files.

The same canonical-path principle applies to production files generally. Update an existing canonical path instead of creating `new`, `new2`, `final`, `backup`, `old`, or similar duplicates.

Create a new file only when it has a durable and genuinely distinct responsibility.

---

# 3. CURRENT VERIFIED PRODUCTION SNAPSHOT — BATCH 28

This section is a snapshot and must never override newer GitHub production.

As of 10 September 2026 before the B29 Quick Clean premium trust/UX package is uploaded:

- branch: `main`
- latest commit: `bc2a3d04426619bc3b260e78aec614d7060576af`
- commit message: `Complete Quick Clean workflow`
- parent: `3295e75073e5f7df05c8d12f561d4c3fff343852`
- Android version: `0.22.0-alpha28`
- `versionCode`: `28`
- application ID: `com.benedictinteractive.bearagnostic`
- debug application ID: `com.benedictinteractive.bearagnostic.debug`
- compileSdk: `36`
- targetSdk: `36`
- minSdk: `26`
- Java compatibility: `17`
- Native Bridge version: `10`
- latest GitHub Actions debug APK run for B28: **SUCCESS** (run #32)
- B28 has physical-device evidence for the Quick Clean live-scan and zero-low-risk result states; the core path runs, but the first-device review found that those states use space too sparsely and do not expose enough evidence to explain very fast completion.

B28 is the known-good rollback baseline for B29 Quick Clean premium trust/UX completion work.

Do not call B29 physically verified until P’Benz tests the revised live-evidence, empty-result and next-step states on a real Android device.

---

# 4. PRODUCT POSITIONING

Bearagnostic for Android is:

> **A premium, privacy-first, all-in-one junk file cleaner and file-health assistant for Android.**

Product promise:

> **Find clutter. Explain the risk. Clean with confidence.**

It must help users:

- understand what consumes storage;
- scan accessible shared storage honestly;
- identify low-risk cleanup candidates;
- verify exact duplicates using evidence;
- distinguish junk confidence from deletion risk;
- review ambiguous files intelligently;
- clean selected files safely;
- verify actual deletion;
- see truthful before/after cleanup impact;
- understand why an item should be kept, reviewed, or removed;
- retain control at every destructive step.

The app should feel like a high-end diagnostic and maintenance utility, not a commodity booster.

---

# 5. EXPLICITLY REJECTED PRODUCT BEHAVIOR

Do not implement or market Bearagnostic as:

- RAM booster;
- memory cleaner;
- CPU cooler;
- fake speed booster;
- battery booster;
- kill-all background app tool;
- fake antivirus;
- root cleaner;
- private-app-cache cleaner outside legitimate Android access;
- registry cleaner;
- fear-based “your phone is in danger” utility.

Do not display fabricated values such as:

- “Phone speed +37%”;
- fake health score;
- fake junk totals;
- fake scan percentages;
- fake virus counts;
- fake optimization success;
- fake undo.

Performance benefits may be described only when evidence supports them, for example reclaiming storage headroom or resolving storage pressure. Never imply CPU/RAM acceleration from file deletion without a measured, defensible basis.

---

# 6. LEGACY HTML/PWA FRONTEND AS VISUAL SOURCE OF TRUTH

## 6.1 Approved legacy repository

Legacy/PWA repository:

`grolygori789-crypto/bearagnostic`

Pinned approved commit:

`78a31c7752e171c0eafb63c0d0859f4072a193d6`

The Android build imports this legacy PWA and verifies critical Git blob SHA-1 values before packaging it.

Android-specific behavior must be layered on through focused adapters/modules. Do not casually rewrite the approved visual shell.

## 6.2 Critical visual/source contracts

The approved experience includes:

- Benedict Interactive opening;
- Bearagnostic product opening;
- original PWA app icon;
- Bearagnostic wordmark and tagline;
- original Home composition;
- silver header gear;
- Dr. Bear approved artwork;
- Start Checkup hero;
- quick tools:
  - Cleanup
  - Duplicates
  - Large Files
  - Older Files
- File Health;
- editorial still-life;
- bottom navigation:
  - Home
  - Checkup
  - Tools
  - Insights
  - More
- Checkup visual scene;
- six scan stages:
  - Preparing
  - File Details
  - File Sizes
  - Duplicates
  - Modified Dates
  - Finalizing
- animated file tiles flying toward the tablet;
- file-tile symbols for:
  - document
  - image
  - video
  - audio
  - folder
- original glass icons;
- premium clinical/editorial styling.

Do not redesign these simply because Android features are being added.

## 6.3 App icon contract

The launcher icon must come directly from the approved PWA source:

`assets/icons/app-icon-192.png`

Approved Git blob SHA-1:

`f9cff58fc54e6b0525c7f74922b0588aca6a9a9d`

Do not:

- redraw;
- regenerate;
- crop differently;
- zoom into the bear;
- cut off the body/tablet/thumb;
- replace with another Dr. Bear illustration;
- use a screenshot crop.

If adaptive masking is required, preserve the original composition inside the safe zone.

---

# 7. CURRENT ANDROID FRONTEND ASSEMBLY

At B27 production, `app/build.gradle.kts`:

- downloads the pinned legacy archive if not cached;
- verifies critical legacy files/assets by Git blob SHA-1;
- copies the approved PWA into generated Android assets;
- overlays Android behavior through focused adapters rather than rebuilding the PWA;
- injects the current Android modules for native behavior, review, support, scan trust, live scan, media review and premium color;
- copies native assets under generated `assets/native`;
- creates the launcher resource directly from the approved PWA icon.

B26 adds two isolated monetization modules:

- `android-entitlement.js` — early capture guard and frontend entitlement API;
- `android-pro-ui.js` — Pro presentation, locked-state explanation and debug-only entitlement QA controls.

B26 also introduces native `EntitlementManager.kt` as the single access-policy source of truth and exposes that state through `NativeBridge.kt`.

The B26 script-order contract is intentional: entitlement guard first, normal Android adapters next, Pro UI after them. This lets Free-state Pro actions be intercepted before normal mode handling while keeping presentation isolated from scanner logic.

B27 adds one final presentation-only module:

- `android-readability.js` — centralized typography, contrast, leading and spacing overrides across Android surfaces.

The B27 readability module must load last. It may improve legibility and spacing, but it must not own scan behavior, entitlement decisions, deletion behavior, support actions or business logic.

B28 adds one isolated first-class feature module:

- `android-cleanup.js` — the complete Quick Clean vertical slice for the Home/Tools Cleanup entry points.

Quick Clean must load after the entitlement guard and before generic Android tool handling so its dedicated Cleanup entry points are captured without rewriting the approved PWA shell. It may call the existing native scan/review/delete bridge, but it must not duplicate scanner rules or create a second deletion engine.

This architecture exists specifically to prevent visual drift, monetization logic sprawl and future typography fixes being scattered across unrelated feature modules. Do not replace it with a hand-rebuilt frontend or scattered purchase checks without explicit approval and a strong architectural reason.

---

# 8. SCAN-MODE ARCHITECTURE

Scope and depth are distinct concepts.

## 8.1 Quick Scan

Quick must scan **all accessible shared storage** within Android’s legitimate access boundary.

Quick depth:

- metadata;
- lightweight deterministic rules;
- no content read;
- no duplicate hashing.

Quick may legitimately finish fast, but it must never scan only a hidden subset while claiming whole accessible storage.

## 8.2 Smart Scan

Smart is the recommended default.

Smart performs:

- all accessible shared storage;
- metadata/rule analysis;
- bounded real content sampling on readable non-empty files;
- focused exact duplicate verification in high-value locations where appropriate.

## 8.3 Deep Scan

Deep performs the deepest legitimate analysis supported by current architecture:

- all accessible shared storage;
- metadata/rules;
- full streaming content read of every readable non-empty file;
- exact duplicate verification across the accessible scope.

No fake duration may be added. If Deep is fast, evidence must explain why.

## 8.4 Custom Scan

Custom lets the user choose shared-storage categories/locations and whether exact duplicate verification is needed.

Current supported custom scopes include:

- Downloads;
- Photos;
- Videos;
- Documents;
- Music.

Future Custom evolution may allow explicit depth selection, provided complexity remains controlled.

---

# 9. SCAN TRUTH, EVIDENCE, AND PROGRESS

No artificial `sleep`, minimum-duration trick, or animation pacing may be used to make a scan “look real.”

Progress must derive from actual work.

Useful evidence includes:

- roots scanned;
- directories visited;
- files discovered;
- files reviewed;
- total bytes;
- inaccessible folders;
- unreadable files;
- missing-during-scan files;
- expected content bytes;
- content bytes actually read;
- content files probed;
- fully read files;
- partial reads;
- read failures;
- hashed files;
- hashed bytes;
- hash failures;
- duplicate groups;
- verified duplicate copies;
- scan duration;
- actual coverage status.

Deep must not report complete/full coverage when actual full-read coverage is partial.

When total work is unknown, use an honest indeterminate state rather than inventing a whole-device percentage.

---

# 10. FILE CLASSIFICATION AND CLEANUP CAPABILITY

Perfect V1 must ultimately include first-class user experiences for:

1. One-Tap Smart Checkup
2. Quick Clean
3. Exact Duplicate Cleaner
4. Large Files
5. Older Files
6. Downloads
7. Temporary / incomplete downloads
8. APK installers
9. Archives
10. Empty folders
11. Zero-byte files
12. Screenshot/media review
13. Manual file browser
14. Storage overview
15. Cleanup history
16. Privacy dashboard

The scanner currently recognizes many of these categories, but **scanner recognition does not automatically mean the dedicated UI/workflow is complete**. Do not overstate V1 completeness.

## 10.1 Quick Clean vertical-slice contract

B28 makes Quick Clean the first Home quick tool that must operate as a complete production workflow rather than a placeholder.

Quick Clean must:

- use the latest in-memory native review snapshot when one exists;
- offer a real Smart Checkup when no review snapshot exists;
- never create fake cleanup candidates or estimated reclaim totals;
- request only the native `lowrisk` review category, which maps to `autoCleanEligible` candidates;
- keep large files, older files, APKs, archives and verified duplicates out of the Quick Clean one-tap list because those categories require separate review workflows;
- allow explicit selection, select-all for the currently shown safe batch, and clearing selections;
- block destructive action when the review snapshot is older than 15 minutes and require a fresh Smart Checkup first;
- preserve the native per-batch deletion limit of 500 items;
- require a final confirmation before deletion;
- delete only IDs issued by the current native review snapshot;
- rely on native verified deletion and count only successfully removed bytes as reclaimed space;
- report deletion failures and native protection events without counting them as cleanup success;
- refresh the remaining low-risk list and Home/Tools Cleanup status from the live native review snapshot after deletion;
- remain free; no safety or Quick Clean protection may be gated by Pro.

The canonical destructive sequence for Quick Clean is:

`Smart Checkup / current snapshot → Safe-candidate review → Select → Final confirmation → Native delete → Verify → Verified summary → Remaining candidates`

B28 must not rewrite `FileHealthScanner` classification logic or fork the native deletion engine merely to implement this UI. Future cleanup categories should reuse the proven review/confirm/delete/verify interaction pattern while keeping their own risk-specific rules.

## 10.2 Quick Clean premium trust/UX contract

B29 closes the perceptual-quality gap found during the first physical-device B28 review without changing scanner rules or adding artificial time.

Quick Clean live and resolved states must:

- never add fake delay, minimum duration, fake progress or fabricated scan evidence;
- show whether Quick Clean is following a live Smart Checkup/active checkup or resolving an already available review snapshot;
- expose real live evidence when a scan is running, using native progress fields such as phase, reviewed files, visited folders, bytes seen and the current item/location when available;
- explain the actual scan scope and keep the low-risk-only safety boundary visible;
- use the available viewport for meaningful trust information rather than leaving large visually empty regions;
- treat a zero-low-risk result as a useful verified outcome, not a dead end;
- show the actual snapshot age and scan mode on the zero-low-risk result;
- query the current review snapshot for duplicate, large-file and older-file counts and surface only categories that actually contain review items;
- route those next steps into the existing review surfaces without claiming those dedicated workflows are already complete;
- keep review-first categories separate from Quick Clean deletion;
- use immediate, subtle resolved-state motion only as presentation; animation must never hold back a result that is already available;
- preserve reduced-motion behavior;
- keep Quick Clean free and preserve all deletion, entitlement and privacy contracts.

The preferred trust model is:

`Fast because the real work finished` — never `Slow because the UI pretended to work`.

B29 is a presentation/integration refinement of the B28 vertical slice. It must not modify `FileHealthScanner.kt`, the native deletion engine, duplicate verification rules or entitlement decisions merely to make the screen feel busier.

---

# 11. EXACT DUPLICATE RULE

Duplicate detection must use evidence:

`exact size → candidate group → streaming SHA-256 → verified duplicate`

Rules:

- same size alone is not a duplicate;
- filenames are not proof;
- exact duplicate must be byte-for-byte verified;
- keep at least one copy;
- never auto-select every copy in a duplicate group;
- verified duplicate reclaimable space equals only extra copies that can be safely removed while preserving at least one.

---

# 12. JUNK CONFIDENCE AND DELETION RISK

These are separate concepts.

## 12.1 Junk-confidence concepts

- Verified / Safe Candidate
- Likely Junk
- Review Candidate
- Not Junk / Keep

## 12.2 Deletion-risk levels

- `0 — Safe`
- `1 — Low Risk`
- `2 — Review`
- `3 — High Risk`
- `4 — Protected / Never Auto-Select`

Large, old, APK, archive, media, and unfamiliar files are not junk merely because of size, age, extension, or location.

---

# 13. TRUST AND ADVICE UX

Bearagnostic must actively help users understand decisions, especially beginners.

Every important cleanup category should explain:

1. what the category means;
2. why Bearagnostic surfaced it;
3. what can happen if it is deleted;
4. the recommended action.

Primary UX language:

- **Safe to clean**
- **Review first**
- **Protected**

Examples:

**Exact duplicates**  
Verified identical copies. Keep at least one copy.

**Large files**  
Large does not mean junk. Review videos, work files, backups, and other context first.

**Older files**  
Age alone is not a reason to delete.

**APK installers**  
Deleting a downloaded APK does not uninstall an already installed app; it removes the installer copy.

**Archives**  
An archive may be the only packaged copy of important files.

**Zero-byte files**  
Some apps use empty marker/placeholder files; review location/context.

Safety explanations and warnings are a fundamental protection layer and must **never be paywalled**.

---

# 14. DESTRUCTIVE FLOW

Default destructive flow:

`Select → Review → Confirm → Delete → Verify → Summary`

Rules:

- no silent destructive deletion;
- low-risk preselection is allowed only under mature, explicit rules;
- final confirmation remains required;
- high-risk items need stronger warning;
- protected items are not recommended for deletion;
- native deletion accepts only IDs from the current in-memory review snapshot;
- duplicate-group safeguard must retain at least one existing copy;
- reclaimed bytes count only successful, verified deletion;
- partial failures must be reported;
- no fake undo claim.

---

# 15. LIVE RESULT STATE

Results must be live, not a frozen snapshot after deletion.

After verified deletion:

- category counts must decrease;
- category byte totals must decrease;
- zero-count categories may disappear;
- Checkup/result counters should synchronize where appropriate;
- reclaimed space must reflect actual verified deletion;
- “scan again” is only needed for a fresh whole-device rescan, not to correct stale UI values that could have been updated directly.

---

# 16. POST-CLEANUP IMPACT

Bearagnostic may present a premium before/after “Cleanup Impact” experience using measurable values only.

Allowed examples:

- verified bytes reclaimed;
- free storage before/after;
- files removed;
- verified duplicate copies resolved;
- protected copies kept;
- percentage of known low-risk cleanup resolved, where the denominator is explicit and factual.

Disallowed:

- fabricated “speed improved %”;
- fabricated device-health score;
- unsupported CPU/RAM performance claims.

Share Result is encouraged as a privacy-safe free feature. Shared data should be aggregate only, for example:

- space reclaimed;
- files removed;
- duplicate copies resolved;
- storage headroom before/after.

Never share:

- filenames;
- paths;
- hashes;
- private file metadata.

---

# 17. DR. BEAR FUNCTIONAL ILLUSTRATION SYSTEM

Dr. Bear is a trust/guidance system, not random decoration.

Approved mapping:

- `drbear-inspect` → scan mode, analysis, diagnostic/insight contexts;
- `drbear-review` → uncertainty, review-needed, empty/incomplete/permission contexts;
- `drbear-success` → successful cleanup, all-good, completion, thank-you;
- `drbear-caution` → destructive confirmation, warning, protected/high-risk action;
- full Bearagnostic brand illustration/logo → launch, About, brand/promo/share surfaces only.

Rules:

- use illustrations sparingly;
- never make an action workspace less usable just to show mascot art;
- do not place mascot art in a file-review list if it steals space from the actual task;
- preserve approved artwork; do not casually redraw/crop/reinterpret it.

B19 intentionally removes the mascot/advice block from the file-review workspace to maximize useful file-list area.

---

# 18. RESULTS AND REVIEW SURFACES

Results should answer immediately:

1. What did Bearagnostic find?
2. What should I do first?
3. What needs caution?

Results should be a premium decision dashboard, not merely totals.

File Review is an action workspace:

- compact title/summary;
- large scrollable file-list area;
- clear selection state;
- clear risk language;
- fixed action footer;
- no visual clutter or unrelated marketing art;
- no underlying Checkup scene bleeding through.

B19 introduces a dedicated `android-review.js` to enforce this workspace behavior.

---

# 19. HOME EVOLUTION

The original Home remains the approved visual baseline, but Android capabilities have grown and Home should evolve carefully.

Future Home may surface:

- Storage Headroom;
- Last Checkup;
- Space Reclaimed;
- Recommended Next Action;
- Since Last Checkup;
- concise cleanable-item summary.

Do not put every tool on Home.

Maintain disciplined hierarchy:

- primary Checkup action;
- four high-value quick tools;
- File Health / Storage Overview;
- contextual recommendation;
- bottom navigation.

The full catalog belongs under Tools.

---

# 20. INSIGHTS EVOLUTION

Insights must never invent data.

Once real local history exists, useful Insights may include:

- cleanup-history aggregates;
- reclaimed-space trend;
- free-storage trend;
- category growth;
- comparison with last checkup;
- evidence-based recommendations.

Future Pro features may include:

- Space Guard;
- scheduled checkup/monitoring consistent with Android restrictions and policy.

No filename/path history should be stored merely for analytics.

---

# 21. MORE / PREFERENCES / NAVIGATION

## 21.1 More

Native Android should use a purposeful title such as:

`Settings & Support`

Do not repeat the word “Bearagnostic” as a redundant second-level heading directly beneath the main Bearagnostic header.

`Close Bearagnostic` is not a useful native-Android product action and should remain hidden/removed.

Version/build labels must come from current runtime/build state and never display stale legacy PWA versions.

## 21.2 Preferences

Preferences should use available space meaningfully without padding it with decorative clutter.

Native-relevant groups include:

- Language;
- Motion;
- Scan & Analysis;
- Cleanup Safety;
- Privacy & Access;
- storage permission status;
- app/version information;
- Plan / Free-Pro entitlement status.

Legacy browser-only settings such as “Browser Full Screen” do not belong in the native app.

## 21.3 Header actions

When Checkup hides bottom navigation, Home and Settings/Gear should form one balanced action cluster with professional spacing and optical weight.

Do not show redundant Home shortcuts on every screen when bottom navigation/back navigation already solves the task.

---

# 22. SUPPORT, PRO ENTRY, AND EXTERNAL ACTIONS

The commercial direction is now Free + lifetime Pro for Google Play.

For the Google Play distribution path:

- the primary commercial entry is **Bearagnostic Pro**;
- Pro digital entitlement must be purchased through Google Play Billing when Billing is enabled;
- Ko-fi and PromptPay must not be presented as an alternate path to unlock Pro;
- the Play-facing product should not surface voluntary external-payment Support alongside the Pro purchase path unless a later current-policy review explicitly justifies it.

The existing Ko-fi / PromptPay support implementation is preserved in source for future non-Play/direct distribution and historical continuity. It does not grant Pro entitlement and must never be interpreted as proof of purchase.

B26 repurposes the visible `Support Bearagnostic` row in the current development UI into a `Bearagnostic Pro` entry while retaining the underlying support module untouched. This avoids destructive removal before a future distribution-channel split is finalized.

External URL opening must remain allow-listed. Support code must never affect analysis quality, cleanup recommendations, safety, scan depth entitlement, or purchase ownership.

---

# 23. PRIVACY MODEL

Default posture:

- local-first;
- file analysis stays on device;
- no upload of file contents;
- no remote filename inventory;
- no behavioral ad SDK;
- no hidden telemetry;
- no Bearagnostic account requirement for Free or lifetime Pro;
- no email/password requirement for core cleaning or Pro ownership;
- no persistent complete file tree;
- no unnecessary persistent hashes;
- no sensitive filename/path analytics.

Minimal aggregate history is acceptable when it improves the product.

For Play purchases, Google Play owns the payment/account transaction. Bearagnostic should consume only the minimum purchase/entitlement data required to determine access and must not introduce an unnecessary parallel account system.

Network use must be explicit and narrow, for example:

- future Google Play Billing and entitlement restoration;
- non-Play/direct voluntary support actions where intentionally enabled;
- other clearly disclosed user-requested functions.

---

# 24. FREE / PRO ARCHITECTURE — LOCKED DIRECTION

Bearagnostic uses one application with two entitlement states:

`FREE → PRO`

There is no separate Pro APK and no user-facing “Pro Mode” toggle. Pro is an ownership entitlement.

The permanent architecture rule is:

> **Feature code asks one centralized entitlement layer. Payment providers only update ownership.**

Never scatter ad-hoc `if (pro)` checks throughout unrelated code.

B26 establishes `EntitlementManager` as the native source of truth and `BearagnosticEntitlement` as its frontend access layer. Release builds default to Free until verified Play Billing ownership is integrated. Debug builds may locally emulate Free or Pro solely for QA; release builds must never expose that switch.

## 24.1 Free tier — genuinely useful

Free must support a complete trustworthy cleaning journey rather than functioning as a crippled demo.

Free includes:

- Quick Scan;
- Smart Scan as the recommended default using the real Smart depth defined in this plan;
- basic cleanup and current category review;
- focused exact-duplicate verification performed by Smart where applicable;
- normal local media thumbnails/review already available to the base workflow;
- scan evidence and truthful FULL/PARTIAL/coverage reporting;
- deletion-risk explanations;
- Safe to clean / Review first / Protected guidance;
- destructive confirmation;
- duplicate keep-one-copy protection;
- verified deletion and measured reclaimed space;
- current-session Cleanup Impact;
- privacy-safe aggregate Share Result;
- basic storage/current-checkup information as implemented;
- no ads.

Free users must be able to scan, review, delete eligible selected files and see verified results without purchasing Pro.

## 24.2 Pro tier — deeper diagnostics and advanced control

The first implemented Pro gates are:

- **Deep Scan** — full streaming content read of every readable non-empty file within the accessible scope plus exact duplicate verification across that accessible scope;
- **Custom Scan** — user-selected shared-storage categories/scopes with optional exact duplicate verification.

Planned Pro capabilities, which must not be marketed as complete until implemented, are:

- advanced exact-duplicate workflow;
- advanced media review, filtering and sorting;
- historical Insights;
- What Changed between checkups;
- full cleanup history;
- custom exclusions / “never review here” controls;
- scheduled checkup reminders consistent with Android restrictions and policy;
- other genuinely advanced tools that earn their complexity.

A locked Pro feature should remain visible when useful for product discovery, but tapping it must explain the value cleanly rather than using aggressive interruption or fear.

## 24.3 Ownership and pricing model

Launch direction:

- **one-time lifetime Pro purchase**;
- no subscription at launch;
- no ads in Free or Pro;
- no Bearagnostic account/login requirement;
- Google Play Billing is the ownership/payment path for the Play-distributed app;
- canonical planned product ID: `bearagnostic_pro_lifetime`;
- target Thailand standard price: **฿249**;
- target Thailand founding-launch promotional price: **฿149** when intentionally configured;
- other markets should use deliberate local pricing/purchasing-power review rather than naïve currency conversion.

The runtime UI must **not hard-code a selling price**. Once Billing is integrated, visible price and offer text must come from current Google Play `ProductDetails` / offer configuration so currency, taxation, localization and future price changes remain correct.

## 24.4 Never paywall safety

Never paywall:

- deletion-risk explanations;
- protected-item logic;
- confirmation;
- duplicate keep-one-copy safeguard;
- consequence warnings;
- truthful scan/coverage status;
- privacy disclosure required to understand what the app does.

Safety is a trust boundary, not a monetization lever.

## 24.5 Entitlement enforcement

For implemented Pro capabilities, entitlement must be enforced below presentation as well as communicated in UI.

B26 native enforcement blocks Free users from starting Deep or Custom scans even if UI routing is bypassed. The frontend guard exists for good UX, not as the sole access-control layer.

Future Play Billing must update this centralized ownership layer after verified purchase state rather than teaching scanner, review or Insights code about payment mechanics directly.

---

# 25. GOOGLE PLAY AND RELEASE TRUTH

Bearagnostic is intended for Google Play.

Before release:

- verify current Google Play policy using current official sources;
- pay particular attention to broad storage / `MANAGE_EXTERNAL_STORAGE`;
- verify whether the app’s core file-management purpose satisfies current policy;
- ensure Data Safety answers match actual behavior;
- use a proper production release signing identity;
- do not ship the public development debug keystore as the Play release identity;
- test release/AAB behavior separately from debug APK;
- integrate and verify the current Google Play Billing Library before accepting Pro purchases;
- retrieve product/offer pricing from Play rather than hard-coding currency text;
- handle purchase, pending state, acknowledgement, restoration, refund/revocation and lifecycle synchronization truthfully;
- never grant Play Pro entitlement from Ko-fi, PromptPay, a screenshot, a manually typed license key, or an unverified local flag;
- keep debug entitlement overrides impossible to expose in release builds.

Current stable debug signing exists only for development continuity.

B26 is an entitlement/UX foundation and **does not claim Google Play Billing is connected or that purchases can be accepted yet**.

---

# 26. PERFORMANCE ENGINEERING

Requirements:

- filesystem work off the UI thread;
- iterative traversal;
- streaming reads/hashing;
- bounded memory;
- cancellation;
- progress throttling;
- graceful inaccessible-file handling;
- temporary inventory cleanup;
- no whole-file in-memory hashing for large files;
- no fake waiting.

A scan completing quickly is not itself a defect if the work/evidence proves it is real. A scan completing quickly while silently skipping intended scope is a defect.

---

# 27. LOCALIZATION

Supported interface languages:

- English
- Japanese
- Thai

Any visible copy addition/change must be reviewed in all three languages.

Do not allow a new Android overlay/module to become English-only unless explicitly marked as a temporary development surface that will not be shipped.

Thai text should be natural, not literal machine-style translation.

---

# 28. ACCESSIBILITY AND RESPONSIVE QUALITY

Requirements:

- portrait-first;
- no horizontal overflow;
- safe areas respected;
- touch targets comfortable;
- readable text on common Android phone widths;
- reduced-motion support;
- no meaning conveyed by color alone;
- critical actions not too close to system navigation;
- high enough contrast for practical use;
- screens should use available space intentionally;
- no large dead zones that make a production surface look unfinished;
- no excessive scrolling where a carefully composed single-screen view is expected.

Readability rules:

- essential body copy and explanatory text must be readable without deliberate squinting on common Android phone widths;
- do not use ultra-light gray text merely to create a premium look; hierarchy must come from spacing, weight and restrained contrast;
- functional body copy should normally sit in the approximately 11.5–14 px range, with comfortable leading around 1.4–1.6 depending on script and density;
- essential explanatory text should not be compressed into sub-9 px micro-type just to preserve a layout;
- decorative brand microtext, nonessential footer/build metadata and highly constrained progress labels may be smaller when their role is genuinely secondary;
- Thai and Japanese require enough line height and vertical breathing room for comfortable reading;
- content-heavy surfaces such as Pro, Preferences, Privacy, About and detailed evidence should prefer scrolling over shrinking important text;
- Home and active Checkup may preserve approved zero-scroll compositions, but should reclaim decorative/padding space before shrinking functional copy below a comfortable reading size;
- typography QA must review font size, weight, contrast, leading, wrapping, truncation and section spacing together rather than changing font size alone.

Premium means hierarchy and restraint, not density for its own sake.

---

# 29. REGRESSION-PROTECTION POLICY

Any change with meaningful regression risk needs a fallback/rollback plan before implementation.

Before editing:

1. identify the known-good baseline;
2. inspect the actual affected files;
3. define a changed-file allowlist;
4. state LOW / MEDIUM / HIGH risk;
5. identify stable behavior that must not change;
6. prefer isolated, minimally invasive modifications.

Do not “fix” a local issue by rebuilding unrelated stable systems.

Critical protected areas include:

- app launch;
- Benedict Interactive opening;
- product opening;
- original app icon;
- Home composition;
- core PWA visual language;
- scanner scope/evidence;
- destructive safeguards;
- support actions;
- working CI/build pipeline.

If risk cannot be controlled, redesign or split the batch.

---

# 30. DELIVERY CONTRACT

This is a hard operating requirement.

When P’Benz requests implementation/package work:

- **Do not make P’Benz wait a long time and end the turn without a downloadable file.**
- Prefer a smaller complete safe batch over a broad unfinished batch.
- Do not finish with only “I am checking”, “almost done”, or a status report.
- If a requested batch is being built, produce the actual package in the same turn whenever tooling permits.
- Never invent a download link, checksum, QA result, or file.
- If an unavoidable tooling failure prevents packaging, say exactly what failed and do not claim completion.

Every normal implementation batch delivery must include:

1. downloadable repo-relative ZIP;
2. changed-file allowlist;
3. versionCode/versionName for runtime changes;
4. risk level;
5. QA performed;
6. clear statement of what was not tested;
7. rollback baseline when relevant;
8. SHA-256;
9. commit name in a Markdown code block;
10. commit name **50 characters or fewer**.

Example:

```text
Improve cleanup trust and review
```

Default ZIP rules:

- changed files only;
- repository-relative paths;
- no wrapper folder;
- no duplicate `v2/final/backup` files.

---

# 31. QA TRUTH

Possible QA layers:

### Static QA
Syntax, structure, IDs, paths, asset references, version coherence, localization keys.

### Compile / CI QA
Android build success in GitHub Actions.

### Runtime simulation
Useful where available, but not equivalent to a physical Android device.

### Physical Android QA
Only PASS when tested on an actual Android device with real evidence.

Never claim physical PASS based on CI/static checks.

Destructive tests must use expendable test files.

---

# 32. CURRENT B26 ENTITLEMENT PHYSICAL TEST CHECKLIST

After B26 is uploaded and CI succeeds, physical-device QA should verify:

1. Cold-start launch and both approved opening sequences remain unchanged.
2. Home, Checkup, Results and Review retain B25 behavior and visual quality.
3. Smart remains Recommended and starts normally in Free state.
4. Quick starts normally in Free state.
5. Deep shows a clear Pro marker and opens the Pro explanation instead of starting in Free state.
6. Custom shows a clear Pro marker and opens the Pro explanation instead of starting in Free state.
7. Native bridge independently rejects a Free Deep/Custom request with `pro_required`.
8. More shows `Bearagnostic Pro` rather than voluntary Support in the development UI.
9. Pro presentation distinguishes features available now from roadmap capabilities.
10. No price is fabricated or hard-coded into the purchase CTA.
11. Safety-free guarantee is visible and understandable.
12. Preferences shows current plan status without crowding the screen.
13. Debug build exposes Free/Pro test controls only inside the Pro development surface.
14. Switching debug entitlement to Pro immediately unlocks Deep and Custom.
15. Switching back to Free immediately restores both gates.
16. Debug entitlement survives a normal app restart for repeatable QA.
17. Release configuration contains no user-accessible entitlement test switch.
18. EN / JA / TH Pro copy remains usable and does not overflow.
19. Existing scanner evidence and destructive safeguards remain unchanged.
20. No crash, blank screen, click-through into legacy Support, or modal stacking defect occurs.

Until device testing covers these points, B26 must be described as **Static QA PASS / CI pending / Physical QA pending**.

---

# 33. CURRENT ROADMAP AFTER B25

## B26 — Monetization Foundation

Approved scope:

- lock the Free + lifetime Pro commercial direction;
- introduce centralized native entitlement architecture;
- expose a focused frontend entitlement API;
- enforce current Pro gates for Deep and Custom below the UI;
- add premium Pro discovery/explanation UX;
- replace the visible voluntary Support entry with Bearagnostic Pro for the Play direction;
- add debug-only Free/Pro QA controls;
- keep Billing disconnected until entitlement behavior is stable;
- preserve scanner/deletion/media/support internals that do not require change.

## Next — Google Play Billing / Ownership Lifecycle

Only after B26 behavior is stable on-device:

- verify current Play Billing and payments policy again at implementation time;
- add current Google Play Billing Library dependency;
- configure/read `bearagnostic_pro_lifetime` ProductDetails;
- render current localized Play price/offer;
- launch Play purchase flow;
- handle purchased and pending states;
- acknowledge qualifying purchases correctly;
- restore ownership on reinstall/new device using the purchasing Google account;
- synchronize refund/revocation/ownership changes;
- connect verified ownership to `EntitlementManager`;
- ensure release builds have no debug entitlement path.

## Then — Pro Value Expansion

Build advanced Pro capabilities only when each is truthful and complete:

- advanced exact duplicates;
- advanced media review/filtering;
- historical Insights / What Changed;
- full cleanup history;
- custom exclusions;
- scheduled checkup reminders.

## Release hardening

Then:

- remaining Perfect V1 tool UX;
- current Play policy review;
- AAB/release signing;
- Data Safety;
- physical-device matrix;
- purchase/restore/refund test matrix;
- destructive-flow test matrix;
- performance/large-storage QA;
- accessibility/localization QA;
- store-ready assets/copy.

---

# 34. KNOWN PROJECT LESSONS THAT MUST NOT BE REPEATED

Earlier Android iterations failed because they treated the HTML/PWA as visual inspiration instead of source of truth. This caused:

- wrong launcher icon;
- wrong mascot crop;
- launch regressions;
- missing Benedict Interactive/product opening details;
- Home mismatches;
- scroll-heavy layouts;
- poor white-space usage;
- blank flying-file tiles;
- scanner modes that were too shallow;
- results that only reported totals without useful next actions.

The corrective architectural lesson is permanent:

> **Preserve the approved PWA literally first. Add Android capabilities as isolated layers.**

Do not regress to “recreate it by eye.”

---

# 35. REVISION HISTORY

## Revision 2.4 — 10 September 2026

Quick Clean premium trust/UX alignment after physical-device B28 review:

- records B28 commit `bc2a3d04426619bc3b260e78aec614d7060576af` and GitHub Actions run #32 as the known-good production baseline before B29;
- records that the B28 live-scan and zero-low-risk states worked on device but were visually too sparse and did not explain very fast completion strongly enough;
- requires live Quick Clean to surface real native scan evidence rather than a lone spinner;
- requires zero-low-risk results to show useful verified context, snapshot age and source scan mode;
- adds truthful next-step discovery from actual duplicate, large-file and older-file counts in the current review snapshot;
- explicitly forbids artificial scan delay or fake progress as a solution to fast completion;
- preserves the B28 safety/deletion architecture and makes B28 the rollback baseline for B29.

## Revision 2.3 — 10 September 2026

Quick Clean completion alignment after B27:

- records B27 and GitHub Actions run #31 as the current known-good production baseline before B28;
- establishes `android-cleanup.js` as the isolated first-class Quick Clean vertical slice;
- connects the Home and Tools Cleanup entry points to real native Smart Checkup/review/delete data rather than placeholder behavior;
- limits Quick Clean to native `lowrisk` / `autoCleanEligible` candidates only;
- explicitly excludes large, old, APK, archive and exact-duplicate review categories from Quick Clean;
- requires a fresh scan before destructive action when the review snapshot is older than 15 minutes;
- preserves the 500-item reviewed deletion batch limit and current-snapshot ID contract;
- requires Select → Review → Confirm → Delete → Verify → Summary behavior and truthful failure reporting;
- keeps Quick Clean free and preserves all existing safety, entitlement and scanner boundaries;
- sets B27 as the rollback baseline for B28.

## Revision 2.2 — 10 September 2026

App-wide readability alignment after B26:

- records B26 and GitHub Actions run #30 as the current known-good production baseline before B27;
- establishes a centralized final presentation-only readability layer instead of scattering typography fixes across feature modules;
- prioritizes Pro, Checkup and Home readability while covering secondary screens, results, evidence, review, preferences, privacy and feedback surfaces;
- requires stronger functional-text contrast, more comfortable leading and deliberate section spacing;
- prefers scrolling over micro-type on content-heavy sheets;
- preserves the approved zero-scroll Home and active Checkup compositions while protecting functional readability;
- explicitly allows smaller typography only for genuinely decorative/nonessential metadata or tightly constrained secondary progress labels;
- adds Thai/Japanese line-height guidance and holistic typography QA requirements.

## Revision 2.1 — 10 September 2026

Commercial/entitlement alignment after B25:

- records B25 as the known-good production baseline before B26;
- locks one-app Free + lifetime Pro direction;
- keeps Smart fully useful and Recommended in Free;
- assigns Deep and Custom as the first implemented Pro capabilities;
- locks no ads, no Bearagnostic account and no subscription at launch;
- records target Thailand standard/founding prices while forbidding hard-coded runtime price text;
- establishes `bearagnostic_pro_lifetime` as the planned Play product ID;
- formalizes centralized native entitlement and debug-only QA override rules;
- reserves safety, warnings, protected logic and truthful coverage for all users;
- moves Play-facing commercial UX from voluntary Support toward Bearagnostic Pro;
- preserves Ko-fi/PromptPay code for possible non-Play/direct distribution without granting entitlement;
- updates the next milestone to Google Play Billing and ownership lifecycle after B26 device stability.

## Revision 2.0 — 9 September 2026

Major alignment update after B17–B19:

- records B19 production/CI state;
- locks literal PWA frontend source-of-truth;
- formalizes Quick / Smart / Deep / Custom;
- formalizes scan evidence and coverage truth;
- formalizes Trust & Advice UX;
- formalizes live result state and verified deletion;
- formalizes Cleanup Impact and privacy-safe sharing;
- formalizes functional Dr. Bear illustration mapping;
- records native Support behavior;
- formalizes Free/Pro entitlement principles;
- adds strict regression-protection rules;
- adds strict same-turn delivery/package contract;
- records B19 physical-test checklist;
- updates roadmap to B20 Home/Insights/Entitlement foundation, then Billing.

## Revision 1.0 — 8 September 2026

Initial Android project operating contract.

---

# 36. FINAL NORTH STAR

Every meaningful decision should answer:

- Is it truthful?
- Is it useful?
- Is it safe?
- Is it visually 10/10?
- Does it preserve what already works?
- Is it simpler than the alternative?
- Can a normal user understand what happens next?
- Can we prove the numbers shown?
- Does it move Bearagnostic toward a premium daily-use maintenance product rather than a gimmicky cleaner?

When uncertain, protect user data, preserve stable production, and prefer evidence over spectacle.
