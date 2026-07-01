<template>
  <div class="relative flex flex-col">
    <span v-if="label" class="form-label" :class="labelClass">
      <slot name="label-left" />

      {{ label }}

      <AppAppear v-if="required && !model">
        <span title="Required" class="form-required" />
      </AppAppear>

      <slot name="label-right" />
    </span>

    <div class="form-control flex w-full">
      <div v-if="$slots.left" class="form-slot rounded-r-none">
        <slot name="left" />
      </div>

      <AppDropdown
        ref="dropdown"
        v-bind="{ disabled, autoclose, placement, inline }"
        :dropdown-class="[dropdownClass, 'overflow-clip flex flex-col'].join(' ')"
        :max-height="448"
        class="w-full"
        :no-focus="search"
        @close="searchInput = ''"
      >
        <template #trigger="{ isOpen }">
          <button
            type="button"
            :class="[
              'select-input',
              inputClass,
              size && sizeClasses[size],
              { 'ring-accent': isOpen, 'rounded-l-none': $slots.left, 'rounded-r-none': $slots.right }
            ]"
            :disabled
          >
            <span v-if="multiple && selected.length > 0" class="select-multiple">
              <span v-for="(option, index) in selected" :key="index" class="btn btn-sm btn-default">
                {{ getKeyName(option) }}

                <svg
                  v-if="required !== 'no-unselect' || selected.length > 1 || selected[0] !== option"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-3 shrink-0 cursor-pointer text-current/50 hover:text-red-500"
                  @click.stop="toggleOption(option)"
                >
                  <path stroke-width="3" stroke="currentColor" d="M25 7 7 25m18 0L7 7" />
                </svg>
              </span>
            </span>

            <span
              v-for="(option, index) in selected"
              v-else
              :key="index"
              class="w-full self-center truncate text-left font-medium"
            >
              {{ getKeyName(option) }}
            </span>

            <span v-if="!selected.length" class="self-center whitespace-nowrap">{{ placeholder }}</span>

            <span class="form-select-clear sticky top-0 right-0 ml-auto flex items-center gap-1">
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

        <div v-if="search" class="border-edison border-b p-0">
          <input
            v-model.trim="searchInput"
            type="search"
            name="dropdown-search"
            autocomplete="off"
            class="form-input focus:bg-edison/30 rounded-none shadow-none ring-0"
            placeholder="Search"
            tabindex="0"
            @vue:mounted="({ el }: { el: HTMLElement }) => el.focus({ preventScroll: true })"
          />
        </div>

        <FormOptions
          v-if="hasGroupOptions"
          v-bind="{ groups, getKeyName, isSelected, order }"
          :is-hidden="(option: T) => typeof option === 'object' && Boolean(option.excluded)"
          variant="select"
          :max-height="search ? 'calc(var(--floating-height) - 42px)' : undefined"
          @select="toggleOption"
        >
          <template #before>
            <LazyFormSelectPresets v-if="presets && presets.length > 0" v-model="model" :presets :search-input />
          </template>

          <template #option="scope">
            <slot name="option" v-bind="scope" />
          </template>

          <template #button="scope">
            <slot name="button" v-bind="scope" />
          </template>
        </FormOptions>

        <FormOptionsEmpty v-else />
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

const [model, modifiers] = defineModel<unknown>({
  set(value) {
    if (modifiers.nonNull) {
      if (Array.isArray(value) && value.length === 0) return [];
      if (!value) return '';
    }

    if ((typeof value === 'string' || Array.isArray(value)) && value.length === 0) {
      return undefined;
    }

    return value;
  }
});

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
  autoclose?: boolean | 'delayed';
  required?: boolean | 'no-unselect';
  disabled?: boolean;
  help?: string;
  presets?: Array<{ name: string; list: (string | number)[] }>;
  labelClass?: string;
  inputClass?: string;
  validateClass?: string;
  dropdownClass?: string;
  inline?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}>();

const dropdown = useTemplateRef('dropdown');

const searchInput = ref('');

const {
  getKeyValue,
  getKeyName,
  allOptions,
  filterGroups,
  hasGroupOptions: checkGroupOptions
} = useFormOptions<T>({
  options: () => props.options,
  keyName: () => props.keyName,
  keyValue: () => props.keyValue
});

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
    if (props.required === 'no-unselect' && selected.value.length === 1 && selected.value[0] === option) return;

    const selectOptions = [...selected.value];

    const index = selectOptions.findIndex((item) => item === option);

    if (index === -1) {
      selectOptions.push(option);
    } else {
      selectOptions.splice(index, 1);
    }

    model.value = props.keyValue ? selectOptions.map((item) => getKeyValue(item)) : selectOptions;
  } else {
    if (props.required === 'no-unselect' && selected.value[0] === option) return;

    model.value = selected.value[0] === option ? null : getKeyValue(option);

    dropdown.value?.onClose();
  }

  emit('change', model.value as T);
};

const groups = computed(() => filterGroups(searchInput.value));

const hasGroupOptions = computed(() => checkGroupOptions(groups.value));

const onClear = () => {
  model.value = props.multiple ? [] : null;
  searchInput.value = '';
};

const sizeClasses = {
  xs: 'form-input-xs',
  sm: 'form-input-sm',
  md: 'form-input-md',
  lg: 'form-input-lg'
};

onMounted(() => {
  if (!model.value && props.value) {
    model.value = Array.isArray(props.value) ? props.value.map(getKeyValue) : props.value;
  }
});
</script>
