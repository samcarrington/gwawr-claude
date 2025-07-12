---
id: task-42
title: Fix buffer usage in composables for browser compatibility
status: To Do
assignee: []
created_date: '2025-07-12'
labels: []
dependencies: []
---

## Description

Replace Node.js buffer usage with browser-compatible alternatives in composables, following the pattern established in the blog composable

## Acceptance Criteria

- [ ] All composables use browser-compatible encoding/decoding
- [ ] No Node.js buffer usage remains in browser code
- [ ] All affected composables work correctly in browser environment
