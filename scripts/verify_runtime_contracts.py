#!/usr/bin/env python3
"""Deterministic source-level safety checks for Bearagnostic runtime contracts.

This is intentionally narrow. It does not claim runtime/device coverage; it prevents
known high-risk invariants from silently disappearing during future edits.
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
    require('versionCode = 34' in gradle, "B34 versionCode must be 34")
    require('versionName = "0.25.2-alpha34"' in gradle, "B34 versionName mismatch")

    cache_versions = re.findall(r'android-[a-z-]+\.js\?v=(\d+)', gradle)
    require(cache_versions, "no Android adapter cache versions found")
    require(set(cache_versions) == {"34"}, f"adapter cache versions are not coherent: {sorted(set(cache_versions))}")
    require("androidBuildTruth" in gradle, "build-truth adapter is not registered")
    require('android-build-truth.js?v=34' in gradle, "build-truth adapter is not loaded at B34")


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
    require("const val BRIDGE_VERSION = 11" in bridge, "bridge version must advance for B34")

    require("const val REVIEW_SNAPSHOT_MAX_AGE_MS = 15L * 60L * 1000L" in guard, "15-minute native review age limit changed")
    for mode in ("smart", "quick", "deep", "custom"):
        require(f'"{mode}"' in guard, f"allowed scan mode missing: {mode}")
    for scope in ("downloads", "photos", "videos", "documents", "music"):
        require(f'"{scope}"' in guard, f"allowed Custom scope missing: {scope}")
    require('reason = "no_custom_scope_selected"' in guard, "empty Custom selection is not rejected")
    require('reason = "invalid_custom_scope"' in guard, "invalid Custom scope is not rejected")
    require("nowMs < generatedAtMs" in guard, "future/clock-skewed review timestamps are not rejected conservatively")


def check_build_truth_contract() -> None:
    js = read("app/src/main/legacy-adapter/android-build-truth.js")
    require("NATIVE.getNativeState" in js, "visible build labels are not sourced from native state")
    require("state.versionName" in js and "state.versionCode" in js, "native build version/code are not consumed")
    require(".app-footer__build" in js, "footer build label is not synchronized")
    require("__buildTruthWrapped" in js, "native callback synchronization guard is missing")
    # This module must not introduce a new hard-coded product version/build label.
    require(not re.search(r'v0\.\d+\.\d+\s*·\s*B\d+', js), "build-truth adapter contains a hard-coded visible build label")


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
        ("native-sourced visible build labels", check_build_truth_contract),
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
