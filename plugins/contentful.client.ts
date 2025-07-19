import { createClient } from 'contentful'
import type { ContentfulClientApi } from 'contentful'

export default defineNuxtPlugin(async () => {
  const runtimeConfig = useRuntimeConfig()
  
  // Check if Contentful is configured
  if (!runtimeConfig.public.contentfulSpaceId || !runtimeConfig.public.contentfulAccessToken) {
    console.warn('[Contentful Plugin] Missing configuration, client not initialized')
    return {
      provide: {
        contentful: null as ContentfulClientApi<undefined> | null,
        contentfulPreview: null as ContentfulClientApi<undefined> | null,
      },
    }
  }

  try {
    // Create production client
    const contentfulClient = createClient({
      space: runtimeConfig.public.contentfulSpaceId,
      accessToken: runtimeConfig.public.contentfulAccessToken,
      environment: runtimeConfig.public.contentfulEnvironment || 'master',
      host: runtimeConfig.public.contentfulHost || 'cdn.contentful.com',
    })

    // Preview client is not available on client-side (preview tokens are private)
    // Preview functionality should be handled server-side only
    let previewClient = null

    // Perform health check in development
    if (process.env.NODE_ENV === 'development') {
      try {
        await contentfulClient.getSpace()
        console.log('[Contentful] Connected successfully')
      } catch (error) {
        console.warn('[Contentful] Health check failed:', error)
      }
    }

    return {
      provide: {
        contentful: contentfulClient,
        contentfulPreview: previewClient,
      },
    }
  } catch (error) {
    console.error('[Contentful Plugin] Failed to initialize:', error)
    
    return {
      provide: {
        contentful: null,
        contentfulPreview: null,
      },
    }
  }
})