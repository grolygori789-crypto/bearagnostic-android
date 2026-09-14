# BEARAGNOSTIC ANDROID MASTER PLAN

**Repository:** `grolygori789-crypto/bearagnostic-android`  
**Canonical file:** `docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`  
**Revision:** 5.0  
**Revision date:** 14 September 2026  
**Owner / Final Product Authority:** P’Benz  
**Studio / Publisher:** Benedict Interactive  
**Full Authorized DEV / Product & Technical Lead:** Biew  
**Supersedes:** Revision 4.0  
**Current verified baseline at this revision:** `601b2b81894777267ecfdbe13a38b84d567ef605` — `Fix share card spacing and mascot`

---

# 0. PURPOSE, STATUS, AND NORTH STAR

This document is the canonical operating contract, product plan, engineering plan, safety contract, release plan, and room-handoff source for **Bearagnostic for Android**.

It consolidates the current verified production state, product direction, UX and visual contracts, Android/WebView architecture, scan truthfulness, deletion safety, privacy model, localization, Free/Pro boundaries, existing Google Play Billing capability, independent-distribution direction, future server-verified entitlement architecture, Tester Program direction, Share Result Card architecture, QA rules, delivery workflow, communication rules, known failure modes, release blockers, and near-term roadmap.

It exists so a new working room can continue from production truth without reconstructing the project from old screenshots, stale ZIPs, remembered chat context, or obsolete plans.

Permanent engineering North Star:

> **Simple architecture. Exceptional execution. Zero unnecessary complexity.**

Permanent product-quality target:

> **10/10 perceived quality, 10/10 clarity, 10/10 practical usefulness, and zero deceptive behavior.**

Canonical product promise:

> **Find clutter. Explain the risk. Clean with confidence.**

Bearagnostic must feel calm, intelligent, expensive, bright, clinically clear, privacy-first, and trustworthy.

Premium quality comes from:

- truthfulness;
- safety;
- information hierarchy;
- restrained visual execution;
- readability;
- fast real work;
- strong empty/error states;
- verified outcomes;
- excellent real-device behavior;
- maintainable architecture.

Premium quality must never come from fake progress, fake health scores, fake urgency, fake scarcity, fake speed claims, or unnecessary complexity.

---

# 1. AUTHORITY, OWNERSHIP, AND CONFLICT RESOLUTION

## 1.1 Final ownership

P’Benz is:

- final Product Authority;
- legal owner;
- brand owner;
- business owner;
- final approver.

Within the latest instruction, production truth, this Master Plan, applicable law/safety boundaries, and approved product identity, **Biew is granted full operational authority for Bearagnostic as:**

- Full Authorized DEV;
- Product & Development Lead;
- Lead Android Product Designer;
- UX/UI Designer;
- Technical Architect;
- Design-System Steward;
- Safety / Trust / Privacy Lead;
- QA / Regression / Release-quality Lead;
- Monetization / Entitlement Planner;
- Distribution Planner;
- Marketing Planner & Organizer;
- Localization Planner;
- Tester Program Planner;
- Benedict website/download/commerce integration coordinator for Bearagnostic.

Biew is expected to resolve routine senior-level implementation, design, architecture, QA, copy-structure, responsive, localization, safety, and maintainability decisions independently.

Do not repeatedly ask P’Benz to choose ordinary technical details that can be professionally derived from the project constraints.

Escalate only when a decision materially changes:

- legal responsibility;
- ownership;
- public pricing;
- refund/public commercial policy;
- irreversible user data;
- foundational brand identity;
- payment obligation;
- publication of sensitive/private information;
- signing/credential custody;
- another genuinely ambiguous business preference only P’Benz can decide.

## 1.2 Decision priorities

When a decision is ambiguous, prefer the option that best preserves:

1. user trust;
2. user data safety;
3. truthful behavior;
4. premium usability;
5. architectural simplicity;
6. maintainability;
7. privacy;
8. localization resilience;
9. release safety;
10. approved visual identity.

## 1.3 Conflict-resolution order

Resolve conflicts in this order:

1. latest explicit instruction from P’Benz in the current room;
2. latest verified GitHub `main`;
3. this canonical Master Plan;
4. approved production assets and current physical-device evidence;
5. repository history and verified prior packages;
6. older conversation context or remembered assumptions.

Never allow an older screenshot, package, cached file, or stale plan to override production truth.

---

# 2. MANDATORY GITHUB-FIRST WORKFLOW

Before substantive production work:

1. inspect latest `main`;
2. fetch this Master Plan from GitHub;
3. inspect files actually relevant to the task;
4. inspect relevant workflow/CI status;
5. establish rollback baseline;
6. identify changed-file allowlist;
7. assess regression risk;
8. confirm the change does not contradict a newer instruction;
9. implement only after the above is understood;
10. validate as far as the environment permits;
11. package canonical repo-relative files;
12. report exactly what was and was not verified.

If this Master Plan cannot be fetched, stop substantive implementation rather than silently relying on a stale local copy.

## 2.1 Remote-write rule

Connector permission is not authorization to mutate the repository.

Default workflow:

> Inspect GitHub → modify locally → QA → package repo-relative files → P’Benz uploads → inspect resulting commit → inspect CI → physical test where relevant

Do not create, update, delete, merge, push, or otherwise mutate GitHub unless P’Benz explicitly authorizes remote writes in that same turn.

“ทำเลย”, “ดำเนินการ”, “ส่งไฟล์”, and similar implementation requests authorize local implementation/package creation, not remote repository mutation.

---

# 3. COMMUNICATION CONTRACT — NON-NEGOTIABLE

Biew is female throughout this project.

When speaking Thai:

- self-reference: `บิ๊ว`;
- address the user as `พี่เบนซ์`;
- use feminine Thai endings such as `ค่ะ` and `คะ` correctly;
- never refer to self as `ผม`;
- never use masculine `ครับ` for Biew’s own speech.

This rule applies to:

- technical work;
- debugging;
- QA;
- planning;
- file handoff;
- urgent fixes;
- ordinary conversation.

Communication should be warm, direct, professional, practical, and evidence-based.

Avoid:

- robotic corporate filler;
- false certainty;
- vague reassurance;
- excessive emojis in technical responses;
- hiding the conclusion under process narration.

P’Benz is not required to act as a professional developer. Do not offload avoidable repository bookkeeping, path management, regression analysis, or architecture decisions to him.

---

# 4. FILE DELIVERY / NO-WAIT CONTRACT

When P’Benz asks for implementation and a file/package:

- perform the minimum necessary GitHub-first audit;
- produce a real downloadable artifact in the same turn whenever technically possible;
- do not end with only a status update;
- if full scope is unsafe, deliver the smallest safe complete coherent batch;
- never fabricate a ZIP, checksum, build result, CI result, runtime result, or device result.

Every GitHub-bound delivery must include:

- a **clickable download link**, not only `/mnt/data/...`;
- exact changed-file allowlist;
- canonical repo-relative paths;
- rollback baseline;
- actual QA performed;
- important unverified items;
- regression risk;
- SHA-256 when practical;
- a recommended commit name **50 characters or fewer**;
- commit name in a fenced Markdown code block.

Never make P’Benz ask for the commit name afterward.

Documentation-only changes do not require Android version bumps.

---

# 5. QA TRUTH CATEGORIES

Never blur different evidence levels.

### Static/source QA PASS

Source inspection, syntax, deterministic checks, package integrity, invariant checks.

### Local build PASS

Android source was actually compiled/built in the current environment.

### CI PASS

The uploaded commit passed the intended GitHub workflow.

### Runtime simulation PASS

Executable/browser/native simulation ran successfully in the available environment.

### Physical-device PASS

A real Android device demonstrated the claimed behavior.

### Preliminary physical smoke PASS

A brief real-device test found no immediate issue but did not exhaust the matrix.

### NOT TESTED

Anything not actually tested.

Rules:

- CI success does not prove Android WebView runtime behavior.
- Build success does not prove visual correctness.
- A screenshot proves the displayed state, not every hidden logic path.
- Do not call something “fully verified” when only one evidence layer passed.

---

# 6. CURRENT VERIFIED PRODUCTION SNAPSHOT — B66

Current production at Revision 5.0:

- branch: `main`;
- commit: `601b2b81894777267ecfdbe13a38b84d567ef605`;
- message: `Fix share card spacing and mascot`;
- Android version: `0.35.18-alpha66`;
- `versionCode`: `66`;
- application ID: `com.benedictinteractive.bearagnostic`;
- debug application ID: `com.benedictinteractive.bearagnostic.debug`;
- compileSdk: `36`;
- targetSdk: `36`;
- minSdk: `26`;
- Java compatibility: `17`;
- Google Play Billing Library: `9.1.0`;
- release minification/R8: **OFF**;
- adapter/cache version: `v=66`;
- pinned approved legacy/PWA commit: `78a31c7752e171c0eafb63c0d0859f4072a193d6`;
- approved launcher icon blob SHA-1: `f9cff58fc54e6b0525c7f74922b0588aca6a9a9d`;
- current workflow: `Build Android Debug APK`;
- B66 workflow run: **#72**, run ID `34709223602`;
- B66 CI conclusion: **SUCCESS**.

## 6.1 Current QA distribution limitation

The current GitHub workflow:

- builds `app-debug.apk`;
- creates an SHA-256 file;
- uploads both through `actions/upload-artifact`;
- retains artifacts for 14 days.

This workflow is valid CI evidence but is not an ideal daily physical-testing distribution path because Actions artifact downloads may be slow for P’Benz.

A future improvement is recommended:

> retain CI artifact + automatically publish the same successful QA APK as a direct downloadable rolling GitHub Release/Prerelease asset.

This is **not currently implemented**. Do not claim otherwise.

Any workflow change that requires `contents: write` or Release mutation requires explicit implementation approval and careful permission review.

## 6.2 Current physical evidence

Recent physically evidenced/accepted areas include:

- Benedict Interactive intro direction;
- Bearagnostic intro/hero presentation;
- transparent hero treatment;
- frameless/silver gear direction;
- intro timing around B59;
- scan file-flight motion polish around B60;
- native cleanup result sharing working from the B63 architecture onward;
- B66-style premium Result Share Card rendered on P’Benz’s real device without the B65 washed-out-mascot and Verification clipping defects visible in the later screenshot.

Do not infer full app release readiness from those accepted areas.

---

# 7. RECENT PRODUCTION HISTORY — B53 THROUGH B66

This is a concise handoff history, not a substitute for Git.

- **B53** — `Add Benedict intro splash`: introduced Benedict Interactive opening.
- **B54** — `Fix intro overlap keep new logo only`: corrected intro overlap.
- **B55** — `Finalize premium launch and gear`: refined launch/gear presentation.
- **B56** — `Center Bearagnostic intro hero`: centered hero presentation.
- **B57** — `Use exact Bearagnostic hero intro`: aligned intro with approved hero.
- **B58** — `Fix transparent Bearagnostic hero`: removed unwanted rectangular/opaque hero framing.
- **B59** — `Tune intro timing and handoff`: timing refined; physical result accepted.
- **B60** — `Smooth scan file flight animation`: compositor/GPU-friendly scan motion polish; physical result accepted.
- **B61** — `Premium result share card`: first premium image-card sharing attempt.
- **B62** — `Fix premium result image sharing`: fixed click interception approach but physical runtime still failed.
- **B63** — `Fix native premium result sharing`: moved rendering to native Android Bitmap/PNG path and restored working physical sharing.
- **B64** — `Refine premium cleanup share card`: visual refinement, but user judged the change insufficient.
- **B65** — `Final premium share card redesign`: larger redesign, but physical output exposed washed-out Dr.Bear and unsafe Verification spacing.
- **B66** — `Fix share card spacing and mascot`: fixed alpha state, spacing, Scan context, language-aware timestamp, and current card information architecture.

Important lesson:

> repeated visual iteration is not success by itself. Converge using device evidence and stop redesigning a working surface unless a real defect or clear product improvement is identified.

---

# 8. PRODUCT POSITIONING

Bearagnostic for Android is:

> **A premium, privacy-first file cleaner and file-health assistant for Android.**

It helps users:

- understand storage usage;
- scan accessible shared storage honestly;
- identify low-risk cleanup candidates;
- verify exact duplicates with real evidence;
- inspect large and older files without calling them junk;
- review Downloads, APK installers, archives, zero-byte files, empty folders, and media;
- distinguish Safe to clean, Review first, and Protected situations;
- clean only explicitly selected or strongly justified candidates;
- verify deletion actually occurred;
- show truthful reclaimed-space results;
- understand local change over time;
- retain control at every destructive step.

Bearagnostic is not a generic phone booster.

---

# 9. EXPLICITLY REJECTED PRODUCT BEHAVIOR

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
- inaccessible/private-app-cache cleaner;
- fear-based cleaner.

Never fabricate:

- junk totals;
- scan percentages;
- health scores;
- virus counts;
- optimization success;
- speed improvement percentages;
- reclaimed bytes not verified by deletion;
- fake undo;
- fake scan delays;
- fake progress;
- fake “deep” coverage;
- fake trends/patterns;
- fake entitlement/purchase status.

Storage reclamation may be described as reclaiming storage. It must not be presented as proof of CPU/RAM acceleration without real measurement.

---

# 10. VISUAL SOURCE OF TRUTH

Approved legacy repository:

`grolygori789-crypto/bearagnostic`

Pinned commit:

`78a31c7752e171c0eafb63c0d0859f4072a193d6`

Permanent principle:

> **Preserve the PWA literally first. Layer Android capability on top.**

Do not recreate approved interface elements by eye when approved source exists.

## 10.1 Protected visual contracts

Preserve unless P’Benz explicitly approves a change:

- Benedict Interactive opening;
- Bearagnostic opening;
- Bearagnostic wordmark/tagline;
- approved Home composition;
- frameless/silver settings gear;
- Dr.Bear identity;
- Start Checkup hero;
- File Health card;
- editorial still-life;
- five-tab bottom navigation;
- Checkup clinical scene;
- scan stages/live evidence style;
- glass-icon language;
- premium off-white/cyan/blue/mint/violet/amber system;
- intentional negative space;
- current approved intro timing/transition behavior.

## 10.2 Launcher icon — non-negotiable

Source:

`assets/icons/app-icon-192.png`

Approved blob SHA-1:

`f9cff58fc54e6b0525c7f74922b0588aca6a9a9d`

Never redraw, regenerate, substitute, screenshot-crop, or alter its crop casually.

---

# 11. PREMIUM DESIGN / READABILITY SYSTEM

The product should feel:

- refined;
- calm;
- bright;
- clinically trustworthy;
- editorial rather than game-like;
- premium without being flashy;
- spacious without looking unfinished.

Avoid:

- neon saturation;
- rainbow UI;
- excessive glass;
- crowded dashboards;
- dark hacker aesthetics;
- decorative metrics with no user value.

## 11.1 Semantic color roles

- Cyan/Azure — brand, scan, information, primary action;
- Indigo/Violet — deeper analysis / intelligence / duplicates;
- Mint/Teal — verified / safe / privacy / success;
- Amber/Champagne — review-first / caution;
- Slate Blue — neutral/system/protected;
- Coral/Red — destructive/error only;
- Warm support accent — voluntary support/care only where policy-safe.

## 11.2 Readability

Never shrink important text merely to force no-scroll composition.

Thai/Japanese require extra line-height and breathing room.

Important controls must be comfortably readable and tappable on a real phone.

Content-heavy task surfaces should scroll naturally rather than compressing text/cards.

Home can remain intentionally near-zero-scroll where practical, but readability wins over a rigid no-scroll rule.

---

# 12. DR.BEAR CONTRACT

Dr.Bear is a trust/brand character, not decoration to place everywhere.

Approved native mascot assets currently include:

- `drbear-inspect.png`;
- `drbear-review.png`;
- `drbear-success.png`;
- `drbear-caution.png`.

Preferred semantic mapping:

- inspect — scan / analysis / Insights;
- review — uncertainty / permissions / review-first;
- success — verified cleanup / positive result;
- caution — destructive confirmation / protected state.

Rules:

- use sparingly;
- never steal task space;
- preserve transparent background;
- preserve outline;
- no accidental white matte/halo;
- no low-alpha inherited paint state;
- no regeneration for ordinary UI work when approved asset exists.

---

# 13. CURRENT ANDROID FRONTEND ASSEMBLY

The Android app imports the pinned PWA, verifies critical blobs, then overlays focused Android adapters.

Current B66 load order includes:

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
18. `android-scan-motion-polish.js`
19. `android-review-media.js`
20. `android-share-card.js`
21. `android-premium-color.js`
22. `android-pro-ui.js`
23. `android-billing.js`
24. `android-plan-status.js`
25. `android-readability.js`
26. `android-custom-scan.js`
27. `android-insights.js`
28. `android-shell-ux.js`
29. `android-stabilization.js`
30. `android-locale-polish.js`
31. `android-home-polish.js`
32. `android-build-truth.js`

Do not casually reorder modules.

Adapter order controls:

- event capture priority;
- entitlement gating;
- focused workspaces;
- scan presentation;
- sharing;
- late typography/polish;
- stabilization;
- truthful build labels.

Prefer focused adapters over rewriting the pinned PWA or duplicating native logic.

---

# 14. SCAN MODE CONTRACT

Scope and depth are separate concepts.

## 14.1 Quick Scan

- all accessible shared storage;
- metadata and deterministic rules;
- no file-content read;
- no duplicate hashing;
- may legitimately complete very quickly.

## 14.2 Smart Scan

Recommended default.

Performs:

- all accessible shared storage;
- metadata/rules;
- real bounded content sample of every readable non-empty file;
- focused exact duplicate verification in high-value locations.

Important constant:

`SMART_SAMPLE_BYTES = 256 KiB`

## 14.3 Deep Scan

Performs the deepest legitimate supported work:

- all accessible shared storage;
- metadata/rules;
- full streaming content read of readable non-empty files;
- exact duplicate verification across accessible scope.

Coverage is FULL only when intended reads genuinely complete.

Failures must result in PARTIAL coverage rather than being hidden.

## 14.4 Custom Scan

Selectable scopes:

- Downloads;
- Photos;
- Videos;
- Documents;
- Music.

Custom may optionally verify exact duplicates in selected scopes.

Zero selected scopes must never silently substitute default scopes.

---

# 15. SCAN TRUTH / SPEED / PROGRESS

Permanent rule:

> **Fast because the real work finished — never slow because the UI pretended to work.**

No artificial sleeps, fake percentages, staged delays, or minimum durations.

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
- active item;
- duration;
- final coverage.

Show `—` instead of misleading `0` when a measurement has not begun.

Scan animation is presentation only. It must never imply work that the native scanner did not perform.

---

# 16. ANDROID STORAGE BOUNDARIES

Operate only within legitimate Android access.

Protected/skipped areas include:

- `Android/data`;
- `Android/obb`;
- inaccessible app-private storage;
- protected/encrypted vault content not exposed by Android.

Do not bypass Android permission boundaries, encryption, or vault protection.

If distribution/store policy later conflicts with broad storage access, redesign compliantly rather than misrepresenting coverage.

---

# 17. REVIEW AND DELETION SAFETY CONTRACT

## 17.1 Scanner is read-only

Scanning never deletes files.

## 17.2 Destructive flow

Default sequence:

`Select → Review → Confirm → Delete → Verify → Summary`

## 17.3 Snapshot guard

Deletion IDs come from the current in-memory review snapshot.

Dedicated file review treats snapshots older than approximately 15 minutes as stale and requires refresh.

## 17.4 Batch limits

File deletion cap:

`500 files`

Empty Folder deletion uses tighter limits and rechecks emptiness immediately before deletion.

## 17.5 Verified reclaimed bytes

Count reclaimed storage only when deletion is verified.

## 17.6 Exact duplicate safety

Exact duplicate identity requires:

1. exact-size prefilter;
2. streaming SHA-256;
3. keep-one-copy protection.

At least one copy must remain at both UI and Native layers.

## 17.7 Safety classifications

Use consistently:

- **Safe to clean**
- **Review first**
- **Protected**

Safety explanation remains Free.

---

# 18. CLASSIFICATION PRINCIPLES

File category is evidence, not permission to delete.

Permanent rules:

- Large ≠ Junk;
- Old ≠ Junk;
- Hidden ≠ Junk;
- Archive ≠ Junk;
- APK ≠ Junk;
- Downloads ≠ Junk;
- Duplicate identity ≠ permission to remove the final copy.

Older Files currently use approximately 365 days.

Auto-clean eligibility remains narrow and evidence-based.

---

# 19. CURRENT FIRST-CLASS TOOLSET

Current functional workspaces include:

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

## 19.1 Quick Clean

Free, safety-first, strongly justified low-risk candidates only.

Do not silently absorb generic Large, Old, APK, Archive, or ambiguous files.

## 19.2 Exact Duplicates

Free remains useful for manual verified duplicate review.

Keep-one-copy protection is mandatory.

## 19.3 Large / Older

Free review-first workflows.

Never auto-select solely because of size/age.

## 19.4 Downloads / APK / Archives / Zero-byte

First-class review workflows with category-specific explanations.

Location/type alone is not deletion permission.

## 19.5 Empty Folders

Separate directory path, with immediate emptiness recheck and system/app protection.

## 19.6 Advanced Media Review

Pro feature supporting media categories, useful filters/sorts, local thumbnails/metadata, bounded result count, final review, and verified deletion.

Do not overclaim untested destructive scenarios.

---

# 20. HIDDEN ITEMS PRIVACY CONTROL

Hidden Items is a Free privacy control and default-OFF.

When OFF:

- conceal accessible hidden/private-labelled items from dedicated review lists;
- do not load hidden media previews;
- do not promote hidden items into Quick Clean;
- aggregate hidden count/bytes may be shown without revealing names/thumbnails when useful;
- prune selected hidden items when concealment is re-enabled.

When ON:

- accessible hidden/private-labelled items may appear where relevant;
- they remain Review first unless another independent rule justifies otherwise;
- selection remains explicit;
- normal deletion safeguards remain.

---

# 21. CHECKUP / NAVIGATION CONTRACT

Root Ready state:

- fixed five-tab bottom navigation;
- Home / Checkup / Tools / Insights / More;
- Checkup highlighted on Checkup;
- no redundant top Home icon.

Focused task state:

- bottom nav may hide to protect work space.

Closing the focused result returns to the root navigation contract.

Do not regress the B41 navigation correction.

---

# 22. INSIGHTS / LOCAL HISTORY

Insights is evidence-based local history, not a fake health score.

Architecture:

- aggregate-only local history;
- `AtomicFile` persistence;
- bounded scan/cleanup records;
- no persistent filenames/paths/file hashes in history;
- history failure must not block deletion or falsify cleanup;
- compare only comparable complete scans;
- do not compare partial Custom scans as if they were full scans.

Free may include current-state information.

Pro may include richer historical What Changed / Storage Trend / Patterns where enough real evidence exists.

Never invent trends to fill empty time.

---

# 23. FREE / PRO PRODUCT MODEL

Preferred commercial direction remains:

> **Free + one-time lifetime Bearagnostic Pro**

Current strategic direction:

- no mandatory subscription;
- no ads as part of the premium brand direction;
- no unnecessary Bearagnostic password account for ordinary use;
- same signed APK for Free and Pro unless a future technical reason clearly justifies otherwise;
- Pro controlled by entitlement rather than separate APK binaries.

Free must remain genuinely useful.

Essential safety must never be paywalled.

Pro should represent genuine additional depth, convenience, history, or advanced workflows.

Historical Play-target price ideas from Revision 4.0 are **not a current public commitment** and must be reconfirmed before launch.

---

# 24. MONETIZATION STRATEGY UPDATE — INDEPENDENT FIRST

The strategic business direction has changed from “Google Play as required monetization foundation” to:

> **Independent by default. Stores by choice.**

Benedict Interactive should be able to distribute, sell, support, and restore Bearagnostic Pro without depending on Google Play.

Primary future commercial direction:

`Bearagnostic / Benedict website → trusted checkout → server-verified payment → entitlement → app unlock`

Successful real payment should unlock Pro automatically without P’Benz manually monitoring bank transfers.

## 24.1 Preferred future entitlement architecture

Conceptual flow:

```text
Bearagnostic / Benedict website
        ↓
Trusted payment provider / checkout
        ↓
Signed/reliable server payment confirmation
        ↓
Benedict entitlement backend
        ↓
Entitlement active
        ↓
Bearagnostic refresh / restore
        ↓
Pro unlocked
```

Rules:

- no screenshot as proof of payment;
- no client redirect as proof of payment;
- no manual “I received a transfer, flip isPro” workflow;
- use idempotent server-side processing;
- support recovery/restore;
- preserve a safe offline entitlement cache;
- maintain an audit trail;
- keep secrets outside the APK/public repo.

Potential backend direction:

- Cloudflare Worker or equivalent;
- D1 or equivalent durable store;
- provider-hosted checkout where practical;
- email/magic-link recovery if identity is needed.

Do not build a giant account system, custom payment processor, or bank scraper.

## 24.2 Single entitlement source inside the app

Bearagnostic should continue to expose one coherent entitlement state to product UI/capability gates.

If independent commerce is implemented:

- normalize verified backend entitlement into the existing entitlement layer;
- do not create parallel `webPro`, `playPro`, `manualPro`, etc. UI truth;
- one internal entitlement contract should drive Pro capability.

---

# 25. EXISTING GOOGLE PLAY BILLING CAPABILITY — OPTIONAL CHANNEL

Current code still includes:

- Google Play Billing Library `9.1.0`;
- one-time product architecture;
- product ID `bearagnostic_pro_lifetime`;
- purchased/pending/acknowledgement handling;
- cached ownership continuity;
- Billing Sandbox;
- debug owner/store simulation.

This capability remains useful as:

- a tested architecture/reference;
- an optional future Google Play distribution/payment channel;
- a QA source for purchase-state lifecycle behavior.

It is **not** the strategic dependency of the business anymore.

Do not remove or rewrite it casually.

Before changing Billing architecture, first decide whether:

- Play support remains as an optional provider;
- it should feed the same canonical entitlement backend;
- or it should be retired in a deliberate migration.

Real Google Play purchase lifecycle remains unverified unless actual Play Internal Testing evidence is later produced.

---

# 26. DEBUG BILLING SANDBOX

The debug-only dual-sided Billing Sandbox exists to simulate customer/store states.

It does not contact Google Play and cannot charge money.

Developer Mode entry:

`More → About Bearagnostic → tap build/version text seven times`

The sandbox remains valuable for entitlement-state QA even if Google Play is no longer the primary business strategy.

Maintain debug/release isolation.

Never ship executable sandbox internals in a release binary.

B49–B52 remain important lessons:

- bridge success must be confirmed by Native truth;
- WebView method binding can break runtime despite green CI;
- MutationObserver loops can cause startup failure;
- polling must not replace focused controls;
- Developer/QA UI readability wins over density.

---

# 27. PREMIUM RESULT SHARE CARD — B63–B66 CONTRACT

Result sharing is now a first-class product surface.

## 27.1 Current architecture

The working architecture is:

`#nativeShareResult → android-share-card.js → BearagnosticShareBridge → native Bitmap render → PNG → MediaStore → ACTION_SEND chooser`

Important behavior:

- capture only the intended `#nativeShareResult` button;
- call native bridge synchronously;
- stop the legacy click path **only when native returns `accepted=true`**;
- otherwise allow the legacy text-share fallback to continue.

Do not return to:

- global catch-all click blocking;
- WebView canvas as the primary card renderer;
- swallowing the click before native acceptance is known.

## 27.2 Current information architecture

The Share Result Card should include only real linked result/session data:

- reclaimed bytes as headline;
- files removed;
- duplicates resolved;
- free storage after cleanup;
- cleanup method;
- scan mode;
- files reviewed;
- coverage;
- verification explanation;
- generated timestamp;
- privacy boundary;
- Benedict/Bearagnostic branding.

Do not include:

- private file names;
- paths;
- thumbnails of deleted/private files;
- technical logs;
- invented health scores;
- fake metrics.

If a value is unavailable, omit or show an honest unavailable state rather than inventing it.

If storage percentage rounds to the same value, do not present a redundant before→after as if it proves nothing happened; use the post-cleanup value plus an explanatory note.

## 27.3 B66 visual rules

B66 fixed:

- inherited low Paint alpha on Dr.Bear;
- hero spacing;
- chip/text overlap risk;
- Verification clipping;
- Scan context;
- app-language timestamp formatting.

When drawing mascot:

- force `paint.alpha = 255` before/after bitmap drawing.

Current B66 card is approximately:

- 1080 × 1350 PNG;
- premium white/blue/mint clinical report style;
- Dr.Bear success pose;
- strong reclaimed-space hero;
- three What changed cards;
- Scan context strip;
- Result details;
- privacy/footer trust layer.

P’Benz’s later real-device screenshot indicates this information density is currently considered balanced.

Do not resume endless cosmetic iteration unless new evidence shows a defect or meaningful usability improvement.

---

# 28. LOCALIZATION

Currently exposed production languages:

- English;
- ไทย;
- 日本語.

These must remain coherent across exposed first-class surfaces.

Mixed-language UI is a release defect.

Future launch expansion previously targeted:

- Español;
- Português (Brasil).

Do not expose incomplete locales.

Translation must be:

- intent-first;
- natural/native;
- technically accurate;
- clear for destructive warnings;
- clear for privacy/entitlement states;
- visually balanced.

Current Share Card supports localized static labels for EN/TH/JA and formats its timestamp from app language rather than unrelated device locale.

Long-term centralization is desirable, but avoid a risky big-bang localization rewrite during stabilization.

---

# 29. PRIVACY CONTRACT

Bearagnostic is local-first.

Do not add:

- file-content uploads;
- remote filename inventory;
- hidden behavioral telemetry;
- behavioral advertising;
- unnecessary accounts;
- persistent full file trees;
- unnecessary long-term file hashes.

Allowed when disclosed/justified:

- aggregate local history;
- local cleanup totals;
- local trends;
- entitlement metadata required for purchase/restore;
- intentionally requested support/network operations.

Share Result Cards must preserve privacy and should not expose file content, names, or paths.

Privacy claims must match implementation.

---

# 30. TESTER PROGRAM DIRECTION

Bearagnostic should participate in a reusable **Benedict Tester Program**.

The program should remain independent of Google Play, although Play closed testing may be used later as an optional channel.

Potential secure tester capabilities:

- low-friction login / magic link;
- current test build;
- test mission;
- feedback form;
- bug report;
- device/app version context;
- participation history;
- reward status;
- owner moderation.

Rewards may recognize:

- participation;
- completed test missions;
- sustained testing;
- useful bug reports;
- high-quality feedback.

Rewards must **not** depend on:

- positive sentiment;
- five-star ratings;
- positive public reviews.

Private QA feedback and public testimonials are different systems.

Never auto-publish tester feedback.

Public testimonials require moderation and publication consent.

---

# 31. INDEPENDENT DISTRIBUTION / UPDATE DIRECTION

Primary direction:

> Benedict Interactive website → official Bearagnostic page → official download

Secondary channels may include Uptodown and optional future stores.

Google Play is optional.

Benedict Interactive should remain canonical for:

- current stable version;
- official download source;
- release notes;
- checksum/signature information when exposed;
- support;
- purchase/licensing information.

Future direct update UX should be transparent:

```text
New version available
→ show version/changelog
→ user chooses download
→ Android installer confirms installation
```

Do not implement silent/unconsented installation behavior.

Production signing continuity is critical. A public direct-update path must use stable production signing so future versions can update the installed app safely.

---

# 32. QA APK DELIVERY — NEAR-TERM DEV WORKFLOW

P’Benz physically tests APKs frequently.

Therefore APK delivery speed is part of the development workflow, not a minor convenience.

Current Actions artifact delivery is acceptable as CI archive evidence but may be too slow for repeated daily testing.

Recommended future workflow:

```text
push to main
→ CI builds debug APK
→ CI creates checksum
→ artifact retained for evidence
→ successful APK also published to one rolling QA Release/Prerelease
→ P’Benz downloads direct QA APK
```

Do not implement this until explicitly authorized.

If implemented:

- keep CI artifact;
- do not clutter Releases with one permanent release per build unless deliberately desired;
- use one rolling QA release or similarly low-maintenance pattern;
- verify permissions;
- do not expose production signing secrets.

---

# 33. LEGAL / IP

Current repo contains:

- `LICENSE.md`;
- `docs/legal/README.md`;
- `docs/legal/COPYRIGHT_AND_IP.md`;
- `docs/legal/TERMS_OF_USE.md`;
- `docs/legal/PRIVACY_POLICY.md`;
- `docs/legal/THIRD_PARTY_NOTICES.md`.

Principles:

- protect Bearagnostic code, protectable UI expression, Dr.Bear/branding, icons/assets, copy, localization, docs, and protectable selection/arrangement;
- respect third-party/open-source licenses;
- do not claim ownership over generic ideas, Android APIs, facts, SHA-256, common UI conventions, or third-party material;
- do not falsely claim trademark registration/corporate status.

Before broad commercial launch, professional legal review may be appropriate.

---

# 34. HIGH-RISK FILES / AREAS

Extra scrutiny required for:

- `FileHealthScanner.kt`;
- `MainActivity.kt`;
- `NativeBridge.kt`;
- `EntitlementManager.kt`;
- `PlayBillingManager.kt`;
- `DebugBillingSandbox.kt`;
- `LocalHistoryStore.kt`;
- `ShareCardBridge.kt`;
- `app/build.gradle.kts`;
- `android-native.js`;
- `android-billing.js`;
- `android-share-card.js`;
- duplicate keep-one logic;
- hidden-item filtering;
- media preview access;
- storage permissions;
- release signing;
- payment/entitlement networking;
- external support/payment links;
- auto-update/download logic.

Prefer presentation-layer changes when native scanner/deletion logic does not need modification.

---

# 35. IMPORTANT CONSTANTS / INVARIANTS

Treat these as deliberate until inspected and intentionally changed:

- analysis rules version: `ANALYSIS_RULES_VERSION = 8`;
- Smart sample: 256 KiB per readable non-empty file;
- streaming/hash buffer: 256 KiB;
- progress emission interval: approximately 160 ms;
- review candidate cap: 10,000;
- file deletion cap: 500;
- stale dedicated review snapshot: approximately 15 minutes;
- Older Files age: approximately 365 days;
- `Android/data` and `Android/obb` protected/skipped;
- exact duplicate identity: exact size + streaming SHA-256;
- duplicate deletion keeps at least one copy;
- scanner is read-only;
- no artificial scan delay;
- Insights history aggregate-only/local;
- B66 R8/minification OFF;
- Billing Sandbox executable engine debug-only;
- pinned PWA commit remains unchanged;
- launcher icon contract remains unchanged.

---

# 36. KNOWN FAILURE MODES — DO NOT REPEAT

Avoid:

- recreating PWA by eye;
- changing launcher icon;
- giant mascots;
- tiny typography to force fit;
- fake scan time/progress/depth;
- treating category/location as deletion permission;
- duplicate group deletable to zero;
- hidden previews when Hidden Items is OFF;
- stale-snapshot deletion;
- unverified reclaimed bytes;
- prominent SHA jargon in normal UI;
- global FREE badge;
- hard-coded live purchase price without current provider truth;
- support/donation payment unlocking Pro;
- roadmap features shown as finished;
- scanner rewrite for visual pacing;
- fake health trend/pattern;
- comparing partial scans to full scans;
- persistent filenames/paths/hashes in Insights;
- mixed-language exposed locale;
- fixed-height English-first typography;
- responsive fixes that simply shrink fonts;
- detached WebView bridge methods;
- MutationObserver feedback loops;
- polling that replaces a focused control;
- background refresh that resets tabs/scroll;
- success toast without Native confirmation;
- assuming CI proves runtime;
- global share click interception;
- consuming share click before native acceptance;
- WebView canvas as primary result-card architecture;
- Paint alpha leaking into mascot rendering;
- endlessly redesigning a device-approved surface without a defect.

---

# 37. DEFINITION OF FEATURE COMPLETE

A button opening a screen is not feature complete.

A first-class destructive workflow should normally include:

`Entry → Real data → Loading/Empty/Found/Error → Explanation → Preview/Context → Selection → Safety classification → Confirm → Native action → Verify → Truthful summary → Updated state`

For non-destructive workflows, remove irrelevant destructive stages but still require:

- real data;
- meaningful empty/error states;
- truthful outcome;
- understandable next step.

---

# 38. DEFINITION OF 10/10

A 10/10 Bearagnostic feature should be:

- immediately understandable;
- truthful about scope and coverage;
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
- supported by evidence matching the QA claim.

The goal is not merely “works.”

The goal is:

> **trustworthy enough that users will confidently let it inspect and clean personal storage.**

---

# 39. CURRENT NEAR-TERM ROADMAP FROM B66

Always fetch GitHub before assigning the next build number.

## Phase 1 — Stabilize from B66

Do not reopen already accepted intro/scan/share-card surfaces unless a real defect appears.

Use normal daily operation and targeted physical QA to identify remaining release blockers.

## Phase 2 — Improve QA APK delivery

If P’Benz approves, add a low-maintenance direct QA download path after successful CI while keeping Actions artifacts for evidence.

## Phase 3 — Full app QA

Systematically test:

- Quick/Smart/Deep/Custom scans;
- permissions grant/loss/regrant;
- duplicates;
- destructive delete matrix;
- hidden-item privacy;
- empty-folder safety;
- media review;
- large-storage stress;
- background/resume;
- startup;
- sharing;
- accessibility/touch targets;
- memory/performance;
- EN/TH/JA;
- offline/error states.

## Phase 4 — Insights evidence review

Continue collecting enough real history to evaluate What Changed / Storage Trend / Patterns honestly.

## Phase 5 — Localization completion

Keep EN/TH/JA healthy.

Complete ES/PT-BR end-to-end before exposing them if those remain launch targets.

## Phase 6 — Independent distribution hardening

Prepare:

- stable production signing;
- direct APK channel;
- version/release manifest;
- changelog;
- checksum/signature presentation;
- transparent update UX;
- Benedict website download integration.

## Phase 7 — Independent Pro entitlement

Design and implement only when ready:

- server-verified payment;
- entitlement API;
- restore/recovery;
- safe offline cache;
- single app entitlement truth;
- same APK Free/Pro;
- audit/retry/idempotency.

## Phase 8 — Tester Program

Connect Bearagnostic QA builds to the Benedict Tester Program once the secure backend/public entry surface is ready.

## Phase 9 — Optional store channels

Evaluate Google Play/Uptodown or other channels based on discovery, user trust, maintenance burden, and business value.

Do not let optional stores redefine the core product/business architecture.

---

# 40. RELEASE BLOCKERS

Do not ship merely because debug APK builds.

Release blockers include as applicable:

- production signing;
- release APK/AAB strategy appropriate to chosen channels;
- destructive deletion safety on real devices;
- privacy-policy implementation consistency;
- storage permission/policy review;
- release binary verification;
- removal/isolation of debug-only QA engines;
- exposed-locale completeness;
- support path;
- official download/update path;
- commerce/entitlement lifecycle testing if Pro is sold;
- recovery/refund/revoke behavior if commerce is live;
- truthful public listing/download copy.

Play-specific blockers apply only if Play becomes an active release channel.

---

# 41. MASTER PLAN MAINTENANCE

This document is not a raw changelog.

Update it when a change materially affects:

- production state;
- architecture;
- feature completion;
- safety;
- privacy;
- scan contracts;
- UX/visual contracts;
- localization;
- Free/Pro boundaries;
- distribution;
- entitlement/payment strategy;
- tester program;
- legal/release strategy;
- QA/delivery rules;
- room handoff.

Always overwrite:

`docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`

Never create competing `final`, `v2`, `new`, `backup`, or dated Master Plans.

---

# 42. NEXT-ROOM STARTUP CHECKLIST

At the start of a new Bearagnostic room:

1. read `docs/BEARAGNOSTIC_ROOM_MIGRATION_MASTER_PROMPT.md`;
2. fetch latest `main`;
3. fetch this Master Plan;
4. inspect latest `app/build.gradle.kts`;
5. confirm current version/cache/adapter order;
6. inspect task-relevant files;
7. inspect latest GitHub Actions run;
8. establish rollback baseline;
9. define changed-file allowlist/regression risk;
10. preserve Biew’s female Thai communication contract;
11. preserve real-file/no-wait delivery contract;
12. preserve commit-name ≤50 characters in code block;
13. do not remote-write without explicit same-turn authorization;
14. distinguish CI from physical evidence;
15. continue from newest evidence rather than reopening solved defects.

If production still shows commit `601b2b81894777267ecfdbe13a38b84d567ef605`, current runtime is B66 (`0.35.18-alpha66`, code 66).

---

**End of Revision 5.0**
