import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

// Mock UButton component
const MockUButton = {
  name: 'UButton',
  template: '<button><slot name="leading" /><slot /><slot name="trailing" /></button>',
  props: ['class', 'size', 'variant', 'color', 'disabled', 'loading', 'to', 'target', 'external'],
}

describe('BaseButton', () => {
  it('should translate tertiary color to info for UButton', () => {
    const wrapper = mount(BaseButton, {
      props: {
        color: 'tertiary'
      },
      global: {
        components: {
          UButton: MockUButton
        }
      }
    })

    const uButton = wrapper.findComponent(MockUButton)
    expect(uButton.props('color')).toBe('info')
  })

  it('should translate neutral color to gray for UButton', () => {
    const wrapper = mount(BaseButton, {
      props: {
        color: 'neutral'
      },
      global: {
        components: {
          UButton: MockUButton
        }
      }
    })

    const uButton = wrapper.findComponent(MockUButton)
    expect(uButton.props('color')).toBe('gray')
  })

  it('should pass through standard colors unchanged', () => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'error']
    
    colors.forEach(color => {
      const wrapper = mount(BaseButton, {
        props: {
          color: color as any
        },
        global: {
          components: {
            UButton: MockUButton
          }
        }
      })

      const uButton = wrapper.findComponent(MockUButton)
      expect(uButton.props('color')).toBe(color)
    })
  })

  it('should default to primary color when invalid color provided', () => {
    const wrapper = mount(BaseButton, {
      props: {
        color: 'invalid' as any
      },
      global: {
        components: {
          UButton: MockUButton
        }
      }
    })

    const uButton = wrapper.findComponent(MockUButton)
    expect(uButton.props('color')).toBe('primary')
  })

  it('should apply fullWidth class when fullWidth prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        fullWidth: true
      },
      global: {
        components: {
          UButton: MockUButton
        }
      }
    })

    const uButton = wrapper.findComponent(MockUButton)
    expect(uButton.props('class')).toContain('w-full')
  })

  it('should apply shadow classes when shadow prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        shadow: true
      },
      global: {
        components: {
          UButton: MockUButton
        }
      }
    })

    const uButton = wrapper.findComponent(MockUButton)
    expect(uButton.props('class')).toContain('shadow-md hover:shadow-lg')
  })

  it('should render leading slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        leading: '<span>Leading</span>',
        default: 'Button Text'
      },
      global: {
        components: {
          UButton: MockUButton
        }
      }
    })

    expect(wrapper.text()).toContain('Leading')
    expect(wrapper.text()).toContain('Button Text')
  })

  it('should render trailing slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        trailing: '<span>Trailing</span>',
        default: 'Button Text'
      },
      global: {
        components: {
          UButton: MockUButton
        }
      }
    })

    expect(wrapper.text()).toContain('Trailing')
    expect(wrapper.text()).toContain('Button Text')
  })

  it('should emit click event when not disabled or loading', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: false,
        loading: false
      },
      global: {
        components: {
          UButton: MockUButton
        }
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('should pass through all UButton props correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        size: 'lg',
        variant: 'outline',
        disabled: true,
        loading: true,
        to: '/test',
        target: '_blank',
        external: true
      },
      global: {
        components: {
          UButton: MockUButton
        }
      }
    })

    const uButton = wrapper.findComponent(MockUButton)
    expect(uButton.props('size')).toBe('lg')
    expect(uButton.props('variant')).toBe('outline')
    expect(uButton.props('disabled')).toBe(true)
    expect(uButton.props('loading')).toBe(true)
    expect(uButton.props('to')).toBe('/test')
    expect(uButton.props('target')).toBe('_blank')
    expect(uButton.props('external')).toBe(true)
  })
})