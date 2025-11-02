<template>
  <div class="relative">
    <VisXYContainer :data :margin :auto-margin="false" class="pointer-events-none" height="20rem">
      <VisLine :x :y="(d: T) => Number(d[leftKey])" :color="colors[0]" />
      <VisScatter :x :y="(d: T) => Number(d[leftKey])" :color="colors[0]" :size="7" />

      <VisAxis
        type="y"
        :domain-line="false"
        :tick-format="(i: number) => (yFormatLeft ? yFormatLeft(i) : formatNumber(i))"
        :tick-text-color="colors[0]"
      />

      <VisAxis type="x" :num-ticks :tick-format />
    </VisXYContainer>

    <VisXYContainer :data :margin :auto-margin="false" class="-mt-80" height="20rem">
      <VisLine :x :y="(d: T) => Number(d[rightKey])" :color="colors[1]" />
      <VisScatter :x :y="(d: T) => Number(d[rightKey])" :color="colors[1]" :size="7" />

      <VisAxis
        type="y"
        position="right"
        :domain-line="false"
        :grid-line="false"
        :tick-format="(i: number) => (yFormatRight ? yFormatRight(i) : formatNumber(i))"
        :tick-text-color="colors[1]"
      />

      <AppChartCrosshair :categories="[leftKey, rightKey]" :colors :x-key :x-format :tooltip-class />
    </VisXYContainer>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown | Record<string, unknown>>">
import { VisXYContainer, VisAxis, VisLine, VisScatter } from '@unovis/vue';

const props = defineProps<{
  data: T[];
  leftKey: Extract<keyof T, string>;
  rightKey: Extract<keyof T, string>;
  xKey: Extract<keyof T, string>;
  xFormat?: (i: string | number) => string | Date;
  yFormatLeft?: (i: string | number) => string;
  yFormatRight?: (i: string | number) => string;
  tooltipClass?: string;
  numTicks?: number;
}>();

const margin = { left: 50, right: 50, top: 0, bottom: 40 };

const x = (d: T, i: number) => i;

const tickFormat = (i: number) => {
  const value = props.data[i]?.[props.xKey] as string | number;

  return props.xFormat ? props.xFormat(value) : value;
};

const colors = ['var(--color-accent)', 'var(--color-indigo-500)'];
</script>
