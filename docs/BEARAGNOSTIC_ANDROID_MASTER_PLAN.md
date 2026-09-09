# BEARAGNOSTIC ANDROID MASTER PLAN

**Repository:** `grolygori789-crypto/bearagnostic-android`  
**Canonical file:** `docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`  
**Revision:** 2.0  
**Revision date:** 9 September 2026  
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

# 3. CURRENT VERIFIED PRODUCTION SNAPSHOT — BATCH 19

This section is a snapshot and must never override newer GitHub production.

As of 9 September 2026:

- branch: `main`
- latest commit: `6e3a24afea3153e4d8458c81ad659dd8b6f27f02`
- commit message: `Fix review layout and support actions`
- parent: `57a9a60f1c36592613b6841e4be587fd2575aa66`
- Android version: `0.19.0-alpha19`
- `versionCode`: `19`
- application ID: `com.benedictinteractive.bearagnostic`
- debug application ID: `com.benedictinteractive.bearagnostic.debug`
- compileSdk: `36`
- targetSdk: `36`
- minSdk: `26`
- Java compatibility: `17`
- Native Bridge version: `8`
- latest GitHub Actions debug APK run for B19: **SUCCESS**
- B19 physical-device QA: **PENDING**
- P’Benz has downloaded B19 and is about to test it.

The latest B19 CI-success workflow is run #22, associated with commit `6e3a24a…`.

Never call B19 physically verified until P’Benz supplies real device evidence.

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

At B19, `app/build.gradle.kts`:

- downloads the pinned legacy archive if not cached;
- verifies critical legacy files/assets by Git blob SHA-1;
- copies the approved PWA into generated Android assets;
- injects focused Android scripts:
  - `android-native.js?v=19`
  - `android-review.js?v=19`
  - `android-support.js?v=19`
- copies native assets under generated `assets/native`;
- creates the launcher resource directly from the approved PWA icon.

This architecture exists specifically to prevent visual drift that occurred in earlier Android reimplementations.

Do not replace it with a hand-rebuilt frontend without explicit approval and a strong architectural reason.

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
- future Plan & Subscription.

Legacy browser-only settings such as “Browser Full Screen” do not belong in the native app.

## 21.3 Header actions

When Checkup hides bottom navigation, Home and Settings/Gear should form one balanced action cluster with professional spacing and optical weight.

Do not show redundant Home shortcuts on every screen when bottom navigation/back navigation already solves the task.

---

# 22. SUPPORT AND EXTERNAL ACTIONS

Support is voluntary and must never change analysis quality, limits, safety, or cleanup recommendations unless the commercial model is explicitly redesigned later.

Current B19 support architecture:

- `android-support.js` captures legacy PWA support actions;
- Ko-fi opens via native `ACTION_VIEW` through an allow-list;
- PromptPay “Open QR” opens an allow-listed HTTPS URL externally;
- PromptPay “Save QR” uses native Android `DownloadManager`;
- Android <= P requests legacy write permission before saving;
- saved QR goes to public Downloads.

Current pinned PromptPay QR source:

`https://raw.githubusercontent.com/grolygori789-crypto/little-ganesha-tarot/f21e6a4c81812276d661d6ebb0a3e6c86c6cf48b/assets/support/promptpay-qr.png`

Important: as of B19, the QR is **not** bundled fully local inside the APK. Do not claim otherwise.

Future release hardening may replace this with a verified local-bundled QR if that improves reliability and privacy without unnecessary complexity.

External URL opening must remain allow-listed.

---

# 23. PRIVACY MODEL

Default posture:

- local-first;
- file analysis stays on device;
- no upload of file contents;
- no remote filename inventory;
- no behavioral ad SDK;
- no hidden telemetry;
- no account requirement for core cleaning;
- no persistent complete file tree;
- no unnecessary persistent hashes;
- no sensitive filename/path analytics.

Minimal aggregate history is acceptable when it improves the product.

Network use must be explicit and narrow, for example:

- user-initiated support links;
- future Google Play Billing;
- other clearly disclosed user-requested functions.

---

# 24. FREE / PRO ARCHITECTURE

The product is planned to support Free and Pro.

Do not bolt monetization onto the UI at the end. Use a centralized entitlement layer before Billing.

Never scatter ad-hoc `if (pro)` checks throughout unrelated code.

## 24.1 Planned Free tier

Free should deliver real value, potentially including:

- Quick;
- basic/reasonably limited Smart;
- basic cleanup;
- safety advice;
- risk warnings;
- confirmation;
- Share Result;
- basic history/insights.

## 24.2 Planned Pro tier

Pro may include:

- unlimited Smart;
- Deep;
- Custom;
- advanced review/filter;
- richer history;
- richer Insights;
- Space Guard;
- scheduled checkups;
- complete advanced toolset.

## 24.3 Never paywall safety

Never paywall:

- deletion-risk explanations;
- protected-item logic;
- confirmation;
- duplicate keep-one-copy safeguard;
- consequence warnings;
- truthful scan/coverage status.

Pricing, billing period, trial/offer structure, and final entitlement boundaries are not yet locked and must not be invented.

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
- verify Billing using current Google Play Billing guidance before monetization.

Current stable debug signing exists only for development continuity.

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

# 32. CURRENT B19 PHYSICAL TEST CHECKLIST

P’Benz is about to test B19. The next development room should expect feedback against this list.

1. Cold-start launch works reliably.
2. Benedict Interactive opening appears correctly.
3. Bearagnostic product opening appears correctly.
4. Launcher icon matches original PWA icon exactly, with no bad crop.
5. Home retains approved legacy visual quality.
6. Checkup Home + Gear spacing/weight looks intentional.
7. Quick uses all accessible shared storage and reports honest evidence.
8. Smart performs real bounded sampling and appropriate duplicate verification.
9. Deep performs full streaming reads and exact duplicate verification where accessible.
10. Deep reports FULL/PARTIAL truthfully.
11. Flying file tiles display document/image/video/audio/folder symbols.
12. Results are actionable, not totals-only.
13. Review workspace uses most of the screen for the file list.
14. No mascot/advice block steals file-list space in B19.
15. Review list scrolls correctly.
16. Selection/footer/delete controls remain visible and unclipped.
17. Duplicate deletion retains at least one copy.
18. Actual deleted count and reclaimed bytes update after deletion.
19. Post-clean impact shows measured values only.
20. Share sheet opens correctly.
21. More title is `Settings & Support` (localized).
22. No stale `v0.2.0 · Build 11` remains.
23. Preferences contain useful native groups and no Browser Full Screen.
24. PromptPay support hub works online.
25. Open QR works.
26. Save QR uses native Android flow and reaches Downloads.
27. Ko-fi opens externally.
28. EN / JA / TH remain usable.
29. No horizontal overflow, clipped buttons, or broken insets.
30. No crash or blank screen.

Until this device test is completed, B19 remains **CI PASS / Physical QA PENDING**.

---

# 33. CURRENT ROADMAP AFTER B19

## Immediate priority

First, complete B19 physical QA.

If defects are found:

- inspect current `main`;
- reproduce against B19 code;
- patch the smallest affected area;
- preserve all B19 behavior that already works;
- do not leap ahead to monetization while correctness is broken.

## Next planned major batch

### Batch 20 — Home / Insights / Entitlement Foundation

Planned scope:

- evolve Home with measured dynamic storage/checkup information;
- build useful Insights foundation from real local aggregates;
- introduce centralized FREE/PRO entitlement architecture;
- keep safety universally available;
- avoid Billing until entitlement behavior is stable.

### Batch 21 — Play Billing / Pro Gating

Only after entitlement architecture and core device behavior are stable:

- current Google Play Billing integration;
- Pro entitlement restore;
- plan screen;
- subscription management;
- feature gates;
- lifecycle/error handling;
- current policy verification.

### Release hardening

Then:

- remaining Perfect V1 tool UX;
- policy review;
- AAB/release signing;
- Data Safety;
- physical-device matrix;
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
