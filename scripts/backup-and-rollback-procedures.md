# Contentful Migration Backup and Rollback Procedures

## Overview

This document outlines comprehensive backup and rollback procedures for the Contentful content model migration. These procedures ensure data safety and provide recovery options at each migration phase.

## Pre-Migration Backup

### 1. Content Model Backup

**Script: `scripts/backup-content-models.cjs`**

```javascript
/**
 * Create a complete backup of all content types before migration
 */
const { createClient } = require('contentful-management')
const fs = require('fs')
require('dotenv').config()

async function backupContentModels() {
  const client = createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN })
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master')
  
  const contentTypes = await environment.getContentTypes()
  
  const backup = {
    timestamp: new Date().toISOString(),
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    contentTypes: contentTypes.items.map(ct => ({
      sys: ct.sys,
      name: ct.name,
      description: ct.description,
      displayField: ct.displayField,
      fields: ct.fields
    }))
  }
  
  const filename = `backup-content-models-${Date.now()}.json`
  fs.writeFileSync(filename, JSON.stringify(backup, null, 2))
  
  console.log(`✅ Content models backed up to ${filename}`)
  return filename
}
```

### 2. Content Data Backup

**Script: `scripts/backup-content-data.cjs`**

```javascript
/**
 * Create a complete backup of all content entries before migration
 */
async function backupContentData() {
  const client = createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN })
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master')
  
  const allEntries = await environment.getEntries({ limit: 1000 })
  
  const backup = {
    timestamp: new Date().toISOString(),
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    entries: allEntries.items.map(entry => ({
      sys: entry.sys,
      fields: entry.fields
    }))
  }
  
  const filename = `backup-content-data-${Date.now()}.json`
  fs.writeFileSync(filename, JSON.stringify(backup, null, 2))
  
  console.log(`✅ Content data backed up to ${filename}`)
  return filename
}
```

### 3. Environment Clone (Recommended)

**Best Practice: Create a backup environment**

```bash
# Using Contentful CLI
contentful space environment create --name "backup-$(date +%Y%m%d)" --source master
```

## Phase-Specific Rollback Procedures

### Phase 1 Rollback: Content Type Fields

**Issue:** New fields were added but need to be removed

**Rollback Script: `scripts/rollback-phase-1.cjs`**

```javascript
/**
 * Remove fields added in Phase 1 migration
 */
const FIELDS_TO_REMOVE = {
  blogPost: ['slug', 'category', 'tags', 'publishedAt', 'readTime', 'featured'],
  project: ['liveUrl', 'repositoryUrl', 'featured', 'endDate', 'status'],
  testimonial: ['clientName', 'clientTitle', 'clientCompany', 'rating', 'featured', 'projectReference']
}

async function rollbackPhase1() {
  console.log('🔄 Rolling back Phase 1: Removing added fields...')
  
  for (const [contentTypeName, fieldsToRemove] of Object.entries(FIELDS_TO_REMOVE)) {
    const contentType = await environment.getContentType(contentTypeName)
    
    // Remove fields in reverse order to avoid dependency issues
    for (const fieldId of fieldsToRemove.reverse()) {
      const fieldIndex = contentType.fields.findIndex(f => f.id === fieldId)
      if (fieldIndex !== -1) {
        contentType.fields.splice(fieldIndex, 1)
        console.log(`   ✅ Removed field: ${fieldId}`)
      }
    }
    
    await contentType.update()
    await contentType.publish()
  }
  
  console.log('✅ Phase 1 rollback completed')
}
```

### Phase 2 Rollback: Data Population

**Issue:** Incorrect data was populated in new fields

**Rollback Script: `scripts/rollback-phase-2.cjs`**

```javascript
/**
 * Clear data from fields added in Phase 1
 */
async function rollbackPhase2() {
  console.log('🔄 Rolling back Phase 2: Clearing populated data...')
  
  const contentTypes = ['blogPost', 'project', 'testimonial']
  
  for (const contentTypeName of contentTypes) {
    const entries = await environment.getEntries({ content_type: contentTypeName })
    
    for (const entry of entries.items) {
      let modified = false
      
      // Clear all fields added in Phase 1
      const fieldsToRemove = FIELDS_TO_REMOVE[contentTypeName] || []
      for (const fieldId of fieldsToRemove) {
        if (entry.fields[fieldId]) {
          delete entry.fields[fieldId]
          modified = true
        }
      }
      
      if (modified) {
        await entry.update()
        await entry.publish()
        console.log(`   ✅ Cleared data from entry: ${entry.sys.id}`)
      }
    }
  }
  
  console.log('✅ Phase 2 rollback completed')
}
```

### Phase 3 Rollback: Field Requirements

**Issue:** Fields were made required but should be optional

**Rollback Script: `scripts/rollback-phase-3.cjs`**

```javascript
/**
 * Make required fields optional again
 */
const FIELDS_TO_MAKE_OPTIONAL = {
  blogPost: ['slug'],
  project: ['repositoryUrl'],
  testimonial: ['rating']
}

async function rollbackPhase3() {
  console.log('🔄 Rolling back Phase 3: Making fields optional...')
  
  for (const [contentTypeName, fieldsToUpdate] of Object.entries(FIELDS_TO_MAKE_OPTIONAL)) {
    const contentType = await environment.getContentType(contentTypeName)
    
    for (const fieldId of fieldsToUpdate) {
      const fieldIndex = contentType.fields.findIndex(f => f.id === fieldId)
      if (fieldIndex !== -1) {
        contentType.fields[fieldIndex].required = false
        console.log(`   ✅ Made field optional: ${fieldId}`)
      }
    }
    
    await contentType.update()
    await contentType.publish()
  }
  
  console.log('✅ Phase 3 rollback completed')
}
```

### Phase 4 Rollback: Application Integration

**Issue:** Application changes need to be reverted

**Rollback Checklist:**

1. **Revert Frontend Changes**
   ```bash
   # Revert to previous git commit
   git revert <commit-hash>
   
   # Or reset to previous state
   git reset --hard <previous-commit>
   ```

2. **Update TypeScript Interfaces**
   - Remove new fields from interface definitions
   - Update transformers to handle missing fields gracefully

3. **Revert URL Structure Changes**
   - Restore ID-based URLs if slug-based URLs were implemented
   - Update routing configuration

4. **Clear Application Caches**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   
   # Clear node_modules if needed
   rm -rf node_modules && npm install
   ```

## Emergency Rollback Procedures

### Complete Environment Restore

**When:** Catastrophic failure requiring complete restoration

**Procedure:**

1. **Stop Application**
   ```bash
   # Stop production deployment
   pm2 stop all
   # or
   docker stop <container>
   ```

2. **Restore from Backup Environment**
   ```bash
   # Clone backup environment to master
   contentful space environment create --name "restore-$(date +%Y%m%d)" --source backup-20250712
   
   # Update environment alias
   contentful space environment update master --name "master-old"
   contentful space environment update restore-20250712 --name "master"
   ```

3. **Restore Content Data**
   ```javascript
   // Use backup-content-data.cjs in reverse
   const backupData = require('./backup-content-data-1720786800000.json')
   
   for (const entryData of backupData.entries) {
     const entry = await environment.getEntry(entryData.sys.id)
     entry.fields = entryData.fields
     await entry.update()
     await entry.publish()
   }
   ```

4. **Revert Application Code**
   ```bash
   git checkout main
   git reset --hard <last-known-good-commit>
   npm install
   npm run build
   ```

5. **Restart Application**
   ```bash
   pm2 start all
   # or
   docker start <container>
   ```

## Rollback Testing

### Pre-Rollback Checklist

- [ ] **Backup Current State**: Create backup before rollback
- [ ] **Test Environment**: Test rollback in staging/development first
- [ ] **Downtime Window**: Schedule maintenance window for production
- [ ] **Team Notification**: Notify team of rollback procedure
- [ ] **Monitoring**: Set up monitoring for rollback process

### Post-Rollback Verification

- [ ] **Content Types**: Verify content types match expected state
- [ ] **Entry Data**: Verify entry data is correct
- [ ] **Application**: Verify application functions correctly
- [ ] **Performance**: Check performance metrics
- [ ] **User Experience**: Test user-facing functionality

## Recovery Time Objectives (RTO)

| Rollback Type | Target RTO | Maximum RTO |
|---------------|------------|-------------|
| Phase 1 (Fields) | 15 minutes | 30 minutes |
| Phase 2 (Data) | 30 minutes | 60 minutes |
| Phase 3 (Requirements) | 10 minutes | 20 minutes |
| Phase 4 (Application) | 45 minutes | 90 minutes |
| Complete Restore | 2 hours | 4 hours |

## Monitoring and Alerting

### Key Metrics to Monitor

1. **Content API Response Times**
2. **Application Error Rates**
3. **Content Entry Validation Errors**
4. **User Experience Metrics**

### Rollback Triggers

- **API Response Time** > 5 seconds
- **Error Rate** > 5%
- **Content Validation Failures** > 10%
- **User Reports** of critical issues

## Documentation and Communication

### Rollback Communication Template

```
🚨 ROLLBACK INITIATED

Migration Phase: [Phase X]
Rollback Reason: [Brief description]
Expected Downtime: [Duration]
Status: [In Progress/Completed]

Actions Taken:
- [Action 1]
- [Action 2]

Next Steps:
- [Next step 1]
- [Next step 2]

Contact: [Team lead contact]
```

### Post-Rollback Report

Document the following after any rollback:

1. **Root Cause Analysis**
2. **Timeline of Events**
3. **Actions Taken**
4. **Lessons Learned**
5. **Process Improvements**

## Best Practices

1. **Always Test Rollbacks**: Test rollback procedures in staging
2. **Document Everything**: Keep detailed logs of all changes
3. **Incremental Rollbacks**: Roll back one phase at a time when possible
4. **Monitor Actively**: Watch metrics during and after rollback
5. **Team Communication**: Keep team informed throughout process
6. **Learning Culture**: Treat rollbacks as learning opportunities

## Scripts Directory Structure

```
scripts/
├── backup-content-models.cjs
├── backup-content-data.cjs
├── rollback-phase-1.cjs
├── rollback-phase-2.cjs
├── rollback-phase-3.cjs
├── rollback-complete.cjs
├── verify-rollback.cjs
└── backup-and-rollback-procedures.md
```

## Automation

Consider creating a master rollback script that can handle different scenarios:

```javascript
// scripts/rollback-master.cjs
const args = process.argv.slice(2)
const phase = args[0]
const confirm = args[1]

if (confirm !== '--confirm') {
  console.log('⚠️  Add --confirm to execute rollback')
  process.exit(1)
}

switch (phase) {
  case 'phase1':
    await rollbackPhase1()
    break
  case 'phase2':
    await rollbackPhase2()
    break
  case 'phase3':
    await rollbackPhase3()
    break
  case 'complete':
    await rollbackComplete()
    break
  default:
    console.log('Usage: node rollback-master.cjs [phase1|phase2|phase3|complete] --confirm')
}
```

This comprehensive backup and rollback strategy ensures that we can safely recover from any issues that arise during the migration process.