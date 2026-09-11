#!/usr/bin/env python3
from pathlib import Path
import argparse, re, sys, zipfile

ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT/'app/build.gradle.kts'
WORKFLOW = ROOT/'.github/workflows/android-debug-apk.yml'
UI = ROOT/'app/src/main/legacy-adapter/android-billing.js'
LOCALE = ROOT/'app/src/main/legacy-adapter/android-locale-polish.js'
BRIDGE = ROOT/'app/src/main/java/com/benedictinteractive/bearagnostic/NativeBridge.kt'
SANDBOX = ROOT/'app/src/debug/java/com/benedictinteractive/bearagnostic/DebugBillingSandbox.kt'
ENT = ROOT/'app/src/main/java/com/benedictinteractive/bearagnostic/EntitlementManager.kt'


def require(cond, msg):
    if not cond:
        raise AssertionError(msg)


def verify_release_apk(path: Path):
    require(path.is_file(), f'release APK not found: {path}')
    with zipfile.ZipFile(path) as zf:
        dex_names=[n for n in zf.namelist() if re.fullmatch(r'classes\d*\.dex',n)]
        require(dex_names,'release APK contains no classes.dex')
        dex=b''.join(zf.read(n) for n in dex_names)
        require(b'Lcom/benedictinteractive/bearagnostic/DebugBillingSandbox;' not in dex,
                'DebugBillingSandbox leaked into release dex')
        require(b'bearagnostic_debug_billing_sandbox_v2' not in dex,
                'Debug sandbox preferences leaked into release dex')


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--release-apk',type=Path)
    args=ap.parse_args()

    build=BUILD.read_text(encoding='utf-8')
    workflow=WORKFLOW.read_text(encoding='utf-8')
    ui=UI.read_text(encoding='utf-8')
    locale=LOCALE.read_text(encoding='utf-8')
    bridge=BRIDGE.read_text(encoding='utf-8')
    sandbox=SANDBOX.read_text(encoding='utf-8')
    ent=ENT.read_text(encoding='utf-8')

    require('versionCode = 52' in build,'B52 versionCode missing')
    require('versionName = "0.35.4-alpha52"' in build,'B52 versionName missing')
    versions=set(re.findall(r'android-[a-z0-9-]+\.js\?v=(\d+)',build))
    require(versions=={'52'},f'Adapter cache incoherent: {sorted(versions)}')
    require('legacyCommit = "78a31c7752e171c0eafb63c0d0859f4072a193d6"' in build,'Pinned PWA commit changed')
    require('f9cff58fc54e6b0525c7f74922b0588aca6a9a9d' in build,'Launcher icon contract changed')
    require('const BUILD = 52;' in locale,'Locale metadata not bumped to B52')
    require('B47 heading system' in locale and '--ba-display-heading-size' in locale,
            'Approved B47 typography was not preserved')
    require('const DEV_CONSOLE_BUILD=52;' in ui,'B52 console build label missing')

    # Preserve B51 startup safety.
    require("catch (_) { return {available:false,debugOnly:true,reason:'bridge_state_error'}; }" in ui,
            'Sandbox state read is not exception-safe')
    require('const BRIDGE_CALLS=Object.freeze({' in ui,'Explicit bridge wrapper table missing')
    require('NATIVE[name](' not in ui,'Dynamic indexed WebView bridge invocation reintroduced')
    require('const fn=NATIVE[name]' not in ui,'Detached WebView bridge invocation reintroduced')
    require('let devObserverQueued=false;' in ui and 'if(devObserverQueued) return;' in ui,
            'Developer observer guard missing')
    require("strong && strong.textContent!==t.dev" in ui and "small && small.textContent!==t.devSub" in ui,
            'Developer row idempotence changed')

    # Interactive DOM must not be destroyed by the background poll.
    require("let consoleInteractionUntil=0, lastConsoleSignature=''" in ui,
            'Console interaction/signature state missing')
    require('function consoleIsInteracting()' in ui,'Interactive focus guard missing')
    require("active.matches('select,button,input,textarea')" in ui,
            'Focused-control protection missing')
    require('function consoleSignature(s,t)' in ui,'Render signature missing')
    require('if(!force && consoleIsInteracting()) return;' in ui,
            'Console can still re-render while native controls are active')
    require('if(!force && signature===lastConsoleSignature) return;' in ui,
            'Polling still re-renders unchanged console state')
    require("poll=setInterval(()=>refreshAll(),1100)" in ui,
            'B52 background poll cadence missing')
    require("document.addEventListener('pointerdown'" in ui and 'markConsoleInteraction();' in ui,
            'Pointer interaction lock missing')
    require("document.addEventListener('focusin'" in ui and 'markConsoleInteraction(12000)' in ui,
            'Native picker focus lock missing')
    require("try { field.blur(); } catch (_) {}" in ui,
            'Select completion does not release focus safely')

    # Readability floor: B52 deliberately favors scrolling over tiny type.
    dev_css_start=ui.index('/* Scenario selectors never appear in customer-facing Pro UI. */')
    css=ui[dev_css_start:ui.index('function ensureRow',dev_css_start)]
    for token in (
        'font-size:14px;line-height:1.5;color:#5f7285',
        'font-size:13px;line-height:1.2;font-weight:760',
        'font-size:18px;line-height:1.32',
        'font-size:14px;line-height:1.3;font-weight:740',
        'height:50px',
        'font-size:14px;font-weight:680',
        '@media(max-width:520px){.ba-dev-fields,.ba-dev-actions{grid-template-columns:1fr}',
    ):
        require(token in css,f'B52 readability contract missing: {token}')
    require('font-size:9px' not in css and 'font-size:9.5px' not in css and 'font-size:8px' not in css,
            'Tiny B51 Developer Console typography remains')

    # Lifecycle hierarchy must distinguish routine, recovery, and destructive QA actions.
    require("normalOps:'Normal operations'" in ui and "recoveryOps:'Recovery & restore'" in ui,
            'Lifecycle hierarchy copy missing')
    require('LIFECYCLE · NORMAL' in ui and 'LIFECYCLE · RECOVERY' in ui and 'LIFECYCLE · DESTRUCTIVE' in ui,
            'Lifecycle action grouping missing')

    # Core dual-sided engine and Play path remain untouched in architecture.
    require('Class.forName("com.benedictinteractive.bearagnostic.DebugBillingSandbox")' in bridge,
            'Debug sandbox reflection isolation changed')
    require('if (!BuildConfig.DEBUG) return null' in bridge,'Release sandbox creation guard changed')
    require('class DebugBillingSandbox' in sandbox,'Debug sandbox engine missing')
    require('storeAndAppStateSeparated", true' in sandbox,'Store/app state separation missing')
    require('BuildConfig.DEBUG && isDebugSandboxOwned()' in ent,'Debug entitlement release guard changed')
    require('NATIVE.purchasePro' in ui and 'NATIVE.restoreProPurchase' in ui,'Real Play Billing path removed')

    require('Verify B52 Developer Console contracts' in workflow,'CI does not run B52 verifier')
    require('Verify B52 release has no sandbox engine' in workflow,'CI release isolation gate missing')

    if args.release_apk:
        verify_release_apk(args.release_apk)
    print('B52 Developer Console contracts: PASS')

if __name__=='__main__':
    try:
        main()
    except Exception as exc:
        print(f'B52 Developer Console contracts: FAIL — {exc}',file=sys.stderr)
        sys.exit(1)
