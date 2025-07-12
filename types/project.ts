export interface Project {
  id: string
  title: string
  slug: string
  description: string
  fullDescription?: string
  technologies: string[]
  images: string[]
  liveUrl?: string
  repositoryUrl?: string
  featured: boolean
  category: string
  startDate?: string
  endDate?: string
  status: 'completed' | 'in-progress' | 'planned'
}

export interface ProjectsResponse {
  items: Project[]
  total: number
  skip: number
  limit: number
}