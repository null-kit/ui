<template>
  <div
    class="grid shrink-0 grid-cols-5 gap-[12%]"
    :class="{ 'size-6': !String($attrs.class).includes('size-') }"
    :data-dm-variant="variant ?? randomVariant"
    :data-dm-shape="shape"
  >
    <div v-for="i in 25" :key="i" />
  </div>
</template>

<script setup lang="ts">
const VARIANTS = ['spiral', 'columns', 'waves', 'helix', 'chaotic', 'dna', 'romb', 'cascade'] as const;

withDefaults(
  defineProps<{
    variant?: (typeof VARIANTS)[number];
    shape?: 'circle' | 'square';
  }>(),
  {
    shape: 'circle'
  }
);

const randomVariant = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
</script>
