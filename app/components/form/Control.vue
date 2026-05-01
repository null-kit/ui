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

    <div class="form-control relative flex">
      <div v-if="slots.left" class="form-slot rounded-r-none">
        <slot name="left" />
      </div>

      <div class="relative w-full">
        <template v-if="type === 'select'">
          <select
            v-model="model"
            class="form-input"
            :class="[inputClass, 'pr-7', hasSlotStyle($slots)]"
            v-bind="{ id, name, disabled }"
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
          ref="input"
          v-model="model"
          class="form-input flex"
          :class="[inputClass, hasSlotStyle($slots)]"
          rows="3"
          v-bind="{ id, name, placeholder, disabled, readonly, pattern, autocomplete }"
        />

        <input
          v-else
          ref="input"
          v-model="model"
          class="form-input"
          :class="[inputClass, hasSlotStyle($slots)]"
          :type="type === 'number' ? 'text' : type"
          v-bind="{ id, name, placeholder, disabled, readonly, accept, pattern, step, min, max, autocomplete }"
          @input="onInput"
          @focusout="onFocusOut"
        />

        <FormValidate v-if="name" :name :class="validateClass" />

        <AppAppear v-if="!label && required && !model">
          <span title="Required" class="form-required-floating" />
        </AppAppear>
      </div>

      <div v-if="slots.right" class="form-slot rounded-l-none">
        <slot name="right" />
      </div>
    </div>

    <div v-if="help || $slots.help" class="form-help">
      <slot name="help">{{ help }} </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const [model, modifiers] = defineModel<string | number | null>({
  set(value) {
    if (typeof value === 'string' && modifiers.spaceToComma) return value.replace(/ /g, ',');

    return value;
  }
});

const id = useId();
const slots = useSlots();

const {
  type = 'text',
  name,
  inputClass,
  value,
  min,
  max,
  autofocus
} = defineProps<{
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select';
  name?: string;
  placeholder?: string;
  autocomplete?: string;
  autofocus?: boolean;
  help?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  accept?: string;
  pattern?: string;
  step?: string;
  min?: string | number;
  max?: string | number;
  value?: string | number | null;
  inputClass?: string;
  validateClass?: string;
}>();

const onInput = (event: Event) => {
  if (type === 'number') {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^\d.]/g, '');

    model.value = value || undefined;
    input.value = value;
  }
};

const onFocusOut = () => {
  if (typeof model.value === 'string' && modifiers.spaceToComma) {
    model.value = model.value.replace(/,{2,}/g, ',').replace(/^,+|,+$/g, '');
  }

  if (type === 'number') {
    const value = Number(model.value);

    if (min && value < Number(min)) {
      model.value = min;
    }

    if (max && value > Number(max)) {
      model.value = max;
    }
  }
};

const hasSlotStyle = (slot: { left?: boolean; right?: boolean }) => {
  return [slot.left && 'rounded-l-none', slot.right && 'rounded-r-none'].filter(Boolean);
};

const input = useTemplateRef('input');

onMounted(() => {
  if (value) model.value = value;

  if (autofocus) setTimeout(() => input.value?.focus({ preventScroll: true }), 100);
});
</script>
