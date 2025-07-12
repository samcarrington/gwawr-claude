<template>
  <div 
    v-if="renderedContent" 
    class="prose prose-gray max-w-none"
    :class="proseClasses"
    v-html="renderedContent"
  />
  <div v-else-if="fallbackText" class="text-gray-600">
    {{ fallbackText }}
  </div>
</template>

<script setup lang="ts">
import { renderContent } from '~/utils/contentful-transformers'

interface Props {
  content: any
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallbackText?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fallbackText: 'No content available'
})

// Render the content using our smart renderer
const renderedContent = computed(() => {
  if (!props.content) return ''
  return renderContent(props.content)
})

// Dynamic prose classes based on size
const proseClasses = computed(() => {
  const sizeClasses = {
    sm: 'prose-sm',
    md: 'prose-base',
    lg: 'prose-lg', 
    xl: 'prose-xl'
  }
  
  return [
    sizeClasses[props.size],
    // Custom styling for better integration
    'prose-headings:text-gray-900',
    'prose-p:text-gray-700',
    'prose-a:text-primary',
    'prose-strong:text-gray-900',
    'prose-code:bg-gray-100',
    'prose-code:text-gray-800',
    'prose-blockquote:border-primary',
    'prose-blockquote:text-gray-700'
  ]
})
</script>