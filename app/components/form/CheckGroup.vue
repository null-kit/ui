<template>
  <div class="relative flex shrink-0 flex-col" :title="props.readonly ? 'Readonly' : undefined">
    <div v-if="label" class="form-label">
      <slot name="label-left" />

      {{ label }}

      <AppAppear v-if="required && !model">
        <span title="Required" class="form-required" />
      </AppAppear>

      <slot name="label-right" />
    </div>

    <div v-if="options && options.length > 0" class="btn-group" :class="groupClass">
      <slot name="left" />

      <label v-for="(option, index) in options" :key="index" class="btn">
        <input
          v-model="model"
          class="peer checked:bg-accent/5 absolute inset-0 appearance-none disabled:cursor-not-allowed"
          :class="props.readonly ? 'cursor-default' : 'cursor-pointer'"
          :value="toLowerCase(option)"
          :type="type"
          :name="name"
          :disabled="disabled"
          :readonly="props.readonly"
          @click="onClick($event, option)"
        />

        <span
          class="peer-checked:text-accent duration-200 peer-disabled:opacity-50"
          :class="{ 'flex items-center gap-2': $slots[toLowerCase(option)] }"
        >
          {{ getKeyName(option) }}

          <slot :name="toLowerCase(option)" />
        </span>
      </label>

      <slot name="right" />
    </div>

    <AppAppear v-if="!label && required && !model">
      <span title="Required" class="form-required-floating" />
    </AppAppear>

    <FormValidate v-if="name" :name :class="validateClass" />

    <div v-if="help || $slots.help" class="form-help">
      <slot name="help">{{ help }} </slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends string | Record<string, string | number>">
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
    validateClass?: string;
  }>(),
  {
    type: 'radio'
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
  return props.keyValue && typeof option === 'object' ? option[props.keyValue] : option;
};

const getKeyName = (option: T) => {
  return props.keyName && typeof option === 'object' ? option[props.keyName] : option;
};

const toLowerCase = (value: T) => {
  const keyValue = String(getKeyValue(value));

  return modifiers.lowercase ? keyValue.toLowerCase().replace(/\s+/g, '-') : keyValue;
};

const onClick = (event: Event, option: T) => {
  if (props.readonly) return event.preventDefault();

  if (toLowerCase(model.value as T) === toLowerCase(option) && !props.noToggle) {
    model.value = undefined;
  }
};

onMounted(() => {
  if (props.keyValue && Array.isArray(model.value)) {
    model.value = model.value.map(getKeyValue) as T[];
  }

  if (!model.value && props.value) {
    model.value = (Array.isArray(props.value) ? props.value.map(toLowerCase) : toLowerCase(props.value as T)) as T;
  }
});
</script>
