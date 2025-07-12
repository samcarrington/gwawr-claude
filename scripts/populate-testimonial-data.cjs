/**
 * Contentful Data Population Script - Phase 2: testimonial Data
 * 
 * This script populates the new fields added to the testimonial content type:
 * - Copy name/title/company from person link to direct fields
 * - Set rating to 5 (default high rating)
 * - Mark best testimonial as featured
 * - Link to relevant projects where applicable
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

// Helper function to find matching project based on client/company info
async function findMatchingProject(environment, clientName, clientCompany, testimonialContent) {
  try {
    // Get all projects to match against
    const projects = await environment.getEntries({
      content_type: 'project'
    })
    
    const nameLower = (clientName || '').toLowerCase()
    const companyLower = (clientCompany || '').toLowerCase()
    const contentLower = (testimonialContent || '').toLowerCase()
    
    // Look for keyword matches in project titles and descriptions
    for (const project of projects.items) {
      const projectTitle = (project.fields.title?.['en-US'] || '').toLowerCase()
      const projectDesc = (project.fields.description?.['en-US'] || '').toLowerCase()
      
      // Match by company name in project title
      if (companyLower && projectTitle.includes(companyLower)) {
        return project.sys.id
      }
      
      // Match by keywords in testimonial content
      const keywords = ['premier league', 'freeview', 'tv guide', 'premier inn', 'sainsbury', 'british gas', 'xbox', 'dulux', 'budweiser']
      for (const keyword of keywords) {
        if (contentLower.includes(keyword) && projectTitle.includes(keyword)) {
          return project.sys.id
        }
      }
    }
    
    return null
  } catch (error) {
    console.warn(`⚠️  Could not find matching project: ${error.message}`)
    return null
  }
}

// Helper function to extract text from rich text content
function extractTextFromRichText(richText) {
  if (!richText || !richText.content) return ''
  
  let text = ''
  function extractFromNodes(nodes) {
    if (Array.isArray(nodes)) {
      for (const node of nodes) {
        if (node.nodeType === 'text') {
          text += node.value + ' '
        } else if (node.content) {
          extractFromNodes(node.content)
        }
      }
    }
  }
  
  extractFromNodes(richText.content)
  return text.trim()
}

async function populateTestimonialData() {
  console.log('🚀 Starting testimonial data population...')
  
  try {
    // Create management client
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN,
    })
    
    // Get space and environment
    const space = await client.getSpace(SPACE_ID)
    const environment = await space.getEnvironment(ENVIRONMENT)
    
    // Get all testimonial entries
    console.log('📄 Fetching testimonial entries...')
    const entries = await environment.getEntries({
      content_type: 'testimonial',
      include: 2  // Include linked entries
    })
    
    console.log(`📋 Found ${entries.items.length} testimonial entries to update`)
    
    // Process each entry
    for (const [index, entry] of entries.items.entries()) {
      console.log(`\n📝 Processing testimonial ${index + 1}: ${entry.fields.title?.['en-US'] || 'Untitled'}`)
      
      const title = entry.fields.title?.['en-US'] || ''
      const quote = entry.fields.quote?.['en-US']
      const quoteText = quote ? extractTextFromRichText(quote) : ''
      
      // Extract person data from attribution link
      let clientName = ''
      let clientTitle = ''
      let clientCompany = ''
      
      if (entry.fields.attribution?.['en-US']) {
        const attributionId = entry.fields.attribution['en-US'].sys.id
        try {
          const person = await environment.getEntry(attributionId)
          clientName = person.fields.name?.['en-US'] || ''
          clientTitle = person.fields.jobTitle?.['en-US'] || ''
          clientCompany = person.fields.company?.['en-US'] || ''
        } catch (error) {
          console.warn(`⚠️  Could not fetch person data: ${error.message}`)
        }
      }
      
      // Generate new field values
      const rating = 5 // Default high rating
      const featured = index === 0 // Mark first testimonial as featured
      
      // Find matching project
      const projectReferenceId = await findMatchingProject(environment, clientName, clientCompany, quoteText)
      
      console.log(`  👤 Client Name: ${clientName}`)
      console.log(`  💼 Client Title: ${clientTitle}`)
      console.log(`  🏢 Client Company: ${clientCompany}`)
      console.log(`  ⭐ Rating: ${rating}`)
      console.log(`  🌟 Featured: ${featured}`)
      console.log(`  🔗 Project Reference: ${projectReferenceId || 'None found'}`)
      
      // Update entry fields
      if (clientName) {
        entry.fields.clientName = { 'en-US': clientName }
      }
      if (clientTitle) {
        entry.fields.clientTitle = { 'en-US': clientTitle }
      }
      if (clientCompany) {
        entry.fields.clientCompany = { 'en-US': clientCompany }
      }
      entry.fields.rating = { 'en-US': rating }
      entry.fields.featured = { 'en-US': featured }
      
      if (projectReferenceId) {
        entry.fields.projectReference = { 
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: projectReferenceId
            }
          }
        }
      }
      
      // Save and publish the entry
      console.log(`  💾 Saving entry...`)
      const updatedEntry = await entry.update()
      await updatedEntry.publish()
      
      console.log(`  ✅ Entry updated and published successfully!`)
    }
    
    console.log('\n🎉 All testimonial entries updated successfully!')
    console.log('📊 Summary:')
    console.log(`   - Entries processed: ${entries.items.length}`)
    console.log(`   - Featured testimonials: ${entries.items.filter((_, i) => i === 0).length}`)
    console.log(`   - Fields populated: clientName, clientTitle, clientCompany, rating, featured, projectReference`)
    
  } catch (error) {
    console.error('❌ Error during data population:', error)
    console.error('📝 Details:', error.message)
    process.exit(1)
  }
}

// Execute the script
if (require.main === module) {
  populateTestimonialData()
}

module.exports = { populateTestimonialData }