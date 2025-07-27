<template>
  <VisCrosshair :template color="none" />

  <VisTooltip
    :attributes="{
      class: [
        'absolute opacity-0 transition-opacity z-10',
        'ring-edison bg-darwin rounded-lg shadow-lg ring text-sm text-surface',
        tooltipClass
      ].join(' ')
    }"
  />

  <div hidden>
    <div v-if="currentData" ref="tooltip">
      <div v-if="currentData[xKey]" class="border-edison border-b px-3 py-1 font-semibold">
        {{ xFormat ? xFormat(currentData[xKey]) : currentData[xKey] }}
      </div>

      <div class="flex flex-col gap-1 px-3 py-2">
        <div v-for="(category, index) in categories" :key="category" class="flex items-center gap-2">
          <div v-if="colors" class="h-3 w-1 rounded-full" :style="{ backgroundColor: colors[index] }" />

          <div>{{ useDictionary(category) }}</div>

          <div v-if="currentData[category]" class="ml-auto pl-4 font-semibold">
            {{ yFormat ? yFormat(currentData[category]) : formatNumber(currentData[category]) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, string | number>">
import { VisCrosshair, VisTooltip } from '@unovis/vue';

defineProps<{
  categories: Extract<keyof T, string>[];
  colors?: string[];
  xKey: keyof T;
  xFormat?: (i: string | number) => string | Date;
  yFormat?: (i: string | number) => string;
  tooltipClass?: string;
}>();

const tooltip = useTemplateRef<HTMLDivElement>('tooltip');
const currentData = ref();

const template = (data: T) => {
  currentData.value = data;
  return tooltip.value;
};
</script>
