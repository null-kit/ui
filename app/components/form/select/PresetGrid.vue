<template>
  <div class="grid gap-0.5 p-1 md:grid-cols-3">
    <div
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
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<unknown>();

defineProps<{
  presets: FormSelectPreset[];
  keyPrefix?: string;
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
