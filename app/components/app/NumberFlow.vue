<template>
  <TransitionGroup tag="span" name="list" class="inline-flex" :appear>
    <span v-for="(n, i) in numbers" :key="String(value) + i" :data-stagger="i">{{ n }}</span>
  </TransitionGroup>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: number | string;
  appear?: boolean;
}>();

const numbers = computed(() => String(props.value).split(''));
</script>

<style>
span[data-stagger] {
  will-change: transform, opacity, filter;
  transition-delay: calc(15 * attr(data-stagger ms));
}

.list-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.45, 0.64, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(4px);
  filter: blur(2px);
}

.list-leave-to {
  opacity: 0;
  position: absolute;
  transition: none;
}
</style>
