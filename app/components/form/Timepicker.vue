<template>
  <div>
    <div class="form-input flex items-center">
      <AppIcon v-if="!noIcon" :name="icon" class="mr-2 size-4 shrink-0" />

      <input
        v-model="model"
        class="appearance-none outline-none [&::-webkit-calendar-picker-indicator]:hidden"
        type="time"
        :name
        step="2"
      />

      <template v-if="range">
        <span class="cursor-default select-none">-&nbsp;</span>

        <input
          v-model="model"
          class="appearance-none outline-none [&::-webkit-calendar-picker-indicator]:hidden"
          type="time"
          :name
          step="2"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel({ required: true });

const props = withDefaults(
  defineProps<{
    name?: string;
    step?: number;
    icon?: string;
    noIcon?: boolean;
    range?: boolean;
  }>(),
  {
    icon: 'clock'
  }
);
</script>
