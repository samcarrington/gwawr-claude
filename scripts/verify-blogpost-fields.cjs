#!/usr/bin/env node

/**
 * Verification script for blogPost fields
 * Checks that all new fields were populated correctly
 */

const { createClient } = require('contentful');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function verifyBlogPostFields() {
  console.log('🔍 Verifying blogPost field population...\n');

  try {
    // Create client
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    });

    // Get blogPost entries
    console.log('📄 Fetching blogPost entries...');
    const entries = await client.getEntries({
      content_type: 'blogPost',
      include: 2,
    });

    console.log(`✅ Found ${entries.items.length} blogPost entries\n`);

    // Verify each entry
    entries.items.forEach((entry, index) => {
      console.log(`📝 Entry ${index + 1}: ${entry.fields.title}`);
      console.log(`   ID: ${entry.sys.id}`);
      console.log(`   Created: ${entry.sys.createdAt}`);
      console.log(`   Updated: ${entry.sys.updatedAt}`);
      console.log(`   Published: ${entry.sys.publishedAt ? 'Yes' : 'No'}`);

      // Check original fields
      console.log('\n   Original Fields:');
      console.log(`   ✅ title: "${entry.fields.title}"`);
      console.log(
        `   ✅ content: ${entry.fields.content ? 'Present (RichText)' : 'Missing'}`
      );
      console.log(`   ✅ excerpt: "${entry.fields.excerpt || 'Not set'}"`);
      console.log(
        `   ✅ thumbnail: ${entry.fields.thumbnail ? 'Present (Asset)' : 'Not set'}`
      );
      console.log(
        `   ✅ author: ${entry.fields.author ? entry.fields.author.fields.name : 'Not set'}`
      );

      // Check new fields
      console.log('\n   New Fields:');
      console.log(
        `   ${entry.fields.slug ? '✅' : '❌'} slug: "${entry.fields.slug || 'Not set'}"`
      );
      console.log(
        `   ${entry.fields.category ? '✅' : '❌'} category: "${entry.fields.category || 'Not set'}"`
      );
      console.log(
        `   ${entry.fields.tags ? '✅' : '❌'} tags: [${entry.fields.tags ? entry.fields.tags.join(', ') : 'Not set'}]`
      );
      console.log(
        `   ${entry.fields.publishedAt ? '✅' : '❌'} publishedAt: "${entry.fields.publishedAt || 'Not set'}"`
      );
      console.log(
        `   ${entry.fields.readTime ? '✅' : '❌'} readTime: ${entry.fields.readTime || 'Not set'} minutes`
      );
      console.log(
        `   ${entry.fields.featured !== undefined ? '✅' : '❌'} featured: ${entry.fields.featured}`
      );

      // Validate field formats
      console.log('\n   Field Validation:');
      if (entry.fields.slug) {
        const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        console.log(
          `   ${slugPattern.test(entry.fields.slug) ? '✅' : '❌'} Slug format: ${slugPattern.test(entry.fields.slug) ? 'Valid' : 'Invalid'}`
        );
      }

      if (entry.fields.category) {
        const validCategories = [
          'Technology',
          'Web Development',
          'JavaScript',
          'Vue.js',
          'CSS',
          'DevOps',
          'Backend',
          'Frontend',
          'General',
        ];
        console.log(
          `   ${validCategories.includes(entry.fields.category) ? '✅' : '❌'} Category validation: ${validCategories.includes(entry.fields.category) ? 'Valid' : 'Invalid'}`
        );
      }

      if (entry.fields.readTime) {
        const validReadTime =
          entry.fields.readTime >= 1 && entry.fields.readTime <= 60;
        console.log(
          `   ${validReadTime ? '✅' : '❌'} Read time range: ${validReadTime ? 'Valid (1-60)' : 'Invalid'}`
        );
      }

      if (entry.fields.tags) {
        const validTagCount =
          entry.fields.tags.length >= 0 && entry.fields.tags.length <= 10;
        console.log(
          `   ${validTagCount ? '✅' : '❌'} Tag count: ${validTagCount ? 'Valid (0-10)' : 'Invalid'} (${entry.fields.tags.length} tags)`
        );
      }

      console.log('\n' + '─'.repeat(80) + '\n');
    });

    console.log('🎉 Field verification completed!');
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

// Run verification
verifyBlogPostFields();
