# Bearagnostic B59 intro timing tune

This package supersedes B58.

What changed:
- Kept the approved Benedict intro, transparent Bearagnostic hero, centered layout, and frameless Home settings gear.
- Tuned the launch timing so the Bearagnostic hero does not linger too long before Main.
- Allowed the app handoff to happen from the earlier WebView draw-ready stage (`onPageCommitVisible`) instead of waiting only for the slower full page-finished point.
- Reduced the minimum total intro hold to create a faster, more premium launch flow.
- Bumped build/version cache to B59.

Upload:
1. Overwrite the same repo-relative files from this package.
2. Commit and push to `main`.
3. Wait for GitHub Actions to build the debug APK.
4. Install/update on the Android device.
5. Verify Benedict still feels right, the Bearagnostic hero is visible but shorter, and the handoff into Main feels quicker and smoother.
