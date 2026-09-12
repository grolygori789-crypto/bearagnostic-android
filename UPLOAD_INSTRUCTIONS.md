# Bearagnostic B60 scan-motion polish

Baseline inspected before implementation:
- GitHub `main`: `4b7937a7238b748e5597d73b60ba6401a79c712c` (`Tune intro timing and handoff`)
- Baseline CI: Build Android Debug APK run #65 completed successfully.

What changed:
- Added an Android-only scan motion adapter.
- The flying file tiles no longer animate `left` and `top` every frame.
- Flight motion now uses compositor-friendly `transform: translate3d(...)`, rotation, scale, and opacity through the Web Animations API.
- Preserved the same visual direction: files travel from the left side into Dr. Bear's tablet.
- Preserved the existing spawn cadence and scan logic.
- Preserved reduced-motion behavior.
- Bumped Android build/cache version to B60.

Changed-file allowlist:
- `app/build.gradle.kts`
- `app/src/main/legacy-adapter/android-scan-motion-polish.js`
- `UPLOAD_INSTRUCTIONS.md`

Upload:
1. Overwrite/add the repo-relative files from this package.
2. Commit and push to `main`.
3. Wait for GitHub Actions to build the debug APK.
4. Install/update on the physical Android test device.
5. Run Checkup with enough selected files to keep the scan active for several seconds.
6. Watch the file-flight motion especially through the middle of the path and while shrinking into the tablet.

QA status:
- Static source QA: PASS.
- JavaScript syntax check: PASS (`node --check`).
- Package structure/checksum: PASS.
- Android Gradle build/CI after this change: NOT RUN in this environment.
- Physical-device animation smoothness: NOT YET VERIFIED; requires P'Benz device test.

Risk:
- Low-to-moderate, limited to the Android Checkup file-flight visual layer. Scan calculations, progress, file selection, results, cleanup, and destructive logic are untouched.

Rollback:
- Restore `app/build.gradle.kts` from B59/main commit `4b7937a7238b748e5597d73b60ba6401a79c712c` and delete `app/src/main/legacy-adapter/android-scan-motion-polish.js`.
