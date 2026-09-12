# Bearagnostic B55 — final premium launch + gear polish

Baseline verified before packaging:
- GitHub main: `144ff818b71cdd39baf205fc49b34c414c760c4a`
- Android: `0.35.6-alpha54` / versionCode `54`
- Latest GitHub Actions run #60: SUCCESS

This package changes only the approved launch presentation and Home header gear presentation.

## Upload
Overwrite the repository files with this package using the same repo-relative paths, then commit/push to `main`.

## Changed-file allowlist
- `app/build.gradle.kts`
- `app/src/main/java/com/benedictinteractive/bearagnostic/MainActivity.kt`
- `app/src/main/legacy-adapter/android-home-polish.js`
- `app/src/main/res/drawable-nodpi/benedict_interactive_launch_logo.png`

## Expected physical result
1. No decorative top line.
2. Benedict logo + copy fade in calmly; one cyan sweep runs on the lower accent.
3. Benedict stage dissolves into a large Dr. Bear / Bearagnostic hero stage.
4. Bearagnostic remains clearly visible before Main; launch duration is at least ~3 seconds.
5. The old WebView launch layer never appears or overlaps.
6. Main fades in softly.
7. Home gear keeps its full touch target but has no visible square/circular tile — only the approved silver gear remains.

## Rollback
`144ff818b71cdd39baf205fc49b34c414c760c4a`
