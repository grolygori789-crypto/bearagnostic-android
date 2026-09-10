# BEARAGNOSTIC ANDROID MASTER PLAN

**Repository:** `grolygori789-crypto/bearagnostic-android`  
**Canonical file:** `docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`  
**Revision:** 3.0  
**Revision date:** 10 September 2026  
**Owner / Product Authority:** P’Benz  
**Studio / Publisher:** Benedict Interactive  
**Product & Development Lead:** Biu  
**Supersedes:** Revision 2.8  

---

# 0. PURPOSE, STATUS, AND NORTH STAR

This document is the canonical operating contract for **Bearagnostic for Android**. It consolidates the product vision, current production state, visual contracts, Android architecture, scan truthfulness, cleanup safety, privacy, Free/Pro model, monetization direction, support policy, QA rules, packaging workflow, Play Store requirements, known failure modes, and the forward roadmap.

It exists so future implementation work can continue without reinterpreting the product from screenshots, old ZIPs, old chat messages, or memory.

The permanent engineering North Star is:

> **Simple architecture. Exceptional execution. Zero unnecessary complexity.**

The permanent product-quality target is:

> **10/10 perceived quality, 10/10 clarity, 10/10 practical usefulness, and zero deceptive behavior.**

The core promise is:

> **Find clutter. Explain the risk. Clean with confidence.**

Bearagnostic must feel calm, intelligent, expensive, trustworthy, clinically clear, and intentionally designed. Premium quality must come from execution, truthfulness, safety, information hierarchy, and restraint — never from visual noise, fake performance claims, or unnecessary complexity.

---

# 1. AUTHORITY, SOURCE OF TRUTH, AND DECISION ORDER

## 1.1 Product authority

P’Benz is the final Product Authority. Biu acts as Development/Product Lead with broad authority to make product, design, UX, architecture, implementation, QA, safety, monetization-architecture, and release recommendations inside the approved North Star and trust boundaries.

When a decision is ambiguous, choose the option that best preserves:

1. user trust;
2. data safety;
3. honest behavior;
4. premium usability;
5. architectural simplicity;
6. long-term maintainability;
7. the approved visual identity.

## 1.2 Conflict-resolution order

Resolve conflicts in this order:

1. latest explicit instruction from P’Benz;
2. current GitHub production on `main`;
3. this current canonical Master Plan;
4. approved assets/references;
5. repository history and verified prior packages;
6. older chat context or remembered assumptions.

Never let an old screenshot or older package override current GitHub production.

## 1.3 Mandatory GitHub-first rule

Before any substantive production change, design change, implementation, bug fix, package, architecture change, monetization change, or QA claim:

- inspect latest `main` commit;
- inspect the current tree;
- fetch this canonical Master Plan from GitHub;
- inspect the actual files that will be affected;
- inspect relevant CI status;
- establish the known-good rollback baseline;
- identify the changed-file allowlist;
- assess regression risk.

If the canonical Master Plan cannot be fetched from GitHub, **stop substantive implementation** instead of silently using a stale copy.

## 1.4 Remote-write rule

GitHub connector permission is not authorization to mutate the repository.

Default workflow:

`Inspect GitHub → modify locally → QA → package repo-relative files → P’Benz uploads manually → inspect uploaded commit → inspect CI`

Do not create, update, delete, push, merge, or otherwise mutate GitHub remotely unless P’Benz explicitly authorizes remote writes in that same turn.

Phrases such as “ทำเลย”, “ส่งไฟล์”, “อัปโหลดไฟล์มาให้”, or “ดำเนินการได้” authorize implementation/package creation, **not remote GitHub writes**.

---

# 2. CURRENT VERIFIED PRODUCTION SNAPSHOT — B33

This section is a snapshot. Newer GitHub production always wins.

As of 10 September 2026 after B33 was uploaded:

- branch: `main`
- latest commit: `4321369aa830894c82b0a84a9ab8aaabfc3681d7`
- commit message: `Polish Custom Scan mobile layout`
- parent: `53e141e2ce791db5bad64f16bce2e3c3ac75a410`
- tree: `48ef1beffebc915acfe9ff3622a4207a1410c7c5`
- Android version: `0.25.1-alpha33`
- `versionCode`: `33`
- application ID: `com.benedictinteractive.bearagnostic`
- debug application ID: `com.benedictinteractive.bearagnostic.debug`
- compileSdk: `36`
- targetSdk: `36`
- minSdk: `26`
- Java compatibility: `17`
- pinned approved legacy/PWA commit: `78a31c7752e171c0eafb63c0d0859f4072a193d6`
- approved launcher-icon Git blob SHA-1: `f9cff58fc54e6b0525c7f74922b0588aca6a9a9d`
- latest GitHub Actions workflow: `Build Android Debug APK`
- latest run at B33: run #37
- B33 CI conclusion: **SUCCESS**

### Current physical-device evidence

Physical screenshots supplied by P’Benz establish meaningful on-device evidence for:

- Home B27 premium/readability presentation;
- Quick Clean live-evidence and empty-result UX;
- Exact Duplicates populated workspaces in both Pro and Free debug-entitlement states;
- Large Files pre-scan, live Quick Scan, populated result workspace, local thumbnails, filtering/sorting presentation;
- Older Files pre-scan/live/result workspace;
- Hidden Items OFF/ON presentation, including hidden/private-labelled items in Large Files when opted in;
- Custom Scan B33 responsive redesign, location selection, duplicate-check selection, summary, full-width Start/Cancel presentation.

P’Benz reported the B33 Custom Scan redesign looks good and passed a brief device test.

### Physical-device claims that must NOT be overstated

The supplied screenshots do **not** prove complete destructive deletion verification for every Quick Clean, Duplicate, Large Files, Older Files, and hidden-item scenario. Until explicitly tested, do not call those full destructive matrices physically verified.

B33 visual/interaction evidence does not automatically prove every Custom Scan scope combination, language, cancellation case, or full scan completion path.

---

# 3. PRODUCT POSITIONING

Bearagnostic for Android is:

> **A premium, privacy-first file cleaner and file-health assistant for Android.**

It helps users:

- understand what consumes storage;
- scan accessible shared storage honestly;
- identify low-risk cleanup candidates;
- verify exact duplicate files using real evidence;
- inspect large and older files without calling them junk;
- distinguish safe-to-clean, review-first, and protected situations;
- make deletion decisions with context;
- clean only explicitly chosen or strongly justified candidates;
- verify that deletion actually occurred;
- see truthful reclaimed-space results;
- retain control at every destructive step.

It is not a generic “phone booster.”

---

# 4. EXPLICITLY REJECTED PRODUCT BEHAVIOR

Never implement or market Bearagnostic as:

- RAM booster;
- memory cleaner;
- CPU cooler;
- fake speed booster;
- battery optimizer that claims unsupported gains;
- kill-all background-app tool;
- fake antivirus;
- registry cleaner;
- root cleaner;
- private-app-cache cleaner outside legitimate Android access;
- fear-based utility that pressures users into deleting files.

Never fabricate:

- junk totals;
- scan percentages;
- health scores;
- virus counts;
- optimization success;
- “phone speed +XX%” claims;
- reclaimed bytes not verified by deletion;
- fake undo;
- fake scan delays;
- fake progress;
- fake “deep” coverage.

Performance benefits may be described only when supported by evidence, such as reclaiming storage headroom or resolving storage pressure. File deletion must never be presented as proof of CPU/RAM acceleration without measured evidence.

---

# 5. VISUAL SOURCE OF TRUTH

## 5.1 Preserve the approved PWA literally first

Approved legacy repository:

`grolygori789-crypto/bearagnostic`

Pinned approved commit:

`78a31c7752e171c0eafb63c0d0859f4072a193d6`

Permanent principle:

> **Preserve the PWA literally first. Layer Android capability on top.**

Do not recreate the approved interface “by eye” when the approved source exists.

## 5.2 Protected visual assets and composition

Preserve unless P’Benz explicitly approves a change:

- Benedict Interactive opening;
- Bearagnostic product opening;
- Bearagnostic wordmark/tagline;
- original Home composition;
- silver header gear;
- Dr. Bear approved visual identity;
- Start Checkup hero;
- quick-tool tiles: Cleanup, Duplicates, Large Files, Older Files;
- File Health card;
- editorial still-life;
- bottom navigation: Home, Checkup, Tools, Insights, More;
- Checkup clinical scene;
- six scan stages;
- animated file tiles;
- original glass-icon language;
- premium off-white/cyan/blue/mint/violet/amber visual system;
- intentional negative space.

## 5.3 Launcher icon — non-negotiable

Launcher icon source:

`assets/icons/app-icon-192.png`

Approved Git blob SHA-1:

`f9cff58fc54e6b0525c7f74922b0588aca6a9a9d`

Never:

- redraw it;
- regenerate it;
- substitute another Dr. Bear image;
- crop/zoom differently;
- cut off the body/tablet/thumb;
- use a screenshot crop;
- replace it with a newly generated mascot.

If adaptive masking is needed, preserve the original composition inside Android’s safe zone.

---

# 6. PREMIUM DESIGN SYSTEM

## 6.1 Visual character

The app should feel:

- refined;
- calm;
- bright;
- clinically trustworthy;
- editorial rather than game-like;
- premium without looking flashy;
- spacious without looking unfinished.

Avoid neon saturation, rainbow UI, excessive glass effects, crowded dashboards, or overly dark “tech” aesthetics.

## 6.2 Semantic color language

Use restrained semantic color rather than decoration:

- Cyan/Azure — brand, scan, information, primary action;
- Indigo/Violet — deeper analysis, duplicates, intelligence;
- Mint/Teal — safe, verified, privacy, success;
- Amber/Champagne — review-first, large/old context, caution;
- Slate Blue — documents, system, protected, neutral;
- Coral/Red — destructive/error states only;
- Rose Ruby / Warm Raspberry — voluntary support/care, with white heart treatment where used.

Normal screens should feel mostly light/neutral. Color coverage should remain restrained, roughly 10–20% rather than flooding every surface.

## 6.3 Negative space versus dead space

Premium negative space is intentional and supports hierarchy. Dead space is unused area created because information architecture is incomplete.

When a task surface looks empty:

- do not fill it with decoration for decoration’s sake;
- use meaningful evidence, summaries, next steps, or state explanation when they add value;
- never add fake scan time merely to occupy space.

## 6.4 Readability contract

The app-wide readability pass established these principles:

- essential body text should generally live around 12.5–14 px in the current WebView visual scale;
- secondary information should generally remain around 11–12 px;
- readable metadata should generally remain around 10–11 px;
- badges may be smaller only when clearly non-essential;
- important text must not be made tiny merely to preserve a no-scroll layout;
- body leading should normally remain comfortable, approximately 1.45–1.55 where space permits;
- Thai and Japanese require sufficient vertical breathing room;
- contrast must be high enough to read comfortably on a real phone, not only in a desktop screenshot.

`android-readability.js` is the centralized general-purpose typography layer. Do not scatter random font-size fixes across unrelated modules unless a narrowly scoped surface truly needs final geometry ownership.

## 6.5 Zero-scroll versus scrollable surfaces

Keep the approved Home and Checkup composition as close to intentional zero-scroll/full-screen behavior as practical.

Content-heavy workspaces such as Pro, Preferences, Privacy, Duplicates, Large Files, Older Files, and Custom Scan may scroll naturally. Never shrink text, crop controls, or compress cards merely to force everything onto one screen.

---

# 7. DR. BEAR USAGE CONTRACT

Dr. Bear is a trust/brand character, not decoration to place everywhere.

Preferred mapping:

- **inspect** — scan, analysis, Insights;
- **review** — uncertainty, review-first, empty state, permissions;
- **success** — cleanup completed, all-good, support thanks;
- **caution** — destructive confirmation, protected situations;
- **full logo/hero** — About, brand, launch, share.

Use Dr. Bear sparingly.

The file-review workspace intentionally removed a large mascot/advice card in B19 to maximize task space. Do not re-add a large mascot there unless P’Benz explicitly asks.

Custom Scan may use a compact Dr. Bear guidance strip because it supports choice and does not compete with the task.

---

# 8. CURRENT ANDROID FRONTEND ASSEMBLY

The Android app intentionally imports the pinned verified PWA, then overlays focused Android modules.

Current B33 adapter order in `app/build.gradle.kts` is intentionally structured around capture priority and presentation ownership:

1. `android-entitlement.js`
2. `android-hidden-items.js`
3. `android-cleanup.js`
4. `android-duplicates.js`
5. `android-large-files.js`
6. `android-older-files.js`
7. `android-native.js`
8. `android-review.js`
9. `android-support.js`
10. `android-scan-trust.js`
11. `android-live-scan.js`
12. `android-review-media.js`
13. `android-premium-color.js`
14. `android-pro-ui.js`
15. `android-plan-status.js`
16. `android-readability.js`
17. `android-custom-scan.js`

The order is not arbitrary.

- entitlement loads early so locked actions can be intercepted before normal handling;
- hidden-item preference loads before review tools;
- dedicated quick-tool modules capture their own entry points before generic Android routing;
- Pro UI is presentation layered over entitlement state;
- plan status follows Pro UI;
- readability is late general typography ownership;
- Custom Scan loads last because it narrowly owns final Custom Scan geometry.

Do not casually reorder these modules.

## 8.1 Architectural rule

If a focused adapter/module can solve a feature safely, prefer that over rewriting the PWA or duplicating scanner/deletion logic.

Do not create parallel sources of truth for:

- entitlement;
- scan rules;
- deletion;
- duplicate identity;
- hidden-item preference;
- version labels;
- localized price.

---

# 9. SCAN-MODE CONTRACT

Scope and depth are separate concepts.

## 9.1 Quick Scan

Quick Scan must inspect **all accessible shared storage** within legitimate Android access boundaries.

Depth:

- metadata;
- lightweight deterministic rules;
- file sizes/dates where available;
- no content read;
- no duplicate hashing.

Quick may legitimately finish extremely fast.

## 9.2 Smart Scan

Smart Scan is the recommended default.

It performs:

- all accessible shared storage;
- metadata/rule analysis;
- bounded real content sampling on every readable non-empty file;
- focused exact-duplicate verification in high-value locations.

Current important implementation constant:

`SMART_SAMPLE_BYTES = 256 KiB per readable non-empty file`

Current hashing/content buffers are also 256 KiB.

Do not reduce Smart into a disguised metadata-only Quick scan.

## 9.3 Deep Scan

Deep Scan performs the deepest legitimate work supported by current architecture:

- all accessible shared storage;
- metadata/rules;
- full streaming content read of every readable non-empty file;
- exact duplicate verification across accessible scope.

Deep coverage is FULL only when intended reads complete truthfully. A Deep result must remain PARTIAL if intended coverage is not actually achieved.

Important evidence conditions include:

- no content probe failures;
- no partial content reads;
- expected content bytes equal actual content bytes;
- fully read files correspond to successfully probed files;
- inaccessible/missing/probe/hash failures are represented honestly.

## 9.4 Custom Scan

Current selectable scopes:

- Downloads;
- Photos;
- Videos;
- Documents;
- Music.

Current content-read depth is none; the user can optionally request exact duplicate verification inside selected scopes.

B33 presentation contract:

- full-width Custom Scan flow;
- Downloads/Photos and Videos/Documents may use balanced two-column rows;
- Music uses deliberate full width;
- exact duplicate verification is a separate full-width setting;
- Start Custom Scan is full-width below options;
- Cancel is a clear secondary action;
- zero selected locations must disable the Start action;
- short screens scroll naturally;
- EN/TH/JA must preserve readable line wrapping and touch targets.

Custom Scan must not silently substitute default scopes when the UI communicates zero selections.

Future Custom evolution may add explicit depth selection only if it remains understandable.

---

# 10. SCAN SPEED, TRUTH, EVIDENCE, AND PROGRESS

## 10.1 Never fake slowness

Permanent rule:

> **Fast because the real work finished — never slow because the UI pretended to work.**

No artificial `sleep`, minimum scan duration, staged fake percentages, or cosmetic delays.

If a scan completes in a fraction of a second, let it complete. Explain speed with real evidence instead of slowing it down.

## 10.2 Progress must come from real work

Useful real evidence includes:

- current phase;
- roots scanned;
- directories visited;
- files discovered;
- files reviewed;
- bytes discovered/measured;
- expected/actual content bytes;
- fully/partially read files;
- read failures;
- duplicate/hash work;
- active item name;
- active item location;
- duration;
- inaccessible roots/folders;
- final coverage state.

Current progress emission interval is approximately 160 ms. Fast scans may therefore transition before a user can capture every phase, and that is acceptable.

## 10.3 Phase-aware metrics

Never show a metric as `0` when that phase has not begun if zero would imply failed work.

Use `—` or a phase-appropriate metric before measurement exists.

Examples:

- File Details → files reviewed/current file/folders;
- File Sizes → storage measured;
- Duplicate Verification → candidates/files verified/verification bytes;
- Modified Dates → date-review progress.

## 10.4 Post-scan proof

Because Quick/Smart may be very fast, important evidence may be carried into the final result as compact proof, for example:

- scan mode;
- files discovered/reviewed;
- coverage;
- duration;
- local-only processing.

Only show metrics actually produced by the scan.

---

# 11. ANDROID STORAGE BOUNDARIES

Bearagnostic operates only inside legitimate Android access.

Current root discovery uses accessible/readable shared-storage roots and StorageManager volume directories where supported.

Known protected/skipped areas include:

- `Android/data`;
- `Android/obb`;
- inaccessible app-private storage;
- encrypted/protected vault content that Android does not expose.

Do not bypass platform restrictions, encryption, vault protection, or permission boundaries.

Before Play Store release, re-check the current Google Play policy for broad/all-files storage access and determine whether the cleaner’s core functionality remains eligible. If not, redesign access using compliant alternatives rather than misrepresenting coverage.

---

# 12. REVIEW AND DELETION SAFETY CONTRACT

## 12.1 Scanner is read-only

Scanning must never delete files.

## 12.2 Default destructive flow

The default permanent-deletion experience is:

`Select → Review → Confirm → Delete → Verify → Summary`

No destructive workflow should skip verification merely to look fast.

## 12.3 Current review snapshot rule

Deletion IDs must come from the **current in-memory review snapshot**.

Dedicated review workflows currently treat snapshots older than approximately **15 minutes** as stale and require a refresh before deletion.

## 12.4 Batch limit

Maximum selected deletion batch:

`500 files`

Do not silently exceed the native safety limit.

## 12.5 Verified reclaimed bytes

Reclaimed storage must count only files whose removal was actually verified.

Do not estimate reclaimed space from selected items and call it completed cleanup.

## 12.6 Exact duplicate protection

Exact duplicates require:

1. exact size prefilter;
2. streaming SHA-256 verification;
3. group-level keep-one-copy protection.

At least one copy must remain.

UI protection and Native protection should both exist. A UI mistake must not be able to delete every copy.

## 12.7 Trust classifications

Use these user-facing meanings consistently:

- **Safe to clean** — strong low-risk evidence;
- **Review first** — user judgment required;
- **Protected** — deletion prevented or intentionally excluded.

Safety explanations are always free.

---

# 13. CLASSIFICATION PRINCIPLES

File category is evidence, not permission to delete.

Permanent principles:

- Large ≠ Junk;
- Old ≠ Junk;
- Hidden ≠ Junk;
- Archive ≠ Junk;
- APK ≠ Junk;
- Duplicate identity ≠ permission to remove the last copy.

Current important thresholds/behaviors:

- Older Files: last modified more than approximately 365 days ago;
- auto-clean stale incomplete-download candidate requires strong low-risk rules and age safeguards;
- current minimum age for auto-clean temporary candidate logic includes a 7-day protection window where applicable.

Do not broaden auto-clean eligibility casually.

---

# 14. QUICK CLEAN — CURRENT PRODUCTION CONTRACT

Quick Clean is a Free first-class feature.

It may show only candidates that already satisfy current low-risk/auto-clean-eligible rules.

It must not silently include:

- generic large files;
- generic older files;
- APK installers;
- archives;
- exact duplicates merely because they are duplicates;
- hidden/private items when Hidden Items is OFF;
- ambiguous temporary artifacts.

Quick Clean uses the latest valid review snapshot or runs the necessary real checkup.

If nothing qualifies, the empty state should communicate that this is a positive safety result and may show real review-first opportunities such as Duplicates, Large Files, and Older Files.

No fake candidates, fake reclaimed space, or fake waiting.

---

# 15. EXACT DUPLICATES — CURRENT PRODUCTION CONTRACT

Exact Duplicates is a dedicated first-class workspace.

It must:

- use only current verified duplicate evidence;
- group identical copies clearly;
- show group count/removable copies/reclaimable bytes;
- allow the user to decide which copy stays;
- clearly mark the protected keeper;
- support local thumbnail/preview when legitimate and visible;
- use current review-snapshot IDs;
- enforce keep-one-copy at UI and Native levels;
- go through final review and verified deletion;
- rebuild the remaining duplicate state after deletion.

### Free versus Pro duplicates

Free must remain useful and safe:

- view verified groups from supported Free scan coverage;
- manually select extra copies by group;
- change the keeper;
- receive safety explanation and verified deletion.

Current Pro enhancements include:

- cross-group `Select recommended` convenience;
- deeper whole-accessible-storage verification through Deep Scan where available.

Do not present cryptographic jargon such as SHA-256 as the primary user-facing message. User-facing language should explain that files were verified byte-for-byte.

---

# 16. LARGE FILES — CURRENT PRODUCTION CONTRACT

Large Files is a Free first-class workflow.

It uses actual size evidence from accessible shared storage.

It must:

- never call size alone junk;
- never auto-select files merely because they are large;
- show size, location, type/date context where available;
- offer useful filters and sorting;
- support local visual preview when legitimate;
- use explicit selection;
- preserve final review/confirm/delete/verify/summary;
- preserve hidden-item privacy policy;
- show truthful snapshot/coverage context.

Current UI includes sorting such as Largest/Oldest/Newest/Name and category filters such as All/Videos/Photos/Documents/Other.

---

# 17. OLDER FILES — CURRENT PRODUCTION CONTRACT

Older Files is a Free first-class workflow.

Current rule uses files last modified more than approximately one year ago.

It must:

- never equate age with junk;
- never auto-select merely because a file is old;
- show age/date, size, location, and type where available;
- support filters and sorting;
- support local preview when legitimate;
- require explicit selection;
- preserve final review/confirm/delete/verify/summary;
- respect Hidden Items OFF/ON.

Current sorting includes Oldest/Newest/Largest/Name.

---

# 18. HIDDEN ITEMS PRIVACY CONTROL

Hidden Items is a **privacy control**, not a “find secret porn” gimmick and not a Pro paywall.

It is Free and default-OFF.

When OFF:

- dedicated review lists should conceal accessible filesystem-hidden/private-labelled items;
- hidden media preview should not be loaded for those concealed items;
- hidden items should not be promoted into Quick Clean one-tap candidates;
- the app may show aggregate hidden count/bytes without revealing names or thumbnails when useful.

When ON:

- accessible hidden/private-labelled items may appear in Duplicates, Large Files, Older Files, and relevant review surfaces;
- they remain Review First unless another independent safety rule says otherwise;
- user selection remains explicit;
- deletion safeguards remain unchanged.

Turning Hidden Items OFF again should prune selected hidden items from active selections so concealed content cannot remain queued accidentally.

### Hidden detection is not privilege escalation

The control reveals only items already accessible to the app. It must never:

- unlock encrypted vaults;
- bypass app security;
- request secret passwords;
- bypass Android restrictions;
- imply access to content the OS did not expose.

Private-folder naming heuristics such as `.hidden`, `secretAlbum`, `private`, or vault-like path labels may inform presentation, but do not claim cryptographic/private-app access that does not exist.

---

# 19. CUSTOM SCAN — B33 PRESENTATION CONTRACT

B33 fixed a responsive defect where the custom scope list and Start button were sibling children inside a two-column mode grid, compressing the scope list to half width.

The B33 Custom Scan surface is now deliberately task-oriented:

- clear Scan Locations section;
- two-column location layout where space permits;
- full-width Music row;
- separate full-width Duplicate Check section;
- compact state summary (`N locations selected`, duplicate verification on/off);
- full-width Start Custom Scan;
- full-width Cancel;
- natural vertical scrolling on short devices;
- no tiny text to force fit;
- no Start when zero locations are selected.

Do not regress this into side-by-side CTA/content geometry.

---

# 20. FILE REVIEW AND MEDIA PREVIEW

The review workspace is an action workspace, not a marketing surface.

Keep it dense enough to be efficient, but still readable.

Media preview/thumbnail rules:

- local only;
- request only when the item is visible/eligible;
- do not expose hidden media while Hidden Items is OFF;
- gracefully fall back to file-type icon when preview is unsupported;
- never upload the file to generate a preview.

Do not reintroduce a large mascot card that steals review space.

---

# 21. FREE / PRO PRODUCT MODEL

## 21.1 Commercial direction

The approved direction is:

> **Free + one-time lifetime Bearagnostic Pro**

No subscription is currently intended.

No ads are intended as part of the premium brand direction.

No Bearagnostic account is required for normal use.

## 21.2 Canonical planned Play product

Planned product ID:

`bearagnostic_pro_lifetime`

Target Thailand standard price:

**฿249**

Potential founding-launch promotional target:

**฿149** when intentionally configured.

The actual in-app purchase price must come from Google Play Billing’s localized product details. Do not hard-code a selling price into purchase UI once Billing is live.

## 21.3 Free must remain genuinely useful

Free should include the essential trustworthy maintenance experience, including:

- Home and File Health basics;
- Quick Scan;
- Smart Scan;
- Quick Clean safety-first workflow;
- basic/manual Exact Duplicates workflow within supported Free coverage;
- Large Files review;
- Older Files review;
- Hidden Items privacy control;
- safety explanations;
- confirmation before destructive actions;
- keep-one-copy protection;
- scan evidence/truthfulness;
- local-only privacy behavior.

Do not paywall essential safety.

## 21.4 Current Pro capability direction

Current implemented/partially implemented Pro-facing capabilities include:

- Deep Scan;
- Custom Scan;
- deeper duplicate coverage through Deep Scan;
- cross-group recommended duplicate selection convenience;
- Pro status/presentation.

Planned Pro toolkit may include, once actually implemented:

- advanced media review and filters;
- Historical Insights / What Changed;
- full cleanup history;
- custom exclusions;
- scheduled checkup reminders;
- other genuinely deeper diagnostic/control capabilities that clearly justify Pro.

Never advertise a planned feature as already finished.

## 21.5 Entitlement architecture

Entitlement decisions must have a single source of truth.

`EntitlementManager.kt` is the native access-policy foundation.

The frontend guard improves UX but is not the sole security boundary.

Free users must not be able to bypass UI and start Pro-only Deep/Custom actions through direct frontend calls.

## 21.6 No required login

A separate Bearagnostic email/Gmail account is not required for Pro ownership.

When Play Billing is enabled, ownership should follow the Google Play purchase/account lifecycle. Restore/query purchase behavior should re-establish entitlement without requiring P’Benz to manually activate users one by one.

Server-side verification may be added later if justified, but should not be introduced merely for complexity’s sake.

---

# 22. GOOGLE PLAY BILLING — REQUIRED FUTURE PRODUCTION WORK

Current builds have entitlement architecture and Pro presentation, but production Google Play Billing must not be considered complete until the real purchase lifecycle is implemented and tested.

Required production lifecycle includes:

- query product details/localized price;
- purchase launch;
- purchase acknowledgement/consumption behavior appropriate to a non-consumable lifetime product;
- grant entitlement only after valid purchase state;
- restore ownership on reinstall/device/account-supported scenarios;
- handle pending purchases appropriately;
- respond to refund/revocation/lost entitlement appropriately;
- surface useful purchase errors without exposing raw billing jargon;
- debug/test controls never appear in release builds;
- release does not rely on manual activation by P’Benz.

Do not invent subscription terms, trials, discounts, or renewal behavior without explicit approval.

---

# 23. PLAN INDICATOR POLICY

Plan status should be clear without making Free users feel second-class.

Approved behavior:

- do **not** plaster a global FREE badge across every screen;
- Pro users may receive a subtle, premium `PRO` header pill;
- More should show the current plan clearly;
- Pro page should show current ownership/active state clearly;
- Pro-gated capabilities may show compact PRO labels where useful.

The visual goal is clarity and prestige, not pressure.

---

# 24. VOLUNTARY SUPPORT: KO-FI / PROMPTPAY

Support and Pro purchase are different concepts.

Current intent:

- Support may remain as a voluntary contribution surface while appropriate;
- Ko-fi and PromptPay must **never** be presented as an alternate way to unlock Pro;
- P’Benz must not manually activate Pro based on transfers;
- Pro digital entitlement must use Google Play Billing when Billing is enabled for Play distribution;
- support messaging must not confuse donation with purchase, entitlement, warranty, or priority service.

Current PromptPay QR is remote and pinned to:

`https://raw.githubusercontent.com/grolygori789-crypto/little-ganesha-tarot/f21e6a4c81812276d661d6ebb0a3e6c86c6cf48b/assets/support/promptpay-qr.png`

Current support presentation uses the approved Rose Ruby / Warm Raspberry treatment with a white-heart concept rather than destructive-alert red.

### Play Store policy caution

Before public Play release, verify the **current** Google Play payment/external-link/donation policies. If voluntary support links or QR behavior create policy risk for the Play-distributed build, remove or relocate them from that build rather than risking review rejection. Do not assume an older policy interpretation remains valid.

---

# 25. PRIVACY CONTRACT

Bearagnostic is local-first.

Do not add:

- file-content uploads;
- remote filename inventory;
- hidden behavioral telemetry;
- behavioral advertising;
- unnecessary accounts;
- persistent full file trees;
- unnecessary long-term file hashes/history.

Allowed when disclosed and justified:

- aggregate local history;
- local cleanup totals;
- local trend summaries;
- Google Play Billing metadata required for purchase lifecycle;
- network access for intentionally user-requested support links/QR or other clearly disclosed functions.

Privacy claims must match actual implementation.

---

# 26. LOCALIZATION

Current product language direction includes:

- English;
- Thai;
- Japanese.

All new first-class workflows should support the same language set unless P’Benz explicitly changes scope.

Do not design English-only geometry that breaks in Thai or Japanese.

Review:

- line wrapping;
- text expansion;
- touch targets;
- truncation;
- card heights;
- typography/leading;
- technical terminology;
- accessibility labels where applicable.

---

# 27. CURRENT QUICK-TOOL COMPLETION STATUS

The four Home quick tools are no longer placeholders:

### Cleanup

- B28: functional vertical slice;
- B29: premium live-evidence, trust, empty-state, and next-step polish.

### Exact Duplicates

- B30: dedicated verified-duplicates workflow plus Free/Pro plan-status presentation;
- B31: follow-up presentation polish.

### Large Files

- B31: dedicated Large Files workflow.

### Older Files

- B32: dedicated Older Files workflow.

### Hidden Items

- B32: shared default-OFF privacy control across relevant review tools.

### Custom Scan

- B33: premium responsive redesign and composition fix.

Do not regress these tiles back into generic review shortcuts unless explicitly approved.

---

# 28. IMPORTANT ON-DEVICE OBSERVATIONS FROM B29–B33

These observations should guide future work:

1. Real scans on P’Benz’s device can finish extremely quickly. This is not itself a defect.
2. Evidence is more valuable than cosmetic waiting.
3. Quick Scan is expected to be especially fast because it does not read content or hash duplicates.
4. Smart/Deep must remain distinguishable by actual I/O work, not by animation duration.
5. Empty states need value and next steps; “nothing found” should not feel like a dead end.
6. Scroll screenshots can make a valid sticky-footer workspace look visually cut off; distinguish scroll position from actual layout defects.
7. B33 confirmed that real responsive geometry problems must be fixed structurally, not by shrinking fonts.
8. Hidden/private files must not reveal thumbnails before opt-in.
9. Real-world device screenshots are a critical part of visual QA; desktop/static reasoning alone is insufficient.

---

# 29. TOOLS / PERFECT V1 FORWARD ROADMAP

This roadmap is priority guidance, not a permanent batch-number contract. Latest explicit instruction and current GitHub production always win.

## Phase A — Finish Perfect V1 file-maintenance toolset

Build first-class, safety-aligned workflows for remaining useful categories such as:

- Downloads review;
- APK installers;
- Archives;
- Zero-byte files;
- Empty folders where Android access and deletion semantics are reliable;
- media-oriented review improvements where useful.

Rules:

- APK/archive/media are review-first by default;
- Downloads is a location, not a junk classification;
- empty-folder logic must avoid app/system-owned areas and protected boundaries;
- no category may inherit a destructive shortcut merely because another workflow already has one.

## Phase B — File Health and Insights evolution

Develop the value layer after scanning/cleanup:

- meaningful File Health summary;
- storage overview;
- Historical Insights / What Changed;
- cleanup history;
- before/after verified trends;
- useful local summaries without fake scores.

Avoid arbitrary health percentages. Prefer factual state, trends, and verified changes.

## Phase C — Pro toolkit completion

Complete high-value Pro capabilities such as:

- advanced media review/filtering;
- full cleanup history;
- custom exclusions;
- scheduled checkup reminders;
- deeper diagnostics that genuinely save time or improve control.

Each Pro feature must feel worth paying for; never create artificial friction in Free simply to force an upgrade.

## Phase D — Production Google Play Billing

After entitlement architecture and core feature boundaries are stable:

- integrate real Play Billing;
- configure `bearagnostic_pro_lifetime`;
- use localized Play price;
- test purchase, pending, restore, reinstall, refund/revoke, offline/reconnect behavior;
- remove/disable debug entitlement controls from release;
- verify no manual user administration is required.

## Phase E — Release hardening

Before public launch:

- multi-device Android QA;
- large-storage stress tests;
- deletion safety matrix;
- permission-loss/regrant tests;
- rotation/background/resume edge cases where applicable;
- EN/TH/JA UI review;
- accessibility/touch-target review;
- crash/error-path testing;
- memory/performance review;
- release AAB;
- production signing/keystore process;
- versioning discipline;
- Data Safety declaration;
- Privacy Policy;
- Play listing copy/screenshots;
- current MANAGE_EXTERNAL_STORAGE/all-files-access policy eligibility check;
- current Billing/payment/support-link policy check.

Only after this phase should “Play Store ready” be claimed.

---

# 30. PLAY STORE RELEASE BLOCKERS

Do not ship merely because a debug APK builds.

Release blockers include:

- real release signing;
- AAB generation;
- Google Play Billing production lifecycle if Pro is offered;
- privacy policy matching actual behavior;
- Data Safety form matching actual behavior;
- review of all-files access eligibility;
- removal of debug-only entitlement/test controls;
- release build verification;
- purchase/restore/refund testing;
- destructive file-deletion testing on real devices;
- current-policy review for external support links/PromptPay/Ko-fi;
- complete store assets and truthful listing copy.

The debug keystore is not a production release-signing solution.

---

# 31. QA TRUTH CATEGORIES

Every batch must distinguish these clearly:

### Static QA PASS

Syntax, source inspection, deterministic simulations, packaging, invariants, lint-like checks.

### CI PASS

GitHub Actions or equivalent verified build/test result for the uploaded commit.

### Runtime simulation PASS

A real executable/browser/native simulation ran successfully in the available environment.

### Physical-device PASS

P’Benz or an actual device test demonstrated the claimed behavior.

### NOT TESTED

Anything not actually tested.

Never blur these categories.

A screenshot can prove a displayed state, but not every underlying path.

---

# 32. BATCH IMPLEMENTATION AND DELIVERY CONTRACT

For normal runtime implementation batches:

- inspect current GitHub production first;
- establish rollback baseline;
- make the smallest complete coherent batch;
- update `versionCode` and `versionName`;
- keep Android adapter cache query strings coherent where required;
- package changed files only unless a full package is requested;
- use canonical repository-relative paths;
- do not include a wrapper folder;
- provide changed-file allowlist;
- provide regression risk: LOW / MEDIUM / HIGH;
- describe QA actually performed;
- list untested items;
- provide SHA-256;
- provide rollback commit;
- provide a commit name of 50 characters or fewer.

Do not create production files named `v2`, `new`, `final`, `backup`, `copy`, etc.

### Documentation-only updates

A documentation-only Master Plan/prompt refresh does not require an Android version bump. It should not pretend to be a runtime batch.

---

# 33. NO-WAIT / TANGIBLE-OUTPUT WORKFLOW

When P’Benz requests an implementation/package, do not spend the turn only reporting that work is in progress.

Produce a real downloadable artifact in the same turn whenever technically possible. If the requested scope is too large, shrink to the smallest safe complete batch instead of returning only status.

Never fake:

- ZIP files;
- links;
- checksums;
- CI results;
- runtime results;
- physical-device results.

---

# 34. KNOWN FAILURE MODES — DO NOT REPEAT

Avoid these specifically:

- recreating the PWA by eye;
- changing the approved icon;
- arbitrary mascot crops/substitutions;
- scroll-heavy redesign of Home;
- tiny typography to force-fit content;
- blank/underused giant sheets without useful state explanation;
- fake scan duration;
- shallow scan scope presented as whole-device depth;
- totals-only results with no evidence/context;
- SHA jargon in prominent UI;
- semantic red used for non-danger actions;
- mascot stealing review workspace;
- browser/PWA settings exposed unnecessarily in native Android;
- duplicate groups that can be fully deleted;
- large/old/hidden items treated as automatically safe;
- hidden thumbnails revealed while Hidden Items is OFF;
- stale snapshot deletion;
- reclaimed bytes calculated without verification;
- Free badge plastered globally;
- Pro features represented as finished when they are roadmap-only;
- Ko-fi/PromptPay used as manual Pro activation;
- hard-coded localized Play purchase price;
- changing scanner logic merely to improve visual pacing;
- using “Done” for an actively running task when “Close/Cancel” is the actual action;
- mistaking a scroll screenshot for a structural layout failure;
- fixing genuine responsive geometry by shrinking fonts instead of restructuring layout.

---

# 35. CURRENT HIGH-RISK AREAS TO PROTECT

Changes touching these require extra scrutiny:

- `FileHealthScanner.kt`;
- `MainActivity.kt` review snapshot/deletion handling;
- `NativeBridge.kt`;
- `EntitlementManager.kt`;
- `app/build.gradle.kts` adapter order/version/cache;
- duplicate group keep-one logic;
- hidden-item privacy filters;
- media preview access;
- all-files/storage permissions;
- Google Play Billing when introduced;
- release signing;
- support/payment external links.

Prefer adapter-level presentation fixes when scanner/native behavior does not actually need to change.

---

# 36. CURRENT IMPORTANT CONSTANTS / INVARIANTS

Treat these as deliberate until inspected and intentionally changed:

- Smart sample: 256 KiB per readable non-empty file;
- streaming/hash buffer: 256 KiB;
- progress emission interval: approximately 160 ms;
- deletion selection cap: 500;
- dedicated review stale-snapshot guard: approximately 15 minutes;
- Older Files age: approximately 365 days;
- auto-clean temporary/incomplete-download rules include age/safety protections rather than generic temp deletion;
- protected storage includes Android/data and Android/obb access boundaries;
- exact duplicates require size match + streaming SHA-256 verification;
- duplicate deletion keeps at least one copy;
- scanner is read-only;
- no artificial scan delay.

---

# 37. DEFINITION OF “FEATURE COMPLETE”

A button opening a screen is not feature complete.

A first-class workflow is complete only when appropriate parts of this chain exist:

`Entry → Real data → Loading/Empty/Found/Error → Explanation → Preview/Context → Selection → Safety classification → Confirm → Native action → Verify → Truthful summary → Updated state`

For non-destructive features, remove irrelevant destructive stages, but still require real data, error/empty states, and truthful outcomes.

---

# 38. DEFINITION OF “10/10” FOR BEARAGNOSTIC

A 10/10 Bearagnostic feature should satisfy all of the following:

- immediately understandable;
- truthful about what it scanned and what it did not;
- no fake waiting;
- no hidden destructive behavior;
- comfortable typography on a real phone;
- premium but restrained color;
- clear hierarchy;
- useful empty states;
- coherent next steps;
- strong Android safety boundaries;
- local-first privacy;
- minimal user administration for P’Benz;
- maintainable architecture;
- resilient EN/TH/JA layout;
- real QA evidence matching the claim.

The goal is not merely “works.” The goal is **trustworthy enough that users will confidently let it inspect and clean personal storage**.

---

# 39. NEXT-ROOM / NEXT-DEVELOPER STARTUP CHECKLIST

Before doing anything substantive:

1. fetch latest `main`;
2. verify whether `4321369aa830894c82b0a84a9ab8aaabfc3681d7` is still current;
3. fetch this Master Plan from GitHub;
4. inspect current `app/build.gradle.kts`;
5. inspect files relevant to the requested task;
6. inspect latest GitHub Actions status;
7. identify current runtime batch/version;
8. establish rollback baseline;
9. do not assume the next runtime batch number if GitHub has advanced;
10. preserve all safety/visual/monetization contracts above.

If GitHub still shows B33 runtime, the next runtime implementation would normally be B34 unless P’Benz explicitly defines another batch strategy.

---

# 40. MASTER PLAN MAINTENANCE RULE

This file is not a changelog dump. It is the canonical long-term product/engineering contract.

Update it when a batch materially changes:

- architecture;
- feature-completion state;
- safety rules;
- privacy rules;
- scan contracts;
- visual/UX contracts;
- Free/Pro boundaries;
- billing/support policy;
- release strategy;
- major verified production state.

Do not edit it for trivial cosmetic changes that do not alter a durable contract.

Always overwrite this canonical path:

`docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`

Never create competing `final`, `v2`, `new`, `backup`, or dated Master Plans.

---

**End of Revision 3.0**
