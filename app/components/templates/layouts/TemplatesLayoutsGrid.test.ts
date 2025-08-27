import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TemplatesLayoutsGrid from './TemplatesLayoutsGrid.vue';

// Mock UContainer component
const UContainerStub = {
  name: 'UContainer',
  template: '<div class="container"><slot /></div>',
  props: ['class'],
};

// Mock typography component
const AtomsTypographySectionStub = {
  name: 'AtomsTypographySection',
  template: '<h2><slot /></h2>',
  props: ['size', 'spacing', 'align'],
};

describe('TemplatesLayoutsGrid', () => {
  const mountOptions = {
    global: {
      components: {
        UContainer: UContainerStub,
        AtomsTypographySection: AtomsTypographySectionStub,
      },
    },
  };

  it('should render with default props', () => {
    const wrapper = mount(TemplatesLayoutsGrid, mountOptions);

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('section').exists()).toBe(true);
    // UContainer is mocked and should exist
    expect(wrapper.findComponent(UContainerStub).exists()).toBe(true);
  });

  it('should render title when provided', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      props: {
        title: 'Grid Title',
      },
    });

    expect(wrapper.text()).toContain('Grid Title');
  });

  it('should render description when provided', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      props: {
        description: 'Grid description text',
      },
    });

    expect(wrapper.text()).toContain('Grid description text');
  });

  it('should render custom header slot content', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      slots: {
        header: '<h1>Custom Header</h1>',
      },
    });

    expect(wrapper.text()).toContain('Custom Header');
  });

  it('should render grid with default 3 columns', () => {
    const wrapper = mount(TemplatesLayoutsGrid, mountOptions);

    const gridElement = wrapper.find('.grid');
    expect(gridElement.classes()).toContain('grid-cols-1');
    expect(gridElement.classes()).toContain('lg:grid-cols-3');
  });

  it('should render grid with custom column count', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      props: {
        columns: 4,
      },
    });

    const gridElement = wrapper.find('.grid');
    expect(gridElement.classes()).toContain('lg:grid-cols-4');
  });

  it('should apply default large gap', () => {
    const wrapper = mount(TemplatesLayoutsGrid, mountOptions);

    expect(wrapper.find('.grid').classes()).toContain('gap-8');
  });

  it('should apply custom gap size', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      props: {
        gap: 'sm',
      },
    });

    expect(wrapper.find('.grid').classes()).toContain('gap-4');
  });

  it('should apply transparent background by default', () => {
    const wrapper = mount(TemplatesLayoutsGrid, mountOptions);

    // Should not have any background classes
    const section = wrapper.find('section');
    expect(section.classes()).not.toContain('bg-white');
    expect(section.classes()).not.toContain('bg-neutral-50');
  });

  it('should apply background when specified', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      props: {
        background: 'white',
      },
    });

    expect(wrapper.find('section').classes()).toContain('bg-white');
  });

  it('should apply default large padding', () => {
    const wrapper = mount(TemplatesLayoutsGrid, mountOptions);

    expect(wrapper.find('section').classes()).toContain('py-20');
  });

  it('should apply custom padding size', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      props: {
        padding: 'sm',
      },
    });

    expect(wrapper.find('section').classes()).toContain('py-8');
  });

  it('should center header by default', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      props: {
        title: 'Test Title',
      },
    });

    const headerElement = wrapper.find('[class*="text-center"]');
    expect(headerElement.exists()).toBe(true);
  });

  it('should align header based on headerAlign prop', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      props: {
        title: 'Test Title',
        headerAlign: 'left',
      },
    });

    const headerElement = wrapper.find('[class*="text-left"]');
    expect(headerElement.exists()).toBe(true);
  });

  it('should render footer slot when provided', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      slots: {
        footer: '<div>Footer content</div>',
      },
    });

    expect(wrapper.text()).toContain('Footer content');
  });

  it('should render default slot content', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      slots: {
        default: '<div>Grid item 1</div><div>Grid item 2</div>',
      },
    });

    expect(wrapper.text()).toContain('Grid item 1');
    expect(wrapper.text()).toContain('Grid item 2');
  });

  it('should disable responsive behavior when responsive prop is false', () => {
    const wrapper = mount(TemplatesLayoutsGrid, {
      ...mountOptions,
      props: {
        columns: 3,
        responsive: false,
      },
    });

    const gridElement = wrapper.find('.grid');
    expect(gridElement.classes()).toContain('grid-cols-3');
    expect(gridElement.classes()).not.toContain('lg:grid-cols-3');
  });
});
