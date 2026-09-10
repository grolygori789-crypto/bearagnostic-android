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
    require('versionCode = 35' in gradle, "B35 versionCode must be 35")
    require('versionName = "0.26.0-alpha35"' in gradle, "B35 versionName mismatch")

    cache_versions = re.findall(r'android-[a-z-]+\.js\?v=(\d+)', gradle)
    require(cache_versions, "no Android adapter cache versions found")
    require(set(cache_versions) == {"35"}, f"adapter cache versions are not coherent: {sorted(set(cache_versions))}")

    require("androidDownloads" in gradle, "Downloads Review adapter is not registered")
    require('android-downloads.js?v=35' in gradle, "Downloads Review adapter is not loaded at B35")
    require('android-build-truth.js?v=35' in gradle, "build-truth adapter is not loaded at B35")

    downloads_pos = gradle.find('android-downloads.js?v=35')
    native_pos = gradle.find('android-native.js?v=35')
    truth_pos = gradle.find('android-build-truth.js?v=35')
    require(0 <= downloads_pos < native_pos < truth_pos, "adapter ownership/load order is unsafe for Downloads Review")


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
    require("const val BRIDGE_VERSION = 11" in bridge, "B35 must preserve NativeBridge v11 contract")

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

    require("const val ANALYSIS_RULES_VERSION = 8" in scanner, "Downloads review must advance analysis rules to v8")
    require('"downloads" -> "downloads" in candidate.categories' in scanner, "Downloads review category matcher is missing")
    require('"archives", "zero", "downloads"' in scanner, "Downloads aggregate is missing from review summary")
    require('reviewCandidates, file, size, "downloads", 2, 0' in scanner, "Downloads files are not surfaced as Review First candidates")
    require('suggestedSelected = false, autoCleanEligible = false' in scanner, "Downloads candidates must never be auto-selected or auto-cleaned")
    require('reasonCode = "download_location"' in scanner, "Downloads candidates need an explicit location-only reason")

    old_pos = scanner.find('emit(listener, request, plan, "modified_dates", counters, phaseProcessed = processed, phaseTotal = counters.discoveredFiles)')
    downloads_pos = scanner.find('// Phase A — Downloads Review.')
    snapshot_pos = scanner.find('reviewSnapshot = reviewCandidates.snapshot(request.mode)', downloads_pos)
    require(0 <= old_pos < downloads_pos < snapshot_pos, "Downloads candidates must be appended after established review categories")
    require('emit(\n                        listener, request, plan, "finalizing", counters,' in scanner, "Downloads review pass must report real finalizing work")

    require("const BUILD = 35;" in ui, "Downloads adapter build marker mismatch")
    require("const CATEGORY = 'downloads';" in ui, "Downloads adapter category mismatch")
    require("const REVIEW_PAGE_SIZE = 250;" in ui, "Downloads review page size contract changed")
    require("const RENDER_BATCH = 80;" in ui, "Downloads DOM rendering must remain bounded")
    require("const MAX_DELETE_SELECTION = 500;" in ui, "Downloads UI deletion cap changed")
    require("const STALE_REVIEW_MS = 15 * 60 * 1000;" in ui, "Downloads UI stale-review guard changed")
    require("HIDDEN.filter" in ui, "Downloads review does not honor Hidden Items privacy")
    require("NATIVE.getReviewCandidates?.(CATEGORY, offset, REVIEW_PAGE_SIZE)" in ui, "Downloads review is not reading native review candidates")
    require("NATIVE.startScan?.('quick', '[]', false)" in ui, "Downloads refresh must use the Free metadata-only Quick Scan")
    require("NATIVE.deleteReviewCandidates" in ui, "Downloads deletion is not routed through native verified deletion")
    require("data-tool=\"downloads\"" in ui, "Downloads first-class Tools entry is missing")
    require("Nothing in Downloads is selected automatically." in ui, "English review-first disclosure is missing")
    require("จะไม่เลือกไฟล์ใน Downloads ให้ลบอัตโนมัติ" in ui, "Thai review-first disclosure is missing")


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
    parser.add_argument("--patch-only", action="store_true", help="Skip checks that require unchanged production files.")
    args = parser.parse_args()

    checks = [
        ("build/version/cache", check_build_contracts),
        ("native request/deletion guards", check_native_guard_contracts),
        ("Downloads Review contracts", check_downloads_review_contracts),
        ("native-sourced visible build labels", check_build_truth_contract),
        ("CI contract verification", check_ci_contract),
    ]

    try:
        for label, check in checks:
            check()
            print(f"PASS: {label}")
        check_existing_destructive_invariants(patch_only=args.patch_only)
        print("PASS: existing destructive invariants" + (" (deferred to CI)" if args.patch_only else ""))
    except AssertionError as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1

    print("Bearagnostic runtime contract verification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
