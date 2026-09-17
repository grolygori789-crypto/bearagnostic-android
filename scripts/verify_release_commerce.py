#!/usr/bin/env python3
from pathlib import Path
import argparse
import hashlib
import subprocess
import sys
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]

PROTECTED_GIT_BLOBS = {
    "app/src/main/java/com/benedictinteractive/bearagnostic/MainActivity.kt":
        "61621e68babb9beaa3ff494e7ee1c6af6e6a718a",
    "app/src/main/legacy-adapter/android-pro-ui.js":
        "8d701891a2aa110109c17ec032317341dac6846a",
}

RELEASE_FORBIDDEN_DEX_MARKERS = (
    b"CommerceQaActivity",
    b"Bearagnostic Commerce QA",
)

RELEASE_FORBIDDEN_BILLING_MARKERS = (
    b"Developer Mode",
    b"Billing Sandbox",
    b"data-debug-tier",
    b"data-k3-qa",
    b"runCommerceQaScenario",
)

def git_blob(path: Path) -> str:
    data = path.read_bytes()
    h = hashlib.sha1()
    h.update(f"blob {len(data)}".encode("ascii"))
    h.update(b"\x00")
    h.update(data)
    return h.hexdigest()

def fail(msg):
    print("FAIL:", msg)
    raise SystemExit(1)

def source_checks():
    for rel, expected in PROTECTED_GIT_BLOBS.items():
        path = ROOT / rel
        if not path.is_file():
            fail(f"missing frozen baseline file: {rel}")
        actual = git_blob(path)
        if actual != expected:
            fail(f"frozen baseline changed: {rel}: {actual} != {expected}")

    billing_path = ROOT / "app/src/main/legacy-adapter/android-billing.js"
    billing = billing_path.read_text(encoding="utf-8")
    if "new MutationObserver" in billing:
        fail("production commerce must not use MutationObserver")
    if "DOMContentLoaded" in billing:
        fail("production commerce must not auto-start from DOMContentLoaded")
    if "bearagnostic:prorequest" not in billing:
        fail("production commerce must activate from existing Pro request")
    for marker in ("Developer Mode", "Billing Sandbox", "data-debug-tier", "data-k3-qa", "runCommerceQaScenario"):
        if marker in billing:
            fail(f"production billing adapter contains debug marker: {marker}")

    qa = ROOT / "app/src/debug/java/com/benedictinteractive/bearagnostic/CommerceQaActivity.kt"
    dbg_manifest = ROOT / "app/src/debug/AndroidManifest.xml"
    if not qa.is_file() or not dbg_manifest.is_file():
        fail("debug-only QA source set is incomplete")

    node = subprocess.run(["node", "--check", str(billing_path)], capture_output=True, text=True)
    if node.returncode != 0:
        fail("android-billing.js syntax failed:\n" + node.stderr)

    smoke = r"""
const fs = require('fs');
const vm = require('vm');
const calls = [];
const listeners = {};
global.window = {
  BearagnosticNative: new Proxy({}, {
    get(_t, p) { return (...args) => { calls.push([String(p), args]); return '{}'; }; }
  }),
  addEventListener(name, fn) { (listeners[name] ||= []).push(fn); }
};
global.document = {
  documentElement: {lang:'en'},
  hidden:false,
  querySelector(){ return null; },
  addEventListener(name, fn){ (listeners['doc:'+name] ||= []).push(fn); },
  head:{appendChild(){}},
  createElement(){ return {id:'', textContent:''}; }
};
global.CustomEvent=function(){};
vm.runInThisContext(fs.readFileSync(process.argv[1],'utf8'));
if(calls.length){ console.error(JSON.stringify(calls)); process.exit(1); }
console.log('PASS startup native commerce calls = 0');
"""
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
        f.write(smoke)
        smoke_path = Path(f.name)
    try:
        run = subprocess.run(["node", str(smoke_path), str(billing_path)], capture_output=True, text=True)
        if run.returncode != 0:
            fail("startup smoke failed: " + run.stderr)
    finally:
        smoke_path.unlink(missing_ok=True)

    print("PASS source: frozen baseline unchanged")
    print("PASS source: production commerce dormant at JS startup")
    print("PASS source: QA implementation exists only under src/debug")

def apk_bytes(apk: Path, name: str) -> bytes:
    with zipfile.ZipFile(apk) as z:
        return z.read(name)

def artifact_checks(debug_apk: Path, release_apk: Path):
    if not debug_apk.is_file():
        fail(f"missing debug APK: {debug_apk}")
    if not release_apk.is_file():
        fail(f"missing release APK: {release_apk}")

    with zipfile.ZipFile(release_apk) as z:
        names = z.namelist()
        billing_name = "assets/ui/js/android-billing.js"
        if billing_name not in names:
            fail("release APK missing production android-billing.js")
        release_billing = z.read(billing_name)
        for marker in RELEASE_FORBIDDEN_BILLING_MARKERS:
            if marker in release_billing:
                fail(f"release billing asset contains debug marker: {marker!r}")

        release_dex = b"".join(z.read(n) for n in names if n.startswith("classes") and n.endswith(".dex"))
        for marker in RELEASE_FORBIDDEN_DEX_MARKERS:
            if marker in release_dex:
                fail(f"release APK contains debug QA marker: {marker!r}")

    with zipfile.ZipFile(debug_apk) as z:
        names = z.namelist()
        debug_dex = b"".join(z.read(n) for n in names if n.startswith("classes") and n.endswith(".dex"))
        if b"CommerceQaActivity" not in debug_dex:
            fail("debug APK does not contain CommerceQaActivity; debug source-set separation failed")

    print("PASS artifact: release APK contains no debug QA activity")
    print("PASS artifact: release production billing asset contains no debug controls")
    print("PASS artifact: debug APK contains isolated QA activity")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--debug-apk")
    parser.add_argument("--release-apk")
    args = parser.parse_args()

    source_checks()

    if bool(args.debug_apk) != bool(args.release_apk):
        fail("provide both --debug-apk and --release-apk")
    if args.debug_apk:
        artifact_checks(Path(args.debug_apk), Path(args.release_apk))

if __name__ == "__main__":
    main()
