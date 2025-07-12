
/**
 * Verification script to check the populated blogPost data
 */

import contentfulManagement from 'contentful-management'
import dotenv from 'dotenv'

// Configuration from environment variables
dotenv.config()

const { createClient } = contentfulManagement

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'

async function verifyBlogPostData() {
  console.log('🔍 Verifying blogPost data population...')
  
  try {
    // Create management client
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN,
    })
    
    // Get space and environment
    const space = await client.getSpace(SPACE_ID)
    const environment = await space.getEnvironment(ENVIRONMENT)
    
    // Get all blogPost entries
    const entries = await environment.getEntries({
      content_type: 'blogPost'
    })
    
    console.log(`📋 Found ${entries.items.length} blogPost entries\n`)
    
    // Display details of each entry
    for (const entry of entries.items) {
      console.log(`📝 Entry: ${entry.fields.title['en-US']}`)
      console.log(`   ID: ${entry.sys.id}`)
      console.log(`   Status: ${entry.sys.publishedVersion ? 'Published' : 'Draft'}`)
      console.log(`   Created: ${entry.sys.createdAt}`)
      console.log(`   Updated: ${entry.sys.updatedAt}`)
      console.log(`\n   🏷️ Field Values:`)
      console.log(`   - slug: ${entry.fields.slug ? entry.fields.slug['en-US'] : 'NOT SET'}`)
      console.log(`   - category: ${entry.fields.category ? entry.fields.category['en-US'] : 'NOT SET'}`)
      console.log(`   - tags: ${entry.fields.tags ? entry.fields.tags['en-US'].join(', ') : 'NOT SET'}`)
      console.log(`   - readTime: ${entry.fields.readTime ? entry.fields.readTime['en-US'] : 'NOT SET'}`)
      console.log(`   - publishedAt: ${entry.fields.publishedAt ? entry.fields.publishedAt['en-US'] : 'NOT SET'}`)
      console.log(`   - featured: ${entry.fields.featured ? entry.fields.featured['en-US'] : 'NOT SET'}`)
      console.log(`\n   📊 Field Validation:`)
      
      // Check slug pattern
      if (entry.fields.slug) {
        const slug = entry.fields.slug['en-US']
        const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
        console.log(`   - slug pattern (a-z0-9-): ${slugPattern.test(slug) ? '✅ VALID' : '❌ INVALID'}`)
      }
      
      // Check category options
      if (entry.fields.category) {
        const validCategories = ['JavaScript', 'Web Development', 'DevOps', 'Backend', 'Frontend', 'Vue.js', 'CSS', 'Technology', 'General']
        const category = entry.fields.category['en-US']
        console.log(`   - category options: ${validCategories.includes(category) ? '✅ VALID' : '❌ INVALID'}`)
      }
      
      // Check tags array
      if (entry.fields.tags) {
        const tags = entry.fields.tags['en-US']
        console.log(`   - tags array: ${Array.isArray(tags) ? '✅ VALID' : '❌ INVALID'}`)
        console.log(`   - tags count: ${tags.length}`)
      }
      
      // Check readTime number
      if (entry.fields.readTime) {
        const readTime = entry.fields.readTime['en-US']
        console.log(`   - readTime number: ${typeof readTime === 'number' && readTime > 0 ? '✅ VALID' : '❌ INVALID'}`)
      }
      
      // Check publishedAt date
      if (entry.fields.publishedAt) {
        const publishedAt = entry.fields.publishedAt['en-US']
        console.log(`   - publishedAt date: ${publishedAt && new Date(publishedAt).toString() !== 'Invalid Date' ? '✅ VALID' : '❌ INVALID'}`)
      }
      
      // Check featured boolean
      if (entry.fields.featured !== undefined) {
        const featured = entry.fields.featured['en-US']
        console.log(`   - featured boolean: ${typeof featured === 'boolean' ? '✅ VALID' : '❌ INVALID'}`)
      }
      
      console.log(`\n${'='.repeat(80)}\n`)
    }
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message)
  }
}

// Execute the script
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyBlogPostData().catch(console.error)
}

export { verifyBlogPostData }