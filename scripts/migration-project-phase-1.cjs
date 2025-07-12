/**
 * Contentful Migration Script - Phase 1: project Enhancement
 * 
 * This script adds the missing fields to the project content type:
 * - liveUrl: URL to live project/demo
 * - repositoryUrl: URL to code repository
 * - featured: Featured project flag
 * - endDate: Project end date
 * - status: Current project status
 * 
 * All fields are added as optional initially to avoid breaking existing content.
 */

module.exports = function (migration) {
  console.log('🚀 Starting project content type enhancement...')
  
  // Get the project content type
  const project = migration.editContentType('project')
  
  // Add liveUrl field
  console.log('🌐 Adding liveUrl field...')
  project.createField('liveUrl')
    .name('Live URL')
    .type('Symbol')
    .required(false)
    .validations([
      { regexp: { pattern: '^https?://.*' } }
    ])
  
  // Add repositoryUrl field
  console.log('📂 Adding repositoryUrl field...')
  project.createField('repositoryUrl')
    .name('Repository URL')
    .type('Symbol')
    .required(false)
    .validations([
      { regexp: { pattern: '^https?://.*' } }
    ])
  
  // Add featured field
  console.log('⭐ Adding featured field...')
  project.createField('featured')
    .name('Featured')
    .type('Boolean')
    .required(false)
    .defaultValue({ 'en-US': false })
  
  // Add endDate field
  console.log('📅 Adding endDate field...')
  project.createField('endDate')
    .name('End Date')
    .type('Date')
    .required(false)
  
  // Add status field
  console.log('📊 Adding status field...')
  project.createField('status')
    .name('Status')
    .type('Symbol')
    .required(false)
    .validations([
      { in: ['completed', 'in-progress', 'planned'] }
    ])
    .defaultValue({ 'en-US': 'completed' })
  
  console.log('✅ project content type enhancement completed!')
  console.log('📋 Added fields: liveUrl, repositoryUrl, featured, endDate, status')
  console.log('🔄 Next step: populate these fields with data for existing entries')
}