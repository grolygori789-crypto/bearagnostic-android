#!/usr/bin/env python3
"""Deterministic source-level safety checks for Bearagnostic runtime contracts.

This suite is intentionally narrow and truthful. It does not claim runtime/device
coverage; it prevents known high-risk invariants from silently disappearing.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


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
    require('versionCode = 37' in gradle, "B37 versionCode must be 37")
    require('versionName = "0.27.0-alpha37"' in gradle, "B37 versionName mismatch")

    cache_versions = re.findall(r'android-[a-z-]+\.js\?v=(\d+)', gradle)
    require(cache_versions, "no Android adapter cache versions found")
    require(set(cache_versions) == {"37"}, f"adapter cache versions are not coherent: {sorted(set(cache_versions))}")

    require("androidDownloads" in gradle, "Downloads Review adapter is not registered")
    require("androidInstallers" in gradle, "APK Installers adapter is not registered")
    require('android-downloads.js?v=37' in gradle, "Downloads Review adapter is not loaded at B37")
    require('android-installers.js?v=37' in gradle, "APK Installers adapter is not loaded at B37")
    require('android-build-truth.js?v=37' in gradle, "build-truth adapter is not loaded at B37")

    downloads_pos = gradle.find('android-downloads.js?v=37')
    installers_pos = gradle.find('android-installers.js?v=37')
    native_pos = gradle.find('android-native.js?v=37')
    truth_pos = gradle.find('android-build-truth.js?v=37')
    require(0 <= downloads_pos < installers_pos < native_pos < truth_pos, "adapter ownership/load order is unsafe for APK Installers")


def check_native_guard_contracts() -> None:
    bridge = read("app/src/main/java/com/benedictinteractive/bearagnostic/NativeBridge.kt")
    guard = read("app/src/main/java/com/benedictinteractive/bearagnostic/RuntimeContractGuard.kt")

    require("RuntimeContractGuard.normalizeScanMode(mode)" in bridge, "scan mode is not validated at native bridge")
    require('return rejected("invalid_scan_mode")' in bridge, "invalid scan mode is not rejected")
    require("RuntimeContractGuard.validateCustomScopes(customScopesJson)" in bridge, "Custom scopes are not validated")
    require("RuntimeContractGuard.hasAccessibleCustomTarget(activity, scopeDecision.scopes)" in bridge, "Custom target existence is not validated")
    require('return rejected("no_matching_scan_locations")' in bridge, "missing Custom targets are not rejected")
    require("JSONArray(scopeDecision.scopes.toList()).toString()" in bridge, "Custom scopes are not canonicalized before scanning")
    require("RuntimeContractGuard.isReviewSnapshotFresh(generatedAtMs)" in bridge, "native stale-review guard is missing")
    require('put("reason", "stale_review_snapshot")' in bridge, "native stale-review rejection reason is missing")
    require("const val BRIDGE_VERSION = 11" in bridge, "B37 must preserve NativeBridge v11 contract")

    require("const val REVIEW_SNAPSHOT_MAX_AGE_MS = 15L * 60L * 1000L" in guard, "15-minute native review age limit changed")
    for mode in ("smart", "quick", "deep", "custom"):
        require(f'"{mode}"' in guard, f"allowed scan mode missing: {mode}")
    for scope in ("downloads", "photos", "videos", "documents", "music"):
        require(f'"{scope}"' in guard, f"allowed Custom scope missing: {scope}")
    require('reason = "no_custom_scope_selected"' in guard, "empty Custom selection is not rejected")
    require('reason = "invalid_custom_scope"' in guard, "invalid Custom scope is not rejected")
    require("nowMs < generatedAtMs" in guard, "future/clock-skewed review timestamps are not rejected conservatively")


def check_downloads_review_contracts() -> None:
    scanner = read("app/src/main/java/com/benedictinteractive/bearagnostic/FileHealthScanner.kt")
    ui = read("app/src/main/legacy-adapter/android-downloads.js")

    require("const val ANALYSIS_RULES_VERSION = 8" in scanner, "Downloads review analysis rules must remain v8")
    require('"downloads" -> "downloads" in candidate.categories' in scanner, "Downloads review category matcher is missing")
    require('"archives", "zero", "downloads"' in scanner, "Downloads aggregate is missing from review summary")
    require('reviewCandidates, file, size, "downloads", 2, 0' in scanner, "Downloads files are not surfaced as Review First candidates")
    require('suggestedSelected = false, autoCleanEligible = false' in scanner, "Downloads candidates must never be auto-selected or auto-cleaned")
    require('reasonCode = "download_location"' in scanner, "Downloads candidates need an explicit location-only reason")

    require("const BUILD = 36;" in ui, "Downloads adapter source marker unexpectedly changed")
    require("const CATEGORY = 'downloads';" in ui, "Downloads adapter category mismatch")
    require("const MAX_DELETE_SELECTION = 500;" in ui, "Downloads UI deletion cap changed")
    require("const STALE_REVIEW_MS = 15 * 60 * 1000;" in ui, "Downloads UI stale-review guard changed")
    require("HIDDEN.filter" in ui, "Downloads review does not honor Hidden Items privacy")
    require("NATIVE.deleteReviewCandidates" in ui, "Downloads deletion is not routed through native verified deletion")


def check_apk_installers_contracts(*, patch_only: bool = False) -> None:
    ui = read("app/src/main/legacy-adapter/android-installers.js")
    provider = read("app/src/main/java/com/benedictinteractive/bearagnostic/ReviewMediaProvider.kt")
    scanner = read("app/src/main/java/com/benedictinteractive/bearagnostic/FileHealthScanner.kt", required=not patch_only)
    manifest = read("app/src/main/AndroidManifest.xml", required=not patch_only)

    if scanner:
        require('if (ext == "apk") addReviewCandidate(review, file, size, "installers", 2, 62, false, false, "apk_installer"' in scanner,
                "APK installers are no longer surfaced as Review First candidates")
        require('"installers" -> "installers" in candidate.categories' in scanner, "APK installer category matcher is missing")
        require('"temporary", "installers", "archives"' in scanner, "APK installer aggregate is missing from review summary")
        require("const val ANALYSIS_RULES_VERSION = 8" in scanner, "B37 must not silently alter scan classification rules")

    require("const BUILD = 37;" in ui, "APK Installers adapter build marker mismatch")
    require("const CATEGORY = 'installers';" in ui, "APK Installers category mismatch")
    require("const REVIEW_PAGE_SIZE = 250;" in ui, "APK Installers review page size contract changed")
    require("const MAX_DELETE_SELECTION = 500;" in ui, "APK Installers UI deletion cap changed")
    require("const STALE_REVIEW_MS = 15 * 60 * 1000;" in ui, "APK Installers UI stale-review guard changed")
    require("HIDDEN.filter" in ui, "APK Installers does not honor Hidden Items privacy")
    require("NATIVE.getReviewCandidates?.(CATEGORY, offset, REVIEW_PAGE_SIZE)" in ui, "APK Installers is not reading native review candidates")
    require("NATIVE.requestReviewMedia?.(item.id, 'compact', requestId)" in ui, "APK metadata is not requested through the authorized review-ID bridge")
    require("NATIVE.startScan?.('quick', '[]', false)" in ui, "APK Installers refresh must use the Free metadata-only Quick Scan")
    require("NATIVE.deleteReviewCandidates" in ui, "APK Installer deletion is not routed through native verified deletion")
    require('data-tool="installers"' in ui, "APK Installers first-class Tools entry is missing")
    require("ba-tools-expandable" in ui and "overflow-y:auto" in ui, "Tools screen growth is not handled by natural scrolling")
    require("does not uninstall" in ui, "APK deletion/uninstall distinction is missing")
    require("จะไม่เลือกไฟล์ APK ให้ลบอัตโนมัติ" in ui, "Thai no-auto-selection disclosure is missing")
    require("package visibility" in ui.lower(), "package visibility limitation is not disclosed")
    for status in (
        "older_installer", "same_version_installed", "newer_installer", "installed_confirmed",
        "installed_unverified_identity", "identity_mismatch", "not_installed", "not_confirmed",
        "metadata_unavailable",
    ):
        require(status in ui, f"APK UI status missing: {status}")

    require('json.put("installStatus", "metadata_unavailable")' in provider, "APK metadata failure is not represented conservatively")
    require('json.put("packageVisibilityLimited", visibilityLimited)' in provider, "APK package-visibility evidence is missing")
    require('if (visibilityLimited) "not_confirmed" else "not_installed"' in provider, "APK package visibility is not handled conservatively")
    require('"identity_mismatch"' in provider, "APK signing-identity mismatch state is missing")
    require('"installed_unverified_identity"' in provider, "APK unverified signing state is missing")
    require('"older_installer"' in provider and '"same_version_installed"' in provider and '"newer_installer"' in provider,
            "APK installed-version comparison states are incomplete")
    require("PackageManager.GET_SIGNING_CERTIFICATES" in provider, "modern APK signing identity is not inspected")
    require("PackageManager.GET_SIGNATURES" in provider, "legacy APK signing identity fallback is missing")
    require('MessageDigest.getInstance("SHA-256")' in provider, "APK signing identity comparison is not digest-backed")
    require('json.put("archiveSigningAvailable", true)' in provider, "APK signing availability evidence is missing")
    # The digest is computed only for equality and never serialized. Reject common digest-key names.
    require('"signingDigest"' not in provider and '"signatureDigest"' not in provider and '"sha256"' not in provider.lower().replace('messageDigest.getInstance("SHA-256")'.lower(), ''),
            "raw signing digest appears to be exposed")

    if manifest:
        require("QUERY_ALL_PACKAGES" not in manifest, "B37 must not add broad package visibility permission")


def check_build_truth_contract() -> None:
    js = read("app/src/main/legacy-adapter/android-build-truth.js")
    require("NATIVE.getNativeState" in js, "visible build labels are not sourced from native state")
    require("state.versionName" in js and "state.versionCode" in js, "native build version/code are not consumed")
    require(".app-footer__build" in js, "footer build label is not synchronized")
    require("__buildTruthWrapped" in js, "native callback synchronization guard is missing")
    require(not re.search(r'v0\.\d+\.\d+\s*·\s*B\d+', js), "build-truth adapter contains a hard-coded visible build label")


def check_ci_contract() -> None:
    workflow = read(".github/workflows/android-debug-apk.yml")
    verify_pos = workflow.find("python3 scripts/verify_runtime_contracts.py")
    build_pos = workflow.find(":app:assembleDebug")
    require(verify_pos >= 0, "CI does not run runtime contract verification")
    require(build_pos > verify_pos, "runtime contracts must be checked before APK assembly")


def check_existing_destructive_invariants(*, patch_only: bool) -> None:
    scanner_path = "app/src/main/java/com/benedictinteractive/bearagnostic/FileHealthScanner.kt"
    scanner = read(scanner_path, required=not patch_only)
    if not scanner:
        return

    require("MAX_DELETE_SELECTION = 500" in scanner, "native deletion cap is no longer 500")
    require("existing.all { it.id in ids }" in scanner, "duplicate keep-one group protection is missing")
    require("ids.remove(keep.id)" in scanner, "duplicate keeper is not removed from deletion selection")
    require("file.delete() && !file.exists()" in scanner, "deletion is not verified by absence")

    delete_pos = scanner.find("if (deleted) {")
    reclaim_pos = scanner.find("reclaimedBytes = safeAdd(reclaimedBytes, before)")
    require(delete_pos >= 0 and reclaim_pos > delete_pos, "reclaimed bytes are not gated by verified deletion")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--patch-only", action="store_true", help="Run checks possible from the repo-relative patch package only.")
    args = parser.parse_args()

    if args.patch_only:
        checks = [
            ("build/version/cache", check_build_contracts),
            ("APK Installers contracts", lambda: check_apk_installers_contracts(patch_only=True)),
            ("CI contract verification", check_ci_contract),
        ]
    else:
        checks = [
            ("build/version/cache", check_build_contracts),
            ("native request/deletion guards", check_native_guard_contracts),
            ("Downloads Review contracts", check_downloads_review_contracts),
            ("APK Installers contracts", lambda: check_apk_installers_contracts(patch_only=False)),
            ("native-sourced visible build labels", check_build_truth_contract),
            ("CI contract verification", check_ci_contract),
        ]

    try:
        for label, check in checks:
            check()
            print(f"PASS: {label}")
        check_existing_destructive_invariants(patch_only=args.patch_only)
        print("PASS: existing destructive invariants" + (" (deferred to full CI)" if args.patch_only else ""))
    except AssertionError as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1

    print("Bearagnostic runtime contract verification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
