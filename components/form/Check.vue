<template>
  <label class="relative inline-flex flex-wrap whitespace-break-spaces">
    <span class="inline-flex items-center gap-2 text-sm">
      <span :class="['relative flex shrink-0', disabled ? 'cursor-not-allowed' : 'cursor-pointer']">
        <input
          v-model="model"
          :class="[
            'peer bg-darwin checked:ring-accent cursor-pointer appearance-none ring duration-200',
            'disabled:bg-edison/20 disabled:ring-edison disabled:cursor-not-allowed',
            isSwitch || type === 'radio' ? 'rounded-full' : 'rounded-md',
            isSwitch ? 'checked:bg-accent h-6 w-11' : 'size-5 not-disabled:shadow',
            indeterminate ? 'ring-accent' : 'ring-edison'
          ]"
          :type="type"
          :name="name"
          :value="value"
          :disabled="disabled"
          :checked="checked || isChecked"
        />

        <span
          v-if="isSwitch"
          class="bg-edison absolute inset-0.5 size-5 rounded-full duration-200 peer-checked:translate-x-full"
          :class="{ 'peer-checked:bg-white': !disabled }"
        />

        <svg
          v-else
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          :class="['absolute inset-0 size-full p-1', disabled ? 'text-edison' : 'text-accent']"
        >
          <circle
            v-if="type === 'radio'"
            fill="currentColor"
            cx="16"
            cy="16"
            r="12"
            :class="['duration-300', model === value ? 'opacity-100' : 'opacity-0']"
          />

          <path
            v-else
            fill="none"
            stroke-width="4"
            d="m5 18 7 7L28 9"
            class="duration-300"
            stroke="currentColor"
            stroke-dasharray="32"
            stroke-linecap="round"
            :style="`stroke-dashoffset:${isChecked ? 0 : 31}; opacity:${isChecked && !indeterminate ? 1 : 0}`"
          />

          <rect v-if="indeterminate" x="5" y="14" width="22" height="4" fill="currentColor" />
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
const model = defineModel<boolean | string | number | string[] | number[]>();

const {
  type = 'checkbox',
  checked,
  value
} = defineProps<{
  label?: string;
  type?: 'checkbox' | 'radio';
  name: string;
  value?: string | number | boolean;
  isSwitch?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  checked?: boolean;
  help?: string;
}>();

const isChecked = computed(() => {
  if (Array.isArray(model.value) && value) {
    return model.value.map(String).includes(String(value));
  }

  return Boolean(model.value);
});

onMounted(() => {
  model.value = value ? value : Boolean(model.value);
});
</script>
