import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplatesLayoutsHero from './TemplatesLayoutsHero.vue'

// Mock UContainer component
const UContainerStub = {
  name: 'UContainer',
  template: '<div class="container"><slot /></div>',
  props: ['class']
}

// Mock typography component
const AtomsTypographyPageStub = {
  name: 'AtomsTypographyPage',
  template: '<h1><slot /></h1>',
  props: ['size', 'spacing']
}

describe('TemplatesLayoutsHero', () => {
  const mountOptions = {
    global: {
      components: {
        UContainer: UContainerStub,
        AtomsTypographyPage: AtomsTypographyPageStub
      }
    }
  }

  it('should render with default props', () => {
    const wrapper = mount(TemplatesLayoutsHero, mountOptions)
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('section').exists()).toBe(true)
    expect(wrapper.find('.container').exists()).toBe(true)
  })

  it('should render default title when no title slot provided', () => {
    const wrapper = mount(TemplatesLayoutsHero, mountOptions)
    
    expect(wrapper.text()).toContain('Default Hero Title')
  })

  it('should render custom title slot content', () => {
    const wrapper = mount(TemplatesLayoutsHero, {
      ...mountOptions,
      slots: {
        title: '<h1>Custom Hero Title</h1>'
      }
    })

    expect(wrapper.text()).toContain('Custom Hero Title')
    expect(wrapper.text()).not.toContain('Default Hero Title')
  })

  it('should render custom subtitle slot content', () => {
    const wrapper = mount(TemplatesLayoutsHero, {
      ...mountOptions,
      slots: {
        subtitle: '<p>Custom subtitle</p>'
      }
    })

    expect(wrapper.text()).toContain('Custom subtitle')
  })

  it('should render actions slot when provided', () => {
    const wrapper = mount(TemplatesLayoutsHero, {
      ...mountOptions,
      slots: {
        actions: '<button>Action Button</button>'
      }
    })

    expect(wrapper.text()).toContain('Action Button')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should render content slot when provided', () => {
    const wrapper = mount(TemplatesLayoutsHero, {
      ...mountOptions,
      slots: {
        content: '<div>Additional content</div>'
      }
    })

    expect(wrapper.text()).toContain('Additional content')
  })

  it('should apply gradient background by default', () => {
    const wrapper = mount(TemplatesLayoutsHero, mountOptions)
    
    expect(wrapper.find('section').classes()).toContain('bg-gradient-to-br')
  })

  it('should apply solid background when variant is solid', () => {
    const wrapper = mount(TemplatesLayoutsHero, {
      ...mountOptions,
      props: {
        variant: 'solid',
        background: 'primary'
      }
    })
    
    expect(wrapper.find('section').classes()).toContain('bg-primary')
  })

  it('should apply fullscreen height by default', () => {
    const wrapper = mount(TemplatesLayoutsHero, mountOptions)
    
    expect(wrapper.find('section').classes()).toContain('min-h-screen')
  })

  it('should apply correct size classes', () => {
    const wrapper = mount(TemplatesLayoutsHero, {
      ...mountOptions,
      props: {
        size: 'medium'
      }
    })
    
    expect(wrapper.find('section').classes()).toContain('min-h-[60vh]')
  })

  it('should apply center alignment by default', () => {
    const wrapper = mount(TemplatesLayoutsHero, mountOptions)
    
    expect(wrapper.find('section').classes()).toContain('justify-center')
  })

  it('should apply overlay classes for image variant with overlay', () => {
    const wrapper = mount(TemplatesLayoutsHero, {
      ...mountOptions,
      props: {
        variant: 'image',
        overlay: true
      }
    })
    
    const section = wrapper.find('section')
    expect(section.classes()).toContain('before:absolute')
    expect(section.classes()).toContain('before:bg-black/40')
  })
})