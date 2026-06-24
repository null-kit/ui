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
  transition: all 0.3s cubic-bezier(0.34, 1.45, 0.64, 1);
  transform-origin: top left;
}

.appear-leave-to,
.appear-enter-from {
  opacity: 0;
  transform: translateY(8px) skew(-8deg);
  filter: blur(2px);
}
</style>
