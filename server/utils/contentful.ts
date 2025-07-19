import { createClient } from 'contentful'
import type { ContentfulClientApi, Entry } from 'contentful'

// Separate client instances for server and client environments
let serverContentfulClient: ContentfulClientApi<undefined> | null = null
let clientContentfulClient: ContentfulClientApi<undefined> | null = null

/**
 * Get or create a Contentful client instance (isomorphic)
 * Works both server-side and client-side
 * Centralizes client creation and configuration validation
 */
export function getContentfulClient(event?: any): ContentfulClientApi<undefined> | null {
  const isServer = typeof (globalThis as any).window === 'undefined'
  const existingClient = isServer ? serverContentfulClient : clientContentfulClient
  
  // Return existing client if available
  if (existingClient) {
    return existingClient
  }

  try {
    // Get runtime config - handle both server and client contexts
    let config: any
    if (isServer && event) {
      // Server-side with event context
      config = useRuntimeConfig(event)
    } else if (isServer) {
      // Server-side without event context
      config = useRuntimeConfig()
    } else {
      // Client-side
      config = useRuntimeConfig()
    }
    
    // Validate configuration
    if (!config.public.contentfulSpaceId || !config.public.contentfulAccessToken) {
      console.warn('[Contentful Service] Configuration missing:', {
        environment: isServer ? 'server' : 'client',
        hasSpaceId: !!config.public.contentfulSpaceId,
        hasAccessToken: !!config.public.contentfulAccessToken
      })
      return null
    }

    // Create client
    const client = createClient({
      space: config.public.contentfulSpaceId,
      accessToken: config.public.contentfulAccessToken,
      environment: config.public.contentfulEnvironment || 'master',
      host: config.public.contentfulHost || 'cdn.contentful.com',
    })

    // Cache client based on environment
    if (isServer) {
      serverContentfulClient = client
    } else {
      clientContentfulClient = client
    }

    console.log(`[Contentful Service] Client created successfully (${isServer ? 'server' : 'client'})`)
    return client
  } catch (error) {
    console.error(`[Contentful Service] Failed to create client (${isServer ? 'server' : 'client'}):`, error)
    return null
  }
}

/**
 * Check if Contentful is properly configured (isomorphic)
 */
export function isContentfulConfigured(event?: any): boolean {
  try {
    const isServer = typeof (globalThis as any).window === 'undefined'
    let config: any
    
    if (isServer && event) {
      config = useRuntimeConfig(event)
    } else {
      config = useRuntimeConfig()
    }
    
    return !!(config.public.contentfulSpaceId && config.public.contentfulAccessToken)
  } catch (error) {
    console.error('[Contentful Service] Error checking configuration:', error)
    return false
  }
}

/**
 * Get Contentful configuration details for debugging (isomorphic)
 */
export function getContentfulConfig(event?: any) {
  try {
    const isServer = typeof (globalThis as any).window === 'undefined'
    let config: any
    
    if (isServer && event) {
      config = useRuntimeConfig(event)
    } else {
      config = useRuntimeConfig()
    }
    
    return {
      environment: isServer ? 'server' : 'client',
      spaceId: config.public.contentfulSpaceId,
      hasAccessToken: !!config.public.contentfulAccessToken,
      contentfulEnvironment: config.public.contentfulEnvironment || 'master',
      host: config.public.contentfulHost || 'cdn.contentful.com',
      configured: !!(config.public.contentfulSpaceId && config.public.contentfulAccessToken)
    }
  } catch (error) {
    console.error('[Contentful Service] Error getting configuration:', error)
    return {
      environment: typeof (globalThis as any).window === 'undefined' ? 'server' : 'client',
      spaceId: null,
      hasAccessToken: false,
      contentfulEnvironment: 'master',
      host: 'cdn.contentful.com',
      configured: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * Reset the cached clients (useful for testing or config changes)
 */
export function resetContentfulClient() {
  serverContentfulClient = null
  clientContentfulClient = null
}
