---
id: task-57
title: Add navigation links from project tiles to detail pages
status: Done
assignee:
  - '@Cascade'
created_date: '2025-07-19'
updated_date: '2025-07-19'
labels:
  - navigation
  - ux
  - projects
  - components
dependencies:
  - task-56
parent_task_id: task-56
---

## Description

Add navigation links from project tiles/cards to their corresponding detail pages. While project detail pages were implemented in task-56, the project cards on the listing page currently only show "Live Demo" and "Repository" buttons but lack a "View Details" or "Learn More" link that would navigate users to the comprehensive project detail page.

### Background

Task-56 successfully implemented project detail pages with comprehensive project information, but users currently have no way to navigate from the project listing page to these detail pages. The project cards (`OrganismsCardsProject.vue`) need to include navigation links to `/projects/[slug]` routes.

### Current State

The `OrganismsCardsProject.vue` component currently includes:
- ✅ Project image, title, description
- ✅ Status and featured badges
- ✅ Technology tags
- ✅ "Live Demo" button (if `project.liveUrl` exists)
- ✅ "Repository" button (if `project.repositoryUrl` exists)
- ❌ **Missing**: Navigation links to project detail page
- ❌ **Missing**: Clickable image and title (standard UX pattern)

## Acceptance Criteria

### Component Updates
- [x] **Make project image clickable**
  - [x] Wrap project image in `NuxtLink` to `/projects/[project.slug]`
  - [x] Maintain hover effects and visual feedback
  - [x] Ensure proper accessibility with ARIA labels
  - [x] Preserve existing image styling and aspect ratios

- [x] **Make project title clickable**
  - [x] Wrap project title in `NuxtLink` to `/projects/[project.slug]`
  - [x] Add hover effects (underline, color change)
  - [x] Maintain typography styling and hierarchy
  - [x] Ensure proper semantic HTML structure

- [x] **Add "View Details" button to project cards**
  - [x] Primary button that navigates to `/projects/[project.slug]`
  - [x] Prominent placement (suggested: primary button in footer)
  - [x] Consistent styling with design system
  - [x] Accessible with proper ARIA labels

- [x] **Update button hierarchy in card footer**
  - [x] "View Details" as primary action
  - [x] "Live Demo" and "Repository" as secondary actions
  - [x] Proper visual hierarchy and spacing

### Navigation Implementation
- [x] **Implement proper routing**
  - [x] Use `NuxtLink` or `UButton` with `:to` prop
  - [x] Navigate to `/projects/[slug]` using project slug
  - [x] Ensure proper client-side navigation (no full page reload)

### User Experience
- [x] **Multiple navigation paths**
  - [x] Image, title, and "View Details" button all navigate to detail page
  - [x] Consistent navigation experience across all clickable elements
  - [x] Clear visual feedback for all interactive elements

- [x] **Hover and focus states**
  - [x] Image shows hover overlay or scale effect
  - [x] Title shows hover underline or color change
  - [x] Proper focus indicators for keyboard navigation
  - [x] Maintain accessibility for screen readers

- [x] **Loading states**
  - [x] Ensure smooth navigation experience
  - [x] Proper loading indicators on detail page

### Testing Requirements
- [x] **Functional testing**
  - [x] Verify all project cards have working detail links
  - [x] Test navigation from projects listing to detail pages
  - [x] Verify correct project detail page loads for each slug

- [x] **Accessibility testing**
  - [x] Keyboard navigation works correctly
  - [x] Screen reader announces navigation options properly
  - [x] Focus management during navigation

## Implementation Plan

1. **Update OrganismsCardsProject.vue component**
   - Add "View Details" button to footer template
   - Update button layout and hierarchy
   - Implement proper routing with project slug

2. **Test navigation flow**
   - Verify links work from projects listing page
   - Test with both mock and Contentful data
   - Ensure proper error handling for missing slugs

3. **Update any other project card components**
   - Check for other project card variants
   - Ensure consistency across all project displays

4. **Accessibility and UX review**
   - Test keyboard navigation
   - Verify screen reader compatibility
   - Ensure proper visual hierarchy

## Technical Notes

### Routing Pattern
```vue
<UButton
  :to="`/projects/${project.slug}`"
  variant="solid"
  color="primary"
  size="sm"
>
  <UIcon name="i-heroicons-eye" class="mr-1" />
  View Details
</UButton>
```

### Button Hierarchy Suggestion
- **Primary**: "View Details" (solid primary button)
- **Secondary**: "Live Demo" (outline button)
- **Tertiary**: "Repository" (ghost button)

## Acceptance Testing

### Manual Testing Checklist
- [ ] Navigate to `/projects` page
- [ ] Verify each project card shows "View Details" button
- [ ] Click "View Details" on multiple projects
- [ ] Confirm correct project detail page loads
- [ ] Test with keyboard navigation
- [ ] Verify button hierarchy and visual design

### Edge Cases
- [ ] Projects without slugs (should not happen with current data model)
- [ ] Projects with special characters in slugs
- [ ] Navigation from filtered project views
- [ ] Back button functionality from detail pages

## Priority

**High** - This is a critical UX gap that prevents users from accessing the comprehensive project detail pages that were implemented in task-56.

## Estimated Effort

**Small** - Primarily involves updating the project card component template and testing the navigation flow.
