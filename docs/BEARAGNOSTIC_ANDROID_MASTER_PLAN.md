# BEARAGNOSTIC ANDROID MASTER PLAN

**Repository:** `grolygori789-crypto/bearagnostic-android`  
**Canonical file:** `docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`  
**Revision:** 1.0  
**Initial issue date:** 8 September 2026  
**Owner / Product Authority:** P’Benz  
**Studio / Publisher:** Benedict Interactive  
**Product & Development Lead:** Biu  

---

## 0. PURPOSE OF THIS DOCUMENT

This document is the primary operating contract for the Android edition of Bearagnostic.

It exists to keep the product, design, engineering, safety, localization, repository structure, QA, packaging, and release workflow aligned as the project grows.

The Android edition must become a **premium, privacy-first, all-in-one junk file cleaner and file-health utility** that feels exceptionally expensive, refined, trustworthy, and effortless to use while remaining realistically buildable with an overall implementation complexity of **Medium or lower**.

The permanent engineering North Star is:

> **Simple architecture. Exceptional execution. Zero unnecessary complexity.**

The permanent product quality target is:

> **10/10 perceived quality, 10/10 clarity, 10/10 practical usefulness — without exceeding Medium implementation complexity.**

Premium does not mean complicated. Every feature must earn its complexity.

---

# 1. SOURCE OF TRUTH AND AUTHORITY

## 1.1 GitHub-first rule

Before proposing, designing, modifying, packaging, or evaluating any production change, the current repository on GitHub must be inspected first.

The authoritative project memory is the production repository:

`grolygori789-crypto/bearagnostic-android`

Implementation must not be based on a stale local ZIP, an old attachment, an old code sample, or remembered chat history when the current GitHub repository can be inspected.

The current production repository is always the baseline for regression analysis.

## 1.2 Authority order

When instructions or artifacts conflict, resolve them in this order:

1. Latest explicit instruction from P’Benz.
2. Current production repository on GitHub.
3. This Master Plan.
4. Current approved production assets and visual references.
5. Older project discussions, historical packages, or superseded documentation.

A new explicit instruction from P’Benz may override this Master Plan. When that happens, the Master Plan should be updated at the next appropriate opportunity so the repository becomes aligned again.

## 1.3 Repository-only continuity

Once this Master Plan is committed, future development must treat the repository itself as the durable source of project state.

Chat history may help explain a current instruction, but it must not silently override the repository.

When the repository does not contain enough information for a materially important decision:

- inspect related production files first;
- choose the most conservative non-regressive interpretation when safe;
- ask P’Benz only when the missing decision materially changes product behavior, safety, architecture, or visual direction.

---

# 2. MASTER PLAN FILE GOVERNANCE

## 2.1 Permanent canonical filename

The Master Plan must always remain at exactly:

`docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`

Every future Master Plan update must **overwrite this exact file**.

Never create:

- `BEARAGNOSTIC_ANDROID_MASTER_PLAN_v2.md`
- `BEARAGNOSTIC_ANDROID_MASTER_PLAN_FINAL.md`
- `BEARAGNOSTIC_ANDROID_MASTER_PLAN_NEW.md`
- dated duplicate copies;
- backup copies in production;
- revision-suffixed Master Plan files.

Revision history belongs inside this canonical file, not in duplicate files.

## 2.2 Revision policy

When this Master Plan changes:

- keep the same filename and path;
- increment the internal revision number;
- update the revision date;
- summarize the meaningful governance change in the revision history;
- overwrite the prior file.

The repository should contain one current Master Plan, not a pile of historical variants.

## 2.3 Canonical-path principle for all project files

The same rule applies across the project:

> If an existing production file can be updated in place, update the existing canonical path instead of creating a replacement file.

Never use names such as:

- `new`
- `new2`
- `v2`
- `final`
- `final-final`
- `backup`
- `old`
- `copy`
- temporary implementation suffixes

unless the suffix is part of a deliberate permanent product architecture.

Create a new file only when it has a genuinely distinct, durable responsibility.

If a refactor makes a previous production file obsolete, the obsolete file must be explicitly removed rather than silently abandoned.

---

# 3. CURRENT PRODUCTION BASELINE AT REVISION 1.0

This section is a snapshot only. It must never override newer production.

At the time this Master Plan was created, the verified GitHub production baseline was:

- branch: `main`;
- latest production commit: `4f3f867aac6ff36585bc413b716e939906d766dc`;
- commit name: `Stabilize Android debug signing`;
- Android version: `0.3.0-alpha03`;
- `versionCode`: `3`;
- application ID: `com.benedictinteractive.bearagnostic`;
- debug package: `com.benedictinteractive.bearagnostic.debug`;
- `compileSdk`: 36;
- `targetSdk`: 36;
- `minSdk`: 26;
- Java compatibility: 17;
- Android Gradle Plugin: 9.4.0;
- CI Gradle: 9.6.0;
- local packaged Web UI;
- Kotlin native bridge;
- broad-storage permission handoff;
- real native `FileHealthScanner`;
- stable development-only debug signing identity;
- GitHub Actions debug APK pipeline;
- latest inspected debug APK workflow completed successfully.

Future work must re-inspect GitHub rather than assuming this snapshot is still current.

---

# 4. PRODUCT POSITIONING

Bearagnostic for Android is:

> **A premium, privacy-first, all-in-one junk file cleaner and file-health assistant for Android.**

It is not merely a scanner.

It must help users:

- understand what is consuming storage;
- automatically identify cleanable clutter;
- distinguish genuinely safe cleanup from risky deletion;
- clean low-risk junk efficiently;
- review ambiguous files intelligently;
- manually inspect and remove files when desired;
- understand exactly why Bearagnostic recommends keeping or deleting something.

The product should feel like a high-end diagnostic and maintenance utility rather than a noisy “phone booster”.

The emotional experience should be:

- calm;
- intelligent;
- expensive;
- trustworthy;
- clinically clear;
- fast;
- reassuring without being childish;
- useful without being intimidating.

---

# 5. PRODUCT PROMISE

Bearagnostic should make this promise truthfully:

> **Find clutter. Explain the risk. Clean with confidence.**

The app must never use fear, fake urgency, fabricated junk totals, fake health scores, fake virus warnings, or fake system optimization claims to push cleanup.

The app should earn trust through evidence.

---

# 6. CORE OPERATING MODES

## 6.1 One-Tap Smart Checkup

The primary experience.

User action:

`Start Checkup`

The app then:

1. verifies required storage permission;
2. discovers accessible user/shared storage;
3. scans real files;
4. analyzes metadata;
5. identifies duplicate candidates;
6. verifies duplicates when appropriate;
7. classifies cleanup candidates;
8. evaluates deletion risk;
9. calculates truthful reclaimable space;
10. presents a premium results screen;
11. recommends next actions.

The scan should require as little user effort as Android permits.

## 6.2 Manual Clean

Users must also be able to work manually without running a complete checkup.

Manual mode should support:

- category-based review;
- folder browsing;
- search;
- sort;
- filter;
- multi-select;
- manual delete;
- targeted scan of a category or location when practical.

Automatic intelligence must never remove user control.

---

# 7. PERFECT V1 — ALL-IN-ONE CAPABILITY SET

The target V1 capability set is deliberately broad enough to feel complete, while remaining within Medium complexity.

## 7.1 One-Tap Smart Checkup

Automatic scan of all user-accessible storage within Android’s legitimate permission boundaries.

## 7.2 Quick Clean

A review-first cleanup experience that preselects only items meeting strict low-risk rules.

Quick Clean must never mean “delete anything Bearagnostic found”.

## 7.3 Duplicate Cleaner

Must use evidence, not filenames.

Recommended detection pipeline:

`exact size → candidate group → streaming SHA-256 → verified duplicate`

Rules:

- exact duplicates must be byte-for-byte verified;
- always retain at least one copy by default;
- never auto-select every copy in a duplicate group;
- do not call same-size files “duplicates” until verified.

## 7.4 Large Files

Surface files by configurable or sensible thresholds such as:

- 100 MB+;
- 500 MB+;
- 1 GB+.

Large does not mean junk.

Large files are normally review candidates, not automatic cleanup.

## 7.5 Old Files

Surface files based on real modification timestamps.

Useful filters may include:

- 30 days;
- 90 days;
- 180 days;
- 365 days+.

Old does not automatically mean junk.

## 7.6 Downloads Cleaner

Downloads deserves a first-class cleanup experience.

Useful categories:

- old downloads;
- APK installers;
- archives;
- documents;
- images;
- videos;
- incomplete downloads;
- other files.

## 7.7 Temporary File Cleaner

Rule-based detection of temporary or interrupted-download artifacts when evidence is strong.

Examples may include carefully validated patterns such as:

- `.tmp`
- `.temp`
- `.part`
- `.partial`
- `.crdownload`
- known incomplete-download artifacts

Do not use filename extensions alone when a rule could create meaningful false positives.

## 7.8 APK Installer Cleaner

Surface downloaded APK installation files.

Explain clearly:

- deleting an APK does not uninstall an already installed app;
- deleting it removes the local installer copy;
- keep it if the user may need the installer again.

## 7.9 Archive Cleaner

Surface archives such as ZIP and other supported archive formats.

Archives should normally be review candidates because they may contain the only copy of important files.

## 7.10 Empty Folder Cleaner

Detect truly empty folders where Android access permits.

Never mislabel inaccessible folders as empty.

## 7.11 Zero-Byte File Cleaner

Detect genuine zero-byte files.

Classification must consider location and naming context before calling them safe.

## 7.12 Screenshot and Media Review

Provide a useful review surface for:

- screenshots;
- large photos;
- large videos;
- older media.

This is a review tool, not a claim that media is junk.

## 7.13 Manual File Browser

Professional file review features:

- browse;
- search filename;
- sort by size;
- sort by date;
- sort by type;
- filter;
- folder context;
- multi-select;
- delete;
- clear selection;
- inspect file details.

## 7.14 Storage Overview

Provide truthful storage information that can be derived reliably.

Examples:

- used space;
- available space;
- reviewed file totals;
- broad user-file categories where classification is reliable.

Avoid fake precision when Android cannot provide exact ownership/category information.

## 7.15 Cleanup History and Privacy Dashboard

Keep only useful aggregate history.

Possible history:

- cleanup date;
- files successfully removed;
- bytes actually reclaimed;
- category totals.

Do not persist:

- file contents;
- complete file trees;
- unnecessary full paths;
- hashes;
- sensitive filenames;
- behavioral tracking profiles.

Privacy Dashboard should make the local-first model obvious.

---

# 8. JUNK CLASSIFICATION ENGINE

A cleaner becomes trustworthy only when it distinguishes evidence from guesswork.

Bearagnostic must not treat every old, large, or unfamiliar file as junk.

## 8.1 Junk confidence

Recommended logical confidence levels:

### VERIFIED / SAFE CANDIDATE

Strong deterministic evidence supports cleanup.

Examples may include:

- verified duplicate extra copy;
- truly empty folder under an approved safe rule;
- validated stale temporary artifact.

### LIKELY JUNK

Evidence is strong but not absolute.

User review may still be appropriate depending on risk.

### REVIEW CANDIDATE

The item may be unnecessary, but Bearagnostic does not have enough evidence to call it junk.

Examples:

- old archive;
- old download;
- very large personal video;
- backup-like file.

### NOT JUNK / KEEP

The app has no cleanup justification.

---

# 9. DELETION RISK ENGINE

Junk confidence and deletion risk are different concepts and must remain separate.

A file can look unnecessary while still being risky to delete.

Recommended risk levels:

- `0 — Safe`
- `1 — Low Risk`
- `2 — Review`
- `3 — High Risk`
- `4 — Protected / Never Auto-Select`

## 9.1 Recommendation policy

### Safe

- may be auto-selected by Quick Clean when the cleanup rule explicitly allows it;
- clear explanation still available.

### Low Risk

- may be auto-selected only when the rule is mature and evidence is strong;
- should show a short consequence explanation.

### Review

- never auto-select by default;
- user must deliberately choose it.

### High Risk

- never auto-select;
- show warning icon;
- explain likely consequence;
- require stronger confirmation if the user chooses deletion.

### Protected

- do not recommend deletion;
- do not auto-select;
- normally disable deletion from cleanup recommendation surfaces.

## 9.2 Risk explanation UX

Risk must be communicated in plain language.

Example:

> **Deletion risk**  
> This archive may contain files that are not stored anywhere else.  
> If deleted, you may lose the only packaged copy.  
> **Recommendation: Review before deleting.**

Another example:

> **Verified duplicate**  
> This file is byte-for-byte identical to another copy.  
> **Recommendation: Keep one copy and remove the extras.**

Warnings must explain consequences, not merely display a scary icon.

---

# 10. RECOMMENDATION ENGINE

Final recommendation should derive from at least:

`Junk Confidence + Deletion Risk + File Context`

Optional additional inputs may include:

- age;
- file size;
- location;
- extension/type;
- duplicate verification;
- download state;
- whether another safe copy exists;
- whether the user explicitly selected the item.

Recommendation must remain rule-based and explainable in V1.

An AI backend is not required.

Dr. Bear may present human-friendly summaries generated from deterministic results, for example:

> “Most of the reclaimable space is coming from verified duplicate videos and old installers.”

The sentence must be supported by actual scan results.

---

# 11. RECLAIMABLE SPACE TRUTH

Never exaggerate reclaimable storage.

Bearagnostic should distinguish concepts such as:

- **Ready to clean** — low-risk selected/eligible items;
- **Potential cleanup** — review candidates;
- **Large files found** — not inherently reclaimable;
- **Verified duplicate space** — space represented by extra verified copies.

Example:

If Large Files totals 8 GB but none are classified as junk, Bearagnostic must not claim “8 GB can be cleaned”.

Actual reclaimed space after deletion must be calculated from successful deletions, not intended deletions.

---

# 12. CLEANUP SAFETY FLOW

The default destructive flow is:

`Select → Review → Confirm → Delete → Verify → Summary`

## 12.1 Quick Clean

Quick Clean may preselect low-risk items, but the user still receives a final confirmation before destructive deletion.

## 12.2 Manual deletion

Manual selection is allowed, including higher-risk items, but appropriate warnings must be shown.

## 12.3 Deletion verification

After deletion:

- verify actual success;
- report partial failures truthfully;
- count reclaimed bytes only for files confirmed removed;
- never show a fake success state.

## 12.4 Undo / trash claims

Do not promise undo unless Bearagnostic is actually using an OS-backed trash mechanism for that exact item.

If deletion is permanent, say so clearly before confirmation.

---

# 13. ANDROID PLATFORM TRUTH

Bearagnostic must operate strictly within legitimate Android capabilities.

The app may scan and manage user-accessible/shared storage after appropriate user permission.

It must never claim universal access to:

- private internal data of other apps;
- protected system storage;
- every Android cache;
- every app’s private cache;
- root-only files;
- system registry-like data.

Protected locations must remain protected.

Policy-sensitive permissions, storage behavior, Play Store requirements, SDK requirements, and restricted APIs must be re-verified against current official Android / Google Play documentation when implementation or release decisions depend on them.

Do not freeze changing platform-policy details into product claims.

---

# 14. FUNCTIONS DELIBERATELY OUT OF SCOPE FOR V1

To preserve truth, quality, and Medium complexity, do not turn Bearagnostic into a collection of fake “optimizer” features.

Do not implement V1 features such as:

- RAM booster;
- memory cleaner;
- CPU cooler;
- fake battery booster;
- kill-all-background-apps;
- antivirus claims without a real security engine;
- root cleaner;
- private-app cache cleaner claims;
- registry cleaner terminology;
- cloud scanning backend;
- behavioral advertising;
- account system;
- social features;
- always-on background surveillance;
- heavy machine-learning infrastructure.

Possible future features must be evaluated against the same product-value / complexity test.

---

# 15. COMPLEXITY CEILING

## 15.1 Hard rule

The project must remain at **Medium implementation complexity or lower** unless P’Benz explicitly changes this constraint.

## 15.2 Preferred architecture

Favor the current hybrid architecture:

- Kotlin for Android-only capabilities;
- local packaged HTML/CSS/JavaScript for premium interface work where appropriate;
- narrow native ↔ Web bridge;
- small cohesive native classes;
- deterministic local rules;
- local storage only when needed;
- GitHub Actions for repeatable APK builds.

## 15.3 Avoid architecture inflation

Do not add complexity merely because a pattern is fashionable.

Avoid unless demonstrably necessary:

- unnecessary multi-module architecture;
- excessive abstraction layers;
- dependency-injection frameworks for a small codebase;
- complex reactive architecture without product need;
- backend services;
- microservices;
- NDK/C++;
- large external SDKs;
- persistent databases where simple aggregate storage is sufficient;
- redundant manager/service/repository classes that merely forward calls.

A small number of strong, clearly owned components is preferred.

## 15.4 Native responsibility boundaries

A clean V1 structure may reasonably center on responsibilities such as:

- `MainActivity`
- `NativeBridge`
- `StorageAccessController`
- `FileHealthScanner`
- `JunkClassifier`
- `CleanupEngine`

New classes should be added only when they carry a distinct responsibility that would otherwise make an existing file unsafe or unmaintainable.

---

# 16. PERFORMANCE REQUIREMENTS

The app must feel fast even when scanning large storage.

Requirements:

- no heavy filesystem work on the UI thread;
- avoid Android ANRs;
- iterative directory traversal where appropriate;
- streaming file hashing;
- never load a huge file fully into memory merely to hash it;
- hash duplicate candidates only after cheap filtering such as exact size;
- cooperative cancellation;
- throttled progress updates;
- bounded memory behavior;
- graceful handling of unreadable files;
- graceful handling of disappearing files during scan;
- no crash when media/storage changes while scanning.

Performance optimizations must remain understandable and maintainable.

---

# 17. PROGRESS TRUTH

Never fabricate whole-device scan percentages.

When total work is unknown:

- use indeterminate progress;
- show real counters;
- show real current stage.

When total work becomes measurable:

- use progress derived from real work, such as bytes hashed or items processed.

Completion must only be displayed after the corresponding native work has actually completed.

---

# 18. LOCAL-FIRST PRIVACY

The default architecture is local-first.

Principles:

- file analysis occurs on device;
- no selected file contents uploaded;
- no remote filename inventory;
- no behavioral analytics;
- no advertising SDK;
- no account required for core cleaner functionality;
- no hidden telemetry;
- persist the minimum necessary information.

The app should be able to say truthfully, in natural localized language, that files are analyzed locally and are not uploaded by the current app architecture.

Any future network feature requires explicit product approval and a privacy review.

---

# 19. VISUAL NORTH STAR

Bearagnostic must look and feel significantly more premium than typical Android cleaner apps.

The visual target is:

> **Premium Clean Clinical Editorial**

Desired qualities:

- expensive;
- calm;
- editorial;
- modern;
- warm;
- precise;
- breathable;
- clinical without looking sterile;
- friendly without becoming childish.

Preferred visual language:

- warm/off-white surfaces;
- deep navy / charcoal typography;
- restrained cyan-to-blue accents;
- selective mint, violet, or amber for semantic states;
- soft high-quality shadows;
- subtle borders;
- disciplined corner radii;
- generous negative space;
- refined system typography with a tasteful editorial serif accent where appropriate.

Avoid:

- cheap neon;
- gaming aesthetics;
- exaggerated glass everywhere;
- rainbow gradients;
- random card styles;
- sticker-like UI;
- excessive glow;
- crowded dashboards;
- “booster app” visual clichés;
- warning-red overload;
- childish mascot treatment.

---

# 20. DR. BEAR

Dr. Bear is a trust and guidance character, not decoration that competes with usability.

Possible states:

- Master / Neutral;
- Scanning;
- Concerned;
- Approved;
- Deadpan Warning.

Dr. Bear may:

- explain results;
- summarize the biggest cleanup opportunity;
- clarify risk;
- reassure when storage is healthy;
- guide first-run permission.

Dr. Bear must never:

- cover essential controls;
- create visual clutter;
- make unsupported claims;
- exaggerate danger;
- pressure the user into deleting files.

---

# 21. UX PRINCIPLES

Every primary action should be understandable without interpretation.

The user should not need to understand Android filesystem terminology to use the app safely.

## 21.1 Home

Home should remain visually disciplined.

Recommended hierarchy:

1. Bearagnostic identity / settings access.
2. Primary `Start Checkup`.
3. Compact quick access to the highest-value tools:
   - Duplicates
   - Large Files
   - Old Files
   - Downloads
4. File Health / Storage Overview.
5. Secondary navigation to the full tool set.

Quick Clean remains a core capability but does not need to compete with Start Checkup as a second giant Home CTA.

## 21.2 Tools

Tools can expose the complete utility set without crowding Home.

Recommended tool groups:

- Quick Clean
- Duplicates
- Large Files
- Old Files
- Downloads
- Temporary Files
- APK Installers
- Archives
- Screenshots / Media Review
- Empty Folders
- Zero-Byte Files
- File Browser

## 21.3 Touch and layout

- portrait-first;
- safe-area aware;
- no horizontal overflow;
- comfortable one-hand interaction;
- touch targets generally at least 44 dp equivalent;
- no critical action placed too close to system navigation;
- reduced-motion support;
- excellent readability on common Android phone widths;
- no essential information dependent only on color.

---

# 22. LANGUAGE AND LOCALIZATION STANDARD

Launch languages:

- English
- Japanese
- Thai

Every user-visible sentence must sound as if written by a highly fluent native product writer.

Translation quality is a release-level quality requirement.

## 22.1 General rules

All languages must be:

- extremely natural;
- concise;
- immediately understandable;
- culturally normal;
- free from machine-translation structure;
- free from technical ambiguity;
- easy to understand without rereading.

Do not translate word-for-word when native product language requires different phrasing.

Do not force English terminology into Thai or Japanese when a natural local expression is clearer.

Do not over-explain simple actions.

## 22.2 English

Use polished, idiomatic consumer software English.

Avoid corporate jargon and unnatural technical phrasing.

## 22.3 Japanese

Use concise natural Japanese UI language.

Avoid literal English syntax and unnecessarily formal or robotic wording.

## 22.4 Thai

Use fluent contemporary Thai that is immediately understandable.

Avoid awkward calques, excessive formality, and ambiguous technical wording.

## 22.5 Localization QA

A production batch touching visible text must review all affected EN / JA / TH strings together.

Missing or obviously machine-like localization is a release blocker for that surface.

---

# 23. ACCESSIBILITY AND CLARITY

Premium quality includes accessibility.

Requirements:

- strong readable contrast;
- semantic warning states;
- large enough type;
- clear button labels;
- visible focus/accessibility semantics where supported;
- meaningful screen-reader labels for key actions;
- reduced motion;
- no important distinction conveyed by color alone;
- confirmations that name the actual destructive action.

---

# 24. ERROR HANDLING

The app must fail gracefully.

Examples:

- permission not granted;
- file becomes unavailable during scan;
- folder cannot be read;
- hash read fails;
- deletion fails;
- removable storage disappears;
- scan is cancelled;
- activity resumes after permission screen;
- WebView bridge is temporarily unavailable.

Errors should be:

- clear;
- non-technical unless details are requested;
- recoverable when possible;
- honest.

Do not show success when only part of an operation succeeded.

---

# 25. NO-REGRESSION RULE

Regression prevention is mandatory.

A new feature is not successful if it breaks a known-good existing flow.

Before modifying production:

1. inspect current GitHub `main`;
2. identify the current app/build version;
3. inspect affected runtime files;
4. understand existing behavior;
5. define a changed-file allowlist;
6. classify regression risk;
7. preserve known-good behavior outside the scope;
8. test the affected flows;
9. review the diff for accidental unrelated changes.

Never refactor a stable system merely to make code “cleaner” unless the refactor provides a clear product, safety, or maintainability benefit.

When a feature can be added without disturbing a stable subsystem, prefer that approach.

---

# 26. BATCH RISK LEVELS

Use:

- `LOW`
- `MEDIUM`
- `HIGH`

Examples:

### LOW

- copy refinement;
- isolated CSS correction;
- documentation;
- non-runtime visual polish.

### MEDIUM

- scanner logic;
- classification;
- new read-only file analysis;
- native bridge expansion;
- new results UI.

### HIGH

- destructive cleanup;
- permission model changes;
- signing changes;
- large architecture replacement;
- release signing;
- data migration.

HIGH-risk batches must include an explicit rollback plan and stronger QA.

---

# 27. BUILD AND VERSION GOVERNANCE

Runtime changes must maintain coherent app versioning.

Requirements:

- increment `versionCode` for a new installable Android build;
- increment `versionName` consistently;
- visible build/version information must match actual packaged production;
- CI and source must not disagree about build identity.

Documentation-only updates do not require an Android runtime version bump unless they also change production runtime.

Build mismatch is a blocker.

---

# 28. DEVELOPMENT SIGNING

The debug package is development-only:

`com.benedictinteractive.bearagnostic.debug`

The repository currently uses a stable development signing identity so CI-built debug APKs can update previous debug APKs during development.

Rules:

- development signing may remain stable;
- development signing must never be treated as release signing;
- production / Play release signing must use a separate protected identity;
- never commit the future production signing key to the public repository;
- never reuse development credentials for release.

---

# 29. CI / APK WORKFLOW

The expected development loop is:

`GitHub source → GitHub Actions → Debug APK artifact → Install/Update → Physical test`

After stable debug signing:

`new build → install as update over existing debug app`

Routine development should not require uninstalling the app every batch.

If Android refuses an update, investigate:

- package identity;
- signing identity;
- version code;
- corrupted artifact;
- incompatible installed build.

Do not normalize uninstall/reinstall as the permanent development workflow.

---

# 30. QA STANDARD

Never claim a type of QA that was not actually performed.

## 30.1 Static / local validation

Examples:

- Kotlin syntax/type checks where practical;
- JavaScript syntax;
- HTML structure;
- XML parsing;
- duplicate ID checks;
- package path checks;
- no obvious destructive code in read-only batches.

## 30.2 CI validation

GitHub Actions must be green before calling a new Android source batch compile-verified.

## 30.3 Physical-device validation

Only claim physical-device PASS after actual device testing.

Relevant device checks include:

- APK installation/update;
- launch;
- permission handoff;
- resume after settings;
- storage traversal;
- cancellation;
- duplicate verification;
- large-file handling;
- cleanup confirmation;
- real deletion;
- partial deletion failure;
- UI on real Android;
- EN / JA / TH;
- OEM-specific behavior when relevant.

## 30.4 Truthful QA wording

Use precise labels such as:

- `Static QA: PASS`
- `CI compile: PASS`
- `Physical Android test: NOT YET TESTED`

Never collapse these into a vague “fully tested”.

---

# 31. PACKAGING CONTRACT

This contract applies every time files are delivered to P’Benz for manual GitHub upload.

## 31.1 Repository-relative ZIP

The ZIP root must represent the repository root.

Never add an unnecessary wrapper folder such as:

`bearagnostic-update-05/app/...`

Instead the ZIP must contain:

`app/...`
`docs/...`

directly as repository-relative paths.

## 31.2 Changed files only

Prefer packaging only:

- changed canonical files;
- genuinely new durable files.

Do not resend the entire repository unless there is a concrete reason.

## 31.3 Overwrite existing files

When an update modifies an existing file:

- package it under the exact existing path;
- instruct P’Benz to Replace / Overwrite;
- do not create a parallel version.

## 31.4 Master Plan updates

Every Master Plan package must contain:

`docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`

with the same name every time.

The new copy overwrites the old copy.

## 31.5 No transient repository clutter

Do not create permanent production files solely to communicate one-time upload instructions, checksums, or packaging notes unless they have durable project value.

One-time packaging information belongs in the delivery message, not as production repository clutter.

Existing transient files should not be duplicated further.

## 31.6 Hidden files

If a canonical hidden file such as `.github/...` or `.gitignore` must be changed, do not create a non-hidden duplicate as a workaround.

Use the canonical path and provide the correct upload/edit method.

## 31.7 Deletions

If an old production file genuinely becomes obsolete:

- explicitly identify it for removal;
- do not leave two active implementations;
- do not rename the old file to “backup”;
- preserve a clean canonical structure.

Where possible, design updates to reuse existing paths so manual deletion is rarely required.

---

# 32. DELIVERY CONTRACT

Every implementation batch delivered to P’Benz must include:

- a downloadable file in the same response;
- exact purpose / scope;
- changed/new file summary;
- overwrite instructions;
- QA status;
- regression risk;
- rollback note when appropriate;
- ZIP SHA-256 when a ZIP is supplied;
- a recommended commit name.

The commit name must be **50 characters or fewer**.

It must always be presented in a Markdown code block, for example:

```text
Add cleanup risk classification
```

Do not send a commit name longer than 50 characters.

If file creation fails, state the failure immediately rather than implying the package is complete.

---

# 33. IMPLEMENTATION WORKFLOW FOR EVERY BATCH

Mandatory sequence:

1. Inspect current GitHub production.
2. Read this Master Plan from the repository.
3. Confirm current baseline and build identity.
4. Define the exact product objective.
5. Define changed-file allowlist.
6. Assign LOW / MEDIUM / HIGH risk.
7. Design the smallest architecture that can deliver 10/10 execution.
8. Preserve known-good production outside scope.
9. Implement using canonical paths.
10. Run available static QA.
11. Review for regression.
12. Package repository-relative changed files.
13. Supply commit name ≤ 50 characters.
14. User uploads / commits.
15. Verify GitHub Actions.
16. Perform physical Android QA when relevant.
17. Only then call the corresponding milestone verified.

---

# 34. DECISION FILTER FOR NEW FEATURES

Before accepting a feature, ask:

1. Does it materially improve the junk-cleaning / file-health mission?
2. Can it be implemented truthfully on normal Android?
3. Can it remain Medium complexity or lower?
4. Can it be explained simply?
5. Can it be tested reliably?
6. Does it preserve privacy-first design?
7. Does it avoid regression?
8. Does it look and feel premium?
9. Does it avoid turning the product into a generic “booster” app?

If a feature fails several of these tests, do not add it merely to make the feature list longer.

---

# 35. PREMIUM EXECUTION TEST

Every production surface should pass these questions:

### Visual

- Does this look like an expensive commercial product?
- Is the hierarchy calm and obvious?
- Is anything visually cheap, noisy, or generic?
- Is negative space used deliberately?

### Usability

- Can a normal user understand the next action instantly?
- Can the action be completed with minimal thought?
- Are risk and consequence clear before deletion?

### Truth

- Is every number real?
- Is every recommendation explainable?
- Is every capability within Android’s actual access?

### Performance

- Is expensive work off the UI thread?
- Does the interface stay responsive?
- Is memory use reasonable?

### Safety

- Could a default action cause avoidable data loss?
- Are ambiguous files left unselected?
- Does deletion require appropriate confirmation?

### Language

- Does every sentence sound native in EN / JA / TH?
- Is anything awkward, literal, technical, or ambiguous?

A feature is not “10/10” merely because it looks attractive.

---

# 36. FUTURE-PROOFING WITHOUT OVERENGINEERING

The Master Plan should allow growth without prebuilding speculative systems.

Future additions may be considered when the product is stable, but only if they preserve the complexity ceiling.

Examples of reasonable future directions:

- richer aggregate cleanup history;
- smarter deterministic classification rules;
- better file-type grouping;
- improved storage insights;
- improved removable-storage support;
- refined OS-backed trash behavior where reliable;
- better recommendation explanations.

Do not build empty abstractions today for hypothetical future features.

Build the smallest durable structure that makes the current roadmap clean.

---

# 37. RELEASE READINESS PRINCIPLES

Before public release:

- all core claims must match actual Android behavior;
- permission use must be reviewed against current official policy;
- release signing must be protected and separate from debug;
- release build must be tested on physical devices;
- cleanup must be destructive only after appropriate user confirmation;
- partial failures must be handled;
- privacy copy must match real implementation;
- EN / JA / TH must receive native-level review;
- no fake optimizer features;
- no development-only credentials in release signing;
- no obvious dead files or duplicated implementations in repository;
- CI must be green.

---

# 38. DEFINITION OF SUCCESS

Bearagnostic succeeds when a user can:

1. install the app;
2. understand its purpose immediately;
3. grant storage access with clear explanation;
4. tap Start Checkup;
5. receive truthful results from accessible storage;
6. immediately see what is genuinely safe to clean;
7. understand which items require review and why;
8. clean selected files confidently;
9. know exactly how much space was truly reclaimed;
10. manually inspect files whenever desired;
11. trust that Bearagnostic does not upload their files or fabricate problems.

At the same time, the codebase should remain small enough that future batches can be implemented, reviewed, tested, and rolled back without unnecessary complexity.

That combination is the product:

> **All-in-one capability. Premium execution. Conservative engineering.**

---

# 39. NON-NEGOTIABLE RULES — QUICK REFERENCE

1. GitHub production first.
2. Latest explicit P’Benz instruction wins.
3. Read this Master Plan before implementation.
4. Master Plan filename never changes.
5. Overwrite canonical files instead of accumulating duplicates.
6. New files require distinct durable responsibility.
7. Medium complexity ceiling.
8. Maximum perceived quality within that ceiling.
9. No regressions to known-good systems.
10. No fake scanning, junk totals, health metrics, or optimization.
11. Junk confidence and deletion risk remain separate.
12. Review and confirm destructive actions.
13. Do not auto-select risky files.
14. Duplicate claims require real verification.
15. Large/old does not mean junk.
16. Privacy-first and local-first.
17. Native-quality EN / JA / TH.
18. No unnecessary repository clutter.
19. Repository-relative update ZIPs.
20. Commit name ≤ 50 characters in a code block.
21. Never claim QA that was not performed.
22. Current Android / Play policy must be re-verified when policy-sensitive.
23. Release signing is never the development signing key.
24. Simple architecture. Exceptional execution.

---

# 40. REVISION HISTORY

## Revision 1.0 — 8 September 2026

Initial Android Master Plan.

Locked:

- GitHub-first governance;
- canonical overwrite policy;
- permanent Master Plan filename;
- premium All-in-One junk cleaner positioning;
- One-Tap + Manual operation;
- complete V1 capability target;
- Junk Confidence system;
- Deletion Risk system;
- truthful reclaimable-space policy;
- cleanup safety model;
- Android capability boundaries;
- Medium complexity ceiling;
- premium clinical-editorial visual direction;
- Dr. Bear role;
- native EN / JA / TH standard;
- no-regression rules;
- version/build discipline;
- stable debug signing boundary;
- CI and physical QA distinctions;
- repository-relative drag-and-drop packaging;
- no transient file clutter;
- commit-name ≤ 50 character requirement.
