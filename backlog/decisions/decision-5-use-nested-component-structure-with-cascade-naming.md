---
id: decision-5
title: Use Nested Component Structure with Cascade Naming
date: '2025-07-11'
status: accepted
---

## Context
As our component library grows, we need to establish a scalable and maintainable organization system. We have two approaches documented in `~/docs/component-organization-analysis.md`:

1. **Nested Structure with Cascade Naming**: Deep directory nesting with descriptive component names
2. **Flat Structure with Atomic Prefixes**: Shallow directory structure with atomic design prefixes

The nested structure provides better scalability and more descriptive naming conventions that align with Nuxt's auto-import system.

## Decision
We will use the **nested component structure with cascade naming** approach for organizing our component library.

### Component Organization Structure:
```
components/
├── atoms/
│   ├── buttons/
│   │   ├── AtomsButtonsBase.vue          # <AtomsButtonsBase />
│   │   ├── AtomsButtonsBase.test.ts
│   │   ├── AtomsButtonsPrimary.vue       # <AtomsButtonsPrimary />
│   │   └── AtomsButtonsSecondary.vue     # <AtomsButtonsSecondary />
│   ├── typography/
│   │   ├── AtomsTypographyBase.vue       # <AtomsTypographyBase />
│   │   ├── AtomsTypographyPage.vue       # <AtomsTypographyPage />
│   │   ├── AtomsTypographySection.vue    # <AtomsTypographySection />
│   │   └── AtomsTypographyCard.vue       # <AtomsTypographyCard />
│   └── badges/
│       └── AtomsBadges.vue               # <AtomsBadges />
├── molecules/
│   ├── cards/
│   │   ├── MoleculesCardsBase.vue        # <MoleculesCardsBase />
│   │   └── MoleculesCardsImage.vue       # <MoleculesCardsImage />
│   └── lists/
│       └── MoleculesListsTags.vue        # <MoleculesListsTags />
├── organisms/
│   ├── navigation/
│   │   ├── OrganismsNavigationHeader.vue # <OrganismsNavigationHeader />
│   │   └── OrganismsNavigationFooter.vue # <OrganismsNavigationFooter />
│   ├── heroes/
│   │   └── OrganismsHeroesProject.vue    # <OrganismsHeroesProject />
│   ├── cards/
│   │   ├── OrganismsCardsBlog.vue        # <OrganismsCardsBlog />
│   │   ├── OrganismsCardsProject.vue     # <OrganismsCardsProject />
│   │   ├── OrganismsCardsSkill.vue       # <OrganismsCardsSkill />
│   │   └── OrganismsCardsTestimonial.vue # <OrganismsCardsTestimonial />
│   └── sections/
│       └── OrganismsSectionsCallToAction.vue # <OrganismsSectionsCallToAction />
└── templates/
    └── (Future page templates)
```

### Naming Convention:
- **Pattern**: `[AtomicLevel][Category][ComponentName].vue`
- **Examples**: 
  - `AtomsButtonsBase.vue` → `<AtomsButtonsBase />`
  - `MoleculesCardsBase.vue` → `<MoleculesCardsBase />`
  - `OrganismsNavigationHeader.vue` → `<OrganismsNavigationHeader />`

## Rationale

### Why Nested Structure with Cascade Naming:

1. **Better Scalability**: Deep categorization allows for infinite growth without naming conflicts
2. **Descriptive Naming**: Component names immediately convey their purpose and location
3. **Logical Grouping**: Related components are physically co-located in the same directory
4. **Clear Hierarchy**: Easy to understand component relationships and complexity levels
5. **Future-Proof**: Can accommodate new categories without restructuring existing code

### Advantages over Flat Structure:

1. **No Name Collisions**: `AtomsButtonsBase` vs `MoleculesButtonsBase` are clearly different
2. **Easier Navigation**: Related components grouped together in directories
3. **Better IDE Support**: Autocomplete and file navigation work more intuitively
4. **Clearer Intent**: Component purpose is immediately apparent from the name
5. **Maintainable at Scale**: Structure remains clear even with 100+ components

### Examples of Scalability:

```
# Can easily add new button types without conflicts
atoms/buttons/AtomsButtonsBase.vue
atoms/buttons/AtomsButtonsPrimary.vue
atoms/buttons/AtomsButtonsSecondary.vue
atoms/buttons/AtomsButtonsTertiary.vue
atoms/buttons/AtomsButtonsIcon.vue
atoms/buttons/AtomsButtonsFloating.vue

# Can add new card types without affecting existing ones
molecules/cards/MoleculesCardsBase.vue
molecules/cards/MoleculesCardsImage.vue
molecules/cards/MoleculesCardsProduct.vue
molecules/cards/MoleculesCardsProfile.vue
```

## Implementation Requirements

### File Naming:
- Component files must match their auto-generated names
- Test files co-located with components using `.test.ts` suffix
- Follow PascalCase naming convention

### Directory Structure:
- Maximum 3 levels deep (atomic-level/category/component)
- Clear category names that describe component purpose
- Consistent structure across all atomic levels

### Migration Strategy:
- Create migration script to update all component references
- Update imports across all pages, layouts, and components
- Maintain backwards compatibility during transition period

## Consequences

### Positive:
- **Scalable**: Can grow to hundreds of components without confusion
- **Maintainable**: Clear organization makes components easy to find
- **Descriptive**: Component names convey purpose and complexity
- **Flexible**: Easy to add new categories and component types
- **Professional**: Follows established patterns from large component libraries

### Negative:
- **Longer Names**: Component names are more verbose than current approach
- **Initial Migration**: Requires updating all existing component references
- **Learning Curve**: Team needs to understand new naming conventions
- **Typing**: Longer component names require more typing

## Alternatives Considered

1. **Flat Structure with Atomic Prefixes**: Simpler but less scalable
2. **No Reorganization**: Maintains status quo but doesn't address growth concerns
3. **Custom Nuxt Configuration**: Could use pathPrefix: false but loses auto-import benefits

## Related Decisions
- [Decision 4: Use @nuxt/test-utils with Vitest and jsdom](decision-4-use-nuxt-test-utils-vitest-jsdom.md) - Testing framework supports co-located test files
- [Decision 2: Use Nuxt UI](decision-2-use-nuxt-ui.md) - Component organization must work with Nuxt UI components

## Date
2025-07-11