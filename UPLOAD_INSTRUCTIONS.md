# Bearagnostic B57 exact hero launch package

This package supersedes the earlier B56 launch package.

Intent:
- Keep the premium Benedict studio intro.
- Use the user-approved exact Bearagnostic hero appearance before Main.
- Replace the previous transparent-cutout hero with a clean centered hero composition to eliminate edge/fringe artifacts.
- Keep the Home settings gear without the boxed background.

Upload steps:
1. Open the `bearagnostic-android` repository locally.
2. Overwrite the existing files with the files from this package, preserving the same repo-relative paths.
3. Commit and push.
4. Wait for GitHub Actions to build the APK.
5. Install/update on the Android test device.
6. Verify: Benedict stage visible, exact Bearagnostic hero appears centered and clean with no edge artifacts, smooth fade into Main, and the Home settings gear has no square container.
