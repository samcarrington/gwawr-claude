# task-48 - Calculate blog read time dynamically

## Description (the why)

We no longer want to rely on a manually-entered `readTime` field in Contentful. Instead, compute an estimated read-time on the fly from the blog article content. This keeps the CMS model simpler and guarantees accuracy if posts change. To achieve this we must decide on an appropriate open-source dependency (e.g. `reading-time`, `reading-time-estimator`) or an in-house implementation.

## Acceptance Criteria (the what)

- [ ] **Decision recorded** – Select and document the dependency / approach for read-time calculation.  Decision file created in `backlog/decisions/` and linked here.
- [ ] **Utility implemented** – A composable/utility (e.g. `useReadTime.ts`) computes read time from raw Markdown/HTML.
- [ ] **UI updated** – Blog list and detail components display computed read time.
- [ ] **Accuracy** – Calculated read time is within ±10 % of `reading-time` reference for sample posts.
- [ ] **Performance** – Calculation adds ≤ 5 ms P95 client CPU for a 5 kB article.
- [ ] **Tests** – Unit tests cover short, medium, and long articles.
- [ ] **Docs updated** – README / developer docs describe the usage and chosen dependency.

## Implementation Plan (the how)

1. Research lightweight libraries for read-time estimation (bundle size, licence).
2. Record decision in `decision-8-read-time-dependency.md` with pros/cons & rationale.
3. Add chosen dependency to `package.json`.
4. Implement `useReadTime` composable accepting Markdown string.
5. Remove Read Time field from Contentful using the Contentful MCP
5. Update blog list & detail components to call the composable.
6. Write Vitest unit tests for utility and component rendering.
7. Update documentation.

## Dependencies

- Await publication of decision `decision-8-read-time-dependency.md`.
