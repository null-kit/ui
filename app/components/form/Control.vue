<template>
  <div class="flex flex-col text-left">
    <label v-if="label" :for="id" class="form-label">
      <slot name="label-left" />

      {{ label }}

      <AppAppear v-if="required && !model">
        <span title="Required" class="form-required" />
      </AppAppear>

      <slot name="label-right" />
    </label>

    <div class="relative flex">
      <div v-if="slots.left" class="form-slot rounded-r-none">
        <slot name="left" />
      </div>

      <div class="relative w-full">
        <template v-if="type === 'select'">
          <select
            :id
            v-model="model"
            class="form-input"
            :class="[inputClass, 'pr-7', hasSlotStyle($slots)]"
            :name
            :disabled
          >
            <option selected disabled value>{{ placeholder }}</option>

            <slot />
          </select>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            class="text-surface/30 pointer-events-none absolute top-0 right-2 size-4 h-full"
          >
            <path fill="none" stroke="currentColor" stroke-width="3" d="m10 22 6 6 6-6m-12-12 6-6 6 6" />
          </svg>
        </template>

        <textarea
          v-else-if="type === 'textarea'"
          :id
          v-model="model"
          class="form-input flex"
          :class="[inputClass, hasSlotStyle($slots)]"
          rows="3"
          :name
          :placeholder
          :disabled
          :pattern
        />

        <input
          v-else
          :id
          v-model="model"
          class="form-input"
          :class="[inputClass, hasSlotStyle($slots)]"
          :name
          :type="type === 'number' ? 'text' : type"
          :placeholder
          :disabled
          :accept
          :pattern
          :step
          @input="onInput"
        />

        <FormValidate v-if="name" :name />
      </div>

      <div v-if="slots.right" class="form-slot rounded-l-none">
        <slot name="right" />
      </div>

      <AppAppear v-if="!label && required && !model">
        <span title="Required" class="form-required-floating" />
      </AppAppear>
    </div>

    <div v-if="help || $slots.help" class="form-help">
      <slot name="help">{{ help }} </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string | number | null>();

const id = useId();
const slots = useSlots();

const {
  type = 'text',
  name,
  inputClass,
  value
} = defineProps<{
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select';
  name?: string;
  placeholder?: string;
  inputClass?: string;
  help?: string;
  disabled?: boolean;
  required?: boolean;
  accept?: string;
  pattern?: string;
  step?: string;
  value?: string | number | null;
}>();

const onInput = (event: Event) => {
  if (type === 'number') {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^\d.]/g, '');

    model.value = value || undefined;
    input.value = value;
  }
};

const hasSlotStyle = (slot: { left?: boolean; right?: boolean }) => {
  return [slot.left && 'rounded-l-none', slot.right && 'rounded-r-none'].filter(Boolean);
};

onMounted(() => {
  if (value) model.value = value;
});
</script>
