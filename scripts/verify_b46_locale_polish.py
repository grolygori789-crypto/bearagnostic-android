#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / 'app' / 'build.gradle.kts'
POLISH = ROOT / 'app' / 'src' / 'main' / 'legacy-adapter' / 'android-locale-polish.js'
WORKFLOW = ROOT / '.github' / 'workflows' / 'android-debug-apk.yml'


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    build = BUILD.read_text(encoding='utf-8')
    polish = POLISH.read_text(encoding='utf-8')
    workflow = WORKFLOW.read_text(encoding='utf-8')

    require('versionCode = 46' in build, 'B46 versionCode missing')
    require('versionName = "0.34.1-alpha46"' in build, 'B46 versionName missing')
    require('androidLocalePolish' in build, 'B46 locale-polish adapter declaration missing')
    require('android-locale-polish.js?v=46' in build, 'B46 locale-polish load/cache missing')
    require('androidLocalePolish.copyTo' in build, 'B46 locale-polish adapter is not copied to generated UI')

    cache_versions = set(re.findall(r'android-[a-z0-9-]+\.js\?v=(\d+)', build))
    require(cache_versions == {'46'}, f'Android adapter cache incoherent: {sorted(cache_versions)}')
    require('legacyCommit = "78a31c7752e171c0eafb63c0d0859f4072a193d6"' in build, 'Pinned PWA commit changed')
    require('f9cff58fc54e6b0525c7f74922b0588aca6a9a9d' in build, 'Approved launcher icon contract missing')
    require('isMinifyEnabled = false' in build, 'B46 must not introduce release hardening during locale polish')

    stab_pos = build.find('android-stabilization.js?v=46')
    polish_pos = build.find('android-locale-polish.js?v=46')
    truth_pos = build.find('android-build-truth.js?v=46')
    require(0 <= stab_pos < polish_pos < truth_pos, 'B46 adapter order must be stabilization < locale-polish < build-truth')

    require('#privacyScreen.is-active:not([hidden])' in polish and 'grid-template-rows:auto minmax(0,1fr)!important' in polish,
            'Privacy locale-safe grid contract missing')
    require('#privacyScreen .settings-title-row' in polish and 'height:auto!important' in polish,
            'Privacy header does not grow with translated text')
    require('#privacyScreen .settings-scroll' in polish and 'height:auto!important' in polish,
            'Privacy scroll geometry remains fixed-height')

    require('#privacyScreen .privacy-principle-card__icon' in polish and 'stroke:#fff!important' in polish,
            'Privacy semantic icon contrast contract missing')
    require('#baLegalRow .soft-icon' in polish and '#397a9f' in polish,
            'Legal icon contrast contract missing')

    require('html[lang^="th"] #homeScreen .home-hero h1' in polish and 'line-height:1.34!important' in polish,
            'Thai Home hero rhythm contract missing')
    require('html[lang^="th"] #homeScreen .editorial-card blockquote' in polish and 'line-height:1.42!important' in polish,
            'Thai editorial quote rhythm contract missing')
    require('html[lang^="th"] #privacyScreen .settings-title-row h2' in polish and 'line-height:1.30!important' in polish,
            'Thai Privacy title typography contract missing')
    require('html[lang^="ja"] #homeScreen .home-hero h1' in polish and 'line-height:1.38!important' in polish,
            'Japanese Home typography contract missing')
    require('html[lang^="en"] #homeScreen .editorial-card blockquote' in polish,
            'English editorial rhythm contract missing')

    require('white-space:nowrap!important' in polish, 'Thai hero two-line preservation contract missing')
    require('BearagnosticLocalePolish' in polish and 'build: BUILD' in polish, 'B46 runtime surface missing')
    require('getInsightsHistory' not in polish and 'LocalHistoryStore' not in polish and 'FileHealthScanner' not in polish,
            'B46 locale polish must not touch Insights/scanner logic')

    require('Verify B46 locale polish contracts' in workflow and 'python3 scripts/verify_b46_locale_polish.py' in workflow,
            'CI does not execute B46 verifier')

    print('B46 locale polish contracts: PASS')


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'B46 locale polish contracts: FAIL — {exc}', file=sys.stderr)
        sys.exit(1)
