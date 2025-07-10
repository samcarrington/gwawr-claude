<template>
  <component
    :is="variant === 'dark' ? 'section' : 'div'"
    :id="variant === 'dark' ? 'contact' : undefined"
    :class="containerClasses"
  >
    <UContainer>
      <div class="text-center max-w-3xl mx-auto">
        <h2 :class="titleClasses">
          {{ title }}
        </h2>
        <p :class="descriptionClasses">
          {{ description }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            size="lg"
            :variant="primaryButtonVariant"
            :class="primaryButtonClasses"
            @click="handlePrimaryAction"
            :aria-label="primaryButton.ariaLabel"
          >
            <UIcon
              v-if="primaryButton.icon"
              :name="primaryButton.icon"
              class="mr-2"
            />
            {{ primaryButton.text }}
          </UButton>
          <UButton
            size="lg"
            :variant="secondaryButtonVariant"
            :class="secondaryButtonClasses"
            @click="handleSecondaryAction"
            :aria-label="secondaryButton.ariaLabel"
          >
            <UIcon
              v-if="secondaryButton.icon"
              :name="secondaryButton.icon"
              class="mr-2"
            />
            {{ secondaryButton.text }}
          </UButton>
        </div>
      </div>
    </UContainer>
  </component>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'light',
    validator: value => ['light', 'dark'].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  primaryButton: {
    type: Object,
    required: true,
    validator: value =>
      value.text && value.action && typeof value.action === 'function',
  },
  secondaryButton: {
    type: Object,
    required: true,
    validator: value =>
      value.text && value.action && typeof value.action === 'function',
  },
});

// Computed classes based on variant
const containerClasses = computed(() => {
  if (props.variant === 'dark') {
    return 'py-20 bg-gray-900 text-white';
  }
  return 'bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center';
});

const titleClasses = computed(() => {
  const baseClasses = 'font-bold mb-6';
  if (props.variant === 'dark') {
    return `text-3xl md:text-4xl ${baseClasses}`;
  }
  return `text-2xl md:text-3xl text-gray-900 mb-4`;
});

const descriptionClasses = computed(() => {
  const baseClasses = 'mb-8 max-w-2xl mx-auto';
  if (props.variant === 'dark') {
    return `text-xl text-gray-300 ${baseClasses}`;
  }
  return `text-lg text-gray-600 mb-6 ${baseClasses}`;
});

const primaryButtonVariant = computed(() => {
  return props.variant === 'dark' ? 'outline' : 'solid';
});

const secondaryButtonVariant = computed(() => {
  return props.variant === 'dark' ? 'solid' : 'outline';
});

const primaryButtonClasses = computed(() => {
  if (props.variant === 'dark') {
    return 'px-8 py-3 border-white text-white hover:bg-white hover:text-gray-900';
  }
  return '';
});

const secondaryButtonClasses = computed(() => {
  if (props.variant === 'dark') {
    return 'px-8 py-3 bg-primary hover:bg-primary/90';
  }
  return '';
});

// Action handlers
const handlePrimaryAction = () => {
  props.primaryButton.action();
};

const handleSecondaryAction = () => {
  props.secondaryButton.action();
};
</script>
