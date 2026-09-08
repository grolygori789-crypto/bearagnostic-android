# Bearagnostic for Android

Native Android edition of **Bearagnostic** — a premium, privacy-first, one-tap file-health checkup app by **Benedict Interactive**.

## Current milestone

**Foundation 01 · v0.1.0-alpha01 · versionCode 1**

This first Android batch establishes the native application shell, the local Web UI ↔ Kotlin bridge, Android storage-access handoff, and the GitHub Actions debug-APK pipeline. It deliberately does **not** pretend to scan files yet.

## Product direction

Bearagnostic for Android will analyze user-accessible device files locally after explicit Android permission. Planned checkup categories include duplicate files, large files, older files, and carefully defined cleanup candidates.

The app will not claim access to protected app-private storage that Android does not expose.

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

- Local-first and privacy-first.
- No fake system metrics or fake scan progress.
- Native Android code is authoritative for filesystem access and permissions.
- The packaged WebView is a local premium UI layer, not a remote web wrapper.
- High-risk cleanup actions require review, confirmation, and rollback-aware product design.

See [`docs/architecture/FOUNDATION.md`](docs/architecture/FOUNDATION.md) for the technical boundary and next step.

## Ownership

Copyright © Benedict Interactive. All rights reserved.

No open-source license is granted by this repository.
