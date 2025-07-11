<template>
  <div class="py-12">
    <UContainer>
      <!-- Page Header -->
      <div class="text-center mb-16">
        <AtomsTypographyPage size="large" spacing="tight">
          Design System Showcase
        </AtomsTypographyPage>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A comprehensive overview of our design system components, patterns, and guidelines.
        </p>
      </div>

      <!-- Typography Section -->
      <TemplatesLayoutsSection
        title="Typography"
        description="Consistent typography hierarchy across all text elements"
        background="white"
        :bordered="true"
        :rounded="true"
        class="mb-16"
      >
        <div class="space-y-8">
          <!-- Page Typography -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Page Typography</h4>
            <div class="space-y-4">
              <AtomsTypographyPage size="hero" spacing="tight">
                Hero Page Title
              </AtomsTypographyPage>
              <AtomsTypographyPage size="large" spacing="default">
                Large Page Title
              </AtomsTypographyPage>
              <AtomsTypographyPage size="default" spacing="loose">
                Default Page Title
              </AtomsTypographyPage>
            </div>
          </div>

          <!-- Section Typography -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Section Typography</h4>
            <div class="space-y-4">
              <AtomsTypographySection size="large" align="left">
                Large Section Heading
              </AtomsTypographySection>
              <AtomsTypographySection size="default" align="center">
                Default Section Heading
              </AtomsTypographySection>
              <AtomsTypographySection size="small" align="right">
                Small Section Heading
              </AtomsTypographySection>
            </div>
          </div>

          <!-- Card Typography -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Card Typography</h4>
            <div class="space-y-4">
              <AtomsTypographyCard tag="h3" size="large" spacing="tight">
                Large Card Title
              </AtomsTypographyCard>
              <AtomsTypographyCard tag="h4" size="default" spacing="default">
                Default Card Title
              </AtomsTypographyCard>
              <AtomsTypographyCard tag="p" size="small" spacing="loose">
                Small Card Text
              </AtomsTypographyCard>
            </div>
          </div>
        </div>
      </TemplatesLayoutsSection>

      <!-- Button Section -->
      <TemplatesLayoutsSection
        title="Buttons"
        description="Interactive button components with consistent styling"
        background="neutral"
        :bordered="true"
        :rounded="true"
        class="mb-16"
      >
        <div class="space-y-8">
          <!-- Button Variants -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Button Variants</h4>
            <div class="flex flex-wrap gap-4">
              <AtomsButtonsBase variant="solid" color="primary">
                Solid Primary
              </AtomsButtonsBase>
              <AtomsButtonsBase variant="outline" color="primary">
                Outline Primary
              </AtomsButtonsBase>
              <AtomsButtonsBase variant="soft" color="primary">
                Soft Primary
              </AtomsButtonsBase>
              <AtomsButtonsBase variant="ghost" color="primary">
                Ghost Primary
              </AtomsButtonsBase>
            </div>
          </div>

          <!-- Button Colors -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Button Colors</h4>
            <div class="flex flex-wrap gap-4">
              <AtomsButtonsBase color="primary">Primary</AtomsButtonsBase>
              <AtomsButtonsBase color="secondary">Secondary</AtomsButtonsBase>
              <AtomsButtonsBase color="tertiary">Tertiary</AtomsButtonsBase>
              <AtomsButtonsBase color="success">Success</AtomsButtonsBase>
              <AtomsButtonsBase color="warning">Warning</AtomsButtonsBase>
              <AtomsButtonsBase color="error">Error</AtomsButtonsBase>
            </div>
          </div>

          <!-- Button Sizes -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Button Sizes</h4>
            <div class="flex flex-wrap items-center gap-4">
              <AtomsButtonsBase size="xs">Extra Small</AtomsButtonsBase>
              <AtomsButtonsBase size="sm">Small</AtomsButtonsBase>
              <AtomsButtonsBase size="md">Medium</AtomsButtonsBase>
              <AtomsButtonsBase size="lg">Large</AtomsButtonsBase>
              <AtomsButtonsBase size="xl">Extra Large</AtomsButtonsBase>
            </div>
          </div>

          <!-- Button with Icons -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Buttons with Icons</h4>
            <div class="flex flex-wrap gap-4">
              <AtomsButtonsBase color="primary">
                <template #leading>
                  <UIcon name="i-heroicons-plus" />
                </template>
                Add Item
              </AtomsButtonsBase>
              <AtomsButtonsBase color="secondary">
                Download
                <template #trailing>
                  <UIcon name="i-heroicons-arrow-down-tray" />
                </template>
              </AtomsButtonsBase>
            </div>
          </div>
        </div>
      </TemplatesLayoutsSection>

      <!-- Badge Section -->
      <TemplatesLayoutsSection
        title="Badges"
        description="Status indicators and category labels"
        background="white"
        :bordered="true"
        :rounded="true"
        class="mb-16"
      >
        <div class="space-y-8">
          <!-- Badge Variants -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Badge Variants</h4>
            <div class="flex flex-wrap gap-4">
              <AtomsBadges variant="primary">Primary</AtomsBadges>
              <AtomsBadges variant="secondary">Secondary</AtomsBadges>
              <AtomsBadges variant="tertiary">Tertiary</AtomsBadges>
              <AtomsBadges variant="success">Success</AtomsBadges>
              <AtomsBadges variant="warning">Warning</AtomsBadges>
              <AtomsBadges variant="error">Error</AtomsBadges>
            </div>
          </div>

          <!-- Badge Sizes -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Badge Sizes</h4>
            <div class="flex flex-wrap items-center gap-4">
              <AtomsBadges size="xs">Extra Small</AtomsBadges>
              <AtomsBadges size="sm">Small</AtomsBadges>
              <AtomsBadges size="md">Medium</AtomsBadges>
              <AtomsBadges size="lg">Large</AtomsBadges>
            </div>
          </div>

          <!-- Badge Outline -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Badge Outline</h4>
            <div class="flex flex-wrap gap-4">
              <AtomsBadges variant="primary" :outline="true">Outline Primary</AtomsBadges>
              <AtomsBadges variant="secondary" :outline="true">Outline Secondary</AtomsBadges>
              <AtomsBadges variant="success" :outline="true">Outline Success</AtomsBadges>
            </div>
          </div>
        </div>
      </TemplatesLayoutsSection>

      <!-- Layout Section -->
      <TemplatesLayoutsSection
        title="Layout Templates"
        description="Reusable layout patterns for consistent page structure"
        background="neutral"
        :bordered="true"
        :rounded="true"
        class="mb-16"
      >
        <div class="space-y-8">
          <!-- Grid Layout -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Grid Layout</h4>
            <TemplatesLayoutsGrid
              :columns="3"
              gap="md"
              background="white"
              :padding="'md'"
              :rounded="true"
              class="border"
            >
              <div class="p-4 bg-primary-50 rounded-lg text-center">
                <h5 class="font-semibold">Grid Item 1</h5>
                <p class="text-sm text-gray-600">Example content</p>
              </div>
              <div class="p-4 bg-secondary-50 rounded-lg text-center">
                <h5 class="font-semibold">Grid Item 2</h5>
                <p class="text-sm text-gray-600">Example content</p>
              </div>
              <div class="p-4 bg-tertiary-50 rounded-lg text-center">
                <h5 class="font-semibold">Grid Item 3</h5>
                <p class="text-sm text-gray-600">Example content</p>
              </div>
            </TemplatesLayoutsGrid>
          </div>

          <!-- Hero Layout -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Hero Layout</h4>
            <TemplatesLayoutsHero
              variant="gradient"
              size="medium"
              background="primary"
              class="rounded-lg"
            >
              <template #title>
                <span class="text-white">Hero Title</span>
              </template>
              <template #subtitle>
                <p class="text-white/90">Hero subtitle with description text</p>
              </template>
              <template #actions>
                <AtomsButtonsBase variant="solid" color="white">
                  Get Started
                </AtomsButtonsBase>
              </template>
            </TemplatesLayoutsHero>
          </div>
        </div>
      </TemplatesLayoutsSection>

      <!-- Card Section -->
      <TemplatesLayoutsSection
        title="Cards"
        description="Flexible card components for content organization"
        background="white"
        :bordered="true"
        :rounded="true"
        class="mb-16"
      >
        <TemplatesLayoutsGrid :columns="2" gap="lg">
          <!-- Basic Card -->
          <MoleculesCardsBase variant="elevated" padding="lg">
            <template #header>
              <h5 class="text-lg font-semibold">Basic Card</h5>
            </template>
            <template #content>
              <p class="text-gray-600">
                This is a basic card component with header, content, and footer sections.
              </p>
            </template>
            <template #footer>
              <AtomsButtonsBase size="sm" color="primary">
                Learn More
              </AtomsButtonsBase>
            </template>
          </MoleculesCardsBase>

          <!-- Image Card -->
          <MoleculesCardsImage
            image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop"
            alt="Code on laptop screen"
            image-position="top"
            aspect-ratio="card"
          >
            <template #content>
              <h5 class="text-lg font-semibold mb-2">Image Card</h5>
              <p class="text-gray-600">
                Card component with image support and multiple layout options.
              </p>
              <div class="mt-4">
                <AtomsBadges variant="primary" size="sm">Featured</AtomsBadges>
              </div>
            </template>
          </MoleculesCardsImage>
        </TemplatesLayoutsGrid>
      </TemplatesLayoutsSection>

      <!-- Color System -->
      <TemplatesLayoutsSection
        title="Color System"
        description="Semantic color palette with consistent scales"
        background="neutral"
        :bordered="true"
        :rounded="true"
        class="mb-16"
      >
        <div class="space-y-8">
          <!-- Primary Colors -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Primary Colors</h4>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-100 rounded-lg mx-auto mb-2 border"></div>
                <p class="text-sm font-medium">primary-100</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-300 rounded-lg mx-auto mb-2"></div>
                <p class="text-sm font-medium">primary-300</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-500 rounded-lg mx-auto mb-2"></div>
                <p class="text-sm font-medium">primary-500</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-700 rounded-lg mx-auto mb-2"></div>
                <p class="text-sm font-medium">primary-700</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-900 rounded-lg mx-auto mb-2"></div>
                <p class="text-sm font-medium">primary-900</p>
              </div>
            </div>
          </div>

          <!-- Secondary Colors -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Secondary Colors</h4>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div class="text-center">
                <div class="w-16 h-16 bg-secondary-100 rounded-lg mx-auto mb-2 border"></div>
                <p class="text-sm font-medium">secondary-100</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-secondary-300 rounded-lg mx-auto mb-2"></div>
                <p class="text-sm font-medium">secondary-300</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-secondary-500 rounded-lg mx-auto mb-2"></div>
                <p class="text-sm font-medium">secondary-500</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-secondary-700 rounded-lg mx-auto mb-2"></div>
                <p class="text-sm font-medium">secondary-700</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-secondary-900 rounded-lg mx-auto mb-2"></div>
                <p class="text-sm font-medium">secondary-900</p>
              </div>
            </div>
          </div>
        </div>
      </TemplatesLayoutsSection>

      <!-- Documentation Links -->
      <TemplatesLayoutsSection
        title="Documentation"
        description="Comprehensive guides and resources"
        background="white"
        :bordered="true"
        :rounded="true"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 border rounded-lg">
            <h5 class="text-lg font-semibold mb-2">Design System Guide</h5>
            <p class="text-gray-600 mb-4">
              Complete documentation including component usage, theme configuration, and development guidelines.
            </p>
            <a href="/docs/design-system-guide.md" class="text-primary hover:underline">
              View Documentation →
            </a>
          </div>
          <div class="p-6 border rounded-lg">
            <h5 class="text-lg font-semibold mb-2">Component Library</h5>
            <p class="text-gray-600 mb-4">
              Detailed component documentation with props, examples, and usage patterns.
            </p>
            <a href="/docs/design-system.md" class="text-primary hover:underline">
              View Components →
            </a>
          </div>
        </div>
      </TemplatesLayoutsSection>
    </UContainer>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: 'Design System - Sam Carrington',
  meta: [
    {
      name: 'description',
      content: 'Comprehensive design system showcase with components, patterns, and guidelines for the GWAWR website.',
    },
  ],
});
</script>