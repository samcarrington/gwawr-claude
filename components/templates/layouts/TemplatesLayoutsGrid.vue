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
import { 
  getAlignClass, 
  getDescriptionAlignClass, 
  getBackgroundClass, 
  getPaddingClass, 
  getGapClass, 
  getGridColumnClass 
} from '../../../utils/layout-classes';

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

  classes.push(getBackgroundClass(props.background));
  classes.push(getPaddingClass(props.padding));

  return classes.join(' ');
});

const headerClasses = computed(() => {
  const classes = [];

  classes.push(getAlignClass(props.headerAlign, 'center'));
  classes.push('mb-16');

  return classes.join(' ');
});

const gridClasses = computed(() => {
  const classes = ['grid'];

  classes.push(getGapClass(props.gap));
  
  if (props.responsive) {
    classes.push(getGridColumnClass(props.columns));
  } else {
    classes.push(`grid-cols-${props.columns}`);
  }

  return classes.join(' ');
});

const descriptionClasses = computed(() => {
  const classes = ['text-xl text-gray-600 leading-relaxed'];

  classes.push(getDescriptionAlignClass(props.headerAlign, 'center'));

  return classes.join(' ');
});

const footerClasses = computed(() => {
  const classes = ['mt-16'];

  classes.push(getAlignClass(props.headerAlign, 'center'));

  return classes.join(' ');
});
</script>