<template>
  <div v-if="filteredGroups.length > 0" class="-order-1">
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

      <AppDisclosure
        v-for="(group, index) in filteredGroups"
        :key="index"
        open
        :summary-class="group.name ? 'sticky top-0 z-1' : 'hidden'"
      >
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
            v-for="preset in group.presets"
            :key="preset.name"
            type="button"
            class="btn btn-sm group/preset grid grid-cols-[16px_1fr_16px]"
            :class="{
              'btn-active': hasPreset(preset.list),
              '-order-1': order && group.presets.length > 39 && hasPreset(preset.list)
            }"
            @click.stop="addPreset(preset.list)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              class="size-3.5 opacity-50 group-hover/preset:opacity-100"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                :d="hasPreset(preset.list) ? 'm5 18 6 6L26 9' : 'M16 7v18M7 16h18'"
              />
            </svg>

            <span class="truncate text-left">{{ preset.name }}</span>

            <span class="flex opacity-0 group-hover/preset:opacity-100">
              <AppTooltip :message="`Replace with ${preset.name}`" no-follow>
                <svg
                  class="size-3.5 opacity-50"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  @click.stop="addPreset(preset.list, true)"
                >
                  <path
                    d="M17 19L21 15L17 11 M20 15L2 15L2 5L12.25 5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </AppTooltip>
            </span>
          </button>
        </div>
      </AppDisclosure>
    </AppDisclosure>
  </div>

  <div class="select-group-label">All</div>
</template>

<script setup lang="ts">
const model = defineModel<unknown>();

const props = defineProps<{
  presets: FormSelectPresets;
  searchInput: string;
  order?: boolean;
}>();

const groups = computed(() => {
  const groups: FormSelectPresetGroup[] = [];

  let unknown: FormSelectPresetGroup | undefined;

  for (const item of props.presets ?? []) {
    if ('presets' in item) {
      groups.push({ name: item.name, presets: item.presets });
      continue;
    }

    if (!unknown) groups.push((unknown = { presets: [] }));

    unknown.presets.push(item);
  }

  return groups;
});

const has = (value: string | undefined, search: string) => value?.toLowerCase().includes(search);

const filteredGroups = computed(() => {
  const search = props.searchInput.toLowerCase();

  return groups.value
    .map((group) => ({
      ...group,
      presets: group.presets.filter((preset) => has(preset.name, search) || has(group.name, search))
    }))
    .filter((group) => group.presets.length > 0);
});

const addPreset = (preset: (string | number)[], replace = false) => {
  model.value = replace
    ? [...new Set(preset)].filter(Boolean)
    : [...new Set([...preset, ...(Array.isArray(model.value) ? model.value : [model.value])])].filter(Boolean);
};

const hasPreset = (preset: (string | number)[]) => {
  return preset.every((value) => Array.isArray(model.value) && model.value.includes(value));
};
</script>
