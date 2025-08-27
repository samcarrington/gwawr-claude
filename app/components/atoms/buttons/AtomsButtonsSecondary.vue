<template>
  <AtomsButtonsBase
    variant="outline"
    color="primary"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <template #leading v-if="$slots.leading">
      <slot name="leading" />
    </template>
    <slot />
    <template #trailing v-if="$slots.trailing">
      <slot name="trailing" />
    </template>
  </AtomsButtonsBase>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>
