<template>
  <span
    class="inline-flex items-center justify-center gap-1.5 font-medium ring ring-inset"
    :class="{
      [`badge-${type}`]: type,
      [`badge-${size}`]: size
    }"
    :aria-label="`badge-${type}`"
    role="badge"
  >
    <slot>
      <slot name="icon">
        <AppIcon v-if="icon" :name="icon" class="size-3 shrink-0" />
      </slot>

      <span v-if="$slots.label">
        <slot name="label" />
      </span>

      <template v-else>{{ label }}</template>
    </slot>
  </span>
</template>

<script setup lang="ts">
const {
  type = 'default',
  label,
  size = 'default',
  icon = undefined
} = defineProps<{
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
  label?: string | number;
  icon?: string;
  size?: 'default' | 'sm' | 'lg';
}>();
</script>
