/**
 * Contentful Data Population Script - Phase 2: blogPost Data
 * 
 * This script populates the new fields added to the blogPost content type:
 * - Generate slug from title
 * - Set category based on content analysis
 * - Add relevant tags
 * - Set publishedAt to sys.createdAt
 * - Calculate readTime from content
 * - Mark most recent as featured
 */

import contentfulManagement from 'contentful-management'
import dotenv from 'dotenv'

// Configuration from environment variables
dotenv.config()

const { createClient } = contentfulManagement

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'

// Validate required environment variables
if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ Missing required environment variables:')
  console.error('   CONTENTFUL_SPACE_ID')
  console.error('   CONTENTFUL_MANAGEMENT_TOKEN')
  console.error('   CONTENTFUL_ENVIRONMENT (optional, defaults to master)')
  process.exit(1)
}

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Helper function to calculate reading time
function calculateReadingTime(content) {
  const wordsPerMinute = 200
  let wordCount = 0
  
  // Extract text from rich text content
  if (content && content.content) {
    const textContent = extractTextFromRichText(content.content)
    wordCount = textContent.split(/\s+/).length
  }
  
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// Helper function to extract text from rich text structure
function extractTextFromRichText(nodes) {
  let text = ''
  
  if (Array.isArray(nodes)) {
    for (const node of nodes) {
      if (node.nodeType === 'text') {
        text += node.value + ' '
      } else if (node.content) {
        text += extractTextFromRichText(node.content)
      }
    }
  }
  
  return text.trim()
}

// Helper function to determine category based on content
function determineCategory(title, content) {
  const titleLower = title.toLowerCase()
  const contentText = extractTextFromRichText(content?.content || []).toLowerCase()
  const fullText = (titleLower + ' ' + contentText).toLowerCase()
  
  // Category mapping based on keywords
  const categoryMap = {
    'JavaScript': ['javascript', 'js', 'node', 'react', 'vue', 'angular'],
    'Web Development': ['web', 'html', 'css', 'frontend', 'backend', 'fullstack'],
    'DevOps': ['docker', 'kubernetes', 'deployment', 'ci/cd', 'devops'],
    'Backend': ['api', 'server', 'database', 'backend', 'express', 'nest'],
    'Frontend': ['frontend', 'ui', 'ux', 'component', 'styling'],
    'Vue.js': ['vue', 'nuxt', 'composition api', 'vue.js'],
    'CSS': ['css', 'styling', 'layout', 'flexbox', 'grid'],
    'Technology': ['tech', 'software', 'programming', 'development']
  }
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => fullText.includes(keyword))) {
      return category
    }
  }
  
  return 'General'
}

// Helper function to generate tags
function generateTags(title, content, category) {
  const titleLower = title.toLowerCase()
  const contentText = extractTextFromRichText(content?.content || []).toLowerCase()
  const fullText = (titleLower + ' ' + contentText).toLowerCase()
  
  const potentialTags = [
    // Technical tags
    'javascript', 'typescript', 'vue', 'react', 'node', 'css', 'html',
    'frontend', 'backend', 'fullstack', 'api', 'database', 'docker',
    'deployment', 'performance', 'security', 'testing', 'architecture',
    'best-practices', 'tutorial', 'guide', 'tips', 'development',
    'programming', 'web-development', 'software-engineering'
  ]
  
  const tags = []
  
  // Add category as a tag (convert to lowercase with hyphens)
  tags.push(category.toLowerCase().replace(/\s+/g, '-'))
  
  // Find matching tags in content
  for (const tag of potentialTags) {
    if (fullText.includes(tag.replace('-', ' ')) || fullText.includes(tag)) {
      tags.push(tag)
    }
  }
  
  // Remove duplicates and limit to 10
  return [...new Set(tags)].slice(0, 10)
}

async function populateBlogPostData() {
  console.log('🚀 Starting blogPost data population...')
  
  try {
    // Create management client
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN,
    })
    
    // Get space and environment
    const space = await client.getSpace(SPACE_ID)
    const environment = await space.getEnvironment(ENVIRONMENT)
    
    // Get all blogPost entries
    console.log('📄 Fetching blogPost entries...')
    const entries = await environment.getEntries({
      content_type: 'blogPost'
    })
    
    console.log(`📋 Found ${entries.items.length} blogPost entries to update`)
    
    // Process each entry
    for (const entry of entries.items) {
      console.log(`\n📝 Processing entry: ${entry.fields.title['en-US']}`)
      
      const title = entry.fields.title['en-US']
      const content = entry.fields.content['en-US']
      const createdAt = entry.sys.createdAt
      
      // Generate new field values
      const slug = generateSlug(title)
      const category = determineCategory(title, content)
      const tags = generateTags(title, content, category)
      const readTime = calculateReadingTime(content)
      const publishedAt = createdAt // Use creation date as published date
      const featured = entries.items.indexOf(entry) === 0 // Mark first entry as featured
      
      console.log(`  📝 Generated slug: ${slug}`)
      console.log(`  📂 Category: ${category}`)
      console.log(`  🏷️ Tags: ${tags.join(', ')}`)
      console.log(`  ⏱️ Read time: ${readTime} minutes`)
      console.log(`  📅 Published: ${publishedAt}`)
      console.log(`  ⭐ Featured: ${featured}`)
      
      // Update entry fields
      entry.fields.slug = { 'en-US': slug }
      entry.fields.category = { 'en-US': category }
      entry.fields.tags = { 'en-US': tags }
      entry.fields.readTime = { 'en-US': readTime }
      entry.fields.publishedAt = { 'en-US': publishedAt }
      entry.fields.featured = { 'en-US': featured }
      
      // Save and publish the entry
      console.log(`  💾 Saving entry...`)
      const updatedEntry = await entry.update()
      await updatedEntry.publish()
      
      console.log(`  ✅ Entry updated and published successfully!`)
    }
    
    console.log('\n🎉 All blogPost entries updated successfully!')
    console.log('📊 Summary:')
    console.log(`   - Entries processed: ${entries.items.length}`)
    console.log(`   - Fields populated: slug, category, tags, readTime, publishedAt, featured`)
    console.log(`   - Featured posts: ${entries.items.filter((_, i) => i === 0).length}`)
    
  } catch (error) {
    console.error('❌ Error during data population:', error)
    console.error('📝 Details:', error.message)
    process.exit(1)
  }
}

// Execute the script
if (import.meta.url === `file://${process.argv[1]}`) {
  populateBlogPostData().catch(console.error)
}

export { populateBlogPostData }