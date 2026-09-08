# Upload instructions — Native Scanner 02

Upload the **contents of this ZIP directly to the repository root** of:

`grolygori789-crypto/bearagnostic-android`

This is an overwrite-first overlay package:

- Files already present at the same path should be **replaced/overwritten**.
- Only one genuinely new production file is added: `app/src/main/java/com/benedictinteractive/bearagnostic/FileHealthScanner.kt`.
- Do not create version-suffixed copies such as `MainActivity-v2.kt`, `app-new.js`, or `styles-final.css`.
- No existing file needs to be manually deleted for this batch.
- Do not create an extra wrapper folder.

After commit, GitHub Actions should automatically start **Build Android Debug APK**.

Recommended commit name:

`Add native one-tap scanner`
