<template>
  <div class="relative text-left text-sm" :class="{ 'mb-2': child }">
    <div v-if="label" class="form-label mb-2">
      {{ label }}
      <span v-if="required" title="Required field" class="form-required">*</span>
    </div>

    <div :class="!child && 'form-input scrollbar isolate max-h-80 overflow-auto p-0'">
      <input
        v-if="!child && search"
        v-model="searchQuery"
        class="form-input sticky top-0 z-1 rounded-none"
        placeholder="Search"
      />

      <ul v-if="filterOptions(options).length > 0">
        <li
          v-for="option in filterOptions(options)"
          :key="option.value"
          class="border-edison border-b border-dashed last:border-0"
        >
          <div
            class="flex items-center justify-between px-3 py-2"
            :class="hasChildren(option) && (!option.isOpen ? 'cursor-s-resize' : 'cursor-n-resize')"
            @click="hasChildren(option) && (option.isOpen = !option.isOpen)"
          >
            <FormCheck
              :model-value="isSelected(option)"
              :label="option.name"
              name="checkbox"
              :indeterminate="isIndeterminate(option)"
              class="inline-flex"
              @change.stop="toggleOption(option)"
            />

            <svg
              v-if="hasChildren(option)"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              class="size-4 opacity-60 duration-200"
              :class="{ '-scale-y-100': option.isOpen }"
            >
              <path fill="none" stroke-width="3" stroke="currentColor" d="m26 12-10 10-10-10" />
            </svg>
          </div>

          <FormTreeSelect
            v-if="option.children && option.isOpen"
            v-model="model"
            :name="name"
            :options="filterOptions(option.children)"
            class="border-edison ml-5 border-l border-dashed last:rounded-bl-lg last:border-b"
            child
          />
        </li>
      </ul>

      <div v-else class="p-4 text-center opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="mb-2 inline-block size-5">
          <circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" stroke-width="3" />
          <line x1="21" y1="21" x2="28" y2="28" stroke="currentColor" stroke-width="3" />
        </svg>

        <div class="font-medium whitespace-nowrap">No Results</div>
      </div>
    </div>

    <FormValidate v-if="!child && name" :name="name" />
  </div>
</template>

<script setup lang="ts">
type TreeOption = {
  value: string;
  name: string;
  children?: TreeOption[];
  isOpen?: boolean;
};

defineProps<{
  label?: string;
  name: string;
  options: TreeOption[];
  child?: boolean;
  search?: boolean;
  required?: boolean;
}>();

const model = defineModel<string[]>();

const searchQuery = ref('');

const hasChildren = (option: TreeOption) => option.children && option.children.length > 0;

const isSelected = (option: TreeOption) => model.value?.includes(option.value);

const isIndeterminate = (option: TreeOption) => {
  if (!hasChildren(option)) return undefined;

  const childValues = option.children?.map((child) => child.value) || [];

  const isSomeSelected = childValues.some((value) => model.value?.includes(value));
  const notEverySelected = !childValues.every((value) => model.value?.includes(value));

  return (isSomeSelected && notEverySelected) || undefined;
};

const toggleOption = (option: TreeOption) => {
  let newValue = [...(model.value || [])];

  if (isSelected(option)) {
    newValue = newValue.filter((v) => v !== option.value);

    if (hasChildren(option)) {
      option.children?.forEach((child) => {
        newValue = newValue.filter((v) => v !== child.value);
      });
    }
  } else {
    newValue.push(option.value);

    if (hasChildren(option)) {
      option.children?.forEach((child) => {
        if (!newValue.includes(child.value)) {
          newValue.push(child.value);
        }
      });
    }
  }

  model.value = newValue;
};

const filterOptions = (options: TreeOption[]): TreeOption[] => {
  const query = searchQuery.value.toLowerCase();

  return toRef(options).value.filter((item) => {
    const found = item.name.toLowerCase().includes(query);

    if (found) return true;

    if (hasChildren(item)) {
      return item.children?.some((child) => child.name.toLowerCase().includes(query));
    }
  });
};
</script>
