---
id: decision-3
title: Use Contentful as the headless CMS
date: '2025-07-10'
status: proposed
---
pg
## Context

The portfolio website requires a content management system to handle blog posts, project descriptions, testimonials, 
and other dynamic content. A headless CMS approach allows for flexible content delivery while maintaining the 
performance and developer experience of our Nuxt.js frontend.

## Decision

We will use **Contentful** as the headless CMS for all content management needs in this project.

### Key Requirements:
- Use Contentful's JavaScript SDK to connect to contentgit
- Use the Contentful MCP to establish existing and new content models required by the site
- Use Contentful's Content Delivery API for production content
- Leverage Contentful's webhooks for content updates and cache invalidation
- Use environment variables for API keys and space configuration

### Rationale:
1. **Developer Experience**: Excellent API documentation and TypeScript support
2. **Content Management**: Intuitive web interface for content creators
3. **Performance**: Built-in CDN and optimized content delivery
4. **Scalability**: Handles growing content needs without infrastructure concerns
5. **Rich Media**: Built-in image optimization and asset management
6. **Nuxt Integration**: Well-documented integration patterns with Nuxt.js

## Setup Instructions

### Installation
```bash
npm install contentful
npm install @nuxt/content # for local development fallback
```

### Environment Configuration
```env
# .env
CONTENTFUL_SPACE_ID=a8qmrg9btiwm
CONTENTFUL_ACCESS_TOKEN=aZn7JWgcEtNmQNO4mKW1NmSINmBGdWRntnRb0k-IpnY
CONTENTFUL_PREVIEW_ACCESS_TOKEN=hvm5Cglesd17kkFV6D4XNM0Kec5vWz2DDW9jzuzPQpw
```

### Basic Integration
```javascript
// plugins/contentful.js
import { createClient } from 'contentful'

export default defineNuxtPlugin(() => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  })

  return {
    provide: {
      contentful: client
    }
  }
})
```

## Content Models

### Planned Content Types:
- **Blog Posts**: Title, content, thumbnail, featured image, publish date, tags, author
- **Projects**: Title, description, technologies, images, live URL, repository URL
- **Testimonials**: Client name, company, testimonial text, client image
- **About**: Bio content, skills, experience sections

## Consequences

### Positive:
- **Content Management**: Non-technical users can easily manage content
- **API-First**: Clean separation between content and presentation
- **Performance**: CDN-delivered content with built-in optimization
- **Developer Tools**: Rich API, webhooks, and preview functionality
- **Maintenance**: No database or CMS infrastructure to maintain
- **Flexibility**: Content can be used across multiple platforms/frontends

### Negative:
- **External Dependency**: Relies on third-party service availability
- **Cost**: Monthly fees for higher usage tiers
- **Learning Curve**: Team needs to understand Contentful's content modeling
- **Rate Limits**: API usage limits on free tier

### Mitigation:
- Implement caching strategies to reduce API calls
- Use Contentful's webhooks for intelligent cache invalidation
- Consider local fallback content for critical pages
- Monitor API usage to stay within limits

## References

- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Contentful with Nuxt.js](https://www.contentful.com/developers/docs/javascript/tutorials/nuxt-js/)
- [Contentful Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/)
- [Contentful Webhooks](https://www.contentful.com/developers/docs/concepts/webhooks/)