<template>
  <div class="flex flex-col text-left">
    <label v-if="label" :for="id" class="form-label">
      <slot name="label-left" />

      {{ label }}

      <span v-if="required" title="Required field" class="form-required" />

      <slot name="label-right" />
    </label>

    <div class="form-input flex gap-2">
      <input
        type="range"
        v-model="model"
        :min
        :max
        :step
        class="ring-edison my-auto h-2 w-full appearance-none rounded ring outline-none"
      />

      <input type="number" v-model="model" class="w-10 appearance-none text-center outline-none" @input="onInput" />
    </div>

    <FormValidate v-if="name" :name />
  </div>
</template>

<script setup lang="ts">
const id = useId();

const model = defineModel<number>();

const props = withDefaults(
  defineProps<{
    label?: string;
    name?: string;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
  }>(),
  {
    required: false
  }
);

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (props.min && Number(input.value) < props.min) {
    model.value = props.min;
  }

  if (props.max && Number(input.value) > props.max) {
    model.value = props.max;
  }
};
</script>

<style scoped>
input[type='range'] {
  &::-webkit-slider-thumb {
    cursor: grab;
    appearance: none;
    width: 0.75rem;
    height: 1.5rem;
    transition: border-color 0.2s ease-in-out;
    border: 1px solid color-mix(in oklab, var(--color-surface) 20%, transparent);
    border-radius: var(--radius-md);
    background: var(--color-darwin);
    box-shadow: var(--shadow-sm);
  }

  &::-moz-range-thumb {
    cursor: grab;
    appearance: none;
    width: 0.75rem;
    height: 1.5rem;
    transition: border-color 0.2s ease-in-out;
    border: 1px solid color-mix(in oklab, var(--color-surface) 20%, transparent);
    border-radius: var(--radius-md);
    background: var(--color-darwin);
    box-shadow: var(--shadow-sm);
  }

  &::-webkit-slider-thumb:active {
    border-color: var(--color-accent);
    cursor: grabbing;
  }

  &::-moz-range-thumb:active {
    border-color: var(--color-accent);
    cursor: grabbing;
  }
}
</style>
