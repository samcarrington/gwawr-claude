/**
 * Contentful Migration - Phase 1: Comprehensive Content Type Enhancement
 * 
 * This script adds all missing fields to blogPost, project, and testimonial content types
 * following the migration plan. All fields are added as optional to maintain backward compatibility.
 * 
 * Content Types Enhanced:
 * - blogPost: slug, category, tags, publishedAt, readTime, featured
 * - project: liveUrl, repositoryUrl, featured, endDate, status  
 * - testimonial: clientName, clientTitle, clientCompany, rating, featured, projectReference
 */

const { createClient } = require('contentful-management')
require('dotenv').config()

// Configuration from environment variables
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'

// Validate required environment variables
if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ Missing required environment variables:')
  console.error('   CONTENTFUL_SPACE_ID')
  console.error('   CONTENTFUL_MANAGEMENT_TOKEN')
  process.exit(1)
}

// Content type field definitions
const CONTENT_TYPE_FIELDS = {
  blogPost: [
    {
      id: 'slug',
      name: 'Slug',
      type: 'Symbol',
      required: false,
      validations: [
        { unique: true },
        { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }
      ],
      helpText: 'URL-friendly version of the title (e.g., "my-blog-post")'
    },
    {
      id: 'category',
      name: 'Category',
      type: 'Symbol',
      required: false,
      validations: [
        { in: ['Technology', 'Web Development', 'JavaScript', 'Vue.js', 'CSS', 'DevOps', 'Backend', 'Frontend', 'General'] }
      ],
      helpText: 'Select the main category for this blog post'
    },
    {
      id: 'tags',
      name: 'Tags',
      type: 'Array',
      items: { type: 'Symbol' },
      required: false,
      validations: [{ size: { min: 0, max: 10 } }],
      helpText: 'Tags for categorization and filtering (max 10 tags)'
    },
    {
      id: 'publishedAt',
      name: 'Published At',
      type: 'Date',
      required: false,
      helpText: 'Publication date and time for this blog post'
    },
    {
      id: 'readTime',
      name: 'Read Time',
      type: 'Integer',
      required: false,
      validations: [{ range: { min: 1, max: 60 } }],
      helpText: 'Estimated reading time in minutes (1-60)'
    },
    {
      id: 'featured',
      name: 'Featured',
      type: 'Boolean',
      required: false,
      defaultValue: { 'en-US': false },
      helpText: 'Mark this post as featured to highlight it on the homepage'
    }
  ],
  
  project: [
    {
      id: 'liveUrl',
      name: 'Live URL',
      type: 'Symbol',
      required: false,
      validations: [{ regexp: { pattern: '^https?://.*' } }],
      helpText: 'URL to live project/demo (e.g., "https://example.com")'
    },
    {
      id: 'repositoryUrl',
      name: 'Repository URL',
      type: 'Symbol',
      required: false,
      validations: [{ regexp: { pattern: '^https?://.*' } }],
      helpText: 'URL to code repository (e.g., "https://github.com/user/repo")'
    },
    {
      id: 'featured',
      name: 'Featured',
      type: 'Boolean',
      required: false,
      defaultValue: { 'en-US': false },
      helpText: 'Mark this project as featured to highlight it in the portfolio'
    },
    {
      id: 'endDate',
      name: 'End Date',
      type: 'Date',
      required: false,
      helpText: 'Project completion or end date'
    },
    {
      id: 'status',
      name: 'Status',
      type: 'Symbol',
      required: false,
      validations: [{ in: ['completed', 'in-progress', 'planned'] }],
      defaultValue: { 'en-US': 'completed' },
      helpText: 'Current project status (completed, in-progress, or planned)'
    }
  ],
  
  testimonial: [
    {
      id: 'clientName',
      name: 'Client Name',
      type: 'Symbol',
      required: false,
      helpText: 'Client name (alternative to person link)'
    },
    {
      id: 'clientTitle',
      name: 'Client Title',
      type: 'Symbol',
      required: false,
      helpText: 'Client job title'
    },
    {
      id: 'clientCompany',
      name: 'Client Company',
      type: 'Symbol',
      required: false,
      helpText: 'Client company name'
    },
    {
      id: 'rating',
      name: 'Rating',
      type: 'Integer',
      required: false,
      validations: [{ range: { min: 1, max: 5 } }],
      helpText: 'Rating from 1-5 stars'
    },
    {
      id: 'featured',
      name: 'Featured',
      type: 'Boolean',
      required: false,
      defaultValue: { 'en-US': false },
      helpText: 'Mark as featured testimonial'
    },
    {
      id: 'projectReference',
      name: 'Project Reference',
      type: 'Link',
      linkType: 'Entry',
      required: false,
      validations: [{ linkContentType: ['project'] }],
      helpText: 'Related project'
    }
  ]
}

async function enhanceContentType(environment, contentTypeName, fieldsToAdd) {
  console.log(`\n🔧 Enhancing ${contentTypeName} content type...`)
  
  try {
    // Get the content type
    const contentType = await environment.getContentType(contentTypeName)
    console.log(`✅ Found ${contentTypeName} with ${contentType.fields.length} existing fields`)
    
    // Check which fields already exist
    const existingFieldIds = contentType.fields.map(field => field.id)
    let fieldsAdded = 0
    
    // Add each field if it doesn't exist
    for (const fieldDef of fieldsToAdd) {
      if (existingFieldIds.includes(fieldDef.id)) {
        console.log(`   ⏭️  Field '${fieldDef.id}' already exists, skipping...`)
        continue
      }
      
      console.log(`   ➕ Adding field '${fieldDef.id}'...`)
      
      const newField = {
        id: fieldDef.id,
        name: fieldDef.name,
        type: fieldDef.type,
        required: fieldDef.required,
        localized: false
      }
      
      if (fieldDef.items) {
        newField.items = fieldDef.items
      }
      
      if (fieldDef.linkType) {
        newField.linkType = fieldDef.linkType
      }
      
      if (fieldDef.validations) {
        newField.validations = fieldDef.validations
      }
      
      if (fieldDef.defaultValue) {
        newField.defaultValue = fieldDef.defaultValue
      }
      
      contentType.fields.push(newField)
      fieldsAdded++
    }
    
    if (fieldsAdded > 0) {
      console.log(`   💾 Saving ${contentTypeName} with ${fieldsAdded} new fields...`)
      const updatedContentType = await contentType.update()
      
      console.log(`   📤 Publishing ${contentTypeName}...`)
      await updatedContentType.publish()
      
      console.log(`   ✅ Successfully added ${fieldsAdded} fields to ${contentTypeName}!`)
    } else {
      console.log(`   ✅ All fields already exist on ${contentTypeName}!`)
    }
    
    return { added: fieldsAdded, total: contentType.fields.length + fieldsAdded }
    
  } catch (error) {
    console.error(`   ❌ Error enhancing ${contentTypeName}:`, error.message)
    throw error
  }
}

async function runComprehensiveMigration() {
  console.log('🚀 Starting Phase 1: Comprehensive Content Type Enhancement')
  console.log('=' * 70)
  
  const startTime = Date.now()
  const results = {}
  
  try {
    // Create management client
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN,
    })
    
    // Get space and environment
    const space = await client.getSpace(SPACE_ID)
    const environment = await space.getEnvironment(ENVIRONMENT)
    
    console.log(`📋 Connected to space: ${space.name} (${SPACE_ID})`)
    console.log(`🌍 Environment: ${ENVIRONMENT}`)
    
    // Enhance each content type
    for (const [contentTypeName, fieldsToAdd] of Object.entries(CONTENT_TYPE_FIELDS)) {
      const result = await enhanceContentType(environment, contentTypeName, fieldsToAdd)
      results[contentTypeName] = result
    }
    
    // Summary
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)
    
    console.log('\n' + '=' * 70)
    console.log('🎉 Phase 1 Migration Completed Successfully!')
    console.log('📊 Summary:')
    
    let totalFieldsAdded = 0
    for (const [contentType, result] of Object.entries(results)) {
      console.log(`   ${contentType}: ${result.added} fields added (${result.total} total)`)
      totalFieldsAdded += result.added
    }
    
    console.log(`\n📈 Total fields added: ${totalFieldsAdded}`)
    console.log(`⏱️  Duration: ${duration} seconds`)
    console.log('\n🔄 Next Steps:')
    console.log('   1. Run Phase 2: Data Population')
    console.log('   2. Run Phase 3: Field Requirements Update')
    console.log('   3. Run Phase 4: Application Integration')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('📝 Details:', error)
    
    console.log('\n🔄 Rollback suggestions:')
    console.log('   1. Check Contentful space for partial updates')
    console.log('   2. Manually revert any content type changes if needed')
    console.log('   3. Check error logs for specific field issues')
    
    process.exit(1)
  }
}

// Execute the script
if (require.main === module) {
  runComprehensiveMigration()
}

module.exports = { runComprehensiveMigration, enhanceContentType, CONTENT_TYPE_FIELDS }