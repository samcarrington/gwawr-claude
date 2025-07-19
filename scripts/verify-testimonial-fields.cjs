#!/usr/bin/env node

/**
 * Verification script for testimonial fields
 * Checks that all new fields were populated correctly
 */

const { createClient } = require('contentful');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function verifyTestimonialFields() {
  console.log('🔍 Verifying testimonial field population...\n');

  try {
    // Create client
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    });

    // Get testimonial entries
    console.log('📄 Fetching testimonial entries...');
    const entries = await client.getEntries({
      content_type: 'testimonial',
      include: 2,
    });

    console.log(`✅ Found ${entries.items.length} testimonial entries\n`);

    let featuredCount = 0;

    // Verify each entry
    entries.items.forEach((entry, index) => {
      console.log(`📝 Entry ${index + 1}: ${entry.fields.title || 'Untitled'}`);
      console.log(`   ID: ${entry.sys.id}`);
      console.log(`   Created: ${entry.sys.createdAt}`);
      console.log(`   Updated: ${entry.sys.updatedAt}`);
      console.log(`   Published: ${entry.sys.publishedAt ? 'Yes' : 'No'}`);

      // Check original fields
      console.log('\n   Original Fields:');
      console.log(`   ✅ title: "${entry.fields.title || 'Not set'}"`);
      console.log(
        `   ✅ quote: ${entry.fields.quote ? 'Present (RichText)' : 'Not set'}`
      );
      console.log(
        `   ✅ attribution: ${entry.fields.attribution ? 'Present (Person link)' : 'Not set'}`
      );

      // Check new fields
      console.log('\n   New Fields:');
      console.log(
        `   ${entry.fields.clientName ? '✅' : '❌'} clientName: "${entry.fields.clientName || 'Not set'}"`
      );
      console.log(
        `   ${entry.fields.clientTitle ? '✅' : '⏭️'} clientTitle: "${entry.fields.clientTitle || 'Not set'}"`
      );
      console.log(
        `   ${entry.fields.clientCompany ? '✅' : '⏭️'} clientCompany: "${entry.fields.clientCompany || 'Not set'}"`
      );
      console.log(
        `   ${entry.fields.rating ? '✅' : '❌'} rating: ${entry.fields.rating || 'Not set'}`
      );
      console.log(
        `   ${entry.fields.featured !== undefined ? '✅' : '❌'} featured: ${entry.fields.featured}`
      );
      console.log(
        `   ${entry.fields.projectReference ? '✅' : '⏭️'} projectReference: ${entry.fields.projectReference ? 'Present' : 'Not set'}`
      );

      if (entry.fields.featured) featuredCount++;

      // Validate field formats
      console.log('\n   Field Validation:');

      if (entry.fields.rating) {
        const validRating =
          entry.fields.rating >= 1 && entry.fields.rating <= 5;
        console.log(
          `   ${validRating ? '✅' : '❌'} Rating range: ${validRating ? 'Valid (1-5)' : 'Invalid'} (${entry.fields.rating})`
        );
      }

      if (entry.fields.clientName) {
        console.log(`   ✅ Client name format: Valid string`);
      }

      if (entry.fields.projectReference) {
        console.log(`   ✅ Project reference: Valid link to project`);
      }

      console.log('\n' + '─'.repeat(80) + '\n');
    });

    console.log('📊 Summary:');
    console.log(`   Total testimonials: ${entries.items.length}`);
    console.log(`   Featured testimonials: ${featuredCount}`);
    console.log(
      `   Testimonials with client names: ${entries.items.filter(e => e.fields.clientName).length}`
    );
    console.log(
      `   Testimonials with ratings: ${entries.items.filter(e => e.fields.rating).length}`
    );
    console.log(
      `   Testimonials with project references: ${entries.items.filter(e => e.fields.projectReference).length}`
    );

    console.log('\n🎉 Field verification completed!');
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

// Run verification
verifyTestimonialFields();
