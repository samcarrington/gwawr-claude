export interface Project {
  id: string
  title: string
  slug: string
  description: string
  fullDescription?: string // Rendered HTML from markdown or Rich Text
  technologies: string[]
  images: string[] // Array of image URLs
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