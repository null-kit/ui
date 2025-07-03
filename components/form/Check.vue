<template>
  <label class="relative inline-block whitespace-break-spaces">
    <span class="inline-flex items-center gap-3 text-sm">
      <span :class="['relative flex shrink-0', disabled ? 'cursor-not-allowed' : 'cursor-pointer']">
        <input
          v-model="model"
          :class="[
            'peer checked:ring-accent cursor-pointer appearance-none ring duration-200',
            'disabled:bg-newton disabled:ring-edison/50 disabled:cursor-not-allowed',
            isSwitch || type === 'radio' ? 'rounded-full' : 'rounded-md',
            isSwitch ? 'bg-darwin checked:bg-accent h-6 w-11' : 'size-5 shadow',
            indeterminate ? 'ring-accent' : 'ring-edison'
          ]"
          :type="type"
          :name="name"
          :value="value"
          :disabled="disabled"
          :checked="checked"
        />

        <span
          v-if="isSwitch"
          class="bg-edison absolute inset-0.5 size-5 rounded-full duration-200 peer-checked:translate-x-full"
          :class="{ 'peer-checked:bg-white': !disabled }"
        />

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
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

      <slot>
        {{ label }}
      </slot>
    </span>

    <FormValidate v-if="name" :name />

    <div v-if="help || $slots.help" class="form-help">
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
  value?: string | number;
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

  return model.value;
});
</script>
