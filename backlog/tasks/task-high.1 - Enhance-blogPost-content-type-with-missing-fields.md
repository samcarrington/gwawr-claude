---
id: task-high.1
title: Enhance blogPost content type with missing fields
status: To Do
assignee: []
created_date: '2025-07-11'
updated_date: '2025-07-11'
labels:
  - contentful
  - content-modeling
  - blog
dependencies:
  - task-14
parent_task_id: task-high
---

## Description

Add the missing fields to the blogPost content type to support URL routing, categorization, publication workflow, and featured content highlighting. This is the highest priority content type enhancement as it breaks core blog functionality without these fields.

## Acceptance Criteria

- [ ] Add slug field (Symbol, required, unique) with URL pattern validation
- [ ] Add category field (Symbol, required) with predefined category options
- [ ] Add tags field (Array of Symbols, optional) with size validation
- [ ] Add publishedAt field (DateTime, required) for publication workflow
- [ ] Add readTime field (Integer, optional) with range validation
- [ ] Add featured field (Boolean, default false) for content highlighting
- [ ] All fields properly validated and configured
- [ ] Migration script created and tested
- [ ] Existing blog entry updated with new field values

## Implementation Plan

1. Review current blogPost content type structure in Contentful
2. Create migration script for Phase 1 (adding optional fields)
3. Add slug field with unique validation and URL pattern
4. Add category field with predefined validation options
5. Add tags field as array of symbols with size limits
6. Add publishedAt field as DateTime for publication workflow
7. Add readTime field as Integer with range validation
8. Add featured field as Boolean with default false
9. Test migration script in development environment
10. Execute migration script via MCP or Contentful CLI
11. Update existing blog entry with new field values
12. Verify all fields work correctly in Contentful interface
