<template>
  <div :class="containerClasses">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      :class="imageClasses"
    />
    <div v-else :class="placeholderClasses">
      <UIcon :name="fallbackIcon" class="w-16 h-16" />
    </div>

    <!-- Category Badge -->
    <div v-if="category" class="absolute top-4 left-4">
      <AtomsBadges variant="primary" size="sm">
        {{ category }}
      </AtomsBadges>
    </div>

    <!-- Additional slot for custom overlays -->
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string;
  alt?: string;
  category?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait';
  fallbackIcon?: string;
  hover?: boolean;
  gradient?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: 'video',
  fallbackIcon: 'i-heroicons-photo',
  hover: false,
  gradient: false,
});

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[16/9]',
  portrait: 'aspect-[3/4]',
} as const;

const containerClasses = computed(() => {
  const classes = [
    'relative bg-gray-200 overflow-hidden',
    aspectRatioClasses[props.aspectRatio] || aspectRatioClasses.video,
  ];
  
  return classes.join(' ');
});

const imageClasses = computed(() => {
  const classes = ['w-full h-full object-cover'];
  
  if (props.hover) {
    classes.push('group-hover:scale-105 transition-transform duration-300');
  }
  
  return classes.join(' ');
});

const placeholderClasses = computed(() => {
  const classes = [
    'w-full h-full flex items-center justify-center text-gray-400',
  ];
  
  if (props.gradient) {
    classes.push('bg-gradient-to-br from-gray-100 to-gray-200');
  }
  
  return classes.join(' ');
});
</script>