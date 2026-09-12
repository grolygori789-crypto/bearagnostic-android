# Bearagnostic B53 upload instructions

1. Open the `bearagnostic-android` repository locally.
2. Overwrite the existing files with the files from this package, preserving the same repo-relative paths.
3. Commit the changes.
4. Push to `main`.
5. Wait for GitHub Actions to build the debug APK.
6. Install/update the APK on the Android test device.
7. Physically verify the new startup intro before moving on to full regression QA.
