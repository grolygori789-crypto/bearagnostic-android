# Bearagnostic for Android

Native Android edition of **Bearagnostic** — a premium, privacy-first, one-tap file-health checkup app by **Benedict Interactive**.

## Current milestone

**Native Scanner 02 · v0.2.0-alpha02 · versionCode 2**

The Android app now contains a real local one-tap scanner for user-accessible shared storage. After explicit Android storage permission, the native engine crawls accessible storage, reads real file metadata, counts large and older files, groups duplicate candidates by exact file size, then verifies duplicate candidates with full-file SHA-256 hashing.

No file is uploaded or deleted by this build.

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

The debug package ID is `com.benedictinteractive.bearagnostic.debug`. The future release package ID remains `com.benedictinteractive.bearagnostic`.

## Repository principles

- Overwrite canonical files instead of accumulating version-suffixed replacements.
- Add a new file only when it has a genuinely distinct responsibility.
- Local-first and privacy-first.
- No fake system metrics or fake scan progress.
- Native Android code is authoritative for filesystem access, scanning, and permissions.
- The packaged WebView is a local premium UI layer, not a remote web wrapper.
- Cleanup/deletion is not implemented yet and will require explicit review and confirmation.

See [`docs/architecture/FOUNDATION.md`](docs/architecture/FOUNDATION.md) for the current architecture and [`docs/architecture/QA.md`](docs/architecture/QA.md) for verified and pending QA.

## Ownership

Copyright © Benedict Interactive. All rights reserved.

No open-source license is granted by this repository.
