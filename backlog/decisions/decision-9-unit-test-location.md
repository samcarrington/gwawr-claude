# Decision 9 – Colocate Utility Unit Tests with Source Files

Date: 2025-07-14

## Context

Historically, most component tests live under `/components/**/ComponentName.test.ts`.  Utilities under `utils/` lacked a clear convention; some existing tests reside next to their definitions (e.g., `utils/foo.test.ts`), while new tests were recently added under `/tests/`.

## Decision

* **All unit tests for files in `utils/` will be *colocated* with the source file** (same folder, `*.test.ts`).
* Component and page tests remain in their respective component folders.
* Integration or e2e tests may still live in dedicated `tests/` sub-trees.

## Rationale

1. **Discoverability** – Developers editing a util see its test immediately.
2. **Encapsulation** – Utils are self-contained; colocated tests encourage small, focused specs.
3. **Consistency** – Mirrors existing component testing approach.
4. **Simpler Import Paths** – Relative imports (`./util`) work in both src and test.

## Consequences

* Existing util tests under `/tests/` should be migrated alongside their files.
* `vitest.config.ts` already includes the entire repo, so no path changes are required.
* CI coverage remains unaffected.
