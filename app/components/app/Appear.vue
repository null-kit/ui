<template>
  <Transition name="appear" :appear="!noAppear" mode="out-in">
    <slot />
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ noAppear?: boolean }>();
</script>

<style scoped>
.appear-enter-active,
.appear-leave-active {
  transition: 200ms ease-out;
  transition-property: transform, opacity, filter;
  transform-origin: top left;
  will-change: transform, opacity, filter;
}

.appear-leave-to,
.appear-enter-from {
  opacity: 0;
  transform: translateY(4px) rotateZ(1deg);
  filter: blur(2px);
}
</style>
