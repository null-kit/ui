<template>
  <span class="flex items-baseline gap-2 ring ring-inset" :class="[type && styles[type], size && sizes[size]]">
    <slot>
      <slot name="icon">
        <AppIcon v-if="icon" :name="icon" class="relative top-0.5 size-3.5 shrink-0" />
      </slot>

      <div class="flex w-full flex-col gap-1">
        <slot name="label">
          <span v-if="label" class="font-semibold">{{ label }}</span>
        </slot>

        <slot name="message">
          {{ message }}
        </slot>
      </div>
    </slot>
  </span>
</template>

<script setup lang="ts">
const {
  type = 'default',
  label,
  message,
  size = 'default',
  icon = undefined
} = defineProps<{
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
  label?: string | number;
  message?: string | number;
  icon?: string;
  size?: 'default';
}>();

const styles = {
  default: 'bg-darwin ring-edison shadow-xs dark:shadow-black/20',
  success: 'bg-green-500/10 ring-green-500/20 text-green-600',
  warning: 'bg-yellow-500/10 ring-yellow-500/20 text-yellow-600',
  danger: 'bg-red-500/10 ring-red-500/20 text-red-500',
  info: 'bg-blue-500/10 ring-blue-500/20 text-blue-500',
  accent: 'bg-accent/10 ring-accent/20 text-accent'
};

const sizes = {
  default: 'px-3 py-2 text-sm rounded-lg'
};
</script>
