/**
 * Contentful Data Population Script - Phase 2: project Data
 *
 * This script populates the new fields added to the project content type:
 * - Add liveUrl and repositoryUrl where appropriate
 * - Mark 2-3 best projects as featured
 * - Set endDate where applicable
 * - Set status to "completed" for finished projects
 */

const { createClient } = require('contentful-management');
require('dotenv').config();

// Configuration from environment variables
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

// Validate required environment variables
if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   CONTENTFUL_SPACE_ID');
  console.error('   CONTENTFUL_MANAGEMENT_TOKEN');
  process.exit(1);
}

// Sample data for projects (this would ideally come from project analysis)
const projectUpdates = {
  // Common patterns for project URLs based on titles
  urlPatterns: {
    github: 'https://github.com/samcarrington/',
    live: 'https://',
    demo: 'https://demo.',
  },

  // Projects to mark as featured (by title keywords)
  featuredKeywords: ['premier', 'freeview', 'portfolio', 'main', 'primary'],

  // Status determination based on project characteristics
  statusRules: {
    completed: ['website', 'guide', 'app'],
    'in-progress': ['development', 'beta'],
    planned: ['planned', 'upcoming'],
  },
};

// Helper function to generate repository URL from project slug/title
function generateRepositoryUrl(slug, title) {
  const titleLower = title.toLowerCase();

  // Generate repository URL based on project slug
  const repoName = slug.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  return `https://github.com/samcarrington/${repoName}`;
}

// Helper function to generate live URL (if applicable)
function generateLiveUrl(slug, title) {
  const titleLower = title.toLowerCase();

  // Only generate live URLs for projects that likely have live demos
  if (
    titleLower.includes('website') ||
    titleLower.includes('app') ||
    titleLower.includes('guide')
  ) {
    const domain = slug.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    return `https://${domain}.samcarrington.dev`;
  }

  return null;
}

// Helper function to determine if project should be featured
function shouldBeFeatured(title, description, index, totalProjects) {
  const titleLower = title.toLowerCase();
  const descLower = (description || '').toLowerCase();

  // Feature first 2-3 projects, or projects with featured keywords
  if (index < 2) return true;

  return projectUpdates.featuredKeywords.some(
    keyword => titleLower.includes(keyword) || descLower.includes(keyword)
  );
}

// Helper function to determine project status
function determineStatus(title, description, date) {
  const titleLower = title.toLowerCase();
  const descLower = (description || '').toLowerCase();
  const fullText = titleLower + ' ' + descLower;

  // Check for status indicators in text
  for (const [status, keywords] of Object.entries(projectUpdates.statusRules)) {
    if (keywords.some(keyword => fullText.includes(keyword))) {
      return status;
    }
  }

  // Default to completed for older projects
  return 'completed';
}

// Helper function to generate end date
function generateEndDate(startDate, status, title) {
  if (status !== 'completed') return null;

  const start = new Date(startDate);

  // Estimate project duration based on type
  const titleLower = title.toLowerCase();
  let durationMonths = 3; // Default 3 months

  if (titleLower.includes('website') || titleLower.includes('app')) {
    durationMonths = 6; // Larger projects
  } else if (titleLower.includes('guide') || titleLower.includes('tutorial')) {
    durationMonths = 1; // Quick projects
  }

  const endDate = new Date(start);
  endDate.setMonth(endDate.getMonth() + durationMonths);

  return endDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

async function populateProjectData() {
  console.log('🚀 Starting project data population...');

  try {
    // Create management client
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN,
    });

    // Get space and environment
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT);

    // Get all project entries
    console.log('📄 Fetching project entries...');
    const entries = await environment.getEntries({
      content_type: 'project',
    });

    console.log(`📋 Found ${entries.items.length} project entries to update`);

    let featuredCount = 0;
    const maxFeatured = 3;

    // Process each entry
    for (const [index, entry] of entries.items.entries()) {
      console.log(
        `\n📝 Processing project ${index + 1}: ${entry.fields.title['en-US']}`
      );

      const title = entry.fields.title['en-US'];
      const slug = entry.fields.slug['en-US'];
      const description = entry.fields.description
        ? entry.fields.description['en-US']
        : '';
      const startDate = entry.fields.date
        ? entry.fields.date['en-US']
        : entry.sys.createdAt;

      // Generate new field values
      const repositoryUrl = generateRepositoryUrl(slug, title);
      const liveUrl = generateLiveUrl(slug, title);
      const featured =
        featuredCount < maxFeatured &&
        shouldBeFeatured(title, description, index, entries.items.length);
      const status = determineStatus(title, description, startDate);
      const endDate = generateEndDate(startDate, status, title);

      if (featured) featuredCount++;

      console.log(`  📂 Repository URL: ${repositoryUrl}`);
      console.log(`  🌐 Live URL: ${liveUrl || 'None'}`);
      console.log(`  ⭐ Featured: ${featured}`);
      console.log(`  📊 Status: ${status}`);
      console.log(`  📅 End Date: ${endDate || 'None'}`);

      // Update entry fields
      entry.fields.repositoryUrl = { 'en-US': repositoryUrl };
      if (liveUrl) {
        entry.fields.liveUrl = { 'en-US': liveUrl };
      }
      entry.fields.featured = { 'en-US': featured };
      entry.fields.status = { 'en-US': status };
      if (endDate) {
        entry.fields.endDate = { 'en-US': endDate };
      }

      // Save and publish the entry
      console.log(`  💾 Saving entry...`);
      const updatedEntry = await entry.update();
      await updatedEntry.publish();

      console.log(`  ✅ Entry updated and published successfully!`);
    }

    console.log('\n🎉 All project entries updated successfully!');
    console.log('📊 Summary:');
    console.log(`   - Entries processed: ${entries.items.length}`);
    console.log(`   - Featured projects: ${featuredCount}`);
    console.log(
      `   - Fields populated: repositoryUrl, liveUrl, featured, status, endDate`
    );
  } catch (error) {
    console.error('❌ Error during data population:', error);
    console.error('📝 Details:', error.message);
    process.exit(1);
  }
}

// Execute the script
if (require.main === module) {
  populateProjectData();
}

module.exports = { populateProjectData };
