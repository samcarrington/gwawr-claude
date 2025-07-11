<template>
  <section :class="sectionClasses">
    <UContainer>
      <!-- Section Header -->
      <div v-if="$slots.header || title || description" :class="headerClasses">
        <slot name="header">
          <AtomsTypographySection 
            v-if="title"
            :size="titleSize" 
            :spacing="titleSpacing"
            :align="headerAlign"
          >
            {{ title }}
          </AtomsTypographySection>
          <p v-if="description" :class="descriptionClasses">
            {{ description }}
          </p>
        </slot>
      </div>

      <!-- Section Content -->
      <div :class="contentClasses">
        <slot />
      </div>

      <!-- Section Footer -->
      <div v-if="$slots.footer" :class="footerClasses">
        <slot name="footer" />
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  variant?: 'default' | 'featured' | 'highlight';
  background?: 'white' | 'neutral' | 'primary' | 'secondary' | 'tertiary' | 'transparent';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  headerAlign?: 'left' | 'center' | 'right';
  contentAlign?: 'left' | 'center' | 'right';
  titleSize?: 'small' | 'default' | 'large';
  titleSpacing?: 'tight' | 'default' | 'loose';
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  bordered?: boolean;
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  background: 'transparent',
  padding: 'lg',
  headerAlign: 'center',
  contentAlign: 'left',
  titleSize: 'large',
  titleSpacing: 'tight',
  maxWidth: 'none',
  bordered: false,
  rounded: false,
});

const sectionClasses = computed(() => {
  const classes = [];

  // Background classes
  const backgroundClasses = {
    white: 'bg-white',
    neutral: 'bg-neutral-50',
    primary: 'bg-primary-50',
    secondary: 'bg-secondary-50',
    tertiary: 'bg-tertiary-50',
    transparent: '',
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-20',
    xl: 'py-24',
  };

  // Variant classes
  const variantClasses = {
    default: '',
    featured: 'relative',
    highlight: 'relative border-l-4 border-primary',
  };

  classes.push(backgroundClasses[props.background] || backgroundClasses.transparent);
  classes.push(paddingClasses[props.padding] || paddingClasses.lg);
  classes.push(variantClasses[props.variant] || variantClasses.default);

  // Border and rounded classes
  if (props.bordered) {
    classes.push('border border-neutral-200');
  }
  if (props.rounded) {
    classes.push('rounded-lg');
  }

  return classes.join(' ');
});

const headerClasses = computed(() => {
  const classes = [];

  // Header alignment
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  classes.push(alignClasses[props.headerAlign] || alignClasses.center);
  classes.push('mb-16');

  return classes.join(' ');
});

const contentClasses = computed(() => {
  const classes = [];

  // Content alignment
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Max width classes
  const maxWidthClasses = {
    none: '',
    sm: 'max-w-sm mx-auto',
    md: 'max-w-md mx-auto',
    lg: 'max-w-lg mx-auto',
    xl: 'max-w-xl mx-auto',
    '2xl': 'max-w-2xl mx-auto',
    '3xl': 'max-w-3xl mx-auto',
    '4xl': 'max-w-4xl mx-auto',
    '5xl': 'max-w-5xl mx-auto',
    '6xl': 'max-w-6xl mx-auto',
  };

  classes.push(alignClasses[props.contentAlign] || alignClasses.left);
  classes.push(maxWidthClasses[props.maxWidth] || maxWidthClasses.none);

  return classes.join(' ');
});

const descriptionClasses = computed(() => {
  const classes = ['text-xl text-gray-600 leading-relaxed'];

  // Description alignment and width
  const alignClasses = {
    left: 'text-left max-w-none',
    center: 'text-center max-w-3xl mx-auto',
    right: 'text-right max-w-none ml-auto',
  };

  classes.push(alignClasses[props.headerAlign] || alignClasses.center);

  return classes.join(' ');
});

const footerClasses = computed(() => {
  const classes = ['mt-16'];

  // Footer alignment
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  classes.push(alignClasses[props.headerAlign] || alignClasses.center);

  return classes.join(' ');
});
</script>