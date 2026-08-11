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
        <AppDisclosure v-for="group in filteredGroups" :key="group.name" open summary-class="sticky top-0 z-1">
          <template #summary="{ isOpen }">
            <div
              class="select-group-label flex items-center justify-between"
              :class="isOpen ? 'cursor-n-resize' : 'cursor-s-resize'"
            >
              {{ group.name }}

              <AppIcon name="chevron-right" class="duration-200" :class="{ 'rotate-90': isOpen }" />
            </div>
          </template>

          <FormSelectPresetGrid v-model="model" :presets="group.presets" :key-prefix="group.name" />
        </AppDisclosure>
      </template>

      <FormSelectPresetGrid v-else v-model="model" :presets="filteredFlatPresets" />
    </AppDisclosure>
  </div>

  <div class="select-group-label">All</div>
</template>

<script setup lang="ts">
const model = defineModel<unknown>();

const props = defineProps<{
  presets: FormSelectPresets;
  searchInput: string;
}>();

const isPresetGroup = (item: FormSelectPreset | FormSelectPresetGroup) => 'presets' in item;

const isGrouped = computed(() => props.presets?.some(isPresetGroup) ?? false);

const filteredFlatPresets = computed(() => {
  if (isGrouped.value) return [];

  return (
    props.presets?.filter(
      (preset) => !isPresetGroup(preset) && preset.name.toLowerCase().includes(props.searchInput.toLowerCase())
    ) ?? []
  );
});

const filteredGroups = computed(() => {
  if (!isGrouped.value) return [];

  const search = props.searchInput.toLowerCase();

  return (props.presets as FormSelectPresetGroup[])
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
</script>
