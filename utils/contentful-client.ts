import { createClient, type ContentfulApi } from 'contentful'
import type {
  ContentfulClientConfig,
  ContentfulError,
  ContentfulQueryOptions,
  ContentfulCollection,
  ContentfulEntry
} from '~/types/contentful'

/**
 * Contentful client utility with TypeScript support and error handling
 */
export class ContentfulClient {
  private client: ContentfulApi
  private previewClient: ContentfulApi
  private config: ContentfulClientConfig

  constructor(config: ContentfulClientConfig) {
    this.config = config

    // Production client for published content
    this.client = createClient({
      space: config.space,
      accessToken: config.accessToken,
      environment: config.environment || 'master',
      host: config.host || 'cdn.contentful.com',
      timeout: config.timeout || 5000,
      retryOnError: config.retryOnError ?? true,
      logHandler: config.logHandler || this.defaultLogHandler,
    })

    // Preview client for draft content (if preview token is available)
    const previewToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    if (previewToken) {
      this.previewClient = createClient({
        space: config.space,
        accessToken: previewToken,
        environment: config.environment || 'master',
        host: 'preview.contentful.com',
        timeout: config.timeout || 5000,
        retryOnError: config.retryOnError ?? true,
        logHandler: config.logHandler || this.defaultLogHandler,
      })
    } else {
      this.previewClient = this.client
    }
  }

  /**
   * Default log handler
   */
  private defaultLogHandler(level: string, data: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Contentful ${level}]`, data)
    }
  }

  /**
   * Get entries with error handling and type safety
   */
  async getEntries<T = any>(
    query: ContentfulQueryOptions = {},
    usePreview = false
  ): Promise<ContentfulCollection<T>> {
    try {
      const client = usePreview ? this.previewClient : this.client
      const response = await client.getEntries(query)
      
      return {
        items: response.items as ContentfulEntry<T>[],
        total: response.total,
        skip: response.skip,
        limit: response.limit,
      }
    } catch (error) {
      throw this.handleError(error, 'getEntries', query)
    }
  }

  /**
   * Get a single entry by ID
   */
  async getEntry<T = any>(
    entryId: string,
    query: Partial<ContentfulQueryOptions> = {},
    usePreview = false
  ): Promise<ContentfulEntry<T> | null> {
    try {
      const client = usePreview ? this.previewClient : this.client
      const entry = await client.getEntry(entryId, query)
      return entry as ContentfulEntry<T>
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null
      }
      throw this.handleError(error, 'getEntry', { entryId, query })
    }
  }

  /**
   * Get entries by content type
   */
  async getEntriesByType<T = any>(
    contentType: string,
    query: Omit<ContentfulQueryOptions, 'content_type'> = {},
    usePreview = false
  ): Promise<ContentfulCollection<T>> {
    return this.getEntries<T>(
      {
        ...query,
        content_type: contentType,
      },
      usePreview
    )
  }

  /**
   * Get a single entry by slug and content type
   */
  async getEntryBySlug<T = any>(
    contentType: string,
    slug: string,
    query: Partial<ContentfulQueryOptions> = {},
    usePreview = false
  ): Promise<ContentfulEntry<T> | null> {
    try {
      const response = await this.getEntriesByType<T>(
        contentType,
        {
          ...query,
          'fields.slug': slug,
          limit: 1,
        },
        usePreview
      )

      return response.items[0] || null
    } catch (error) {
      throw this.handleError(error, 'getEntryBySlug', { contentType, slug, query })
    }
  }

  /**
   * Get asset by ID
   */
  async getAsset(assetId: string): Promise<any> {
    try {
      return await this.client.getAsset(assetId)
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null
      }
      throw this.handleError(error, 'getAsset', { assetId })
    }
  }

  /**
   * Get content types
   */
  async getContentTypes(): Promise<any> {
    try {
      return await this.client.getContentTypes()
    } catch (error) {
      throw this.handleError(error, 'getContentTypes', {})
    }
  }

  /**
   * Check if error is a 404 Not Found error
   */
  private isNotFoundError(error: any): boolean {
    return error?.sys?.id === 'NotFound' || error?.status === 404
  }

  /**
   * Enhanced error handling with context
   */
  private handleError(error: any, method: string, context: any): ContentfulError {
    const errorDetails: ContentfulError = {
      sys: {
        id: error?.sys?.id || 'UnknownError',
        type: 'Error',
      },
      name: error?.name || 'ContentfulError',
      message: error?.message || 'An unknown error occurred',
      details: {
        method,
        context,
        originalError: error,
      },
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Contentful Error]', errorDetails)
    }

    return errorDetails
  }

  /**
   * Health check - test the connection
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; details?: any }> {
    try {
      await this.client.getSpace()
      return { status: 'ok' }
    } catch (error) {
      return {
        status: 'error',
        details: this.handleError(error, 'healthCheck', {}),
      }
    }
  }

  /**
   * Get space information
   */
  async getSpace(): Promise<any> {
    try {
      return await this.client.getSpace()
    } catch (error) {
      throw this.handleError(error, 'getSpace', {})
    }
  }
}

/**
 * Create and configure Contentful client instance
 */
export function createContentfulClient(): ContentfulClient {
  const config: ContentfulClientConfig = {
    space: process.env.CONTENTFUL_SPACE_ID || '',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    host: process.env.CONTENTFUL_HOST || 'cdn.contentful.com',
    timeout: 10000,
    retryOnError: true,
  }

  // Validate required configuration
  if (!config.space || !config.accessToken) {
    throw new Error(
      'Missing required Contentful configuration. Please check your environment variables.'
    )
  }

  return new ContentfulClient(config)
}

// Singleton instance
let contentfulClient: ContentfulClient | null = null

/**
 * Get singleton Contentful client instance
 */
export function getContentfulClient(): ContentfulClient {
  if (!contentfulClient) {
    contentfulClient = createContentfulClient()
  }
  return contentfulClient
}