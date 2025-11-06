<template>
  <FormDatepicker v-model="model" v-bind="{ ...props }" />
</template>

<script setup lang="ts">
// @deprecated component use FormDatepicker

type Preset = 'today' | 'yesterday' | 'last-week' | 'this-month' | 'this-month-today' | 'last-month';

const props = defineProps<{
  range?: boolean;
  disabledDates?: Date[];
  dateMode?: boolean | 'short';
  iso?: boolean;
  preset?: Preset;
  maxToday?: boolean;
}>();

const [model, modifiers] = defineModel<Date | Date[] | string | string[] | undefined>({
  required: true,
  set(value) {
    if (value && modifiers.iso) {
      if (Array.isArray(value)) return value.map((date) => formatDate(date, { format: 'iso' }));

      return formatDate(value, { format: 'iso' });
    }

    return value;
  }
});
</script>
