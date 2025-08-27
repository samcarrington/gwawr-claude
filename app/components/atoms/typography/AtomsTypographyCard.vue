<template>
  <AtomsTypographyBase
    :tag="tag"
    :size="size"
    :align="align"
    :color="color"
    :spacing="spacing"
    :weight="weight"
    :hover="hover"
    :class="$attrs.class"
  >
    <slot />
  </AtomsTypographyBase>
</template>

<script setup lang="ts">
interface Props {
  tag?: 'h2' | 'h3' | 'h4';
  size?: 'default' | 'large' | 'small';
  align?: 'left' | 'center' | 'right';
  color?: 'default' | 'primary' | 'secondary' | 'tertiary';
  spacing?: 'default' | 'tight' | 'loose' | 'none';
  hover?: boolean;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
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
  weight: 'bold',
});

// Map CardTitle sizes to BaseTitle sizes
const size = computed(() => {
  switch (props.size) {
    case 'large':
      return '2xl';
    case 'small':
      return 'md';
    default: // 'default' and fallback
      return 'lg';
  }
});

// Map CardTitle spacing to BaseTitle spacing
const spacing = computed(() => {
  switch (props.spacing) {
    case 'tight':
      return 'sm';
    case 'loose':
      return 'lg';
    case 'none':
      return 'none';
    default: // 'default' and fallback
      return 'md';
  }
});

// Pass through other props
const { tag, align, color, hover, weight } = toRefs(props);
</script>
