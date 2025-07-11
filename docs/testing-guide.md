# Testing Guide

This project uses Vitest with jsdom for unit testing Vue components and composables.

## Setup

The testing framework includes:
- **Vitest**: Fast unit test framework with excellent TypeScript support
- **jsdom**: Lightweight DOM implementation for Node.js environments
- **@vue/test-utils**: Vue component testing utilities
- **@vitejs/plugin-vue**: Vue plugin for Vite

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

## Writing Component Tests

### Basic Component Test

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('should render with default props', () => {
    const wrapper = mount(MyComponent)
    
    expect(wrapper.exists()).toBe(true)
  })
})
```

### Testing Props and Slots

```typescript
it('should render slot content', () => {
  const wrapper = mount(MyComponent, {
    slots: {
      default: 'Hello World'
    }
  })

  expect(wrapper.text()).toContain('Hello World')
})

it('should handle props correctly', () => {
  const wrapper = mount(MyComponent, {
    props: {
      title: 'Test Title'
    }
  })

  expect(wrapper.props('title')).toBe('Test Title')
})
```

### Testing Events

```typescript
it('should emit events correctly', async () => {
  const wrapper = mount(MyComponent)
  
  await wrapper.find('button').trigger('click')
  
  expect(wrapper.emitted('click')).toHaveLength(1)
})
```

## Mocking Components

### Mocking Nuxt UI Components

For components that use Nuxt UI components (like UButton), create stubs:

```typescript
// Mock UButton component
const UButtonStub = {
  name: 'UButton',
  template: '<button v-bind="$attrs"><slot /></button>',
  props: ['variant', 'size', 'color', 'disabled', 'loading']
}

describe('MyComponent', () => {
  const mountOptions = {
    global: {
      components: {
        UButton: UButtonStub
      }
    }
  }

  it('should render with mocked UButton', () => {
    const wrapper = mount(MyComponent, mountOptions)
    
    expect(wrapper.find('button').exists()).toBe(true)
  })
})
```

### Mocking Nuxt Composables

Nuxt composables are automatically mocked in the test setup. Common mocks include:
- `useHead`
- `useRoute`
- `useRouter`
- `navigateTo`
- `useNuxtApp`

## File Structure

Tests should be co-located with their components:

```
components/
├── atoms/
│   ├── buttons/
│   │   ├── AtomsButtonsBase.vue
│   │   └── AtomsButtonsBase.test.ts
│   └── typography/
│       ├── AtomsTypographyBase.vue
│       └── AtomsTypographyBase.test.ts
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
3. **Keep Tests Simple**: Each test should focus on one specific behavior
4. **Mock External Dependencies**: Mock Nuxt UI components and composables
5. **Test Edge Cases**: Include tests for error states, empty states, etc.

## Example Test Structure

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  // Setup common mount options
  const mountOptions = {
    global: {
      components: {
        // Mock any child components
      }
    }
  }

  // Test rendering
  it('should render correctly', () => {
    const wrapper = mount(MyComponent, mountOptions)
    expect(wrapper.exists()).toBe(true)
  })

  // Test props
  it('should handle props correctly', () => {
    // Test implementation
  })

  // Test events
  it('should emit events correctly', async () => {
    // Test implementation
  })

  // Test slots
  it('should render slot content', () => {
    // Test implementation
  })

  // Test edge cases
  it('should handle edge cases', () => {
    // Test implementation
  })
})
```

## Coverage

The testing setup includes coverage reporting. Run `npm run test:coverage` to generate a coverage report.

Target coverage goals:
- **Statements**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+
- **Branches**: 70%+

## Troubleshooting

### Common Issues

1. **Component Not Found**: Ensure components are properly mocked in the test setup
2. **Computed/Ref Not Defined**: Vue globals are provided in the test setup
3. **Nuxt Composables Not Available**: Composables are mocked in `test/setup.ts`

### Debug Tips

- Use `console.log(wrapper.html())` to inspect rendered HTML
- Use `console.log(wrapper.emitted())` to check emitted events
- Use `--reporter=verbose` flag for detailed test output