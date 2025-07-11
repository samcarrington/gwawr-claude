<template>
  <component
    :is="tag"
    :class="[cardClasses, $attrs.class]"
    v-bind="$attrs"
  >
    <!-- Header slot for images, icons, etc. -->
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>

    <!-- Main content area -->
    <div v-if="$slots.default" :class="contentClasses">
      <slot />
    </div>

    <!-- Footer slot for actions, buttons, etc. -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: 'div' | 'article' | 'section';
  variant?: 'default' | 'elevated' | 'flat' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  overflow?: boolean;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  variant: 'default',
  size: 'md',
  padding: 'md',
  rounded: 'xl',
  hover: true,
  interactive: false,
  overflow: false,
});

// Define class mappings using theme configuration
const variantClasses = {
  default: 'bg-white shadow-lg',
  elevated: 'bg-white shadow-xl',
  flat: 'bg-gray-50',
  outline: 'bg-white border border-gray-200',
} as const;

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
} as const;

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
} as const;

const cardClasses = computed(() => {
  const classes = [
    variantClasses[props.variant] || variantClasses.default,
    sizeClasses[props.size] || sizeClasses.md,
    roundedClasses[props.rounded] || roundedClasses.xl,
  ];

  // Add hover effects
  if (props.hover) {
    if (props.variant === 'default') {
      classes.push('hover:shadow-xl');
    } else if (props.variant === 'elevated') {
      classes.push('hover:shadow-2xl');
    } else if (props.variant === 'flat') {
      classes.push('hover:bg-gray-100');
    } else if (props.variant === 'outline') {
      classes.push('hover:border-gray-300 hover:shadow-sm');
    }
    classes.push('transition-all duration-300');
  }

  // Add interactive cursor
  if (props.interactive) {
    classes.push('cursor-pointer');
  }

  // Add overflow handling
  if (props.overflow) {
    classes.push('overflow-hidden');
  }

  return classes.join(' ');
});

const headerClasses = computed(() => {
  const classes = ['card-header'];
  
  // Remove padding for header if card has padding
  if (props.padding !== 'none') {
    classes.push('rounded-t-' + props.rounded);
  }
  
  return classes.join(' ');
});

const contentClasses = computed(() => {
  const classes = ['card-content'];
  
  // Apply padding to content area
  if (props.padding !== 'none') {
    classes.push(paddingClasses[props.padding] || paddingClasses.md);
  }
  
  return classes.join(' ');
});

const footerClasses = computed(() => {
  const classes = ['card-footer'];
  
  // Apply padding to footer area
  if (props.padding !== 'none') {
    classes.push(paddingClasses[props.padding] || paddingClasses.md);
    classes.push('pt-0'); // Remove top padding for footer
  }
  
  return classes.join(' ');
});
</script>

<style scoped>
/* Removed unused styles for .card-header, .card-content, and .card-footer */
</style>