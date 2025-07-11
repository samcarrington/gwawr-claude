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

      <!-- Grid Content -->
      <div :class="gridClasses">
        <slot />
      </div>

      <!-- Grid Footer -->
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
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'neutral' | 'primary' | 'secondary' | 'tertiary' | 'transparent';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  headerAlign?: 'left' | 'center' | 'right';
  titleSize?: 'small' | 'default' | 'large';
  titleSpacing?: 'tight' | 'default' | 'loose';
  responsive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
  gap: 'lg',
  background: 'transparent',
  padding: 'lg',
  headerAlign: 'center',
  titleSize: 'large',
  titleSpacing: 'tight',
  responsive: true,
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

  classes.push(backgroundClasses[props.background] || backgroundClasses.transparent);
  classes.push(paddingClasses[props.padding] || paddingClasses.lg);

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

const gridClasses = computed(() => {
  const classes = ['grid'];

  // Gap classes
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  };

  // Column classes
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  classes.push(gapClasses[props.gap] || gapClasses.lg);
  
  if (props.responsive) {
    classes.push(columnClasses[props.columns] || columnClasses[3]);
  } else {
    classes.push(`grid-cols-${props.columns}`);
  }

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