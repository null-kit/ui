<template>
  <div class="w-fit shrink-0">
    <div v-if="label" class="form-label mb-2">
      {{ label }}
      <span v-if="required" title="Required field" class="form-required">*</span>
    </div>

    <div v-if="options && options.length > 0" class="btn-group bg-darwin">
      <label v-for="(option, index) in options" :key="index" class="btn rounded-none">
        <input
          v-model="model"
          class="peer checked:bg-accent/5 absolute inset-0 cursor-pointer appearance-none"
          :type="type"
          :name="name"
          :value="modifiers.lowercase ? option.toLowerCase() : option"
        />

        <span class="peer-checked:text-accent text-sm font-medium duration-200">{{ option }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const [model, modifiers] = defineModel<string | string[] | undefined>({
  required: true,
  set(value) {
    if (value && modifiers.lowercase) {
      if (Array.isArray(value)) return value.map((option) => option.toLowerCase());

      return value.toLowerCase();
    }

    return value;
  }
});

const { type = 'radio' } = defineProps<{
  options: string[];
  label?: string;
  name?: string;
  type?: 'checkbox' | 'radio';
  keyName?: string;
  keyValue?: string;
  required?: boolean;
}>();
</script>
