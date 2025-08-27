---
id: decision-10
title: Contentful Order Field Typing Approaches
date: '2025-07-22'
status: proposed
---

## Context

Contentful's TypeScript definitions have strict typing for the `order` parameter that only recognizes system fields and a limited set of predefined paths. When using custom content type fields like `'-fields.publishedAt'` for ordering, TypeScript throws errors even though these fields work perfectly at runtime.

## Problem Statement

We need to handle custom field ordering in Contentful queries while maintaining type safety and avoiding the use of `as any` which sacrifices TypeScript benefits.

## Current State

- Using `as any` type assertion to bypass strict typing (regressive approach)
- Multiple API endpoints affected: blog posts, projects, testimonials
- Custom fields like `publishedAt`, `date`, `rating` need ordering support

## Possible Approaches

### 1. Type Assertion with `as any` (Current)

**Pros:**
- Quick fix, minimal code changes
- Works immediately with existing codebase
- Consistent with some existing endpoints

**Cons:**
- Sacrifices type safety completely
- No IntelliSense or compile-time checking
- Regressive approach that hides potential issues
- Makes refactoring more dangerous
- Goes against TypeScript best practices

### 2. Module Augmentation (Extend Contentful Types)

**Pros:**
- Maintains full type safety
- Extends official types properly
- Reusable across entire codebase
- Future-proof for new custom fields
- Preserves IntelliSense and autocomplete

**Cons:**
- Requires understanding of Contentful's internal type structure
- More complex initial setup
- Need to maintain as Contentful SDK updates

### 3. Custom Wrapper Types

**Pros:**
- Full control over typing
- Can create domain-specific interfaces
- Type-safe and maintainable
- Clear separation of concerns

**Cons:**
- More boilerplate code
- Need to maintain wrapper functions
- Potential for type/runtime mismatch

### 4. Utility Types with Template Literals

**Pros:**
- Leverages TypeScript 4.1+ template literal types
- Can generate field paths dynamically
- Type-safe and flexible
- Modern TypeScript approach

**Cons:**
- Complex type definitions
- Requires advanced TypeScript knowledge
- May impact compilation performance

### 5. Selective Type Assertion

**Pros:**
- Maintains type safety for most properties
- Only bypasses typing for specific problematic fields
- Minimal impact on existing code

**Cons:**
- Still uses type assertion (partial regression)
- Not a complete solution
- Inconsistent typing approach

## Recommended Approach: Module Augmentation

Create a type declaration file that extends Contentful's `OrderFilterPaths` to include our custom fields:

```typescript
// types/contentful-augmentation.d.ts
import 'contentful';

declare module 'contentful' {
  interface OrderFilterPaths<T, K> {
    // Blog post fields
    '-fields.publishedAt': string;
    'fields.publishedAt': string;
    
    // Project fields  
    '-fields.date': string;
    'fields.date': string;
    
    // Testimonial fields
    '-fields.rating': string;
    'fields.rating': string;
  }
}
```

## Implementation Plan

1. Create type augmentation file
2. Define all custom order fields used across the project
3. Update affected API endpoints to remove `as any`
4. Test type safety and runtime functionality
5. Document the approach for future custom fields

## Decision Criteria

- **Type Safety**: Must maintain compile-time checking
- **Maintainability**: Should be easy to extend for new fields
- **Performance**: Minimal impact on build/runtime performance
- **Developer Experience**: Preserve IntelliSense and autocomplete
- **Future-Proof**: Work with Contentful SDK updates

## Next Steps

1. Implement module augmentation approach
2. Remove `as any` assertions from existing endpoints
3. Test thoroughly across all affected API routes
4. Create documentation for adding new custom order fields

## References

- [TypeScript Module Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)
- [Contentful TypeScript Documentation](https://contentful.github.io/contentful.js/)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
