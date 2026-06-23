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

      <div class="relative w-full min-w-0">
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
          :class="[inputClass, hasSlotStyle($slots), size && sizeClasses[size]]"
          rows="3"
          v-bind="{ id, name, placeholder, disabled, readonly, pattern, autocomplete }"
          @input="onInput"
        />

        <input
          v-else
          ref="input"
          v-model="model"
          class="form-input"
          :class="[inputClass, hasSlotStyle($slots), size && sizeClasses[size]]"
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
    if (typeof value === 'string' && modifiers.clearSpaces) return value.replace(/\s/g, '');

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
  size?: 'xs' | 'sm' | 'md' | 'lg';
}>();

const onInput = (event: InputEvent) => {
  const isPaste = event.inputType === 'insertFromPaste';

  const input = event.target as HTMLInputElement;
  const inputValue = isPaste ? String(event.data) : input.value;

  if (type === 'number') {
    const value = inputValue.replace(/[^\d.]/g, '');

    model.value = value ?? undefined;
    input.value = value;

    return;
  }

  if (max && inputValue.length > Number(max)) {
    const cropped = inputValue.slice(0, Number(max));

    model.value = cropped;
    input.value = cropped;
  }
};

const onFocusOut = () => {
  const value = model.value;

  if (typeof value === 'string' && modifiers.spaceToComma) {
    model.value = value.replace(/,{2,}/g, ',').replace(/^,+|,+$/g, '');
  }

  if (typeof value === 'string' && modifiers.clearSpaces) {
    model.value = value.replace(/\s/g, '');
  }

  if (type === 'number') {
    if (min !== undefined && Number(value) < Number(min)) model.value = min;
    if (max !== undefined && Number(value) > Number(max)) model.value = max;
  }

  if (typeof value === 'string' && max !== undefined && value.length > Number(max)) {
    model.value = value.slice(0, Number(max));
  }

  if (type === 'number' && typeof value === 'string' && value === '') {
    model.value = undefined;
  }
};

const hasSlotStyle = (slot: { left?: boolean; right?: boolean }) => {
  return [slot.left && 'rounded-l-none', slot.right && 'rounded-r-none'].filter(Boolean);
};

const input = useTemplateRef('input');

const sizeClasses = {
  xs: 'form-input-xs',
  sm: 'form-input-sm',
  md: 'form-input-md',
  lg: 'form-input-lg'
};

onMounted(() => {
  if (value) model.value = value;

  if (type === 'number' && typeof model.value === 'string') model.value = Number(model.value);

  if (autofocus) setTimeout(() => input.value?.focus({ preventScroll: true }), 100);
});
</script>
