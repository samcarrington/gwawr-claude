/**
 * Contentful Migration Script - Phase 1: blogPost Enhancement
 *
 * This script adds the missing fields to the blogPost content type:
 * - slug: URL-friendly identifier
 * - category: Blog post category
 * - tags: Array of tags for categorization
 * - publishedAt: Publication date
 * - readTime: Estimated reading time
 * - featured: Featured post flag
 *
 * All fields are added as optional initially to avoid breaking existing content.
 */

module.exports = function (migration) {
  console.log('🚀 Starting blogPost content type enhancement...');

  // Get the blogPost content type
  const blogPost = migration.editContentType('blogPost');

  // Add slug field
  console.log('📝 Adding slug field...');
  blogPost
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(false)
    .validations([
      { unique: true },
      { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } },
    ]);

  // Add category field
  console.log('📂 Adding category field...');
  blogPost
    .createField('category')
    .name('Category')
    .type('Symbol')
    .required(false)
    .validations([
      {
        in: [
          'Technology',
          'Web Development',
          'JavaScript',
          'Vue.js',
          'CSS',
          'DevOps',
          'Backend',
          'Frontend',
          'General',
        ],
      },
    ]);

  // Add tags field
  console.log('🏷️ Adding tags field...');
  blogPost
    .createField('tags')
    .name('Tags')
    .type('Array')
    .items({ type: 'Symbol' })
    .required(false)
    .validations([{ size: { min: 0, max: 10 } }]);

  // Add publishedAt field
  console.log('📅 Adding publishedAt field...');
  blogPost
    .createField('publishedAt')
    .name('Published At')
    .type('Date')
    .required(false);

  // Add readTime field
  console.log('⏱️ Adding readTime field...');
  blogPost
    .createField('readTime')
    .name('Read Time')
    .type('Integer')
    .required(false)
    .validations([{ range: { min: 1, max: 60 } }]);

  // Add featured field
  console.log('⭐ Adding featured field...');
  blogPost
    .createField('featured')
    .name('Featured')
    .type('Boolean')
    .required(false)
    .defaultValue({ 'en-US': false });

  console.log('✅ blogPost content type enhancement completed!');
  console.log(
    '📋 Added fields: slug, category, tags, publishedAt, readTime, featured'
  );
  console.log(
    '🔄 Next step: populate these fields with data for existing entries'
  );
};
