# Task 51 – Fix TypeScript Errors in Contentful Integration

## Background

During the refactoring of `renderMarkdown` to async (Task 49), several TypeScript errors were identified related to Contentful type definitions. These errors are primarily due to mismatches between the Contentful SDK's native types and our custom type definitions, as well as issues with query parameters in API routes.

## Problem Statement

1. Type mismatches between Contentful SDK's `Entry` types and our custom `ContentfulEntry` types
2. Issues with query parameters like 'order' in API routes not matching expected types from Contentful SDK
3. Incomplete or incorrect type definitions for `ContentfulQueryOptions`

## Affected Files / Functions

| Layer | Path | Symbols |
|-------|------|---------|
| Types | `types/contentful.ts` | `ContentfulEntry`, `ContentfulQueryOptions` |
| Services | `services/contentfulService.ts` | Query parameters in various methods |
| Composables | `composables/useContentful.ts` | Type definitions and query parameters |
| Server API | `server/api/blog/**/*.ts`, `server/api/projects/**/*.ts` | Query parameters in API routes |

## Subtasks

- [ ] **Update ContentfulEntry type** to be compatible with Contentful SDK's Entry type
  - [ ] Fix the `sys.locale` type to allow for `undefined`
  - [ ] Ensure other properties match the SDK's Entry type structure

- [ ] **Fix ContentfulQueryOptions type** to properly support Contentful query parameters
  - [ ] Update the type to include all valid query parameters
  - [ ] Fix the type for the 'order' parameter to match SDK expectations

- [ ] **Update API routes** to use correct query parameter types
  - [ ] Fix 'order' parameter in all API routes
  - [ ] Fix other query parameters that cause type errors

- [ ] **Update services and composables** to use correct types
  - [ ] Fix type errors in contentfulService.ts
  - [ ] Fix remaining type errors in useContentful.ts

## Acceptance Criteria

1. All TypeScript errors related to Contentful types are resolved
2. No regressions in functionality when querying Contentful
3. Unit tests are updated or added to verify:
   - Type compatibility between our custom types and Contentful SDK types
   - Correct handling of query parameters
   - Proper error handling for type mismatches

## Testing Strategy

1. **Unit tests for type compatibility**:
   ```typescript
   // Before: Type error due to incompatible types
   const sdkEntry: Entry<EntrySkeletonType> = {...}
   const ourEntry: ContentfulEntry<ContentfulBlogPost> = sdkEntry // Error!

   // After: Types are compatible
   const sdkEntry: Entry<EntrySkeletonType> = {...}
   const ourEntry: ContentfulEntry<ContentfulBlogPost> = sdkEntry // No error
   ```

2. **Unit tests for query parameters**:
   ```typescript
   // Before: Type error with order parameter
   const query: ContentfulQueryOptions = {
     order: '-fields.publishedAt', // Error!
   }

   // After: No type error
   const query: ContentfulQueryOptions = {
     order: '-fields.publishedAt', // Valid
   }
   ```

3. **Integration tests** to verify API routes work correctly with updated types

## Priority / Effort

Medium priority, medium effort. These type errors don't prevent the application from functioning but should be fixed to ensure type safety and developer experience.
