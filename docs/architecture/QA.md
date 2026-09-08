# Bearagnostic Android QA Record

## Foundation 01 — verified

- Repository foundation uploaded to `main`.
- GitHub Actions `Build Android Debug APK` completed successfully.
- APK artifact and SHA-256 checksum were produced successfully.

## Native Scanner 02 — compile verified

- Production commit: `850617e84580376c29ae128b81d2823837d8ca71`.
- GitHub Actions run `34193902495` completed with conclusion `success`.
- Native scanner source compiled in CI and a debug APK artifact was produced.
- Scanner remains read-only: no file deletion path and no network/upload path.

Physical-device behavior is still evaluated separately from CI compilation.

## Persistent Dev Signing 03 — completed before packaging

- Re-inspected `main` before changes and confirmed Native Scanner 02 is the current production baseline.
- Confirmed Native Scanner 02 GitHub Actions compile success before modifying signing.
- Preserved canonical repository paths and overwrite-first structure.
- Added only one new repository file with a distinct responsibility: `signing/bearagnostic-debug.jks`.
- Existing `app/build.gradle.kts`, README, architecture, QA, package manifest, and upload instructions are overwritten in place.
- Version advanced to `0.3.0-alpha03`, `versionCode 3`.
- Debug application ID remains `com.benedictinteractive.bearagnostic.debug`.
- Generated a dedicated RSA development signing key and verified the keystore can be read with `keytool`.
- Confirmed the signing certificate subject identifies Bearagnostic Development / Benedict Interactive.
- Confirmed the development key is not wired into the release build type.
- Package contains no duplicate paths and no wrapper directory.

## Required after upload

A green GitHub Actions `Build Android Debug APK` run is required before calling Batch 03 compile-verified.

Physical-device QA for the signing migration:

1. If Native Scanner 02 or an older ephemeral-signed debug APK is installed, uninstall it once.
2. Install the Batch 03 debug APK.
3. Build a later APK with the same development key and a higher versionCode.
4. Install it over Batch 03 without uninstalling.
5. Confirm Android presents an update path and the application remains installed as the same debug package.

The existing scanner physical QA remains required for:

- Android 11+ All Files Access handoff and return flow;
- Android 10 and below legacy read permission where applicable;
- real primary-storage traversal;
- removable-storage discovery on supported devices;
- cancellation during crawling and hashing;
- large storage sets and long-running duplicate verification;
- EN / JA / TH WebView rendering;
- OEM-specific Android behavior.

Do not describe the development update path or scanner as physical-device PASS until those checks are performed on Android hardware.
