---
id: task-medium.2
title: Enhance testimonial content type with rating and client features
status: To Do
assignee: []
created_date: '2025-07-11'
updated_date: '2025-07-11'
labels:
  - contentful
  - content-modeling
  - testimonials
dependencies:
  - task-14
parent_task_id: task-medium
---

## Description

Add missing fields to the testimonial content type to support rating system, testimonial highlighting, and improved client data management. These enhancements will increase testimonial impact and provide better client attribution.

## Acceptance Criteria

- [ ] Add clientName field (Symbol
- [ ] required) for direct client attribution
- [ ] Add clientTitle field (Symbol
- [ ] optional) for client job title
- [ ] Add clientCompany field (Symbol
- [ ] optional) for client company
- [ ] Add rating field (Integer
- [ ] optional) with 1-5 range validation
- [ ] Add featured field (Boolean
- [ ] default false) for testimonial highlighting
- [ ] Add projectReference field (Link to project
- [ ] optional) for context
- [ ] All fields properly validated and configured
- [ ] Migration script created and tested
- [ ] Existing testimonial entry updated with new field values
- [ ] Client data properly migrated from person links to direct fields

## Implementation Plan

1. Review current testimonial content type structure in Contentful
2. Create migration script for adding new testimonial fields
3. Add clientName field as Symbol for direct client attribution
4. Add clientTitle field as Symbol for client job title
5. Add clientCompany field as Symbol for client company
6. Add rating field as Integer with 1-5 range validation
7. Add featured field as Boolean with default false
8. Add projectReference field as Link to project content type
9. Test migration script in development environment
10. Execute migration script via MCP or Contentful CLI
11. Update existing testimonial entry with new field values
12. Migrate client data from person links to direct fields
13. Verify all fields work correctly in Contentful interface
