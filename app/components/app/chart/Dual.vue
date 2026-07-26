<template>
  <div class="relative">
    <VisXYContainer :data :margin :auto-margin="false" class="pointer-events-none" height="20rem">
      <VisLine :x :y="(d: T) => Number(d[leftKey])" :color="colors[0]" />
      <VisArea v-if="gradient" :x :y="(d: T) => Number(d[leftKey])" :color="`url(#vis-g-${0})`" />
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
      <VisArea v-if="gradient" :x :y="(d: T) => Number(d[rightKey])" :color="`url(#vis-g-${1})`" />
      <VisScatter :x :y="(d: T) => Number(d[rightKey])" :color="colors[1]" :size="7" />

      <VisAxis
        type="y"
        position="right"
        :domain-line="false"
        :grid-line="false"
        :tick-format="(i: number) => (yFormatRight ? yFormatRight(i) : formatNumber(i))"
        :tick-text-color="colors[1]"
      />

      <LazyAppChartCrosshair
        :categories="[leftKey, rightKey]"
        v-bind="{ colors, xKey, xFormat, tooltipClass, labelClass }"
      />

      <svg v-if="gradient" width="0" height="0">
        <linearGradient v-for="(color, i) in colors" :id="`vis-g-${i}`" :key="i" x1="0" y1="0" x2="0" y2="1">
          <stop :stop-color="color" stop-opacity="0.2" />
          <stop offset="0.9" :stop-color="color" stop-opacity="0" />
        </linearGradient>
      </svg>
    </VisXYContainer>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown | Record<string, unknown>>">
import { VisXYContainer, VisAxis, VisLine, VisScatter, VisArea } from '@unovis/vue';

const props = defineProps<{
  data: T[];
  leftKey: Extract<keyof T, string>;
  rightKey: Extract<keyof T, string>;
  xKey: Extract<keyof T, string>;
  xFormat?: (i: string | number) => string | number | Date;
  yFormatLeft?: (i: string | number) => string;
  yFormatRight?: (i: string | number) => string;
  tooltipClass?: string;
  labelClass?: string;
  numTicks?: number;
  gradient?: boolean;
}>();

const margin = { left: 50, right: 50, top: 0, bottom: 40 };

const x = (d: T, i: number) => i;

const tickFormat = (i: number) => {
  const value = props.data[i]?.[props.xKey] as string | number;

  return props.xFormat ? props.xFormat(value) : value;
};

const colors = ['var(--chart-color-0)', 'var(--chart-color-1)'];
</script>
