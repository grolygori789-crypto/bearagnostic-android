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
    require('versionCode = 43' in gradle, "B43 versionCode must be 43")
    require('versionName = "0.32.0-alpha43"' in gradle, "B43 versionName mismatch")

    cache_versions = re.findall(r'android-[a-z-]+\.js\?v=(\d+)', gradle)
    require(cache_versions, "no Android adapter cache versions found")
    require(set(cache_versions) == {"43"}, f"adapter cache versions are not coherent: {sorted(set(cache_versions))}")

    require("androidDownloads" in gradle, "Downloads Review adapter is not registered")
    require("androidInstallers" in gradle, "APK Installers adapter is not registered")
    require("androidArchives" in gradle, "Archives adapter is not registered")
    require("androidZero" in gradle, "Zero-byte Files adapter is not registered")
    require("androidEmptyFolders" in gradle, "Empty Folders adapter is not registered")
    require("androidAdvancedMedia" in gradle, "Advanced Media Review adapter is not registered")
    require("androidInsights" in gradle, "Insights adapter is not registered")
    require("androidShellUx" in gradle, "Shell UX adapter is not registered")
    require('android-downloads.js?v=43' in gradle, "Downloads Review adapter is not loaded at B43")
    require('android-installers.js?v=43' in gradle, "APK Installers adapter is not loaded at B43")
    require('android-archives.js?v=43' in gradle, "Archives adapter is not loaded at B43")
    require('android-zero.js?v=43' in gradle, "Zero-byte Files adapter is not loaded at B43")
    require('android-empty-folders.js?v=43' in gradle, "Empty Folders adapter is not loaded at B43")
    require('android-advanced-media.js?v=43' in gradle, "Advanced Media Review adapter is not loaded at B43")
    require('android-insights.js?v=43' in gradle, "Insights adapter is not loaded at B43")
    require('android-shell-ux.js?v=43' in gradle, "Shell UX adapter is not loaded at B43")
    require('android-build-truth.js?v=43' in gradle, "build-truth adapter is not loaded at B43")

    downloads_pos = gradle.find('android-downloads.js?v=43')
    installers_pos = gradle.find('android-installers.js?v=43')
    archives_pos = gradle.find('android-archives.js?v=43')
    zero_pos = gradle.find('android-zero.js?v=43')
    empty_pos = gradle.find('android-empty-folders.js?v=43')
    media_pos = gradle.find('android-advanced-media.js?v=43')
    native_pos = gradle.find('android-native.js?v=43')
    custom_pos = gradle.find('android-custom-scan.js?v=43')
    insights_pos = gradle.find('android-insights.js?v=43')
    shell_pos = gradle.find('android-shell-ux.js?v=43')
    truth_pos = gradle.find('android-build-truth.js?v=43')
    require(0 <= downloads_pos < installers_pos < archives_pos < zero_pos < empty_pos < media_pos < native_pos < custom_pos < insights_pos < shell_pos < truth_pos,
            "adapter ownership/load order is unsafe for B43 Phase A / Advanced Media / Insights / shell UX")



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
    require("const val BRIDGE_VERSION = 13" in bridge, "B42 NativeBridge version must be 13")

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


def check_archives_contracts(*, patch_only: bool = False) -> None:
    ui = read("app/src/main/legacy-adapter/android-archives.js")
    scanner = read("app/src/main/java/com/benedictinteractive/bearagnostic/FileHealthScanner.kt", required=not patch_only)

    if scanner:
        require('if (ext in ARCHIVE_EXTENSIONS) addReviewCandidate(review, file, size, "archives", 2, 20, false, false, "archive_file"' in scanner,
                "Archives are no longer surfaced as Review First candidates")
        require('"archives" -> "archives" in candidate.categories' in scanner, "Archives category matcher is missing")
        require('"temporary", "installers", "archives"' in scanner, "Archives aggregate is missing from review summary")
        require("const val ANALYSIS_RULES_VERSION = 8" in scanner, "B38 must not silently alter scan classification rules")

    require("const BUILD = 38;" in ui, "Archives adapter build marker mismatch")
    require("const CATEGORY = 'archives';" in ui, "Archives category mismatch")
    require("const REVIEW_PAGE_SIZE = 250;" in ui, "Archives review page size contract changed")
    require("const MAX_DELETE_SELECTION = 500;" in ui, "Archives UI deletion cap changed")
    require("const STALE_REVIEW_MS = 15 * 60 * 1000;" in ui, "Archives UI stale-review guard changed")
    require("HIDDEN.filter" in ui, "Archives does not honor Hidden Items privacy")
    require("NATIVE.getReviewCandidates?.(CATEGORY, offset, REVIEW_PAGE_SIZE)" in ui, "Archives is not reading native review candidates")
    require("NATIVE.startScan?.('quick', '[]', false)" in ui, "Archives refresh must use the Free metadata-only Quick Scan")
    require("NATIVE.deleteReviewCandidates" in ui, "Archive deletion is not routed through native verified deletion")
    require('data-tool="archives"' in ui, "Archives first-class Tools entry is missing")
    require("ba-tools-expandable" in ui and "overflow-y:auto" in ui, "Tools screen growth is not handled by natural scrolling")
    require("archiveFormat(item)" in ui, "Archive type classification is missing")
    for ext in ("zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"):
        require(f"'{ext}'" in ui, f"Archive format support missing: {ext}")
    require("Nothing here is selected automatically." in ui, "English no-auto-selection disclosure is missing")
    require("จะไม่เลือกไฟล์เหล่านี้ให้ลบอัตโนมัติ" in ui, "Thai no-auto-selection disclosure is missing")
    require("自動選択は行いません" in ui, "Japanese no-auto-selection disclosure is missing")
    require("An archive can be the only copy" in ui, "Archive backup-risk explanation is missing")
    require("does not inspect or assume the contents are replaceable" in ui, "Archive deletion uncertainty disclosure is missing")
    require("anchor = list.querySelector('[data-tool=\"installers\"]')" in ui, "Archives is not positioned after APK Installers")


def check_zero_byte_contracts() -> None:
    ui = read("app/src/main/legacy-adapter/android-zero.js")

    require("const BUILD = 39;" in ui, "Zero-byte Files adapter build marker mismatch")
    require("const CATEGORY = 'zero';" in ui, "Zero-byte Files category mismatch")
    require("const REVIEW_PAGE_SIZE = 250;" in ui, "Zero-byte Files review page size contract changed")
    require("const MAX_DELETE_SELECTION = 500;" in ui, "Zero-byte Files UI deletion cap changed")
    require("const STALE_REVIEW_MS = 15 * 60 * 1000;" in ui, "Zero-byte Files UI stale-review guard changed")
    require("HIDDEN.filter" in ui, "Zero-byte Files does not honor Hidden Items privacy")
    require("NATIVE.getReviewCandidates?.(CATEGORY, offset, REVIEW_PAGE_SIZE)" in ui, "Zero-byte Files is not reading native review candidates")
    require("NATIVE.startScan?.('quick', '[]', false)" in ui, "Zero-byte Files refresh must use the Free metadata-only Quick Scan")
    require("NATIVE.deleteReviewCandidates" in ui, "Zero-byte Files deletion is not routed through native verified deletion")
    require('data-tool="zero"' in ui, "Zero-byte Files first-class Tools entry is missing")
    require("ba-tools-expandable" in ui and "overflow-y:auto" in ui, "Tools screen growth is not handled by natural scrolling")
    require("zeroKind(item)" in ui, "Zero-byte file type classification is missing")
    require("Nothing here is selected automatically." in ui, "English no-auto-selection disclosure is missing for Zero-byte Files")
    require("จะไม่เลือกไฟล์เหล่านี้ให้ลบอัตโนมัติ" in ui, "Thai no-auto-selection disclosure is missing for Zero-byte Files")
    require("自動選択は行いません" in ui, "Japanese no-auto-selection disclosure is missing for Zero-byte Files")
    require("0 B" in ui, "Zero-byte rationale is missing")
    require("does not assume every 0 B file is disposable" in ui, "Zero-byte deletion uncertainty disclosure is missing")
    require("anchor = list.querySelector('[data-tool=\"archives\"]')" in ui, "Zero-byte Files is not positioned after Archives")



def check_empty_folder_contracts() -> None:
    manager = read("app/src/main/java/com/benedictinteractive/bearagnostic/EmptyFolderManager.kt")
    bridge = read("app/src/main/java/com/benedictinteractive/bearagnostic/NativeBridge.kt")
    ui = read("app/src/main/legacy-adapter/android-empty-folders.js")

    require("class EmptyFolderManager" in manager, "dedicated Empty Folders native manager is missing")
    require("const val MAX_DELETE_SELECTION = 100" in manager, "Empty Folders deletion cap must remain 100")
    require("const val MAX_CANDIDATES = 2_000" in manager, "Empty Folders candidate bound changed")
    require("RuntimeContractGuard.isReviewSnapshotFresh(current.generatedAtMs)" in manager,
            "Empty Folders native stale-snapshot guard is missing")
    require("Files.isSymbolicLink(file.toPath())" in manager, "Empty Folders does not conservatively reject symbolic links")
    require("snapshotPathIsLink = isSymbolicLink(snapshotPath)" in manager and "isSymbolicLink(snapshotPath)" in manager,
            "Empty Folders does not re-check the original snapshot path against symlink replacement")
    require("if (relativeSegments.size < 2) return false" in manager,
            "shared-storage root/top-level Empty Folder deletion protection is missing")
    require('lower.firstOrNull() == "android"' in manager and 'lower.firstOrNull() == "lost.dir"' in manager,
            "Android/LOST.DIR directory protection is missing")
    require("relativeSegments.any { it.startsWith('.') }" in manager,
            "hidden/control directory protection is missing")
    list_pos = manager.find("val children = try { snapshotPath.listFiles() }")
    nonempty_pos = manager.find('children.isNotEmpty() -> "folder_not_empty"', list_pos)
    delete_pos = manager.find("snapshotPath.delete() && !snapshotPath.exists()", nonempty_pos)
    require(0 <= list_pos < nonempty_pos < delete_pos,
            "Empty Folders must re-check emptiness immediately before verified deletion")
    require('put("becameNonEmptyCount", becameNonEmptyCount)' in manager,
            "became-non-empty refusal evidence is not reported")
    require('put("reclaimedBytes"' not in manager,
            "Empty Folders must not fabricate reclaimed-space bytes")

    require("private val emptyFolders = EmptyFolderManager" in bridge, "NativeBridge does not own EmptyFolderManager")
    for fn in ("startEmptyFolderScan", "getEmptyFolderSummary", "getEmptyFolderCandidates", "deleteEmptyFolderCandidates"):
        require(f"fun {fn}" in bridge, f"NativeBridge missing Empty Folders API: {fn}")
    require('return rejected("storage_access_required")' in bridge, "Empty Folders does not require storage access")
    require('if (activity.isScannerRunning()) return rejected("scan_running")' in bridge,
            "Empty Folders does not refuse destructive/workflow overlap with the file scanner")
    require("const val BRIDGE_VERSION = 13" in bridge, "B42 bridge version mismatch")

    require("const BUILD = 40;" in ui, "Empty Folders adapter build marker mismatch")
    require("const MAX_SELECTION = 100;" in ui, "Empty Folders UI deletion cap changed")
    require("const STALE_MS = 15 * 60 * 1000;" in ui, "Empty Folders UI stale-review guard changed")
    require("NATIVE.startEmptyFolderScan" in ui, "Empty Folders UI does not use dedicated native scan")
    require("NATIVE.getEmptyFolderSummary" in ui and "NATIVE.getEmptyFolderCandidates" in ui,
            "Empty Folders UI does not read dedicated native evidence")
    require("NATIVE.deleteEmptyFolderCandidates" in ui, "Empty Folders deletion bypasses dedicated native verification")
    require('data-tool="empty-folders"' in ui, "Empty Folders first-class Tools entry is missing")
    require("[data-tool=\"zero\"]" in ui, "Empty Folders must be positioned after Zero-byte Files")
    require("Nothing is selected automatically" in ui, "English Empty Folders review-first disclosure is missing")
    require("ระบบจะไม่เลือกให้อัตโนมัติ" in ui, "Thai Empty Folders no-auto-selection disclosure is missing")
    require("自動選択せず" in ui, "Japanese Empty Folders no-auto-selection disclosure is missing")
    require("No reclaimed-space estimate" in ui, "Empty Folders no-space-claim disclosure is missing")
    require("If a file appears" in ui, "deletion-time non-empty refusal is not explained")


def check_shell_ux_contracts() -> None:
    ui = read("app/src/main/legacy-adapter/android-shell-ux.js")
    require("const BUILD = 41;" in ui, "Shell UX adapter B41 build marker mismatch")
    require("scrollHeight > element.clientHeight + OVERFLOW_EPSILON" in ui,
            "Scroll continuation cue is not conditioned on real overflow")
    require("scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - BOTTOM_EPSILON" in ui,
            "Scroll continuation cue does not disappear at the real bottom")
    require("bearagnostic.scrollCue.seen.v1" in ui and "localStorage.setItem" in ui,
            "one-time scroll micro-hint contract is missing")
    require("#nativeHomeButton{display:none!important}" in ui,
            "redundant Checkup header Home button is not suppressed")
    require("ba-checkup-root" in ui, "Checkup root shell state is missing")
    require(".app-shell.is-checkup.ba-checkup-root .bottom-nav{display:grid!important}" in ui,
            "Checkup root does not restore the primary bottom navigation")
    require("grid-template-rows:auto minmax(0,1fr) auto auto!important" in ui,
            "Checkup root shell does not reserve the normal footer row")
    require(".app-shell.is-checkup.ba-checkup-root .app-footer{display:flex!important}" in ui,
            "Checkup root does not restore the standard Benedict Interactive footer")
    require(".app-shell.is-checkup.ba-checkup-root .app-footer{display:none!important}" not in ui,
            "Checkup root still suppresses the standard footer")
    require("state === 'running'" in ui and "state === 'idle' || state === 'complete'" in ui,
            "Checkup bottom navigation is not limited to non-running root states")
    require("#nativeModeSheet:not([hidden])" in ui, "Checkup mode-picker focused state is not detected")
    require("button.dataset.nav === 'checkup'" in ui, "Checkup tab is not highlighted on its root landing")
    require(ui.count("new MutationObserver") == 1,
            "Shell UX must use one centralized MutationObserver, not per-surface observers")
    for surface in ("ba-qc-scroll", "ba-dup-scroll", "ba-large-scroll", "ba-old-scroll",
                    "baDownloadsSurface", "baInstallersSurface", "baArchivesSurface", "baZeroSurface", "baEmptySurface",
                    "nativeModeSheet", "nativeResultsSheet", "nativeReviewSheet"):
        require(surface in ui, f"Scroll continuation coverage missing for {surface}")

def check_insights_contracts() -> None:
    ui = read("app/src/main/legacy-adapter/android-insights.js")
    store = read("app/src/main/java/com/benedictinteractive/bearagnostic/LocalHistoryStore.kt")
    bridge = read("app/src/main/java/com/benedictinteractive/bearagnostic/NativeBridge.kt")
    entitlement = read("app/src/main/java/com/benedictinteractive/bearagnostic/EntitlementManager.kt")

    require("const BUILD = 42;" in ui, "Insights adapter build marker mismatch")
    require("NATIVE.getInsightsHistory" in ui, "Insights UI does not read native local history")
    require("NATIVE.recordInsightsScan" in ui, "completed scans are not captured into local history")
    require("NATIVE.clearInsightsHistory" in ui, "Insights does not expose a user-controlled history reset")
    require("__insightsHistoryWrapped" in ui and "onScanComplete(raw)" in ui,
            "Insights does not wrap the real scan-complete callback")
    require("scope === FULL_SCOPE" in ui and "coverageStatus === COMPLETE_COVERAGE" in ui,
            "What Changed is not limited to comparable complete full-scope scans")
    require("No invented score." in ui, "Insights truthfulness copy no longer rejects invented scoring")
    require("aggregate-only" in ui.lower() and "file names" in ui.lower() and "paths" in ui.lower(),
            "Insights privacy disclosure is incomplete")
    require("ba-insights-screen" in ui and "overflow-y:auto" in ui,
            "Insights screen is not a natural scrollable workspace")
    require("patchProSheet" in ui and "plannedInsights" in ui and "plannedCleanup" in ui,
            "Pro roadmap is not reconciled after Insights implementation")

    require("class LocalHistoryStore" in store, "native aggregate LocalHistoryStore is missing")
    require("AtomicFile" in store, "local history persistence is not atomic")
    require("MAX_SCAN_RECORDS = 30" in store, "scan-history bound changed")
    require("MAX_CLEANUP_RECORDS = 50" in store, "cleanup-history bound changed")
    require("aggregate-only" in store.lower(), "aggregate-only storage contract is undocumented")
    require('put("capturedAtMs"' in store and 'put("totalBytes"' in store and 'put("reviewedFiles"' in store,
            "scan aggregate evidence is incomplete")
    require('put("name"' not in store and 'put("path"' not in store and 'put("deletedIds"' not in store and 'put("fingerprint"' not in store,
            "local history must never persist file identity, deletion IDs, or synthetic fingerprints")
    require('history_write_failed' in store and 'private fun saveRoot(root: JSONObject): Boolean' in store,
            "local history must report persistence failures truthfully")
    require("recordFileCleanup" in store and "recordEmptyFolderCleanup" in store,
            "verified cleanup history is incomplete")
    require("FULL_SCOPE = \"accessible_shared_storage\"" in store and 'put("comparable", scan.optString("scope") == FULL_SCOPE)' in store,
            "history does not distinguish full-scope comparable scans")

    require("private val history = LocalHistoryStore" in bridge, "NativeBridge does not own local history")
    require("fun recordInsightsScan" in bridge and "history.recordScan(scanJson, activity.storageSnapshotJson())" in bridge,
            "NativeBridge scan-history capture is missing")
    require("fun getInsightsHistory" in bridge and "history.historyJson(entitlement)" in bridge,
            "NativeBridge Insights history API is missing")
    require("history.recordFileCleanup(result)" in bridge and "history.recordEmptyFolderCleanup(result)" in bridge,
            "native verified deletions are not recorded in history")
    require("try { history.recordFileCleanup(result) }" in bridge and "try { history.recordEmptyFolderCleanup(result) }" in bridge,
            "history logging must never be able to block a verified deletion result")
    require("fun clearInsightsHistory" in bridge, "native history clear API is missing")
    require("const val BRIDGE_VERSION = 13" in bridge, "B42 bridge version mismatch")

    for capability in ("INSIGHTS_HISTORY", "WHAT_CHANGED", "FULL_CLEANUP_HISTORY"):
        require(f"Capability.{capability}.wireName" in entitlement,
                f"implemented Pro Insights capability missing: {capability}")
    implemented_block = entitlement.split('put("implementedProCapabilities"', 1)[1].split('put("plannedProCapabilities"', 1)[0]
    planned_block = entitlement.split('put("plannedProCapabilities"', 1)[1].split(')', 1)[0]
    for capability in ("INSIGHTS_HISTORY", "WHAT_CHANGED", "FULL_CLEANUP_HISTORY"):
        require(f"Capability.{capability}.wireName" in implemented_block,
                f"{capability} is not marked implemented")
        require(f"Capability.{capability}.wireName" not in planned_block,
                f"{capability} is still marked planned after implementation")


def check_advanced_media_contracts() -> None:
    ui = read("app/src/main/legacy-adapter/android-advanced-media.js")
    entitlement = read("app/src/main/java/com/benedictinteractive/bearagnostic/EntitlementManager.kt")

    require("const BUILD = 43;" in ui, "Advanced Media Review build marker mismatch")
    require("const CAPABILITY = 'advanced_media_review';" in ui, "Advanced Media Review capability mismatch")
    require("const CATEGORY = 'all';" in ui, "Advanced Media Review must use the existing bounded review snapshot")
    require("const MAX_DELETE_SELECTION = 500;" in ui, "Advanced Media Review deletion cap changed")
    require("const STALE_REVIEW_MS = 15 * 60 * 1000;" in ui, "Advanced Media Review stale-review guard changed")
    require("ENT.can?.(CAPABILITY)" in ui, "Advanced Media Review is not entitlement-gated")
    require("ENT.requestPro?.('advanced_media_review',CAPABILITY)" in ui, "Free state does not route Advanced Media Review to Pro")
    require("NATIVE.getReviewSummary" in ui, "Advanced Media Review does not read review snapshot evidence")
    require("NATIVE.getReviewCandidates?.(CATEGORY,offset,PAGE_SIZE)" in ui, "Advanced Media Review bypasses existing review candidates")
    require("NATIVE.startScan?.('quick','[]',false)" in ui, "Advanced Media Review refresh must use truthful Quick Scan")
    require("NATIVE.requestReviewMedia?.(id,'preview',token)" in ui, "Advanced Media Review does not use authorized local preview IDs")
    require("NATIVE.deleteReviewCandidates" in ui, "Advanced Media Review deletion bypasses native verified deletion")
    require("HIDDEN?.filter" in ui, "Advanced Media Review does not honor Hidden Items privacy")
    require('data-tool="advanced-media"' in ui, "Advanced Media Review first-class Tools entry is missing")
    require("[data-tool=\"empty-folders\"]" in ui, "Advanced Media Review is not positioned after Empty Folders")
    require("This is not a full gallery" in ui, "Advanced Media Review overstates gallery coverage")
    require("does not claim this is your complete photo, video, or music library" in ui, "Review-set scope disclosure is missing")
    require("Nothing is selected automatically" in ui, "English no-auto-selection disclosure is missing")
    require("ไม่มีการเลือกให้อัตโนมัติ" in ui, "Thai no-auto-selection disclosure is missing")
    require("自動選択は行いません" in ui, "Japanese no-auto-selection disclosure is missing")
    for kind in ("image", "video", "audio"):
        require(f"'{kind}'" in ui, f"Advanced Media Review kind missing: {kind}")
    for filter_name in ("screenshots", "over10", "over100", "recent30", "olderYear"):
        require(filter_name in ui, f"Advanced Media Review filter missing: {filter_name}")
    require("patchProPresentation" in ui and "Advanced media review & filters" in ui,
            "Pro presentation is not reconciled after Advanced Media Review implementation")

    implemented_block = entitlement.split('put("implementedProCapabilities"', 1)[1].split('put("plannedProCapabilities"', 1)[0]
    planned_block = entitlement.split('put("plannedProCapabilities"', 1)[1].split(')', 1)[0]
    require("Capability.ADVANCED_MEDIA_REVIEW.wireName" in implemented_block,
            "Advanced Media Review is not marked implemented in the native entitlement source")
    require("Capability.ADVANCED_MEDIA_REVIEW.wireName" not in planned_block,
            "Advanced Media Review is still marked planned after implementation")


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
            ("Advanced Media Review", check_advanced_media_contracts),
        ]
    else:
        checks = [
            ("build/version/cache", check_build_contracts),
            ("native request/deletion guards", check_native_guard_contracts),
            ("Downloads Review contracts", check_downloads_review_contracts),
            ("APK Installers contracts", lambda: check_apk_installers_contracts(patch_only=False)),
            ("Archives contracts", lambda: check_archives_contracts(patch_only=False)),
            ("Zero-byte Files contracts", check_zero_byte_contracts),
            ("Empty Folders contracts", check_empty_folder_contracts),
            ("Phase B Insights / local history", check_insights_contracts),
            ("Advanced Media Review", check_advanced_media_contracts),
            ("app-shell / scroll UX contracts", check_shell_ux_contracts),
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
