---
id: task-36
title: Fix ID conversion issue in contentful transformers
status: Done
assignee: []
created_date: '2025-07-11'
updated_date: '2025-07-11'
labels:
  - contentful
  - bug-fix
  - data-integrity
dependencies: []
priority: high
---

## Description

Fix the critical issue where Contentful entry IDs were being converted from strings to numbers using parseInt with radix 36, which can cause ID collisions and unexpected behavior. Update all related interfaces and data to use string IDs consistently.

## Acceptance Criteria

- [ ] BlogPost interface updated to use string ID instead of number
- [ ] contentful-transformers.ts updated to use entry.sys.id directly as string
- [ ] Mock blog data updated to use Contentful-style string IDs
- [ ] All Vue components verified to work with string IDs
- [ ] No breaking changes to existing functionality
- [ ] ID uniqueness and consistency maintained
- [ ] Type safety preserved throughout application

## Implementation Plan

1. Identify the issue: parseInt with radix 36 on Contentful IDs causing potential collisions
2. Update BlogPost interface to use string ID instead of number
3. Update contentful-transformers.ts to use entry.sys.id directly as string
4. Update mock blog data to use Contentful-style string IDs
5. Verify all Vue components work correctly with string IDs
6. Test ID comparison operations in related posts functionality
7. Ensure no breaking changes to existing functionality
8. Document the change and reasoning behind it

## Implementation Notes

Successfully fixed critical ID conversion issue. Changed BlogPost interface from number to string ID, updated transformer to use entry.sys.id directly instead of parseInt(entry.sys.id, 36), and updated mock data to use Contentful-style string IDs. All Vue components already work correctly with string IDs since they use them as keys and comparison values. This fix prevents potential ID collisions and ensures consistency with Contentful's actual ID format.
