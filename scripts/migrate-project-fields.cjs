/**
 * Direct Contentful Management Script - Add project fields
 * 
 * This script directly uses the Contentful Management API to add fields
 * to the project content type, bypassing the need for CLI migration tools.
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

async function addProjectFields() {
  console.log('🚀 Adding fields to project content type...')
  
  try {
    // Create management client
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN,
    })
    
    // Get space and environment
    const space = await client.getSpace(SPACE_ID)
    const environment = await space.getEnvironment(ENVIRONMENT)
    
    // Get the project content type
    console.log('📋 Fetching project content type...')
    const contentType = await environment.getContentType('project')
    
    console.log(`✅ Found project content type with ${contentType.fields.length} existing fields`)
    
    // Check which fields already exist
    const existingFieldIds = contentType.fields.map(field => field.id)
    const fieldsToAdd = [
      {
        id: 'liveUrl',
        name: 'Live URL',
        type: 'Symbol',
        required: false,
        validations: [{ regexp: { pattern: '^https?://.*' } }]
      },
      {
        id: 'repositoryUrl',
        name: 'Repository URL',
        type: 'Symbol',
        required: false,
        validations: [{ regexp: { pattern: '^https?://.*' } }]
      },
      {
        id: 'featured',
        name: 'Featured',
        type: 'Boolean',
        required: false,
        defaultValue: { 'en-US': false }
      },
      {
        id: 'endDate',
        name: 'End Date',
        type: 'Date',
        required: false
      },
      {
        id: 'status',
        name: 'Status',
        type: 'Symbol',
        required: false,
        validations: [{ in: ['completed', 'in-progress', 'planned'] }],
        defaultValue: { 'en-US': 'completed' }
      }
    ]
    
    // Add each field if it doesn't exist
    let fieldsAdded = 0
    for (const fieldDef of fieldsToAdd) {
      if (existingFieldIds.includes(fieldDef.id)) {
        console.log(`⏭️  Field '${fieldDef.id}' already exists, skipping...`)
        continue
      }
      
      console.log(`➕ Adding field '${fieldDef.id}'...`)
      
      const newField = {
        id: fieldDef.id,
        name: fieldDef.name,
        type: fieldDef.type,
        required: fieldDef.required,
        localized: false
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
      console.log(`💾 Saving content type with ${fieldsAdded} new fields...`)
      const updatedContentType = await contentType.update()
      
      console.log(`📤 Publishing content type...`)
      await updatedContentType.publish()
      
      console.log(`✅ Successfully added ${fieldsAdded} fields to project content type!`)
    } else {
      console.log(`✅ All fields already exist on project content type!`)
    }
    
    console.log('\n📋 Final field list:')
    const finalContentType = await environment.getContentType('project')
    finalContentType.fields.forEach((field, index) => {
      const isNew = fieldsToAdd.some(f => f.id === field.id)
      console.log(`   ${index + 1}. ${field.name} (${field.id}) - ${field.type} ${isNew ? '🆕' : ''}`)
    })
    
  } catch (error) {
    console.error('❌ Error adding fields:', error)
    console.error('📝 Details:', error.message)
    process.exit(1)
  }
}

// Execute the script
if (require.main === module) {
  addProjectFields()
}

module.exports = { addProjectFields }