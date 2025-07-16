<template>
  <div 
    v-if="renderedContent" 
    class="prose prose-gray max-w-none"
    :class="proseClasses"
    v-html="renderedContent"
  />
  <div v-else-if="isLoading" class="text-gray-600">
    <span class="inline-block animate-pulse">Loading content...</span>
  </div>
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

// Track loading state
const isLoading = ref(true)
const renderedContent = ref('')

// Render the content using our smart renderer (async)
onMounted(async () => {
  isLoading.value = true
  try {
    if (props.content) {
      renderedContent.value = await renderContent(props.content)
    } else {
      renderedContent.value = ''
    }
  } catch (error) {
    console.error('[AtomsContentRenderer] Error rendering content:', error)
    renderedContent.value = ''
  } finally {
    isLoading.value = false
  }
})

// Watch for content changes and re-render
watch(() => props.content, async (newContent) => {
  isLoading.value = true
  try {
    if (newContent) {
      renderedContent.value = await renderContent(newContent)
    } else {
      renderedContent.value = ''
    }
  } catch (error) {
    console.error('[AtomsContentRenderer] Error rendering content:', error)
    renderedContent.value = ''
  } finally {
    isLoading.value = false
  }
}, { deep: true })

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