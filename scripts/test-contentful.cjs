#!/usr/bin/env node

/**
 * Test script for Contentful integration
 * Run with: node scripts/test-contentful.js
 */

const { createClient } = require('contentful');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testContentfulIntegration() {
  console.log('🧪 Testing Contentful Integration...\n');

  try {
    // Create client
    console.log('📡 Creating Contentful client...');
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    });
    console.log('✅ Client created successfully\n');

    // Test 1: Health check (get space)
    console.log('🏥 Testing connection...');
    const space = await client.getSpace();
    console.log('✅ Connection successful\n');

    // Test 2: Display space information
    console.log('🌌 Space information:');
    console.log('✅ Space info:', {
      name: space.name,
      id: space.sys.id,
      defaultLocale: space.defaultLocale,
    });
    console.log();

    // Test 3: Get content types
    console.log('📋 Getting content types...');
    const contentTypes = await client.getContentTypes();
    console.log('✅ Found content types:');
    contentTypes.items.forEach(type => {
      console.log(`  - ${type.name} (${type.sys.id})`);
    });
    console.log();

    // Test 4: Get entries (any type)
    console.log('📄 Getting entries...');
    const entries = await client.getEntries({ limit: 5 });
    console.log(
      `✅ Found ${entries.total} total entries (showing first ${entries.items.length}):`
    );
    entries.items.forEach(entry => {
      console.log(
        `  - ${entry.fields.title || entry.fields.name || 'Untitled'} (${entry.sys.contentType.sys.id})`
      );
    });
    console.log();

    // Test 5: Try to get blog posts specifically
    console.log('📝 Testing blog posts...');
    try {
      const blogPosts = await client.getEntriesByType('blogPost', { limit: 3 });
      console.log(
        `✅ Found ${blogPosts.total} blog posts (showing first ${blogPosts.items.length}):`
      );
      blogPosts.items.forEach(post => {
        console.log(`  - ${post.fields.title} (${post.fields.slug})`);
      });
    } catch (error) {
      console.log(
        'ℹ️  Blog post content type may not exist yet:',
        error.message
      );
    }
    console.log();

    console.log('🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);

    if (error.message.includes('Missing required Contentful configuration')) {
      console.log('\n💡 Make sure your .env file contains:');
      console.log('   CONTENTFUL_SPACE_ID=your_space_id');
      console.log('   CONTENTFUL_ACCESS_TOKEN=your_access_token');
    }

    process.exit(1);
  }
}

// Run tests
testContentfulIntegration();
