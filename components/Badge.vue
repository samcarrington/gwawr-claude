<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  outline?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'sm',
  rounded: 'full',
  outline: false,
});

// Define class mappings using theme configuration
const variantClasses = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  tertiary: 'bg-tertiary text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-warning text-white',
  error: 'bg-error text-white',
} as const;

const outlineVariantClasses = {
  default: 'border-gray-300 text-gray-700',
  primary: 'border-primary text-primary',
  secondary: 'border-secondary text-secondary',
  tertiary: 'border-tertiary text-tertiary',
  success: 'border-green-500 text-green-600',
  warning: 'border-warning text-warning',
  error: 'border-error text-error',
} as const;

const sizeClasses = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-1.5 text-sm',
  lg: 'px-5 py-2 text-base',
} as const;

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

const badgeClasses = computed(() => {
  const classes = [
    'inline-flex items-center font-medium',
    sizeClasses[props.size] || sizeClasses.sm,
    roundedClasses[props.rounded] || roundedClasses.full,
  ];

  // Add variant classes
  if (props.outline) {
    classes.push('border bg-transparent');
    classes.push(outlineVariantClasses[props.variant] || outlineVariantClasses.default);
  } else {
    classes.push(variantClasses[props.variant] || variantClasses.default);
  }

  return classes.join(' ');
});
</script>