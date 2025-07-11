<template>
  <component :is="tag" :class="[titleClasses, $attrs.class]">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  align?: 'left' | 'center' | 'right';
  color?: 'default' | 'primary' | 'secondary' | 'tertiary';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  tag: 'h2',
  size: 'lg',
  align: 'left',
  color: 'default',
  spacing: 'md',
  hover: false,
  weight: 'bold',
});

const titleClasses = computed(() => {
  const classes = [];
  
  // Font weight classes
  switch (props.weight) {
    case 'normal':
      classes.push('font-normal');
      break;
    case 'medium':
      classes.push('font-medium');
      break;
    case 'semibold':
      classes.push('font-semibold');
      break;
    case 'bold':
    default:
      classes.push('font-bold');
      break;
  }
  
  // Size classes using theme typography (comprehensive scale)
  switch (props.size) {
    case 'xs':
      classes.push('text-sm');
      break;
    case 'sm':
      classes.push('text-base');
      break;
    case 'md':
      classes.push('text-lg');
      break;
    case 'lg':
      classes.push('text-xl');
      break;
    case 'xl':
      classes.push('text-2xl');
      break;
    case '2xl':
      classes.push('text-2xl md:text-3xl');
      break;
    case '3xl':
      classes.push('text-3xl md:text-4xl');
      break;
    case '4xl':
      classes.push('text-4xl md:text-5xl');
      break;
    case '5xl':
      classes.push('text-5xl md:text-7xl');
      break;
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
    case 'tertiary':
      classes.push('text-tertiary');
      break;
    case 'default':
    default:
      classes.push('text-gray-900');
      break;
  }
  
  // Spacing classes using theme spacing
  switch (props.spacing) {
    case 'none':
      // No margin bottom
      break;
    case 'xs':
      classes.push('mb-1');
      break;
    case 'sm':
      classes.push('mb-2');
      break;
    case 'md':
      classes.push('mb-3');
      break;
    case 'lg':
      classes.push('mb-4');
      break;
    case 'xl':
      classes.push('mb-6');
      break;
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