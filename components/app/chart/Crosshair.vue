<template>
  <VisCrosshair :template="template" color="none" />
  <VisTooltip />

  <div class="hidden">
    <div v-if="currentData" ref="tooltip" class="text-sm">
      <div v-if="currentData[xKey]" class="border-edison border-b px-3 py-1 font-semibold">
        {{ xFormat ? xFormat(currentData[xKey]) : currentData[xKey] }}
      </div>

      <div class="flex flex-col gap-1 px-3 py-2">
        <div v-for="(category, index) in categories" :key="category" class="flex items-center gap-2">
          <div v-if="colors" class="h-3 w-1 rounded-full" :style="{ backgroundColor: colors[index] }" />

          <div class="mr-4">{{ useDictionary(category) }}</div>

          <div v-if="currentData[category]" class="ml-auto font-semibold">
            {{ yFormat ? yFormat(currentData[category]) : formatNumber(currentData[category]) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, string | number>">
import { VisCrosshair, VisTooltip } from '@unovis/vue';

type Crosshair = T & {
  x: number;
  y: number;
};

defineProps<{
  categories: Extract<keyof T, string>[];
  colors?: string[];
  xKey: keyof T;
  xFormat?: (i: Crosshair[keyof T]) => string;
  yFormat?: (i: T[string]) => string;
}>();

const tooltip = useTemplateRef<HTMLDivElement>('tooltip');
const currentData = ref<Crosshair>();

const template = (data: Crosshair) => {
  currentData.value = data;
  return tooltip.value;
};
</script>
