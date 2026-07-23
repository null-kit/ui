<template>
  <svg :viewBox="`0 0 ${count * (size + spacing) - spacing} ${size}`" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      v-for="i in count"
      :key="i"
      :x="(i - 1) * (size + spacing)"
      :width="size"
      :height="size"
      :rx="radius"
      fill="currentColor"
      class="duration-200 ease-in-out"
      :class="i <= filledCount ? activeClass : inactiveClass"
    />
  </svg>
</template>

<script setup lang="ts">
const {
  value,
  total,
  count = 16,
  size = 16,
  spacing = 4,
  radius = 3,
  activeClass = 'text-accent',
  inactiveClass = 'text-edison'
} = defineProps<{
  total: number;
  value: number;

  count?: number;
  size?: number;
  spacing?: number;
  radius?: number;
  activeClass?: string;
  inactiveClass?: string;
}>();

const filledCount = computed(() => Math.round((value / total) * count));
</script>
