import { getContentfulClient } from '~/utils/contentful-client'

export default defineNuxtPlugin(async () => {
  try {
    // Initialize Contentful client
    const contentfulClient = getContentfulClient()
    
    // Perform health check in development
    if (process.env.NODE_ENV === 'development') {
      const healthCheck = await contentfulClient.healthCheck()
      if (healthCheck.status === 'error') {
        console.warn('[Contentful] Health check failed:', healthCheck.details)
      } else {
        console.log('[Contentful] Connected successfully')
      }
    }

    return {
      provide: {
        contentful: contentfulClient,
      },
    }
  } catch (error) {
    console.error('[Contentful Plugin] Failed to initialize:', error)
    
    // In production, you might want to provide a fallback
    if (process.env.NODE_ENV === 'production') {
      // Provide a mock client or fallback to static data
      return {
        provide: {
          contentful: null,
        },
      }
    }
    
    throw error
  }
})