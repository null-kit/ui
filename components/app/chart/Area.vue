<template>
  <VisXYContainer :data height="25rem" width="100%">
    <template v-for="(category, index) in categories" :key="index">
      <VisArea :x :y="(d: T) => d[category]" :color="`url(#vis-g-${index})`" />
      <VisLine :x :y="(d: T) => d[category]" :color="colors[index]" />
      <VisScatter :x :y="(d: T) => d[category]" :color="colors[index]" :size="7" />
    </template>

    <VisAxis type="x" :domain-line="false" :tick-format />
    <VisAxis type="y" :domain-line="false" :tick-format="(i: number) => (yFormat ? yFormat(i) : formatNumber(i))" />

    <AppChartCrosshair :categories :colors :x-key :y-format :x-format />

    <svg width="0" height="0">
      <linearGradient v-for="(color, i) in colors" :id="`vis-g-${i}`" :key="i" x1="0" y1="0" x2="0" y2="1">
        <stop :stop-color="color" stop-opacity="0.2" />
        <stop offset="0.9" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </svg>
  </VisXYContainer>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown | Record<string, unknown>>">
import { VisXYContainer, VisArea, VisAxis, VisLine, VisScatter } from '@unovis/vue';

const props = defineProps<{
  data: T[];
  categories: Extract<keyof T, string>[];
  xKey: Extract<keyof T, string>;
  xFormat?: (i: string | number) => string | Date;
  yFormat?: (i: string | number) => string;
}>();

const x = (d: T, i: number) => i;

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
