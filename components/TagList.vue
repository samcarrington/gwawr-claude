<template>
  <div :class="containerClasses">
    <span
      v-for="tag in tags"
      :key="tag"
      :class="tagClasses"
    >
      {{ formatTag(tag) }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tags: string[];
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'md';
  align?: 'left' | 'center' | 'right';
  prefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'sm',
  align: 'left',
  prefix: '',
});

const containerClasses = computed(() => {
  const classes = ['flex flex-wrap gap-2'];
  
  switch (props.align) {
    case 'center':
      classes.push('justify-center');
      break;
    case 'right':
      classes.push('justify-end');
      break;
    default:
      classes.push('justify-start');
      break;
  }
  
  return classes.join(' ');
});

const tagClasses = computed(() => {
  const classes = ['rounded-full font-medium'];
  
  // Size classes
  switch (props.size) {
    case 'xs':
      classes.push('px-2 py-0.5 text-xs');
      break;
    case 'sm':
      classes.push('px-2 py-1 text-xs');
      break;
    case 'md':
      classes.push('px-3 py-1 text-sm');
      break;
    default:
      classes.push('px-2 py-1 text-xs');
      break;
  }
  
  // Variant classes
  switch (props.variant) {
    case 'primary':
      classes.push('bg-primary/10 text-primary');
      break;
    case 'secondary':
      classes.push('bg-secondary/10 text-secondary');
      break;
    case 'default':
    default:
      classes.push('bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors');
      break;
  }
  
  return classes.join(' ');
});

const formatTag = (tag: string) => {
  return props.prefix ? `${props.prefix}${tag}` : tag;
};
</script>