<template>
  <Transition
    appear-from-class="opacity-0 translate-y-2 skew-2"
    appear-to-class="origin-top-left duration-300"
    :appear="!noAppear"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ noAppear?: boolean }>();
</script>
