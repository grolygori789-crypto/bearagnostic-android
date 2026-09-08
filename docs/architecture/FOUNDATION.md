# Bearagnostic Android Architecture

## Product purpose

The Android edition exists so Bearagnostic can perform genuine local file-health analysis across user-accessible shared storage after explicit Android permission instead of relying on browser file pickers.

## Current architecture

```text
Premium local Web UI
        │
        ▼
NativeBridge (JavaScript interface)
        │
        ├── StorageAccessController
        │       └── Android-controlled broad storage permission
        │
        └── FileHealthScanner
                ├── Smart / Quick / Deep / Custom scan plans
                ├── storage-root discovery
                ├── iterative file crawler
                ├── metadata analysis
                ├── large-file count
                ├── modified-date count
                ├── same-size duplicate grouping
                └── streaming SHA-256 verification when enabled

Debug build pipeline
        │
        ├── stable .debug application ID
        ├── stable development-only signing key
        └── monotonically increasing versionCode
```

The WebView contains only local packaged assets. It is not a remote website shell. Native Android code remains authoritative for permissions, filesystem access, scanning, hashing, deletion, and platform truth.

## Scan Modes 04 behavior

Batch 04 adds four real scan strategies without replacing the proven scanner core.

### Smart

- Traverses accessible shared-storage roots for metadata analysis.
- Uses the standard high-value user locations (Downloads, DCIM, Pictures, Movies, Documents) as the duplicate-verification coverage when those locations exist.
- Same-size candidates inside that coverage are verified by full-file streaming SHA-256.
- This is the default balance between breadth and expensive hashing.

### Quick

- Targets high-value user locations when available.
- Performs metadata analysis for large and older files.
- Deliberately skips SHA-256 duplicate verification so the UI never labels same-size candidates as exact duplicates.
- Falls back to accessible shared storage only when no standard high-value locations exist.

### Deep

- Preserves the prior full scanner behavior.
- Traverses accessible shared storage.
- Groups non-empty files by exact byte size.
- Streams SHA-256 across all same-size candidates in the accessible scan scope.
- Reports duplicates only after hashes match.

### Custom

- Lets the UI choose among Downloads, Photos, Videos, Documents, and Music.
- Duplicate verification can be enabled or disabled independently.
- If the UI provides no usable custom target, the scanner safely falls back to priority user locations rather than pretending it scanned a missing location.

## Progress model

There is no fabricated universal scan percentage.

- During file discovery the total amount of work is unknown, so the UI uses indeterminate activity while showing real counters.
- During duplicate verification the candidate byte total is known, so progress is derived from actual bytes read by SHA-256 hashing.
- Quick scans and Custom scans with duplicate verification disabled remain indeterminate until real native work completes.
- Completion is emitted only after the native engine finishes its corresponding work.

## Persistent development signing

Debug builds use `com.benedictinteractive.bearagnostic.debug` and the repository development key at:

`signing/bearagnostic-debug.jks`

The development signing identity remains unchanged in Scan Modes 04. Release signing remains separate and private.

## Security and privacy boundaries

- The app does not bypass Android sandboxing.
- `MANAGE_EXTERNAL_STORAGE` does not grant private internal storage of other apps.
- `Android/data` and `Android/obb` remain deliberately excluded from traversal.
- File contents are read only when needed for enabled SHA-256 duplicate verification.
- There is no network upload path in the scanner.
- There is no deletion path in this batch.
- A future cleanup flow must require explicit review and confirmation before destructive action.

## Resource safety

- Scanning runs on a dedicated single background executor.
- Directory traversal remains iterative rather than recursive.
- Symbolic links are ignored.
- Progress events remain throttled.
- Hashing remains limited to same-size candidate groups.
- Cancellation remains cooperative throughout traversal and hashing.
- Aggregate long arithmetic remains saturated to avoid overflow.

## Next production responsibility

After Scan Modes 04 is CI compile-verified and physically tested, the next logical layer is a reviewable result model and deterministic junk/risk classification. Destructive cleanup remains a separate responsibility.
