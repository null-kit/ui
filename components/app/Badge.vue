<template>
  <span
    class="inline-flex items-center justify-center gap-1.5 font-medium ring ring-inset"
    :class="[type && styles[type], size && sizes[size]]"
  >
    <slot>
      <slot name="icon">
        <AppIcon v-if="icon" :name="icon" class="size-3" />
      </slot>

      <slot name="label">
        {{ label }}
      </slot>
    </slot>
  </span>
</template>

<script setup lang="ts">
const {
  type = 'default',
  label = 'Badge',
  size = 'default',
  icon = undefined
} = defineProps<{
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  label?: string | number;
  icon?: string;
  size?: 'default' | 'sm' | 'lg';
}>();

const styles = {
  default: 'bg-darwin ring-edison shadow-xs dark:shadow-black/20',
  success: 'bg-green-500/10 ring-green-500/20 text-green-600',
  warning: 'bg-yellow-500/10 ring-yellow-500/20 text-yellow-600',
  danger: 'bg-red-500/10 ring-red-500/20 text-red-500',
  info: 'bg-blue-500/10 ring-blue-500/20 text-blue-500'
};

const sizes = {
  default: 'px-2 py-1 text-xs rounded-md',
  sm: 'px-1.5 py-0.5 text-xs rounded-md',
  lg: 'px-2.5 py-1.5 text-sm rounded-lg'
};
</script>
