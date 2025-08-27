---
id: task-64
title: Review and refactor useProjects composable architecture for better testability
status: To Do
assignee: []
created_date: '2025-08-27'
labels: []
dependencies: []
---

## Description

The useProjects composable has complex interdependencies that make unit testing difficult. The composable internally calls other composables and makes real API calls during tests, making it hard to mock properly. This affects test reliability and coverage.

## Acceptance Criteria

- [ ] Analyze current useProjectFilter composable architecture and identify testability issues
- [ ] Design a more testable architecture that allows proper mocking of dependencies
- [ ] Refactor composable to use dependency injection or other patterns for better testability
- [ ] Update tests to achieve higher coverage with reliable mocking
- [ ] Document testing patterns for other composables in the codebase
