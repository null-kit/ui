<template>
  <VisXYContainer :data="chartData" height="25rem" width="100%">
    <AppChartLegend v-if="showLegend" v-model="chartData" :categories :colors :data :x-indexes />

    <VisBar
      :x="(d: T, i: number) => i"
      :y="categories.map((category) => (d: T) => d[category])"
      :color="(d: T, i: number) => `url(#vis-bar-g-${[i]})`"
      :rounded-corners="roundedCorners || 2"
      :bar-padding="0.1"
    />

    <VisAxis
      type="x"
      :domain-line="false"
      :grid-line="false"
      :tick-format
      :num-ticks="data.length"
      :tick-text-fit-mode="xTrim ? 'trim' : 'none'"
      :tick-text-color="(i: number) => (xIndexes.has(i) ? 'hsl(from var(--color-surface) h s l / 40%)' : '')"
      :events="{
        [Axis.selectors.tick]: { click: (i: number) => toggleX(i) }
      }"
    />

    <VisAxis type="y" :tick-format="(i: number) => (yFormat ? yFormat(i) : formatNumber(i))" />

    <AppChartCrosshair :categories :colors :x-key :y-format :x-format />

    <svg width="0" height="0">
      <linearGradient v-for="(color, i) in colors" :id="`vis-bar-g-${i}`" :key="i" x1="0" y1="0" x2="0" y2="1">
        <stop :stop-color="color" stop-opacity="1" />
        <stop offset="1" :stop-color="color" stop-opacity="0.2" />
      </linearGradient>
    </svg>
  </VisXYContainer>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { VisXYContainer, VisAxis, VisGroupedBar, VisStackedBar } from '@unovis/vue';
import { Axis } from '@unovis/ts';

const props = defineProps<{
  data: T[];
  categories: string[];
  xKey: Extract<keyof T, string>;
  xTrim?: boolean;
  xFormat?: (i: string | number) => string | Date;
  yFormat?: (i: string | number) => string;
  stacked?: boolean;
  roundedCorners?: number;
  showLegend?: boolean;
}>();

const VisBar = computed(() => (props.stacked ? VisStackedBar : VisGroupedBar));

const chartData = ref(props.data);
const cloneData = structuredClone(props.data);

const xIndexes = ref(new Set<number>());

const toggleX = (index: number) => {
  const isHidden = xIndexes.value.has(index);
  const toggled = chartData.value[index] as Record<string, unknown>;
  const original = cloneData[index];

  if (!original || !toggled) return;

  for (const category of props.categories) {
    if (!original[category]) continue;

    if (isHidden) {
      xIndexes.value.delete(index);
      toggled[category] = original[category];
    } else {
      xIndexes.value.add(index);
      toggled[category] = 0;
    }
  }
};

const tickFormat = (i: number) => {
  const value = props.data[i]?.[props.xKey] as string | number;

  return props.xFormat ? props.xFormat(value) : value;
};

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
