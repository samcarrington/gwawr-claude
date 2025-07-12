import type { Project } from '~/types/project'

/**
 * Sample projects data with enhanced Contentful fields
 * In a real application, this would be fetched from Contentful
 */
export const projects: Project[] = [
  {
    id: '7C8qBt2vXK9eY3nM4jL1Zp',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A full-stack e-commerce solution built with Nuxt.js and Node.js. Features include user authentication, shopping cart, payment processing, and admin dashboard.',
    fullDescription: 'A comprehensive e-commerce platform featuring modern web technologies, scalable architecture, and exceptional user experience. Built with performance and security in mind.',
    category: 'Full-Stack',
    technologies: ['Nuxt.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    images: [],
    liveUrl: 'https://example.com',
    repositoryUrl: 'https://github.com/example/ecommerce',
    featured: true,
    status: 'completed',
    startDate: '2024-10-01',
    endDate: '2024-12-15',
  },
  {
    id: 'P5dR9mN3wX2vL7qH8tF6Yj',
    title: 'Task Management App',
    slug: 'task-management-app',
    description: 'A collaborative task management application with real-time updates, team workspaces, and progress tracking.',
    fullDescription: 'Modern task management solution designed for teams with real-time collaboration features, intuitive interface, and powerful project organization tools.',
    category: 'Full-Stack',
    technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Socket.io', 'Docker'],
    images: [],
    liveUrl: 'https://taskapp.example.com',
    repositoryUrl: 'https://github.com/example/taskapp',
    featured: false,
    status: 'completed',
    startDate: '2024-09-01',
    endDate: '2024-11-30',
  },
  {
    id: 'A9sK3nB7xZ1mQ4wE6tR2Vy',
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    description: 'A responsive portfolio website showcasing modern design principles and smooth animations.',
    fullDescription: 'Personal portfolio website featuring cutting-edge design, smooth animations, and optimized performance. Built with modern web standards and accessibility in mind.',
    category: 'Frontend',
    technologies: ['Nuxt.js', 'Tailwind CSS', 'GSAP', 'Netlify'],
    images: [],
    liveUrl: 'https://portfolio.example.com',
    repositoryUrl: 'https://github.com/example/portfolio',
    featured: false,
    status: 'completed',
    startDate: '2024-08-15',
    endDate: '2024-10-01',
  },
  {
    id: 'G4pM8xN2vC7kL9qW5tH3Zj',
    title: 'Weather Dashboard',
    slug: 'weather-dashboard',
    description: 'An interactive weather dashboard with location-based forecasts and data visualizations.',
    fullDescription: 'Comprehensive weather application providing detailed forecasts, interactive maps, and beautiful data visualizations for weather enthusiasts and professionals.',
    category: 'Frontend',
    technologies: ['React', 'Chart.js', 'OpenWeather API', 'CSS Modules'],
    images: [],
    liveUrl: 'https://weather.example.com',
    repositoryUrl: 'https://github.com/example/weather',
    featured: false,
    status: 'completed',
    startDate: '2024-07-01',
    endDate: '2024-09-15',
  },
  {
    id: 'F2dQ6mK9xB4nL8wP3vH7Rt',
    title: 'API Documentation Site',
    slug: 'api-documentation-site',
    description: 'A comprehensive API documentation platform with interactive examples and code snippets.',
    fullDescription: 'Developer-friendly API documentation platform featuring interactive examples, comprehensive guides, and beautiful presentation of technical information.',
    category: 'Documentation',
    technologies: ['VuePress', 'Markdown', 'Prism.js', 'GitHub Pages'],
    images: [],
    liveUrl: 'https://docs.api.example.com',
    repositoryUrl: 'https://github.com/example/api-docs',
    featured: false,
    status: 'completed',
    startDate: '2024-06-01',
    endDate: '2024-08-01',
  },
  {
    id: 'X1yZ5nM8qK3wL7vH2tB9Rj',
    title: 'Mobile App Backend',
    slug: 'mobile-app-backend',
    description: 'RESTful API backend for a mobile application with user management and data synchronization.',
    fullDescription: 'Robust backend API system powering mobile applications with advanced user management, real-time synchronization, and scalable architecture.',
    category: 'Backend',
    technologies: ['Node.js', 'Express', 'JWT', 'Redis', 'Docker'],
    images: [],
    liveUrl: undefined,
    repositoryUrl: 'https://github.com/example/mobile-api',
    featured: false,
    status: 'completed',
    startDate: '2024-05-01',
    endDate: '2024-07-15',
  },
]

/**
 * Get all projects sorted by date (most recent first)
 */
export function getProjects(): Project[] {
  return projects.sort((a, b) => {
    const dateA = a.endDate || a.startDate || '2024-01-01'
    const dateB = b.endDate || b.startDate || '2024-01-01'
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
}

/**
 * Get featured projects
 */
export function getFeaturedProjects(): Project[] {
  return getProjects().filter(project => project.featured)
}

/**
 * Get project by slug
 */
export function getProjectBySlug(slug: string): Project | null {
  return projects.find(project => project.slug === slug) || null
}

/**
 * Get project categories
 */
export function getProjectCategories(): string[] {
  const categories = new Set(projects.map(project => project.category))
  return Array.from(categories).sort()
}

/**
 * Get project statuses
 */
export function getProjectStatuses(): string[] {
  const statuses = new Set(projects.map(project => project.status))
  return Array.from(statuses).sort()
}