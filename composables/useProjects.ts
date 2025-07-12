// TODO: Create proper Project type definition
interface Project {
  id: string
  title: string
  slug: string
  description: string
  fullDescription?: string
  technologies: string[]
  images: any[]
  liveUrl?: string
  repositoryUrl?: string
  featured: boolean
  category?: string
  startDate?: string
  endDate?: string
  status: 'completed' | 'in-progress' | 'planned'
}

interface ProjectsResponse {
  items: Project[]
  total: number
  skip: number
  limit: number
}

interface UseProjectsOptions {
  category?: string
  featured?: boolean
  status?: 'completed' | 'in-progress' | 'planned'
  search?: string
  limit?: number
  skip?: number
  server?: boolean
  lazy?: boolean
}

/**
 * Composable for fetching projects from Contentful
 */
export const useProjects = (options: UseProjectsOptions = {}) => {
  // Build query parameters
  const query = computed(() => {
    const params: Record<string, any> = {}
    
    if (options.category) params.category = options.category
    if (options.featured !== undefined) params.featured = options.featured
    if (options.status) params.status = options.status
    if (options.search) params.search = options.search
    if (options.limit) params.limit = options.limit
    if (options.skip) params.skip = options.skip
    
    return params
  })
  
  // Generate cache key based on query parameters
  const key = computed(() => {
    const queryString = JSON.stringify(query.value, Object.keys(query.value).sort())
    return `projects-${Buffer.from(queryString).toString('base64')}`
  })
  
  // Choose fetch method based on options
  const fetchMethod = options.lazy ? useLazyFetch : useFetch
  
  return fetchMethod<ProjectsResponse>('/api/projects', {
    key: key.value,
    query: query.value,
    default: () => ({ items: [], total: 0, skip: 0, limit: 0 }),
    server: options.server ?? true,
    transform: (data: ProjectsResponse) => {
      // Additional client-side transformation if needed
      return {
        ...data,
        items: data.items.map(project => ({
          ...project,
          // Ensure technologies is always an array
          technologies: project.technologies || [],
          // Ensure status has a default
          status: project.status || 'completed' as const,
        }))
      }
    },
    onResponseError({ response }) {
      console.error('Failed to fetch projects:', response._data)
    }
  })
}

/**
 * Composable for fetching featured projects
 */
export const useFeaturedProjects = (limit = 3) => {
  return useFetch<Project[]>('/api/projects/featured', {
    key: `featured-projects-${limit}`,
    query: { limit },
    default: () => [],
    server: true,
    transform: (data: Project[]) => {
      // Ensure proper data structure
      return data.map(project => ({
        ...project,
        technologies: project.technologies || [],
        status: project.status || 'completed' as const,
      }))
    },
    onResponseError({ response }) {
      console.error('Failed to fetch featured projects:', response._data)
    }
  })
}

/**
 * Composable for fetching a single project by slug
 */
export const useProject = (slug: string | Ref<string>) => {
  const slugRef = isRef(slug) ? slug : ref(slug)
  
  // For now, we'll fetch from the projects list and filter
  // In the future, we might create a dedicated API endpoint
  const { data: projects, error, pending } = useProjects({
    limit: 1000, // Get all projects to find by slug
    server: true,
  })
  
  const project = computed(() => {
    if (!projects.value?.items) return null
    return projects.value.items.find(p => p.slug === slugRef.value) || null
  })
  
  return {
    data: project,
    error,
    pending,
  }
}

/**
 * Reactive composable for project filtering
 */
export const useProjectFilter = () => {
  const selectedCategory = ref<string>('All')
  const selectedStatus = ref<string>('All')
  const searchQuery = ref<string>('')
  const showFeaturedOnly = ref<boolean>(false)
  
  // Reactive projects based on filters
  const { data: projects, pending, error, refresh } = useProjects({
    category: computed(() => selectedCategory.value === 'All' ? undefined : selectedCategory.value),
    status: computed(() => selectedStatus.value === 'All' ? undefined : selectedStatus.value as any),
    search: computed(() => searchQuery.value || undefined),
    featured: computed(() => showFeaturedOnly.value || undefined),
    lazy: true,
  })
  
  // Get unique categories from all projects
  const { data: allProjects } = useProjects({ limit: 1000 })
  const categories = computed(() => {
    if (!allProjects.value?.items) return ['All']
    const cats = new Set(allProjects.value.items.map(p => p.category).filter(Boolean))
    return ['All', ...Array.from(cats).sort()]
  })
  
  // Status options
  const statusOptions = ['All', 'completed', 'in-progress', 'planned']
  
  // Reset filters
  const resetFilters = () => {
    selectedCategory.value = 'All'
    selectedStatus.value = 'All'
    searchQuery.value = ''
    showFeaturedOnly.value = false
  }
  
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
  }
}

/**
 * Composable for project statistics
 */
export const useProjectStats = () => {
  const { data: projects } = useProjects({ limit: 1000 })
  
  const stats = computed(() => {
    if (!projects.value?.items) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        planned: 0,
        featured: 0,
      }
    }
    
    const items = projects.value.items
    
    return {
      total: items.length,
      completed: items.filter(p => p.status === 'completed').length,
      inProgress: items.filter(p => p.status === 'in-progress').length,
      planned: items.filter(p => p.status === 'planned').length,
      featured: items.filter(p => p.featured).length,
    }
  })
  
  return {
    stats,
    pending: computed(() => !projects.value),
  }
}