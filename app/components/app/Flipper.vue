<template>
  <button @click="isFlipped = !isFlipped">Flip</button>

  <div class="perspective-distant">
    <Transition enter-from-class="-rotate-x-180" enter-to-class="duration-400 ease-in-out">
      <div v-if="!isFlipped" class="h-40 bg-red-500">
        <slot name="front" />
      </div>

      <div v-else class="h-80 bg-blue-500">
        <slot name="back" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const isFlipped = ref(false);
</script>
