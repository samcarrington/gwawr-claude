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

// Define class mappings for better maintainability
const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold', // default
} as const;

const sizeClasses = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl', // default
  xl: 'text-2xl',
  '2xl': 'text-2xl md:text-3xl',
  '3xl': 'text-3xl md:text-4xl',
  '4xl': 'text-4xl md:text-5xl',
  '5xl': 'text-5xl md:text-7xl',
} as const;

const alignClasses = {
  left: 'text-left', // default
  center: 'text-center',
  right: 'text-right',
} as const;

const colorClasses = {
  default: 'text-gray-900', // default
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
} as const;

const spacingClasses = {
  none: '', // no margin
  xs: 'mb-1',
  sm: 'mb-2',
  md: 'mb-3', // default
  lg: 'mb-4',
  xl: 'mb-6',
} as const;

const titleClasses = computed(() => {
  const classes = [
    weightClasses[props.weight] || weightClasses.bold,
    sizeClasses[props.size] || sizeClasses.lg,
    alignClasses[props.align] || alignClasses.left,
    colorClasses[props.color] || colorClasses.default,
  ];

  // Add spacing class if not 'none'
  const spacingClass = spacingClasses[props.spacing] || spacingClasses.md;
  if (spacingClass) {
    classes.push(spacingClass);
  }

  // Add hover effects
  if (props.hover) {
    classes.push('group-hover:text-primary transition-colors');
  }

  return classes.join(' ');
});
</script>