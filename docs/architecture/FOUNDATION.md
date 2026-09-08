# Bearagnostic Android Foundation 01

## Purpose

This repository is the native Android edition of Bearagnostic. The Android edition exists so the product can perform a genuine one-tap file-health checkup across user-accessible device storage after explicit Android permission, instead of relying on browser file pickers.

## Architecture

```text
Premium local Web UI
        │
        ▼
NativeBridge (JavaScript interface)
        │
        ├── StorageAccessController
        ├── Future ScanCoordinator
        ├── Future FileCrawler
        ├── Future DuplicateEngine
        └── Future CleanupReviewEngine
```

The WebView contains only local packaged assets. It is not a remote website shell. Native Android code remains authoritative for permissions, filesystem access, scanning, hashing, deletion, and platform truth.

## Foundation 01 includes

- Native Android application shell.
- Kotlin source using AGP built-in Kotlin support.
- Local-only WebView UI and versioned JavaScript bridge.
- Explicit broad-storage permission handoff to Android Settings on Android 11+.
- Legacy read-permission path for Android 10 and below.
- Debug APK build pipeline using GitHub Actions.
- EN / JA / TH foundation copy.
- No remote analytics, ads, account system, or file upload.

## Intentionally not implemented yet

- File crawling.
- Duplicate hashing.
- Large-file analysis.
- Modified-date analysis.
- Cleanup candidate rules.
- Deletion or cleanup actions.
- Background scanning.

No UI in Foundation 01 claims that a scan has occurred.

## Security boundaries

- The app does not bypass Android sandboxing.
- `MANAGE_EXTERNAL_STORAGE` does not grant access to private internal storage of other apps.
- Protected Android locations remain controlled by the operating system.
- File deletion will require an explicit review and confirmation flow when implemented.

## Next production batch

Build the native `ScanCoordinator` and real file crawler, then connect real progress events to the approved Bearagnostic clinical scanning UI.
