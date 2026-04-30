<template>
  <VisXYContainer :data="chartData" :height width="100%">
    <LazyAppChartLegend v-if="showLegend" v-model="chartData" :categories :colors :data :x-indexes />

    <VisBar
      :x="(d: T, i: number) => i"
      :y="categories.map((category) => (d: T) => d[category as keyof T])"
      :color="(d: T, i: number) => `url(#vis-bar-g-${i}-${id})`"
      :rounded-corners="roundedCorners || 2"
      :bar-padding
    />

    <VisAxis
      type="x"
      :domain-line="false"
      :grid-line="false"
      :tick-format
      :num-ticks="props.numTicks ?? data.length"
      :tick-text-fit-mode="xTrim ? 'trim' : 'none'"
      :tick-text-color="(i: number) => (xIndexes.has(i) ? 'hsl(from var(--color-surface) h s l / 40%)' : '')"
      :events="{ [Axis.selectors.tick]: { click: (i: number) => toggleX(i) } }"
      v-bind="{ ...(xHide ? { tickLine: false, tickTextFontSize: 0, domainLine: false } : {}) }"
    />

    <VisAxis
      type="y"
      :tick-format="(i: number) => (yFormat ? yFormat(i) : formatNumber(i))"
      v-bind="{ ...(yHide ? { tickLine: false, tickTextFontSize: 0, domainLine: false } : {}) }"
    />

    <LazyAppChartCrosshair v-bind="{ categories, colors, xKey, yFormat, xFormat, tooltipClass }" />

    <svg width="0" height="0">
      <linearGradient v-for="(color, i) in colors" :id="`vis-bar-g-${i}-${id}`" :key="i" x1="0" y1="0" x2="0" y2="1">
        <stop :stop-color="color" stop-opacity="1" />
        <stop offset="1" :stop-color="color" :stop-opacity="barStyle === 'gradient' ? 0.2 : 1" />
      </linearGradient>
    </svg>
  </VisXYContainer>
</template>

<script setup lang="ts" generic="T">
import { VisXYContainer, VisAxis, VisGroupedBar, VisStackedBar } from '@unovis/vue';
import { Axis } from '@unovis/ts';

const id = useId();

const {
  barStyle = 'gradient',
  height = '25rem',
  barPadding = 0.1,
  ...props
} = defineProps<{
  data: T[];
  categories: string[];
  xKey: Extract<keyof T, string>;
  xTrim?: boolean;
  xHide?: boolean;
  yHide?: boolean;
  xFormat?: (i: string | number) => string | Date;
  yFormat?: (i: string | number) => string;
  stacked?: boolean;
  roundedCorners?: number;
  showLegend?: boolean;
  tooltipClass?: string;
  barStyle?: 'gradient' | 'solid';
  height?: string;
  barPadding?: number;
  numTicks?: number;
}>();

const VisBar = computed(() => (props.stacked ? VisStackedBar : VisGroupedBar));

const chartData = ref(props.data);
const cloneData = computed(() => (props.data ? structuredClone(toValue(props.data)) : []));

const xIndexes = ref(new Set<number>());

const toggleX = (index: number) => {
  const isHidden = xIndexes.value.has(index);
  const toggled = chartData.value[index] as Record<string, unknown>;
  const original = cloneData.value[index];

  if (!original || !toggled) return;

  for (const category of props.categories) {
    if (!original[category as keyof T]) continue;

    if (isHidden) {
      xIndexes.value.delete(index);
      toggled[category] = original[category as keyof T];
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

const colors = Array.from({ length: 10 }, (_, i) => `var(--chart-color-${i})`);
</script>
