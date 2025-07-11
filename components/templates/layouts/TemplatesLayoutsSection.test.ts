import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplatesLayoutsSection from './TemplatesLayoutsSection.vue'

// Mock UContainer component
const UContainerStub = {
  name: 'UContainer',
  template: '<div class="container"><slot /></div>',
  props: ['class']
}

// Mock typography component
const AtomsTypographySectionStub = {
  name: 'AtomsTypographySection',
  template: '<h2><slot /></h2>',
  props: ['size', 'spacing', 'align']
}

describe('TemplatesLayoutsSection', () => {
  const mountOptions = {
    global: {
      components: {
        UContainer: UContainerStub,
        AtomsTypographySection: AtomsTypographySectionStub
      }
    }
  }

  it('should render with default props', () => {
    const wrapper = mount(TemplatesLayoutsSection, mountOptions)
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('section').exists()).toBe(true)
    expect(wrapper.find('.container').exists()).toBe(true)
  })

  it('should render title when provided', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        title: 'Section Title'
      }
    })

    expect(wrapper.text()).toContain('Section Title')
  })

  it('should render description when provided', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        description: 'Section description text'
      }
    })

    expect(wrapper.text()).toContain('Section description text')
  })

  it('should render custom header slot content', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      slots: {
        header: '<h1>Custom Header</h1>'
      }
    })

    expect(wrapper.text()).toContain('Custom Header')
  })

  it('should render default slot content', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      slots: {
        default: '<p>Section content</p>'
      }
    })

    expect(wrapper.text()).toContain('Section content')
  })

  it('should render footer slot when provided', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      slots: {
        footer: '<div>Footer content</div>'
      }
    })

    expect(wrapper.text()).toContain('Footer content')
  })

  it('should apply transparent background by default', () => {
    const wrapper = mount(TemplatesLayoutsSection, mountOptions)
    
    // Should not have any background classes
    const section = wrapper.find('section')
    expect(section.classes()).not.toContain('bg-white')
    expect(section.classes()).not.toContain('bg-neutral-50')
  })

  it('should apply background when specified', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        background: 'white'
      }
    })
    
    expect(wrapper.find('section').classes()).toContain('bg-white')
  })

  it('should apply default large padding', () => {
    const wrapper = mount(TemplatesLayoutsSection, mountOptions)
    
    expect(wrapper.find('section').classes()).toContain('py-20')
  })

  it('should apply custom padding size', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        padding: 'sm'
      }
    })
    
    expect(wrapper.find('section').classes()).toContain('py-8')
  })

  it('should center header by default', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        title: 'Test Title'
      }
    })
    
    const headerElement = wrapper.find('[class*="text-center"]')
    expect(headerElement.exists()).toBe(true)
  })

  it('should align header based on headerAlign prop', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        title: 'Test Title',
        headerAlign: 'left'
      }
    })
    
    const headerElement = wrapper.find('[class*="text-left"]')
    expect(headerElement.exists()).toBe(true)
  })

  it('should apply default variant styling', () => {
    const wrapper = mount(TemplatesLayoutsSection, mountOptions)
    
    const section = wrapper.find('section')
    expect(section.classes()).not.toContain('relative')
    expect(section.classes()).not.toContain('border-l-4')
  })

  it('should apply featured variant styling', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        variant: 'featured'
      }
    })
    
    expect(wrapper.find('section').classes()).toContain('relative')
  })

  it('should apply highlight variant styling', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        variant: 'highlight'
      }
    })
    
    const section = wrapper.find('section')
    expect(section.classes()).toContain('relative')
    expect(section.classes()).toContain('border-l-4')
    expect(section.classes()).toContain('border-primary')
  })

  it('should apply border when bordered prop is true', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        bordered: true
      }
    })
    
    const section = wrapper.find('section')
    expect(section.classes()).toContain('border')
    expect(section.classes()).toContain('border-neutral-200')
  })

  it('should apply rounded corners when rounded prop is true', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        rounded: true
      }
    })
    
    expect(wrapper.find('section').classes()).toContain('rounded-lg')
  })

  it('should apply max width constraint when specified', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        maxWidth: '2xl'
      }
    })
    
    const contentElement = wrapper.find('[class*="max-w-2xl"]')
    expect(contentElement.exists()).toBe(true)
    const autoMarginElement = wrapper.find('[class*="mx-auto"]')
    expect(autoMarginElement.exists()).toBe(true)
  })

  it('should align content based on contentAlign prop', () => {
    const wrapper = mount(TemplatesLayoutsSection, {
      ...mountOptions,
      props: {
        contentAlign: 'center'
      }
    })
    
    const contentElement = wrapper.find('[class*="text-center"]')
    expect(contentElement.exists()).toBe(true)
  })
})