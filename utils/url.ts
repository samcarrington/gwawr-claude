// utils/url.ts
// Shared URL utilities

/**
 * Allowed URL protocols for external links.
 * Extend this list if additional safe protocols are needed.
 */
export const ALLOWED_PROTOCOLS = ['http:', 'https:'] as const

/**
 * Sanitize a URI to mitigate XSS vectors. Returns `#` if the URI is considered unsafe.
 *
 * Rules:
 * 1. Relative URLs (starting with '/') are allowed.
 * 2. Absolute URLs whose protocol is in ALLOWED_PROTOCOLS are allowed.
 */
export function sanitizeUrl(uri: string): string {
  try {
    // Support relative URLs by providing a dummy base.
    const urlObj = new URL(uri, 'https://example.com')
    if (uri.startsWith('/') || (ALLOWED_PROTOCOLS as readonly string[]).includes(urlObj.protocol)) {
      return uri
    }
  } catch {
    /* invalid URL; fall through to return safe placeholder */
  }
  return '#'
}
