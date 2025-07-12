#!/usr/bin/env node

/**
 * Verification script for project fields
 * Checks that all new fields were populated correctly
 */

const { createClient } = require('contentful')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

async function verifyProjectFields() {
  console.log('🔍 Verifying project field population...\n')

  try {
    // Create client
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    })

    // Get project entries
    console.log('📄 Fetching project entries...')
    const entries = await client.getEntries({
      content_type: 'project',
      include: 2
    })
    
    console.log(`✅ Found ${entries.items.length} project entries\n`)

    let featuredCount = 0
    
    // Verify each entry
    entries.items.forEach((entry, index) => {
      console.log(`📝 Entry ${index + 1}: ${entry.fields.title}`)
      console.log(`   ID: ${entry.sys.id}`)
      console.log(`   Created: ${entry.sys.createdAt}`)
      console.log(`   Updated: ${entry.sys.updatedAt}`)
      console.log(`   Published: ${entry.sys.publishedAt ? 'Yes' : 'No'}`)
      
      // Check original fields
      console.log('\n   Original Fields:')
      console.log(`   ✅ title: "${entry.fields.title}"`)
      console.log(`   ✅ slug: "${entry.fields.slug}"`)
      console.log(`   ✅ description: ${entry.fields.description ? 'Present' : 'Missing'}`)
      console.log(`   ✅ date: ${entry.fields.date || 'Not set'}`)
      
      // Check new fields
      console.log('\n   New Fields:')
      console.log(`   ${entry.fields.repositoryUrl ? '✅' : '❌'} repositoryUrl: "${entry.fields.repositoryUrl || 'Not set'}"`)
      console.log(`   ${entry.fields.liveUrl ? '✅' : '⏭️'} liveUrl: "${entry.fields.liveUrl || 'Not set'}"`)
      console.log(`   ${entry.fields.featured !== undefined ? '✅' : '❌'} featured: ${entry.fields.featured}`)
      console.log(`   ${entry.fields.status ? '✅' : '❌'} status: "${entry.fields.status || 'Not set'}"`)
      console.log(`   ${entry.fields.endDate ? '✅' : '⏭️'} endDate: "${entry.fields.endDate || 'Not set'}"`)
      
      if (entry.fields.featured) featuredCount++
      
      // Validate field formats
      console.log('\n   Field Validation:')
      if (entry.fields.repositoryUrl) {
        const urlPattern = /^https?:\/\/.*/
        console.log(`   ${urlPattern.test(entry.fields.repositoryUrl) ? '✅' : '❌'} Repository URL format: ${urlPattern.test(entry.fields.repositoryUrl) ? 'Valid' : 'Invalid'}`)
      }
      
      if (entry.fields.liveUrl) {
        const urlPattern = /^https?:\/\/.*/
        console.log(`   ${urlPattern.test(entry.fields.liveUrl) ? '✅' : '❌'} Live URL format: ${urlPattern.test(entry.fields.liveUrl) ? 'Valid' : 'Invalid'}`)
      }
      
      if (entry.fields.status) {
        const validStatuses = ['completed', 'in-progress', 'planned']
        console.log(`   ${validStatuses.includes(entry.fields.status) ? '✅' : '❌'} Status validation: ${validStatuses.includes(entry.fields.status) ? 'Valid' : 'Invalid'}`)
      }
      
      console.log('\n' + '─'.repeat(80) + '\n')
    })

    console.log('📊 Summary:')
    console.log(`   Total projects: ${entries.items.length}`)
    console.log(`   Featured projects: ${featuredCount}`)
    console.log(`   Projects with repository URLs: ${entries.items.filter(e => e.fields.repositoryUrl).length}`)
    console.log(`   Projects with live URLs: ${entries.items.filter(e => e.fields.liveUrl).length}`)
    console.log(`   Projects with end dates: ${entries.items.filter(e => e.fields.endDate).length}`)
    
    console.log('\n🎉 Field verification completed!')

  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    process.exit(1)
  }
}

// Run verification
verifyProjectFields()