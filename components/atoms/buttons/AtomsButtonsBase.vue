<template>
  <UButton
    :class="[buttonClasses, $attrs.class]"
    :size="size"
    :variant="variant"
    :color="uButtonColor"
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
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral';
  disabled?: boolean;
  loading?: boolean;
  to?: string;
  target?: string;
  external?: boolean;
  fullWidth?: boolean;
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
  shadow: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// Translate our color prop to UButton's expected color format
const uButtonColor = computed(() => {
  // Map our design system colors to UButton colors
  const colorMap = {
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'info', // Map tertiary to info for UButton
    success: 'success',
    warning: 'warning',
    error: 'error',
    neutral: 'gray', // Map neutral to gray for UButton
  } as const;

  return colorMap[props.color] || 'primary';
});

// Only handle additional styling not covered by app.config.ts
const buttonClasses = computed(() => {
  const classes = [];

  // Add full width (not handled by UButton config)
  if (props.fullWidth) {
    classes.push('w-full');
  }

  // Add shadow (not handled by UButton config)
  if (props.shadow) {
    classes.push('shadow-md hover:shadow-lg');
  }

  return classes.join(' ');
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>
