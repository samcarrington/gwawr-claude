import type { Project, ProjectsResponse } from '~/types/project';

interface UseProjectsOptions {
  category?: string;
  featured?: boolean;
  status?: 'completed' | 'in-progress' | 'planned';
  search?: string;
  limit?: number;
  skip?: number;
  server?: boolean;
  lazy?: boolean;
}

/**
 * Composable for fetching projects from Contentful
 */
export const useProjects = (options: UseProjectsOptions = {}) => {
  // Build query parameters
  const query = computed(() => {
    const params: Record<string, any> = {};

    if (options.category) params.category = options.category;
    if (options.featured !== undefined) params.featured = options.featured;
    if (options.status) params.status = options.status;
    if (options.search) params.search = options.search;
    if (options.limit) params.limit = options.limit;
    if (options.skip) params.skip = options.skip;

    return params;
  });

  // Generate cache key based on query parameters
  const key = computed(() => {
    const queryString = JSON.stringify(
      query.value,
      Object.keys(query.value).sort()
    );
    // Use btoa for browser compatibility
    const encoded = import.meta.client
      ? btoa(queryString)
      : Buffer.from(queryString).toString('base64');
    return `projects-${encoded}`;
  });

  // Choose fetch method based on options
  const fetchMethod = options.lazy ? useLazyFetch : useFetch;

  return fetchMethod<ProjectsResponse>('/api/projects', {
    key: key.value,
    query: query.value,
    default: () => ({ items: [], total: 0, skip: 0, limit: 0 }),
    server: options.server ?? true,
    // Remove client-side transformation to prevent interference with server transformations
    onResponseError({ response }) {
      console.error('Failed to fetch projects:', response._data);
    },
  });
};

/**
 * Composable for fetching featured projects
 */
export const useFeaturedProjects = (limit = 3) => {
  return useFetch<Project[]>('/api/projects/featured', {
    key: `featured-projects-${limit}`,
    query: { limit },
    default: () => [],
    server: true,
    // Remove client-side transformation to prevent interference with server transformations
    onResponseError({ response }) {
      console.error('Failed to fetch featured projects:', response._data);
    },
  });
};

/**
 * Composable for fetching a single project by slug
 */
export const useProject = (slug: string | Ref<string>) => {
  const slugRef = isRef(slug) ? slug : ref(slug);

  // Use dedicated API endpoint for optimal performance
  const {
    data: response,
    error,
    pending,
  } = useFetch<Project | null>(`/api/projects/${slugRef.value}`, {
    key: `project-${slugRef.value}`,
    default: () => null,
    server: true,
    // Transform response to extract project
    transform: (data: any) => data?.project || null,
  });

  return {
    data: response,
    error,
    pending,
  };
};

/**
 * Reactive composable for project filtering with persistent state via URL query parameters
 */
export const useProjectFilter = () => {
  const route = useRoute();
  const router = useRouter();

  // Initialize filter state from URL query parameters with defaults
  const selectedCategory = ref<string>(
    (route.query.category as string) || 'All'
  );
  const selectedStatus = ref<string>((route.query.status as string) || 'All');
  const searchQuery = ref<string>((route.query.search as string) || '');
  const showFeaturedOnly = ref<boolean>(route.query.featured === 'true');

  // Function to update URL with current filter state
  const updateURL = () => {
    const query: Record<string, string> = {};

    if (selectedCategory.value !== 'All') {
      query.category = selectedCategory.value;
    }
    if (selectedStatus.value !== 'All') {
      query.status = selectedStatus.value;
    }
    if (searchQuery.value) {
      query.search = searchQuery.value;
    }
    if (showFeaturedOnly.value) {
      query.featured = 'true';
    }

    // Only update URL if query parameters have changed
    const currentQuery = route.query;
    const hasChanged =
      Object.keys(query).length !== Object.keys(currentQuery).length ||
      Object.entries(query).some(([key, value]) => currentQuery[key] !== value);

    if (hasChanged || Object.keys(currentQuery).some(key => !query[key])) {
      router.replace({ query });
    }
  };

  // Watch for filter changes and update URL
  watch(
    [selectedCategory, selectedStatus, searchQuery, showFeaturedOnly],
    () => {
      updateURL();
    },
    { flush: 'post' }
  );

  // Watch for URL changes (browser back/forward) and update filter state
  watch(
    () => route.query,
    newQuery => {
      selectedCategory.value = (newQuery.category as string) || 'All';
      selectedStatus.value = (newQuery.status as string) || 'All';
      searchQuery.value = (newQuery.search as string) || '';
      showFeaturedOnly.value = newQuery.featured === 'true';
    },
    { immediate: false }
  );

  // Create reactive options for useProjects
  const projectsOptions = computed(() => ({
    category:
      selectedCategory.value === 'All' ? undefined : selectedCategory.value,
    status:
      selectedStatus.value === 'All'
        ? undefined
        : (selectedStatus.value as Project['status']),
    search: searchQuery.value || undefined,
    featured: showFeaturedOnly.value || undefined,
    lazy: true,
  }));

  // Use the reactive options with useLazyFetch for server and client-side filtering
  const {
    data: projects,
    pending,
    error,
    refresh,
  } = useLazyFetch<ProjectsResponse>('/api/projects', {
    key: computed(
      () => `projects-filter-${JSON.stringify(projectsOptions.value)}`
    ),
    query: computed(() => {
      const params: Record<string, any> = {};
      if (projectsOptions.value.category)
        params.category = projectsOptions.value.category;
      if (projectsOptions.value.status)
        params.status = projectsOptions.value.status;
      if (projectsOptions.value.search)
        params.search = projectsOptions.value.search;
      if (projectsOptions.value.featured !== undefined)
        params.featured = projectsOptions.value.featured;
      return params;
    }),
    default: () => ({ items: [], total: 0, skip: 0, limit: 0 }),
    server: true, // Enable server-side rendering to fix hydration mismatch
  });

  // Get unique categories from all projects
  const { data: allProjects } = useProjects({ limit: 1000 });
  const categories = computed(() => {
    if (!allProjects.value?.items) return ['All'];
    const cats = new Set(
      allProjects.value.items.map(p => p.category).filter(Boolean)
    );
    return ['All', ...Array.from(cats).sort()];
  });

  // Status options
  const statusOptions = ['All', 'completed', 'in-progress', 'planned'];

  // Reset filters
  const resetFilters = () => {
    selectedCategory.value = 'All';
    selectedStatus.value = 'All';
    searchQuery.value = '';
    showFeaturedOnly.value = false;
    // URL will be updated automatically via watchers
  };

  return {
    // Filter state
    selectedCategory,
    selectedStatus,
    searchQuery,
    showFeaturedOnly,

    // Filter options
    categories,
    statusOptions,

    // Data
    projects: computed(() => projects.value?.items || []),
    total: computed(() => projects.value?.total || 0),
    pending,
    error,

    // Actions
    resetFilters,
    refresh,
  };
};

/**
 * Composable for project statistics
 */
export const useProjectStats = () => {
  const { data: projects } = useProjects({ limit: 1000 });

  const stats = computed(() => {
    if (!projects.value?.items) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        planned: 0,
        featured: 0,
      };
    }

    const items = projects.value.items;

    return {
      total: items.length,
      completed: items.filter(p => p.status === 'completed').length,
      inProgress: items.filter(p => p.status === 'in-progress').length,
      planned: items.filter(p => p.status === 'planned').length,
      featured: items.filter(p => p.featured).length,
    };
  });

  return {
    stats,
    pending: computed(() => !projects.value),
  };
};
