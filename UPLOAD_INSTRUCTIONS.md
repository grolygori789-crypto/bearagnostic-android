# Bearagnostic B54 hotfix upload instructions

This package is a corrective replacement for the earlier Benedict intro package.

Goal: keep only the new native Benedict intro and forcibly bypass/remove the old web launch layer so the two logos never overlap.

Steps:
1. Open the `bearagnostic-android` repository locally.
2. Overwrite the existing files with the files from this package, preserving the same repo-relative paths.
3. Commit and push.
4. Wait for GitHub Actions to finish building the APK.
5. Install on the Android device and verify startup.
