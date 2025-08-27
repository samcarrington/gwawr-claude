<template>
  <section :class="heroClasses">
    <UContainer :class="containerClasses">
      <div class="max-w-4xl mx-auto">
        <!-- Hero Content -->
        <div class="text-center">
          <slot name="title">
            <AtomsTypographyPage size="hero" spacing="default">
              Default Hero Title
            </AtomsTypographyPage>
          </slot>

          <slot name="subtitle">
            <p class="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Default hero subtitle description
            </p>
          </slot>

          <!-- Action Buttons -->
          <div
            v-if="$slots.actions"
            class="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <slot name="actions" />
          </div>
        </div>

        <!-- Additional Content -->
        <div v-if="$slots.content" class="mt-12">
          <slot name="content" />
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'gradient' | 'solid' | 'image';
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  background?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'white';
  overlay?: boolean;
  centered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gradient',
  size: 'fullscreen',
  background: 'primary',
  overlay: false,
  centered: true,
});

const heroClasses = computed(() => {
  const classes = ['relative flex items-center justify-center'];

  // Size classes
  const sizeClasses = {
    small: 'min-h-[40vh] py-16',
    medium: 'min-h-[60vh] py-20',
    large: 'min-h-[80vh] py-24',
    fullscreen: 'min-h-screen py-24',
  };

  // Background variant classes
  const backgroundClasses = {
    gradient: {
      primary: 'bg-gradient-to-br from-primary-300 to-primary-100',
      secondary: 'bg-gradient-to-br from-secondary-300 to-secondary-100',
      tertiary: 'bg-gradient-to-br from-tertiary-300 to-tertiary-100',
      neutral: 'bg-gradient-to-br from-neutral-300 to-neutral-100',
      white: 'bg-gradient-to-br from-white to-neutral-50',
    },
    solid: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      tertiary: 'bg-tertiary',
      neutral: 'bg-neutral-900',
      white: 'bg-white',
    },
    image: {
      primary: 'bg-primary-900',
      secondary: 'bg-secondary-900',
      tertiary: 'bg-tertiary-900',
      neutral: 'bg-neutral-900',
      white: 'bg-white',
    },
  };

  classes.push(sizeClasses[props.size] || sizeClasses.fullscreen);
  classes.push(
    backgroundClasses[props.variant][props.background] ||
      backgroundClasses.gradient.primary
  );

  // Add overlay for image variant
  if (props.variant === 'image' && props.overlay) {
    classes.push(
      'before:absolute before:inset-0 before:bg-black/40 before:z-10'
    );
  }

  return classes.join(' ');
});

const containerClasses = computed(() => {
  const classes = [];

  if (props.centered) {
    classes.push('text-center');
  }

  // Add z-index for overlay
  if (props.variant === 'image' && props.overlay) {
    classes.push('relative z-20');
  }

  return classes.join(' ');
});
</script>
