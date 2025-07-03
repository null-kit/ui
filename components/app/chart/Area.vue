<template>
  <VisXYContainer :data="data" height="25rem" width="100%">
    <template v-for="(category, index) in categories" :key="index">
      <VisArea :x="x" :y="(d: T) => d[category]" :color="`url(#vis-g-${index})`" />
      <VisLine :x="x" :y="(d: T) => d[category]" :color="colors[index]" />
      <VisScatter :x="x" :y="(d: T) => d[category]" :color="colors[index]" :size="7" />
    </template>

    <VisAxis type="x" :domain-line="false" :tick-format="(i: number) => data[i]?.[xKey]" />
    <VisAxis type="y" :domain-line="false" :tick-format="(i: number) => formatNumber(i)" />

    <AppChartCrosshair :categories="categories" :colors="colors" :x-key="xKey" />

    <svg width="0" height="0">
      <linearGradient v-for="(color1, i) in colors" :id="`vis-g-${i}`" :key="i" x1="0" y1="0" x2="0" y2="1">
        <stop :stop-color="color1" stop-opacity="0.2" />
        <stop offset="0.9" :stop-color="color1" stop-opacity="0" />
      </linearGradient>
    </svg>
  </VisXYContainer>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown | Record<string, unknown>>">
import { VisXYContainer, VisArea, VisAxis, VisLine, VisScatter } from '@unovis/vue';
import twc from 'tailwindcss/colors';

defineProps<{
  data: T[];
  categories: Extract<keyof T, string>[];
  xKey: Extract<keyof T, string>;
}>();

const x = (d: T, i: number) => i;

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
