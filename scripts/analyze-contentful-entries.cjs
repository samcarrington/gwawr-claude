#!/usr/bin/env node

/**
 * Analyze sample entries for each content type to understand actual data structure
 */

const { createClient } = require('contentful');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function analyzeSampleEntries() {
  console.log('📊 Analyzing Sample Entries for Each Content Type...\n');

  try {
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    });

    // Get content types
    const contentTypes = await client.getContentTypes();

    for (const contentType of contentTypes.items) {
      console.log(
        `📝 Sample entries for: ${contentType.name} (${contentType.sys.id})`
      );

      try {
        // Get entries for this content type
        const entries = await client.getEntries({
          content_type: contentType.sys.id,
          limit: 3,
          include: 2, // Include linked entries
        });

        if (entries.items.length === 0) {
          console.log('   ❌ No entries found for this content type');
        } else {
          console.log(
            `   📊 Found ${entries.total} total entries (showing first ${entries.items.length}):`
          );

          entries.items.forEach((entry, index) => {
            console.log(`   \n   Entry ${index + 1}:`);
            console.log(`     ID: ${entry.sys.id}`);
            console.log(`     Created: ${entry.sys.createdAt}`);
            console.log(`     Updated: ${entry.sys.updatedAt}`);
            console.log(`     Fields:`);

            // Display each field and its value
            for (const [fieldId, fieldValue] of Object.entries(entry.fields)) {
              const fieldDef = contentType.fields.find(f => f.id === fieldId);
              const fieldName = fieldDef ? fieldDef.name : fieldId;

              if (fieldValue === null || fieldValue === undefined) {
                console.log(`       ${fieldName} (${fieldId}): null`);
              } else if (typeof fieldValue === 'string') {
                const preview =
                  fieldValue.length > 50
                    ? fieldValue.substring(0, 50) + '...'
                    : fieldValue;
                console.log(`       ${fieldName} (${fieldId}): "${preview}"`);
              } else if (typeof fieldValue === 'object' && fieldValue.sys) {
                // This is a link to another entry or asset
                if (fieldValue.sys.type === 'Link') {
                  console.log(
                    `       ${fieldName} (${fieldId}): Link to ${fieldValue.sys.linkType} (${fieldValue.sys.id})`
                  );
                } else if (fieldValue.sys.type === 'Entry') {
                  console.log(
                    `       ${fieldName} (${fieldId}): Entry ${fieldValue.sys.contentType.sys.id} - "${fieldValue.fields.title || fieldValue.fields.name || 'No title'}"`
                  );
                } else if (fieldValue.sys.type === 'Asset') {
                  console.log(
                    `       ${fieldName} (${fieldId}): Asset "${fieldValue.fields.title}" (${fieldValue.fields.file.url})`
                  );
                }
              } else if (Array.isArray(fieldValue)) {
                console.log(
                  `       ${fieldName} (${fieldId}): Array with ${fieldValue.length} items:`
                );
                fieldValue.forEach((item, i) => {
                  if (typeof item === 'string') {
                    console.log(`         [${i}]: "${item}"`);
                  } else if (item && item.sys) {
                    if (item.sys.type === 'Entry') {
                      console.log(
                        `         [${i}]: Entry ${item.sys.contentType.sys.id} - "${item.fields.title || item.fields.name || 'No title'}"`
                      );
                    } else if (item.sys.type === 'Asset') {
                      console.log(
                        `         [${i}]: Asset "${item.fields.title || 'No title'}"`
                      );
                    }
                  } else {
                    console.log(`         [${i}]: ${JSON.stringify(item)}`);
                  }
                });
              } else if (
                typeof fieldValue === 'object' &&
                fieldValue.nodeType
              ) {
                // This is a rich text document
                console.log(
                  `       ${fieldName} (${fieldId}): Rich Text Document`
                );
                console.log(`         Node Type: ${fieldValue.nodeType}`);
                if (fieldValue.content && fieldValue.content.length > 0) {
                  console.log(
                    `         Content: ${fieldValue.content.length} nodes`
                  );
                  // Try to extract some text content
                  const textContent = extractTextFromRichText(fieldValue);
                  if (textContent) {
                    const preview =
                      textContent.length > 100
                        ? textContent.substring(0, 100) + '...'
                        : textContent;
                    console.log(`         Preview: "${preview}"`);
                  }
                }
              } else {
                console.log(
                  `       ${fieldName} (${fieldId}): ${JSON.stringify(fieldValue)}`
                );
              }
            }
          });
        }
      } catch (error) {
        console.log(`   ❌ Error fetching entries: ${error.message}`);
      }

      console.log('   ' + '─'.repeat(80));
      console.log();
    }

    console.log('🎉 Sample entry analysis completed!');
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Helper function to extract text from rich text content
function extractTextFromRichText(richTextDocument) {
  if (!richTextDocument || !richTextDocument.content) return '';

  let text = '';

  function extractFromNode(node) {
    if (node.nodeType === 'text') {
      text += node.value;
    } else if (node.content) {
      node.content.forEach(extractFromNode);
    }
  }

  richTextDocument.content.forEach(extractFromNode);
  return text.trim();
}

// Run analysis
analyzeSampleEntries();
