# BEARAGNOSTIC ANDROID MASTER PLAN

**Repository:** `grolygori789-crypto/bearagnostic-android`  
**Canonical file:** `docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`  
**Revision:** 9.0  
**Revision date:** 21 September 2026  
**Owner / Final Product Authority:** P'Benz  
**Studio / Publisher:** Benedict Interactive  
**Full Authorized DEV / Product-Design-Engineering Lead:** Biew (บิ๊ว)  
**Current inspected GitHub main:** `401fafd9ac5159b87eb6f4dad7599cfe6511ff68` — `Fix tool polish and support flows`  
**Current runtime/source checkpoint:** `401fafd9ac5159b87eb6f4dad7599cfe6511ff68` — current v83 source candidate
**Current Android version:** `0.35.35-alpha83`, `versionCode 83`, adapter/cache `v=83`
**Current Web main:** `30779427766ec220b0d5ffcb3081f58937f71a4f`  
**Project state:** Pre-launch / Final Polish corrective candidate v83 on GitHub / physical re-test and design acceptance PENDING
**Supersedes:** Revision 8.0 while preserving every still-valid product, scanner, safety, commerce, privacy, UI, localization, distribution, QA and operating contract.

> File-name rule: this canonical document keeps the stable filename `BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`.  
> Do not create dated, `final`, `v2`, `backup`, or duplicate canonical copies unless P'Benz explicitly requests an archive.

---

# 0. PURPOSE / NORTH STAR / CURRENT STATUS

This is the canonical operating contract, product plan, engineering plan, UX/UI plan, safety contract, commerce/entitlement plan, localization contract, release plan, distribution plan, marketing-launch plan and QA contract for Bearagnostic Android.

Permanent engineering North Star:

> **Simple architecture. Exceptional execution. Zero unnecessary complexity.**

Permanent product promise:

> **Find clutter. Explain the risk. Clean with confidence.**

Permanent Benedict operating principle:

> **Premium enough to feel world-class; simple enough for one person to run well.**

Bearagnostic must remain truthful, calm, bright, premium, privacy-first, local-first and safety-first. Never trade trust for fake progress, fake health scores, fake scan depth, fake speed, fake entitlement, fake reclaimed space or ornamental complexity.

## Current exact status

The project is still pre-launch. Release-Isolation, production signing, core scan, Restore, duplicate deletion safety, Insights and verified cleanup history remain Frozen PASS unless directly affected by later source changes.

The Android source has now advanced beyond the old v79/v80 documentation baseline:

```text
v80  8fc4c053d3fc194db48c57a89af916af0d8fc937  Finish Android final polish
v82  f3bd9ed584f4f78fb61482229769f00acee471d9  Fix Final Polish and preserve debug QA
v83  401fafd9ac5159b87eb6f4dad7599cfe6511ff68  Fix tool polish and support flows
```

Current repository truth is **v83**:

```text
versionName 0.35.35-alpha83
versionCode 83
adapter/cache v83
release package com.benedictinteractive.bearagnostic
debug package   com.benedictinteractive.bearagnostic.debug
pinned PWA      78a31c7752e171c0eafb63c0d0859f4072a193d6
```

Current evidence status must be interpreted carefully:

- Production v79 physical/core evidence remains valid Frozen PASS where later Final Polish code cannot affect it.
- v80 was physically inspected and exposed important Final Polish/design regressions, especially Help & Support presentation.
- v81 was a local corrective attempt that overcorrected Debug entitlement UI and was explicitly **withdrawn / invalid / never a canonical repository baseline**.
- v82 restored the Debug-vs-Release architecture and was uploaded to GitHub.
- v83 is the latest GitHub corrective candidate, adding further Tool/support-flow polish on top of v82.
- **P'Benz has not yet physically accepted v83.** Therefore v83 is NOT Physical-device PASS, NOT Visual/Design PASS, and NOT public-release approved.
- Prior automated/headless checks are supporting evidence only. They never substitute for physical-device behavior, screenshot review, or P'Benz design acceptance.

The next room must start with **targeted physical QA and design review of v83**, not by adding new features and not by re-running Frozen work from scratch.

Public launch remains **NOT APPROVED**. App final acceptance, final customer journey, support/legal closure, production-environment transition, exact public binary proof, Benedict website distribution, Uptodown distribution and final launch smoke remain unfinished.

---

# 1. AUTHORITY / COMMUNICATION / WORKING STYLE

P'Benz is final Product Authority, legal/brand/business owner and final approver.

Biew is the female Full Authorized DEV / Product-Design-Engineering partner and technical/product/design lead.

In Thai, this is mandatory:

- self-reference: `บิ๊ว`;
- address the user: `พี่เบนซ์`;
- use feminine endings `ค่ะ` / `คะ` correctly;
- never use `ผม`, `ครับ`, or masculine self-reference for Biew.

Communication must be warm, direct, technically precise and evidence-based. Do not make P'Benz reconstruct old context.

## Speed / handoff behavior

When P'Benz explicitly requests a file, build, ZIP, patch, document or downloadable artifact:

- create and send the actual file promptly;
- do not leave P'Benz waiting through long explanation cycles without a file;
- do not claim a file is ready unless a real clickable artifact exists;
- if work cannot yet be completed, state exactly what is missing rather than pretending completion;
- prefer short, iterative proof cycles over long silent waits.

When providing commands, test commands, shell snippets, Git commands, PowerShell, SQL, Cloudflare commands or code that P'Benz must run, place them in fenced code blocks so they can be copied directly.

---

# 2. CONFLICT ORDER / STARTUP PROCEDURE

Conflict order:

1. latest explicit instruction from P'Benz in the current room;
2. latest GitHub `main`;
3. this canonical Master Plan;
4. current Room Migration / Immigration Prompt;
5. approved assets + current physical-device evidence;
6. repository history;
7. older conversation context.

Before substantive implementation:

1. inspect latest Android and Web `main`;
2. read this Master Plan and the current Room Migration prompt completely;
3. inspect exact relevant source/workflows;
4. establish rollback SHA;
5. define changed-file allowlist;
6. identify regression risks;
7. preserve Frozen PASS work;
8. implement the minimum coherent change;
9. validate honestly;
10. package only canonical repo-relative files.

Current Android `main` contains runtime/source changes through v83. Treat `401fafd...` as the current source checkpoint until a newer GitHub `main` exists. Do not fall back to `0acacf...`, v79, v80 or a withdrawn local package merely because an older document mentions them.

---

# 3. GITHUB / FILE HANDOFF / COMMIT CONTRACT

Remote GitHub mutation is forbidden unless P'Benz explicitly authorizes remote write/push in the same turn.

`ทำเลย`, `ดำเนินการ`, `แก้เลย`, `ส่งไฟล์` mean local implementation/package by default, not remote push.

Every GitHub-bound handoff must include:

- real clickable artifact;
- exact changed-file allowlist;
- canonical repo-relative paths;
- rollback baseline;
- actual QA performed;
- unverified items;
- regression/fallback note;
- SHA-256 when practical;
- a recommended commit name **50 characters or fewer**.

The commit name must always be placed in a fenced code block for easy copy-paste.

Example format:

```text
Fix final Android launch polish
```

Never forget the commit name.

## Canonical documentation filenames

From this revision onward, keep these stable names:

```text
docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md
docs/BEARAGNOSTIC_ROOM_MIGRATION_MASTER_PROMPT.md
```

Do not append dates or times to these filenames. P'Benz must be able to drag/upload and overwrite the old canonical file without first deleting dated variants.

Packages must contain only required canonical files. No throwaway README, QA report, recovery note, scratch, `final`, `final2`, `v2`, `backup`, or duplicate clutter.

For `.github/...` or hidden-dot paths, P'Benz may need GitHub **Create new file** / manual edit rather than drag-and-drop.

Do not advise disabling Windows Defender. Minimize suspicious script patterns and keep packages small/canonical.

---

# 4. EVIDENCE / QA TRUTH

Evidence labels are distinct:

- Static / Source PASS
- Local Build PASS
- CI PASS
- Runtime Simulation PASS
- Browser Runtime PASS
- Physical-device PASS
- NOT TESTED / PENDING

Never upgrade one evidence class into another.

Anything P'Benz physically tested and accepted remains closed unless a later code change directly affects it or new regression evidence appears.

---

# 5. FROZEN BASELINE / NO RETEST

Commerce hardening **#1–#25 = Frozen PASS**.

- #24 = Purchase Session Token Boundary — PASS;
- #25 = Private Ops Access Gate — PASS;
- no authoritative #26 exists;
- never invent #26.

Do not re-run old Cloudflare/D1/Resend/Ko-fi/backend/domain/scanner/share-card tests merely because the room or docs changed.

Only retest behavior directly touched by new code or final smoke requirements.

---

# 6. VERIFIED TECHNICAL SNAPSHOT

Current runtime baseline:

- release app ID: `com.benedictinteractive.bearagnostic`;
- debug app ID: `com.benedictinteractive.bearagnostic.debug`;
- current source candidate: `0.35.35-alpha83`;
- last broadly physical-verified production baseline: v79;
- current versionCode: `83`;
- current adapter/cache: `v=83`;
- compile/target SDK: 36;
- min SDK: 26;
- AGP: 9.4.0;
- Gradle CI baseline: 9.6.0;
- Java build baseline: JDK 17;
- release minification currently off;
- pinned PWA/frontend commit: `78a31c7752e171c0eafb63c0d0859f4072a193d6`;
- Play Billing 9.1.0 remains optional/reference only, not the current sales channel.

Local Windows tooling established:

- Android Studio installed;
- Git for Windows installed;
- standalone Gradle 9.6.0 downloaded under Benedict Interactive tools;
- Temurin JDK 17 installed for compatible local builds;
- Android SDK build-tools 36 used for APK verification/signing utilities.

A local Windows build exposed an invalid ZIP timestamp problem in the legacy frontend cache. Do not repeat random ZIP rewrites blindly. If this resurfaces after source changes, inspect the exact `prepareLegacyFrontend` task and use a deterministic archive/build path.

---

# 7. PRODUCTION SIGNING / UPDATE IDENTITY — PASS

Permanent production signing key exists outside the repository.

Operational references:

```text
%USERPROFILE%\Documents\BenedictInteractive\Signing\bearagnostic-production.jks
Alias: bearagnostic-production
Key algorithm: RSA 4096
Signature algorithm: SHA256withRSA
```

Production signing certificate SHA-256:

```text
503FB4A77B38E7129E20002EC6A0B1D4225FD189BB16E0C71EBAD88ECA88AE90
```

Custody:

- primary key copy on PC outside GitHub;
- separate flash-drive backup completed;
- passwords/secrets must never be committed or copied into public docs/artifacts.

Signing continuity is mandatory. Losing this signing identity breaks seamless direct-distribution updates.

Useful verification commands must remain copyable:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\36.0.0\apksigner.bat" verify --verbose --print-certs "<PATH_TO_APK>"
```

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\36.0.0\zipalign.exe" -c -p 4 "<PATH_TO_APK>"
```

The production-signed APK must remain:

- correct application ID;
- correct version/versionCode;
- `debuggable=false`;
- signed by the permanent production certificate;
- free of customer-visible Dev/QA entitlement controls.

Direct update remains explicit:

`new version → release notes/changelog → user chooses download → Android installer confirms`

No silent install/update.

---

# 8. PRODUCT / SCANNER / DELETION INVARIANTS

Bearagnostic is a premium privacy-first file-health/cleaning assistant, never a RAM booster, CPU cooler, fake antivirus, registry cleaner, root cleaner, fear-based cleaner or unverifiable optimizer.

Never fabricate:

- scan percentage;
- junk totals;
- virus counts;
- health scores;
- reclaimed bytes;
- speed improvements;
- undo;
- purchase state;
- cleanup history;
- storage trends.

Scan model:

- Quick = metadata/deterministic rules, no content read, no duplicate hash;
- Smart = bounded real content sample + focused exact duplicate verification (`256 KiB`);
- Deep = full streaming readable-content work + exact duplicates where accessible;
- Custom = user-selected scopes; zero selected scopes never silently fall back.

Destructive path remains:

`Select → Review → Confirm → Delete → Verify → Summary`

Binding safety requirements:

- keep-one-copy for exact duplicates;
- stale-review guard;
- deletion batch cap;
- protected Android/data + Android/obb boundaries;
- truthful safety labels;
- verified reclaimed-byte accounting;
- native truth wins over optimistic UI.

---

# 9. FREE / PRO / COMMERCIAL MODEL

Free remains genuinely useful; essential safety stays free.

Pro:

- product code `bearagnostic_pro_lifetime`;
- one-time lifetime entitlement;
- price **249 THB** / `24900` minor units;
- no subscription;
- Ko-fi Shop only payment surface;
- no separate Pro APK;
- `EntitlementManager` remains canonical capability truth.

No direct Benedict Stripe/PromptPay checkout. No fake admin `Mark Paid`, `Force Payment Success`, or fake webhook path.

Customer distribution remains:

1. Benedict Interactive official website;
2. Uptodown;
3. other stores only after explicit later approval.

**No Google Play launch.** Play Billing remains an engineering/reference dependency only unless a future explicit strategy changes that.

Do not broaden launch distribution just to accumulate listings. For a one-person operation, reliability, identical binary distribution and maintainability are more valuable than store count.

---

# 10. COMMERCE / ENTITLEMENT TRUST CHAIN

Authoritative path:

`verified Ko-fi Shop Order → Benedict payment ledger → lifetime entitlement → verified installation/device credential → EntitlementManager → Pro`

Never trust screenshot, redirect, client flag, local `isPro`, transfer reference or admin guess as payment truth.

Identity uses purchase email + OTP.

Current app has separate Purchase and Restore actions plus paid-purchase recovery. A previously approved target still exists:

**Email + OTP first → server decides Buy vs Restore automatically**

Resolve this UX gap during final customer-journey polish unless P'Benz explicitly approves retaining the separate Purchase/Restore design.

---

# 11. REAL-MONEY / EMAIL-MISMATCH / RESTORE TRUTH

Controlled real-money Ko-fi proof already occurred at temporary **10 THB** pricing. It proved live webhook/payment/entitlement truth.

The product price was then restored to **249 THB**.

Do not claim the earlier real-money transaction was a 249 THB purchase.

The original payment initially stayed unclaimed because the app email differed from Ko-fi checkout email. Backend correctly refused cross-identity guessing.

Required recovery behavior remains:

`Already paid? / Restore paid purchase → exact Ko-fi checkout email → OTP → restore entitlement`

This customer flow must remain available unless replaced by the unified email-first server-decision flow.

---

# 12. PRODUCTION PHYSICAL QA — CURRENT VERIFIED MATRIX

## Release isolation

Release-Isolation physical-device proof:

- no `DEVELOPMENT ENTITLEMENT TEST`;
- no `Test as FREE`;
- no `Test as PRO`;
- no Dev Reset;
- no usable release debug entitlement grant path.

Status: **PASS**.

## Production install / launch

Test-signed Release-Isolation was removed, Production v79 installed successfully.

Status: **PASS**, with one visual startup blocker documented in Final Polish.

## Free core

Verified:

- app does not hang/crash during normal use;
- Home loads correctly;
- no dev controls in More/Settings;
- Free scan/core path completes;
- Pro-gated features route to production Pro UI.

Status: **PASS**.

A dedicated Free destructive-delete proof on the current production candidate remains **PENDING** because the required safe fixture is cumbersome. Close on the final candidate if practical, or record an explicit P'Benz risk waiver; do not pretend it was tested.

## Scan physical proof

Observed Smart scan example:

- 1,053 files reviewed;
- 184 folders visited;
- 185 MB / 185 MB data read;
- access/read issues: 0;
- categories populated correctly.

Status: **PASS**.

## Production Restore / Pro

Existing real entitlement restored successfully on Production v79 using Restore Pro and real ownership flow.

Status: **PASS**.

## Entitlement persistence

- close/remove from recents → reopen → Pro remains;
- Exact Duplicates remains available;
- full device reboot → Pro remains;
- Exact Duplicates remains available.

Status: **PASS**.

## Exact Duplicates + verified deletion

Controlled QA fixture:

- 4 byte-identical copies detected;
- 1 copy marked KEEP;
- 3 extras selected;
- confirmation showed 3 removals / 1 group / 3.01 MB;
- `Delete & verify` succeeded;
- cleanup summary reported 3 copies removed / 1 group resolved / 3.01 MB;
- Android filesystem manually checked;
- exactly 1 real copy remained.

Status:

- Exact Duplicate Detection = PASS;
- Selection / Final Review = PASS;
- Verified Deletion = PASS;
- Keep-One-Copy Safeguard = PASS.

## Insights / Local History

Verified:

- Latest Checkup;
- Device Storage;
- Comparable Checkups;
- storage trend;
- pattern;
- Recent Completed Checkups;
- persistence after reboot.

Status: **PASS**.

## Verified Cleanup History

The duplicate cleanup appeared as:

- 1 cleanup event;
- 3 items removed;
- 3.01 MB verified space;
- Files cleaned = verified.

Status: **PASS**.

Cleanup history is intentionally aggregate-only and not clickable into filenames. `LocalHistoryStore` intentionally does not persist filenames, paths, review IDs, hashes or file contents. This is privacy architecture, **not a defect**. Preserve it.

---

# 12A. FINAL POLISH CORRECTIVE HISTORY / TRUST RESET

This section is mandatory context for the next room because the first Final Polish implementation exposed process and design failures that must not be repeated.

## v80 physical-review findings

After v80 was built and viewed on-device, P'Benz rejected the quality of the Help & Support work. Confirmed concerns included:

- the `SUPPORT` kicker/header geometry could be clipped/obscured by the Back-button region;
- `Help / FAQ`, `Contact Benedict Interactive`, and `Purchase & Restore help` appeared as plain text rows while `Report a Problem`, `Send Feedback`, and `Copy Diagnostic Info` used colorful icons, creating an inconsistent and visibly unfinished design system;
- Help / FAQ content was too plain and visually weak for a premium release;
- Contact Benedict Interactive did not feel like a professional support workflow and was visually inconsistent with Report/Feedback;
- the overall result looked patched together rather than intentionally designed as one premium product surface.

P'Benz explicitly requires **professional product-design quality approaching 10/10**. Merely being functional is not enough.

## Debug entitlement clarification — critical

P'Benz keeps **two installable Android variants on the same device**:

```text
Debug / QA
applicationId = com.benedictinteractive.bearagnostic.debug
BuildConfig.DEBUG = true
Purpose = engineering QA, including entitlement switching

Release / Production behavior
applicationId = com.benedictinteractive.bearagnostic
BuildConfig.DEBUG = false
Purpose = customer behavior; no QA entitlement controls
```

Therefore:

- `DEVELOPMENT ENTITLEMENT TEST` / `Test as FREE` / `Test as PRO` / `Reset` are **expected and required in Debug/QA**;
- those controls are a **release blocker if visible in Release/Production**;
- never judge this from a screenshot alone without first establishing which installed package/build is being viewed;
- the repository already release-gates debug entitlement state with `BuildConfig.DEBUG`, and the Release-Isolation workflow verifies those gates.

The v81 local attempt incorrectly hard-hid Debug controls across builds. **v81 is withdrawn and must never be used or resurrected.**

## v82 / v83 corrective direction

v82 restored the dual-build contract and redesigned Final Polish behavior. v83 then added additional Tool/support-flow polish. Relative to v80, the v82→v83 corrective work is intentionally narrow and centered on:

```text
app/build.gradle.kts
app/src/main/legacy-adapter/android-final-polish.js
```

The MainActivity support-mail allowlist work from v80 remains on current main.

Current v83 Final Polish intent includes:

- preserve Debug entitlement controls only when native Debug contract exposes them;
- keep Release behavior free of Debug entitlement UI;
- professional Help & Support gateway;
- consistent iconography and hierarchy across comparable support actions;
- dedicated FAQ, Contact, and Purchase & Restore help surfaces;
- safe bulk selection via each Tool's existing handlers;
- Zero-byte truth fallback;
- scroll-cue collision hardening;
- Insights copy/layout hardening;
- EN/TH/JA responsive polish;
- production copy/legal truthfulness;
- no mutation of scanner, destructive-delete, entitlement truth, Restore, history or payment truth.

## Evidence boundary

Any prior claim such as `276 automated checks PASS` is **not** visual acceptance and **not** physical-device acceptance.

For Final Polish, the evidence ladder is:

```text
Source/Static PASS
→ automated/headless/runtime-simulation PASS
→ build/CI PASS
→ physical-device functional PASS
→ screenshot/visual-system review
→ P'Benz design acceptance
```

Do not skip or reorder the last two steps for visible customer UI.

## Professional visual-quality gate

For every new or modified customer-facing screen, review all of the following before calling it complete:

- coherent visual hierarchy;
- consistent icon family, icon box size, radius, gradient/material treatment and alignment;
- consistent row/card anatomy for comparable actions;
- typography appropriate to EN/TH/JA rather than English-only geometry;
- no clipped kicker/title/subtitle;
- no Back-button/title collision;
- safe-area and Bottom Nav separation;
- no horizontal overflow;
- comfortable spacing and touch targets;
- intentional empty space, not accidental dead space;
- premium states for loading, empty, error, disabled and success;
- no visibly bolted-on controls;
- no plain fallback screen where the surrounding product uses a richer premium system;
- accessibility and reduced-motion behavior where relevant;
- visual continuity with the rest of Bearagnostic.

A technically correct but visually weak screen is **not done**.

## Source-owner preference

Structural/layout defects should be fixed at the component that owns the structure whenever practical. Cross-cutting Final Polish adapters may be used for narrowly scoped compatibility/hardening, but should not become a dumping ground for fragile DOM patching.

Avoid:

- uncontrolled MutationObserver patch loops;
- one-off CSS that fixes one screenshot while breaking other widths/languages;
- hiding architecture mistakes instead of correcting source truth;
- visually inconsistent duplicate components.

---

# 13. FINAL POLISH — 9 CURRENT APP WORK ITEMS

These nine items remain the authoritative Final Polish acceptance list. v83 contains corrective implementation attempts for them, but **none of the v83-visible fixes are closed until physical retest and P'Benz visual acceptance**. Treat each item below as `IMPLEMENTED CANDIDATE / PHYSICAL VERIFICATION PENDING` unless a later room records explicit PASS evidence.

## 1. Startup Visual Continuity — LAUNCH BLOCKER

**v83 status:** source guard exists; repeated physical cold-launch proof still required.

Observed physical defect:

`Benedict Interactive / Dr.Bear startup → brief old Benedict logo on black screen → current app`

The legacy Benedict logo / black-frame flash must disappear completely.

Target:

`Benedict Interactive → Dr.Bear → Home`

Requirements:

- audit native splash/window theme;
- audit legacy WebView/startup assets;
- audit stale launch overlays;
- no single-frame legacy logo;
- no black flash;
- physical cold-launch proof across multiple launches.

## 2. `Did you know?` False Affordance

**v83 status:** corrective presentation code exists; physical visual/interaction confirmation pending.

During scan, `Did you know?` visually appears tappable due to card styling + chevron but does nothing.

Preferred solution:

- if no meaningful action exists, make it clearly informational;
- remove interactive visual language/chevron if appropriate;
- do not invent a useless destination merely to justify the visual.

## 3. Scroll Cue / Layer Overlap

**v83 status:** corrective collision logic exists; must be tested after real scrolling because shell code can rewrite cue position.

The global translucent scroll cue is **not itself a defect**.

Correct behavior:

- visible while more content remains;
- disappears at the end;
- may remain as a useful scroll affordance.

Defect:

- on some screens it visually overlaps important CTA buttons, e.g. `Check again` / `Done`.

Fix only the overlap/layout/safe-area problem. Do **not** remove the scroll cue globally unless new evidence justifies it.

## 4. Consistent `Select all / Clear all`

**v83 status:** candidate bulk controls exist; physically verify each Tool, selection caps, hidden/protected behavior, and Clear-all semantics.

Every list-based Tool that allows multi-selection must provide efficient bulk selection.

Required:

- `Select all`;
- `Clear all`;
- consistent wording/placement/behavior;
- retain 500-item verified batch cap;
- never select protected items;
- respect hidden-item settings;
- stale snapshot rules remain;
- selection disabled while relevant scan state is unsafe.

Audit at least:

- Exact Duplicates;
- Large Files;
- Older Files;
- Downloads;
- APK Installers;
- Archives;
- Zero-byte Files;
- other list-based review tools.

## 5. Dedicated Zero-byte / Review Empty Files Failure

**v83 status:** candidate fallback exists; reproduce the previous contradictory case and verify real recovery on-device.

Observed:

- generic Zero-byte review path showed 4 real zero-byte items;
- dedicated `Zero-byte Files / Review empty files` screen returned `could not continue`;
- `Try again` repeated the failure.

This is a real adapter/UI-path defect, not user confusion.

Required:

- dedicated path must consume the same current native snapshot truth;
- Loading / Empty / Found / Error states must be truthful;
- retry must actually retry a recoverable path;
- no contradictory zero-byte results across surfaces.

## 6. Insights `What Changed` Truncation

**v83 status:** responsive override exists; verify on compact widths and all shipping locales.

Observed cards show `No measur...`.

This is a visual/copy defect.

Required:

- meaningful full wording;
- no meaningless ellipsis for ordinary UI status;
- responsive layout for supported screen widths;
- if there is no comparable measurement, say so cleanly.

## 7. Remove Development / Google Play Customer Copy

**v83 status:** customer-facing copy patch exists; Release physical audit remains mandatory. Debug-only engineering text is allowed only inside the Debug/QA entitlement surface.

Production Pro screen still contains development-era copy such as:

`Google Play purchase setup is intentionally not active in this development build yet.`

This must not ship.

Requirements:

- no `development build` language;
- no misleading Google Play purchase wording;
- current independent distribution + Ko-fi commerce truth only;
- review Legal/Privacy copy for stale Google Play assumptions where customer-facing;
- Play Billing may remain an internal/reference dependency but must not be presented as the launch payment surface.

## 8. Help & Support Entry in More

**v83 status:** substantially redesigned candidate exists. This is a high-priority visual acceptance area because v80 was rejected on-device.

`Review`, `Feedback`, and `Support` are different customer needs.

Add one clean entry such as:

`Help & Support`

Suggested destinations:

- Help / FAQ;
- Contact Benedict Interactive;
- Purchase & Restore help;
- Send feedback;
- Report a problem.

Do not clutter More with full contact details. Use one professional support gateway.

Preferred branded target remains `support@benedictinteractive.com`, but switch public copy only after inbound routing and reply identity are physically/procedurally proven. Until then retain the existing fallback support route.

## 9. Japanese Native-Quality Localization + Typography Audit

**v83 status:** responsive/CJK hardening exists; whole-app Japanese physical review remains open.

Japanese is currently a shipping language and must be first-class.

Observed example:

- subtitle beneath `チェックを始める` truncates to `ファイルやフォルダを選んで解...`;
- some Japanese geometry appears inherited from English layout constraints;
- typography/line-breaking needs a full native-quality pass.

Required whole-app audit:

- every Japanese string complete;
- natural Japanese meaning;
- no accidental English fallback;
- no awkward machine-translation tone;
- correct Japanese/CJK font stack;
- suitable line-height;
- suitable tracking;
- Japanese-aware line breaking;
- flexible card/button heights;
- navigation labels;
- modal/sheet copy;
- loading/empty/error/success states;
- Free/Pro states;
- scanner/results/tools/insights/settings/legal/support surfaces.

Important UI copy must not be truncated with ellipsis merely because layout is too small. Ellipsis remains acceptable for genuinely unbounded data such as filenames/paths where full display is impractical.

Shipping locales remain:

```text
English
ไทย
日本語
```

ES/PT-BR remain hidden until the same first-class quality bar is met.

---

# 13A. MANDATORY v83 PHYSICAL QA MATRIX

The next room must distinguish the two installed variants before interpreting any screenshot or behavior.

## A. Debug / QA build

Expected:

```text
package: com.benedictinteractive.bearagnostic.debug
versionName includes -debug
DEVELOPMENT ENTITLEMENT TEST visible
Test as FREE works
Test as PRO works
Reset works
```

Verify:

- switching FREE/PRO changes only Debug/QA behavior;
- Debug app data does not corrupt or masquerade as the Release app;
- Help & Support works in both Free and Pro Debug states;
- no Final Polish code removes/hides Debug entitlement controls;
- Pro UI remains visually coherent even with Debug controls present.

## B. Release / production-behavior build

Expected:

```text
package: com.benedictinteractive.bearagnostic
debuggable=false
no DEVELOPMENT ENTITLEMENT TEST
no Test as FREE
no Test as PRO
no Reset
native debug entitlement calls rejected
```

Verify:

- no customer-visible development wording;
- Pro purchase/restore copy reflects Ko-fi/Benedict truth;
- customer Help/FAQ/Contact/Purchase & Restore surfaces are complete and professional;
- no debug-only controls or QA labels are exposed.

## C. Common v83 Final Polish regression sweep

Physically verify at minimum:

1. repeated cold launch: `Benedict Interactive → Dr.Bear → Home`, no black/legacy flash;
2. `Did you know?` looks informational and has no false chevron/button affordance;
3. scroll cue never covers CTA before or after actual scrolling;
4. Select all / Clear all on Large, Older, Downloads, Installers, Archives, Zero-byte, Empty folders and other relevant lists;
5. Duplicates bulk action selects **extras only**, preserving at least one copy;
6. Zero-byte previous contradiction: native candidates exist while dedicated path previously errored;
7. Insights full `No measurable change`-style text without meaningless ellipsis;
8. Help & Support header/kicker/back geometry;
9. consistent colorful icon treatment across all comparable Help actions;
10. FAQ presentation and interaction quality;
11. Contact Benedict composer/open-email/copy-details behavior and privacy copy;
12. Purchase & Restore help behavior — opening help must never silently purchase or mutate entitlement;
13. Report Problem / Send Feedback / Diagnostics still work;
14. EN / TH / JA layout at compact phone widths;
15. Bottom Nav, safe area, keyboard and modal/sheet layering;
16. no horizontal overflow or clipped ordinary UI text;
17. Release-only production-copy audit;
18. Debug-vs-Release entitlement-isolation proof.

For screenshot review, always record which package/build is shown. Do not infer Release failure from Debug-only UI.

---

# 14. FINAL POLISH — 4 CROSS-CUTTING AUDITS

The nine work items above are known issues. Final Polish must also run four focused audits to prevent equivalent defects elsewhere.

## A. Interaction Affordance Audit

Rule:

- if it looks tappable, it must respond;
- if it is not tappable, it must not use strong button/chevron/link language;
- disabled controls must look intentionally disabled;
- no dead cards/icons/rows that resemble active controls.

## B. Layer / Safe-area / Small-screen Audit

Audit:

- bottom navigation;
- sticky action bars;
- scroll cues;
- modal sheets;
- confirmation sheets;
- keyboard/IME;
- device navigation bar;
- compact Android screens;
- landscape where applicable.

No critical CTA may be visually covered or made ambiguous.

## C. State Matrix Audit

For each major surface, verify relevant states:

`loading / empty / populated / error / permission denied / stale / disabled / success / Free / Pro`

No state should reuse misleading copy from another state.

## D. Production Copy / Truthfulness Audit

Across EN/TH/JA, search and remove:

- development wording;
- stale Google Play purchase language;
- unfinished feature claims;
- contradictory pricing;
- fake automation claims;
- truncated ordinary UI copy;
- incorrect support/legal instructions;
- mixed-language exposed UI.

---

# 15. SCOPE FREEZE

From this point until public launch:

- do not add major new features;
- do not redesign working screens without a defect or clear launch requirement;
- do not reopen frozen architecture for aesthetics;
- do not expand supported stores/locales just before launch;
- only fix known issues, issues found by the four audits, or true launch blockers.

The product already has enough functional breadth for launch. Professional quality now comes from consistency, safety, truth, polish and customer confidence.

---

# 16. PRO UI / CUSTOMER-JOURNEY POLISH

The Pro experience must clearly communicate:

- one-time Lifetime Pro;
- 249 THB;
- no subscription;
- purchase identity email;
- OTP purpose;
- Restore identity;
- Ko-fi checkout email recovery;
- paid-but-not-unlocked path;
- waiting/payment-confirmation state;
- OTP not received;
- incorrect/expired/rate-limited OTP;
- no active entitlement;
- success;
- reinstall/device-change Restore;
- Help & Support;
- no Dev/QA wording.

Mandatory customer truth:

- uninstall/reinstall does not destroy lifetime Pro;
- device change does not destroy server entitlement;
- Restore uses the same Ko-fi checkout/purchase email;
- OTP verifies ownership;
- customer should retain access to that email.

---

# 17. WEB / KO-FI / SUPPORT / LEGAL — CROSS-REPO REQUIREMENT

Android is not launch-ready in isolation.

Final cross-surface polish must align:

- Benedict website;
- Bearagnostic app;
- Ko-fi Shop item;
- FAQ/help;
- support;
- Privacy/Terms/License;
- refund/revoke/dispute copy.

Benedict website must provide:

- official production-signed APK;
- exact version;
- changelog/release notes;
- install/update guidance;
- checksum/authenticity presentation;
- Pro purchase explanation;
- Restore explanation;
- paid-but-not-unlocked recovery;
- purchase-email identity guidance;
- OTP troubleshooting;
- Help & Support;
- legal/refund links.

Ko-fi must provide:

- professional product presentation;
- exact 249 THB;
- Lifetime / no subscription;
- activation instructions;
- use/retain checkout email;
- support route;
- concise refund terms;
- post-purchase guidance;
- publication state rechecked immediately before launch.

FAQ must answer at least:

- what Pro is;
- price;
- lifetime vs subscription;
- buying;
- which email;
- Restore;
- email mismatch;
- paid-but-not-unlocked;
- OTP failure;
- uninstall/reinstall;
- device change;
- refund/reversal/dispute;
- support;
- official download/update/authenticity.

The larger Ticket/Case after-sales platform remains deferred until after core launch unless a real support-volume need appears.

---

# 18. REFUND / LEGAL / PRIVACY DIRECTION

Required policy direction:

- lifetime digital entitlement;
- generally non-refundable after successful activation;
- exceptions include duplicate charge, entitlement not delivered/unresolvable, or applicable law;
- refund/reversal/dispute may revoke the corresponding entitlement;
- never write `No refunds under any circumstances`;
- preserve mandatory consumer rights.

Legal/privacy copy must match actual:

- Ko-fi payment role;
- Benedict entitlement authority;
- purchase/restore email;
- OTP;
- support;
- refund/revoke/dispute consequences;
- local-first file processing;
- aggregate-only history.

Founder-privacy real-checkout inspection remains a launch gate.

---

# 19. LOCAL-FIRST PRIVACY / HISTORY CONTRACT

Bearagnostic does not upload selected file content for ordinary file-health analysis.

Insights history is aggregate-only.

Never add filename/path/hash history to make cleanup rows clickable after the fact.

The current non-clickable `What Bearagnostic actually removed` aggregate view is intentional:

- cleanup count;
- items removed;
- verified reclaimed space;
- time/event summary.

This supports privacy and reduces unnecessary sensitive retention.

---

# 20. PRODUCTION ENVIRONMENT — CURRENT TEST STATE

Until final transition, controlled commerce state remains:

```text
BENEDICT_COMMERCE_PUBLIC_ENABLED = false
BENEDICT_COMMERCE_TEST_MODE = true
BENEDICT_EMAIL_TEST_DELIVERY = true
BENEDICT_EMAIL_TEST_RECIPIENT = [SECRET / ALLOWLIST]
BENEDICT_OTP_TEST_CODE = absent
```

Only the allowlisted test recipient receives live test-mode email.

Do not expose stored secret values in chat, docs, screenshots or handoff packages.

Challenge throttling remains approximately 5 challenges / 15-minute rolling window when identity or installation matches. Avoid repeated OTP spam during QA.

Environment changes are not trusted until deployment succeeds.

---

# 21. FINAL RELEASE PATH — UPDATED

Current immediate continuation is no longer “implement the first Final Polish batch.” v83 implementation is already on GitHub. The immediate task is **prove or reject v83 on real devices**.

Proceed in this order:

1. fetch latest Android `main`; confirm whether it is still `401fafd...` or newer;
2. confirm current version/build truth before testing;
3. build/obtain **Debug/QA** from the exact current commit;
4. build/obtain **Release/production-behavior** from the same exact commit;
5. run the mandatory v83 physical QA matrix in Section 13A;
6. capture screenshots of every changed customer-facing Help/Support surface in EN/TH/JA and review design quality, not just function;
7. if any defect is found, make the smallest source-owned fix, bump version/cache, and repeat only affected regression plus critical smoke;
8. only after v83-or-later physical/design acceptance, run the 4 cross-cutting audits and close remaining Final Polish items;
9. close Free destructive-delete proof on the accepted final candidate if practical, or record explicit P'Benz risk exception;
10. finish App/Web/Ko-fi customer journey, FAQ depth, branded support routing, legal/refund/revoke/dispute closure;
11. verify official Benedict signed-APK path, exact version, changelog, checksum, install/update guidance;
12. clean synthetic QA data only after evidence is no longer needed;
13. transition production environment: remove/disable test-only email/OTP overrides and set TEST MODE false;
14. keep public commerce fail-closed until final controlled gate;
15. run final controlled production commerce smoke;
16. exact-price 249 THB clean-identity purchase remains strongest proof if P'Benz explicitly approves the real charge; otherwise record a deliberate exception;
17. run final Restore proof only if relevant code/customer journey changed;
18. create/select the **production-signed Release APK that will actually be public**;
19. physically QA that exact production-signed APK;
20. after PASS, **do not rebuild it**; publish the exact same tested binary to Benedict website and submit the same exact binary to Uptodown;
21. verify published/downloaded binary identity and checksum;
22. final launch-readiness smoke;
23. public launch + monitoring.

Do not claim 100% public readiness before these gates are complete or explicitly waived.

---

# 22. ONE FINAL CANDIDATE / ONE EXACT BINARY

After Final Polish passes QA:

- select one final production candidate;
- sign once with the permanent production key;
- calculate/store checksum;
- physically test that exact artifact;
- do not rebuild after final QA unless a new code change is required;
- Benedict website must distribute that exact artifact;
- Uptodown must receive that exact artifact;
- verify published/downloaded binary identity.

This preserves evidence integrity and update continuity.

---

# 23. MARKETING / DISTRIBUTION STRATEGY

Launch strategy should optimize for trust and maintainability, not maximum channel count.

Primary launch channels:

1. **Benedict Interactive official website** — canonical source of truth;
2. **Uptodown** — independent distribution/discovery mirror.

The official Benedict product page owns:

- positioning;
- screenshots;
- value proposition;
- safety/privacy explanation;
- Pro conversion explanation;
- download;
- version truth;
- release notes;
- support;
- authenticity/checksum;
- legal truth.

Uptodown extends discovery and download reach but must never become the only canonical source.

Do not add multiple secondary stores before launch unless there is clear incremental value and manageable operational cost for a one-person team.

Marketing principles:

- no fake reviews;
- no fake install counts;
- no fake security claims;
- no fear-based cleaner copy;
- emphasize local-first, explainable, verified cleanup and lifetime ownership;
- Dr.Bear is a memorable brand asset but must support, not trivialize, trust;
- show real UI and truthful before/after behavior;
- user education should reduce fear of deletion and increase confidence;
- launch messaging across App/Web/Ko-fi/Uptodown must use the same product truth.

Post-launch, evaluate additional channels only if they offer measurable reach, credibility or conversion without creating disproportionate support/update burden.

---

# 24. ACCESSIBILITY / RESPONSIVE / LOCALIZATION QUALITY

Maintain:

- readable contrast;
- semantic controls;
- touch targets;
- keyboard/focus where applicable;
- reduced-motion support where appropriate;
- no horizontal overflow;
- safe-area correctness;
- responsive type;
- correct language metadata;
- no mixed exposed locales.

Japanese must be reviewed by linguistic meaning and visual layout, not merely string presence.

Text ellipsis is acceptable for unbounded filenames/paths, not for ordinary important UI copy that can be designed responsively.

---

# 25. KNOWN FAILURE MODES — DO NOT REPEAT

Do not repeat:

- PWA recreation;
- launcher drift;
- fake scan pacing;
- destructive-category assumptions;
- delete-to-zero duplicate groups;
- hidden previews while off;
- stale delete snapshot;
- unverified reclaimed bytes;
- fake trends;
- mixed locale;
- detached bridge calls;
- MutationObserver loops;
- polling replacing focused controls;
- background refresh resetting active user context;
- success UI without native truth;
- assuming CI proves runtime;
- global share interception;
- consuming clicks before native acceptance;
- low-alpha mascot;
- unnecessary redesign;
- customer Release exposing Dev entitlement;
- TEST MODE UI being mistaken for production delivery;
- stale Google Play copy in independent-distribution production;
- dead interactive-looking UI;
- CTA overlap caused by global fixed layers;
- whole-page English geometry forced onto Japanese;
- documenting a test as PASS when it was only inferred;
- treating automated/headless QA as visual acceptance;
- changing Debug entitlement architecture while trying to clean Release UI;
- confusing the Debug and Release apps installed side-by-side;
- hard-hiding `Test as FREE/PRO` in Debug;
- adding text-only support rows beside icon-led rows and calling the design complete;
- clipping section kickers beneath Back-button geometry;
- shipping a low-effort FAQ/contact surface inside an otherwise premium product;
- rebuilding the public APK after final physical QA and thereby invalidating exact-binary evidence.

---

# 26. OPERATIONAL BUILD / DELIVERY BACKLOG

GitHub Actions artifacts around 22 MB have downloaded unusually slowly on both PC and mobile despite fast internet.

Customer distribution must not rely on Actions artifacts.

After release blockers, improve internal QA artifact delivery only if it meaningfully saves time without exposing signing secrets or confusing QA/customer files.

A Cloudflare build once stalled around `npm install`; one retry succeeded. Repeated same-stage stalls should trigger investigation, not endless retries.

---

# 27. MASTER PLAN MAINTENANCE / NEXT ROOM

Always update this stable canonical path in place:

```text
docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md
```

Never make dated canonical replacements unless explicitly requested.

At next-room startup:

1. read current Room Migration prompt completely;
2. fetch latest Android + Web `main` before trusting SHA/version in this document;
3. read this canonical Master Plan completely;
4. preserve Frozen #1–#25 and prior physical evidence unless touched by later code;
5. identify both installed app variants before screenshot/behavior interpretation;
6. confirm current version/build/package and rollback SHA;
7. establish changed-file allowlist before any patch;
8. **begin with v83 physical/design QA, not new implementation, unless GitHub main has advanced**;
9. never use withdrawn v81;
10. never remove Debug FREE/PRO/Reset controls from the Debug build;
11. never allow those controls in Release;
12. treat customer-facing visual quality as an acceptance gate requiring P'Benz review;
13. never make P'Benz restate completed commerce, signing, production QA or the v80→v83 corrective history.

---

# APPENDIX A — RETAINED CORE CONTRACTS

Still binding unless explicitly superseded:

- approved frontend adapter order remains significant;
- Debug sandbox / Play Billing are engineering references only;
- working native Bitmap/PNG Result Share Card architecture remains accepted;
- Dr.Bear assets and approved visual identity remain protected;
- feature completeness for destructive workflows remains `Entry → Real data → Loading/Empty/Found/Error → Explanation → Preview/Context → Selection → Safety → Confirm → Native action → Verify → Truthful summary → Updated state`;
- a 10/10 feature must be truthful, readable, premium, useful in empty/error states, safe, local-first, localization-resilient, maintainable and evidence-backed;
- protect code/brand/assets/copy while respecting third-party licenses;
- do not falsely claim corporate or trademark status;
- Benedict remains canonical source for stable version, official download, release notes, support and licensing truth.

---

# APPENDIX B — CURRENT OPEN/PASS SUMMARY

**PASS / Frozen unless directly affected**

- Commerce hardening #1–#25
- Release-Isolation physical proof
- Production signing setup + backup
- Production certificate verification
- Production v79 physical install/core baseline
- Free core scan
- Existing-entitlement Restore to Pro
- Pro persistence after reopen/reboot
- Exact Duplicate detection
- Keep-one-copy
- Verified duplicate deletion
- Insights / Local History
- Verified Cleanup History
- Aggregate-only cleanup-history privacy

**Current repository candidate**

```text
Android main: 401fafd9ac5159b87eb6f4dad7599cfe6511ff68
Version: 0.35.35-alpha83 / versionCode 83 / cache v83
Status: Source candidate on GitHub
Physical acceptance: PENDING
Design acceptance: PENDING
Public release approval: NO
```

**Historical corrective notes**

- v80 = first Final Polish implementation; physical Help/Support quality rejected
- v81 = withdrawn local overcorrection; never canonical
- v82 = restored Debug/Release architecture
- v83 = latest Tool/support-flow corrective candidate

**OPEN / urgent next**

- v83 Debug physical QA with FREE/PRO/Reset preserved
- v83 Release physical QA with zero Debug entitlement controls
- Help & Support professional visual acceptance
- header/kicker/back geometry
- FAQ visual/interaction quality
- Contact Benedict workflow quality
- Purchase & Restore help flow
- startup continuity proof
- Did-you-know affordance proof
- scroll cue real-scroll collision proof
- Tool Select all / Clear all physical proof
- Zero-byte recovery proof
- Insights truncation proof
- EN/TH/JA compact-screen audit
- 4 cross-cutting audits
- Free destructive-delete final-candidate proof or explicit waiver
- App/Web/Ko-fi final customer journey
- branded support routing proof
- legal/refund/revoke/dispute closure
- website signed-APK path
- synthetic QA cleanup
- production environment transition
- final commerce smoke
- exact-price 249 THB proof decision
- production-signed exact-binary physical QA
- Benedict website exact-binary distribution
- Uptodown exact-binary distribution proof
- final launch smoke
- public launch monitoring

**End of Revision 9.0**
