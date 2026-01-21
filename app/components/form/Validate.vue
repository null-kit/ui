<template>
  <Transition enter-from-class="translate-y-2 blur-xs skew-4 opacity-0" enter-to-class="duration-300" appear>
    <div v-if="name && errors[name]" class="form-validate">
      {{ errors[name] }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { errors } = useValidate();

defineProps<{ name: string }>();
</script>
