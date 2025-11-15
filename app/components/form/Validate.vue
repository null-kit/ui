<template>
  <Transition enter-from-class="translate-y-2 blur-xs skew-4 opacity-0" enter-to-class="duration-300" appear>
    <div v-if="name && validate[name]" class="form-validate">
      {{ validate[name] }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { validate } = useValidate();

defineProps<{ name: string }>();
</script>
