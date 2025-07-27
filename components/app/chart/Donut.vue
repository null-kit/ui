<template>
  <VisSingleContainer :data="chartData">
    <VisDonut
      :pad-angle
      :corner-radius="6"
      :show-background="false"
      :arc-width="12"
      :central-label="valueFormat ? valueFormat(total) : formatNumber(total)"
      central-sub-label="Total"
      :value="(d: T) => d.value"
      :color="(d: T, i: number) => colors[i]"
    />

    <VisTooltip
      :triggers="{
        [Donut.selectors.segment]: ({ data }: ChartData, i: number) => {
          return `<div class='text-sm px-3 py-2 flex items-center gap-2'>
            <div>${useDictionary(data.category)}</div>
            <div class='ml-3 font-semibold'>${valueFormat ? valueFormat(data.value) : formatNumber(data.value)}</div>
          </div>`;
        }
      }"
      :attributes="{
        class: [
          'absolute opacity-0 transition-opacity z-10',
          'ring-edison bg-darwin rounded-lg shadow-lg ring text-sm text-surface',
          tooltipClass
        ].join(' ')
      }"
    />
  </VisSingleContainer>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { VisSingleContainer, VisDonut, VisTooltip } from '@unovis/vue';
import { Donut } from '@unovis/ts';

type ChartData = {
  data: {
    category: string;
    value: number;
  };
};

const props = withDefaults(
  defineProps<{
    data: T[];
    categoryKey: keyof T;
    valueKey: keyof T;
    valueFormat?: (i: number) => string;
    padAngle?: number;
    tooltipClass?: string;
  }>(),
  {
    padAngle: 0.04
  }
);

const chartData = computed(() => {
  return props.data.map((item) => ({
    category: String(item[props.categoryKey]),
    value: Number(item[props.valueKey])
  }));
});

const total = computed(() => chartData.value.reduce((sum, item) => sum + item.value, 0));

const colors = [
  'var(--color-accent)',
  'var(--color-indigo-500)',
  'var(--color-orange-500)',
  'var(--color-violet-500)',
  'var(--color-pink-500)',
  'var(--color-yellow-500)',
  'var(--color-purple-500)',
  'var(--color-red-500)',
  'var(--color-blue-500)',
  'var(--color-cyan-500)',
  'var(--color-emerald-500)'
];
</script>
