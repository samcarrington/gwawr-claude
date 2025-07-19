/**
 * Contentful Migration - Phase 2: Comprehensive Data Population
 *
 * This script populates all new fields added in Phase 1 across all content types:
 * - blogPost: Generate slugs, categories, tags, publish dates, read times, featured flags
 * - project: Add URLs, featured flags, end dates, status
 * - testimonial: Extract client info, set ratings, featured flags, project references
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

// Import individual population functions
const { populateBlogPostData } = require('./populate-blogpost-data');
const { populateProjectData } = require('./populate-project-data');
const { populateTestimonialData } = require('./populate-testimonial-data');

class DataPopulationOrchestrator {
  constructor() {
    this.client = null;
    this.space = null;
    this.environment = null;
    this.results = {
      blogPost: { processed: 0, errors: 0 },
      project: { processed: 0, errors: 0 },
      testimonial: { processed: 0, errors: 0 },
    };
  }

  async initialize() {
    console.log('🔗 Initializing Contentful connection...');

    this.client = createClient({
      accessToken: MANAGEMENT_TOKEN,
    });

    this.space = await this.client.getSpace(SPACE_ID);
    this.environment = await this.space.getEnvironment(ENVIRONMENT);

    console.log(`✅ Connected to space: ${this.space.name} (${SPACE_ID})`);
    console.log(`🌍 Environment: ${ENVIRONMENT}`);
  }

  async populateBlogPosts() {
    console.log('\n📝 Populating blogPost data...');

    try {
      const entries = await this.environment.getEntries({
        content_type: 'blogPost',
      });

      console.log(`📋 Found ${entries.items.length} blogPost entries`);

      for (const [index, entry] of entries.items.entries()) {
        try {
          const title = entry.fields.title['en-US'];
          console.log(`   Processing: ${title}`);

          // Generate slug from title
          const slug = this.generateSlug(title);

          // Determine category
          const category = this.determineBlogCategory(
            title,
            entry.fields.content?.['en-US']
          );

          // Generate tags
          const tags = this.generateBlogTags(
            title,
            entry.fields.content?.['en-US'],
            category
          );

          // Calculate read time
          const readTime = this.calculateReadingTime(
            entry.fields.content?.['en-US']
          );

          // Set publish date
          const publishedAt = entry.sys.createdAt;

          // Set featured (first entry)
          const featured = index === 0;

          // Update fields if they don't exist
          if (!entry.fields.slug) {
            entry.fields.slug = { 'en-US': slug };
          }
          if (!entry.fields.category) {
            entry.fields.category = { 'en-US': category };
          }
          if (!entry.fields.tags) {
            entry.fields.tags = { 'en-US': tags };
          }
          if (!entry.fields.readTime) {
            entry.fields.readTime = { 'en-US': readTime };
          }
          if (!entry.fields.publishedAt) {
            entry.fields.publishedAt = { 'en-US': publishedAt };
          }
          if (entry.fields.featured === undefined) {
            entry.fields.featured = { 'en-US': featured };
          }

          const updatedEntry = await entry.update();
          await updatedEntry.publish();

          this.results.blogPost.processed++;
        } catch (error) {
          console.error(`   ❌ Error processing blog post: ${error.message}`);
          this.results.blogPost.errors++;
        }
      }

      console.log(
        `✅ BlogPost population completed: ${this.results.blogPost.processed} processed, ${this.results.blogPost.errors} errors`
      );
    } catch (error) {
      console.error(`❌ BlogPost population failed: ${error.message}`);
      throw error;
    }
  }

  async populateProjects() {
    console.log('\n🚀 Populating project data...');

    try {
      const entries = await this.environment.getEntries({
        content_type: 'project',
      });

      console.log(`📋 Found ${entries.items.length} project entries`);
      let featuredCount = 0;
      const maxFeatured = 3;

      for (const [index, entry] of entries.items.entries()) {
        try {
          const title = entry.fields.title['en-US'];
          const slug = entry.fields.slug['en-US'];
          console.log(`   Processing: ${title}`);

          // Generate repository URL
          const repositoryUrl = `https://github.com/samcarrington/${slug.replace(/[^a-z0-9-]/g, '-')}`;

          // Generate live URL for applicable projects
          let liveUrl = null;
          if (
            title.toLowerCase().includes('website') ||
            title.toLowerCase().includes('app') ||
            title.toLowerCase().includes('guide')
          ) {
            liveUrl = `https://${slug}.samcarrington.dev`;
          }

          // Determine featured status
          const featured =
            featuredCount < maxFeatured &&
            (index < 2 || title.toLowerCase().includes('premier'));
          if (featured) featuredCount++;

          // Set status
          const status = 'completed';

          // Generate end date
          let endDate = null;
          if (entry.fields.date?.['en-US']) {
            const startDate = new Date(entry.fields.date['en-US']);
            const endDateCalc = new Date(startDate);
            endDateCalc.setMonth(endDateCalc.getMonth() + 3); // 3 months duration
            endDate = endDateCalc.toISOString().split('T')[0];
          }

          // Update fields if they don't exist
          if (!entry.fields.repositoryUrl) {
            entry.fields.repositoryUrl = { 'en-US': repositoryUrl };
          }
          if (liveUrl && !entry.fields.liveUrl) {
            entry.fields.liveUrl = { 'en-US': liveUrl };
          }
          if (entry.fields.featured === undefined) {
            entry.fields.featured = { 'en-US': featured };
          }
          if (!entry.fields.status) {
            entry.fields.status = { 'en-US': status };
          }
          if (endDate && !entry.fields.endDate) {
            entry.fields.endDate = { 'en-US': endDate };
          }

          const updatedEntry = await entry.update();
          await updatedEntry.publish();

          this.results.project.processed++;
        } catch (error) {
          console.error(`   ❌ Error processing project: ${error.message}`);
          this.results.project.errors++;
        }
      }

      console.log(
        `✅ Project population completed: ${this.results.project.processed} processed, ${this.results.project.errors} errors`
      );
    } catch (error) {
      console.error(`❌ Project population failed: ${error.message}`);
      throw error;
    }
  }

  async populateTestimonials() {
    console.log('\n💬 Populating testimonial data...');

    try {
      const entries = await this.environment.getEntries({
        content_type: 'testimonial',
        include: 2,
      });

      console.log(`📋 Found ${entries.items.length} testimonial entries`);

      for (const [index, entry] of entries.items.entries()) {
        try {
          const title = entry.fields.title?.['en-US'] || 'Untitled';
          console.log(`   Processing: ${title}`);

          // Extract person data from attribution
          let clientName = '';
          let clientTitle = '';
          let clientCompany = '';

          if (entry.fields.attribution?.['en-US']) {
            const attributionId = entry.fields.attribution['en-US'].sys.id;
            try {
              const person = await this.environment.getEntry(attributionId);
              clientName = person.fields.name?.['en-US'] || '';
              clientTitle = person.fields.jobTitle?.['en-US'] || '';
              clientCompany = person.fields.company?.['en-US'] || '';
            } catch (error) {
              console.warn(
                `   ⚠️  Could not fetch person data: ${error.message}`
              );
            }
          }

          // Set default values
          const rating = 5;
          const featured = index === 0;

          // Update fields if they don't exist
          if (clientName && !entry.fields.clientName) {
            entry.fields.clientName = { 'en-US': clientName };
          }
          if (clientTitle && !entry.fields.clientTitle) {
            entry.fields.clientTitle = { 'en-US': clientTitle };
          }
          if (clientCompany && !entry.fields.clientCompany) {
            entry.fields.clientCompany = { 'en-US': clientCompany };
          }
          if (!entry.fields.rating) {
            entry.fields.rating = { 'en-US': rating };
          }
          if (entry.fields.featured === undefined) {
            entry.fields.featured = { 'en-US': featured };
          }

          const updatedEntry = await entry.update();
          await updatedEntry.publish();

          this.results.testimonial.processed++;
        } catch (error) {
          console.error(`   ❌ Error processing testimonial: ${error.message}`);
          this.results.testimonial.errors++;
        }
      }

      console.log(
        `✅ Testimonial population completed: ${this.results.testimonial.processed} processed, ${this.results.testimonial.errors} errors`
      );
    } catch (error) {
      console.error(`❌ Testimonial population failed: ${error.message}`);
      throw error;
    }
  }

  // Helper methods
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  determineBlogCategory(title, content) {
    const text = (
      title +
      ' ' +
      this.extractTextFromRichText(content)
    ).toLowerCase();

    const categoryMap = {
      JavaScript: ['javascript', 'js', 'node'],
      'Web Development': ['web', 'html', 'css', 'frontend', 'backend'],
      DevOps: ['docker', 'deployment', 'devops'],
      Backend: ['api', 'server', 'backend'],
      'Vue.js': ['vue', 'nuxt'],
      Technology: ['tech', 'software', 'programming'],
    };

    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }

    return 'General';
  }

  generateBlogTags(title, content, category) {
    const text = (
      title +
      ' ' +
      this.extractTextFromRichText(content)
    ).toLowerCase();
    const tags = [category.toLowerCase().replace(/\s+/g, '-')];

    const potentialTags = [
      'javascript',
      'vue',
      'css',
      'api',
      'architecture',
      'development',
    ];

    for (const tag of potentialTags) {
      if (text.includes(tag) && !tags.includes(tag)) {
        tags.push(tag);
      }
    }

    return tags.slice(0, 10);
  }

  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const text = this.extractTextFromRichText(content);
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  extractTextFromRichText(richText) {
    if (!richText || !richText.content) return '';

    let text = '';
    const extractFromNodes = nodes => {
      if (Array.isArray(nodes)) {
        for (const node of nodes) {
          if (node.nodeType === 'text') {
            text += node.value + ' ';
          } else if (node.content) {
            extractFromNodes(node.content);
          }
        }
      }
    };

    extractFromNodes(richText.content);
    return text.trim();
  }

  printSummary() {
    const startTime = this.startTime;
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '=' * 70);
    console.log('🎉 Phase 2 Data Population Completed!');
    console.log('📊 Summary:');

    let totalProcessed = 0;
    let totalErrors = 0;

    for (const [contentType, result] of Object.entries(this.results)) {
      console.log(
        `   ${contentType}: ${result.processed} processed, ${result.errors} errors`
      );
      totalProcessed += result.processed;
      totalErrors += result.errors;
    }

    console.log(`\n📈 Total entries processed: ${totalProcessed}`);
    console.log(`❌ Total errors: ${totalErrors}`);
    console.log(`⏱️  Duration: ${duration} seconds`);

    if (totalErrors > 0) {
      console.log('\n⚠️  Some errors occurred. Check logs above for details.');
    }

    console.log('\n🔄 Next Steps:');
    console.log('   1. Verify data population with verification scripts');
    console.log('   2. Run Phase 3: Field Requirements Update');
    console.log('   3. Run Phase 4: Application Integration');
  }

  async run() {
    console.log('🚀 Starting Phase 2: Comprehensive Data Population');
    console.log('=' * 70);

    this.startTime = Date.now();

    try {
      await this.initialize();

      await this.populateBlogPosts();
      await this.populateProjects();
      await this.populateTestimonials();

      this.printSummary();
    } catch (error) {
      console.error('\n❌ Data population failed:', error.message);
      console.error('📝 Details:', error);

      console.log('\n🔄 Rollback suggestions:');
      console.log('   1. Check which entries were partially updated');
      console.log('   2. Manually revert field values if needed');
      console.log('   3. Re-run population for specific content types');

      process.exit(1);
    }
  }
}

// Execute the script
async function runComprehensiveDataPopulation() {
  const orchestrator = new DataPopulationOrchestrator();
  await orchestrator.run();
}

if (require.main === module) {
  runComprehensiveDataPopulation();
}

module.exports = { runComprehensiveDataPopulation, DataPopulationOrchestrator };
