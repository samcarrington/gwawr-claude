import { createClient } from 'contentful'

export default defineNuxtPlugin(async () => {
  const runtimeConfig = useRuntimeConfig()
  
  // Check if Contentful is configured
  if (!runtimeConfig.contentfulSpaceId || !runtimeConfig.contentfulAccessToken) {
    console.warn('[Contentful Plugin] Missing configuration, client not initialized')
    return {
      provide: {
        contentful: null,
        contentfulPreview: null,
      },
    }
  }

  try {
    // Create production client
    const contentfulClient = createClient({
      space: runtimeConfig.contentfulSpaceId,
      accessToken: runtimeConfig.contentfulAccessToken,
      environment: runtimeConfig.contentfulEnvironment || 'master',
      host: runtimeConfig.contentfulHost || 'cdn.contentful.com',
    })

    // Create preview client if preview token is available
    let previewClient = null
    if (runtimeConfig.contentfulPreviewAccessToken) {
      previewClient = createClient({
        space: runtimeConfig.contentfulSpaceId,
        accessToken: runtimeConfig.contentfulPreviewAccessToken,
        environment: runtimeConfig.contentfulEnvironment || 'master',
        host: runtimeConfig.contentfulPreviewHost || 'preview.contentful.com',
      })
    }

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