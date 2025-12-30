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

      <AppDropdown
        :autoclose
        :placement
        class="w-full"
        dropdown-class="p-0"
        :max-height="448"
        @close="searchInput = ''"
      >
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

        <template #default="{ isOpen }">
          <div v-if="search" class="border-edison border-b p-0">
            <input
              v-model.trim="searchInput"
              type="search"
              name="dropdown-search"
              class="form-input focus:bg-edison/30 rounded-none shadow-none ring-0"
              placeholder="Search"
            />
          </div>

          <div
            v-if="isOpen && hasOptions"
            class="scrollbar scrollbar-thin overflow-auto"
            :style="{ maxHeight: search ? `calc(var(--floating-height) - 42px)` : 'auto' }"
          >
            <div v-if="presets && presets.length > 0 && filteredPresets && filteredPresets.length > 0" class="-order-1">
              <div class="select-group-label">Presets</div>

              <div class="grid grid-cols-2 gap-0.5 p-1">
                <button
                  type="button"
                  v-for="(preset, index) in filteredPresets"
                  :key="index"
                  class="btn btn-sm justify-start pl-1"
                  :class="{ 'bg-accent/5 text-accent font-medium': hasPreset(preset.list) }"
                  @click="addPreset(preset.list, true)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    class="hover:text-accent size-4 rounded bg-current/10 p-px duration-200"
                    :class="hasPreset(preset.list) ? 'text-current' : 'text-surface/50 hover:text-accent'"
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
            </div>

            <div v-if="presets && presets.length > 0" class="select-group-label">All</div>

            <template v-for="(optionGroup, indexParent) in filteredOptions" :key="indexParent">
              <div v-if="typeof optionGroup === 'object' && optionGroup.group" class="select-group-label">
                {{ optionGroup.group }}
              </div>

              <div v-if="optionGroup.list.length > 0" class="select-options">
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
              </div>
            </template>
          </div>

          <div v-else class="p-4 text-center opacity-40">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="mb-2 inline-block size-5">
              <circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" stroke-width="3" />
              <line x1="21" y1="21" x2="28" y2="28" stroke="currentColor" stroke-width="3" />
            </svg>

            <div class="font-medium whitespace-nowrap">No Results</div>
          </div>
        </template>
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

const emit = defineEmits<{ change: [value: T | T[] | null] }>();
const model = defineModel<unknown>();

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

/* ---------------------------------- utils --------------------------------- */

const getKeyValue = (option: T) => {
  return props.keyValue && typeof option === 'object' ? (option[props.keyValue] as unknown) : option;
};

const getKeyName = (option: T) => {
  return props.keyName && typeof option === 'object' ? option[props.keyName] : option;
};

/* ---------------------------------- search -------------------------------- */

const searchInput = ref('');
const debouncedSearch = ref('');

watch(
  searchInput,
  debounce((v: string) => {
    debouncedSearch.value = v.toLowerCase();
  }, 150)
);

/* --------------------------------- options -------------------------------- */

const normalizedOptions = computed(() => {
  const hasGroup = props.options?.some((option) => typeof option === 'object' && 'group' in option);

  if (hasGroup) {
    return props.options as unknown as Array<{ group?: string; list: T[] }>;
  }

  return [{ list: props.options }];
});

const allOptions = computed(() => normalizedOptions.value.flatMap((group) => group.list));

/* -------------------------------- selection -------------------------------- */

const isObjectMode = computed(() => {
  return !props.keyValue && props.options?.some((o) => typeof o === 'object');
});

const modelSet = computed<Set<string>>(() => {
  if (isObjectMode.value || model.value == null) return new Set();

  const values = Array.isArray(model.value) ? model.value : [model.value];

  return new Set(
    values.map((value) => {
      if (props.keyValue && typeof value === 'object') return String((value as any)[props.keyValue]);

      return String(value);
    })
  );
});

const selected = computed<T[]>(() => {
  if (model.value == null) return [];

  if (isObjectMode.value && typeof model.value === 'object') {
    return Array.isArray(model.value) ? (model.value as T[]) : [model.value as T];
  }

  if (!modelSet.value.size) return [];

  return allOptions.value.filter((item): item is T => {
    if (props.keyValue && typeof item === 'object') return modelSet.value.has(String(item[props.keyValue]));

    return modelSet.value.has(String(item));
  });
});

const isSelected = (option: T): boolean => {
  if (model.value == null) return false;

  if (!props.keyValue && !props.keyName && typeof option === 'object') return false;

  if (!props.keyValue && props.keyName && typeof option === 'object') {
    const value = Array.isArray(model.value) ? model.value : [model.value];

    return value.some(
      (v) => typeof v === 'object' && String(v[props.keyName]) === String(option[props.keyName as keyof T])
    );
  }

  if (props.keyValue && typeof option === 'object') return modelSet.value.has(String(option[props.keyValue]));

  return modelSet.value.has(String(option));
};

/* --------------------------------- actions -------------------------------- */

const toggleOption = (option: T) => {
  if (props.multiple) {
    const values = Array.isArray(model.value) ? [...model.value] : [];

    const value = getKeyValue(option);
    const index = values.findIndex((v) => String(v) === String(value));

    if (index === -1) {
      values.push(value);
    } else {
      values.splice(index, 1);
    }

    model.value = values;
  } else {
    model.value = isSelected(option) ? null : getKeyValue(option);
  }

  emit('change', model.value as T | T[] | null);
};

const onClear = () => {
  model.value = props.multiple ? [] : null;
  searchInput.value = '';
};

/* -------------------------------- filtering -------------------------------- */

const filteredOptions = computed(() => {
  return normalizedOptions.value.map((group) => {
    const list = group.list?.filter((option: T) =>
      String(getKeyName(option)).toLowerCase().includes(debouncedSearch.value)
    );

    return {
      group: list?.length ? group.group : undefined,
      list
    };
  });
});

const filteredPresets = computed(() =>
  props.presets?.filter((preset) => preset.name.toLowerCase().includes(debouncedSearch.value))
);

const hasOptions = computed(() => filteredOptions.value.some((group) => group.list?.length));

/* -------------------------------- presets --------------------------------- */

const addPreset = (preset: (string | number)[], replace = false) => {
  model.value = replace
    ? [...new Set(preset)]
    : [...new Set([...preset, ...(Array.isArray(model.value) ? model.value : [])])];
};

const hasPreset = (preset: (string | number)[]) => {
  return preset.every((value) => Array.isArray(model.value) && model.value.includes(value));
};

/* -------------------------------- lifecycle -------------------------------- */

onMounted(() => {
  if (!model.value && props.value) {
    model.value = Array.isArray(props.value) ? props.value.map(getKeyValue) : props.value;
  }
});
</script>
