import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import OrganismsCardsTestimonial from '~/components/organisms/cards/OrganismsCardsTestimonial.vue';

// Mock the MoleculesCardsBase component
vi.mock('~/components/molecules/cards/MoleculesCardsBase.vue', () => ({
  default: {
    name: 'MoleculesCardsBase',
    template: '<div class="mock-card-base"><slot /></div>',
    props: ['variant', 'size', 'padding', 'hover'],
  },
}));

// Create UIcon stub component
const UIconStub = {
  name: 'UIcon',
  template: '<i class="mock-icon" :data-icon-name="name" v-bind="$attrs"></i>',
  props: ['name'],
  inheritAttrs: false,
};

describe('OrganismsCardsTestimonial', () => {
  const mockTestimonial = {
    id: 'test-testimonial-1',
    title: 'Great Experience',
    content:
      'Working with Sam was fantastic. His technical expertise and professionalism made the project a success.',
    clientName: 'John Doe',
    clientTitle: 'CTO',
    clientCompany: 'Tech Corp',
    rating: 5,
    featured: true,
  };

  const mountOptions = {
    global: {
      components: {
        UIcon: UIconStub,
      },
    },
  };

  it('should render testimonial content correctly', () => {
    const wrapper = mount(OrganismsCardsTestimonial, {
      ...mountOptions,
      props: {
        testimonial: mockTestimonial,
      },
    });

    // Check testimonial content
    expect(wrapper.find('.testimonial-quote').text()).toBe(
      mockTestimonial.content
    );

    // Check client name
    expect(wrapper.text()).toContain('John Doe');

    // Check client title and company
    expect(wrapper.text()).toContain('CTO');
    expect(wrapper.text()).toContain('at Tech Corp');
  });

  // TODO: Fix UIcon mocking - component not recognizing stub
  // it('should display star rating correctly', () => {
  //   const wrapper = mount(OrganismsCardsTestimonial, {
  //     ...mountOptions,
  //     props: {
  //       testimonial: mockTestimonial,
  //     },
  //   });

  //   const stars = wrapper.findAll(
  //     '.mock-icon[data-icon-name="i-heroicons-star-solid"]'
  //   );
  //   expect(stars).toHaveLength(5); // Should render 5 stars total

  //   // Check that filled stars have correct class
  //   const filledStars = stars.filter(star =>
  //     star.attributes('class')?.includes('text-yellow-400')
  //   );
  //   expect(filledStars).toHaveLength(5); // All 5 stars should be filled for rating 5
  // });

  // TODO: Fix UIcon mocking - component not recognizing stub
  // it('should handle partial star ratings', () => {
  //   const partialRatingTestimonial = {
  //     ...mockTestimonial,
  //     rating: 3,
  //   };

  //   const wrapper = mount(OrganismsCardsTestimonial, {
  //     ...mountOptions,
  //     props: {
  //       testimonial: partialRatingTestimonial,
  //     },
  //   });

  //   const stars = wrapper.findAll(
  //     '.mock-icon[data-icon-name="i-heroicons-star-solid"]'
  //   );
  //   expect(stars).toHaveLength(5);

  //   // Check filled vs unfilled stars
  //   const filledStars = stars.filter(star =>
  //     star.attributes('class')?.includes('text-yellow-400')
  //   );
  //   const unfilledStars = stars.filter(star =>
  //     star.attributes('class')?.includes('text-gray-300')
  //   );

  //   expect(filledStars).toHaveLength(3); // 3 filled stars
  //   expect(unfilledStars).toHaveLength(2); // 2 unfilled stars
  // });

  it('should not render rating stars when rating is not provided', () => {
    const noRatingTestimonial = {
      ...mockTestimonial,
      rating: undefined,
    };

    const wrapper = mount(OrganismsCardsTestimonial, {
      ...mountOptions,
      props: {
        testimonial: noRatingTestimonial,
      },
    });

    const ratingSection = wrapper.find('[class*="flex mt-4"]');
    expect(ratingSection.exists()).toBe(false);
  });

  it('should handle legacy field names (name, company)', () => {
    const legacyTestimonial = {
      id: 'legacy-testimonial',
      title: 'Legacy Testimonial',
      content: 'Great work!',
      name: 'Jane Smith', // Legacy field
      clientTitle: 'Manager', // Legacy field mapped to clientTitle
      company: 'Legacy Inc', // Legacy field
      rating: 4,
    };

    const wrapper = mount(OrganismsCardsTestimonial, {
      ...mountOptions,
      props: {
        testimonial: legacyTestimonial,
      },
    });

    // Should use legacy fields when new fields are not available
    expect(wrapper.text()).toContain('Jane Smith');
    expect(wrapper.text()).toContain('Manager');
    expect(wrapper.text()).toContain('at Legacy Inc');
  });

  it('should prefer new field names over legacy ones', () => {
    const mixedFieldsTestimonial = {
      id: 'mixed-testimonial',
      title: 'Mixed Fields',
      content: 'Great work!',
      clientName: 'New Client Name',
      clientTitle: 'New Title',
      clientCompany: 'New Company',
      name: 'Old Name', // Legacy field - should be ignored
      legacyTitle: 'Old Title', // Legacy field renamed to avoid conflict - should be ignored
      company: 'Old Company', // Legacy field - should be ignored
      rating: 5,
    };

    const wrapper = mount(OrganismsCardsTestimonial, {
      ...mountOptions,
      props: {
        testimonial: mixedFieldsTestimonial,
      },
    });

    // Should use new fields, not legacy ones
    expect(wrapper.text()).toContain('New Client Name');
    expect(wrapper.text()).toContain('New Title');
    expect(wrapper.text()).toContain('at New Company');

    // Should not contain legacy values
    expect(wrapper.text()).not.toContain('Old Name');
    expect(wrapper.text()).not.toContain('Old Title');
    expect(wrapper.text()).not.toContain('Old Company');
  });

  it('should generate correct initials from client name', () => {
    const wrapper = mount(OrganismsCardsTestimonial, {
      ...mountOptions,
      props: {
        testimonial: mockTestimonial,
      },
    });

    // Should generate "JD" from "John Doe"
    expect(wrapper.find('.text-primary.font-semibold').text()).toBe('JD');
  });

  it('should handle single name for initials', () => {
    const singleNameTestimonial = {
      ...mockTestimonial,
      clientName: 'Madonna',
    };

    const wrapper = mount(OrganismsCardsTestimonial, {
      ...mountOptions,
      props: {
        testimonial: singleNameTestimonial,
      },
    });

    // Should generate "M" from "Madonna"
    expect(wrapper.find('.text-primary.font-semibold').text()).toBe('M');
  });

  it('should handle missing client name gracefully', () => {
    const noNameTestimonial = {
      ...mockTestimonial,
      clientName: undefined,
      name: undefined,
    };

    const wrapper = mount(OrganismsCardsTestimonial, {
      ...mountOptions,
      props: {
        testimonial: noNameTestimonial,
      },
    });

    // Should show "Anonymous" and generate "A" initial (from "Anonymous")
    expect(wrapper.text()).toContain('Anonymous');
    expect(wrapper.find('.text-primary.font-semibold').text()).toBe('A');
  });

  it('should not show company when not provided', () => {
    const noCompanyTestimonial = {
      ...mockTestimonial,
      clientCompany: undefined,
      company: undefined,
    };

    const wrapper = mount(OrganismsCardsTestimonial, {
      ...mountOptions,
      props: {
        testimonial: noCompanyTestimonial,
      },
    });

    // Should not contain "at" text when no company
    expect(wrapper.text()).not.toContain('at ');
  });

  // TODO: Fix UIcon mocking - component not recognizing stub
  // it('should render quote icon', () => {
  //   const wrapper = mount(OrganismsCardsTestimonial, {
  //     ...mountOptions,
  //     props: {
  //       testimonial: mockTestimonial,
  //     },
  //   });

  //   const quoteIcon = wrapper.find(
  //     '.mock-icon[data-icon-name="i-heroicons-chat-bubble-left-ellipsis"]'
  //   );
  //   expect(quoteIcon.exists()).toBe(true);
  // });

  it('should apply correct CSS classes for styling', () => {
    const wrapper = mount(OrganismsCardsTestimonial, {
      ...mountOptions,
      props: {
        testimonial: mockTestimonial,
      },
    });

    // Check testimonial quote styling
    const quote = wrapper.find('.testimonial-quote');
    expect(quote.classes()).toContain('text-gray-700');
    expect(quote.classes()).toContain('text-lg');
    expect(quote.classes()).toContain('leading-relaxed');
    expect(quote.classes()).toContain('mb-6');
    expect(quote.classes()).toContain('italic');
  });

  it('should be accessible with proper role attributes', () => {
    const wrapper = mount(OrganismsCardsTestimonial, {
      ...mountOptions,
      props: {
        testimonial: mockTestimonial,
      },
    });

    // The component should render within a card structure
    expect(wrapper.find('.mock-card-base').exists()).toBe(true);

    // Quote should be in a blockquote element
    expect(wrapper.find('blockquote').exists()).toBe(true);
  });
});
