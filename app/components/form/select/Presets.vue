<template>
  <div v-if="hasPresets" class="-order-1">
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

      <template v-if="isGrouped">
        <template v-for="group in filteredGroups" :key="group.name">
          <AppDisclosure open summary-class="sticky top-0 z-1">
            <template #summary="{ isOpen }">
              <div
                class="select-group-label flex items-center justify-between"
                :class="isOpen ? 'cursor-n-resize' : 'cursor-s-resize'"
              >
                {{ group.name }}

                <AppIcon name="chevron-right" class="duration-200" :class="{ 'rotate-90': isOpen }" />
              </div>
            </template>

            <div class="grid gap-0.5 p-1 md:grid-cols-3">
              <button
                v-for="(preset, index) in group.presets"
                :key="`${group.name}-${index}`"
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
                  title="Add to current selection"
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
        </template>
      </template>

      <div v-else class="grid gap-0.5 p-1 md:grid-cols-3">
        <button
          v-for="(preset, index) in filteredFlatPresets"
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
            title="Add to current selection"
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
type Preset = { name: string; list: (string | number)[] };
type PresetGroup = { name: string; presets: Preset[] };
type Presets = Preset[] | PresetGroup[];

const model = defineModel<unknown>();

const props = defineProps<{
  presets: Presets;
  searchInput: string;
}>();

const isPresetGroup = (item: Preset | PresetGroup): item is PresetGroup => 'presets' in item;

const isGrouped = computed(() => props.presets?.some(isPresetGroup) ?? false);

const filteredFlatPresets = computed(() => {
  if (isGrouped.value) return [];

  return (
    props.presets?.filter(
      (preset): preset is Preset =>
        !isPresetGroup(preset) && preset.name.toLowerCase().includes(props.searchInput.toLowerCase())
    ) ?? []
  );
});

const filteredGroups = computed(() => {
  if (!isGrouped.value) return [];

  const search = props.searchInput.toLowerCase();

  return (props.presets as PresetGroup[])
    .map((group) => ({
      ...group,
      presets: group.presets.filter(
        (preset) => preset.name.toLowerCase().includes(search) || group.name.toLowerCase().includes(search)
      )
    }))
    .filter((group) => group.presets.length > 0);
});

const hasPresets = computed(() => {
  if (isGrouped.value) return filteredGroups.value.length > 0;

  return filteredFlatPresets.value.length > 0;
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
