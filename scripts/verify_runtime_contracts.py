#!/usr/bin/env python3
"""Deterministic source-level safety checks for Bearagnostic Android.

This suite is intentionally focused on durable runtime invariants rather than historical
batch numbers. It is a CI source gate, not a substitute for Android build, runtime, or
physical-device QA.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PARTIAL_STAGING = False


def read(relative: str, *, required: bool = True) -> str:
    path = ROOT / relative
    if not path.is_file():
        if required:
            raise AssertionError(f"missing required file: {relative}")
        return ""
    return path.read_text(encoding="utf-8")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def check_build_contracts() -> None:
    gradle = read("app/build.gradle.kts")
    code_match = re.search(r"versionCode\s*=\s*(\d+)", gradle)
    name_match = re.search(r'versionName\s*=\s*"([^"]+)"', gradle)
    require(code_match is not None, "versionCode missing")
    require(name_match is not None, "versionName missing")
    version_code = int(code_match.group(1))
    version_name = name_match.group(1)
    require(version_code >= 75, f"runtime must be B75 or newer, got {version_code}")
    require(version_name.endswith(f"alpha{version_code}"), f"versionName/versionCode drift: {version_name} vs {version_code}")

    cache_versions = re.findall(r'android-[a-z-]+\.js\?v=(\d+)', gradle)
    require(cache_versions, "no Android adapter cache versions found")
    require(set(cache_versions) == {str(version_code)}, f"adapter cache versions drifted: {sorted(set(cache_versions))}")
    require(len(cache_versions) >= 30, f"unexpectedly low Android adapter count: {len(cache_versions)}")

    for adapter in (
        "android-entitlement.js", "android-cleanup.js", "android-duplicates.js",
        "android-native.js", "android-review.js", "android-settings-detail.js",
        "android-support.js", "android-share-card.js", "android-billing.js",
        "android-insights.js", "android-locale-polish.js", "android-build-truth.js",
    ):
        require(f'{adapter}?v={version_code}' in gradle, f"missing/coherence failure: {adapter}")

    require('val legacyCommit = "78a31c7752e171c0eafb63c0d0859f4072a193d6"' in gradle,
            "approved legacy/PWA commit changed")
    require('"assets/icons/app-icon-192.png" to "f9cff58fc54e6b0525c7f74922b0588aca6a9a9d"' in gradle,
            "approved launcher icon blob changed")
    require('implementation("com.android.billingclient:billing:9.1.0")' in gradle,
            "Billing Library foundation changed unexpectedly")


def check_scanner_truth_and_delete_safety() -> None:
    scanner = read("app/src/main/java/com/benedictinteractive/bearagnostic/FileHealthScanner.kt")

    for invariant in (
        'const val ANALYSIS_RULES_VERSION = 8',
        'const val MAX_DELETE_SELECTION = 500',
        'ScanMode.QUICK -> ScanPlan(',
        'verifyDuplicates = false',
        'contentReadMode = ContentReadMode.NONE',
        'ScanMode.DEEP -> ScanPlan(',
        'contentReadMode = ContentReadMode.FULL',
        'normalized.endsWith("/android/data")',
        'normalized.endsWith("/android/obb")',
    ):
        require(invariant in scanner, f"scanner truth/scope invariant missing: {invariant}")

    # B75 destructive identity contract.
    for invariant in (
        'var identityKey: String? = null',
        'var duplicateContentSha256: String? = null',
        'val identityKey: String?',
        'val duplicateContentSha256: String?',
        'identityKey = fileIdentityKey(canonical)',
        'duplicateContentSha256 = digest',
        'private fun fileIdentityKey(file: File): String?',
        'LinkOption.NOFOLLOW_LINKS',
        'BasicFileAttributes::class.java',
        'private fun validateDeleteIdentity(candidate: ReviewCandidate, verifyDuplicateHash: Boolean): String?',
        'if (isSymbolicLink(file)) return "symbolic_link_refused"',
        'if (canonical.absolutePath != candidate.path) return "changed_since_review"',
        'if (currentSize != candidate.sizeBytes) return "changed_since_review"',
        'currentModified != candidate.modifiedMs',
        'if (currentIdentityKey != expectedIdentityKey) return "changed_since_review"',
        'val expectedHash = candidate.duplicateContentSha256',
        'private fun hashFileForDelete(file: File): String?',
        'if (!currentHash.equals(expectedHash, ignoreCase = true)) return "changed_since_review"',
        'validateDeleteIdentity(it, verifyDuplicateHash = true)',
        'duplicateKeeperByGroup',
        'validMembers.filter { it.id !in ids }',
        'duplicate_keeper_unavailable',
        'validateDeleteIdentity(keeper, verifyDuplicateHash = false)',
        'val finalSize = safeLength(file)',
        'val finalModified = safeModified(file)',
        'revalidationPerformed',
        'duplicateHashRevalidationPerformed',
    ):
        require(invariant in scanner, f"destructive revalidation invariant missing: {invariant}")

    # Do not leak the private identity proof to JavaScript payloads.
    candidate_json = scanner.split('private fun candidateJson', 1)[1].split('private fun reviewSummaryObject', 1)[0]
    require('identityKey' not in candidate_json, "file identity key leaked to WebView")
    require('duplicateContentSha256' not in candidate_json, "duplicate SHA-256 leaked to WebView")


def check_bridge_and_support_boundary() -> None:
    bridge = read("app/src/main/java/com/benedictinteractive/bearagnostic/NativeBridge.kt")
    activity = read("app/src/main/java/com/benedictinteractive/bearagnostic/MainActivity.kt")
    support = read("app/src/main/legacy-adapter/android-support.js", required=not PARTIAL_STAGING)

    require('const val BRIDGE_VERSION = 18' in bridge, "B76 native bridge contract version must be 18")
    require('RuntimeContractGuard.isReviewSnapshotFresh(generatedAtMs)' in bridge,
            "native stale-review guard missing")
    require('put("reason", "stale_review_snapshot")' in bridge,
            "stale review rejection reason missing")
    require('supportNetwork", "user_initiated_kofi_only"' in bridge,
            "native support boundary is not Ko-fi-only")
    require('identity_revalidated_delete' in bridge,
            "native capability report does not advertise identity-revalidated deletion")
    require('fun setAppLanguage(language: String): Boolean' in bridge,
            "B76 native bridge must expose app-language synchronization")
    require('currentAppLanguage' in activity and '"pt-BR"' in activity and '"es"' in activity,
            "B76 native five-language copy contract missing")

    combined = "\n".join((bridge, activity))
    for forbidden in (
        "PromptPay", "PROMPTPAY_QR_URL", "saveSupportQr", "SUPPORT_QR_WRITE_REQUEST_CODE",
        "pendingSupportQrSave", "raw.githubusercontent.com",
    ):
        require(forbidden not in combined, f"retired PromptPay/native support residue remains: {forbidden}")

    require('"ko-fi.com"' in activity and '"www.ko-fi.com"' in activity,
            "Ko-fi hosts missing from native external URL allowlist")
    allowlist_match = re.search(r'ALLOWED_EXTERNAL_HOSTS\s*=\s*setOf\((.*?)\)\s*\n', activity, re.S)
    require(allowlist_match is not None, "native external URL allowlist not found")
    allowlist = allowlist_match.group(1)
    require('"ko-fi.com"' in allowlist and '"www.ko-fi.com"' in allowlist,
            "Ko-fi allowlist entries missing")
    require('raw.githubusercontent.com' not in allowlist,
            "raw GitHub host must not remain in support allowlist")

    if support:
        require("const KOFI_URL = 'https://ko-fi.com/benedictinteractive';" in support,
                "support adapter is not pinned to Benedict Interactive Ko-fi")
        require("saveSupportQr" not in support and "PromptPay" not in support,
                "support adapter contains retired PromptPay path")
    elif PARTIAL_STAGING:
        print("SKIP unchanged android-support.js (partial local staging; CI remains strict)")



def check_localization_contract() -> None:
    gradle = read("app/build.gradle.kts")
    launch = read("app/src/main/legacy-adapter/android-launch-locales.js")
    stabilization = read("app/src/main/legacy-adapter/android-stabilization.js")

    require('android-launch-locales.js?v=' in gradle, "B76 launch-locales adapter is not integrated")
    require('coreI18nTag + launchLocaleTag' in gradle, "B76 five-language table must load before core app capture")
    require("const SHIPPING_LOCALES = Object.freeze(['en', 'th', 'ja', 'es', 'pt-BR']);" in stabilization,
            "B76 five-language shipping locale contract missing")
    require("['es', 'ES', 'Español']" in launch and "['pt-BR', 'PT-BR', 'Português (Brasil)']" in launch,
            "B76 visible Spanish/Portuguese language choices missing")
    require("coverage: Object.freeze({ en: 111, th: 111, ja: 111, es: 111, 'pt-BR': 111 })" in launch,
            "B76 core locale coverage contract missing")

    localized_adapters = (
        "android-advanced-media.js", "android-archives.js", "android-billing.js", "android-cleanup.js",
        "android-custom-scan.js", "android-downloads.js", "android-duplicates.js", "android-empty-folders.js",
        "android-hidden-items.js", "android-insights.js", "android-installers.js", "android-large-files.js",
        "android-live-scan.js", "android-native.js", "android-older-files.js", "android-plan-status.js",
        "android-pro-ui.js", "android-review-media.js", "android-scan-trust.js", "android-settings-detail.js",
        "android-shell-ux.js", "android-support.js", "android-zero.js",
    )
    for adapter in localized_adapters:
        source = read(f"app/src/main/legacy-adapter/{adapter}")
        require('"es"' in source and '"pt-BR"' in source, f"B76 ES/PT-BR copy missing: {adapter}")
        require('PromptPay' not in source and 'promptpay' not in source.lower(),
                f"retired PromptPay residue remains in localized runtime: {adapter}")

    share_card = read("app/src/main/legacy-adapter/android-share-card.js")
    require("language.startsWith('es')" in share_card and "pt-BR" in share_card,
            "B76 result share card is not localized for ES/PT-BR")


def check_manifest_privacy_boundary() -> None:
    manifest = read("app/src/main/AndroidManifest.xml")
    require('android:allowBackup="false"' in manifest, "allowBackup must remain false")
    require('android:usesCleartextTraffic="false"' in manifest, "cleartext traffic must remain disabled")
    require('android.permission.MANAGE_EXTERNAL_STORAGE' in manifest, "broad storage permission unexpectedly removed")
    require('QUERY_ALL_PACKAGES' not in manifest, "broad package visibility permission must not be added")


def check_ci_contract() -> None:
    workflow = read(".github/workflows/android-debug-apk.yml")
    verify_pos = workflow.find("python3 scripts/verify_runtime_contracts.py")
    build_pos = workflow.find(":app:assembleDebug")
    require(verify_pos >= 0, "CI does not run runtime contract verification")
    require(build_pos > verify_pos, "runtime contracts must be checked before APK assembly")
    require("contents: read" in workflow, "debug CI permissions unexpectedly broadened")


def main() -> None:
    global PARTIAL_STAGING
    parser = argparse.ArgumentParser(description="Verify Bearagnostic Android runtime contracts")
    parser.add_argument(
        "--partial-staging",
        action="store_true",
        help="Allow unchanged files omitted from a local handoff staging tree. CI must not use this flag.",
    )
    args = parser.parse_args()
    PARTIAL_STAGING = args.partial_staging

    checks = (
        check_build_contracts,
        check_scanner_truth_and_delete_safety,
        check_bridge_and_support_boundary,
        check_localization_contract,
        check_manifest_privacy_boundary,
        check_ci_contract,
    )
    for check in checks:
        check()
        print(f"PASS {check.__name__}")
    print("PASS runtime contracts" + (" (partial staging)" if PARTIAL_STAGING else ""))


if __name__ == "__main__":
    main()
