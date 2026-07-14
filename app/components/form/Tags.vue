<template>
  <div class="relative flex flex-col">
    <label v-if="label" :for="id" class="form-label" :class="labelClass">
      <slot name="label-left" />

      {{ label }}

      <AppAppear v-if="required && !hasTags">
        <span title="Required" class="form-required" />
      </AppAppear>

      <slot name="label-right" />
    </label>

    <div class="form-control flex w-full">
      <div v-if="$slots.left" class="form-slot rounded-r-none">
        <slot name="left" />
      </div>

      <div class="relative w-full min-w-0">
        <AppDropdown
          ref="dropdown"
          v-bind="{ placement, inline, maxHeight: 224 }"
          :dropdown-class="[dropdownClass, 'overflow-clip flex flex-col'].join(' ')"
          no-toggle
          no-focus
        >
          <template #trigger>
            <div
              class="form-tags"
              :aria-invalid="isInvalid"
              :class="[inputClass, { 'rounded-l-none': $slots.left, 'rounded-r-none': $slots.right }]"
              @click.stop="onInputFocus"
            >
              <span
                v-for="(tag, index) in tags"
                :key="`${String(getTagName(tag))}-${index}`"
                class="form-tags-tag"
                :aria-current="activeIndex === index || undefined"
                :aria-invalid="
                  (isInvalid && inputValue.toLowerCase() === String(getTagName(tag)).toLowerCase()) || undefined
                "
                @click.stop="onSelectTag(index)"
              >
                {{ getTagName(tag) }}

                <button
                  type="button"
                  tabindex="-1"
                  class="inline-flex shrink-0"
                  :disabled
                  @click.stop="removeTag(index)"
                >
                  <svg
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-3 shrink-0 cursor-pointer text-current/50 hover:text-red-500"
                  >
                    <path stroke-width="3" stroke="currentColor" d="M25 7 7 25m18 0L7 7" />
                  </svg>
                </button>
              </span>

              <input
                :id
                ref="input"
                v-model.trim="inputValue"
                type="text"
                autocomplete="off"
                class="form-tags-input"
                :placeholder="tags.length ? undefined : placeholder"
                :max-length
                :disabled
                :required="required && !tags.length"
                @focus="onFocus"
                @blur="onBlur"
                @keydown="onKeydown"
                @input="onInput"
                @paste="onPaste"
              />

              <button
                v-if="tags.length > 1"
                type="button"
                class="btn btn-sm btn-default size-5 text-current/50 hover:text-red-500"
                title="Remove all"
                :disabled
                @click.stop="onClear"
              >
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="size-3 shrink-0">
                  <path stroke-width="3" stroke="currentColor" d="M25 7 7 25m18 0L7 7" />
                </svg>
              </button>
            </div>

            <FormValidate v-if="name" :name :class="validateClass" />

            <AppAppear v-if="!label && required && !hasTags">
              <span title="Required" class="form-required-floating" />
            </AppAppear>
          </template>

          <FormOptions
            v-if="hasGroupOptions"
            v-bind="{ groups, getKeyName, isSelected }"
            variant="pick"
            @select="onSelect"
          >
            <template #option="scope">
              <slot name="option" v-bind="scope" />
            </template>

            <template #button="scope">
              <slot name="button" v-bind="scope" />
            </template>
          </FormOptions>
        </AppDropdown>
      </div>

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

const [model, modifiers] = defineModel<unknown>({
  set(value) {
    if (modifiers.nonNull) {
      if (Array.isArray(value) && value.length === 0) return [];
      if (!value) return [];
    }

    if (Array.isArray(value) && value.length === 0) return undefined;

    return value;
  }
});

const id = useId();
const input = useTemplateRef('input');
const dropdown = useTemplateRef('dropdown');

const props = withDefaults(
  defineProps<{
    options?: T[];
    label?: string;
    name?: string;
    placeholder?: string;
    help?: string;
    keyName?: keyof T;
    keyValue?: keyof T;
    disabled?: boolean;
    required?: boolean;
    value?: T[] | (T | keyof T | T[keyof T])[];
    delimiter?: string | RegExp;
    max?: number;
    maxLength?: number;
    duplicate?: boolean;
    autofocus?: boolean;
    placement?: Placement;
    inline?: boolean;
    labelClass?: string;
    inputClass?: string;
    validateClass?: string;
    dropdownClass?: string;
  }>(),
  {
    delimiter: ','
  }
);

const inputValue = ref('');
const isFocused = ref(false);
const isSelectingOption = ref(false);
const isInvalid = ref(false);
const activeIndex = ref<number | null>(null);

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

const toStoredValue = (value: unknown) => {
  if (!props.keyValue) return value;

  if (typeof value === 'object' && value !== null) {
    return (value as Record<string, unknown>)[props.keyValue as string];
  }

  return value;
};

const isSameValue = (option: T, value: unknown) => {
  if (props.keyValue && typeof option === 'object' && option !== null) {
    return String(option[props.keyValue]) === String(value);
  }

  if (typeof option === 'object' && option !== null && typeof value === 'object' && value !== null) {
    if (option === value) return true;

    if (props.keyName) return String(getKeyName(option)) === String(getKeyName(value as T));
  }

  return String(getKeyValue(option)) === String(value);
};

const findOption = (value: unknown) => {
  if (!allOptions.value.length) return undefined;

  const storedValue = toStoredValue(value);

  return allOptions.value.find((option) => isSameValue(option, storedValue));
};

const tags = computed<unknown[]>(() => (Array.isArray(model.value) ? model.value.map(toStoredValue) : []));

const hasTags = computed(() => tags.value.length > 0);

const getTagName = (value: unknown) => {
  const option = findOption(value);

  if (option) return getKeyName(option);

  if (typeof value === 'object' && value !== null && props.keyName) {
    return (value as Record<string, unknown>)[props.keyName as string];
  }

  return value;
};

const matchOption = (raw: string) => {
  if (!allOptions.value.length) return undefined;

  const query = raw.trim().toLowerCase();

  return allOptions.value.find((option) => String(getKeyName(option)).toLowerCase() === query);
};

const isSelected = (option: T) => {
  if (props.duplicate) return false;

  return tags.value.some((value) => isSameValue(option, value));
};

const hasValue = (value: unknown) => {
  if (props.duplicate) return false;

  const option = typeof value === 'string' ? matchOption(value) : undefined;

  if (option) return isSelected(option);

  return tags.value.some((tag) => String(tag) === String(value));
};

const isMaxReached = () => Boolean(props.max && tags.value.length >= props.max);

const addOption = (option: T) => {
  if (isMaxReached() || isSelected(option)) {
    isInvalid.value = true;
    return false;
  }

  model.value = [...tags.value, props.keyValue ? getKeyValue(option) : option];
  isInvalid.value = false;

  return true;
};

const addTag = (raw: string) => {
  const trimmed = raw.trim();

  if (!trimmed) return false;

  const option = matchOption(trimmed);

  if (option) return addOption(option);

  if (isMaxReached() || hasValue(trimmed)) {
    isInvalid.value = true;
    return false;
  }

  model.value = [...tags.value, trimmed];
  isInvalid.value = false;

  return true;
};

const addTags = (values: string[]) => values.forEach((value) => addTag(value));

const removeTag = (index: number) => {
  if (props.disabled || index < 0 || index >= tags.value.length) return;

  const next = [...tags.value];
  next.splice(index, 1);
  model.value = next.length ? next : undefined;

  if (activeIndex.value !== null) {
    if (next.length === 0) activeIndex.value = null;
    else if (activeIndex.value >= next.length) activeIndex.value = next.length - 1;
  }
};

const normalizeModel = () => {
  if (!props.keyValue || !Array.isArray(model.value)) return;

  const current = model.value;
  const normalized = current.map(toStoredValue);

  if (normalized.some((item, index) => item !== current[index])) {
    model.value = normalized;
  }
};

watch(model, normalizeModel);

const groups = computed(() => filterGroups(inputValue.value, (option: T) => !isSelected(option), true));

const hasGroupOptions = computed(() => checkGroupOptions(groups.value));

const syncDropdown = () => {
  if (props.disabled || !props.options?.length || !isFocused.value || !hasGroupOptions.value) {
    dropdown.value?.onClose();
    return;
  }

  dropdown.value?.onOpen();
};

watch([isFocused, groups, () => props.disabled, () => props.options?.length], syncDropdown);

const onCommit = () => {
  if (!inputValue.value.trim()) return false;

  if (addTag(inputValue.value)) {
    inputValue.value = '';
    activeIndex.value = null;
    return true;
  }

  return false;
};

const clampIndex = (index: number) => Math.min(Math.max(index, 0), tags.value.length - 1);

const onKeydown = (event: KeyboardEvent) => {
  const target = event.target as HTMLInputElement;

  if (event.key === 'Enter' || (typeof props.delimiter === 'string' && event.key === props.delimiter)) {
    event.preventDefault();
    onCommit();
    return;
  }

  if (target.selectionStart !== 0 || target.selectionEnd !== 0) return;

  if (event.key === 'Backspace' || event.key === 'Delete') {
    if (activeIndex.value !== null) {
      const nextIndex = activeIndex.value + (event.key === 'Backspace' ? -1 : 1);

      removeTag(activeIndex.value);
      activeIndex.value = tags.value.length ? clampIndex(nextIndex) : null;
      event.preventDefault();
      return;
    }

    if (event.key === 'Backspace' && tags.value.length) {
      activeIndex.value = tags.value.length - 1;
      event.preventDefault();
    }

    return;
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    if (tags.value.length === 0) return;

    if (event.key === 'ArrowLeft' && activeIndex.value === null) {
      activeIndex.value = tags.value.length - 1;
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowRight' && activeIndex.value === tags.value.length - 1) {
      activeIndex.value = null;
      event.preventDefault();
      return;
    }

    if (activeIndex.value !== null) {
      activeIndex.value = clampIndex(activeIndex.value + (event.key === 'ArrowLeft' ? -1 : 1));
      event.preventDefault();
    }

    return;
  }

  if (event.key === 'Home' && tags.value.length) {
    activeIndex.value = 0;
    event.preventDefault();
    return;
  }

  if (event.key === 'End' && tags.value.length) {
    activeIndex.value = tags.value.length - 1;
    event.preventDefault();
    return;
  }

  activeIndex.value = null;
};

const onSelect = (option: T) => {
  isSelectingOption.value = true;

  if (addOption(option)) {
    inputValue.value = '';
    activeIndex.value = null;
    input.value?.focus();
  }

  nextTick(() => {
    isSelectingOption.value = false;
  });
};

const onSelectTag = (index: number) => {
  if (props.disabled) return;

  activeIndex.value = index;
  input.value?.focus();
};

const onInputFocus = () => {
  if (props.disabled) return;

  input.value?.focus();
};

const onFocus = () => {
  isFocused.value = true;
};

const onBlur = () => {
  isFocused.value = false;
  activeIndex.value = null;

  if (!isSelectingOption.value) onCommit();

  dropdown.value?.onClose();
};

const onInput = (event: Event) => {
  isInvalid.value = false;

  const target = event.target as HTMLInputElement;
  const { delimiter } = props;

  if (typeof delimiter === 'string' && target.value.includes(delimiter)) {
    const parts = target.value.split(delimiter);
    addTags(parts.slice(0, -1));
    inputValue.value = parts.at(-1) ?? '';
    return;
  }

  if (delimiter instanceof RegExp) {
    const match = target.value.match(delimiter);

    if (match?.index !== undefined) {
      const tag = target.value.slice(0, match.index);
      if (addTag(tag)) inputValue.value = target.value.slice(match.index + match[0].length);
    }
  }
};

const onPaste = (event: ClipboardEvent) => {
  const text = event.clipboardData?.getData('text');

  if (!text) return;

  event.preventDefault();

  const splitted = text
    .split(props.delimiter)
    .map((part) => part.trim())
    .filter(Boolean);

  addTags(splitted);
};

const onClear = () => {
  model.value = undefined;
  inputValue.value = '';
  activeIndex.value = null;
  isInvalid.value = false;
};

onMounted(() => {
  if (!tags.value.length && props.value?.length) {
    model.value = props.value.map((item) => getKeyValue(item as T));
  } else if (props.keyValue && tags.value.length) {
    normalizeModel();
  }

  if (props.autofocus) setTimeout(() => input.value?.focus({ preventScroll: true }), 100);
});
</script>
