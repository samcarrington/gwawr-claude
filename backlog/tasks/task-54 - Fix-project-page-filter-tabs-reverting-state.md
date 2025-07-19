---
id: task-54
title: Fix project page filter tabs reverting state
status: To Do
assignee: []
created_date: '2025-07-19'
labels: []
dependencies: []
---

## Description

The filter tabs on the projects page (`/projects`) are not maintaining their selected state when users navigate away from the page and return, or when the page is refreshed. This creates a poor user experience as users lose their filter selections and must re-select their desired filters.

### Investigation Findings

After examining the codebase, the root cause has been identified:

1. **Location**: `composables/useProjects.ts` - `useProjectFilter()` function (lines 99-168)
2. **Issue**: The filter state is managed using basic `ref()` reactive references:
   - `selectedCategory = ref<string>('All')`
   - `selectedStatus = ref<string>('All')`
   - `searchQuery = ref<string>('')`
   - `showFeaturedOnly = ref<boolean>(false)`

3. **Root Cause**: These refs are recreated every time the composable is called, meaning state is lost on:
   - Page navigation
   - Page refresh
   - Component re-mounting

### Resolution Plan

Implement persistent state management for filter selections using one of these approaches:

**Option 1 (Recommended)**: Use URL query parameters
- Store filter state in URL query parameters
- Use `useRoute()` and `navigateTo()` to sync state with URL
- Provides shareable URLs and browser back/forward support

**Option 2**: Use session storage
- Store filter state in `sessionStorage`
- Persist during browser session but reset on new session

**Option 3**: Use Nuxt's `useState()` composable
- Provides SSR-safe reactive state that persists during navigation

## Acceptance Criteria

### Functional Requirements
- [ ] Filter selections (category, status, search, featured) persist when navigating away from projects page and returning
- [ ] Filter selections persist through page refresh
- [ ] Filter selections persist through browser back/forward navigation
- [ ] Initial page load respects any existing filter state (URL params or stored state)
- [ ] Filter state is properly synchronized between UI controls and underlying data
- [ ] Projects grid updates correctly when filters are applied
- [ ] URL is updated to reflect current filter state (if using URL approach)
- [ ] Filter state resets appropriately when user explicitly clears filters

### Testing Requirements
- [ ] **Unit Tests**: Create tests for `useProjectFilter()` composable covering:
  - [ ] State persistence across composable re-initialization
  - [ ] Proper state restoration from storage/URL
  - [ ] Filter state synchronization with project data fetching
  - [ ] Reset functionality works correctly
- [ ] **Integration Tests**: Create tests for projects page covering:
  - [ ] Filter UI controls update correctly when state is restored
  - [ ] Projects grid reflects correct filtered results
  - [ ] Navigation preserves filter state
- [ ] **E2E Tests**: Create Playwright/Cypress tests covering:
  - [ ] User can set filters, navigate away, and return to see same filters
  - [ ] Page refresh maintains filter selections
  - [ ] Browser back/forward maintains filter state
  - [ ] Shareable URLs work correctly (if URL approach is used)

### Technical Requirements
- [ ] Implementation follows Vue 3 Composition API best practices
- [ ] State management is SSR-compatible (no hydration mismatches)
- [ ] Performance impact is minimal (no unnecessary re-renders or API calls)
- [ ] Code follows existing project patterns and TypeScript standards
- [ ] Proper error handling for state restoration failures
