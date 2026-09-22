# Bearagnostic Customer Release — B91

This package does **not** contain the production keystore or any signing secret.
It preserves the accepted B91 app source and adds a controlled customer-release pipeline only.

## Why this path

The production signing identity is intentionally stored outside GitHub. The safe release path is:

1. GitHub Actions builds the **Release** variant from the frozen source and verifies release isolation.
2. The workflow uploads an **aligned, unsigned APK** plus a source/version report.
3. That exact unsigned APK is signed locally with the permanent Benedict production key.
4. The signing script verifies package ID, `debuggable=false`, zip alignment, signing certificate and SHA-256.
5. P'Benz physically tests the **exact signed APK**.
6. After PASS, do not rebuild. Publish that same APK to `benedictinteractive.com` and submit the same APK to Uptodown.

## Repository files in this handoff

```text
.github/workflows/android-customer-release.yml
scripts/sign-production-release.ps1
```

No app source, scanner, deletion, commerce, entitlement, Cloudflare, Ko-fi or Resend code is changed by this handoff.

## Step 1 — upload this handoff to the repository

Commit suggestion:

```text
Add customer release pipeline
```

## Step 2 — build the unsigned Release APK

In GitHub:

```text
Actions
→ Build Android Customer Release
→ Run workflow
```

Download the artifact named similar to:

```text
bearagnostic-customer-release-unsigned-<run number>
```

It contains:

```text
bearagnostic-customer-release-unsigned-aligned.apk
bearagnostic-customer-release-unsigned-aligned.apk.sha256
customer-release-report.txt
```

The workflow verifies the release build is `com.benedictinteractive.bearagnostic`, non-debuggable, and passes the existing release-isolation / commerce artifact gates. It never uses the production signing key.

## Step 3 — sign locally with the permanent production key

Open PowerShell in the repository root and run:

```powershell
.\scripts\sign-production-release.ps1 -InputApk "C:\PATH\TO\bearagnostic-customer-release-unsigned-aligned.apk"
```

The script uses the established keystore location by default:

```text
%USERPROFILE%\Documents\BenedictInteractive\Signing\bearagnostic-production.jks
```

and alias:

```text
bearagnostic-production
```

It prompts for passwords locally. Passwords are never written into the repository, report, or handoff package.

Expected permanent certificate SHA-256:

```text
503FB4A77B38E7129E20002EC6A0B1D4225FD189BB16E0C71EBAD88ECA88AE90
```

## Step 4 — physical QA of the exact signed APK

Verify at minimum:

```text
package = com.benedictinteractive.bearagnostic
debuggable = false
no DEVELOPMENT ENTITLEMENT TEST
no Test as FREE
no Test as PRO
no Reset
no Developer Tools / Billing QA Console exposed
Pro purchase + Restore customer surface works normally
Home / Checkup / Tools / Insights / More open normally
cold launch is clean
```

Then run one short functional smoke on the signed APK. Do not rebuild merely to rename the file or change metadata after PASS.

## Step 5 — freeze exact binary

The signing script creates:

```text
Bearagnostic-<exact-version>.apk
Bearagnostic-<exact-version>.apk.sha256
Bearagnostic-<exact-version>-release-report.txt
```

The APK that passes physical QA becomes the golden public binary.
Use the same exact bytes for the Benedict website and Uptodown.
