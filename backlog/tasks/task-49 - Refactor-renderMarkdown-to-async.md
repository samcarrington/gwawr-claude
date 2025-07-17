# Task 49 – Refactor `renderMarkdown` and Call-Chain to Async

## Notes

Rendered by Windsurf

## Background

The `marked` library (v5+) now returns a **Promise**. Our utility `renderMarkdown` currently assumes a synchronous return value. This discrepancy risks silent failures when the library is upgraded or when tree-shaking pulls the ESM build.

## Problem Statement

1. `renderMarkdown` must become **`async`** and `await marked()`.
2. The current synchronous call-chain relies on `renderMarkdown` returning a string. Making it async propagates up through multiple layers (utilities → transformers → composables/services → Vue components → API routes).

```
renderMarkdown (utils)  ⟶  renderContent  ⟶  processRichText
                                    ⟶  transformBlogPost / transformProject
                                          ⟶  services & composables (contentfulService, useContentful, etc.)
                                                ⟶  Vue components (AtomsContentRenderer) & server API routes
```

## Affected Files / Functions (non-exhaustive)

| Layer | Path | Symbols |
|-------|------|---------|
| Utility | `utils/contentful-transformers.ts` | `renderMarkdown`, `renderContent`, `processRichText`, `transformBlogPost`, `transformProject` |
| Components | `components/atoms/content/AtomsContentRenderer.vue` | `renderContent` usage |
| Services | `services/contentfulService.ts` | `transformBlogPost`, `transformProject` results |
| Composables | `composables/useContentful.ts`, `composables/useProjects.ts`, others | Calls to transformers |
| Server API | `server/api/blog/**/*.ts` | Calls to transformers |
| Pages | `pages/**/*.vue` (indirect) | Rely on composables/services |
| Tests | `tests/**/*` | Any mocks of markdown rendering |

## Tasks

- [ ] **Refactor `renderMarkdown`** to `export async function renderMarkdown(markdown: string): Promise<string>`.
- [ ] **Update `renderContent`** to detect Promise return and `await` as needed (make it async).
- [ ] **Make `processRichText` async** and propagate awaiting.
- [ ] **Update transformers** (`transformBlogPost`, `transformProject`, etc.) to `async` + `await` internal calls.
- [ ] **Update services & composables** (`contentfulService.ts`, `useContentful.ts`, `useProjects.ts`, etc.) to await transformer results.
- [ ] **Update Vue components** (`AtomsContentRenderer.vue`, any others) to support async rendering (use `async setup` or `onMounted` / `computed` with `await`).
- [ ] **Update server API routes** that rely on synchronous transformers.
- [ ] **Adjust TypeScript types** across updated functions/components.
- [ ] **Update unit/integration tests** and mocks for Promise-based markdown rendering.
- [ ] **QA regression pass** on blog posts, projects, and any markdown-rendering areas.

## Acceptance Criteria

1. All markdown content continues to render correctly after upgrading `marked` to Promise-based version.
2. No synchronous function remains that incorrectly handles a Promise return from `marked`.
3. TypeScript compiles without errors; CI tests pass.
4. No runtime warnings/errors in browser or server logs related to markdown rendering.

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Large refactor touch-points across codebase | Incremental PRs by layer, extensive unit tests |
| Vue component async rendering flicker | Use suspense / loading placeholders where required |
| API performance impact | Await once per request path; cache rendered HTML if needed |

## Priority / Effort

Medium–high effort (multi-file refactor), high priority once `marked` upgrade is planned.
