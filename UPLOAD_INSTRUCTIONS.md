# Bearagnostic B61 premium share result card

This package supersedes B60.

## What changed
- Added a premium **image-based Result Share Card** for the Android app.
- The visible Result share action is intercepted and converted into a styled Bearagnostic card instead of plain text only.
- The card is generated from the current visible result summary on screen.
- The card uses Bearagnostic branding, a matched Dr.Bear pose, clean premium typography, and key visible metrics from the active result screen.
- Added a dedicated Android JS bridge to share generated PNG cards through the native Android share sheet.
- Kept the existing text-sharing fallback path in the web layer if native image sharing is unavailable.
- Preserved the launch sequence, scan-motion polish, and other earlier fixes.
- Bumped version/build/cache to **B61**.

## Changed-file allowlist
- `app/build.gradle.kts`
- `app/src/main/java/com/benedictinteractive/bearagnostic/MainActivity.kt`
- `app/src/main/java/com/benedictinteractive/bearagnostic/ShareCardBridge.kt`
- `app/src/main/legacy-adapter/android-share-card.js`
- `UPLOAD_INSTRUCTIONS.md`

## Upload
1. Overwrite/add the repo-relative files from this package.
2. Commit and push to `main`.
3. Wait for GitHub Actions to build the debug APK.
4. Install/update on the Android test device.
5. Open a Result screen in Bearagnostic.
6. Tap the visible share button/action.
7. Verify the Android share sheet opens with an image card instead of plain text only.
8. Verify the shared image looks premium, readable, and includes the expected visible metrics.

## QA truthfulness
- Static file-assembly QA: PASS.
- JavaScript syntax check: PASS.
- Kotlin compile/build in Android environment: NOT run here.
- Physical Android share flow: NOT verified here.
- Result DOM extraction accuracy depends on the pinned legacy UI structure and should be validated on device.

## Rollback
Restore B60 versions of the changed files and remove `ShareCardBridge.kt` plus `android-share-card.js`.
