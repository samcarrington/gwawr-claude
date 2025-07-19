---
id: task-55
title: Fix broken Contentful integration after contentful-client refactor
status: To Do
assignee: []
created_date: '2025-07-19'
labels: []
dependencies: []
---

## Description

The Contentful integration is completely broken and falling back to mock data due to missing dependencies after the `contentful-client` utility was refactored out. Despite having all environment variables properly configured (space ID, access tokens, environment, hosts), the system cannot connect to Contentful because of broken import chains in the service layer.

### Root Cause Analysis

After investigation, the following issues have been identified:

1. **Missing Contentful Client Utility**: 
   - `services/contentfulService.ts` imports `getContentfulClient` from `~/utils/contentful-client`
   - The `utils/contentful-client.ts` file doesn't exist (was refactored out)
   - This breaks the entire ContentfulService class initialization

2. **API Endpoint Fallback**:
   - `server/api/projects.get.ts` checks for Contentful configuration
   - When ContentfulService fails to initialize, it falls back to mock data
   - The fallback message: "Contentful not configured, using mock data for projects"

3. **Environment Variables Are Configured**:
   - All required Contentful environment variables are properly set
   - The issue is purely in the code integration layer, not configuration

### Impact

- **Projects page**: Shows mock data instead of real Contentful projects
- **Blog posts**: Likely affected by same integration issues
- **Testimonials**: Likely affected by same integration issues
- **Filter functionality**: Works with mock data but not real data
- **Content management**: Cannot update content through Contentful CMS

### Current Workaround

The system gracefully falls back to mock data, so the site functions but doesn't reflect real content from Contentful.

## Acceptance Criteria

### Technical Requirements
- [ ] **Create or restore missing Contentful client utility**
  - [ ] Create `utils/contentful-client.ts` with `getContentfulClient()` function
  - [ ] Function should create and return configured Contentful client instance
  - [ ] Use environment variables from Nuxt runtime config
  - [ ] Handle both CDN and Preview API configurations

- [ ] **Fix ContentfulService integration**
  - [ ] Update `services/contentfulService.ts` to use restored client utility
  - [ ] Ensure all ContentfulService methods work with real Contentful client
  - [ ] Maintain existing API interface for backward compatibility

- [ ] **Update API endpoints to use ContentfulService**
  - [ ] Modify `server/api/projects.get.ts` to use ContentfulService instead of direct client
  - [ ] Update other API endpoints (blog, testimonials) if affected
  - [ ] Ensure proper error handling and fallback to mock data on failures

- [ ] **Verify environment configuration integration**
  - [ ] Confirm runtime config properly reads all Contentful environment variables
  - [ ] Test both development and production configuration scenarios
  - [ ] Ensure proper error messages when configuration is missing

### Functional Requirements
- [ ] **Projects integration works end-to-end**
  - [ ] Projects page displays real Contentful data instead of mock data
  - [ ] Filter functionality works with real project data from Contentful
  - [ ] Project categories and statuses reflect actual Contentful content
  - [ ] Project detail pages work with real Contentful data

- [ ] **Other content types work (if affected)**
  - [ ] Blog posts display real Contentful data
  - [ ] Testimonials display real Contentful data
  - [ ] All content filtering and pagination works with real data

- [ ] **Graceful error handling**
  - [ ] System falls back to mock data when Contentful is unavailable
  - [ ] Clear error messages in server logs when Contentful fails
  - [ ] No client-side errors when Contentful integration fails

### Testing Requirements
- [ ] **Unit tests for Contentful client utility**
  - [ ] Test client initialization with valid configuration
  - [ ] Test error handling with invalid configuration
  - [ ] Test environment variable integration

- [ ] **Integration tests for ContentfulService**
  - [ ] Test all service methods with mocked Contentful client
  - [ ] Test error handling and transformation logic
  - [ ] Test fallback behavior when Contentful is unavailable

- [ ] **API endpoint tests**
  - [ ] Test API endpoints return real Contentful data when available
  - [ ] Test fallback to mock data when Contentful fails
  - [ ] Test filtering and pagination with real data

- [ ] **E2E tests**
  - [ ] Test complete user journey with real Contentful data
  - [ ] Test filter persistence with real data
  - [ ] Test content updates reflect on frontend

### Documentation Requirements
- [ ] **Update technical documentation**
  - [ ] Document the restored Contentful client utility
  - [ ] Update ContentfulService documentation
  - [ ] Document environment variable requirements

- [ ] **Update deployment documentation**
  - [ ] Ensure deployment guides include Contentful configuration
  - [ ] Document troubleshooting steps for Contentful integration issues
