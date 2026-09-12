# Bearagnostic B66 final share-card fix

Baseline: GitHub main commit `6d45424e5c4523c3f93962f3121ec3d5595c3047` (`Final premium share card redesign`).

## Fixes
- Fixes B65's washed-out Dr.Bear by forcing full alpha before drawing the mascot.
- Removes the decorative mascot circles that contributed to the obscured look.
- Re-spaces the hero so the chips never overlap text.
- Fixes Verification bottom clipping with larger safe padding.
- Adds a real Scan context strip from completed-result values: Scan mode, Files reviewed, Coverage.
- Uses app-language timestamp formatting rather than unrelated device-locale formatting.
- Keeps the working native PNG share pipeline.

## Changed-file allowlist
- `app/build.gradle.kts`
- `app/src/main/java/com/benedictinteractive/bearagnostic/ShareCardBridge.kt`
- `app/src/main/legacy-adapter/android-share-card.js`
- `UPLOAD_INSTRUCTIONS.md`

## Commit name
`Fix share card spacing and mascot`

## QA truthfulness
- JavaScript syntax: PASS.
- Version/cache wiring: PASS.
- Static layout-boundary audit: PASS.
- Mascot full-alpha guard: PASS.
- Kotlin parser-level sanity: no malformed-token pattern detected; Android SDK compile not run here.
- Physical-device rendering: NOT YET VERIFIED.

## Rollback
Restore B65 versions of the changed files.
