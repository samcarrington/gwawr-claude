import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AtomsButtonsBase from './AtomsButtonsBase.vue'

// Mock UButton component
const UButtonStub = {
  name: 'UButton',
  template: '<button v-bind="$attrs"><slot name="leading" /><slot /><slot name="trailing" /></button>',
  props: ['variant', 'size', 'color', 'disabled', 'loading', 'to', 'target', 'external', 'class']
}

describe('AtomsButtonsBase', () => {
  const mountOptions = {
    global: {
      components: {
        UButton: UButtonStub
      }
    }
  }

  it('should render with default props', () => {
    const wrapper = mount(AtomsButtonsBase, mountOptions)
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should render slot content', () => {
    const wrapper = mount(AtomsButtonsBase, {
      ...mountOptions,
      slots: {
        default: 'Click me'
      }
    })

    expect(wrapper.text()).toContain('Click me')
  })

  it('should render leading slot content', () => {
    const wrapper = mount(AtomsButtonsBase, {
      ...mountOptions,
      slots: {
        leading: 'Icon',
        default: 'Button'
      }
    })

    expect(wrapper.text()).toContain('Icon')
    expect(wrapper.text()).toContain('Button')
  })

  it('should render trailing slot content', () => {
    const wrapper = mount(AtomsButtonsBase, {
      ...mountOptions,
      slots: {
        trailing: 'Arrow',
        default: 'Next'
      }
    })

    expect(wrapper.text()).toContain('Arrow')
    expect(wrapper.text()).toContain('Next')
  })

  it('should emit click event when clicked', async () => {
    const wrapper = mount(AtomsButtonsBase, mountOptions)
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})