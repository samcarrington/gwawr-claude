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
import { 
  getAlignClass, 
  getDescriptionAlignClass, 
  getBackgroundClass, 
  getPaddingClass, 
  getMaxWidthClass 
} from '../../../utils/layout-classes';

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

  // Variant classes
  const variantClasses = {
    default: '',
    featured: 'relative',
    highlight: 'relative border-l-4 border-primary',
  };

  classes.push(getBackgroundClass(props.background));
  classes.push(getPaddingClass(props.padding));
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

  classes.push(getAlignClass(props.headerAlign, 'center'));
  classes.push('mb-16');

  return classes.join(' ');
});

const contentClasses = computed(() => {
  const classes = [];

  classes.push(getAlignClass(props.contentAlign, 'left'));
  classes.push(getMaxWidthClass(props.maxWidth));

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