/**
 * Direct Contentful Management Script - Add testimonial fields
 * 
 * This script directly uses the Contentful Management API to add fields
 * to the testimonial content type.
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

async function addTestimonialFields() {
  console.log('🚀 Adding fields to testimonial content type...')
  
  try {
    // Create management client
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN,
    })
    
    // Get space and environment
    const space = await client.getSpace(SPACE_ID)
    const environment = await space.getEnvironment(ENVIRONMENT)
    
    // Get the testimonial content type
    console.log('📋 Fetching testimonial content type...')
    const contentType = await environment.getContentType('testimonial')
    
    console.log(`✅ Found testimonial content type with ${contentType.fields.length} existing fields`)
    
    // Check which fields already exist
    const existingFieldIds = contentType.fields.map(field => field.id)
    const fieldsToAdd = [
      {
        id: 'clientName',
        name: 'Client Name',
        type: 'Symbol',
        required: false
      },
      {
        id: 'clientTitle',
        name: 'Client Title',
        type: 'Symbol',
        required: false
      },
      {
        id: 'clientCompany',
        name: 'Client Company',
        type: 'Symbol',
        required: false
      },
      {
        id: 'rating',
        name: 'Rating',
        type: 'Integer',
        required: false,
        validations: [{ range: { min: 1, max: 5 } }]
      },
      {
        id: 'featured',
        name: 'Featured',
        type: 'Boolean',
        required: false,
        defaultValue: { 'en-US': false }
      },
      {
        id: 'projectReference',
        name: 'Project Reference',
        type: 'Link',
        linkType: 'Entry',
        required: false,
        validations: [{ linkContentType: ['project'] }]
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
      console.log(`💾 Saving content type with ${fieldsAdded} new fields...`)
      const updatedContentType = await contentType.update()
      
      console.log(`📤 Publishing content type...`)
      await updatedContentType.publish()
      
      console.log(`✅ Successfully added ${fieldsAdded} fields to testimonial content type!`)
    } else {
      console.log(`✅ All fields already exist on testimonial content type!`)
    }
    
    console.log('\n📋 Final field list:')
    const finalContentType = await environment.getContentType('testimonial')
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
  addTestimonialFields()
}

module.exports = { addTestimonialFields }