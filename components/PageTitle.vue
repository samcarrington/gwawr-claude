<template>
  <BaseTitle
    tag="h1"
    :size="size"
    :align="align"
    :color="color"
    :spacing="spacing"
    :weight="weight"
    :class="$attrs.class"
  >
    <slot />
  </BaseTitle>
</template>

<script setup lang="ts">
interface Props {
  size?: 'default' | 'large' | 'hero';
  align?: 'left' | 'center' | 'right';
  color?: 'default' | 'primary' | 'secondary' | 'tertiary';
  spacing?: 'default' | 'tight' | 'loose';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  align: 'center',
  color: 'default',
  spacing: 'default',
  weight: 'bold',
});

// Map PageTitle sizes to BaseTitle sizes
const size = computed(() => {
  switch (props.size) {
    case 'hero':
      return '5xl';
    case 'large':
      return '4xl';
    default: // 'default' and fallback
      return '3xl';
  }
});

// Map PageTitle spacing to BaseTitle spacing
const spacing = computed(() => {
  switch (props.spacing) {
    case 'tight':
      return 'lg';
    default: // 'loose', 'default' and fallback
      return 'xl';
  }
});

// Pass through other props
const { align, color, weight } = toRefs(props);
</script>