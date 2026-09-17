#!/usr/bin/env python3
from pathlib import Path
import hashlib, sys

ROOT = Path(__file__).resolve().parents[1]

FROZEN_GIT_BLOBS = {
    "app/src/main/java/com/benedictinteractive/bearagnostic/MainActivity.kt":
        "61621e68babb9beaa3ff494e7ee1c6af6e6a718a",
    "app/src/main/legacy-adapter/android-pro-ui.js":
        "8d701891a2aa110109c17ec032317341dac6846a",
}

def git_blob(path: Path) -> str:
    data = path.read_bytes()
    h = hashlib.sha1()
    h.update(f"blob {len(data)}\0".encode())
    h.update(data)
    return h.hexdigest()

errors = []
for rel, expected in FROZEN_GIT_BLOBS.items():
    path = ROOT / rel
    if not path.is_file():
        errors.append(f"missing frozen file: {rel}")
        continue
    actual = git_blob(path)
    if actual != expected:
        errors.append(f"frozen baseline changed: {rel} {actual} != {expected}")

billing = (ROOT / "app/src/main/legacy-adapter/android-billing.js").read_text(encoding="utf-8")
if "new MutationObserver" in billing:
    errors.append("android-billing.js must not use MutationObserver")
if "DOMContentLoaded" in billing:
    errors.append("android-billing.js must not auto-start on DOMContentLoaded")
if "bearagnostic:prorequest" not in billing:
    errors.append("commerce must activate only from the existing Pro request path")

harness = ROOT / "app/src/debug/java/com/benedictinteractive/bearagnostic/DebugCommerceQaHarness.kt"
if not harness.is_file():
    errors.append("debug QA harness missing from src/debug")

native = (ROOT / "app/src/main/java/com/benedictinteractive/bearagnostic/NativeBridge.kt").read_text(encoding="utf-8")
if 'if (!BuildConfig.DEBUG) return rejected("qa_unavailable")' not in native:
    errors.append("release guard missing from QA bridge")

if errors:
    print("\\n".join(f"FAIL: {e}" for e in errors))
    sys.exit(1)

print("PASS: frozen baseline unchanged")
print("PASS: commerce activation is user-driven")
print("PASS: QA harness is debug-source only")
print("PASS: release synthetic entitlement guard present")
