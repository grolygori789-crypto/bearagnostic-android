#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / "app" / "build.gradle.kts"
STAB = ROOT / "app" / "src" / "main" / "legacy-adapter" / "android-stabilization.js"
WORKFLOW = ROOT / ".github" / "workflows" / "android-debug-apk.yml"
LEGAL = ROOT / "docs" / "legal"
LICENSE = ROOT / "LICENSE.md"
LOCALIZATION = ROOT / "docs" / "LOCALIZATION_GUIDE.md"


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    build = BUILD.read_text(encoding="utf-8")
    stab = STAB.read_text(encoding="utf-8")
    workflow = WORKFLOW.read_text(encoding="utf-8")

    require('versionCode = 45' in build, 'B45 versionCode missing')
    require('versionName = "0.34.0-alpha45"' in build, 'B45 versionName missing')
    require('android-stabilization.js?v=45' in build, 'B45 stabilization adapter cache/load missing')
    require('androidStabilization.copyTo' in build, 'B45 stabilization adapter is not copied to generated UI')
    cache_versions = set(re.findall(r'android-[a-z0-9-]+\.js\?v=(\d+)', build))
    require(cache_versions == {'45'}, f'Android adapter cache incoherent: {sorted(cache_versions)}')
    require('legacyCommit = "78a31c7752e171c0eafb63c0d0859f4072a193d6"' in build, 'Pinned PWA commit changed')
    require('f9cff58fc54e6b0525c7f74922b0588aca6a9a9d' in build, 'Approved launcher icon contract missing')
    require('isMinifyEnabled = false' in build, 'B45 must not enable R8 before stabilization QA')

    require('#baMorePlanStatus,.ba-pro-row-badge{display:none!important}' in stab, 'Repeated Pro status suppression missing')
    require('fixPreferencesHeader' in stab and "scroll.insertAdjacentElement('afterbegin', intro)" in stab,
            'Preferences subtitle structural scroll fix missing')
    require('NATIVE?.getInsightsHistory?.()' in stab, 'File Health is not grounded in local history')
    require('healthSummary' in stab and 'reviewCandidateCount' in stab and 'reviewedFiles' in stab,
            'Factual File Health summary contract missing')
    require('availableMedia' in stab and 'availableInsights' in stab and 'availableCleanup' in stab,
            'Implemented Pro capabilities are not surfaced as current')
    for stale in ('Advanced media review & filters', 'Historical Insights & What Changed', 'Full cleanup history'):
        require(stale in stab, f'Implemented roadmap removal label missing: {stale}')
    require('Legal & Licenses' in stab and 'Copyright & Intellectual Property' in stab,
            'In-app Legal Center contract missing')
    require("LAUNCH_LOCALES = Object.freeze(['en', 'th', 'ja', 'es', 'pt-BR'])" in stab,
            'Five-language launch target missing')
    require("SHIPPING_LOCALES = Object.freeze(['en', 'th', 'ja'])" in stab,
            'B45 must not expose incomplete ES/PT-BR localisation')

    require('Verify B45 stabilization contracts' in workflow and 'python3 scripts/verify_b45_stabilization.py' in workflow,
            'CI does not execute B45 verifier')

    required_legal = ['README.md', 'COPYRIGHT_AND_IP.md', 'TERMS_OF_USE.md', 'PRIVACY_POLICY.md', 'THIRD_PARTY_NOTICES.md']
    for name in required_legal:
        require((LEGAL / name).is_file(), f'Missing legal document: {name}')
    license_text = LICENSE.read_text(encoding='utf-8')
    require('Proprietary — All Rights Reserved' in license_text, 'Proprietary reservation missing')
    require('reverse engineer' in license_text.lower(), 'Reverse-engineering boundary missing')
    require('model training' in license_text.lower(), 'Model-training boundary missing')
    require('non-waivable' in license_text.lower(), 'Mandatory-rights safeguard missing')

    guide = LOCALIZATION.read_text(encoding='utf-8')
    require('Mixed-language UI is a release defect.' in guide, 'No mixed-language release rule missing')
    require('Brazilian Portuguese' in guide and 'neutral international Spanish' in guide,
            'ES/PT-BR native-language guidance missing')

    # B45 intentionally must not contain or mutate Insights implementation/history files.
    package_paths = {str(p.relative_to(ROOT)).replace('\\', '/') for p in ROOT.rglob('*') if p.is_file()}
    forbidden = {
        'app/src/main/legacy-adapter/android-insights.js',
        'app/src/main/java/com/benedictinteractive/bearagnostic/LocalHistoryStore.kt',
        'app/src/main/java/com/benedictinteractive/bearagnostic/FileHealthScanner.kt',
    }
    require(not (package_paths & forbidden), f'B45 package touches evidence/scanner files: {package_paths & forbidden}')

    print('B45 stabilization contracts: PASS')


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'B45 stabilization contracts: FAIL — {exc}', file=sys.stderr)
        sys.exit(1)
