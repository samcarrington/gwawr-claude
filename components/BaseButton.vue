<template>
  <UButton
    :class="[buttonClasses, $attrs.class]"
    :size="size"
    :variant="variant"
    :color="color"
    :disabled="disabled"
    :loading="loading"
    :to="to"
    :target="target"
    :external="external"
    v-bind="$attrs"
    @click="handleClick"
  >
    <template #leading v-if="$slots.leading">
      <slot name="leading" />
    </template>
    <slot />
    <template #trailing v-if="$slots.trailing">
      <slot name="trailing" />
    </template>
  </UButton>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'solid' | 'outline' | 'soft' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'neutral';
  disabled?: boolean;
  loading?: boolean;
  to?: string;
  target?: string;
  external?: boolean;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  shadow?: boolean;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  size: 'md',
  color: 'primary',
  disabled: false,
  loading: false,
  fullWidth: false,
  rounded: 'lg',
  shadow: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// Define size-based padding using design system tokens
const sizeClasses = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
} as const;

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md', 
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

const buttonClasses = computed(() => {
  const classes = [
    'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  ];

  // Add size-based padding using design system
  classes.push(sizeClasses[props.size] || sizeClasses.md);

  // Add rounded classes
  classes.push(roundedClasses[props.rounded] || roundedClasses.lg);

  // Add full width
  if (props.fullWidth) {
    classes.push('w-full');
  }

  // Add shadow
  if (props.shadow) {
    classes.push('shadow-md hover:shadow-lg');
  }

  // Add focus ring color based on button color
  switch (props.color) {
    case 'primary':
      classes.push('focus:ring-primary/50');
      break;
    case 'secondary':
      classes.push('focus:ring-secondary/50');
      break;
    case 'tertiary':
      classes.push('focus:ring-tertiary/50');
      break;
    case 'success':
      classes.push('focus:ring-success/50');
      break;
    case 'warning':
      classes.push('focus:ring-warning/50');
      break;
    case 'error':
      classes.push('focus:ring-error/50');
      break;
    default:
      classes.push('focus:ring-neutral/50');
      break;
  }

  return classes.join(' ');
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>