#!/usr/bin/env python3
from pathlib import Path
import argparse
import re
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / 'app' / 'build.gradle.kts'
WORKFLOW = ROOT / '.github' / 'workflows' / 'android-debug-apk.yml'
ENT = ROOT / 'app' / 'src' / 'main' / 'java' / 'com' / 'benedictinteractive' / 'bearagnostic' / 'EntitlementManager.kt'
BRIDGE = ROOT / 'app' / 'src' / 'main' / 'java' / 'com' / 'benedictinteractive' / 'bearagnostic' / 'NativeBridge.kt'
UI = ROOT / 'app' / 'src' / 'main' / 'legacy-adapter' / 'android-billing.js'
SANDBOX = ROOT / 'app' / 'src' / 'debug' / 'java' / 'com' / 'benedictinteractive' / 'bearagnostic' / 'DebugBillingSandbox.kt'
LOCALE = ROOT / 'app' / 'src' / 'main' / 'legacy-adapter' / 'android-locale-polish.js'


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def verify_release_apk(path: Path):
    require(path.is_file(), f'release APK not found: {path}')
    with zipfile.ZipFile(path) as zf:
        dex_names = [n for n in zf.namelist() if re.fullmatch(r'classes\d*\.dex', n)]
        require(dex_names, 'release APK contains no classes.dex')
        dex = b''.join(zf.read(n) for n in dex_names)
        require(b'Lcom/benedictinteractive/bearagnostic/DebugBillingSandbox;' not in dex,
                'DebugBillingSandbox class descriptor leaked into release dex')
        require(b'bearagnostic_debug_billing_sandbox_v2' not in dex,
                'Debug sandbox preferences leaked into release dex')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--release-apk', type=Path)
    args = parser.parse_args()

    build = BUILD.read_text(encoding='utf-8')
    workflow = WORKFLOW.read_text(encoding='utf-8')
    ent = ENT.read_text(encoding='utf-8')
    bridge = BRIDGE.read_text(encoding='utf-8')
    ui = UI.read_text(encoding='utf-8')
    sandbox = SANDBOX.read_text(encoding='utf-8')
    locale = LOCALE.read_text(encoding='utf-8')

    require('versionCode = 49' in build, 'B49 versionCode missing')
    require('versionName = "0.35.1-alpha49"' in build, 'B49 versionName missing')
    cache_versions = set(re.findall(r'android-[a-z0-9-]+\.js\?v=(\d+)', build))
    require(cache_versions == {'49'}, f'Android adapter cache incoherent: {sorted(cache_versions)}')
    require('legacyCommit = "78a31c7752e171c0eafb63c0d0859f4072a193d6"' in build, 'Pinned PWA commit changed')
    require('f9cff58fc54e6b0525c7f74922b0588aca6a9a9d' in build, 'Approved launcher icon contract missing')
    require('const BUILD = 49;' in locale, 'B49 locale-polish metadata missing')
    require('B47 heading system' in locale and '--ba-display-heading-size' in locale,
            'Physically approved B47 heading typography was not preserved')

    # The simulator engine is a debug source-set implementation, not a release implementation.
    require('/src/debug/' in SANDBOX.as_posix(), 'Billing sandbox must live under src/debug')
    require(not (ROOT / 'app/src/main/java/com/benedictinteractive/bearagnostic/DebugBillingSandbox.kt').exists(),
            'DebugBillingSandbox leaked into main source set')
    require('class DebugBillingSandbox' in sandbox, 'Debug sandbox implementation missing')
    for token in ('releaseIncluded", false', 'chargesRealMoney", false', 'contactsGooglePlay", false',
                  'storeAndAppStateSeparated", true'):
        require(token in sandbox, f'Sandbox safety declaration missing: {token}')

    # Dual-sided store/app architecture and persisted transaction ledger.
    for token in (
        'KEY_STORE_OWNED', 'KEY_TRANSACTIONS', 'KEY_EVENTS', 'newTransactionLocked',
        'currentTransaction', 'transactions', 'events', 'License Tester A',
        'setDeveloperMode', 'setMarket', 'setNetworkMode', 'setPaymentBehavior',
        'setAcknowledgeMode', 'setStoreAvailable', 'simulateReinstall', 'syncOwnership',
    ):
        require(token in sandbox, f'Dual-sided sandbox contract missing: {token}')

    # Lifecycle coverage mirrors the important one-time Play Billing states.
    for token in (
        'processing_payment', 'purchased_unacknowledged', 'owned_ack_pending', 'pending',
        'network_error', 'checking_ownership', 'refunded_access_retained', 'refunded_and_revoked',
        'chargeback', 'auto_refund_unacknowledged', 'ONE_TIME_PRODUCT_PURCHASED',
        'ONE_TIME_PRODUCT_CANCELED', 'VOIDED_PURCHASE', 'PURCHASE_ACKNOWLEDGED',
    ):
        require(token in sandbox, f'Missing lifecycle behavior: {token}')
    require('entitlement.setDebugSandboxOwnership(true, now)' in sandbox,
            'Entitlement is not granted from PURCHASED confirmation')
    pending_section = sandbox[sandbox.find('private fun markPendingLocked'):sandbox.find('private fun markDeclinedLocked')]
    require('setDebugSandboxOwnership(true' not in pending_section,
            'Pending purchase must not unlock Pro')
    require('expireUnacknowledged' in sandbox and 'Three-day acknowledgement deadline simulated' in sandbox,
            'Unacknowledged purchase auto-refund test path missing')
    require('refundKeepAccess' in sandbox and 'refundAndRevoke' in sandbox,
            'Refund-with/without-revoke distinction missing')
    require('generation' in sandbox and 'if (token != generation' in sandbox,
            'Stale delayed callbacks are not guarded')

    # Entitlement is still the single app-side gate and debug ownership cannot activate in release.
    require('BuildConfig.DEBUG && isDebugSandboxOwned()' in ent,
            'Debug sandbox ownership is not debug-gated')
    require('if (!BuildConfig.DEBUG) return false' in ent,
            'Debug sandbox ownership setter is not blocked in release')
    require('"billing_sandbox"' in ent, 'Sandbox entitlement source missing')

    # Native bridge only reflectively discovers the debug class.
    require('if (!BuildConfig.DEBUG) return null' in bridge,
            'NativeBridge does not block sandbox creation in release')
    require('Class.forName("com.benedictinteractive.bearagnostic.DebugBillingSandbox")' in bridge,
            'Debug class is not isolated behind reflection')
    for method in (
        'setDebugBillingDeveloperMode', 'setDebugBillingSandboxMarket',
        'setDebugBillingSandboxNetwork', 'setDebugBillingSandboxPaymentBehavior',
        'setDebugBillingSandboxAcknowledgeMode', 'setDebugBillingSandboxStoreAvailable',
        'declineDebugBillingSandboxPending', 'syncDebugBillingSandboxOwnership',
        'retryDebugBillingSandboxAcknowledgement', 'refundDebugBillingSandboxKeepAccess',
        'refundDebugBillingSandboxAndRevoke', 'revokeDebugBillingSandbox',
        'chargebackDebugBillingSandbox', 'expireDebugBillingSandboxUnacknowledged',
        'simulateDebugBillingSandboxReinstall', 'clearDebugBillingSandboxEvents',
    ):
        require(method in bridge, f'Missing owner-console bridge action: {method}')
    require('BRIDGE_VERSION = 16' in bridge, 'B49 unexpectedly changed the native bridge contract')

    # Customer-facing purchase remains clean; scenario controls live in hidden Dev Mode.
    for token in (
        'TEST PURCHASE · DEBUG ONLY', 'การซื้อทดสอบ · DEBUG เท่านั้น', 'テスト購入 · DEBUG専用',
        'Test card ·•••• 4242', 'ไม่มีรายเดือน · ไม่มีการเรียกเก็บซ้ำ', 'サブスクなし · 継続課金なし',
        'Billing QA Console', 'Dual-sided customer + store simulation', 'data-dev-tab',
        'data-dev-setting="payment"', 'data-dev-setting="ack"', 'refund-revoke',
        'expire-ack', 'simulateDebugBillingSandboxReinstall', '#baBillingSandboxPanel{display:none!important}',
    ):
        require(token in ui, f'Missing B49 Dev Mode UX contract: {token}')
    require('tapCount>=7' in ui, 'Seven-tap Developer Mode activation missing')
    for token in (
        "const result=call('setDebugBillingDeveloperMode',true,'bool')",
        "result?.accepted===true && result?.state?.devModeEnabled===true",
        "revealDeveloperTools(result.state,{open:true})",
        "Developer mode unavailable",
        "about.parentElement?.insertBefore(row,about)",
        "row=document.createElement('div')",
        "row.setAttribute('role','button')",
        "[80,220,600,1200]",
    ):
        require(token in ui, f'B49 Developer Mode entry hardening missing: {token}')
    activation = ui[ui.find('function activateTap'):ui.find('function toast')]
    require('toast(c().enabled)' in activation and activation.find('confirmed') < activation.find('toast(c().enabled)'),
            'Success toast is not gated by confirmed native activation')
    require('openConsole();' in ui, 'Billing QA Console open path missing')
    require('window.BearagnosticProUI?.open?.(\'developer_customer\')' in ui,
            'Customer simulator is not routed through the real Pro surface')
    require('NATIVE.purchasePro' in ui and 'NATIVE.restoreProPurchase' in ui,
            'Real Google Play path was removed')

    require('Verify B49 developer mode entry' in workflow,
            'CI does not run the B49 verifier')

    # B49 is an isolated Developer Mode entry fix; scanner and Insights evidence collection are forbidden.
    package_paths = {str(p.relative_to(ROOT)).replace('\\','/') for p in ROOT.rglob('*') if p.is_file()}
    forbidden = {
        'app/src/main/legacy-adapter/android-insights.js',
        'app/src/main/java/com/benedictinteractive/bearagnostic/LocalHistoryStore.kt',
        'app/src/main/java/com/benedictinteractive/bearagnostic/FileHealthScanner.kt',
    }
    require(not (package_paths & forbidden), f'B49 package touches evidence/scanner files: {package_paths & forbidden}')

    if args.release_apk:
        verify_release_apk(args.release_apk)

    print('B49 dual-sided billing sandbox contracts: PASS')


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'B49 dual-sided billing sandbox contracts: FAIL — {exc}', file=sys.stderr)
        sys.exit(1)
