# Upload instructions — Persistent Dev Signing 03

Upload the **contents of this ZIP directly to the repository root** of:

`grolygori789-crypto/bearagnostic-android`

Do not create an extra wrapper folder.

## Overwrite policy

Replace existing files at the same canonical paths. Do not keep old copies or create `v2`, `new`, `final`, or backup variants.

This batch intentionally adds only one new path:

`signing/bearagnostic-debug.jks`

All other files in this package overwrite their existing canonical files.

The ZIP contains no hidden `.github` or `.gitignore` changes, so the previous browser hidden-file upload issue does not apply to this batch.

After commit, GitHub Actions should automatically start **Build Android Debug APK**.

Recommended commit name:

`Stabilize Android debug signing`

## First device install after this batch

If an APK from Foundation 01 or Native Scanner 02 is already installed, uninstall that older debug app once before installing Batch 03 because those older CI APKs used ephemeral runner signing keys.

After Batch 03 is installed, future Bearagnostic debug builds should update it in place as long as the debug application ID and this development signing key remain unchanged and versionCode continues to increase.
