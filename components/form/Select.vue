<template>
  <div class="relative flex flex-col space-y-2">
    <span v-if="label" class="form-label">
      <slot name="label-left" />

      {{ label }}

      <span v-if="required" title="Required field" class="form-required">*</span>

      <slot name="label-right" />
    </span>

    <AppDropdown :autoclose :placement>
      <template #trigger="{ isOpen }">
        <button type="button" :class="['select-input', inputClass, { 'ring-accent': isOpen }]">
          <span v-if="multiple" class="select-multiple flex flex-wrap items-center gap-2 font-medium">
            <span v-for="(option, index) in selected" :key="index" class="btn btn-sm btn-default min-h-auto">
              {{ getKeyName(option) }}

              <svg
                v-if="selected.length > 1"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                class="size-3 shrink-0 cursor-pointer text-current/50 hover:text-red-500"
                @click.stop="toggleOption(option)"
              >
                <path stroke-width="3" stroke="currentColor" d="M25 7 7 25m18 0L7 7" />
              </svg>
            </span>
          </span>

          <span v-for="(option, index) in selected" v-else :key="index" class="font-medium">
            {{ getKeyName(option) }}
          </span>

          <span v-if="!selected.length" class="whitespace-nowrap">{{ placeholder }}</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            class="pointer-events-none absolute top-0 right-2 size-4 h-full opacity-50"
          >
            <polyline points="10 22 16 28 22 22" fill="none" stroke="currentColor" stroke-width="3" />
            <polyline points="10 10 16 4 22 10" fill="none" stroke="currentColor" stroke-width="3" />
          </svg>
        </button>

        <FormValidate v-if="name" :name />
      </template>

      <input v-if="search" v-model="searchInput" class="form-input mb-1" placeholder="Search" />

      <div
        v-if="hasOptions"
        class="scrollbar flex max-h-96 min-w-40 shrink-0 flex-col gap-1 overflow-auto whitespace-nowrap"
      >
        <template v-for="(optionGroup, indexParent) in filteredOptions" :key="indexParent">
          <div v-if="typeof optionGroup === 'object' && optionGroup.group" class="select-group-label">
            {{ optionGroup.group }}
          </div>

          <template v-for="(option, index) in optionGroup.list" :key="index">
            <div
              v-if="!(typeof option === 'object' && option.excluded)"
              class="btn cursor-pointer justify-start"
              :class="{ 'bg-current/5 font-medium': isSelected(option), '-order-1': isSelected(option) && order }"
              @click="toggleOption(option)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-4 shrink-0">
                <path
                  fill="none"
                  stroke-width="3"
                  d="m5 18 7 7L27 9"
                  class="duration-300"
                  stroke="currentColor"
                  stroke-dasharray="32"
                  :style="`stroke-dashoffset:${isSelected(option) ? 0 : 32}`"
                />
              </svg>

              <slot name="option" :value="option">{{ getKeyName(option) }}</slot>
            </div>
          </template>
        </template>
      </div>

      <div v-else class="p-4 text-center opacity-40">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="mb-2 inline-block size-5">
          <circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" stroke-width="3" />
          <line x1="21" y1="21" x2="28" y2="28" stroke="currentColor" stroke-width="3" />
        </svg>

        <div class="font-medium whitespace-nowrap">No Results</div>
      </div>
    </AppDropdown>

    <div v-if="help || $slots.help" class="form-help">
      <slot name="help">{{ help }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown> | string | number">
import type { Placement } from '@floating-ui/vue';

const model = defineModel<T | T[] | keyof T | T[keyof T] | null>();

const props = defineProps<{
  options: T[];
  label?: string;
  name?: string;
  placeholder?: string;
  keyName?: keyof T;
  keyValue?: keyof T;
  multiple?: boolean;
  search?: boolean;
  order?: boolean;
  placement?: Placement;
  inputClass?: string;
  autoclose?: boolean;
  required?: boolean;
  help?: string;
}>();

const searchInput = ref('');

const getKeyValue = (option: T) => {
  return props.keyValue && typeof option === 'object' ? (option[props.keyValue] as T) : option;
};

const getKeyName = (option: T) => {
  return props.keyName && typeof option === 'object' ? option[props.keyName] : option;
};

const selected = computed<T[]>(() => {
  if (!model.value) return [];

  if (props.keyName) {
    return props.options.filter((item): item is T => {
      if (Array.isArray(model.value) && typeof item === 'object') {
        if (props.keyValue) return model.value.includes(item[props.keyValue] as T);

        return model.value.some((value) => getKeyName(value) === getKeyName(item));
      }

      if (!Array.isArray(model.value) && typeof model.value === 'object') {
        const modelValue = model.value as T;

        if (props.keyValue && typeof item === 'object') {
          return String(modelValue[props.keyValue]) === String(item[props.keyValue]);
        }

        return getKeyName(modelValue) === getKeyName(item);
      }

      if (props.keyValue && typeof item === 'object') {
        return String(model.value) === String(item[props.keyValue]);
      }

      return false;
    });
  }

  return Array.isArray(model.value) ? model.value : [model.value as T];
});

const isSelected = (option: T): boolean => selected.value.includes(option);

const toggleOption = (option: T) => {
  if (props.multiple) {
    const selectOptions = [...selected.value];
    const index = selectOptions.findIndex((item) => item === option);

    if (index === -1) {
      selectOptions.push(option);
    } else {
      selectOptions.splice(index, 1);
    }

    model.value = props.keyValue ? selectOptions.map((item) => getKeyValue(item)) : selectOptions;
  } else {
    model.value = selected.value[0] === option ? undefined : getKeyValue(option);
  }
};

const filteredOptions = computed(() => {
  const hasGroup = props.options.some((option) => typeof option === 'object' && option.group);

  const filtered = props.options.filter((option) => {
    return String(getKeyName(option)).toLowerCase().includes(searchInput.value.toLowerCase());
  });

  if (hasGroup) return filtered as unknown as Array<{ group?: string; list: T[] }>;

  return [{ list: filtered }];
});

const hasOptions = computed(() => filteredOptions.value.some((group) => group.list.length > 0));
</script>
