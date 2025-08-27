import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import OrganismsCardsSkill from './OrganismsCardsSkill.vue';

describe('OrganismsCardsSkill', () => {
  const defaultProps = {
    icon: 'i-heroicons-code-bracket',
    title: 'Frontend Development',
    description:
      'Building modern, responsive web applications with cutting-edge technologies.',
    technologies: ['Vue.js', 'TypeScript', 'Tailwind CSS'],
  };

  it('renders correctly with required props', async () => {
    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: defaultProps,
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('displays the correct title', async () => {
    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: defaultProps,
    });

    const title = wrapper.find('h3');
    expect(title.text()).toBe(defaultProps.title);
    expect(title.classes()).toContain('text-xl');
    expect(title.classes()).toContain('font-semibold');
  });

  it('displays the correct description', async () => {
    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: defaultProps,
    });

    const description = wrapper.find('p');
    expect(description.text()).toBe(defaultProps.description);
    expect(description.classes()).toContain('text-gray-600');
  });

  it('renders the icon with correct classes', async () => {
    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: defaultProps,
    });

    const icon = wrapper.findComponent({ name: 'UIcon' });
    expect(icon.exists()).toBe(true);
    expect(icon.props('name')).toBe(defaultProps.icon);
    expect(icon.classes()).toContain('w-8');
    expect(icon.classes()).toContain('h-8');
    expect(icon.classes()).toContain('text-primary');
  });

  it('renders the icon container with correct styling', async () => {
    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: defaultProps,
    });

    const iconContainer = wrapper.find('.w-16.h-16');
    expect(iconContainer.exists()).toBe(true);
    expect(iconContainer.classes()).toContain('bg-primary/10');
    expect(iconContainer.classes()).toContain('rounded-full');
    expect(iconContainer.classes()).toContain('flex');
    expect(iconContainer.classes()).toContain('items-center');
    expect(iconContainer.classes()).toContain('justify-center');
  });

  it('passes technologies to MoleculesListsTags component', async () => {
    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: defaultProps,
    });

    const tagsComponent = wrapper.findComponent({ name: 'MoleculesListsTags' });
    expect(tagsComponent.exists()).toBe(true);
    expect(tagsComponent.props('tags')).toEqual(defaultProps.technologies);
    expect(tagsComponent.props('variant')).toBe('primary');
    expect(tagsComponent.props('size')).toBe('sm');
    expect(tagsComponent.props('align')).toBe('center');
  });

  it('uses MoleculesCardsBase with correct props', async () => {
    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: defaultProps,
    });

    const baseCard = wrapper.findComponent({ name: 'MoleculesCardsBase' });
    expect(baseCard.exists()).toBe(true);
    expect(baseCard.props('variant')).toBe('flat');
    expect(baseCard.props('size')).toBe('md');
    expect(baseCard.props('padding')).toBe('lg');
    expect(baseCard.props('hover')).toBe(true);
  });

  it('has correct text-center class on root element', async () => {
    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: defaultProps,
    });

    const baseCard = wrapper.findComponent({ name: 'MoleculesCardsBase' });
    expect(baseCard.classes()).toContain('text-center');
  });

  it('handles empty technologies array', async () => {
    const propsWithEmptyTech = {
      ...defaultProps,
      technologies: [],
    };

    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: propsWithEmptyTech,
    });

    const tagsComponent = wrapper.findComponent({ name: 'MoleculesListsTags' });
    expect(tagsComponent.exists()).toBe(true);
    expect(tagsComponent.props('tags')).toEqual([]);
  });

  it('handles different icon names', async () => {
    const propsWithDifferentIcon = {
      ...defaultProps,
      icon: 'i-heroicons-server',
    };

    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: propsWithDifferentIcon,
    });

    const icon = wrapper.findComponent({ name: 'UIcon' });
    expect(icon.exists()).toBe(true);
    expect(icon.props('name')).toBe('i-heroicons-server');
  });

  it('validates required props structure', async () => {
    // Test that component works with all required props
    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: defaultProps,
    });

    // Verify all key elements exist when all props are provided
    expect(wrapper.findComponent({ name: 'UIcon' }).exists()).toBe(true);
    expect(wrapper.find('h3').exists()).toBe(true);
    expect(wrapper.find('p').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'MoleculesListsTags' }).exists()).toBe(
      true
    );

    // Verify the component structure
    expect(wrapper.find('.text-center').exists()).toBe(true);
    expect(wrapper.find('.w-16.h-16').exists()).toBe(true);
  });

  it('renders with long content gracefully', async () => {
    const propsWithLongContent = {
      icon: 'i-heroicons-code-bracket',
      title: 'Very Long Title That Might Wrap To Multiple Lines In Some Cases',
      description:
        'This is a very long description that contains multiple sentences and should test how the component handles longer text content. It should wrap appropriately and maintain good visual hierarchy.',
      technologies: [
        'Vue.js',
        'TypeScript',
        'Tailwind CSS',
        'Nuxt.js',
        'Vitest',
        'ESLint',
        'Prettier',
        'Git',
      ],
    };

    const wrapper = await mountSuspended(OrganismsCardsSkill, {
      props: propsWithLongContent,
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('h3').text()).toBe(propsWithLongContent.title);
    expect(wrapper.find('p').text()).toBe(propsWithLongContent.description);
  });
});
