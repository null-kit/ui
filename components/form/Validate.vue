<template>
  <Transition enter-from-class="translate-y-2 opacity-0" enter-to-class="translate-y-0 opacity-100 duration-200" appear>
    <div
      v-if="name && validate[name]"
      class="bg-surface text-newton pointer-events-none absolute top-full left-3 -mt-2 rounded-md px-2 py-0.5 text-xs font-medium shadow"
    >
      {{ validate[name] }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { validate } = useValidate();

defineProps<{ name: string }>();
</script>
