<template>
  <div class="flex w-fit shrink-0 flex-col">
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
          class="peer checked:bg-accent/5 absolute inset-0 cursor-pointer appearance-none"
          :value="toLowerCase(option)"
          :type="type"
          :name="name"
        />

        <span
          class="peer-checked:text-accent duration-200"
          :class="{ 'flex items-center gap-2': $slots[toLowerCase(option)] }"
        >
          {{ getKeyName(option) }}

          <slot :name="toLowerCase(option)" />
        </span>
      </label>

      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="V, T extends string | Record<string, string | number>">
const props = withDefaults(
  defineProps<{
    options: T[];
    label?: string;
    name?: string;
    type?: 'checkbox' | 'radio';
    value?: V;
    keyName?: keyof T;
    keyValue?: keyof T;
    required?: boolean;
    groupClass?: string;
  }>(),
  {
    type: 'radio'
  }
);

const [model, modifiers] = defineModel<T | T[] | undefined, 'lowercase'>({
  get(value) {
    if (value && value.length === 0 && props.value) return props.value as T | T[];

    if (props.value) return props.value as T | T[];

    if (!value && props.type === 'checkbox') return Array.isArray(value) ? value : [];

    return value;
  },
  set(value) {
    if (value) return Array.isArray(value) ? value.map(toLowerCase) : toLowerCase(value);
  }
});

const getKeyValue = (option: T): T => {
  return props.keyValue && typeof option === 'object' ? (option[props.keyValue] as T) : option;
};

const getKeyName = (option: T) => {
  return props.keyName && typeof option === 'object' ? option[props.keyName] : option;
};

const toLowerCase = (value: T) => {
  const keyValue = String(getKeyValue(value));

  return modifiers.lowercase ? keyValue.toLowerCase().replace(/\s+/g, '-') : keyValue;
};

onMounted(() => {
  if (props.keyValue && Array.isArray(model.value)) {
    model.value = model.value.map((item) => getKeyValue(item));
  }
});
</script>
