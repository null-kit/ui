<template>
  <div class="relative flex shrink-0 flex-col" :title="props.readonly ? 'Readonly' : undefined">
    <div v-if="label" class="form-label">
      <slot name="label-left" />

      {{ label }}

      <AppAppear v-if="required && !hasSelection">
        <span title="Required" class="form-required" />
      </AppAppear>

      <slot name="label-right" />
    </div>

    <div v-if="options && options.length > 0" class="form-check-group" :class="groupClass">
      <slot name="left" />

      <label v-for="(option, index) in options" :key="index" :class="btnClass">
        <input
          v-model="model"
          class="sr-only"
          :value="toLowerCase(option)"
          v-bind="{ type, name, disabled, readonly }"
          @click="onClick($event, option)"
          @keydown="onKeydown"
        />

        {{ getKeyName(option) }}

        <slot :name="toLowerCase(option)" />
      </label>

      <slot name="right" />
    </div>

    <AppAppear v-if="!label && required && !hasSelection">
      <span title="Required" class="form-required-floating" />
    </AppAppear>

    <FormValidate v-if="name" :name :class="validateClass" />

    <div v-if="help || $slots.help" class="form-help">
      <slot name="help">{{ help }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
const props = withDefaults(
  defineProps<{
    options: T[];
    label?: string;
    name?: string;
    type?: 'checkbox' | 'radio';
    value?: T | T[] | number;
    keyName?: keyof T;
    keyValue?: keyof T;
    required?: boolean;
    disabled?: boolean;
    help?: string;
    readonly?: boolean;
    noToggle?: boolean;
    groupClass?: string;
    btnClass?: string;
    validateClass?: string;
  }>(),
  {
    type: 'radio',
    readonly: false
  }
);

const [model, modifiers] = defineModel<unknown, 'lowercase' | 'number'>({
  set(value) {
    if (value && modifiers.lowercase) {
      return Array.isArray(value) ? value.map(toLowerCase) : toLowerCase(value as T);
    }
    return value;
  }
});

const getKeyValue = (option: T) => {
  return props.keyValue && typeof option === 'object' ? (option?.[props.keyValue] as T) : option;
};

const getKeyName = (option: T) => {
  return props.keyName && typeof option === 'object' ? (option?.[props.keyName] as T) : option;
};

const toLowerCase = (value: T) => {
  const keyValue = String(getKeyValue(value));

  return modifiers.lowercase ? keyValue.toLowerCase().replace(/\s+/g, '-') : keyValue;
};

const selectedValues = computed(() => {
  if (props.type !== 'checkbox') return [];

  if (!Array.isArray(model.value)) return model.value ? [model.value] : [];

  return model.value;
});

const hasSelection = computed(() => {
  if (props.type === 'checkbox') return selectedValues.value.length > 0;

  return Boolean(model.value);
});

const isOptionSelected = (option: T) => {
  const optionValue = toLowerCase(option);

  if (props.type === 'checkbox') {
    return selectedValues.value.some((value) => toLowerCase(value as T) === optionValue);
  }

  return toLowerCase(model.value as T) === optionValue;
};

const onClick = (event: Event, option: T) => {
  if (props.readonly) return event.preventDefault();

  if (props.type === 'checkbox') {
    if (props.noToggle && isOptionSelected(option) && selectedValues.value.length === 1) {
      event.preventDefault();
    }

    return;
  }

  if (isOptionSelected(option) && !props.noToggle) {
    model.value = undefined;
  }
};

const onKeydown = (event: KeyboardEvent) => {
  if (props.readonly && (event.key === ' ' || event.key === 'Enter')) event.preventDefault();
};

onMounted(() => {
  if (props.type === 'checkbox') {
    if (props.keyValue && Array.isArray(model.value)) {
      model.value = model.value.map(getKeyValue);
    } else if (model.value !== undefined && model.value !== null && !Array.isArray(model.value)) {
      model.value = [toLowerCase(model.value as T)];
    } else if (!hasSelection.value && props.value) {
      model.value = Array.isArray(props.value)
        ? props.value.map((value) => toLowerCase(value as T))
        : [toLowerCase(props.value as T)];
    } else if (!model.value) {
      model.value = [];
    }

    return;
  }

  if (props.keyValue && Array.isArray(model.value)) {
    model.value = model.value.map(getKeyValue) as T[];
  }

  if (!model.value && props.value) {
    model.value = (Array.isArray(props.value) ? props.value.map(toLowerCase) : toLowerCase(props.value as T)) as T;
  }
});
</script>
