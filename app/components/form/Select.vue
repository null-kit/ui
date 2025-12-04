<template>
  <div class="relative flex flex-col">
    <span v-if="label" class="form-label">
      <slot name="label-left" />

      {{ label }}

      <AppAppear v-if="required && !model">
        <span title="Required" class="form-required" />
      </AppAppear>

      <slot name="label-right" />
    </span>

    <div class="flex w-full">
      <div v-if="$slots.left" class="form-slot rounded-r-none">
        <slot name="left" />
      </div>

      <AppDropdown :autoclose :placement class="w-full" dropdown-class="p-0">
        <template #trigger="{ isOpen }">
          <button
            type="button"
            :class="[
              'select-input',
              inputClass,
              { 'ring-accent': isOpen, 'rounded-l-none': $slots.left, 'rounded-r-none': $slots.right }
            ]"
          >
            <span v-if="multiple && selected.length > 0" class="select-multiple">
              <span v-for="(option, index) in selected" :key="index" class="btn btn-sm btn-default">
                {{ getKeyName(option) }}

                <svg
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-3 shrink-0 cursor-pointer text-current/50 hover:text-red-500"
                  @click.stop="toggleOption(option)"
                >
                  <path stroke-width="3" stroke="currentColor" d="M25 7 7 25m18 0L7 7" />
                </svg>
              </span>
            </span>

            <span v-for="(option, index) in selected" v-else :key="index" class="self-center font-medium">
              {{ getKeyName(option) }}
            </span>

            <span v-if="!selected.length" class="self-center whitespace-nowrap">{{ placeholder }}</span>

            <span class="sticky top-0 ml-auto flex items-center gap-1">
              <span
                v-if="multiple && selected.length > 1"
                class="btn btn-sm btn-default size-5 text-current/50 hover:text-red-500"
                title="Remove all"
                @click.stop="onClear"
              >
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="size-3 shrink-0">
                  <path stroke-width="3" stroke="currentColor" d="M25 7 7 25m18 0L7 7" />
                </svg>
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                class="pointer-events-none size-4 h-full shrink-0 opacity-50"
              >
                <polyline points="10 22 16 28 22 22" fill="none" stroke="currentColor" stroke-width="3" />
                <polyline points="10 10 16 4 22 10" fill="none" stroke="currentColor" stroke-width="3" />
              </svg>
            </span>
          </button>

          <FormValidate v-if="name" :name :class="validateClass" />

          <AppAppear v-if="!label && required && !selected.length">
            <span title="Required" class="form-required-floating" />
          </AppAppear>
        </template>

        <input v-if="search" v-model.trim="searchInput" class="form-input rounded-none" placeholder="Search" />

        <div v-if="hasOptions" class="select-options">
          <template v-if="presets && presets.length > 0">
            <div class="select-group-label">Presets</div>

            <div v-for="(preset, index) in filteredPresets" :key="index" class="flex items-center gap-1">
              <button
                type="button"
                class="btn flex-1 justify-start"
                :class="{ 'bg-current/5 font-medium': hasPreset(preset.list) }"
                @click="addPreset(preset.list, true)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  class="hover:bg-surface/5 -mx-1 size-6 shrink-0 rounded-md p-1 duration-300"
                  @click.stop="addPreset(preset.list)"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    :d="hasPreset(preset.list) ? 'm5 18 6 6L26 9' : 'M16 7v18M7 16h18'"
                  />
                </svg>

                {{ preset.name }}
              </button>
            </div>

            <div class="select-group-label">All</div>
          </template>

          <template v-for="(optionGroup, indexParent) in filteredOptions" :key="indexParent">
            <div v-if="typeof optionGroup === 'object' && optionGroup.group" class="select-group-label">
              {{ optionGroup.group }}
            </div>

            <template v-for="(option, index) in optionGroup.list" :key="index">
              <button
                v-if="!(typeof option === 'object' && option.excluded)"
                type="button"
                class="btn justify-start"
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
              </button>
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

      <div v-if="$slots.right" class="form-slot rounded-l-none">
        <slot name="right" />
      </div>
    </div>

    <div v-if="help || $slots.help" class="form-help">
      <slot name="help">{{ help }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown> | string | number">
import type { Placement } from '@floating-ui/vue';

const emit = defineEmits<{ change: [value: T] }>();

const model = defineModel<unknown>(); // <T | T[] | keyof T | T[keyof T] | null>

const props = defineProps<{
  options: T[];
  value?: T | T[] | keyof T | T[keyof T];
  label?: string;
  name?: string;
  placeholder?: string;
  keyName?: keyof T;
  keyValue?: keyof T;
  multiple?: boolean;
  search?: boolean;
  order?: boolean;
  placement?: Placement;
  autoclose?: boolean;
  required?: boolean;
  help?: string;
  presets?: {
    name: string;
    list: (string | number)[];
  }[];
  inputClass?: string;
  validateClass?: string;
}>();

const searchInput = ref('');

const getKeyValue = (option: T) => {
  return props.keyValue && typeof option === 'object' ? (option[props.keyValue] as T) : option;
};

const getKeyName = (option: T) => {
  return props.keyName && typeof option === 'object' ? option[props.keyName] : option;
};

const normalizedOptions = computed(() => {
  const hasGroup = props.options?.some((option) => typeof option === 'object' && option.group);

  if (hasGroup) return props.options as unknown as Array<{ group?: string; list: T[] }>;

  return [{ list: props.options }];
});

const allOptions = computed(() => normalizedOptions.value.flatMap((group) => group.list));

const selected = computed<T[]>(() => {
  if (model.value === null || model.value === undefined) return [];

  if (props.keyName) {
    return allOptions.value.filter((item): item is T => {
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
    model.value = selected.value[0] === option ? null : getKeyValue(option);
  }

  emit('change', model.value as T);
};

const filteredOptions = computed(() => {
  return normalizedOptions.value.map((optionGroup) => {
    const filteredList = optionGroup.list?.filter((option: T) => {
      return String(getKeyName(option)).toLowerCase().includes(searchInput.value.toLowerCase());
    });

    return {
      group: filteredList?.length ? optionGroup.group : undefined,
      list: filteredList
    };
  });
});

const filteredPresets = computed(() => {
  return props.presets?.filter((preset) => preset.name.toLowerCase().includes(searchInput.value.toLowerCase()));
});

const hasOptions = computed(() => filteredOptions.value.some((group) => group.list?.length > 0));

const addPreset = (preset: string[] | number[], replace = false) => {
  model.value = replace ? [...new Set(preset as string[])] : [...new Set([...preset, ...(model.value as T[])])];
};

const hasPreset = (preset: string[] | number[]) => {
  if (preset.every((value) => Array.isArray(model.value) && model.value.includes(value))) {
    return true;
  }

  return false;
};

const onClear = () => {
  model.value = props.multiple ? [] : null;
  searchInput.value = '';
};

onMounted(() => {
  if (!model.value && props.value) {
    model.value = Array.isArray(props.value) ? props.value.map(getKeyValue) : props.value;
  }
});
</script>
