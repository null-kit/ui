<template>
  <span
    class="inline-flex items-center justify-center gap-1.5 font-medium ring ring-inset"
    :class="[type && styles[type], size && sizes[size]]"
    :aria-label="`badge-${type}`"
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

const styles = {
  default: 'bg-darwin ring-edison shadow-xs text-surface dark:shadow-black/20',
  success: 'bg-green-500/10 ring-green-500/20 text-green-600',
  warning: 'bg-yellow-500/10 ring-yellow-500/20 text-yellow-600',
  danger: 'bg-red-500/10 ring-red-500/20 text-red-500',
  info: 'bg-blue-500/10 ring-blue-500/20 text-blue-500',
  accent: 'bg-accent/10 ring-accent/20 text-accent'
};

const sizes = {
  default: 'px-2 py-1 text-xs rounded-md',
  sm: 'px-1.5 py-0.5 text-xs rounded-md',
  lg: 'px-2.5 py-1.5 text-sm rounded-lg'
};
</script>
