---
id: task-59
title: Fix Contentful runtime config client-side error
status: Done
assignee:
  - '@Claude'
created_date: '2025-07-19'
updated_date: '2025-07-19'
labels: []
dependencies: []
priority: high
---

## Description

Resolve Nuxt runtime config error where the Contentful client plugin attempts to access private runtime config keys on the client side. The error occurs because `contentfulSpaceId` and other Contentful config are defined as private keys but are being accessed in a client-side plugin.

**Error Message:**
```
contentful.client.ts:8 [nuxt] Could not access `contentfulSpaceId`. The only available runtime config keys on the client side are `public` and `app`. See https://nuxt.com/docs/guide/going-further/runtime-config for more information.
```

**Root Cause:**
The `plugins/contentful.client.ts` file runs on both server and client, but tries to access private runtime config keys that are only available server-side.

## Acceptance Criteria

- [x] Investigate current Contentful client plugin implementation
- [x] Move necessary Contentful config to public runtime config or refactor to server-side only
- [x] Ensure Contentful integration continues to work correctly
- [x] Verify console error is completely resolved
- [x] Update any related documentation or comments

## Resolution Summary

**Solution:** Moved safe Contentful configuration from private to public runtime config.

**Changes Made:**
1. **nuxt.config.ts**: Moved `contentfulSpaceId`, `contentfulAccessToken`, `contentfulEnvironment`, and `contentfulHost` from private runtime config to `public` section
2. **plugins/contentful.client.ts**: Updated plugin to access config via `runtimeConfig.public.*` instead of direct `runtimeConfig.*`
3. **Type Safety**: Added proper TypeScript type annotations to resolve plugin return type errors
4. **Preview Client**: Removed preview client creation from client-side plugin (preview tokens should only be used in privileged preview routes)

**Rationale:** The Contentful Content Delivery API access token is read-only and safe for client-side use, making this the correct architectural approach for an isomorphic Contentful service.

**Verification:** 
- ✅ Console error completely resolved
- ✅ Contentful integration fully restored and working correctly
- ✅ API endpoints returning real Contentful data (not mocked data)
- ✅ Project detail pages loading successfully (e.g., /projects/egg-roller)
- ✅ Blog pages load successfully
- ✅ TypeScript compilation passes
- ✅ Created isomorphic Contentful service for centralized client management
- ✅ Eliminated repeated validation/client creation code across API routes
