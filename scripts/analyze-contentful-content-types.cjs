#!/usr/bin/env node

/**
 * Detailed analysis script for Contentful content types
 * This script will analyze each content type's structure including:
 * - Field definitions
 * - Field types and validations
 * - Relationships between content types
 * - Required vs optional fields
 * - Locale configurations
 */

const { createClient } = require('contentful');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function analyzeContentfulContentTypes() {
  console.log('🔍 Analyzing Contentful Content Types Structure...\n');

  try {
    // Create client
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    });

    // Get space information
    const space = await client.getSpace();
    console.log('🌌 Space Information:');
    console.log(`   Name: ${space.name}`);
    console.log(`   ID: ${space.sys.id}`);
    console.log(`   Default Locale: ${space.defaultLocale}`);
    console.log(
      `   Locales: ${space.locales ? space.locales.map(l => l.code).join(', ') : 'N/A'}`
    );
    console.log();

    // Get content types
    const contentTypes = await client.getContentTypes();
    console.log(`📋 Found ${contentTypes.items.length} content types:\n`);

    for (const contentType of contentTypes.items) {
      console.log(
        `📝 Content Type: ${contentType.name} (${contentType.sys.id})`
      );
      console.log(
        `   Description: ${contentType.description || 'No description'}`
      );
      console.log(`   Display Field: ${contentType.displayField || 'None'}`);
      console.log(`   Created: ${contentType.sys.createdAt}`);
      console.log(`   Updated: ${contentType.sys.updatedAt}`);
      console.log();

      // Analyze fields
      if (contentType.fields && contentType.fields.length > 0) {
        console.log('   📋 Fields:');

        for (const field of contentType.fields) {
          console.log(`     🔸 ${field.name} (${field.id})`);
          console.log(`        Type: ${field.type}`);
          console.log(`        Required: ${field.required ? 'Yes' : 'No'}`);
          console.log(`        Localized: ${field.localized ? 'Yes' : 'No'}`);
          console.log(`        Disabled: ${field.disabled ? 'Yes' : 'No'}`);
          console.log(`        Omitted: ${field.omitted ? 'Yes' : 'No'}`);

          // Link type details
          if (field.type === 'Link') {
            console.log(`        Link Type: ${field.linkType}`);
            if (field.validations) {
              const linkContentTypeValidation = field.validations.find(
                v => v.linkContentType
              );
              if (linkContentTypeValidation) {
                console.log(
                  `        Linked Content Types: ${linkContentTypeValidation.linkContentType.join(', ')}`
                );
              }
            }
          }

          // Array details
          if (field.type === 'Array') {
            console.log(
              `        Array Item Type: ${field.items ? field.items.type : 'Unknown'}`
            );
            if (field.items && field.items.type === 'Link') {
              console.log(
                `        Array Item Link Type: ${field.items.linkType}`
              );
              if (field.items.validations) {
                const linkContentTypeValidation = field.items.validations.find(
                  v => v.linkContentType
                );
                if (linkContentTypeValidation) {
                  console.log(
                    `        Array Item Linked Content Types: ${linkContentTypeValidation.linkContentType.join(', ')}`
                  );
                }
              }
            }
          }

          // Rich text details
          if (field.type === 'RichText') {
            console.log(
              `        Rich Text: Supports embedded entries and assets`
            );
          }

          // Validations
          if (field.validations && field.validations.length > 0) {
            console.log(`        Validations:`);
            for (const validation of field.validations) {
              if (validation.size) {
                console.log(
                  `          - Size: min=${validation.size.min || 'N/A'}, max=${validation.size.max || 'N/A'}`
                );
              }
              if (validation.in) {
                console.log(`          - In: ${validation.in.join(', ')}`);
              }
              if (validation.regexp) {
                console.log(`          - Regexp: ${validation.regexp.pattern}`);
              }
              if (validation.unique) {
                console.log(`          - Unique: ${validation.unique}`);
              }
              if (validation.range) {
                console.log(
                  `          - Range: min=${validation.range.min || 'N/A'}, max=${validation.range.max || 'N/A'}`
                );
              }
              if (validation.dateRange) {
                console.log(
                  `          - Date Range: min=${validation.dateRange.min || 'N/A'}, max=${validation.dateRange.max || 'N/A'}`
                );
              }
              if (validation.assetImageDimensions) {
                console.log(
                  `          - Image Dimensions: ${JSON.stringify(validation.assetImageDimensions)}`
                );
              }
              if (validation.assetFileSize) {
                console.log(
                  `          - File Size: ${JSON.stringify(validation.assetFileSize)}`
                );
              }
              if (validation.linkMimetypeGroup) {
                console.log(
                  `          - Link Mimetype Group: ${validation.linkMimetypeGroup.join(', ')}`
                );
              }
            }
          }

          console.log();
        }
      } else {
        console.log('   📋 No fields defined');
      }

      console.log('   ' + '─'.repeat(80));
      console.log();
    }

    // Analyze relationships between content types
    console.log('🔗 Content Type Relationships:');
    const relationships = new Map();

    for (const contentType of contentTypes.items) {
      if (contentType.fields) {
        for (const field of contentType.fields) {
          if (field.type === 'Link' && field.validations) {
            const linkContentTypeValidation = field.validations.find(
              v => v.linkContentType
            );
            if (linkContentTypeValidation) {
              for (const linkedType of linkContentTypeValidation.linkContentType) {
                if (!relationships.has(contentType.sys.id)) {
                  relationships.set(contentType.sys.id, []);
                }
                relationships.get(contentType.sys.id).push({
                  field: field.id,
                  fieldName: field.name,
                  linkedType: linkedType,
                  multiple: false,
                });
              }
            }
          }

          if (
            field.type === 'Array' &&
            field.items &&
            field.items.type === 'Link' &&
            field.items.validations
          ) {
            const linkContentTypeValidation = field.items.validations.find(
              v => v.linkContentType
            );
            if (linkContentTypeValidation) {
              for (const linkedType of linkContentTypeValidation.linkContentType) {
                if (!relationships.has(contentType.sys.id)) {
                  relationships.set(contentType.sys.id, []);
                }
                relationships.get(contentType.sys.id).push({
                  field: field.id,
                  fieldName: field.name,
                  linkedType: linkedType,
                  multiple: true,
                });
              }
            }
          }
        }
      }
    }

    for (const [contentTypeId, links] of relationships) {
      const contentType = contentTypes.items.find(
        ct => ct.sys.id === contentTypeId
      );
      console.log(`   ${contentType.name} (${contentTypeId}):`);
      for (const link of links) {
        console.log(
          `     → ${link.fieldName} (${link.field}): ${link.multiple ? 'Multiple' : 'Single'} ${link.linkedType}`
        );
      }
      console.log();
    }

    console.log('🎉 Content type analysis completed!');
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run analysis
analyzeContentfulContentTypes();
