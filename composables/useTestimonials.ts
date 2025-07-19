// TODO: Create proper Testimonial type definition
interface Testimonial {
  id: string
  title?: string
  content: string
  clientName?: string
  clientTitle?: string
  clientCompany?: string
  company?: string // Legacy field
  name?: string // Legacy field
  rating?: number
  featured: boolean
  projectReference?: any
  attribution?: any // Legacy person link
}

interface TestimonialsResponse {
  items: Testimonial[]
  total: number
  skip: number
  limit: number
}

interface UseTestimonialsOptions {
  featured?: boolean
  minRating?: number
  search?: string
  limit?: number
  skip?: number
  server?: boolean
  lazy?: boolean
}

/**
 * Composable for fetching testimonials from Contentful
 */
export const useTestimonials = (options: UseTestimonialsOptions = {}) => {
  // Build query parameters
  const query = computed(() => {
    const params: Record<string, any> = {}
    
    if (options.featured !== undefined) params.featured = options.featured
    if (options.minRating) params.minRating = options.minRating
    if (options.search) params.search = options.search
    if (options.limit) params.limit = options.limit
    if (options.skip) params.skip = options.skip
    
    return params
  })
  
  // Generate cache key based on query parameters
  const key = computed(() => {
    const queryString = JSON.stringify(query.value, Object.keys(query.value).sort())
    // Use simple hash for browser compatibility
    let hash = 0
    for (let i = 0; i < queryString.length; i++) {
      const char = queryString.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return `testimonials-${Math.abs(hash)}`
  })
  
  // Choose fetch method based on options
  const fetchMethod = options.lazy ? useLazyFetch : useFetch
  
  return fetchMethod<TestimonialsResponse>('/api/testimonials', {
    key: key,
    query: query,
    default: () => ({ items: [], total: 0, skip: 0, limit: 0 }),
    server: options.server ?? true,
    transform: (data: TestimonialsResponse) => {
      // Additional client-side transformation if needed
      return {
        ...data,
        items: data.items.map(testimonial => ({
          ...testimonial,
          // Normalize client name (prefer new field over legacy)
          clientName: testimonial.clientName || testimonial.name,
          // Normalize company (prefer new field over legacy)
          clientCompany: testimonial.clientCompany || testimonial.company,
          // Ensure rating is a number
          rating: testimonial.rating || 5,
        }))
      }
    },
    onResponseError({ response }) {
      console.error('Failed to fetch testimonials:', response._data)
    }
  })
}

/**
 * Composable for fetching featured testimonials
 */
export const useFeaturedTestimonials = (limit = 5) => {
  return useFetch<Testimonial[]>('/api/testimonials/featured', {
    key: `featured-testimonials-${limit}`,
    query: { limit },
    default: () => [],
    server: true,
    transform: (data: Testimonial[]) => {
      // Ensure proper data structure
      return data.map(testimonial => ({
        ...testimonial,
        // Normalize client name (prefer new field over legacy)
        clientName: testimonial.clientName || testimonial.name,
        // Normalize company (prefer new field over legacy)
        clientCompany: testimonial.clientCompany || testimonial.company,
        // Ensure rating is a number
        rating: testimonial.rating || 5,
      }))
    },
    onResponseError({ response }) {
      console.error('Failed to fetch featured testimonials:', response._data)
    }
  })
}

/**
 * Reactive composable for testimonial filtering
 */
export const useTestimonialFilter = () => {
  const minRating = ref<number>(1)
  const searchQuery = ref<string>('')
  const showFeaturedOnly = ref<boolean>(false)
  
  // Reactive testimonials based on filters
  const { data: testimonials, pending, error, refresh } = useTestimonials({
    minRating: minRating.value > 1 ? minRating.value : undefined,
    search: searchQuery.value || undefined,
    featured: showFeaturedOnly.value || undefined,
    lazy: true,
  })
  
  // Rating options
  const ratingOptions = [
    { value: 1, label: '1+ Stars' },
    { value: 2, label: '2+ Stars' },
    { value: 3, label: '3+ Stars' },
    { value: 4, label: '4+ Stars' },
    { value: 5, label: '5 Stars Only' },
  ]
  
  // Reset filters
  const resetFilters = () => {
    minRating.value = 1
    searchQuery.value = ''
    showFeaturedOnly.value = false
  }
  
  return {
    // Filter state
    minRating,
    searchQuery,
    showFeaturedOnly,
    
    // Filter options
    ratingOptions,
    
    // Data
    testimonials: computed(() => testimonials.value?.items || []),
    total: computed(() => testimonials.value?.total || 0),
    pending,
    error,
    
    // Actions
    resetFilters,
    refresh,
  }
}

/**
 * Composable for testimonial statistics
 */
export const useTestimonialStats = () => {
  const { data: testimonials } = useTestimonials({ limit: 1000 })
  
  const stats = computed(() => {
    if (!testimonials.value?.items) {
      return {
        total: 0,
        featured: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    }
    
    const items = testimonials.value.items
    const ratings = items.map(t => t.rating || 5)
    
    return {
      total: items.length,
      featured: items.filter(t => t.featured).length,
      averageRating: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
      ratingDistribution: {
        1: ratings.filter(r => r === 1).length,
        2: ratings.filter(r => r === 2).length,
        3: ratings.filter(r => r === 3).length,
        4: ratings.filter(r => r === 4).length,
        5: ratings.filter(r => r === 5).length,
      },
    }
  })
  
  return {
    stats,
    pending: computed(() => !testimonials.value),
  }
}

/**
 * Helper composable for displaying testimonial carousel
 */
export const useTestimonialCarousel = () => {
  const { data: testimonials, pending } = useFeaturedTestimonials(6)
  const currentIndex = ref(0)
  
  const currentTestimonial = computed(() => {
    if (!testimonials.value || testimonials.value.length === 0) return null
    return testimonials.value[currentIndex.value]
  })
  
  const nextTestimonial = () => {
    if (!testimonials.value || testimonials.value.length === 0) return
    currentIndex.value = (currentIndex.value + 1) % testimonials.value.length
  }
  
  const previousTestimonial = () => {
    if (!testimonials.value || testimonials.value.length === 0) return
    currentIndex.value = currentIndex.value === 0 
      ? testimonials.value.length - 1 
      : currentIndex.value - 1
  }
  
  const goToTestimonial = (index: number) => {
    if (!testimonials.value || index < 0 || index >= testimonials.value.length) return
    currentIndex.value = index
  }
  
  // Auto-rotate every 8 seconds
  const autoRotate = ref(true)
  let autoRotateInterval: NodeJS.Timeout | null = null
  
  onMounted(() => {
    if (autoRotate.value) {
      autoRotateInterval = setInterval(nextTestimonial, 8000)
    }
  })
  
  onUnmounted(() => {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval)
    }
  })
  
  watch(autoRotate, (enabled) => {
    if (enabled) {
      autoRotateInterval = setInterval(nextTestimonial, 8000)
    } else if (autoRotateInterval) {
      clearInterval(autoRotateInterval)
      autoRotateInterval = null
    }
  })
  
  return {
    // Data
    testimonials,
    currentTestimonial,
    currentIndex: readonly(currentIndex),
    pending,
    
    // Controls
    nextTestimonial,
    previousTestimonial,
    goToTestimonial,
    autoRotate,
    
    // Computed properties
    hasTestimonials: computed(() => (testimonials.value?.length || 0) > 0),
    isFirstTestimonial: computed(() => currentIndex.value === 0),
    isLastTestimonial: computed(() => currentIndex.value === (testimonials.value?.length || 1) - 1),
    totalTestimonials: computed(() => testimonials.value?.length || 0),
  }
}