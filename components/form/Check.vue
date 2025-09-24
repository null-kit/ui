<template>
  <label class="relative inline-flex flex-wrap whitespace-break-spaces">
    <span class="group inline-flex items-center gap-2 text-sm">
      <span :class="['relative flex shrink-0', disabled ? 'cursor-not-allowed' : 'cursor-pointer']">
        <input
          v-model="model"
          :class="[
            'bg-darwin checked:ring-accent cursor-pointer appearance-none ring duration-200',
            'disabled:bg-edison/20 disabled:ring-edison disabled:cursor-not-allowed',
            isSwitch || type === 'radio' ? 'rounded-full' : 'rounded-md',
            isSwitch ? 'checked:bg-accent h-6 w-11' : 'size-5 not-disabled:shadow',
            indeterminate ? 'ring-accent' : 'ring-edison'
          ]"
          v-bind="{
            type,
            name,
            value,
            disabled,
            indeterminate,
            ...(trueValue !== undefined && { 'true-value': trueValue }),
            ...(falseValue !== undefined && { 'false-value': falseValue })
          }"
        />

        <span
          v-if="isSwitch"
          class="bg-edison absolute inset-0.5 size-5 rounded-full duration-200 group-has-checked:translate-x-full"
          :class="{ 'group-has-checked:bg-darwin': !disabled }"
        />

        <svg
          v-else
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          class="group-has-disabled:text-edison text-accent absolute inset-0 size-full p-1"
        >
          <circle
            v-if="type === 'radio'"
            fill="currentColor"
            cx="16"
            cy="16"
            r="12"
            class="opacity-0 duration-300 group-has-checked:opacity-100"
          />

          <rect v-else-if="indeterminate" x="5" y="14" width="22" height="4" fill="currentColor" />

          <path
            v-else
            fill="none"
            stroke-width="4"
            d="m5 18 7 7L28 9"
            class="duration-300 group-has-checked:opacity-100 group-has-checked:[stroke-dashoffset:0]"
            stroke="currentColor"
            opacity="0"
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

    <div v-if="help || $slots.help" class="form-help mt-1 w-full">
      <slot name="help">{{ help }}</slot>
    </div>
  </label>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    type?: 'checkbox' | 'radio';
    name?: string;
    value?: string | number | boolean | null;
    isSwitch?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    help?: string;
    trueValue?: string | number;
    falseValue?: string | number;
  }>(),
  {
    type: 'checkbox'
  }
);

const model = defineModel<boolean | string | number | string[] | number[]>();

onMounted(() => {
  if (!model.value && props.value) model.value = Boolean(props.value);
  if (props.trueValue !== undefined && Boolean(model.value)) model.value = props.trueValue;
  if (props.falseValue !== undefined && !Boolean(model.value)) model.value = props.falseValue;
});
</script>
