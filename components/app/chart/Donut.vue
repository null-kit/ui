<template>
  <VisSingleContainer :data="chartData">
    <VisDonut
      :pad-angle="0.04"
      :corner-radius="6"
      :show-background="false"
      :arc-width="12"
      :central-label="total"
      central-sub-label="Total"
      :value="(d: T) => d.value"
      :color="(d: T, i: number) => colors[i]"
    />

    <VisTooltip
      :triggers="{
        [Donut.selectors.segment]: ({ data }: ChartData, i: number) => {
          return `<div class='text-sm px-3 py-2 flex items-center gap-2'>
            <div class='h-3 w-1 rounded-full' style='background-color:${colors[i]}'></div>
            <div>${useDictionary(data.category)}</div>
            <div class='ml-3 font-semibold'>${formatNumber(data.value)}</div>
          </div>`;
        }
      }"
    />
  </VisSingleContainer>
</template>

<script setup lang="ts" generic="T extends Record<string, string | number>">
import { Donut } from '@unovis/ts';
import { VisSingleContainer, VisDonut, VisTooltip } from '@unovis/vue';
import twc from 'tailwindcss/colors';

const props = defineProps<{
  data: T[];
  categoryKey: keyof T;
  valueKey: keyof T;
}>();

type ChartData = {
  data: {
    category: string;
    value: number;
  };
};

const chartData = computed(() => {
  return props.data.map((item) => ({
    category: String(item[props.categoryKey]),
    value: Number(item[props.valueKey])
  }));
});

const total = computed(() => chartData.value.reduce((sum, item) => sum + item.value, 0));

const colors = [
  'var(--color-accent)',
  twc.yellow[500],
  twc.orange[500],
  twc.indigo[500],
  twc.purple[500],
  twc.red[500],
  twc.pink[500],
  twc.blue[500],
  twc.cyan[500],
  twc.emerald[500],
  twc.violet[500]
];
</script>
