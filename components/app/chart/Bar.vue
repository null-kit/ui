<template>
  <VisXYContainer :data="chartData.data" height="25rem" width="100%">
    <AppChartLegend v-model="chartData" :categories :colors :data class="mb-4" />

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
      :tick-format="(i: number) => (xFormat ? xFormat(data[i]![xKey]) : data[i]![xKey])"
      :num-ticks="data.length"
    />

    <VisAxis type="y" :tick-format="(i: number) => (yFormat ? yFormat(i) : formatNumber(i))" />

    <AppChartCrosshair :categories="chartData.categories || categories" :colors :x-key :y-format :x-format />

    <svg width="0" height="0">
      <linearGradient v-for="(color, i) in colors" :id="`vis-bar-g-${i}`" :key="i" x1="0" y1="0" x2="0" y2="1">
        <stop :stop-color="color" stop-opacity="1" />
        <stop offset="1" :stop-color="color" stop-opacity="0.2" />
      </linearGradient>
    </svg>
  </VisXYContainer>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown | Record<string, unknown>>">
import { VisXYContainer, VisAxis, VisGroupedBar, VisStackedBar } from '@unovis/vue';

const props = defineProps<{
  data: T[];
  categories: Extract<keyof T, string>[];
  xKey: Extract<keyof T, string>;
  xFormat?: (i: T[string] | number) => string;
  yFormat?: (i: string | number) => string;
  stacked?: boolean;
  roundedCorners?: number;
}>();

const VisBar = computed(() => (props.stacked ? VisStackedBar : VisGroupedBar));

const chartData = ref<T[]>([]);

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
