<template>
  <AtomsTypographyBase
    tag="h2"
    :size="size"
    :align="align"
    :color="color"
    :spacing="spacing"
    :weight="weight"
    :class="$attrs.class"
  >
    <slot />
  </AtomsTypographyBase>
</template>

<script setup lang="ts">
interface Props {
  size?: 'default' | 'large' | 'small';
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

// Map SectionTitle sizes to BaseTitle sizes
const size = computed(() => {
  switch (props.size) {
    case 'large':
      return '3xl';
    case 'small':
      return 'xl';
    default: // 'default' and fallback
      return '2xl';
  }
});

// Map SectionTitle spacing to BaseTitle spacing
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