<template>
  <h1 :class="titleClasses">
    <slot />
  </h1>
</template>

<script setup lang="ts">
interface Props {
  size?: 'default' | 'large' | 'hero';
  align?: 'left' | 'center' | 'right';
  color?: 'default' | 'primary' | 'secondary';
  spacing?: 'default' | 'tight' | 'loose';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  align: 'center',
  color: 'default',
  spacing: 'default',
});

const titleClasses = computed(() => {
  const classes = ['font-bold'];
  
  // Size classes using theme typography
  switch (props.size) {
    case 'hero':
      classes.push('text-5xl md:text-7xl');
      break;
    case 'large':
      classes.push('text-4xl md:text-5xl');
      break;
    case 'default':
    default:
      classes.push('text-3xl md:text-4xl');
      break;
  }
  
  // Alignment classes
  switch (props.align) {
    case 'left':
      classes.push('text-left');
      break;
    case 'right':
      classes.push('text-right');
      break;
    case 'center':
    default:
      classes.push('text-center');
      break;
  }
  
  // Color classes using theme colors
  switch (props.color) {
    case 'primary':
      classes.push('text-primary');
      break;
    case 'secondary':
      classes.push('text-secondary');
      break;
    case 'default':
    default:
      classes.push('text-gray-900');
      break;
  }
  
  // Spacing classes using theme spacing
  switch (props.spacing) {
    case 'tight':
      classes.push('mb-4');
      break;
    case 'loose':
      classes.push('mb-8');
      break;
    case 'default':
    default:
      classes.push('mb-6');
      break;
  }
  
  return classes.join(' ');
});
</script>