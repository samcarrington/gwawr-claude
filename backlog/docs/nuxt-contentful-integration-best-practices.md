# Nuxt 3 + Contentful Integration Best Practices

## Current Implementation Issues

Our current implementation has several anti-patterns:

1. **Multiple runtime config calls**: `getContentfulClient()` calls `useRuntimeConfig()` while server APIs also call it
2. **Complex client singleton pattern**: Unnecessary complexity with singleton management
3. **Split client/server logic**: Different code paths for same functionality
4. **Plugin dependency issues**: Client plugin may fail if runtime config is not available

## Best Practices from Documentation

### 1. Runtime Config Usage

**✅ Correct Pattern:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Private (server-only)
    contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID,
    contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    contentfulPreviewAccessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    // Public (client + server)
    public: {
      contentfulConfigured: !!(process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN)
    }
  }
})

// Server API route
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event) // Pass event for server context
  // Use config.contentfulSpaceId, etc.
})

// Composable/Plugin
const config = useRuntimeConfig() // No event needed in composables
```

### 2. Plugin Best Practices

**✅ Recommended Pattern:**
```typescript
// plugins/contentful.client.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Only initialize if configured
  if (!config.contentfulSpaceId || !config.contentfulAccessToken) {
    console.warn('[Contentful] Not configured, skipping initialization')
    return {
      provide: {
        contentful: null
      }
    }
  }

  const client = createClient({
    space: config.contentfulSpaceId,
    accessToken: config.contentfulAccessToken,
    environment: config.contentfulEnvironment || 'master'
  })

  return {
    provide: {
      contentful: client
    }
  }
})
```

### 3. Server API Pattern

**✅ Recommended Pattern:**
```typescript
// server/api/projects.get.ts
import { createClient } from 'contentful'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  
  if (!config.contentfulSpaceId || !config.contentfulAccessToken) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Contentful not configured'
    })
  }

  // Create client directly in server context
  const client = createClient({
    space: config.contentfulSpaceId,
    accessToken: config.contentfulAccessToken,
    environment: config.contentfulEnvironment || 'master'
  })

  const response = await client.getEntries({
    content_type: 'project'
  })

  return transformProjects(response.items)
})
```

### 4. Composable Pattern

**✅ Recommended Pattern:**
```typescript
// composables/useContentful.ts
export const useContentful = () => {
  const { $contentful } = useNuxtApp()
  
  if (!$contentful) {
    console.warn('[useContentful] Contentful not configured')
    return {
      isAvailable: false,
      client: null
    }
  }

  return {
    isAvailable: true,
    client: $contentful
  }
}
```

## Recommended Refactoring Strategy

### Phase 1: Simplify Client Creation
1. Remove the custom `ContentfulClient` wrapper class
2. Use Contentful's native client directly
3. Remove singleton pattern complexity

### Phase 2: Fix Runtime Config Usage
1. Server APIs: Create client directly in event handler
2. Client plugin: Create client in plugin, provide via `$contentful`
3. Composables: Use provided client from plugin

### Phase 3: Unified Error Handling
1. Graceful degradation when Contentful is not configured
2. Consistent error messages and fallbacks
3. Better development experience with clear warnings

## Benefits of Recommended Approach

1. **Simpler**: Direct use of Contentful SDK without wrappers
2. **More reliable**: Proper runtime config usage patterns
3. **Better DX**: Clear error messages when misconfigured
4. **Framework aligned**: Follows Nuxt 3 best practices
5. **Type safe**: Better TypeScript integration
6. **Performant**: No unnecessary abstractions

## Migration Checklist

- [ ] Remove `utils/contentful-client.ts` wrapper
- [ ] Update server APIs to create client directly
- [ ] Simplify plugin to use native Contentful client
- [ ] Update composables to use provided client
- [ ] Add proper error handling for missing config
- [ ] Update transformers to work with native client responses
- [ ] Test both server and client-side functionality
- [ ] Update documentation and examples

## References

- [Nuxt 3 Plugins Documentation](https://nuxt.com/docs/guide/directory-structure/plugins)
- [Nuxt 3 Runtime Config](https://nuxt.com/docs/api/composables/use-runtime-config)
- [Contentful JavaScript SDK](https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/)