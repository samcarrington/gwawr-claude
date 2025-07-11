import { vi } from 'vitest'
import { computed, ref } from 'vue'

// Make Vue globals available
global.computed = computed
global.ref = ref

// Mock Nuxt's auto-imported composables
vi.mock('#app', () => ({
  useHead: vi.fn(),
  useRoute: vi.fn(() => ({
    path: '/',
    params: {},
    query: {},
    hash: '',
    fullPath: '/',
    matched: [],
    meta: {},
    name: undefined,
    redirectedFrom: undefined
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    beforeEach: vi.fn(),
    beforeResolve: vi.fn(),
    afterEach: vi.fn()
  })),
  navigateTo: vi.fn(),
  useNuxtApp: vi.fn(() => ({
    $router: {
      push: vi.fn(),
      replace: vi.fn()
    }
  }))
}))

// Mock Nuxt UI components globally
import { defineComponent } from 'vue'

global.UButton = defineComponent({
  name: 'UButton',
  template: '<button :class="$attrs.class" v-bind="$attrs"><template v-if="$slots.leading"><slot name="leading" /></template><slot /><template v-if="$slots.trailing"><slot name="trailing" /></template></button>',
  props: ['variant', 'size', 'color', 'disabled', 'loading', 'to', 'target', 'external', 'class'],
  inheritAttrs: false
})

global.UContainer = {
  name: 'UContainer',
  template: '<div :class="$attrs.class"><slot /></div>',
  props: ['class']
}

global.UIcon = {
  name: 'UIcon',
  template: '<i :class="$attrs.class"></i>',
  props: ['name', 'class']
}

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})