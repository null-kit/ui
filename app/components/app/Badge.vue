<template>
  <span class="badge" :class="[types[type], size && sizes[size]]" :aria-label="`badge-${type}`" role="badge">
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
  size = undefined,
  icon = undefined
} = defineProps<{
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
  label?: string | number;
  icon?: string;
  size?: 'sm' | 'lg';
}>();

const types = {
  default: 'badge-default',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  accent: 'badge-accent'
};

const sizes = {
  sm: 'badge-sm',
  lg: 'badge-lg'
};
</script>
