import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  transformTestimonial,
  transformTestimonials,
} from '~/utils/contentful-transformers';

// Mock the renderContent function
vi.mock('~/utils/contentful-transformers', async () => {
  const actual = await vi.importActual('~/utils/contentful-transformers');
  return {
    ...actual,
    renderContent: vi.fn(),
  };
});

describe('Testimonial Transformers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('transformTestimonial', () => {
    it('should transform a testimonial entry with quote field', async () => {
      // Mock the renderContent function
      const { renderContent } = await import('~/utils/contentful-transformers');
      vi.mocked(renderContent).mockResolvedValue(
        '<p class="mb-4">Great work with Sam!</p>'
      );

      const mockEntry = {
        sys: {
          id: 'test-testimonial-id',
        },
        fields: {
          title: 'Test Testimonial',
          quote: {
            nodeType: 'document',
            content: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Great work with Sam!',
                  },
                ],
              },
            ],
          },
          clientName: 'John Doe',
          clientTitle: 'CEO',
          clientCompany: 'Test Company',
          rating: 5,
          featured: true,
          projectReference: null,
          attribution: null,
        },
      };

      const result = await transformTestimonial(mockEntry);

      expect(result).toEqual({
        id: 'test-testimonial-id',
        title: 'Test Testimonial',
        content: 'Great work with Sam!', // Should strip <p> tags
        clientName: 'John Doe',
        clientTitle: 'CEO',
        clientCompany: 'Test Company',
        company: undefined,
        name: undefined,
        rating: 5,
        featured: true,
        projectReference: null,
        attribution: null,
      });

      expect(renderContent).toHaveBeenCalledWith(mockEntry.fields.quote);
    });

    it('should handle testimonial without quote field', async () => {
      const mockEntry = {
        sys: {
          id: 'test-testimonial-id',
        },
        fields: {
          title: 'Test Testimonial',
          clientName: 'John Doe',
          clientTitle: 'CEO',
          clientCompany: 'Test Company',
          rating: 4,
          featured: false,
        },
      };

      const result = await transformTestimonial(mockEntry);

      expect(result.content).toBe('');
      expect(result.clientName).toBe('John Doe');
      expect(result.rating).toBe(4);
      expect(result.featured).toBe(false);
    });

    it('should handle legacy fields (name, company)', async () => {
      const mockEntry = {
        sys: {
          id: 'legacy-testimonial-id',
        },
        fields: {
          title: 'Legacy Testimonial',
          name: 'Jane Smith', // Legacy field
          company: 'Legacy Corp', // Legacy field
          rating: 3,
          featured: false,
        },
      };

      const result = await transformTestimonial(mockEntry);

      expect(result.name).toBe('Jane Smith');
      expect(result.company).toBe('Legacy Corp');
      expect(result.clientName).toBeUndefined();
      expect(result.clientCompany).toBeUndefined();
    });

    it('should strip paragraph tags from rendered content', async () => {
      const { renderContent } = await import('~/utils/contentful-transformers');
      vi.mocked(renderContent).mockResolvedValue(
        '<p class="mb-4">Content with paragraph tags</p>'
      );

      const mockEntry = {
        sys: { id: 'test-id' },
        fields: {
          quote: { nodeType: 'document' },
          clientName: 'Test Client',
        },
      };

      const result = await transformTestimonial(mockEntry);

      expect(result.content).toBe('Content with paragraph tags');
    });

    it('should handle renderContent errors gracefully', async () => {
      const { renderContent } = await import('~/utils/contentful-transformers');
      vi.mocked(renderContent).mockRejectedValue(new Error('Render failed'));

      const mockEntry = {
        sys: { id: 'test-id' },
        fields: {
          quote: { nodeType: 'document' },
          clientName: 'Test Client',
        },
      };

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await transformTestimonial(mockEntry);

      expect(result.content).toEqual({ nodeType: 'document' }); // Fallback to raw content
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Testimonial Transformer] Failed to render quote content:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should default featured to false when not provided', async () => {
      const mockEntry = {
        sys: { id: 'test-id' },
        fields: {
          clientName: 'Test Client',
          // featured field not provided
        },
      };

      const result = await transformTestimonial(mockEntry);

      expect(result.featured).toBe(false);
    });
  });

  describe('transformTestimonials', () => {
    it('should transform multiple testimonial entries', async () => {
      const { renderContent } = await import('~/utils/contentful-transformers');
      vi.mocked(renderContent)
        .mockResolvedValueOnce('<p>First testimonial</p>')
        .mockResolvedValueOnce('<p>Second testimonial</p>');

      const mockEntries = [
        {
          sys: { id: 'testimonial-1' },
          fields: {
            title: 'First',
            quote: { nodeType: 'document' },
            clientName: 'Client 1',
            rating: 5,
            featured: true,
          },
        },
        {
          sys: { id: 'testimonial-2' },
          fields: {
            title: 'Second',
            quote: { nodeType: 'document' },
            clientName: 'Client 2',
            rating: 4,
            featured: false,
          },
        },
      ];

      const result = await transformTestimonials(mockEntries);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('testimonial-1');
      expect(result[0].content).toBe('First testimonial');
      expect(result[0].clientName).toBe('Client 1');
      expect(result[1].id).toBe('testimonial-2');
      expect(result[1].content).toBe('Second testimonial');
      expect(result[1].clientName).toBe('Client 2');
    });

    it('should handle empty array', async () => {
      const result = await transformTestimonials([]);

      expect(result).toEqual([]);
    });
  });
});
