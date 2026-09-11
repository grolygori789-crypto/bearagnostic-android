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

    require('versionCode = 47' in build, 'B47 versionCode missing')
    require('versionName = "0.34.2-alpha47"' in build, 'B47 versionName missing')
    require('androidLocalePolish' in build, 'locale-polish adapter declaration missing')
    require('android-locale-polish.js?v=47' in build, 'B47 locale-polish cache/load missing')
    require('androidLocalePolish.copyTo' in build, 'locale-polish adapter is not copied to generated UI')

    cache_versions = set(re.findall(r'android-[a-z0-9-]+\.js\?v=(\d+)', build))
    require(cache_versions == {'47'}, f'Android adapter cache incoherent: {sorted(cache_versions)}')
    require('legacyCommit = "78a31c7752e171c0eafb63c0d0859f4072a193d6"' in build, 'Pinned PWA commit changed')
    require('f9cff58fc54e6b0525c7f74922b0588aca6a9a9d' in build, 'Approved launcher icon contract missing')
    require('isMinifyEnabled = false' in build, 'B47 must not introduce release hardening during typography polish')

    stab_pos = build.find('android-stabilization.js?v=47')
    polish_pos = build.find('android-locale-polish.js?v=47')
    truth_pos = build.find('android-build-truth.js?v=47')
    require(0 <= stab_pos < polish_pos < truth_pos, 'adapter order must remain stabilization < locale-polish < build-truth')

    require('const BUILD = 47;' in polish, 'B47 locale adapter build marker missing')
    for locale in ('en', 'th', 'ja'):
        require(f'html[lang^="{locale}"]' in polish, f'{locale} typography contract missing')
    for token in ('--ba-display-heading-size', '--ba-display-heading-leading',
                  '--ba-section-heading-size', '--ba-section-heading-leading',
                  '--ba-workspace-heading-size', '--ba-workspace-heading-leading'):
        require(token in polish, f'central heading token missing: {token}')

    required_surfaces = [
        '#checkupScreen .scan-title', '#insightsScreen .ba-insights-head h2',
        '#toolsScreen .utility-head h2', '#moreScreen .panel-head h2',
        '#preferencesScreen .settings-title-row h2', '#privacyScreen .settings-title-row h2',
        '.ba-legal-title', '.ba-pro-title', '.ba-media-title', '.ba-downloads-title',
        '.ba-installers-title', '.ba-archives-title', '.ba-zero-title', '.ba-empty-title',
        '.ba-large-head h2', '.ba-old-head h2', '.ba-dup-head h2', '.ba-qc-head h2'
    ]
    for selector in required_surfaces:
        require(selector in polish, f'heading surface is not covered: {selector}')

    require('--ba-display-heading-size:clamp(26.5px,7.15vw,33px)' in polish,
            'Thai display heading scale is not the approved restrained range')
    require('--ba-display-heading-leading:1.20' in polish,
            'Thai display heading leading missing')
    require('letter-spacing:.045em!important' in polish,
            'Thai kicker tracking correction missing')
    require('html[lang^="ja"] #checkupScreen .scan-title' in polish and 'letter-spacing:.005em!important' in polish,
            'Japanese heading rhythm contract missing')
    require('html[lang^="en"]' in polish and '--ba-display-heading-leading:1.08' in polish,
            'English display hierarchy contract missing')

    require('@media(max-width:430px)' in polish and '#insightsScreen .ba-insights-local' in polish and 'grid-row:1!important' in polish,
            'phone-width Insights title/badge separation missing')
    require('text-wrap:balance' in polish and 'word-break:normal' in polish,
            'heading wrapping safeguards missing')

    # Typography polish must remain presentation-only: no scan/history/billing logic changes.
    forbidden = ('getInsightsHistory', 'LocalHistoryStore', 'FileHealthScanner', 'deleteReviewCandidates',
                 'purchasePro', 'restoreProPurchase', 'startScan(')
    for item in forbidden:
        require(item not in polish, f'presentation layer must not call or mutate runtime logic: {item}')

    require('Verify B47 heading typography contracts' in workflow and
            'python3 scripts/verify_b47_heading_typography.py' in workflow,
            'CI does not execute B47 verifier')

    print('B47 heading typography contracts: PASS')


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'B47 heading typography contracts: FAIL — {exc}', file=sys.stderr)
        sys.exit(1)
