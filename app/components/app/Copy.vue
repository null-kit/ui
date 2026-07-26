<template>
  <button type="button" class="btn" title="Copy" @click.stop="copy(value)">
    <Transition
      enter-from-class="scale-80 blur-xs opacity-0"
      enter-to-class="duration-200"
      leave-to-class="scale-80 blur-xs opacity-0"
      mode="out-in"
    >
      <AppIcon v-if="status" name="copied" class="text-accent" :class="iconClass" />
      <AppIcon v-else name="copy" :class="iconClass" />
    </Transition>

    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
const { copy, status } = useClipboard();

defineProps<{ value: string; iconClass?: string; label?: string }>();
</script>
