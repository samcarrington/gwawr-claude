import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from 'contentful';
import testimonialsHandler from '~/server/api/testimonials.get';
import featuredTestimonialsHandler from '~/server/api/testimonials/featured.get';

// Mock contentful client
vi.mock('contentful', () => ({
  createClient: vi.fn(),
}));

// Mock transformTestimonials
vi.mock('~/utils/contentful-transformers', () => ({
  transformTestimonials: vi.fn(),
  transformTestimonial: vi.fn(),
}));

// Mock Nuxt server utilities
const mockEvent = {
  node: {
    req: {},
    res: {},
  },
};

const mockUseRuntimeConfig = vi.fn();
const mockGetQuery = vi.fn();
const mockSetHeader = vi.fn();
const mockCreateError = vi.fn();

vi.mock('#imports', () => ({
  useRuntimeConfig: mockUseRuntimeConfig,
  getQuery: mockGetQuery,
  setHeader: mockSetHeader,
  createError: mockCreateError,
  defineEventHandler: (handler: any) => handler,
}));

describe('Testimonials API', () => {
  const mockContentfulClient = {
    getEntries: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createClient).mockReturnValue(mockContentfulClient as any);

    mockUseRuntimeConfig.mockReturnValue({
      public: {
        contentfulSpaceId: 'test-space-id',
        contentfulAccessToken: 'test-access-token',
        contentfulEnvironment: 'master',
        contentfulHost: 'cdn.contentful.com',
      },
    });
  });

  describe('/api/testimonials', () => {
    it('should fetch and transform testimonials successfully', async () => {
      const { transformTestimonials } = await import(
        '~/utils/contentful-transformers'
      );

      mockGetQuery.mockReturnValue({ limit: '10', skip: '0' });

      const mockContentfulResponse = {
        items: [
          {
            sys: { id: 'testimonial-1' },
            fields: {
              title: 'Great Work',
              quote: { nodeType: 'document' },
              clientName: 'John Doe',
              rating: 5,
              featured: true,
            },
          },
        ],
        total: 1,
        skip: 0,
        limit: 10,
      };

      const mockTransformedTestimonials = [
        {
          id: 'testimonial-1',
          title: 'Great Work',
          content: 'Excellent service and quality work!',
          clientName: 'John Doe',
          clientTitle: undefined,
          clientCompany: undefined,
          company: undefined,
          name: undefined,
          rating: 5,
          featured: true,
          projectReference: undefined,
          attribution: undefined,
        },
      ];

      mockContentfulClient.getEntries.mockResolvedValue(mockContentfulResponse);
      vi.mocked(transformTestimonials).mockResolvedValue(
        mockTransformedTestimonials
      );

      const result = await testimonialsHandler(mockEvent as any);

      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'testimonial',
        order: '-sys.createdAt',
        limit: 10,
        skip: 0,
        include: 2,
      });

      expect(transformTestimonials).toHaveBeenCalledWith(
        mockContentfulResponse.items
      );
      expect(mockSetHeader).toHaveBeenCalledWith(
        mockEvent,
        'Cache-Control',
        'public, max-age=900'
      );

      expect(result).toEqual({
        items: mockTransformedTestimonials,
        total: 1,
        skip: 0,
        limit: 10,
      });
    });

    it('should handle featured filter parameter', async () => {
      const { transformTestimonials } = await import(
        '~/utils/contentful-transformers'
      );

      mockGetQuery.mockReturnValue({ featured: 'true', limit: '5' });
      mockContentfulClient.getEntries.mockResolvedValue({
        items: [],
        total: 0,
        skip: 0,
        limit: 5,
      });
      vi.mocked(transformTestimonials).mockResolvedValue([]);

      await testimonialsHandler(mockEvent as any);

      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'testimonial',
        order: '-sys.createdAt',
        limit: 5,
        skip: 0,
        include: 2,
        'fields.featured': true,
      });
    });

    it('should handle minRating filter parameter', async () => {
      const { transformTestimonials } = await import(
        '~/utils/contentful-transformers'
      );

      mockGetQuery.mockReturnValue({ minRating: '4' });
      mockContentfulClient.getEntries.mockResolvedValue({
        items: [],
        total: 0,
        skip: 0,
        limit: 20,
      });
      vi.mocked(transformTestimonials).mockResolvedValue([]);

      await testimonialsHandler(mockEvent as any);

      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'testimonial',
        order: '-sys.createdAt',
        limit: 20,
        skip: 0,
        include: 2,
        'fields.rating[gte]': 4,
      });
    });

    it('should handle search parameter', async () => {
      const { transformTestimonials } = await import(
        '~/utils/contentful-transformers'
      );

      mockGetQuery.mockReturnValue({ search: 'excellent work' });
      mockContentfulClient.getEntries.mockResolvedValue({
        items: [],
        total: 0,
        skip: 0,
        limit: 20,
      });
      vi.mocked(transformTestimonials).mockResolvedValue([]);

      await testimonialsHandler(mockEvent as any);

      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'testimonial',
        order: '-sys.createdAt',
        limit: 20,
        skip: 0,
        include: 2,
        query: 'excellent work',
      });
    });

    it('should throw error when Contentful is not configured', async () => {
      mockUseRuntimeConfig.mockReturnValue({
        public: {
          contentfulSpaceId: null,
          contentfulAccessToken: null,
        },
      });

      mockCreateError.mockReturnValue(
        new Error('Contentful configuration is missing')
      );

      await expect(testimonialsHandler(mockEvent as any)).rejects.toThrow();

      expect(mockCreateError).toHaveBeenCalledWith({
        statusCode: 500,
        statusMessage: 'Contentful configuration is missing',
      });
    });

    it('should handle Contentful API errors', async () => {
      const { transformTestimonials } = await import(
        '~/utils/contentful-transformers'
      );

      mockGetQuery.mockReturnValue({});
      mockContentfulClient.getEntries.mockRejectedValue(
        new Error('Contentful API Error')
      );
      mockCreateError.mockReturnValue(
        new Error('Failed to fetch testimonials')
      );

      await expect(testimonialsHandler(mockEvent as any)).rejects.toThrow();

      expect(mockCreateError).toHaveBeenCalledWith({
        statusCode: 500,
        statusMessage: 'Failed to fetch testimonials',
        data: {
          error: 'Contentful API Error',
        },
      });
    });
  });

  describe('/api/testimonials/featured', () => {
    it('should fetch and transform featured testimonials successfully', async () => {
      const { transformTestimonial } = await import(
        '~/utils/contentful-transformers'
      );

      mockGetQuery.mockReturnValue({ limit: '3' });

      const mockContentfulResponse = {
        items: [
          {
            sys: { id: 'featured-testimonial-1' },
            fields: {
              title: 'Featured Testimonial',
              quote: { nodeType: 'document' },
              clientName: 'Jane Smith',
              rating: 5,
              featured: true,
            },
          },
        ],
      };

      const mockTransformedTestimonial = {
        id: 'featured-testimonial-1',
        title: 'Featured Testimonial',
        content: 'Outstanding work and professionalism!',
        clientName: 'Jane Smith',
        clientTitle: undefined,
        clientCompany: undefined,
        company: undefined,
        name: undefined,
        rating: 5,
        featured: true,
        projectReference: undefined,
        attribution: undefined,
      };

      mockContentfulClient.getEntries.mockResolvedValue(mockContentfulResponse);
      vi.mocked(transformTestimonial).mockResolvedValue(
        mockTransformedTestimonial
      );

      const result = await featuredTestimonialsHandler(mockEvent as any);

      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'testimonial',
        'fields.featured': true,
        order: '-fields.rating,-sys.createdAt',
        limit: 3,
        include: 2,
      });

      expect(transformTestimonial).toHaveBeenCalledWith(
        mockContentfulResponse.items[0]
      );
      expect(mockSetHeader).toHaveBeenCalledWith(
        mockEvent,
        'Cache-Control',
        'public, max-age=900'
      );

      expect(result).toEqual([mockTransformedTestimonial]);
    });

    it('should use default limit when not provided', async () => {
      const { transformTestimonial } = await import(
        '~/utils/contentful-transformers'
      );

      mockGetQuery.mockReturnValue({});
      mockContentfulClient.getEntries.mockResolvedValue({ items: [] });

      await featuredTestimonialsHandler(mockEvent as any);

      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'testimonial',
        'fields.featured': true,
        order: '-fields.rating,-sys.createdAt',
        limit: 5, // Default limit
        include: 2,
      });
    });

    it('should handle Contentful configuration errors', async () => {
      mockUseRuntimeConfig.mockReturnValue({
        public: {
          contentfulSpaceId: null,
          contentfulAccessToken: null,
        },
      });

      mockCreateError.mockReturnValue(new Error('Contentful not configured'));

      await expect(
        featuredTestimonialsHandler(mockEvent as any)
      ).rejects.toThrow();

      expect(mockCreateError).toHaveBeenCalledWith({
        statusCode: 503,
        statusMessage: 'Contentful not configured',
      });
    });
  });
});
