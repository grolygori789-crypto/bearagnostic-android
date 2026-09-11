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

    require('versionCode = 51' in build,'B51 versionCode missing')
    require('versionName = "0.35.3-alpha51"' in build,'B51 versionName missing')
    versions=set(re.findall(r'android-[a-z0-9-]+\.js\?v=(\d+)',build))
    require(versions=={'51'},f'Adapter cache incoherent: {sorted(versions)}')
    require('legacyCommit = "78a31c7752e171c0eafb63c0d0859f4072a193d6"' in build,'Pinned PWA commit changed')
    require('f9cff58fc54e6b0525c7f74922b0588aca6a9a9d' in build,'Launcher icon contract changed')
    require('const BUILD = 51;' in locale,'Locale metadata not bumped to B51')
    require('B47 heading system' in locale and '--ba-display-heading-size' in locale,
            'Approved B47 typography was not preserved')

    # Startup recovery: state reads must never throw into the observer path.
    require("catch (_) { return {available:false,debugOnly:true,reason:'bridge_state_error'}; }" in ui,
            'Sandbox state read is not exception-safe')

    # Do not dynamically index/call JavaScriptInterface methods. Use explicit wrappers.
    require('const BRIDGE_CALLS=Object.freeze({' in ui,'Explicit bridge wrapper table missing')
    require('NATIVE[name](' not in ui,'Dynamic indexed WebView bridge invocation reintroduced')
    require('const fn=NATIVE[name]' not in ui,'Detached WebView bridge invocation reintroduced')
    for token in (
        'setDebugBillingDeveloperMode:(v)=>NATIVE.setDebugBillingDeveloperMode(Boolean(v))',
        'setDebugBillingSandboxMarket:(v)=>NATIVE.setDebugBillingSandboxMarket(String(v))',
        'restoreDebugBillingSandboxPurchase:()=>NATIVE.restoreDebugBillingSandboxPurchase()',
        'refundDebugBillingSandboxAndRevoke:()=>NATIVE.refundDebugBillingSandboxAndRevoke()',
        'chargebackDebugBillingSandbox:()=>NATIVE.chargebackDebugBillingSandbox()',
    ):
        require(token in ui,f'Missing explicit bridge wrapper: {token}')

    # Native action result is isolated from post-call UI refresh failures.
    call_start=ui.index('function call(name')
    call_end=ui.index('function ensureStyle',call_start)
    call=ui[call_start:call_end]
    require('result=parse(invoke(value),{accepted:false});' in call,'Native result parsing missing')
    require("try { ENT.refresh?.(); } catch (_) {}" in call,'Entitlement refresh is not isolated')
    require("try { NATIVE.refreshNativeState?.(); } catch (_) {}" in call,'Native refresh is not isolated')
    require(call.find('return result;') > call.find('NATIVE.refreshNativeState'),
            'Native success result is not preserved after UI refresh')

    # MutationObserver must be idempotent. Unconditional text rewrites create a feedback loop
    # when Developer Mode is persisted across app restarts.
    row_start=ui.index('function ensureRow')
    row_end=ui.index('function revealDeveloperTools',row_start)
    row=ui[row_start:row_end]
    require("strong && strong.textContent!==t.dev" in row,'Developer row title is not idempotent')
    require("small && small.textContent!==t.devSub" in row,'Developer row subtitle is not idempotent')
    require("$('strong',row).textContent=t.dev" not in row,'Unconditional developer-row text mutation remains')
    require('let devObserverQueued=false;' in ui,'Developer observer re-entry guard missing')
    require('if(devObserverQueued) return;' in ui,'Developer observer queue guard missing')
    require('queueMicrotask(()=>{' in ui,'Developer observer is not deferred/coalesced')

    # Persisted Dev Mode must not force scrolling on every startup refresh.
    reveal_start=ui.index('function revealDeveloperTools')
    reveal_end=ui.index('function activateTap',reveal_start)
    reveal=ui[reveal_start:reveal_end]
    require('if(row && open)' in reveal,'Developer row still scrolls during background startup refresh')

    # Do not call full native state just to render a console build badge during startup/recovery.
    require('nativeBuild' not in ui,'Unnecessary nativeBuild bridge read remains')
    require('const DEV_CONSOLE_BUILD=51;' in ui,'B51 console build label missing')

    # Core dual-sided sandbox and release isolation remain intact.
    require('Class.forName("com.benedictinteractive.bearagnostic.DebugBillingSandbox")' in bridge,
            'Debug sandbox reflection isolation changed')
    require('if (!BuildConfig.DEBUG) return null' in bridge,'Release sandbox creation guard changed')
    require('class DebugBillingSandbox' in sandbox,'Debug sandbox engine missing')
    require('storeAndAppStateSeparated", true' in sandbox,'Store/app state separation missing')
    require('BuildConfig.DEBUG && isDebugSandboxOwned()' in ent,'Debug entitlement release guard changed')
    require('NATIVE.purchasePro' in ui and 'NATIVE.restoreProPurchase' in ui,'Real Play Billing path removed')

    require('Verify B51 startup recovery contracts' in workflow,'CI does not run B51 verifier')
    require('Verify B51 release has no sandbox engine' in workflow,'CI release isolation gate missing')

    if args.release_apk:
        verify_release_apk(args.release_apk)
    print('B51 startup recovery contracts: PASS')

if __name__=='__main__':
    try:
        main()
    except Exception as exc:
        print(f'B51 startup recovery contracts: FAIL — {exc}',file=sys.stderr)
        sys.exit(1)
