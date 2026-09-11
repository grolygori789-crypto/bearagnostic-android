# BEARAGNOSTIC ANDROID MASTER PLAN

**Repository:** `grolygori789-crypto/bearagnostic-android`  
**Canonical file:** `docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`  
**Revision:** 4.0  
**Revision date:** 12 September 2026  
**Owner / Product Authority:** P’Benz  
**Studio / Publisher:** Benedict Interactive  
**Product & Development Lead:** Biu  
**Supersedes:** Revision 3.0  

---

# 0. PURPOSE, STATUS, AND NORTH STAR

This document is the canonical operating contract and handoff source for **Bearagnostic for Android**. It consolidates the current verified production state, product direction, UX/visual contracts, Android architecture, scan truthfulness, deletion safety, privacy model, localization direction, Free/Pro boundaries, Google Play Billing foundation, debug Billing Sandbox, legal/IP layer, QA rules, delivery workflow, communication rules, known failure modes, release blockers, and the near-term roadmap.

It exists so a new conversation, new working session, or future developer can continue without reconstructing the project from screenshots, old ZIP files, stale chat history, or memory.

The permanent engineering North Star is:

> **Simple architecture. Exceptional execution. Zero unnecessary complexity.**

The permanent product-quality target is:

> **10/10 perceived quality, 10/10 clarity, 10/10 practical usefulness, and zero deceptive behavior.**

The product promise is:

> **Find clutter. Explain the risk. Clean with confidence.**

Bearagnostic must feel calm, intelligent, expensive, bright, clinically clear, privacy-first, and trustworthy. Premium quality comes from execution, truthfulness, safety, information hierarchy, restraint, and real usefulness — never from visual noise, fake performance claims, fake progress, fake scarcity, or unnecessary complexity.

---

# 1. AUTHORITY, SOURCE OF TRUTH, AND CONFLICT RESOLUTION

## 1.1 Product authority

P’Benz is the final Product Authority. Biu acts as Product & Development Lead with broad authority to recommend and execute product, design, UX, architecture, implementation, QA, safety, monetization architecture, localization, and release strategy inside the approved North Star and trust boundaries.

When a decision is ambiguous, prefer the option that best preserves:

1. user trust;
2. data safety;
3. truthful behavior;
4. premium usability;
5. architectural simplicity;
6. maintainability;
7. localization resilience;
8. release safety;
9. the approved visual identity.

## 1.2 Conflict-resolution order

Resolve conflicts in this order:

1. latest explicit instruction from P’Benz;
2. current GitHub production on `main`;
3. this canonical Master Plan;
4. approved assets and current physical-device evidence;
5. repository history and verified prior packages;
6. older chat context or remembered assumptions.

Never allow an older screenshot, older ZIP, stale plan revision, or remembered state to override current GitHub production.

## 1.3 Mandatory GitHub-first rule

Before any substantive production change, implementation, bug fix, architecture change, monetization change, localization change, release change, or QA claim:

- inspect latest `main` commit;
- inspect the current tree or compare against the intended baseline;
- fetch this canonical Master Plan from GitHub;
- inspect the actual files that will be affected;
- inspect relevant CI/workflow status;
- establish the known-good rollback baseline;
- identify the changed-file allowlist;
- assess regression risk;
- verify that the proposed change does not contradict a newer user instruction.

If this Master Plan cannot be fetched from GitHub, stop substantive implementation instead of silently using a stale copy.

## 1.4 Remote-write rule

GitHub connector permission is not authorization to mutate the repository.

Default workflow:

`Inspect GitHub → modify locally → QA → package repo-relative files → P’Benz uploads manually → inspect uploaded commit → inspect CI`

Do not create, update, delete, push, merge, or otherwise mutate GitHub remotely unless P’Benz explicitly authorizes remote writes in that same turn.

Phrases such as “ทำเลย”, “ดำเนินการได้”, “ส่งไฟล์”, or “ส่งไฟล์มาให้” authorize implementation/package creation, not remote GitHub writes.

---

# 2. COMMUNICATION AND WORKING-STYLE CONTRACT — NON-NEGOTIABLE

These rules are part of the project operating contract and must survive room migration.

## 2.1 Biu’s gender and Thai language

Biu is female in this working relationship.

When speaking Thai:

- refer to herself as `บิ๊ว` when natural;
- address the user as `พี่เบนซ์`;
- use feminine Thai pronouns and polite endings such as `ค่ะ` and `คะ` appropriately;
- do not use masculine Thai self-reference or masculine polite endings;
- this rule is mandatory even in technical, urgent, or highly detailed responses.

A new room must not lose this rule.

## 2.2 Tone

Communication should be warm, direct, professional, energetic, evidence-based, and practical.

Avoid:

- robotic corporate phrasing;
- generic filler;
- pretending certainty when evidence is incomplete;
- excessive emojis in technical/informational responses;
- overexplaining trivial points while hiding the actual conclusion.

Answer the real question first, then explain the reasoning and trade-offs when useful.

## 2.3 No-wait / tangible-output rule

When P’Benz explicitly asks to implement something and requests a file/package, do not spend the turn merely reporting progress.

Produce a real downloadable artifact in the same turn whenever technically possible.

If the requested scope is too large for one safe pass:

- reduce to the smallest safe, complete, coherent batch;
- still provide a real downloadable artifact;
- clearly state what remains.

Never make P’Benz wait through a long response that ends without the requested file when a file can reasonably be produced.

Never fabricate a ZIP, download link, checksum, build result, CI result, runtime result, or device result.

## 2.4 Commit-name rule

Every file/package delivery intended for GitHub must include a recommended commit name that:

- is **50 characters or fewer**;
- is concise and descriptive;
- appears in a fenced Markdown code block;
- is not buried in prose.

## 2.5 Strongest complete answer first

Do not intentionally hold back obvious improvements for a later message. When recommending a design, implementation, prompt, or plan, provide the strongest integrated version on the first pass unless a staged rollout is safer.

## 2.6 Physical evidence and truthfulness

Do not say a feature is physically verified unless P’Benz or another real-device test actually demonstrated it.

Differentiate:

- static/source QA;
- CI/build QA;
- runtime simulation;
- physical-device evidence;
- untested areas.

A screenshot proves the displayed state, not every hidden logic path.

---

# 3. CURRENT VERIFIED PRODUCTION SNAPSHOT — B52

Current production at the time of Revision 4.0:

- branch: `main`;
- latest commit: `941c2eb0df57faff2fc785b45bd4c26349dc0fd8`;
- commit message: `Fix Developer Console interaction`;
- parent: `db7d680b2f245b208b4ba379ac708215cc655f66`;
- tree: `d88cd69323e6036d9a86beb1d9c8a5f7c0bed9b1`;
- Android version: `0.35.4-alpha52`;
- `versionCode`: `52`;
- application ID: `com.benedictinteractive.bearagnostic`;
- debug application ID: `com.benedictinteractive.bearagnostic.debug`;
- compileSdk: `36`;
- targetSdk: `36`;
- minSdk: `26`;
- Java compatibility: `17`;
- Google Play Billing Library: `9.1.0`;
- release minification/R8: intentionally **OFF** at B52;
- pinned approved legacy/PWA commit: `78a31c7752e171c0eafb63c0d0859f4072a193d6`;
- approved launcher-icon Git blob SHA-1: `f9cff58fc54e6b0525c7f74922b0588aca6a9a9d`;
- latest workflow: `Build Android Debug APK`;
- B52 workflow run: `#57` / run ID `34628484481`;
- B52 CI conclusion: **SUCCESS**.

## 3.1 Current physical-device status

P’Benz performed a **brief/rough preliminary physical test of B52** after installation.

Current report:

- B52 is usable to a reasonable preliminary level;
- no new defect has been observed yet in that rough pass;
- this is **not** a full acceptance matrix;
- do not claim Billing Sandbox, destructive cleanup, localization, or release readiness as fully physically verified based on this quick smoke test alone.

## 3.2 Important current caution

B49–B52 proved that a green CI build does not guarantee correct Android WebView runtime behavior. Physical-device smoke testing is mandatory after changes involving:

- Android WebView JavaScript bridge calls;
- DOM observers;
- polling/re-render loops;
- Developer Console interaction;
- entitlement UI;
- startup path;
- Billing Sandbox state.

---

# 4. RECENT PRODUCTION HISTORY — B34 THROUGH B52

This is a concise development history, not a replacement for Git history.

- **B34 — `0.25.2-alpha34`**: runtime guard hardening.
- **B35 — `0.26.0-alpha35`**: first-class Downloads Review.
- **B36 — `0.26.1-alpha36`**: icon/presentation polish.
- **B37 — `0.27.0-alpha37`**: APK Installers review workflow.
- **B38 — `0.28.0-alpha38`**: Archives review workflow.
- **B39 — `0.29.0-alpha39`**: Zero-byte Files; physical test passed.
- **B40 — `0.30.0-alpha40`**: Empty Folders + app-wide scroll continuation + Checkup navigation work; physical pass except Checkup footer defect.
- **B41 — `0.30.1-alpha41`**: Checkup footer/navigation correction; physical pass.
- **B42 — `0.31.0-alpha42`**: Insights / Local History; preliminary physical pass; evidence needs time to mature.
- **B43 — `0.32.0-alpha43`**: Advanced Media Review (Pro); populated video test with thumbnails/metadata/filtering passed; full destructive matrix not yet proven.
- **B44 — `0.33.0-alpha44`**: Google Play Billing foundation; Billing Library 9.1.0, lifetime product architecture, cached ownership continuity, restore/pending/acknowledgement foundation; physical install passed; real Google Play purchase not yet tested.
- **B45 — `0.34.0-alpha45`**: stabilization/polish, truthful roadmap presentation, File Health grounding, Legal & Licenses layer, launch-language target documentation.
- **B46 — `0.34.1-alpha46`**: multilingual typography/icon/privacy-layout polish.
- **B47 — `0.34.2-alpha47`**: multilingual heading typography refinement; physical typography test passed.
- **B48 — `0.35.0-alpha48`**: dual-sided debug Billing Sandbox and Store/Customer simulation.
- **B49 — `0.35.1-alpha49`**: Developer Mode entry fix; physical test exposed WebView bridge failure.
- **B50 — `0.35.2-alpha50`**: bridge-binding attempt; physical test exposed startup regression where app could remain on Benedict Interactive launch surface.
- **B51 — `0.35.3-alpha51`**: startup recovery, observer idempotence, safer explicit bridge wrappers; startup recovered and Billing QA Console became reachable.
- **B52 — `0.35.4-alpha52`**: Developer Console interaction/readability fix; polling no longer replaces active controls, typography enlarged, mobile layout simplified; rough preliminary physical test currently reports no observed error.

Recent production commits worth retaining for diagnosis:

- B47: `e73b8308f85a47f8e32990fd3e1af7dd06e213bc`;
- B48: `00bcd27e65dec1f44dd39693f484c8a821ed22cb`;
- B49: `f4669e061324dfe0f38e7a2d20b4cbbae055e563`;
- B50: `0f2db82019beb3e83310486e696e32857a2a609b`;
- B51: `db7d680b2f245b208b4ba379ac708215cc655f66`;
- B52: `941c2eb0df57faff2fc785b45bd4c26349dc0fd8`.

---

# 5. PRODUCT POSITIONING

Bearagnostic for Android is:

> **A premium, privacy-first file cleaner and file-health assistant for Android.**

It helps users:

- understand what consumes storage;
- scan accessible shared storage honestly;
- identify low-risk cleanup candidates;
- verify exact duplicate files using real evidence;
- inspect large and older files without calling them junk;
- review Downloads, APK installers, archives, zero-byte files, empty folders, and media with context;
- distinguish safe-to-clean, review-first, and protected situations;
- clean only explicitly chosen or strongly justified candidates;
- verify that deletion actually occurred;
- see truthful reclaimed-space results;
- understand what changed over time using local aggregate evidence;
- retain control at every destructive step.

Bearagnostic is not a generic phone booster.

---

# 6. EXPLICITLY REJECTED PRODUCT BEHAVIOR

Never implement or market Bearagnostic as:

- RAM booster;
- memory cleaner;
- CPU cooler;
- fake speed booster;
- fake antivirus;
- registry cleaner;
- root cleaner;
- unsupported battery optimizer;
- kill-all background-app utility;
- private-app-cache cleaner outside legitimate Android access;
- fear-based cleaner that pressures users into deleting files.

Never fabricate:

- junk totals;
- scan percentages;
- health scores;
- virus counts;
- optimization success;
- “speed +XX%” claims;
- reclaimed bytes not verified by deletion;
- fake undo;
- fake scan delays;
- fake progress;
- fake “deep” coverage;
- fake historical trends;
- fake patterns;
- fake purchase status.

Performance claims must be evidence-backed. Storage reclamation may be described as reclaiming space; it must not be presented as proof of CPU/RAM acceleration without measurement.

---

# 7. VISUAL SOURCE OF TRUTH

## 7.1 Preserve the approved PWA literally first

Approved legacy repository:

`grolygori789-crypto/bearagnostic`

Pinned approved commit:

`78a31c7752e171c0eafb63c0d0859f4072a193d6`

Permanent principle:

> **Preserve the PWA literally first. Layer Android capability on top.**

Do not recreate the approved interface by eye when the approved source exists.

## 7.2 Protected visual assets and composition

Preserve unless P’Benz explicitly approves a change:

- Benedict Interactive opening;
- Bearagnostic opening;
- Bearagnostic wordmark/tagline;
- original Home composition;
- silver header gear;
- Dr. Bear approved identity;
- Start Checkup hero;
- File Health card;
- editorial still-life;
- bottom navigation: Home, Checkup, Tools, Insights, More;
- Checkup clinical scene;
- scan stages and live evidence style;
- original glass-icon language;
- premium off-white/cyan/blue/mint/violet/amber system;
- intentional negative space.

## 7.3 Launcher icon — non-negotiable

Launcher icon source:

`assets/icons/app-icon-192.png`

Approved Git blob SHA-1:

`f9cff58fc54e6b0525c7f74922b0588aca6a9a9d`

Never redraw, regenerate, crop differently, substitute another Dr. Bear image, or use a screenshot crop.

---

# 8. PREMIUM DESIGN AND READABILITY SYSTEM

## 8.1 Visual character

The product should feel:

- refined;
- calm;
- bright;
- clinically trustworthy;
- editorial rather than game-like;
- premium without looking flashy;
- spacious without looking unfinished.

Avoid neon saturation, rainbow UI, excessive glass, crowded dashboards, and dark “hacker” aesthetics.

## 8.2 Semantic colors

Use color semantically:

- Cyan/Azure — brand, scan, information, primary action;
- Indigo/Violet — deeper analysis, duplicates, intelligence;
- Mint/Teal — safe, verified, privacy, success;
- Amber/Champagne — review-first and caution;
- Slate Blue — neutral/system/protected;
- Coral/Red — destructive/error only;
- Rose/Warm Raspberry — voluntary support/care where still allowed.

## 8.3 Readability contract

Never shrink important text merely to preserve no-scroll composition.

General production guidance:

- body text roughly 12.5–14 px or larger when a task surface needs it;
- secondary information roughly 11–12 px or larger;
- metadata roughly 10–11 px when genuinely secondary;
- Thai and Japanese need additional line-height and breathing room;
- important CTA labels must remain comfortably readable;
- contrast must be validated on a real phone, not only desktop screenshots.

B47 introduced a centralized multilingual heading rhythm. Do not regress Thai/Japanese headings into oversized, tightly stacked English-first geometry.

B52 establishes a stronger rule for Developer/QA surfaces: readability beats density. Developer Console body/control text may be larger than ordinary compact metadata because it is a repeated operational tool.

## 8.4 Scroll policy

Home should remain intentionally near zero-scroll/full-screen where practical.

Content-heavy workspaces should scroll naturally. Never make text tiny, crop controls, or compress cards simply to force everything onto one screen.

---

# 9. DR. BEAR USAGE CONTRACT

Dr. Bear is a trust/brand character, not decoration to place everywhere.

Preferred mapping:

- inspect — scan / analysis / Insights;
- review — uncertainty / permissions / review-first;
- success — verified cleanup / all-good;
- caution — destructive confirmation / protected states;
- full logo/hero — About / brand / launch.

Use Dr. Bear sparingly. Review workspaces should prioritize task space over mascot size.

---

# 10. CURRENT ANDROID FRONTEND ASSEMBLY

The Android app imports the pinned PWA byte-for-byte, verifies critical blobs, then overlays focused Android adapters.

Current B52 adapter load order is intentionally coordinated:

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
15. `android-support.js`
16. `android-scan-trust.js`
17. `android-live-scan.js`
18. `android-review-media.js`
19. `android-premium-color.js`
20. `android-pro-ui.js`
21. `android-billing.js`
22. `android-plan-status.js`
23. `android-readability.js`
24. `android-custom-scan.js`
25. `android-insights.js`
26. `android-shell-ux.js`
27. `android-stabilization.js`
28. `android-locale-polish.js`
29. `android-build-truth.js`

Do not casually reorder these modules. Their order controls capture priority, entitlement gating, focused-workspace ownership, late typography, stabilization, and truthful build labels.

## 10.1 Architectural principle

Prefer focused adapters over rewriting the pinned PWA or duplicating native logic.

Do not create parallel sources of truth for:

- entitlement;
- scanner rules;
- deletion;
- duplicate identity;
- hidden-item preference;
- local history;
- build/version labels;
- Google Play localized price;
- Sandbox Store ownership.

---

# 11. SCAN-MODE CONTRACT

Scope and depth are separate concepts.

## 11.1 Quick Scan

Quick Scan inspects all accessible shared storage using metadata and deterministic rules.

It does not read file content and does not hash duplicates.

Quick may legitimately finish extremely fast.

## 11.2 Smart Scan

Smart Scan is the recommended default.

It performs:

- all accessible shared storage;
- metadata/rule analysis;
- bounded real content sampling on every readable non-empty file;
- focused exact-duplicate verification in high-value locations.

Important implementation constant:

`SMART_SAMPLE_BYTES = 256 KiB per readable non-empty file`

## 11.3 Deep Scan

Deep Scan performs the deepest legitimate supported work:

- all accessible shared storage;
- metadata/rules;
- full streaming content read of every readable non-empty file;
- exact duplicate verification across accessible scope.

Deep coverage is FULL only when intended reads genuinely complete. Failures must make coverage PARTIAL rather than being hidden.

## 11.4 Custom Scan

Selectable shared-storage scopes currently include:

- Downloads;
- Photos;
- Videos;
- Documents;
- Music.

Custom may optionally verify exact duplicates inside selected scopes.

Zero selected locations must never silently substitute default scopes.

---

# 12. SCAN TRUTH, SPEED, EVIDENCE, AND PROGRESS

Permanent rule:

> **Fast because the real work finished — never slow because the UI pretended to work.**

No artificial sleeps, minimum durations, fake percentages, or staged fake work.

Useful evidence may include:

- current phase;
- roots scanned;
- folders visited;
- files discovered/reviewed;
- bytes measured;
- expected/actual content bytes;
- fully/partially read files;
- failures;
- duplicate/hash work;
- active item name/location;
- duration;
- final coverage state.

Phase-aware UI should show `—` rather than misleading `0` when a measurement has not begun.

---

# 13. ANDROID STORAGE BOUNDARIES

Bearagnostic operates only inside legitimate Android access.

Protected/skipped boundaries include:

- `Android/data`;
- `Android/obb`;
- inaccessible app-private storage;
- encrypted/protected vault content not exposed by Android.

Do not bypass OS restrictions, encryption, vault protection, or permission boundaries.

Before Play release, re-check current Google Play policy for broad/all-files storage access. If eligibility is not acceptable, redesign access compliantly rather than misrepresenting coverage.

---

# 14. REVIEW AND DELETION SAFETY CONTRACT

## 14.1 Scanner is read-only

Scanning never deletes files.

## 14.2 Destructive flow

Default permanent-deletion sequence:

`Select → Review → Confirm → Delete → Verify → Summary`

## 14.3 Snapshot guard

Deletion IDs must come from the current in-memory review snapshot.

Dedicated file review currently treats snapshots older than approximately **15 minutes** as stale and requires refresh.

## 14.4 Batch limits

Maximum file deletion batch:

`500 files`

Empty Folder deletion uses a tighter safety batch (currently up to 100 folders per batch), rechecks each folder immediately before deletion, and protects system/app boundaries.

## 14.5 Verified reclaimed bytes

Count reclaimed storage only when file removal is verified.

## 14.6 Exact duplicate protection

Exact duplicates require:

1. exact size prefilter;
2. streaming SHA-256 verification;
3. group-level keep-one-copy protection.

At least one copy must remain at both UI and Native safety layers.

## 14.7 Safety classifications

Use consistently:

- **Safe to clean** — strong low-risk evidence;
- **Review first** — user judgment required;
- **Protected** — deletion prevented or intentionally excluded.

Safety explanations remain free.

---

# 15. CLASSIFICATION PRINCIPLES

File category is evidence, not permission to delete.

Permanent principles:

- Large ≠ Junk;
- Old ≠ Junk;
- Hidden ≠ Junk;
- Archive ≠ Junk;
- APK ≠ Junk;
- Downloads ≠ Junk;
- Duplicate identity ≠ permission to remove the last copy.

Older Files currently use approximately 365 days.

Auto-clean eligibility must remain narrow and evidence-based, with age/safety protection. Do not broaden it casually.

---

# 16. FIRST-CLASS TOOLSET — CURRENT STATUS

Current functional first-class tools/workspaces include:

- Quick Clean;
- Exact Duplicates;
- Large Files;
- Older Files;
- Downloads Review;
- APK Installers;
- Archives;
- Zero-byte Files;
- Empty Folders;
- Advanced Media Review (Pro);
- Custom Scan (Pro);
- Insights / Local History.

## 16.1 Quick Clean

Free, safety-first, only strongly justified low-risk candidates. Never silently absorb generic Large, Old, APK, Archive, or ambiguous files.

## 16.2 Exact Duplicates

Free remains useful for manual verified duplicate review. Pro may add deeper coverage/convenience. Keep-one-copy protection is mandatory.

## 16.3 Large Files and Older Files

Free review-first workflows. Never auto-select merely because of size or age.

## 16.4 Downloads, APK Installers, Archives, Zero-byte Files

All are first-class review workflows with category-specific explanations. Location/type alone is not deletion permission.

## 16.5 Empty Folders

Separate directory review/deletion path. Re-check emptiness immediately before deletion and protect system/app boundaries.

## 16.6 Advanced Media Review

Pro feature supporting Photos, Videos, Audio, Screenshots and useful size/age/sort filters, local thumbnails/metadata, bounded result count, final review, and verified delete.

Physical B43 evidence covered a populated video scenario, metadata, thumbnails, filtering, sorting, layout, navigation, and entitlement gating. Do not overclaim destructive coverage until explicitly tested.

---

# 17. HIDDEN ITEMS PRIVACY CONTROL

Hidden Items is a privacy control, not a gimmick and not a Pro paywall.

It is Free and default-OFF.

When OFF:

- conceal accessible hidden/private-labelled items from dedicated review lists;
- do not load hidden media previews;
- do not promote hidden items into Quick Clean;
- aggregate hidden count/bytes may be shown without revealing names/thumbnails when useful.

When ON:

- accessible hidden/private-labelled items may appear where relevant;
- they remain Review First unless another independent rule justifies otherwise;
- selection remains explicit;
- normal deletion safeguards remain.

Turning OFF should prune selected hidden items so concealed content cannot remain queued accidentally.

---

# 18. CHECKUP AND NAVIGATION CONTRACT

Root Ready state:

- fixed five-tab bottom navigation;
- Checkup highlighted when on Checkup;
- no redundant top Home icon.

Focused task state:

- bottom navigation may hide to protect task space.

Closing focused results returns to the root navigation contract.

B41 fixed the footer/navigation defect. Do not regress it.

---

# 19. INSIGHTS / LOCAL HISTORY — B42 CONTRACT

Insights is evidence-based local history, not a fake health score.

Current architecture:

- aggregate-only local history;
- `AtomicFile` persistence;
- approximately 30 scan records and 50 cleanup records retained;
- no persistent filenames, paths, or file hashes in Insights history;
- history failure must never block deletion or misreport cleanup success;
- full-scope comparisons are only valid between comparable complete scans;
- Custom/partial scans must not be misleadingly compared to full-scope scans.

Free includes useful current-state information such as Latest Checkup and Device Storage.

Pro includes deeper historical views such as What Changed, Storage Trend, Patterns, scan history, and cleanup history where supported by sufficient real evidence.

## 19.1 Current evidence status

B42 began the real evidence-collection period. A roughly seven-day window was intentionally allowed so trends/patterns are not invented from insufficient history.

At Revision 4.0, do not assume this evidence period is complete merely because later builds were installed. Continue collecting real history and evaluate the quality of Insights once there is enough comparable data.

No fake trends or patterns may be shown to fill empty time.

---

# 20. FREE / PRO PRODUCT MODEL

Approved commercial direction:

> **Free + one-time lifetime Bearagnostic Pro**

No subscription is currently intended.

No ads are intended as part of the premium brand direction.

No Bearagnostic account is required for normal use.

## 20.1 Planned Play product

Product ID:

`bearagnostic_pro_lifetime`

Previously approved target pricing direction:

- Thailand standard target: **฿249**;
- possible founding-launch promotional target: **฿149** when intentionally configured.

Once real Billing is live, purchase UI price must come from Google Play `ProductDetails`; do not hard-code the selling price.

Sandbox prices are test data only and do not redefine production pricing.

## 20.2 Free must remain genuinely useful

Free should retain:

- Home / File Health basics;
- Quick Scan;
- Smart Scan;
- Quick Clean;
- manual verified duplicate review within supported coverage;
- Large Files;
- Older Files;
- Downloads/APK/Archive/Zero/Empty Folder review where product boundaries currently allow;
- Hidden Items privacy control;
- safety explanations;
- truthful evidence;
- destructive confirmation and verification.

Do not paywall essential safety.

## 20.3 Pro value

Current Pro capabilities include or are intended to include:

- Deep Scan;
- Custom Scan;
- deeper duplicate verification coverage;
- cross-group duplicate convenience;
- Advanced Media Review;
- Historical Insights / What Changed / richer history;
- future high-value controls that genuinely save time or improve understanding.

Do not degrade Free artificially to force conversion.

---

# 21. GOOGLE PLAY BILLING FOUNDATION — B44+

The production Billing foundation exists, but real Play purchase validation is not yet complete.

Current foundation includes:

- Google Play Billing Library 9.1.0;
- one-time/lifetime product architecture;
- product ID `bearagnostic_pro_lifetime`;
- localized price expected from Google Play when product is available;
- `PURCHASED` vs `PENDING` handling;
- acknowledgement path;
- restore/query on foreground;
- cached ownership continuity;
- Native entitlement as source of truth;
- debug override restricted to debug;
- no purchase token/order/raw JSON exposed into WebView.

Real purchase testing is still required through Google Play Internal Testing / license tester environment.

## 21.1 Required real lifecycle before release

Must test:

- ProductDetails/localized price;
- purchase sheet;
- purchase success;
- user cancellation;
- pending purchase;
- acknowledgement;
- restore after reinstall;
- ownership continuity across supported account/device scenarios;
- offline/reconnect;
- refund;
- revoke/voided purchase;
- relevant Play error states.

Do not call Billing production-complete before this is physically tested with Google Play.

---

# 22. DEBUG-ONLY DUAL-SIDED BILLING SANDBOX — B48–B52

The Billing Sandbox exists to simulate the customer and owner/store sides before real Play testing.

It does **not** contact Google Play and cannot charge real money.

## 22.1 Customer side

Customer simulation uses the normal Bearagnostic Pro surface and should behave like a real buyer flow:

- product/lifetime presentation;
- test-localized price;
- clearly labelled test checkout;
- simulated payment method;
- Processing/Pending/Success/Failure;
- Restore;
- actual Pro capability gates through EntitlementManager.

Customer UI must not contain obvious Success/Error cheat controls.

## 22.2 Owner / Store side

Hidden Developer Mode opens the Billing QA Console.

Developer Mode entry:

`More → About Bearagnostic → tap build/version text seven times`

The owner/store console supports:

- market/test price: TH / US / JP / EU / BR;
- Store availability;
- test catalog currently includes TH `฿199`, US `$5.99`, JP `¥900`, EU `€5.99`, and BR `R$ 29,90` — these are QA values only and do not redefine production pricing;
- network: Online / Slow / Offline;
- payment behavior: Approve / Pending / Decline / Approve then Chargeback;
- acknowledgement: Success / Fail once / Always fail;
- Pending approval/decline;
- ownership sync;
- local entitlement clear;
- reinstall simulation;
- refund while retaining access;
- refund + revoke;
- revoke;
- chargeback/void;
- simulated unacknowledged three-day refund/revoke;
- transaction ledger;
- event timeline.

## 22.3 Store/App state separation

The Sandbox Store ledger and app entitlement cache are intentionally separate:

`Sandbox Store ownership → query/purchase update → EntitlementManager → Pro capability gates`

This is required to test realistic cases such as Store-owned + local-cache-empty → Restore/Reinstall → Pro restored.

Never replace this with a direct `isPro = true` cheat path as the primary QA mechanism.

## 22.4 Release isolation

The executable simulator engine lives under the debug source set (`app/src/debug/.../DebugBillingSandbox.kt`) and must not be compiled into release builds.

Release checks should continue to verify that debug simulator class descriptors and debug ledger preference namespace are absent from release DEX.

Before public release, remove/strip remaining inert QA presentation hooks as part of release hardening.

---

# 23. BILLING SANDBOX DEFECT HISTORY — LESSONS TO KEEP

This history is important because it exposed Android WebView failure modes that static QA missed.

## B49

Symptom: Developer Mode toast appeared but no usable Developer Tools entry; later physical test showed `bridge error`.

Lesson: UI success must not be shown unless Native state confirms success.

## B50

Attempted bridge-call change caused a more severe physical regression where startup could remain stuck on the Benedict Interactive launch surface.

Lesson: a green build and source-level bridge harness do not prove WebView startup safety.

## B51

Recovered startup and made Developer row MutationObserver idempotent. Explicit bridge wrappers and exception isolation reduced bridge ambiguity.

Lesson: observer callbacks must not rewrite unchanged DOM and retrigger themselves.

## B52

Physical B51 testing showed Store dropdowns could appear briefly and disappear because background polling could replace interactive DOM. Text was also too small for comfortable QA.

B52 therefore:

- protects focused/recently interacted controls;
- avoids unnecessary full re-render when visible state has not changed;
- reduces polling aggressiveness;
- gives mobile Store controls a natural one-column flow;
- enlarges typography and touch targets;
- separates lifecycle actions into clearer operational/recovery/destructive groups.

Current rough physical B52 test has not revealed a new error yet, but full acceptance remains pending.

---

# 24. B52 DEVELOPER CONSOLE ACCEPTANCE CONTRACT

Before calling B52 Developer Console fully closed, physically verify:

- Store dropdowns remain open and selectable for at least 5–10 seconds;
- focused controls are not replaced by background polling;
- TH/US/JP/EU/BR price selection works;
- Online/Slow/Offline selection works;
- Approve/Pending/Decline/Chargeback behavior can be configured;
- acknowledgement modes can be configured;
- Store availability and provider controls work;
- tabs do not unexpectedly reset;
- scroll position is not lost solely because polling runs;
- Pending state can be approved/declined from owner side;
- Customer side reflects owner-side changes;
- Restore works after local entitlement clear;
- simulated reinstall restores Store ownership;
- refund/revoke/chargeback remove access when expected;
- transaction and event history remain coherent;
- closing/reopening Console does not break startup;
- disabling Developer Mode removes the developer entry cleanly;
- restarting with Developer Mode persisted ON still reaches Home;
- typography is readable without zooming or squinting.

Do not mark this matrix complete from the current rough smoke test alone.

---

# 25. PLAN INDICATOR POLICY

Plan status should be clear without making Free users feel second-class.

Approved behavior:

- no global FREE badge across every screen;
- subtle premium PRO pill is acceptable;
- More should communicate plan state clearly;
- Pro page should show current ownership clearly;
- gated capabilities may use compact PRO labels where useful.

Clarity and prestige, not pressure.

---

# 26. VOLUNTARY SUPPORT VS PRO PURCHASE

Support and Pro purchase are separate concepts.

Ko-fi / PromptPay must never be presented as an alternate way to unlock Pro.

P’Benz should not manually activate Pro because a user sent a transfer.

When Play Billing is enabled for public distribution, Pro digital entitlement follows the Google Play purchase lifecycle.

Current PromptPay support QR source remains pinned to:

`https://raw.githubusercontent.com/grolygori789-crypto/little-ganesha-tarot/f21e6a4c81812276d661d6ebb0a3e6c86c6cf48b/assets/support/promptpay-qr.png`

Before public release, re-check current Play policy for support links, external payments, donation links, and QR codes. Remove/relocate support surfaces if they create policy risk.

---

# 27. PRIVACY CONTRACT

Bearagnostic is local-first.

Do not add:

- file-content uploads;
- remote filename inventory;
- hidden behavioral telemetry;
- behavioral advertising;
- unnecessary accounts;
- persistent full file trees;
- unnecessary long-term file hashes.

Allowed when disclosed and justified:

- aggregate local history;
- local cleanup totals;
- local trends;
- Google Play Billing metadata required for purchase lifecycle;
- intentionally user-requested support links or clearly disclosed network functions.

Privacy claims must match actual implementation.

---

# 28. LOCALIZATION CONTRACT

## 28.1 Currently exposed languages

Current selectable production languages remain:

- English;
- ไทย;
- 日本語.

These three must remain complete and coherent across all exposed first-class surfaces.

Mixed-language UI in an exposed locale is a release defect.

## 28.2 Launch target expansion

Approved future launch target is:

- English;
- ไทย;
- 日本語;
- Español;
- Português (Brasil).

However, **Spanish and Portuguese (Brazil) must remain hidden until coverage is complete across the app and Android adapters.** Do not expose a language early and rely on visible English fallback.

## 28.3 Translation quality

Localization must be intent-first and native-first, not literal word substitution.

Each language should be:

- instantly understandable;
- natural to a native user;
- consistent with technical meaning;
- clear in destructive warnings;
- clear in privacy and Billing states;
- visually balanced.

Technical nouns may remain in English where that is genuinely natural, but surrounding explanation must be clear.

## 28.4 Future architecture

Localization is currently distributed across the pinned PWA and Android adapters. Long term, reduce scattered dictionaries through a controlled centralization strategy, but avoid a risky big-bang rewrite late in stabilization.

---

# 29. LEGAL / IP LAYER — B45+

Current repository includes a proprietary legal layer:

- `LICENSE.md`;
- `docs/legal/README.md`;
- `docs/legal/COPYRIGHT_AND_IP.md`;
- `docs/legal/TERMS_OF_USE.md`;
- `docs/legal/PRIVACY_POLICY.md`;
- `docs/legal/THIRD_PARTY_NOTICES.md`.

Current principles:

- protect Bearagnostic code, protectable UI/UX expression, Dr. Bear/branding/icons/assets, copy, localization, documentation, and protectable selection/arrangement;
- prohibit unauthorized repackaging, misleading distribution, entitlement bypass, origin-notice removal, asset extraction, and substantially copied competing expression where legally enforceable;
- respect third-party/open-source licenses;
- do not claim exclusive ownership over generic file-cleaning ideas, algorithms, facts, Android APIs, SHA-256, file metadata, common UI conventions, public-domain material, or third-party property;
- do not make false trademark-registration or corporate-status claims.

Before global public launch, legal documents should receive appropriate professional legal review if commercially justified.

---

# 30. CURRENT HIGH-RISK FILES / AREAS

Changes touching these require extra scrutiny:

- `FileHealthScanner.kt`;
- `MainActivity.kt` scan/review/deletion handling;
- `NativeBridge.kt`;
- `EntitlementManager.kt`;
- `PlayBillingManager.kt`;
- `DebugBillingSandbox.kt`;
- `LocalHistoryStore.kt`;
- `app/build.gradle.kts` adapter order/version/cache;
- `android-billing.js` startup/bridge/polling behavior;
- duplicate keep-one logic;
- hidden-item privacy filtering;
- media preview access;
- all-files/storage permissions;
- release signing;
- external support/payment links.

Prefer presentation-layer changes when native scanner/deletion logic does not need to change.

---

# 31. IMPORTANT CONSTANTS / INVARIANTS

Treat these as deliberate until inspected and intentionally changed:

- scanner analysis rules version: `ANALYSIS_RULES_VERSION = 8`;
- Smart sample: 256 KiB per readable non-empty file;
- streaming/hash buffer: 256 KiB;
- progress emission interval: approximately 160 ms;
- review candidate cap: 10,000;
- file deletion selection cap: 500;
- dedicated review stale snapshot: approximately 15 minutes;
- Older Files age: approximately 365 days;
- Android/data and Android/obb protected/skipped;
- exact duplicate identity requires exact size + streaming SHA-256;
- duplicate deletion keeps at least one copy;
- scanner is read-only;
- no artificial scan delay;
- Insights history remains aggregate-only and local;
- B52 release minification remains OFF;
- Billing Sandbox executable engine remains debug-only.

---

# 32. QA TRUTH CATEGORIES

Use these labels conceptually and do not blur them:

### Static QA PASS

Source inspection, syntax, deterministic verifier, packaging, invariants.

### CI PASS

Uploaded GitHub commit successfully passes the intended workflow.

### Runtime simulation PASS

Executable/browser/native simulation ran successfully in the available environment.

### Physical-device PASS

A real device demonstrated the claimed behavior.

### Preliminary physical smoke PASS

A brief real-device pass found no immediate problem but did not exhaust the acceptance matrix.

### NOT TESTED

Anything not actually tested.

B52 currently belongs in **Preliminary physical smoke PASS** for the latest Dev Console patch, not a complete physical acceptance PASS.

---

# 33. BATCH IMPLEMENTATION AND DELIVERY CONTRACT

For normal runtime implementation batches:

- inspect current GitHub production first;
- fetch this Master Plan;
- inspect relevant files;
- inspect CI;
- establish rollback baseline;
- make the smallest complete coherent batch;
- bump `versionCode` and `versionName`;
- keep adapter cache query strings coherent;
- preserve the pinned PWA and launcher icon contracts;
- package changed files only unless full package is explicitly requested;
- use canonical repo-relative paths;
- do not include a useless wrapper folder inside a GitHub-ready ZIP;
- provide changed-file allowlist;
- provide regression risk: LOW / MEDIUM / HIGH;
- describe QA actually performed;
- list untested items;
- provide SHA-256;
- provide rollback commit;
- provide a commit name ≤50 characters in a fenced code block.

Do not create production files named `v2`, `new`, `final`, `backup`, `copy`, etc.

## 33.1 Documentation-only changes

Documentation-only Master Plan/prompt refresh:

- does not require Android version bump;
- must not pretend to be a runtime batch;
- should preserve canonical filenames;
- may be packaged repo-relative for manual upload.

---

# 34. NO-WAIT DELIVERY CONTRACT

When P’Benz asks for implementation and a file:

- prioritize producing the artifact in the same turn;
- do the minimum necessary preflight audit first;
- do not disappear into prolonged process narration;
- if a full scope is unsafe, deliver the smallest safe complete batch;
- state clearly what is and is not verified.

This rule is especially important in long conversations where context load can become slow.

---

# 35. KNOWN FAILURE MODES — DO NOT REPEAT

Avoid specifically:

- recreating the PWA by eye;
- changing the approved launcher icon;
- giant mascots that steal task space;
- tiny typography to force fit;
- fake scan time/progress/depth;
- treating category/location as junk permission;
- duplicate group deletable to zero;
- hidden previews while Hidden Items is OFF;
- stale-snapshot deletion;
- unverified reclaimed bytes;
- prominent SHA jargon;
- global FREE badge;
- hard-coded live Billing price;
- support payment unlocking Pro;
- roadmap features shown as finished;
- scanner rewrite for visual pacing;
- fake health score/trend/pattern;
- comparing partial Custom scans to complete full-scope scans;
- persisting filenames/paths/hashes in Insights;
- history failure blocking deletion or falsifying cleanup outcome;
- mixed-language exposed locale;
- fixed-height English-first headers that break Thai/Japanese;
- responsive fixes that merely shrink fonts;
- WebView bridge methods detached from their required receiver;
- DOM MutationObserver feedback loops;
- polling that replaces a focused native control;
- background refresh that resets tabs/scroll unnecessarily;
- success toasts that are not backed by Native confirmation;
- assuming CI success proves physical WebView behavior.

---

# 36. DEFINITION OF FEATURE COMPLETE

A button opening a screen is not feature complete.

A first-class workflow is complete only when appropriate parts of this chain exist:

`Entry → Real data → Loading/Empty/Found/Error → Explanation → Preview/Context → Selection → Safety classification → Confirm → Native action → Verify → Truthful summary → Updated state`

For non-destructive features, remove irrelevant destructive stages but still require real data, meaningful empty/error states, and truthful outcomes.

---

# 37. DEFINITION OF 10/10 FOR BEARAGNOSTIC

A 10/10 Bearagnostic feature should be:

- immediately understandable;
- truthful about what it scanned and did not scan;
- free of fake waiting;
- free of hidden destructive behavior;
- comfortably readable on a real phone;
- premium but restrained;
- clearly hierarchical;
- useful in empty/error states;
- coherent about next steps;
- safe within Android boundaries;
- local-first;
- localization-resilient;
- maintainable;
- supported by QA evidence matching the claim.

The goal is not merely “works.” The goal is **trustworthy enough that users will confidently let it inspect and clean personal storage**.

---

# 38. NEAR-TERM ROADMAP FROM B52

Priority is guidance, not a rigid batch-number contract. Always re-check GitHub before assigning the next batch number.

## Phase 1 — Close B52 Billing Sandbox physical acceptance

Continue physical testing of the full Developer Console matrix, especially:

- every Store dropdown;
- Customer ↔ Store linked behavior;
- Pending approve/decline;
- Restore after local entitlement clear;
- simulated reinstall;
- acknowledgement failure modes;
- refund/revoke/chargeback;
- transaction/event coherence;
- repeated open/close/restart;
- EN/TH/JA readability.

If a defect appears, fix the smallest isolated cause. Do not expand Billing native architecture unless evidence requires it.

## Phase 2 — Continue Insights evidence collection

Allow real local history to accumulate until there is enough comparable evidence to judge:

- What Changed;
- Storage Trend;
- Patterns;
- cleanup history usefulness;
- empty/insufficient-history states.

Do not invent data to make Insights look complete.

## Phase 3 — Stabilization and defect closure

Use normal real-world app operation to surface remaining issues.

Avoid adding major feature scope while current architecture is being proven unless a missing feature is genuinely release-blocking.

## Phase 4 — Localization completion

Keep EN/TH/JA fully healthy.

Then complete Español and Português (Brasil) end-to-end before exposing them.

Audit every first-class surface, destructive warning, privacy explanation, Billing state, legal entry, Pro gate, and Developer/release-only behavior where relevant.

## Phase 5 — Full pre-Play QA

Run systematic tests for:

- scan modes;
- permission grant/loss/regrant;
- destructive deletion matrix;
- duplicate keeper safety;
- hidden-item privacy;
- empty-folder safety;
- media review deletion;
- large-storage stress;
- background/resume;
- startup;
- accessibility/touch targets;
- memory/performance;
- EN/TH/JA and later ES/PT-BR;
- offline/error paths.

## Phase 6 — Google Play Console / Internal Testing

Only after the product is stable:

- configure app in Play Console;
- configure one-time product `bearagnostic_pro_lifetime`;
- use real localized ProductDetails;
- install through an Internal Testing track;
- use license tester accounts;
- test real purchase/cancel/pending/restore/reinstall/refund/revoke;
- compare real lifecycle against Sandbox assumptions;
- adjust production Billing logic only when real evidence requires it.

## Phase 7 — Release hardening

Before public launch:

- strip remaining QA/debug Billing presentation hooks from release;
- verify release DEX contains no debug Sandbox engine/ledger namespace;
- generate signed release AAB;
- establish production signing/keystore process;
- re-evaluate R8/resource shrinking carefully rather than enabling casually;
- verify Data Safety declaration;
- verify Privacy Policy/legal docs;
- verify MANAGE_EXTERNAL_STORAGE/all-files eligibility;
- verify Billing and external-support policy;
- prepare truthful Play listing copy/screenshots;
- run release-candidate physical QA.

Only after these steps should “Play Store ready” be claimed.

---

# 39. RELEASE BLOCKERS

Do not ship merely because a debug APK builds.

Release blockers include:

- production signing;
- AAB generation;
- real Google Play Billing lifecycle test if Pro is offered;
- privacy policy/Data Safety consistency;
- all-files access eligibility review;
- removal of debug-only entitlement/sandbox controls from release;
- release binary verification;
- purchase/restore/refund/revoke testing;
- destructive deletion safety on real devices;
- current support/external-payment policy review;
- complete localization for every exposed language;
- store assets and truthful listing copy.

---

# 40. NEXT-ROOM STARTUP CHECKLIST

At the start of a new Bearagnostic room/session:

1. read the migration Master Prompt supplied with this revision;
2. fetch latest `main` — do not assume B52 is still latest;
3. fetch this canonical Master Plan from GitHub;
4. inspect latest `app/build.gradle.kts` for version, pinned PWA, adapter order, cache version, Billing dependency, and R8 status;
5. inspect the files relevant to the task;
6. inspect latest GitHub Actions run;
7. establish rollback baseline;
8. identify changed-file allowlist and regression risk;
9. preserve Biu’s female Thai communication contract;
10. preserve the no-wait artifact-delivery contract;
11. preserve the ≤50-character commit-name-in-code-block rule;
12. do not remote-write GitHub without explicit same-turn authorization;
13. do not claim full physical verification from the current B52 rough smoke test;
14. continue from the newest real evidence rather than re-litigating solved older defects.

If GitHub still shows commit `941c2eb0df57faff2fc785b45bd4c26349dc0fd8`, current runtime is B52 (`0.35.4-alpha52`, code 52).

---

# 41. MASTER PLAN MAINTENANCE RULE

This file is not a raw changelog dump. It is the canonical long-term product/engineering/working-method contract.

Update it when a change materially affects:

- verified production state;
- architecture;
- feature completion;
- safety;
- privacy;
- scan contracts;
- visual/UX contracts;
- localization;
- Free/Pro boundaries;
- Billing/support policy;
- legal/release strategy;
- QA/delivery rules;
- room-handoff requirements.

Always overwrite this canonical path:

`docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`

Never create competing `final`, `v2`, `new`, `backup`, or dated Master Plans.

---

**End of Revision 4.0**
