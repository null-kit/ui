<template>
  <div v-if="filteredPresets && filteredPresets.length > 0" class="-order-1">
    <AppDisclosure open summary-class="sticky top-0 z-1">
      <template #summary="{ isOpen }">
        <div
          class="select-group-label flex items-center justify-between"
          :class="isOpen ? 'cursor-n-resize' : 'cursor-s-resize'"
        >
          Presets

          <AppIcon name="chevron-right" class="duration-200" :class="{ 'rotate-90': isOpen }" />
        </div>
      </template>

      <div class="grid gap-0.5 p-1 md:grid-cols-3">
        <button
          v-for="(preset, index) in filteredPresets"
          :key="index"
          type="button"
          class="btn btn-sm justify-start pl-1"
          :class="{ 'bg-accent/5 text-accent font-medium': hasPreset(preset.list) }"
          @click="addPreset(preset.list, true)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            class="hover:text-accent size-4 shrink-0 rounded bg-current/10 p-px duration-200"
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

          <span class="truncate">{{ preset.name }}</span>
        </button>
      </div>
    </AppDisclosure>
  </div>

  <div class="select-group-label">All</div>
</template>

<script setup lang="ts">
const model = defineModel<unknown>();

const props = defineProps<{
  presets: { name: string; list: (string | number)[] }[];
  searchInput: string;
}>();

const filteredPresets = computed(() => {
  return props.presets?.filter((preset) => preset.name.toLowerCase().includes(props.searchInput.toLowerCase()));
});

const addPreset = (preset: (string | number)[], replace = false) => {
  model.value = replace
    ? [...new Set(preset)].filter(Boolean)
    : [...new Set([...preset, ...(Array.isArray(model.value) ? model.value : [model.value])])].filter(Boolean);
};

const hasPreset = (preset: (string | number)[]) => {
  if (preset.every((value) => Array.isArray(model.value) && model.value.includes(value))) {
    return true;
  }
  return false;
};
</script>
