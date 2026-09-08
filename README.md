# Bearagnostic for Android

Native Android edition of **Bearagnostic** — a premium, privacy-first, one-tap file-health checkup app by **Benedict Interactive**.

## Current milestone

**Persistent Dev Signing 03 · v0.3.0-alpha03 · versionCode 3**

Native Scanner 02 remains the current scanner engine: after explicit Android storage permission, Bearagnostic scans user-accessible shared storage locally, analyzes real file metadata, identifies large and older files, groups same-size duplicate candidates, and verifies duplicates with full-file SHA-256 hashing.

Batch 03 adds one stable development-only signing identity so successive GitHub Actions debug APKs can update the installed Bearagnostic debug app instead of requiring an uninstall for every development build.

No file is uploaded or deleted by this build.

## Development update flow

The debug package ID remains:

`com.benedictinteractive.bearagnostic.debug`

Starting with Batch 03, every debug APK is signed with the same repository development key and each production batch increments `versionCode`.

Normal development flow:

```text
Upload canonical changed files
        ↓
GitHub Actions builds app-debug.apk
        ↓
Open the new APK on the Android test device
        ↓
Android updates the existing Bearagnostic debug app
        ↓
Continue testing with the same installed app
```

### One-time migration from earlier debug builds

Foundation 01 and Native Scanner 02 were built on ephemeral GitHub runners before the stable development key existed. If one of those APKs is already installed, Android will see Batch 03 as a different signer.

Uninstall the old debug app **once**, then install the Batch 03 APK. From Batch 03 onward, later debug builds should update in place as long as they keep the same application ID, signing key, and a non-decreasing version code.

## Development signing boundary

`signing/bearagnostic-debug.jks` is intentionally a **development-only** key. It is committed so GitHub Actions runners reproduce the same debug signing identity on every build.

It is not a production trust credential and must never sign the release package. Because the repository is public, the debug key must be treated as public. Install development APKs only from trusted Bearagnostic build artifacts.

The future production package remains:

`com.benedictinteractive.bearagnostic`

Production release signing will use a separate private signing strategy and will not reuse the development key.

## Current checkup scope

The scanner reports real aggregate results for:

- files reviewed;
- directories visited;
- total accessible bytes reviewed;
- files at least 100 MB;
- files older than 365 days using `lastModified`;
- same-size duplicate candidates;
- exact duplicate groups and extra copies verified by SHA-256;
- verified duplicate bytes that may be reclaimable after a future review step;
- unreadable files and inaccessible folders encountered during traversal.

The scanner deliberately skips Android-protected `Android/data` and `Android/obb` trees and does not claim access to private internal storage of other apps.

## Progress truth

The app does not invent a whole-device percentage before it knows the work size. File discovery is shown as indeterminate activity tied to the real crawler. Once same-size duplicate candidates are known, SHA-256 verification progress is derived from actual candidate bytes read.

## Build stack

- Android Gradle Plugin 9.4.0
- Gradle 9.6.0 in CI
- JDK 17
- compileSdk 36
- targetSdk 36
- minSdk 26
- Kotlin via AGP built-in Kotlin support

## Build an APK on GitHub

Every push to `main` triggers **Build Android Debug APK**.

1. Open the repository **Actions** tab.
2. Open the latest `Build Android Debug APK` run.
3. Wait for the build job to finish.
4. Download the `bearagnostic-android-debug-...` artifact.
5. The artifact contains `app-debug.apk` and its SHA-256 checksum.

## Repository principles

- Overwrite canonical files instead of accumulating version-suffixed replacements.
- Add a new file only when it has a genuinely distinct responsibility.
- Local-first and privacy-first.
- No fake system metrics or fake scan progress.
- Native Android code is authoritative for filesystem access, scanning, and permissions.
- The packaged WebView is a local premium UI layer, not a remote web wrapper.
- Cleanup/deletion is not implemented yet and will require explicit review and confirmation.
- Development and production signing identities remain strictly separated.

See [`docs/architecture/FOUNDATION.md`](docs/architecture/FOUNDATION.md) for the current architecture and [`docs/architecture/QA.md`](docs/architecture/QA.md) for verified and pending QA.

## Ownership

Copyright © Benedict Interactive. All rights reserved.

No open-source license is granted by this repository.
