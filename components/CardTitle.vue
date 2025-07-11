<template>
  <component :is="tag" :class="[titleClasses, $attrs.class]">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: 'h2' | 'h3' | 'h4';
  size?: 'default' | 'large' | 'small';
  align?: 'left' | 'center' | 'right';
  color?: 'default' | 'primary' | 'secondary';
  spacing?: 'default' | 'tight' | 'loose' | 'none';
  hover?: boolean;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  tag: 'h3',
  size: 'default',
  align: 'left',
  color: 'default',
  spacing: 'default',
  hover: false,
});

const titleClasses = computed(() => {
  const classes = ['font-bold'];
  
  // Size classes using theme typography
  switch (props.size) {
    case 'large':
      classes.push('text-2xl md:text-3xl');
      break;
    case 'small':
      classes.push('text-lg md:text-xl');
      break;
    case 'default':
    default:
      classes.push('text-xl');
      break;
  }
  
  // Alignment classes
  switch (props.align) {
    case 'center':
      classes.push('text-center');
      break;
    case 'right':
      classes.push('text-right');
      break;
    case 'left':
    default:
      classes.push('text-left');
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
      classes.push('mb-2');
      break;
    case 'loose':
      classes.push('mb-4');
      break;
    case 'none':
      // No margin bottom
      break;
    case 'default':
    default:
      classes.push('mb-3');
      break;
  }
  
  // Hover effects
  if (props.hover) {
    classes.push('group-hover:text-primary transition-colors');
  }
  
  return classes.join(' ');
});
</script>