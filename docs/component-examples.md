# Component Usage Examples

This document provides practical examples of how to use the design system components effectively.

## Basic Component Usage

### Typography Components

```vue
<template>
  <div>
    <!-- Page-level headings -->
    <AtomsTypographyPage size="hero" spacing="tight">
      Welcome to Our Platform
    </AtomsTypographyPage>
    
    <!-- Section headings -->
    <AtomsTypographySection size="large" align="center">
      Our Features
    </AtomsTypographySection>
    
    <!-- Card titles -->
    <AtomsTypographyCard tag="h3" size="default" spacing="default">
      Feature Title
    </AtomsTypographyCard>
  </div>
</template>
```

### Button Components

```vue
<template>
  <div class="space-y-4">
    <!-- Primary actions -->
    <AtomsButtonsPrimary size="lg" shadow>
      Get Started
    </AtomsButtonsPrimary>
    
    <!-- Secondary actions -->
    <AtomsButtonsSecondary size="lg">
      Learn More
    </AtomsButtonsSecondary>
    
    <!-- Custom button with icon -->
    <AtomsButtonsBase color="primary" variant="outline" size="md">
      <template #leading>
        <UIcon name="i-heroicons-download" />
      </template>
      Download
    </AtomsButtonsBase>
  </div>
</template>
```

## Layout Patterns

### Hero Section

```vue
<template>
  <TemplatesLayoutsHero
    variant="gradient"
    size="fullscreen"
    background="primary"
  >
    <template #title>
      <span class="text-white">
        Build Amazing <span class="text-primary-200">Applications</span>
      </span>
    </template>
    
    <template #subtitle>
      <p class="text-white/90">
        The modern development platform for teams who ship fast
      </p>
    </template>
    
    <template #actions>
      <div class="flex flex-col sm:flex-row gap-4">
        <AtomsButtonsBase variant="solid" color="white" size="lg">
          Start Building
        </AtomsButtonsBase>
        <AtomsButtonsBase variant="outline" color="white" size="lg">
          View Documentation
        </AtomsButtonsBase>
      </div>
    </template>
  </TemplatesLayoutsHero>
</template>
```

### Feature Grid

```vue
<template>
  <TemplatesLayoutsGrid
    :columns="3"
    gap="lg"
    title="Why Choose Us"
    description="The features that make us different"
    header-align="center"
    background="neutral"
    padding="xl"
  >
    <OrganismsCardsSkill
      v-for="feature in features"
      :key="feature.id"
      :icon="feature.icon"
      :title="feature.title"
      :description="feature.description"
      :technologies="feature.tags"
    />
  </TemplatesLayoutsGrid>
</template>

<script setup>
const features = [
  {
    id: 1,
    icon: 'i-heroicons-bolt',
    title: 'Lightning Fast',
    description: 'Built for speed with modern technologies',
    tags: ['Vue.js', 'Nuxt.js', 'Tailwind']
  },
  // ... more features
]
</script>
```

### Content Section

```vue
<template>
  <TemplatesLayoutsSection
    variant="featured"
    title="About Our Mission"
    description="We're building the future of web development"
    max-width="2xl"
    content-align="center"
    background="white"
    :bordered="true"
    :rounded="true"
  >
    <div class="prose prose-lg mx-auto">
      <p>
        Our mission is to empower developers with the tools and platforms
        they need to build exceptional digital experiences.
      </p>
      <p>
        We believe in open source, community-driven development, and
        making technology accessible to everyone.
      </p>
    </div>
    
    <template #footer>
      <div class="text-center mt-8">
        <AtomsButtonsBase color="primary" size="lg">
          Join Our Community
        </AtomsButtonsBase>
      </div>
    </template>
  </TemplatesLayoutsSection>
</template>
```

## Complex Examples

### Project Showcase

```vue
<template>
  <div class="py-16">
    <!-- Page Header -->
    <TemplatesLayoutsSection
      title="Our Projects"
      description="Showcasing our latest work and innovations"
      header-align="center"
      background="transparent"
      padding="md"
    >
      <!-- Filter Tabs -->
      <div class="flex flex-wrap gap-3 justify-center mb-12">
        <AtomsButtonsBase
          v-for="category in categories"
          :key="category"
          :variant="selectedCategory === category ? 'solid' : 'outline'"
          size="md"
          color="primary"
          @click="selectedCategory = category"
        >
          {{ category }}
        </AtomsButtonsBase>
      </div>
    </TemplatesLayoutsSection>

    <!-- Projects Grid -->
    <TemplatesLayoutsGrid
      :columns="3"
      gap="lg"
      background="neutral"
      padding="lg"
    >
      <OrganismsCardsProject
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
      />
    </TemplatesLayoutsGrid>
  </div>
</template>
```

### Blog Listing

```vue
<template>
  <div class="py-12">
    <!-- Featured Post -->
    <TemplatesLayoutsSection
      title="Featured Article"
      header-align="left"
      background="primary"
      padding="xl"
      variant="featured"
      class="mb-16"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <AtomsBadges variant="primary" size="sm" class="mb-4">
            Featured
          </AtomsBadges>
          <AtomsTypographyCard tag="h2" size="large" spacing="tight">
            {{ featuredPost.title }}
          </AtomsTypographyCard>
          <p class="text-lg text-gray-600 mb-6">
            {{ featuredPost.excerpt }}
          </p>
          <AtomsButtonsBase color="primary" size="lg">
            Read More
          </AtomsButtonsBase>
        </div>
        <div>
          <MoleculesCardsImage
            :image="featuredPost.image"
            :alt="featuredPost.title"
            aspect-ratio="card"
          />
        </div>
      </div>
    </TemplatesLayoutsSection>

    <!-- Recent Posts -->
    <TemplatesLayoutsGrid
      :columns="2"
      gap="lg"
      title="Recent Articles"
      header-align="left"
    >
      <OrganismsCardsBlog
        v-for="post in recentPosts"
        :key="post.id"
        :post="post"
      />
    </TemplatesLayoutsGrid>
  </div>
</template>
```

### Call to Action Section

```vue
<template>
  <OrganismsSectionsCallToAction
    variant="dark"
    title="Ready to Get Started?"
    description="Join thousands of developers building amazing projects with our platform."
  >
    <template #primary-button="{ variant, classes }">
      <AtomsButtonsBase
        size="lg"
        :variant="variant"
        :class="classes"
        @click="navigateTo('/signup')"
      >
        <template #leading>
          <UIcon name="i-heroicons-rocket-launch" />
        </template>
        Start Building
      </AtomsButtonsBase>
    </template>
    
    <template #secondary-button="{ variant, classes }">
      <AtomsButtonsBase
        size="lg"
        :variant="variant"
        :class="classes"
        @click="navigateTo('/docs')"
      >
        View Documentation
        <template #trailing>
          <UIcon name="i-heroicons-arrow-top-right-on-square" />
        </template>
      </AtomsButtonsBase>
    </template>
  </OrganismsSectionsCallToAction>
</template>
```

## Best Practices

### Component Composition

```vue
<template>
  <!-- ✅ Good: Using layout components for structure -->
  <TemplatesLayoutsSection
    title="Services"
    background="neutral"
    padding="xl"
  >
    <TemplatesLayoutsGrid :columns="3" gap="lg">
      <MoleculesCardsBase 
        v-for="service in services"
        :key="service.id"
        variant="elevated"
      >
        <!-- Card content -->
      </MoleculesCardsBase>
    </TemplatesLayoutsGrid>
  </TemplatesLayoutsSection>

  <!-- ❌ Avoid: Custom layout without using templates -->
  <section class="py-20 bg-neutral-50">
    <div class="container mx-auto">
      <div class="grid grid-cols-3 gap-8">
        <!-- Manual layout implementation -->
      </div>
    </div>
  </section>
</template>
```

### Consistent Spacing

```vue
<template>
  <!-- ✅ Good: Using consistent spacing from design system -->
  <div class="space-y-section-lg">
    <TemplatesLayoutsHero />
    <TemplatesLayoutsGrid />
    <OrganismsSectionsCallToAction />
  </div>

  <!-- ❌ Avoid: Arbitrary spacing values -->
  <div class="space-y-[73px]">
    <!-- Components with random spacing -->
  </div>
</template>
```

### Color Usage

```vue
<template>
  <!-- ✅ Good: Using semantic color props -->
  <AtomsButtonsBase color="primary" variant="solid">
    Primary Action
  </AtomsButtonsBase>
  
  <AtomsBadges variant="success">
    Completed
  </AtomsBadges>

  <!-- ❌ Avoid: Hardcoded color classes -->
  <button class="bg-blue-500 text-white">
    Custom Button
  </button>
</template>
```

### Responsive Design

```vue
<template>
  <!-- ✅ Good: Using responsive props -->
  <TemplatesLayoutsGrid
    :columns="3"
    :responsive="true"
    gap="lg"
  >
    <!-- Content adapts automatically -->
  </TemplatesLayoutsGrid>

  <!-- ✅ Good: Mobile-first responsive classes -->
  <div class="text-center md:text-left">
    <AtomsTypographyPage size="large">
      Responsive Heading
    </AtomsTypographyPage>
  </div>
</template>
```

## Testing Examples

### Component Testing

```typescript
// Component.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('should render design system components', () => {
    const wrapper = mount(MyComponent, {
      global: {
        components: {
          AtomsButtonsBase: { template: '<button><slot /></button>' },
          TemplatesLayoutsSection: { template: '<section><slot /></section>' }
        }
      }
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('section').exists()).toBe(true)
  })

  it('should handle props correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { variant: 'primary' }
    })

    expect(wrapper.props('variant')).toBe('primary')
  })
})
```

This comprehensive set of examples demonstrates how to effectively use the design system components to build consistent, maintainable interfaces.