<template>
  <div class="relative flex flex-col space-y-2">
    <span v-if="label" class="form-label">
      <slot name="label-left" />

      {{ label }}

      <span v-if="required" title="Required field" class="form-required">*</span>

      <slot name="label-right" />
    </span>

    <AppDropdown :autoclose :placement dropdown-inner-class="p-0">
      <template #trigger="{ isOpen }">
        <div class="flex">
          <div v-if="$slots.left" class="select-slot shrink-0 overflow-clip rounded-r-none">
            <slot name="left" />
          </div>

          <div class="relative w-full">
            <button
              type="button"
              :class="[
                'select-input text-ellipsis',
                inputClass,
                { 'ring-accent': isOpen, 'rounded-l-none': $slots.left, 'rounded-r-none': $slots.right }
              ]"
            >
              <span v-if="multiple" class="select-multiple flex flex-wrap items-center gap-2 font-medium">
                <span v-for="(option, index) in selected" :key="index" class="btn btn-sm btn-default min-h-auto">
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
          </div>

          <div v-if="$slots.right" class="select-slot shrink-0 overflow-clip rounded-l-none">
            <slot name="right" />
          </div>
        </div>
      </template>

      <input v-if="search" v-model="searchInput" class="form-input rounded-none" placeholder="Search" />

      <div
        v-if="hasOptions"
        class="scrollbar flex max-h-96 min-w-40 shrink-0 flex-col gap-1 overflow-auto p-1 whitespace-nowrap"
      >
        <template v-if="presets && presets.length > 0">
          <div class="select-group-label">Presets</div>

          <div v-for="(preset, index) in presets" :key="index" class="flex items-center gap-1">
            <button type="button" class="btn flex-1 justify-start" @click="addPreset(preset.list, true)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                class="hover:bg-surface/5 -mx-1 size-6 shrink-0 rounded-md p-1 duration-300"
                @click.stop="addPreset(preset.list)"
              >
                <path fill="none" stroke="currentColor" stroke-width="3" d="M16 7v18M7 16h18" />
              </svg>

              {{ preset.name }}
            </button>
          </div>
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
  inputClass?: string;
  autoclose?: boolean;
  required?: boolean;
  help?: string;
  presets?: {
    name: string;
    list: T[];
  }[];
}>();

const searchInput = ref('');

const getKeyValue = (option: T) => {
  return props.keyValue && typeof option === 'object' ? (option[props.keyValue] as T) : option;
};

const getKeyName = (option: T) => {
  return props.keyName && typeof option === 'object' ? option[props.keyName] : option;
};

const normalizedOptions = computed(() => {
  const hasGroup = props.options.some((option) => typeof option === 'object' && option.group);

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
};

const filteredOptions = computed(() => {
  return normalizedOptions.value.map((optionGroup) => {
    const filteredList = optionGroup.list.filter((option: T) => {
      return String(getKeyName(option)).toLowerCase().includes(searchInput.value.toLowerCase());
    });

    return {
      group: filteredList.length ? optionGroup.group : undefined,
      list: filteredList
    };
  });
});

const hasOptions = computed(() => filteredOptions.value.some((group) => group.list.length > 0));

const addPreset = (preset: T[], replace = false) => {
  model.value = replace ? [...new Set(preset)] : [...new Set([...preset, ...(model.value as T[])])];
};

onMounted(() => {
  if (!model.value && props.value) {
    model.value = Array.isArray(props.value) ? props.value.map(getKeyValue) : props.value;
  }
});
</script>
