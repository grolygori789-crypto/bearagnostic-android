# Bearagnostic Android Architecture

## Product purpose

The Android edition exists so Bearagnostic can perform a genuine one-tap file-health checkup across user-accessible shared storage after explicit Android permission instead of relying on browser file pickers.

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
                ├── storage-root discovery
                ├── iterative file crawler
                ├── metadata analysis
                ├── large-file count
                ├── modified-date count
                ├── same-size duplicate grouping
                └── full-file SHA-256 verification
```

The WebView contains only local packaged assets. It is not a remote website shell. Native Android code remains authoritative for permissions, filesystem access, scanning, hashing, deletion, and platform truth.

## Native Scanner 02 behavior

After storage access is granted, one tap starts a native background scan.

The crawler:

1. discovers accessible shared-storage roots;
2. traverses them iteratively rather than recursively to avoid call-stack growth;
3. ignores symbolic links to reduce loop risk;
4. counts real files and bytes reviewed;
5. detects files at least 100 MB;
6. detects files older than 365 days using actual `lastModified` values;
7. groups non-empty files by exact byte size;
8. hashes only same-size candidate groups using SHA-256;
9. counts duplicate groups and extra copies only after full hashes match;
10. reports aggregate results to the local UI.

The scanner does not persist filenames, paths, file contents, or hashes. Results currently live only for the active UI session.

## Progress model

There is no fabricated universal scan percentage.

- During file discovery the total amount of work is unknown, so the UI uses indeterminate activity while showing real counters.
- During duplicate verification the candidate byte total is known, so progress is derived from actual bytes read by SHA-256 hashing.
- Completion is emitted only after the native engine finishes its real work.

## Security and privacy boundaries

- The app does not bypass Android sandboxing.
- `MANAGE_EXTERNAL_STORAGE` does not grant private internal storage of other apps.
- `Android/data` and `Android/obb` are deliberately excluded from traversal.
- File contents are read only when needed to verify same-size duplicate candidates.
- There is no network upload path in the scanner.
- There is no deletion path in Native Scanner 02.
- A future cleanup flow must require explicit review and confirmation before any destructive action.

## Resource safety

- Scanning runs on a dedicated single background executor.
- The UI receives throttled progress events rather than an event for every file byte.
- Duplicate hashing is limited to files that already share an exact size with another file.
- Cancellation is cooperative and checked throughout traversal and hashing.
- Long arithmetic is saturated to avoid accidental overflow in aggregate counters.

## Next production responsibility

The next scanner milestone should add a reviewable result model for duplicate groups, large files, and older files without introducing silent deletion. Cleanup remains a separate responsibility from scanning.
