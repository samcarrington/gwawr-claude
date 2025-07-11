---
id: task-medium.1
title: Enhance project content type with portfolio features
status: To Do
assignee: []
created_date: '2025-07-11'
updated_date: '2025-07-11'
labels:
  - contentful
  - content-modeling
  - projects
dependencies:
  - task-14
parent_task_id: task-medium
---

## Description

Add missing fields to the project content type to support external links, portfolio highlighting, and project lifecycle tracking. These enhancements will improve the portfolio effectiveness and user experience.

## Acceptance Criteria

- [ ] Add liveUrl field (Symbol
- [ ] optional) with URL validation
- [ ] Add repositoryUrl field (Symbol
- [ ] optional) with URL validation
- [ ] Add featured field (Boolean
- [ ] default false) for portfolio highlighting
- [ ] Add endDate field (Date
- [ ] optional) for project duration tracking
- [ ] Add status field (Symbol
- [ ] default completed) with validation options
- [ ] All fields properly validated and configured
- [ ] Migration script created and tested
- [ ] Existing project entries updated with relevant field values
- [ ] Featured projects properly identified and marked

## Implementation Plan

1. Review current project content type structure in Contentful
2. Create migration script for adding new project fields
3. Add liveUrl field with URL validation pattern
4. Add repositoryUrl field with URL validation pattern
5. Add featured field as Boolean with default false
6. Add endDate field as Date for project duration tracking
7. Add status field with validation for completed/in-progress/planned
8. Test migration script in development environment
9. Execute migration script via MCP or Contentful CLI
10. Update existing project entries with relevant data
11. Identify and mark 2-3 best projects as featured
12. Verify all fields work correctly in Contentful interface
