# Design System Documentation

## Overview

This design system provides a consistent visual language and component library for the GWAWR website. Built using Tailwind CSS v4 with custom theme configuration, it ensures cohesive design across all pages and components.

## Theme Configuration

### Color Palette

Our color system uses semantic color names with full 50-950 scales:

#### Primary Colors (Blue)
- **Usage**: Main actions, links, branding elements
- **Scale**: `primary-50` (lightest) to `primary-950` (darkest)
- **Default**: `primary-500` (#3b82f6)

#### Secondary Colors (Emerald)
- **Usage**: Success states, secondary actions, positive feedback
- **Scale**: `secondary-50` to `secondary-950`
- **Default**: `secondary-500` (#10b981)

#### Tertiary Colors (Purple)
- **Usage**: Accents, highlights, special content
- **Scale**: `tertiary-50` to `tertiary-950`
- **Default**: `tertiary-500` (#a855f7)

#### Warning Colors (Amber)
- **Usage**: Warnings, caution states, attention-grabbing elements
- **Scale**: `warning-50` to `warning-950`
- **Default**: `warning-500` (#f59e0b)

#### Error Colors (Red)
- **Usage**: Error states, destructive actions, validation errors
- **Scale**: `error-50` to `error-950`
- **Default**: `error-500` (#ef4444)

### Typography Scale

Consistent font sizes and line heights for all text elements:

| Size | Value | Use Case |
|------|-------|----------|
| `text-xs` | 0.75rem (12px) | Small labels, captions |
| `text-sm` | 0.875rem (14px) | Body text, descriptions |
| `text-base` | 1rem (16px) | Default body text |
| `text-lg` | 1.125rem (18px) | Large body text |
| `text-xl` | 1.25rem (20px) | Small headings |
| `text-2xl` | 1.5rem (24px) | Section headings |
| `text-3xl` | 1.875rem (30px) | Page headings |
| `text-4xl` | 2.25rem (36px) | Hero headings |
| `text-5xl` | 3rem (48px) | Large hero headings |

### Spacing System

Consistent spacing values for padding, margins, and gaps:

- **Small**: `spacing-1` to `spacing-4` (4px to 16px)
- **Medium**: `spacing-6` to `spacing-12` (24px to 48px)
- **Large**: `spacing-16` to `spacing-32` (64px to 128px)
- **Extra Large**: `spacing-40` to `spacing-96` (160px to 384px)

### Border Radius

Standardized border radius for different component types:

- **Small Elements**: `radius-sm` (2px) - badges, tags
- **Standard Elements**: `radius-default` (4px) - inputs, buttons
- **Cards**: `radius-lg` (8px) - standard cards
- **Large Cards**: `radius-xl` (12px) - feature cards
- **Pills**: `radius-full` (9999px) - pill buttons, avatars

### Shadows

Consistent shadow system for depth and elevation:

- **Subtle**: `shadow-sm` - slight elevation
- **Default**: `shadow-default` - standard cards
- **Medium**: `shadow-md` - interactive elements
- **Large**: `shadow-lg` - floating panels
- **Extra Large**: `shadow-xl` - modals, overlays

## Component Tokens

### Card Components
- **Padding**: `--card-padding` (24px), `--card-padding-lg` (32px)
- **Radius**: `--card-radius` (12px)
- **Shadow**: `--card-shadow` with hover state `--card-shadow-hover`

### Button Components
- **Padding**: `--button-padding-x` (16px), `--button-padding-y` (8px)
- **Large Padding**: `--button-padding-x-lg` (24px), `--button-padding-y-lg` (12px)
- **Radius**: `--button-radius` (8px)

### Badge Components
- **Padding**: `--badge-padding-x` (12px), `--badge-padding-y` (4px)
- **Radius**: `--badge-radius` (full)

### Input Components
- **Padding**: `--input-padding-x` (12px), `--input-padding-y` (8px)
- **Radius**: `--input-radius` (6px)

### Layout Components
- **Section Padding**: `--section-padding-y` (48px), `--section-padding-y-lg` (80px)
- **Container Padding**: `--container-padding-x` (16px), `--container-padding-x-lg` (32px)

## Usage Guidelines

### Color Usage
1. Use primary colors for main actions and navigation
2. Use secondary colors for success states and positive actions
3. Use tertiary colors sparingly for accents and highlights
4. Use warning colors for caution states and important notices
5. Use error colors only for error states and destructive actions

### Typography Hierarchy
1. Use `text-4xl` or `text-5xl` for page heroes
2. Use `text-2xl` or `text-3xl` for section headings
3. Use `text-xl` for subsection headings
4. Use `text-base` for body content
5. Use `text-sm` for secondary information

### Spacing Guidelines
1. Use consistent spacing values from the scale
2. Maintain vertical rhythm with line-height values
3. Use larger spacing for section breaks
4. Use smaller spacing for related content groupings

### Component Consistency
1. All cards should use `--card-padding` and `--card-radius`
2. All buttons should use `--button-radius` and appropriate padding
3. All badges should use `--badge-radius` and `--badge-padding`
4. All inputs should follow `--input-radius` and `--input-padding`

## Implementation

The design system is implemented in `/assets/css/main.css` using Tailwind CSS v4 `@theme` configuration. All tokens are available as CSS custom properties and can be used throughout the application.

### Example Usage

```css
.custom-card {
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  background-color: var(--color-primary-50);
}

.custom-button {
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--button-radius);
  background-color: var(--color-primary-500);
  color: white;
}
```

### Tailwind Classes

All design tokens are available as Tailwind utility classes:

```html
<div class="bg-primary-500 text-white p-4 rounded-lg shadow-lg">
  <h2 class="text-2xl font-bold mb-4">Card Title</h2>
  <p class="text-sm">Card content</p>
</div>
```

## Maintenance

When updating the design system:

1. Update tokens in `/assets/css/main.css`
2. Test changes across all components
3. Update this documentation
4. Verify responsive behavior across breakpoints
5. Run automated tests to ensure no regressions

## Responsive Breakpoints

The design system uses Tailwind's default breakpoints:

- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Small desktops
- **xl**: 1280px - Large desktops
- **2xl**: 1536px - Extra large screens

All components should be designed mobile-first and progressively enhanced for larger screens.