# GWAWR Design System Guide

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Component Library](#component-library)
4. [Theme Configuration](#theme-configuration)
5. [Layout System](#layout-system)
6. [Development Guidelines](#development-guidelines)
7. [Maintenance & Versioning](#maintenance--versioning)

## Overview

The GWAWR Design System provides a comprehensive set of components, guidelines, and tools to ensure consistent, accessible, and maintainable user interfaces across the entire application. Built on Tailwind CSS v4 with custom theme configuration and atomic design principles.

### Key Features

- **Atomic Design**: Components organized by atoms, molecules, organisms, and templates
- **Cascade Naming**: Consistent naming convention for scalable component architecture
- **Theme-driven**: All styling controlled through centralized theme configuration
- **Responsive First**: Mobile-first approach with consistent breakpoints
- **Accessibility**: WCAG 2.1 AA compliance built-in
- **Type Safe**: Full TypeScript support with proper prop definitions

### Design Principles

1. **Consistency**: Uniform visual language across all components
2. **Accessibility**: Inclusive design for all users
3. **Performance**: Optimized for speed and efficiency
4. **Scalability**: Easy to extend and maintain
5. **Developer Experience**: Simple to use and understand

## Getting Started

### Installation & Setup

The design system is built into the project and automatically available through:

- **Components**: Auto-imported from `components/` directory
- **Utilities**: Available in `utils/layout-classes.ts`
- **Theme**: Configured in `app.config.ts` and `@theme.ts`

### Basic Usage

```vue
<template>
  <div>
    <!-- Using atomic components -->
    <AtomsTypographyPage size="large">Welcome</AtomsTypographyPage>

    <!-- Using layout templates -->
    <TemplatesLayoutsSection title="Features" background="neutral">
      <TemplatesLayoutsGrid :columns="3" gap="lg">
        <MoleculesCardsBase v-for="feature in features" :key="feature.id">
          <!-- Card content -->
        </MoleculesCardsBase>
      </TemplatesLayoutsGrid>
    </TemplatesLayoutsSection>
  </div>
</template>
```

## Component Library

### Atoms (Basic Building Blocks)

#### Typography Components

**AtomsTypographyPage**

- Purpose: Page-level headings and hero text
- Sizes: `small`, `default`, `large`, `hero`
- Spacing: `tight`, `default`, `loose`

```vue
<AtomsTypographyPage size="hero" spacing="default">
  Hi, I'm Sam Carrington
</AtomsTypographyPage>
```

**AtomsTypographySection**

- Purpose: Section headings and titles
- Sizes: `small`, `default`, `large`
- Alignment: `left`, `center`, `right`

```vue
<AtomsTypographySection size="large" align="center">
  What I Do
</AtomsTypographySection>
```

**AtomsTypographyCard**

- Purpose: Card titles and content headings
- HTML Tags: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`
- Spacing: `tight`, `default`, `loose`

```vue
<AtomsTypographyCard tag="h3" size="large" spacing="tight">
  Project Title
</AtomsTypographyCard>
```

#### Button Components

**AtomsButtonsBase**

- Purpose: Core button component with all variants
- Colors: `primary`, `secondary`, `tertiary`, `success`, `warning`, `error`, `neutral`
- Variants: `solid`, `outline`, `soft`, `ghost`, `link`
- Sizes: `xs`, `sm`, `md`, `lg`, `xl`

```vue
<AtomsButtonsBase
  color="primary"
  variant="solid"
  size="lg"
  @click="handleClick"
>
  <template #leading>
    <UIcon name="i-heroicons-plus" />
  </template>
  Add Item
</AtomsButtonsBase>
```

**AtomsButtonsPrimary / AtomsButtonsSecondary**

- Purpose: Specialized button variants
- Pre-configured with specific colors and styling

```vue
<AtomsButtonsPrimary size="lg" shadow>
  Primary Action
</AtomsButtonsPrimary>

<AtomsButtonsSecondary size="lg">
  Secondary Action
</AtomsButtonsSecondary>
```

#### Badge Components

**AtomsBadges**

- Purpose: Status indicators and category labels
- Variants: `default`, `primary`, `secondary`, `tertiary`, `success`, `warning`, `error`
- Sizes: `xs`, `sm`, `md`, `lg`
- Styles: `solid`, `outline`

```vue
<AtomsBadges variant="primary" size="sm" :outline="false">
  New
</AtomsBadges>
```

### Molecules (Component Combinations)

#### Card Components

**MoleculesCardsBase**

- Purpose: Basic card container with consistent styling
- Variants: `default`, `elevated`, `outlined`
- Padding: `sm`, `md`, `lg`

```vue
<MoleculesCardsBase variant="elevated" padding="lg">
  <template #header>
    <h3>Card Title</h3>
  </template>
  <template #content>
    <p>Card content goes here</p>
  </template>
  <template #footer>
    <button>Action</button>
  </template>
</MoleculesCardsBase>
```

**MoleculesCardsImage**

- Purpose: Card with image and content
- Image positions: `top`, `left`, `right`
- Aspect ratios: `square`, `video`, `card`

```vue
<MoleculesCardsImage
  :image="imageUrl"
  :alt="imageAlt"
  image-position="top"
  aspect-ratio="card"
>
  <template #content>
    <h4>Image Card Title</h4>
    <p>Description text</p>
  </template>
</MoleculesCardsImage>
```

#### List Components

**MoleculesListsTags**

- Purpose: Tag lists with consistent spacing
- Variants: `default`, `compact`, `loose`
- Colors: Inherits from badge system

```vue
<MoleculesListsTags :tags="technologies" variant="compact" />
```

### Organisms (Complex Components)

#### Card Organisms

**OrganismsCardsProject**

- Purpose: Project showcase cards
- Features: Image, title, description, tags, links
- Responsive: Adapts to grid layouts

**OrganismsCardsSkill**

- Purpose: Skill/service cards
- Features: Icon, title, description, technology list
- Layout: Vertical with centered content

**OrganismsCardsBlog**

- Purpose: Blog post cards
- Features: Image, title, excerpt, metadata
- States: Default, featured, compact

**OrganismsCardsTestimonial**

- Purpose: Client testimonial cards
- Features: Quote, author, company, avatar
- Layout: Quote-first with author attribution

#### Navigation Organisms

**OrganismsNavigationHeader**

- Purpose: Site header with navigation
- Features: Logo, navigation links, responsive menu
- Responsive: Hamburger menu on mobile

**OrganismsNavigationFooter**

- Purpose: Site footer with links and info
- Features: Link groups, social media, legal links
- Layout: Multi-column responsive design

#### Section Organisms

**OrganismsSectionsCallToAction**

- Purpose: CTA sections with buttons
- Variants: `light`, `dark`, `primary`, `secondary`
- Features: Title, description, button slots

```vue
<OrganismsSectionsCallToAction
  variant="dark"
  title="Ready to Get Started?"
  description="Join thousands of developers building amazing projects."
>
  <template #primary-button="{ variant, classes }">
    <AtomsButtonsBase :variant="variant" :class="classes">
      Get Started
    </AtomsButtonsBase>
  </template>
</OrganismsSectionsCallToAction>
```

### Templates (Layout Patterns)

#### Layout Templates

**TemplatesLayoutsHero**

- Purpose: Hero section layouts
- Variants: `gradient`, `solid`, `image`
- Sizes: `small`, `medium`, `large`, `fullscreen`
- Features: Title, subtitle, actions, content slots

```vue
<TemplatesLayoutsHero variant="gradient" size="fullscreen" background="primary">
  <template #title>
    <span class="text-primary">Your Name</span>
  </template>
  <template #subtitle>
    <p>Your professional tagline</p>
  </template>
  <template #actions>
    <AtomsButtonsPrimary size="lg">Get Started</AtomsButtonsPrimary>
  </template>
</TemplatesLayoutsHero>
```

**TemplatesLayoutsGrid**

- Purpose: Grid layout containers
- Columns: 1-6 with responsive breakpoints
- Gaps: `xs`, `sm`, `md`, `lg`, `xl`
- Features: Header, footer, responsive behavior

```vue
<TemplatesLayoutsGrid
  :columns="3"
  gap="lg"
  title="Our Services"
  description="What we offer"
  header-align="center"
  background="neutral"
>
  <OrganismsCardsSkill 
    v-for="skill in skills" 
    :key="skill.id"
    :skill="skill"
  />
</TemplatesLayoutsGrid>
```

**TemplatesLayoutsSection**

- Purpose: Content section containers
- Variants: `default`, `featured`, `highlight`
- Alignment: `left`, `center`, `right`
- Features: Max width, borders, backgrounds

```vue
<TemplatesLayoutsSection
  variant="featured"
  title="About Us"
  description="Our story and mission"
  max-width="2xl"
  content-align="center"
  background="white"
  :bordered="true"
  :rounded="true"
>
  <p>Section content goes here</p>
</TemplatesLayoutsSection>
```

## Theme Configuration

### Color System

The design system uses a semantic color approach with full 50-950 scales:

#### Primary Colors

- **Purpose**: Main brand colors, primary actions
- **Scale**: `primary-50` (lightest) to `primary-950` (darkest)
- **Usage**: Buttons, links, important elements

#### Secondary Colors

- **Purpose**: Supporting actions, success states
- **Scale**: `secondary-50` to `secondary-950`
- **Usage**: Secondary buttons, positive feedback

#### Tertiary Colors

- **Purpose**: Accents and highlights
- **Scale**: `tertiary-50` to `tertiary-950`
- **Usage**: Special content, creative elements

#### System Colors

- **Success**: Green tones for positive actions
- **Warning**: Amber tones for caution states
- **Error**: Red tones for destructive actions
- **Neutral**: Gray tones for text and backgrounds

### Typography Scale

```javascript
// @theme.ts
fontSize: {
  'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  'display': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
  'title': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
  'heading': ['1.5rem', { lineHeight: '1.4' }],
  'body': ['1rem', { lineHeight: '1.6' }],
  'caption': ['0.875rem', { lineHeight: '1.5' }],
}
```

### Spacing System

```javascript
// @theme.ts
spacing: {
  'section-xs': '2rem',    // 32px
  'section-sm': '3rem',    // 48px
  'section-md': '4rem',    // 64px
  'section-lg': '5rem',    // 80px
  'section-xl': '6rem',    // 96px
  'section-2xl': '8rem',   // 128px
}
```

### Responsive Breakpoints

```javascript
// @theme.ts
screens: {
  'xs': '475px',   // Extra small devices
  'sm': '640px',   // Small devices (landscape phones)
  'md': '768px',   // Medium devices (tablets)
  'lg': '1024px',  // Large devices (desktops)
  'xl': '1280px',  // Extra large devices (large desktops)
  '2xl': '1536px', // 2X large devices (larger desktops)
}
```

## Layout System

### Shared Layout Utilities

The design system includes shared layout utilities in `utils/layout-classes.ts`:

```typescript
// Text alignment
export const ALIGN_CLASSES = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// Background classes
export const BACKGROUND_CLASSES = {
  white: 'bg-white',
  neutral: 'bg-neutral-50',
  primary: 'bg-primary-50',
  // ... more variants
};

// Utility functions with fallbacks
export const getAlignClass = (align, fallback = 'center') => {
  return align in ALIGN_CLASSES
    ? ALIGN_CLASSES[align]
    : ALIGN_CLASSES[fallback];
};
```

### Grid System

```javascript
// Auto-fit grid templates
gridTemplateColumns: {
  'auto-fit-xs': 'repeat(auto-fit, minmax(250px, 1fr))',
  'auto-fit-sm': 'repeat(auto-fit, minmax(300px, 1fr))',
  'auto-fit-md': 'repeat(auto-fit, minmax(350px, 1fr))',
  'auto-fit-lg': 'repeat(auto-fit, minmax(400px, 1fr))',
}
```

### Layout Constraints

```javascript
// Maximum width constraints
maxWidth: {
  'content': '65ch',       // Optimal reading width
  'container': '1280px',   // Max container width
  'hero': '1024px',        // Hero content max width
  'prose': '768px',        // Article/prose max width
}
```

## Development Guidelines

### Component Creation

1. **Follow Atomic Design**: Place components in appropriate atomic level
2. **Use Cascade Naming**: `AtomsButtonsBase`, `MoleculesCardsBase`, etc.
3. **Implement Props Interface**: Define clear TypeScript interfaces
4. **Include Default Props**: Provide sensible defaults with `withDefaults`
5. **Add Slots**: Use named slots for flexible content areas

### Example Component Structure

```vue
<template>
  <div :class="componentClasses">
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { getAlignClass, getBackgroundClass } from '@/utils/layout-classes';

interface Props {
  variant?: 'default' | 'elevated' | 'outlined';
  background?: 'white' | 'neutral' | 'primary';
  align?: 'left' | 'center' | 'right';
  padding?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  background: 'white',
  align: 'left',
  padding: 'md',
});

const componentClasses = computed(() => {
  const classes = [];

  classes.push(getBackgroundClass(props.background));
  classes.push(getAlignClass(props.align));

  // Add variant-specific classes
  if (props.variant === 'elevated') {
    classes.push('shadow-lg');
  }

  return classes.join(' ');
});
</script>
```

### Testing Requirements

1. **Unit Tests**: Required for all components
2. **Props Testing**: Test all prop variations
3. **Slot Testing**: Verify slot content rendering
4. **Event Testing**: Test emitted events
5. **Accessibility**: Include a11y testing

### Example Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ComponentName from './ComponentName.vue';

describe('ComponentName', () => {
  it('should render with default props', () => {
    const wrapper = mount(ComponentName);
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle prop variations', () => {
    const wrapper = mount(ComponentName, {
      props: { variant: 'elevated' },
    });
    expect(wrapper.classes()).toContain('shadow-lg');
  });
});
```

### Styling Guidelines

1. **Use Theme Tokens**: Always use design system tokens
2. **Avoid Hardcoded Values**: Use theme variables and utilities
3. **Follow Responsive Pattern**: Mobile-first approach
4. **Maintain Consistency**: Use shared utility functions
5. **Test Across Breakpoints**: Ensure responsive behavior

### Code Quality

1. **TypeScript**: Full type safety required
2. **ESLint**: Follow configured linting rules
3. **Prettier**: Auto-formatting for consistency
4. **Documentation**: Include JSDoc comments for complex logic
5. **Performance**: Optimize for minimal bundle size

## Maintenance & Versioning

### Version Control

The design system follows semantic versioning:

- **Major (x.0.0)**: Breaking changes to component APIs
- **Minor (x.y.0)**: New features and components
- **Patch (x.y.z)**: Bug fixes and improvements

### Update Process

1. **Planning**: Document proposed changes
2. **Implementation**: Create feature branch
3. **Testing**: Comprehensive test coverage
4. **Review**: Code review and approval
5. **Documentation**: Update guides and examples
6. **Release**: Version bump and changelog

### Breaking Changes

When introducing breaking changes:

1. Deprecate old API with warnings
2. Provide migration guide
3. Update all internal usage
4. Remove deprecated API in next major version

### Monitoring

Regular maintenance includes:

- **Performance Audits**: Bundle size and runtime performance
- **Accessibility Reviews**: WCAG compliance checks
- **Browser Testing**: Cross-browser compatibility
- **Usage Analytics**: Component adoption tracking

### Contributing

1. **Create Issue**: Describe the problem or enhancement
2. **Fork Repository**: Create a feature branch
3. **Implement Changes**: Follow coding guidelines
4. **Add Tests**: Comprehensive test coverage
5. **Submit PR**: Include description and testing notes
6. **Review Process**: Address feedback and iterate

---

_This design system documentation is maintained by the development team and updated with each release. For questions or contributions, please refer to the project's contributing guidelines._
