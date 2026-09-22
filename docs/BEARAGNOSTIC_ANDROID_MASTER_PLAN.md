# BEARAGNOSTIC ANDROID MASTER PLAN

**Repository:** `grolygori789-crypto/bearagnostic-android`  
**Canonical file:** `docs/BEARAGNOSTIC_ANDROID_MASTER_PLAN.md`  
**Revision:** 10.0  
**Revision date:** 22 September 2026  
**Owner / Final Product Authority:** P'Benz  
**Studio / Publisher:** Benedict Interactive  
**Full Authorized DEV / Product-Design-Engineering Lead:** Biew (บิ๊ว)  
**Current inspected GitHub main:** `1ab659e0937b41840d2a2a789f19183797208da7` — `Build B93 customer release`  
**Current runtime/source checkpoint:** `d31fe574aefaf17acf57d12830a61cfe73abc689` — B93 app source; customer-release workflow closure at `1ab659e0937b41840d2a2a789f19183797208da7`
**Current Android version:** `0.35.45-alpha93`, `versionCode 93`, adapter/cache `v=93`
**Current Web main:** `30779427766ec220b0d5ffcb3081f58937f71a4f`  
**Project state:** Pre-launch / Android product-development and production-signing closure COMPLETE / Golden APK frozen / next phase = Final Website Polish → exact-binary distribution → launch closure
**Supersedes:** Revision 9.0 while preserving every still-valid product, scanner, safety, commerce, privacy, UI, localization, distribution, QA and operating contract.

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

The project remains **pre-launch**, but the Android product-development/release-candidate phase is now **closed**. B93 has passed the customer-release pipeline, targeted physical regression testing, permanent production signing and production-signed physical install/Restore validation. Android source is frozen unless a new evidence-backed release blocker is discovered.

The corrective chain from the old v83 documentation checkpoint to final Android closure is:

```text
v84  e1e4ece37b3bda0590afc85fa44f9d05fecf45fe  Fix v84 responsive tool polish
v85  6a6bafe398ef662e4b782962c5e53cd7c2168309  Polish v85 premium UI and localization
v86  2d78605f709844e39ea940caa54dc16020e600d4  Fix v86 physical UI regressions
v87  c9289cdb7394550dc747216ea814c475734685d5  Fix v87 final physical regressions
v88  d001b902b0c8d39355119e372a3cda1ca8aa946c  Fix v88 final tool regressions
v89  f6c79af8e2578b4d91c177dba694f8258b3feaef  Polish B89 release trust surfaces
v90  efa654aede23778b99a4e4a3bd298c3b387a6cca  Finish B90 release UI integration
v91  ce4c7f76d90fe89652a345cf5f2869cc70c283b0  Fix B91 Pro and installer consistency
B92  40b98f2b5b4df6fdb2860912b642ac19cb284797  app source: settings viewport-bound fix
B92  9aba76300a75cd88ef5debc54a17bb247edd0db3  customer-release workflow update
B93  d31fe574aefaf17acf57d12830a61cfe73abc689  app source: duplicate keeper policy fix
B93  1ab659e0937b41840d2a2a789f19183797208da7  final customer-release workflow
```

Current Android repository truth:

```text
versionName       0.35.45-alpha93
versionCode       93
adapter/cache     v93
release package   com.benedictinteractive.bearagnostic
debug package     com.benedictinteractive.bearagnostic.debug
B93 app tree      a7cf4ef1454d23d2e71787cb8fb0cdeff2b29e84
pinned PWA        78a31c7752e171c0eafb63c0d0859f4072a193d6
```

Final customer-release evidence:

```text
Workflow                  Build Android Customer Release Candidate
Run                       #4
Run ID                    35712459216
Source commit             1ab659e0937b41840d2a2a789f19183797208da7
Result                    CI PASS
QA artifact               CUSTOMER-RELEASE-B93-QA-4
Unsigned aligned SHA-256  5f53829f753d7e8a8f819ecc58a699948f1e32aef626232310368a74e6d21eaa
```

Final production artifact:

```text
Golden APK                Bearagnostic-0.35.45-alpha93.apk
Application ID            com.benedictinteractive.bearagnostic
Debuggable                false
Production APK SHA-256    09c12a8eb81d1a9353bc588b49639648457a1d502318ba58bc10bd8da7cfb66f
Production certificate    503FB4A77B38E7129E20002EC6A0B1D4225FD189BB16E0C71EBAD88ECA88AE90
```

Current evidence status:

- B93 Customer Release CI = **PASS**.
- B93 customer-visible Release Isolation = **Physical-device PASS**; no Dev entitlement tools are exposed.
- B92 settings/detail viewport-bottom overlap defect = **Physical-device PASS / CLOSED**.
- B93 trash/recycle duplicate-keeper defect = **Physical-device PASS / CLOSED**; trash copies are no longer preferred keepers when a verified normal copy exists.
- Permanent production signing = **PASS** with the established Benedict production certificate.
- Exact production-signed B93 APK installed successfully on device = **PASS**.
- Restore Pro on that production-signed B93 APK = **PASS**.
- Earlier entitlement persistence after reopen/reboot remains Frozen PASS evidence; it was not separately re-proven as a new B93 reboot experiment in this closure.
- Android source is now **FROZEN**. Do not rebuild, resign or modify the public binary after final physical acceptance unless a new release-blocking defect requires a new version.

Public launch is still **NOT YET APPROVED**, because Android closure is only one launch gate. Immediate next phase is **Final Website Polish**, followed by placing the exact Golden APK on the Benedict website, verifying downloaded bytes/checksum, submitting the same binary to Uptodown, closing remaining cross-surface support/legal/commerce launch items, and running final public-launch smoke.

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

Current Android `main` is B93 closure at `1ab659e0937b41840d2a2a789f19183797208da7`, with accepted app source at `d31fe574aefaf17acf57d12830a61cfe73abc689`. Treat B93 as the frozen Android checkpoint during website work. Do not fall back to v79/v80/v83, withdrawn v81, or any earlier local package merely because older historical sections mention them.

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

Current Android runtime/release baseline:

- release app ID: `com.benedictinteractive.bearagnostic`;
- debug app ID: `com.benedictinteractive.bearagnostic.debug`;
- final accepted Android version: `0.35.45-alpha93`;
- versionCode: `93`;
- adapter/cache: `v=93`;
- B93 app-source commit: `d31fe574aefaf17acf57d12830a61cfe73abc689`;
- final customer-release workflow commit: `1ab659e0937b41840d2a2a789f19183797208da7`;
- B93 app tree: `a7cf4ef1454d23d2e71787cb8fb0cdeff2b29e84`;
- compile/target SDK: 36;
- min SDK: 26;
- AGP: 9.4.0;
- Gradle CI baseline: 9.6.0;
- Java build baseline: JDK 17;
- release minification currently off;
- pinned PWA/frontend commit: `78a31c7752e171c0eafb63c0d0859f4072a193d6`;
- Play Billing 9.1.0 remains optional/reference only, not the current sales channel.

Final Golden APK identity:

```text
Bearagnostic-0.35.45-alpha93.apk
SHA-256:
09c12a8eb81d1a9353bc588b49639648457a1d502318ba58bc10bd8da7cfb66f

Production certificate SHA-256:
503FB4A77B38E7129E20002EC6A0B1D4225FD189BB16E0C71EBAD88ECA88AE90
```

Customer-release provenance:

```text
Workflow run      #4
Run ID            35712459216
QA artifact       CUSTOMER-RELEASE-B93-QA-4
Unsigned input    SIGN_LATER_Bearagnostic-B93-CUSTOMER-RELEASE-unsigned-aligned.apk
Unsigned SHA-256  5f53829f753d7e8a8f819ecc58a699948f1e32aef626232310368a74e6d21eaa
```

Local Windows tooling established:

- Android Studio installed;
- Git for Windows installed;
- standalone Gradle 9.6.0 downloaded under Benedict Interactive tools;
- Temurin JDK 17 installed for compatible local builds;
- Android SDK Command-line Tools installed;
- Android SDK build-tools 36.0.0 installed and used for `apkanalyzer`, `apksigner`, and `zipalign`;
- permanent signing key is stored outside GitHub.

A local Windows build historically exposed an invalid ZIP timestamp problem in the legacy frontend cache. Do not repeat random ZIP rewrites blindly. If this resurfaces in a future version, inspect the exact `prepareLegacyFrontend` task and use a deterministic archive/build path.

Android B93 is now a frozen accepted release line. Future Android work starts only from a new proven defect or an explicitly approved new-version objective.

# 7. PRODUCTION SIGNING / UPDATE IDENTITY — FINAL PASS

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
- passwords/secrets must never be committed, pasted into public docs, or shared in chat;
- continuity of this signing identity is mandatory for seamless direct-distribution updates.

B93 production signing was completed locally using the canonical signing script and the exact unsigned-aligned Customer Release input.

Final production output:

```text
Golden APK:
Bearagnostic-0.35.45-alpha93.apk

APK SHA-256:
09c12a8eb81d1a9353bc588b49639648457a1d502318ba58bc10bd8da7cfb66f

Certificate SHA-256:
503FB4A77B38E7129E20002EC6A0B1D4225FD189BB16E0C71EBAD88ECA88AE90
```

Verified production properties:

- application ID = `com.benedictinteractive.bearagnostic`;
- version = `0.35.45-alpha93`;
- versionCode = `93`;
- `debuggable=false`;
- signed by the permanent Benedict production certificate;
- production signing script reported `PRODUCTION SIGNING PASS`;
- exact production-signed APK installed successfully on a physical device;
- Restore Pro succeeded on that exact production-signed APK.

Useful future verification commands remain:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\36.0.0\apksigner.bat" verify --verbose --print-certs "<PATH_TO_APK>"
```

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\36.0.0\zipalign.exe" -c -p 4 "<PATH_TO_APK>"
```

Direct update remains explicit:

`new version → release notes/changelog → user chooses download → Android installer confirms`

No silent install/update.

## Golden-binary freeze rule

The accepted B93 production APK is now the Golden APK.

Do **not**:

- rebuild it;
- resign it;
- modify the APK;
- generate a separate Benedict-site APK;
- generate a separate Uptodown APK;
- replace it merely for cosmetic version naming.

Distribution must use the exact same Golden APK bytes. Website/Uptodown download verification must compare against the Golden APK SHA-256 above.

A future Android code change requires a new version/build, a new release candidate, new production signing, and new physical QA. It must never silently replace this B93 evidence line.

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

# 12. PRODUCTION PHYSICAL QA — FINAL ANDROID VERIFIED MATRIX

## Release isolation — B93 final

B93 Customer Release and final production-signed APK preserve customer Release behavior:

- no `DEVELOPMENT ENTITLEMENT TEST`;
- no `Test as FREE`;
- no `Test as PRO`;
- no Dev Reset;
- no customer-accessible native debug entitlement grant path;
- `debuggable=false`.

Status: **Physical-device PASS / CLOSED**.

The separate `.debug` package remains the engineering QA architecture. Do not delete that capability globally in future development.

## Production install / launch — B93 final

The exact production-signed Golden APK installed successfully after removing the QA-signed Customer Release package.

```text
Bearagnostic-0.35.45-alpha93.apk
```

Status: **Physical-device PASS / CLOSED**.

## Final-polish / layout closure

The v80→v91 polish line ultimately converged through B92.

B92 fixed the shared Settings/Unified Detail viewport geometry so long Help/Preferences/About/Legal content no longer flows beneath the Bottom Navigation. The fix uses the actual header/scroll-area layout contract rather than a single fragile Help-only padding patch.

P'Benz physically re-tested the Customer Release and accepted the corrected behavior.

Status: **Physical-device PASS / CLOSED**.

## Duplicate keeper policy — B93

A physical APK Installers review exposed a real trust defect: an Android trash-renamed file such as `.trashed-*` could become the duplicate `Keep one copy` suggestion because the old keeper rule prioritized modified time.

B93 changed the native duplicate keeper policy so a verified normal copy is preferred over a trash/recycle copy when both exist. Trash/recycle copies are not auto-deleted; they simply lose preferred-keeper status when a valid normal copy exists. Existing destructive revalidation and keep-one-copy safety remain in force.

Physical B93 re-test showed `.trashed-*` APK entries as normal `Review` candidates rather than incorrectly locked `Keep one copy` suggestions.

Status: **Physical-device PASS / CLOSED**.

## Free core

Previously verified:

- app does not hang/crash during normal use;
- Home loads correctly;
- no Dev controls in customer Release;
- Free scan/core path completes;
- Pro-gated features route to production Pro UI.

Status: **Frozen PASS**.

A dedicated current-B93 Free destructive-delete fixture was not separately rerun during final closure. Do not falsely state that it was. P'Benz accepted Android closure based on the existing destructive-safety proof set plus targeted B92/B93 regression evidence.

## Scan physical proof

Observed prior Smart scan example:

- 1,053 files reviewed;
- 184 folders visited;
- 185 MB / 185 MB data read;
- access/read issues: 0;
- categories populated correctly.

Status: **Frozen PASS**.

## Production Restore / Pro — B93 exact signed APK

P'Benz installed the exact production-signed B93 Golden APK and restored the existing real Pro entitlement successfully.

Status: **Physical-device PASS / CLOSED**.

No repeat purchase was required.

## Entitlement persistence

Prior production evidence:

- close/remove from recents → reopen → Pro remains;
- full device reboot → Pro remains;
- Exact Duplicates remains available.

Status: **Frozen PASS**.

This persistence sequence was not separately repeated as a new B93 reboot experiment during final closure; preserve the evidence boundary.

## Exact Duplicates + verified deletion

Controlled historical QA fixture:

- 4 byte-identical copies detected;
- 1 copy marked KEEP;
- 3 extras selected;
- confirmation showed 3 removals / 1 group / 3.01 MB;
- `Delete & verify` succeeded;
- cleanup summary reported 3 copies removed / 1 group resolved / 3.01 MB;
- Android filesystem manually checked;
- exactly 1 real copy remained.

Status:

- Exact Duplicate Detection = **PASS**;
- Selection / Final Review = **PASS**;
- Verified Deletion = **PASS**;
- Keep-One-Copy Safeguard = **PASS**.

B93 additionally closes the trash/recycle preferred-keeper edge case without weakening destructive safety.

## Insights / Local History

Verified:

- Latest Checkup;
- Device Storage;
- Comparable Checkups;
- storage trend;
- pattern;
- Recent Completed Checkups;
- persistence after reboot.

Status: **Frozen PASS**.

## Verified Cleanup History

The duplicate cleanup appeared as:

- 1 cleanup event;
- 3 items removed;
- 3.01 MB verified space;
- Files cleaned = verified.

Status: **Frozen PASS**.

Cleanup history is intentionally aggregate-only and not clickable into filenames. `LocalHistoryStore` intentionally does not persist filenames, paths, review IDs, hashes or file contents. This remains privacy architecture, **not a defect**.

## Final Android closure decision

P'Benz accepted the production-signed B93 runtime and Restore result and explicitly closed the Android phase.

```text
Android development            CLOSED
B93 Customer Release           PASS
B93 physical targeted QA       PASS
Production signing             PASS
Production APK installation    PASS
Restore Pro                    PASS
Golden APK                     FROZEN
```

Do not reopen Android implementation during website work unless a new reproducible release-blocking defect is found.

# 12A. FINAL POLISH CORRECTIVE HISTORY / TRUST RESET

> **Current status:** Historical context retained intentionally. The v80→v83 findings below explain why later corrective work existed; they are no longer open launch blockers. B84→B93 subsequently closed the Android polish line, and B93 is the accepted frozen production release.

## v84 → B93 closure chain

```text
v84  responsive tool polish
v85  premium UI + localization polish
v86  physical UI regression fixes
v87  final physical regression fixes
v88  final Tool regression fixes
B89  release-trust surface polish
B90  final release UI integration
B91  Pro + APK Installer consistency
B92  shared Settings/Detail viewport-bound fix
B93  trash/recycle duplicate-keeper policy fix + final customer release
```

Key final closures:

- Help/Support and related premium UI work accepted;
- customer Release Dev tools removed while Debug architecture remains available for engineering;
- APK Installer summary/detail consistency accepted;
- long Settings/Help detail scrolling no longer runs under Bottom Navigation;
- trash/recycle copies are no longer preferred exact-duplicate keepers over verified normal copies;
- Customer Release B93 passed CI and physical targeted QA;
- permanent production signing and exact production-signed installation/Restore succeeded.


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

# 13. FINAL POLISH — HISTORICAL ACCEPTANCE CHECKLIST (CLOSED ON B93)

> The detailed v83 checklist below is preserved because it is valuable regression history. Any wording such as `candidate`, `pending`, `must verify`, or `launch blocker` inside the retained v83 item descriptions reflects the Revision 9.0 checkpoint, **not the current B93 state**. P'Benz's later physical reviews and B84→B93 corrective releases closed this Android checklist. Reopen an item only if a new reproducible regression appears.


These nine items were the authoritative v83 Final Polish acceptance list. Their detailed wording is intentionally retained as regression history, but B84→B93 physical review and corrective releases supersede the old `IMPLEMENTED CANDIDATE / PHYSICAL VERIFICATION PENDING` state. Current B93 status is CLOSED unless a new reproducible regression appears.

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

# 13A. HISTORICAL v83 PHYSICAL QA MATRIX — COMPLETED THROUGH B93

> Retained as a future-regression checklist. It is not an instruction to rerun the entire Android matrix during Final Website Polish. Current Android source is frozen at B93.


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

**Current Android status:** closed through B93 acceptance. Retain these audit principles for future Android versions and apply their website-relevant equivalents during Final Website Polish. Do not reopen the B93 Android binary merely to rerun historical audits without new evidence.


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

## B93 production freeze — binding now

Android source/runtime is frozen at B93. During Final Website Polish:

- no Android feature work;
- no cosmetic Android rebuild;
- no version renaming rebuild;
- no resigning the Golden APK;
- no new app locale;
- no architecture churn;
- no reopening closed B84→B93 issues without reproducible evidence.

Any required future Android change starts a **new version** and a new release/QA/signing evidence line.


From this point until public launch:

- do not add major new features;
- do not redesign working screens without a defect or clear launch requirement;
- do not reopen frozen architecture for aesthetics;
- do not expand supported stores/locales just before launch;
- only fix known issues, issues found by the four audits, or true launch blockers.

The product already has enough functional breadth for launch. Professional quality now comes from consistency, safety, truth, polish and customer confidence.

---

# 16. PRO UI / CUSTOMER-JOURNEY POLISH

**Current Android status:** production-signed B93 Restore Pro is Physical-device PASS. The remaining work in this section is primarily **cross-surface website / Ko-fi / support / legal communication alignment**, not a reason to modify the frozen B93 APK unless a real runtime defect is found.


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

# 17. WEB / KO-FI / SUPPORT / LEGAL — NEXT ACTIVE PHASE

Android is now closed, but Bearagnostic is not launch-ready in isolation.

The immediate project phase is:

```text
Final Website Polish
→ place exact Golden APK on Benedict website
→ verify website-downloaded bytes/checksum
→ submit exact same APK to Uptodown
→ final cross-surface launch smoke
```

Final cross-surface polish must align:

- Benedict website;
- frozen B93 Bearagnostic app;
- Ko-fi Shop item;
- FAQ/help;
- support;
- Privacy/Terms/License;
- refund/revoke/dispute copy.

Benedict website must provide:

- official production-signed Golden APK;
- exact version `0.35.45-alpha93`;
- release notes/changelog;
- install/update guidance;
- checksum/authenticity presentation;
- Pro purchase explanation;
- Restore explanation;
- paid-but-not-unlocked recovery;
- purchase-email identity guidance;
- OTP troubleshooting;
- Help & Support;
- legal/refund links.

## Launch localization disclosure — mandatory

The Android app launches with exactly these first-class app languages:

```text
English
ไทย
日本語
```

The Benedict website is available in **10+ languages**.

The website must never imply that every website language is also available inside the Android app. On Download/Product/FAQ/Requirements surfaces where language expectations are relevant, disclose clearly:

```text
App languages: English, Thai, and Japanese.
Our website is available in 10+ languages.
Additional app languages may be added in future updates.
```

Equivalent localized wording may be used on non-English website pages as long as the meaning remains exact.

Additional Android app languages are post-launch work only, chosen from real demand and shipped only after translation, layout, functional, destructive-flow, Pro/Restore, Help/Legal, accessibility and error-state QA.

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
- official download/update/authenticity;
- current Android app language availability.

The larger Ticket/Case after-sales platform remains deferred until after core launch unless a real support-volume need appears.

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

The following is the **last documented controlled commerce state** from the pre-launch test phase. It was not revalidated merely because Android B93 closed. Inspect the live environment before changing or claiming current production values.

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

# 21. FINAL RELEASE PATH — WEBSITE / DISTRIBUTION PHASE

Android implementation, Customer Release, permanent signing and exact production-signed physical acceptance are complete.

Do **not** start by rebuilding Android.

Proceed in this order:

1. update/upload the canonical Master Plan and Room Migration Prompt with the B93 closure state;
2. freeze Android source and Golden APK;
3. inspect latest `grolygori789-crypto/benedict-interactive-web` `main`;
4. perform **Final Website Polish** across desktop/mobile and all currently exposed website locales;
5. align Product / Download / FAQ / Support / Privacy / Terms / License / Refund / Pro / Restore messaging with frozen B93 truth;
6. add the mandatory disclosure that the website has 10+ languages while the Android app currently supports only English / Thai / Japanese;
7. verify Ko-fi product presentation, 249 THB Lifetime/no-subscription wording, purchase-email guidance and support/refund copy;
8. inspect the current production commerce/email environment before changing test flags;
9. close remaining support/legal/refund/revoke/dispute launch items;
10. place **the exact Golden APK** `Bearagnostic-0.35.45-alpha93.apk` on the Benedict website;
11. publish its exact version and SHA-256;
12. download the public APK back from Benedict and verify its SHA-256 equals the Golden APK;
13. test the real public Download → Android installer → launch path;
14. submit the **same exact Golden APK** to Uptodown;
15. verify Uptodown metadata/version/binary identity when available;
16. perform final customer-journey smoke across website → purchase/Restore/help/download;
17. make the final public-launch decision;
18. launch + monitor.

Remaining historical items such as a separate current-B93 Free destructive-delete fixture or an exact-price 249 THB clean-identity purchase must not be silently relabeled as tested. If they remain unperformed, preserve the explicit evidence boundary / owner-accepted risk decision.

Public launch remains **NOT APPROVED** until website/distribution/cross-surface gates above are completed or explicitly waived by P'Benz.

# 22. ONE FINAL CANDIDATE / ONE EXACT BINARY — GOLDEN APK FROZEN

The Android candidate-selection phase is complete.

Golden APK:

```text
Bearagnostic-0.35.45-alpha93.apk
```

Golden APK SHA-256:

```text
09c12a8eb81d1a9353bc588b49639648457a1d502318ba58bc10bd8da7cfb66f
```

Production certificate SHA-256:

```text
503FB4A77B38E7129E20002EC6A0B1D4225FD189BB16E0C71EBAD88ECA88AE90
```

Binding distribution chain:

```text
accepted B93 source
→ Customer Release CI PASS
→ QA-signed Release physical regression PASS
→ permanent production signing PASS
→ exact production-signed APK physical install + Restore PASS
→ Golden APK frozen
→ Benedict website exact same APK
→ verify downloaded SHA-256
→ Uptodown exact same APK
```

Do not rebuild or resign after final physical acceptance unless source changes and a new release version is intentionally created.

Benedict website and Uptodown must receive identical Golden APK bytes.

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

## Launch locale policy — frozen for B93

Android launch languages are exactly:

```text
en  English
th  ไทย
ja  日本語
```

Do not add more Android locales to the frozen B93 release.

The website may serve 10+ languages. Website language availability must not be represented as Android app language availability. Additional app locales are post-launch candidates based on real demand and must pass first-class localization + layout + functional QA before exposure.


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

1. read the current Room Migration prompt completely;
2. fetch latest Android + Web `main` before trusting stale SHA references;
3. read this canonical Master Plan completely;
4. recognize Android B93 as the **frozen accepted Golden APK line**;
5. do not start by rebuilding Android or rerunning historical v83 QA;
6. preserve Commerce #1–#25 and all Frozen physical evidence unless directly affected;
7. treat v80→B93 corrective history as closed regression context;
8. preserve Debug-vs-Release architecture for future versions, but do not modify it during website work;
9. begin with **Final Website Polish** in `grolygori789-crypto/benedict-interactive-web`;
10. align website/Ko-fi/support/legal copy with exact B93 truth;
11. enforce website 10+ languages vs Android EN/TH/JA disclosure;
12. use only the Golden APK `Bearagnostic-0.35.45-alpha93.apk` for public Android distribution;
13. verify any website-downloaded APK against SHA-256 `09c12a8eb81d1a9353bc588b49639648457a1d502318ba58bc10bd8da7cfb66f`;
14. submit the same exact APK to Uptodown;
15. do not make P'Benz restate completed Android QA/signing/Restore/keeper/layout history;
16. only reopen Android if a new reproducible release blocker is discovered or P'Benz explicitly starts a new Android version.

Repository-visibility note: the Android repo may be made private after canonical documentation and release artifacts are safely archived, according to P'Benz's operational decision. Never put production keystore/passwords/secrets in GitHub regardless of visibility.

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

**ANDROID — FINAL PASS / FROZEN**

- Commerce hardening #1–#25
- Release-Isolation physical proof
- Production signing key setup + backup
- Production certificate verification
- B93 Customer Release CI
- B93 customer Release physical behavior
- B92 Settings/Detail viewport correction
- B93 trash/recycle duplicate-keeper correction
- Free core scan
- Production Restore to Pro on exact production-signed B93
- prior Pro persistence reopen/reboot evidence
- Exact Duplicate detection
- Keep-one-copy safeguard
- Verified duplicate deletion
- Insights / Local History
- Verified Cleanup History
- Aggregate-only cleanup-history privacy
- exact production-signed Golden APK install

**Golden Android release**

```text
Android main:       1ab659e0937b41840d2a2a789f19183797208da7
B93 app source:     d31fe574aefaf17acf57d12830a61cfe73abc689
B93 app tree:       a7cf4ef1454d23d2e71787cb8fb0cdeff2b29e84
Version:            0.35.45-alpha93
versionCode:        93
Golden APK:         Bearagnostic-0.35.45-alpha93.apk
APK SHA-256:        09c12a8eb81d1a9353bc588b49639648457a1d502318ba58bc10bd8da7cfb66f
Certificate SHA256: 503FB4A77B38E7129E20002EC6A0B1D4225FD189BB16E0C71EBAD88ECA88AE90
Android status:     CLOSED / FROZEN
Public launch:      NOT YET — website/distribution closure remains
```

**Historical corrective notes retained**

- v80 = first Final Polish implementation; physical Help/Support quality rejected
- v81 = withdrawn local overcorrection; never canonical
- v82 = restored Debug/Release architecture
- v83 = Tool/support-flow corrective checkpoint documented in Revision 9.0
- v84→v91 = iterative physical/UI/trust polish
- B92 = shared Settings/Detail viewport fix
- B93 = duplicate trash/recycle keeper fix + final customer-release closure

**OPEN / urgent next — WEBSITE / DISTRIBUTION**

- Final Website Polish
- Product/Download page production-quality acceptance
- website 10+ languages vs Android EN/TH/JA disclosure
- exact Golden APK website hosting
- public-download SHA-256 verification
- release notes/changelog/version/checksum presentation
- install/update guidance
- FAQ / support / purchase / Restore messaging alignment
- legal/privacy/refund/revoke/dispute closure
- Ko-fi final publication/presentation check
- current production commerce/email environment inspection
- final controlled commerce smoke as needed
- 249 THB exact-price proof decision remains an explicit evidence/risk decision if not already performed
- Uptodown submission using the exact Golden APK
- final website → download/install → purchase/Restore/help smoke
- public launch decision + monitoring

**Evidence boundary retained**

A dedicated current-B93 Free destructive-delete fixture was not separately rerun during final closure. Do not label it as a fresh B93 Physical PASS. Existing destructive safety evidence plus targeted final regressions were accepted by P'Benz for Android closure.

**Localization launch truth**

```text
Android app: English / ไทย / 日本語
Website:     10+ languages
```

Website must clearly disclose this difference and must not imply parity between website and app language coverage.
