import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import TemplatesLayoutsHero from './TemplatesLayoutsHero.vue';

describe('TemplatesLayoutsHero', () => {
  it('should render with default props', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero);

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('section').exists()).toBe(true);
    // Check for the UContainer div instead of .container class
    expect(wrapper.find('div').exists()).toBe(true);
  });

  it('should render default title when no title slot provided', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero);

    expect(wrapper.text()).toContain('Default Hero Title');
  });

  it('should render custom title slot content', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero, {
      slots: {
        title: '<h1>Custom Hero Title</h1>',
      },
    });

    expect(wrapper.text()).toContain('Custom Hero Title');
    expect(wrapper.text()).not.toContain('Default Hero Title');
  });

  it('should render custom subtitle slot content', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero, {
      slots: {
        subtitle: '<p>Custom subtitle</p>',
      },
    });

    expect(wrapper.text()).toContain('Custom subtitle');
  });

  it('should render actions slot when provided', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero, {
      slots: {
        actions: '<button>Action Button</button>',
      },
    });

    expect(wrapper.text()).toContain('Action Button');
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('should render content slot when provided', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero, {
      slots: {
        content: '<div>Additional content</div>',
      },
    });

    expect(wrapper.text()).toContain('Additional content');
  });

  it('should apply gradient background by default', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero);

    expect(wrapper.find('section').classes()).toContain('bg-gradient-to-br');
  });

  it('should apply solid background when variant is solid', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero, {
      props: {
        variant: 'solid',
        background: 'primary',
      },
    });

    expect(wrapper.find('section').classes()).toContain('bg-primary');
  });

  it('should apply fullscreen height by default', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero);

    expect(wrapper.find('section').classes()).toContain('min-h-screen');
  });

  it('should apply correct size classes', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero, {
      props: {
        size: 'medium',
      },
    });

    expect(wrapper.find('section').classes()).toContain('min-h-[60vh]');
  });

  it('should apply center alignment by default', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero);

    expect(wrapper.find('section').classes()).toContain('justify-center');
  });

  it('should apply overlay classes for image variant with overlay', async () => {
    const wrapper = await mountSuspended(TemplatesLayoutsHero, {
      props: {
        variant: 'image',
        overlay: true,
      },
    });

    const section = wrapper.find('section');
    expect(section.classes()).toContain('before:absolute');
    expect(section.classes()).toContain('before:bg-black/40');
  });
});
