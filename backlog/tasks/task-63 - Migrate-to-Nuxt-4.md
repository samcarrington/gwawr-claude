---
id: task-63
title: Migrate to Nuxt 4
status: In Progress
assignee:
  - '@sam.carrington@frog.co'
created_date: '2025-08-18'
updated_date: '2025-08-18'
labels: []
dependencies: []
---

## Description

Upgrade the project from Nuxt 3 to Nuxt 4 following official migration guide and using recommended codemods for automated migration

## Acceptance Criteria

- [ ] Project builds successfully with Nuxt 4
- [ ] All existing functionality works without regression
- [ ] Directory structure follows Nuxt 4 conventions
- [ ] TypeScript configuration is updated correctly
- [ ] All tests pass after migration
- [ ] Dependencies are updated to compatible versions

## Implementation Plan

1. Verify current Nuxt 4 installation and dependencies
2. Run Nuxt 4 migration codemods to ensure full compatibility
3. Update directory structure to follow Nuxt 4 conventions (app/ folder)
4. Review and update TypeScript configuration for Nuxt 4
5. Update any deprecated patterns or APIs
6. Run full test suite and verify functionality
7. Update documentation and project setup instructions
8. Review performance improvements and new features
