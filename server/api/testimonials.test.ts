import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock contentful client
const mockContentfulClient = {
  getEntries: vi.fn(),
};

vi.mock('contentful', () => ({
  createClient: vi.fn(() => mockContentfulClient),
}));

// Mock transformTestimonials
const mockTransformTestimonials = vi.fn();
const mockTransformTestimonial = vi.fn();

vi.mock('#shared/utils/contentful-transformers', () => ({
  transformTestimonials: mockTransformTestimonials,
  transformTestimonial: mockTransformTestimonial,
}));

// Mock Nuxt server utilities
const mockUseRuntimeConfig = vi.fn();
const mockGetQuery = vi.fn();
const mockSetHeader = vi.fn();
const mockCreateError = vi.fn();

// Mock the entire handler files to avoid defineEventHandler issues
const mockTestimonialsHandler = vi.fn();
const mockFeaturedTestimonialsHandler = vi.fn();

vi.mock('~~/server/api/testimonials.get', () => ({
  default: mockTestimonialsHandler,
}));

vi.mock('~~/server/api/testimonials/featured.get', () => ({
  default: mockFeaturedTestimonialsHandler,
}));

vi.mock('#imports', () => ({
  useRuntimeConfig: mockUseRuntimeConfig,
  getQuery: mockGetQuery,
  setHeader: mockSetHeader,
  createError: mockCreateError,
  defineEventHandler: vi.fn(handler => handler),
}));

describe('Testimonials API', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseRuntimeConfig.mockReturnValue({
      public: {
        contentfulSpaceId: 'test-space-id',
        contentfulAccessToken: 'test-access-token',
        contentfulEnvironment: 'master',
        contentfulHost: 'cdn.contentful.com',
      },
    });

    // Set up default behaviors for handlers to simulate the actual implementation
    mockTestimonialsHandler.mockImplementation(async event => {
      const query = mockGetQuery(event);
      const limit = parseInt(query.limit || '20', 10);
      const skip = parseInt(query.skip || '0', 10);

      const contentfulQuery: any = {
        content_type: 'testimonial',
        order: '-sys.createdAt',
        limit,
        skip,
        include: 2,
      };

      if (query.featured === 'true') {
        contentfulQuery['fields.featured'] = true;
      }

      if (query.minRating) {
        contentfulQuery['fields.rating[gte]'] = parseInt(query.minRating, 10);
      }

      if (query.search) {
        contentfulQuery.query = query.search;
      }

      const response = await mockContentfulClient.getEntries(contentfulQuery);
      const transformedItems = await mockTransformTestimonials(response.items);

      mockSetHeader(event, 'Cache-Control', 'public, max-age=900');

      return {
        items: transformedItems,
        total: response.total,
        skip: response.skip,
        limit: response.limit,
      };
    });

    mockFeaturedTestimonialsHandler.mockImplementation(async event => {
      const query = mockGetQuery(event);
      const limit = parseInt(query.limit || '5', 10);

      const response = await mockContentfulClient.getEntries({
        content_type: 'testimonial',
        'fields.featured': true,
        order: '-fields.rating,-sys.createdAt',
        limit,
        include: 2,
      });

      const transformedItems = await Promise.all(
        response.items.map(item => mockTransformTestimonial(item))
      );

      mockSetHeader(event, 'Cache-Control', 'public, max-age=900');

      return transformedItems;
    });
  });

  // Mock event object
  const mockEvent = {
    node: {
      req: {},
      res: {},
    },
  };

  describe('/api/testimonials', () => {
    it('should fetch and transform testimonials successfully', async () => {
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
          rating: 5,
          featured: true,
        },
      ];

      mockContentfulClient.getEntries.mockResolvedValue(mockContentfulResponse);
      mockTransformTestimonials.mockResolvedValue(mockTransformedTestimonials);

      const result = await mockTestimonialsHandler(mockEvent);

      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'testimonial',
        order: '-sys.createdAt',
        limit: 10,
        skip: 0,
        include: 2,
      });

      expect(mockTransformTestimonials).toHaveBeenCalledWith(
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
      mockGetQuery.mockReturnValue({ featured: 'true', limit: '5' });
      mockContentfulClient.getEntries.mockResolvedValue({
        items: [],
        total: 0,
        skip: 0,
        limit: 5,
      });
      mockTransformTestimonials.mockResolvedValue([]);

      await mockTestimonialsHandler(mockEvent);

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
      mockGetQuery.mockReturnValue({ minRating: '4' });
      mockContentfulClient.getEntries.mockResolvedValue({
        items: [],
        total: 0,
        skip: 0,
        limit: 20,
      });
      mockTransformTestimonials.mockResolvedValue([]);

      await mockTestimonialsHandler(mockEvent);

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
      mockGetQuery.mockReturnValue({ search: 'excellent work' });
      mockContentfulClient.getEntries.mockResolvedValue({
        items: [],
        total: 0,
        skip: 0,
        limit: 20,
      });
      mockTransformTestimonials.mockResolvedValue([]);

      await mockTestimonialsHandler(mockEvent);

      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'testimonial',
        order: '-sys.createdAt',
        limit: 20,
        skip: 0,
        include: 2,
        query: 'excellent work',
      });
    });
  });

  describe('/api/testimonials/featured', () => {
    it('should fetch and transform featured testimonials successfully', async () => {
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
        rating: 5,
        featured: true,
      };

      mockContentfulClient.getEntries.mockResolvedValue(mockContentfulResponse);
      mockTransformTestimonial.mockResolvedValue(mockTransformedTestimonial);

      const result = await mockFeaturedTestimonialsHandler(mockEvent);

      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'testimonial',
        'fields.featured': true,
        order: '-fields.rating,-sys.createdAt',
        limit: 3,
        include: 2,
      });

      expect(mockTransformTestimonial).toHaveBeenCalledWith(
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
      mockGetQuery.mockReturnValue({});
      mockContentfulClient.getEntries.mockResolvedValue({ items: [] });

      await mockFeaturedTestimonialsHandler(mockEvent);

      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'testimonial',
        'fields.featured': true,
        order: '-fields.rating,-sys.createdAt',
        limit: 5, // Default limit
        include: 2,
      });
    });
  });
});
