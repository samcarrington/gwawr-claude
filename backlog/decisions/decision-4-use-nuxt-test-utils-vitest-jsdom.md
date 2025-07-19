---
id: decision-4
title: Use @nuxt/test-utils with Vitest and jsdom for Unit Testing
date: '2025-07-11'
status: accepted
---

## Context
The project currently lacks a comprehensive unit testing framework for Vue components and composables. While we have basic route testing with shell scripts, we need a proper testing setup that can:

1. Test Vue components in isolation
2. Test Nuxt composables and utilities
3. Mock Nuxt-specific functionality
4. Provide fast feedback during development
5. Integrate with our existing development workflow

## Decision
We will use **@nuxt/test-utils** with **Vitest** as the test runner and **jsdom** as the DOM environment for unit testing.

### Key Components:
- **@nuxt/test-utils**: Official Nuxt testing utilities providing component mounting and Nuxt context mocking
- **Vitest**: Fast unit test framework with excellent Vue/TypeScript support
- **jsdom**: Lightweight DOM implementation for Node.js environments
- **@vue/test-utils**: Vue component testing utilities (included with @nuxt/test-utils)

## Rationale

### Why @nuxt/test-utils:
- Official Nuxt testing solution with first-class support
- Seamless integration with Nuxt's auto-imports and composables
- Built-in mocking for Nuxt-specific functionality (useRoute, useRouter, etc.)
- Maintained by the Nuxt team ensuring compatibility

### Why Vitest:
- Native ESM support matching our build setup
- Excellent TypeScript support without additional configuration
- Fast execution with parallel test running
- Built-in code coverage reporting
- Compatible with Jest API but faster and more modern

### Why jsdom:
- Lightweight DOM implementation suitable for component testing
- Faster than full browser environments for unit tests
- Sufficient for testing component behavior and DOM interactions
- Well-supported by the Vue ecosystem

## Implementation Requirements

### Dependencies:
```json
{
  "devDependencies": {
    "@nuxt/test-utils": "^3.x",
    "vitest": "^1.x",
    "jsdom": "^24.x"
  }
}
```

### Configuration:
- `vitest.config.ts` with Nuxt integration
- Test environment configured for jsdom
- Component testing utilities available globally

### Testing Standards:
- All new components must include unit tests
- Test files located alongside components or in dedicated test directories
- Focus on component behavior, props, events, and computed properties
- Mock external dependencies and API calls

## Consequences

### Positive:
- Comprehensive testing coverage for Vue components
- Fast test execution encouraging TDD practices
- Official Nuxt support ensuring long-term compatibility
- Better code quality and regression prevention
- Improved developer confidence when refactoring

### Negative:
- Additional build tooling complexity
- Learning curve for team members unfamiliar with Vitest
- Initial setup time for existing components
- Potential for over-testing implementation details

## Alternatives Considered

1. **Jest + @vue/test-utils**: More mature but slower, requires additional ESM configuration
2. **Cypress Component Testing**: More realistic but heavier, better suited for integration tests
3. **Playwright Component Testing**: Excellent but overkill for unit testing
4. **Testing Library**: Good philosophy but @nuxt/test-utils provides better Nuxt integration

## Related Decisions
- [Decision 2: Use Nuxt UI](decision-2-use-nuxt-ui.md) - Testing framework must support Nuxt UI components
- [Decision 1: Use Tailwind CSS v4](decision-1-use-tailwind-CSS-v4.md) - Testing should validate CSS class applications

## Date
2025-07-11