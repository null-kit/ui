<template>
  <div class="flex w-fit shrink-0 flex-col">
    <div v-if="label" class="form-label mb-2">
      {{ label }}
      <span v-if="required" title="Required field" class="form-required">*</span>
    </div>

    <div v-if="options && options.length > 0" class="btn-group bg-darwin">
      <slot name="left" />

      <label v-for="(option, index) in options" :key="index" class="btn">
        <input
          v-model="model"
          class="peer checked:bg-accent/5 absolute inset-0 cursor-pointer appearance-none"
          :value="toLowerCase(option)"
          :type="type"
          :name="name"
        />

        <span class="peer-checked:text-accent duration-200">{{ option }}</span>
      </label>

      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
const { type = 'radio', options } = defineProps<{
  options: T[];
  label?: string;
  name?: string;
  type?: 'checkbox' | 'radio';
  keyName?: string;
  keyValue?: string;
  required?: boolean;
}>();

const [model, modifiers] = defineModel<T | T[] | undefined, 'lowercase'>({
  required: true,
  get(value) {
    if (type === 'checkbox') return Array.isArray(value) ? value : [];

    return value;
  },
  set(value) {
    if (value) return Array.isArray(value) ? value.map(toLowerCase) : toLowerCase(value);
  }
});

const toLowerCase = (value: T) => (modifiers.lowercase ? value.toLowerCase() : value);
</script>
