<template>
  <div :class="containerClasses">
    <span
      v-for="(tag, index) in tags"
      :key="`${tag}-${index}`"
      :class="tagClasses"
    >
      {{ formatTag(tag) }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tags: string[];
  variant?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md';
  align?: 'left' | 'center' | 'right';
  prefix?: string;
  outline?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'sm',
  align: 'left',
  prefix: '',
  outline: false,
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
  if (props.outline) {
    classes.push('border bg-transparent');
    switch (props.variant) {
      case 'primary':
        classes.push('border-primary text-primary');
        break;
      case 'secondary':
        classes.push('border-secondary text-secondary');
        break;
      case 'tertiary':
        classes.push('border-tertiary text-tertiary');
        break;
      case 'success':
        classes.push('border-success text-success-600');
        break;
      case 'warning':
        classes.push('border-warning text-warning');
        break;
      case 'error':
        classes.push('border-error text-error');
        break;
      default:
        classes.push('border-neutral-300 text-neutral-700');
        break;
    }
  } else {
    switch (props.variant) {
      case 'primary':
        classes.push('bg-primary/10 text-primary');
        break;
      case 'secondary':
        classes.push('bg-secondary/10 text-secondary');
        break;
      case 'tertiary':
        classes.push('bg-tertiary/10 text-tertiary');
        break;
      case 'success':
        classes.push('bg-success-100 text-success-700');
        break;
      case 'warning':
        classes.push('bg-warning/10 text-warning');
        break;
      case 'error':
        classes.push('bg-error/10 text-error');
        break;
      default:
        classes.push('bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors');
        break;
    }
  }
  
  return classes.join(' ');
});

const formatTag = (tag: string) => {
  return props.prefix ? `${props.prefix}${tag}` : tag;
};
</script>