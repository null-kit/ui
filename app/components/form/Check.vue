<template>
  <label class="relative inline-flex flex-wrap whitespace-break-spaces">
    <span class="inline-flex items-center gap-2 text-sm" :class="{ 'cursor-not-allowed opacity-50': disabled }">
      <span class="relative flex shrink-0">
        <input
          v-model="model"
          v-bind="{
            type,
            name,
            disabled,
            indeterminate,
            ...(trueValue !== undefined && { 'true-value': trueValue }),
            ...(falseValue !== undefined && { 'false-value': falseValue })
          }"
          class="form-check peer"
          :aria-label="isSwitch ? 'switch' : undefined"
        />

        <span v-if="isSwitch" class="form-switch" />

        <svg
          v-else
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          class="group absolute inset-0 size-full p-1 opacity-0 duration-300 peer-checked:opacity-100"
        >
          <circle v-if="type === 'radio'" fill="currentColor" cx="16" cy="16" r="12" />

          <rect v-else-if="indeterminate" x="5" y="14" width="22" height="4" fill="currentColor" />

          <path
            v-else
            fill="none"
            stroke-width="4"
            d="m5 18 7 7L28 9"
            class="duration-300 group-peer-checked:[stroke-dashoffset:0]"
            stroke="currentColor"
            stroke-dashoffset="31"
            stroke-dasharray="32"
            stroke-linecap="round"
          />
        </svg>
      </span>

      <slot name="label-left" />
      <slot>{{ label }}</slot>
      <slot name="label-right" />
    </span>

    <FormValidate v-if="name" :name />

    <div v-if="help || $slots.help" class="form-help w-full">
      <slot name="help">{{ help }}</slot>
    </div>
  </label>
</template>

<script setup lang="ts" generic="T">
const props = withDefaults(
  defineProps<{
    label?: string;
    type?: 'checkbox' | 'radio';
    name?: string;
    value?: T;
    isSwitch?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    help?: string;
    trueValue?: string | number | null;
    falseValue?: string | number | null;
    lazy?: boolean;
  }>(),
  {
    type: 'checkbox'
  }
);

const model = defineModel();

watch(
  () => props.value,
  (value) => {
    if (value !== undefined) model.value = Boolean(value);
  },
  { immediate: true }
);

onMounted(() => {
  if (props.trueValue !== undefined && Boolean(model.value)) model.value = props.trueValue;
  if (props.falseValue !== undefined && !model.value) model.value = props.falseValue;
});
</script>
