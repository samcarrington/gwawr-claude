import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextTick, ref } from 'vue';

// Mock the API response
const mockProjectsResponse = {
  items: [
    {
      id: '1',
      title: 'Test Project 1',
      category: 'Web Development',
      status: 'completed' as const,
      featured: true,
    },
    {
      id: '2',
      title: 'Test Project 2',
      category: 'Mobile App',
      status: 'in-progress' as const,
      featured: false,
    },
  ],
  total: 2,
  skip: 0,
  limit: 100,
};

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
  useLazyFetch: vi.fn(() => ({
    data: ref(mockProjectsResponse),
    pending: ref(false),
    error: ref(null),
    refresh: vi.fn(),
  })),
  watch: vi.fn(),
}));

describe('useProjectFilter', () => {
  let mockRoute: any;
  let mockRouter: any;

  beforeEach(() => {
    // Reset mocks before each test
    mockRoute = {
      query: {},
      path: '/projects',
    };

    mockRouter = {
      replace: vi.fn(),
      push: vi.fn(),
    };

    // Mock useRoute and useRouter
    vi.mocked(useRoute).mockReturnValue(mockRoute);
    vi.mocked(useRouter).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('State Initialization', () => {
    it('should initialize with default values when no URL params', () => {
      const {
        selectedCategory,
        selectedStatus,
        searchQuery,
        showFeaturedOnly,
      } = useProjectFilter();

      expect(selectedCategory.value).toBe('All');
      expect(selectedStatus.value).toBe('All');
      expect(searchQuery.value).toBe('');
      expect(showFeaturedOnly.value).toBe(false);
    });

    it('should initialize from URL query parameters', () => {
      mockRoute.query = {
        category: 'Web Development',
        status: 'completed',
        search: 'test',
        featured: 'true',
      };

      const {
        selectedCategory,
        selectedStatus,
        searchQuery,
        showFeaturedOnly,
      } = useProjectFilter();

      expect(selectedCategory.value).toBe('Web Development');
      expect(selectedStatus.value).toBe('completed');
      expect(searchQuery.value).toBe('test');
      expect(showFeaturedOnly.value).toBe(true);
    });

    it('should handle partial URL parameters', () => {
      mockRoute.query = {
        category: 'Mobile App',
      };

      const {
        selectedCategory,
        selectedStatus,
        searchQuery,
        showFeaturedOnly,
      } = useProjectFilter();

      expect(selectedCategory.value).toBe('Mobile App');
      expect(selectedStatus.value).toBe('All');
      expect(searchQuery.value).toBe('');
      expect(showFeaturedOnly.value).toBe(false);
    });
  });

  describe('URL Synchronization', () => {
    it('should update URL when filter values change', async () => {
      const { selectedCategory, selectedStatus } = useProjectFilter();

      selectedCategory.value = 'Web Development';
      await nextTick();

      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: { category: 'Web Development' },
      });

      selectedStatus.value = 'completed';
      await nextTick();

      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: { category: 'Web Development', status: 'completed' },
      });
    });

    it('should not include default values in URL', async () => {
      const { selectedCategory, selectedStatus } = useProjectFilter();

      selectedCategory.value = 'Web Development';
      selectedStatus.value = 'All'; // Default value
      await nextTick();

      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: { category: 'Web Development' },
      });
    });

    it('should remove parameters when reset to default', async () => {
      mockRoute.query = { category: 'Web Development', status: 'completed' };
      const { selectedCategory, selectedStatus } = useProjectFilter();

      selectedCategory.value = 'All';
      selectedStatus.value = 'All';
      await nextTick();

      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: {},
      });
    });

    it('should handle featured filter correctly', async () => {
      const { showFeaturedOnly } = useProjectFilter();

      showFeaturedOnly.value = true;
      await nextTick();

      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: { featured: 'true' },
      });

      showFeaturedOnly.value = false;
      await nextTick();

      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: {},
      });
    });
  });

  describe('Browser Navigation', () => {
    it('should update filter state when URL changes', async () => {
      const {
        selectedCategory,
        selectedStatus,
        searchQuery,
        showFeaturedOnly,
      } = useProjectFilter();

      // Simulate browser back/forward navigation
      mockRoute.query = {
        category: 'Mobile App',
        status: 'in-progress',
        search: 'mobile',
        featured: 'true',
      };

      // Trigger the route query watcher manually
      const routeWatcher = vi
        .mocked(watch)
        .mock.calls.find(call => typeof call[0] === 'function');
      if (routeWatcher && routeWatcher[1]) {
        routeWatcher[1](mockRoute.query, {}, { flush: 'post' });
      }

      expect(selectedCategory.value).toBe('Mobile App');
      expect(selectedStatus.value).toBe('in-progress');
      expect(searchQuery.value).toBe('mobile');
      expect(showFeaturedOnly.value).toBe(true);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all filters to default values', async () => {
      mockRoute.query = {
        category: 'Web Development',
        status: 'completed',
        search: 'test',
        featured: 'true',
      };

      const {
        selectedCategory,
        selectedStatus,
        searchQuery,
        showFeaturedOnly,
        resetFilters,
      } = useProjectFilter();

      resetFilters();

      expect(selectedCategory.value).toBe('All');
      expect(selectedStatus.value).toBe('All');
      expect(searchQuery.value).toBe('');
      expect(showFeaturedOnly.value).toBe(false);
    });
  });

  describe('Categories and Status Options', () => {
    it('should provide correct status options', () => {
      const { statusOptions } = useProjectFilter();

      expect(statusOptions).toEqual([
        'All',
        'completed',
        'in-progress',
        'planned',
      ]);
    });

    it('should generate categories from project data', () => {
      const { categories } = useProjectFilter();

      expect(categories.value).toEqual([
        'All',
        'Mobile App',
        'Web Development',
      ]);
    });
  });

  describe('Project Data Integration', () => {
    it('should return projects from the API response', () => {
      const { projects } = useProjectFilter();

      expect(projects.value).toEqual(mockProjectsResponse.items);
    });

    it('should return total count from API response', () => {
      const { total } = useProjectFilter();

      expect(total.value).toBe(2);
    });
  });
});
