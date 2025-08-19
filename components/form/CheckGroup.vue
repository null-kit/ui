<template>
  <div class="relative flex w-fit shrink-0 flex-col">
    <div v-if="label" class="form-label mb-2">
      <slot name="label-left" />

      {{ label }}

      <span v-if="required" title="Required field" class="form-required">*</span>

      <slot name="label-right" />
    </div>

    <div v-if="options && options.length > 0" class="btn-group bg-darwin" :class="groupClass">
      <slot name="left" />

      <label v-for="(option, index) in options" :key="index" class="btn">
        <input
          v-model="model"
          class="peer checked:bg-accent/5 absolute inset-0 cursor-pointer appearance-none disabled:cursor-not-allowed"
          :value="toLowerCase(option)"
          :type="type"
          :name="name"
          :disabled="disabled"
          @click="onClick(option)"
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

    <FormValidate v-if="name" :name />
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
    groupClass?: string;
    disabled?: boolean;
  }>(),
  {
    type: 'radio'
  }
);

const [model, modifiers] = defineModel<T | T[], 'lowercase'>({
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

const onClick = (option: T) => {
  if (model.value === toLowerCase(option)) {
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
