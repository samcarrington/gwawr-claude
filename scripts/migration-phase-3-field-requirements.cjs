/**
 * Contentful Migration - Phase 3: Field Requirements Update
 *
 * This script makes critical fields required after data population is complete.
 * Only fields that should be required are updated to maintain data integrity.
 *
 * Critical Fields to Make Required:
 * - blogPost: slug (unique identifier for URLs)
 * - project: repositoryUrl (essential for showcase)
 * - testimonial: rating (essential for testimonial value)
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

// Define which fields should become required
const REQUIRED_FIELD_UPDATES = {
  blogPost: [
    {
      fieldId: 'slug',
      reason: 'Unique identifier for URLs, essential for SEO and routing',
    },
  ],
  project: [
    {
      fieldId: 'repositoryUrl',
      reason: 'Essential for showcasing code, primary value for portfolio',
    },
  ],
  testimonial: [
    {
      fieldId: 'rating',
      reason: 'Essential for testimonial value and display ranking',
    },
  ],
};

class FieldRequirementsUpdater {
  constructor() {
    this.client = null;
    this.space = null;
    this.environment = null;
    this.results = {};
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

  async validateDataIntegrity(contentTypeName, fieldId) {
    console.log(
      `   🔍 Validating data integrity for ${contentTypeName}.${fieldId}...`
    );

    try {
      // Check if all entries have values for the field
      const entries = await this.environment.getEntries({
        content_type: contentTypeName,
        limit: 1000,
      });

      const entriesWithoutField = entries.items.filter(entry => {
        const fieldValue = entry.fields[fieldId];
        return (
          !fieldValue ||
          !fieldValue['en-US'] ||
          (typeof fieldValue['en-US'] === 'string' &&
            fieldValue['en-US'].trim() === '')
        );
      });

      if (entriesWithoutField.length > 0) {
        console.log(
          `   ⚠️  Found ${entriesWithoutField.length} entries without ${fieldId}:`
        );
        entriesWithoutField.forEach(entry => {
          const title = entry.fields.title?.['en-US'] || entry.sys.id;
          console.log(`      - ${title} (${entry.sys.id})`);
        });
        return false;
      }

      console.log(
        `   ✅ All ${entries.items.length} entries have valid ${fieldId} values`
      );
      return true;
    } catch (error) {
      console.error(`   ❌ Error validating data: ${error.message}`);
      return false;
    }
  }

  async updateFieldRequirement(contentTypeName, fieldId, reason) {
    console.log(`\n📝 Updating ${contentTypeName}.${fieldId} to required...`);
    console.log(`   📋 Reason: ${reason}`);

    try {
      // Validate data integrity first
      const isDataValid = await this.validateDataIntegrity(
        contentTypeName,
        fieldId
      );
      if (!isDataValid) {
        console.log(`   ❌ Skipping ${fieldId} - data validation failed`);
        return { success: false, reason: 'Data validation failed' };
      }

      // Get the content type
      const contentType =
        await this.environment.getContentType(contentTypeName);

      // Find the field
      const fieldIndex = contentType.fields.findIndex(
        field => field.id === fieldId
      );
      if (fieldIndex === -1) {
        console.log(`   ❌ Field ${fieldId} not found in ${contentTypeName}`);
        return { success: false, reason: 'Field not found' };
      }

      // Check if already required
      if (contentType.fields[fieldIndex].required) {
        console.log(`   ⏭️  Field ${fieldId} is already required`);
        return { success: true, reason: 'Already required' };
      }

      // Update the field to required
      contentType.fields[fieldIndex].required = true;

      // Save and publish
      console.log(
        `   💾 Saving ${contentTypeName} with updated field requirement...`
      );
      const updatedContentType = await contentType.update();

      console.log(`   📤 Publishing ${contentTypeName}...`);
      await updatedContentType.publish();

      console.log(
        `   ✅ Successfully made ${fieldId} required in ${contentTypeName}`
      );
      return { success: true, reason: 'Updated successfully' };
    } catch (error) {
      console.error(`   ❌ Error updating ${fieldId}: ${error.message}`);
      return { success: false, reason: error.message };
    }
  }

  async processContentType(contentTypeName, fieldsToUpdate) {
    console.log(`\n🔧 Processing ${contentTypeName} content type...`);

    const contentTypeResults = {
      processed: 0,
      successful: 0,
      failed: 0,
      details: [],
    };

    for (const fieldUpdate of fieldsToUpdate) {
      const result = await this.updateFieldRequirement(
        contentTypeName,
        fieldUpdate.fieldId,
        fieldUpdate.reason
      );

      contentTypeResults.processed++;
      contentTypeResults.details.push({
        fieldId: fieldUpdate.fieldId,
        ...result,
      });

      if (result.success) {
        contentTypeResults.successful++;
      } else {
        contentTypeResults.failed++;
      }
    }

    this.results[contentTypeName] = contentTypeResults;
    return contentTypeResults;
  }

  printSummary() {
    const startTime = this.startTime;
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Phase 3 Field Requirements Update Completed!');
    console.log('📊 Summary:');

    let totalProcessed = 0;
    let totalSuccessful = 0;
    let totalFailed = 0;

    for (const [contentType, result] of Object.entries(this.results)) {
      console.log(`\n📋 ${contentType}:`);
      console.log(`   Processed: ${result.processed} fields`);
      console.log(`   Successful: ${result.successful} fields`);
      console.log(`   Failed: ${result.failed} fields`);

      // Show details
      for (const detail of result.details) {
        const status = detail.success ? '✅' : '❌';
        console.log(`   ${status} ${detail.fieldId}: ${detail.reason}`);
      }

      totalProcessed += result.processed;
      totalSuccessful += result.successful;
      totalFailed += result.failed;
    }

    console.log(`\n📈 Total fields processed: ${totalProcessed}`);
    console.log(`✅ Total successful: ${totalSuccessful}`);
    console.log(`❌ Total failed: ${totalFailed}`);
    console.log(`⏱️  Duration: ${duration} seconds`);

    if (totalFailed > 0) {
      console.log('\n⚠️  Some fields could not be made required.');
      console.log(
        '   This usually means entries exist without values for these fields.'
      );
      console.log(
        '   Run Phase 2 data population again or manually fix the entries.'
      );
    }

    console.log('\n🔄 Next Steps:');
    console.log('   1. Verify field requirements in Contentful web interface');
    console.log('   2. Test content entry creation with new requirements');
    console.log('   3. Run Phase 4: Application Integration');
    console.log('   4. Update frontend validation to match new requirements');
  }

  async run() {
    console.log('🚀 Starting Phase 3: Field Requirements Update');
    console.log('='.repeat(70));
    console.log('⚠️  WARNING: This will make certain fields required!');
    console.log('   Ensure Phase 2 data population completed successfully.');

    this.startTime = Date.now();

    try {
      await this.initialize();

      // Process each content type
      for (const [contentTypeName, fieldsToUpdate] of Object.entries(
        REQUIRED_FIELD_UPDATES
      )) {
        await this.processContentType(contentTypeName, fieldsToUpdate);
      }

      this.printSummary();
    } catch (error) {
      console.error('\n❌ Field requirements update failed:', error.message);
      console.error('📝 Details:', error);

      console.log('\n🔄 Recovery suggestions:');
      console.log('   1. Check which content types were partially updated');
      console.log('   2. Manually revert field requirements if needed');
      console.log('   3. Ensure all entries have valid data before retrying');

      process.exit(1);
    }
  }
}

// Execute the script
async function runFieldRequirementsUpdate() {
  const updater = new FieldRequirementsUpdater();
  await updater.run();
}

if (require.main === module) {
  runFieldRequirementsUpdate();
}

module.exports = { runFieldRequirementsUpdate, FieldRequirementsUpdater };
