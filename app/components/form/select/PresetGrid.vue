<template>
  <div class="grid gap-0.5 p-1 md:grid-cols-3">
    <button
      v-for="(preset, index) in presets"
      :key="index"
      type="button"
      class="btn btn-sm group/preset grid grid-cols-[16px_1fr_16px]"
      :class="{ 'btn-active': hasPreset(preset.list) }"
      @click.stop="addPreset(preset.list)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-4">
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

    <DevOnly>
      <!-- <div
        v-for="(preset, index) in presets"
        :key="keyPrefix ? `${keyPrefix}-${index}` : index"
        type="button"
        class="group/preset flex"
      >
        <div
          class="btn btn-sm w-full justify-start group-hover/preset:hidden"
          :class="{ 'btn-active': hasPreset(preset.list) }"
        >
          <span class="truncate">{{ preset.name }}</span>
        </div>

        <div class="hidden w-full *:grow group-hover/preset:flex">
          <AppTooltip :message="`${hasPreset(preset.list) ? 'Added' : 'Add'} ${preset.name}`" no-follow>
            <button
              class="btn btn-xs w-full"
              :class="{ 'btn-active': hasPreset(preset.list) }"
              :disabled="hasPreset(preset.list)"
              @click="addPreset(preset.list)"
            >
              {{ hasPreset(preset.list) ? 'Added' : 'Add' }}
            </button>
          </AppTooltip>

          <AppTooltip :message="`Replace with ${preset.name}`" no-follow>
            <button class="btn btn-xs w-full" @click="addPreset(preset.list, true)">Replace</button>
          </AppTooltip>
        </div>
      </div> -->
    </DevOnly>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<unknown>();

defineProps<{
  presets: FormSelectPreset[];
}>();

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
