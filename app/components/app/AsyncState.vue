<template>
  <section v-if="status === 'pending'" class="text-center" :class="attrs.class || 'py-8'">
    <svg class="mx-auto mb-3 size-6" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor">
        <animate id="loop" attributeName="opacity" values="1;1" dur="3s" begin="0s;loop.end" repeatCount="1" />

        <rect
          v-for="cell in cells"
          :key="`${cell.x}-${cell.y}`"
          opacity=".3"
          :x="cell.x"
          :y="cell.y"
          width="5"
          height="5"
        >
          <animate
            attributeName="opacity"
            :values="getDiamond(cell.x, cell.y)"
            dur="1"
            begin="loop.begin"
            repeatCount="2"
          />

          <animate attributeName="opacity" :values="getChaos()" begin="loop.begin+1.5s" :dur="Math.random() + 0.5" />
        </rect>
      </g>
    </svg>

    <h3 class="text-surface animate-pulse font-medium">{{ pendingTitle }}</h3>

    <p v-if="pendingMessage" class="text-surface/50 text-sm">{{ pendingMessage }}</p>
  </section>

  <section v-else-if="!hasData && status === 'success'" class="text-center" :class="attrs.class || 'py-8'">
    <AppIcon name="search-area" class="mx-auto mb-3 size-6" />

    <h3 class="text-surface font-medium">{{ emptyTitle }}</h3>

    <p v-if="emptyMessage" class="text-surface/50 text-sm">{{ emptyMessage }}</p>
  </section>

  <section v-else-if="!hasData && status === 'error'" class="text-center" :class="attrs.class || 'py-8'">
    <AppIcon name="alert" class="mx-auto mb-3 size-6" />

    <h3 class="text-surface font-medium">{{ errorTitle }}</h3>

    <p v-if="errorMessage" class="text-surface/50 text-sm">{{ errorMessage }}</p>
  </section>

  <slot v-else />
</template>

<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app';

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

withDefaults(
  defineProps<{
    hasData?: boolean;
    status?: AsyncDataRequestStatus;

    pendingTitle?: string;
    pendingMessage?: string;

    emptyTitle?: string;
    emptyMessage?: string;

    errorTitle?: string;
    errorMessage?: string;
  }>(),
  {
    pendingTitle: 'Please Wait',
    emptyTitle: 'No Data Found',
    errorTitle: 'Something Went Wrong'
  }
);

const cells = [
  { x: 1.5, y: 1.5 },
  { x: 8, y: 1.5 },
  { x: 1.5, y: 8 },
  { x: 14.5, y: 1.5 },
  { x: 8, y: 8 },
  { x: 1.5, y: 14.5 },
  { x: 21, y: 1.5 },
  { x: 14.5, y: 8 },
  { x: 8, y: 14.5 },
  { x: 1.5, y: 21 },
  { x: 27.5, y: 1.5 },
  { x: 21, y: 8 },
  { x: 14.5, y: 14.5 },
  { x: 8, y: 21 },
  { x: 1.5, y: 27.5 },
  { x: 27.5, y: 8 },
  { x: 21, y: 14.5 },
  { x: 14.5, y: 21 },
  { x: 8, y: 27.5 },
  { x: 27.5, y: 14.5 },
  { x: 21, y: 21 },
  { x: 14.5, y: 27.5 },
  { x: 27.5, y: 21 },
  { x: 21, y: 27.5 },
  { x: 27.5, y: 27.5 }
];

const getChaos = () => Array.from({ length: 9 }, () => Math.random()).join(';');

const GRID_STEP = 6;
const CENTER = 14.5;

const getDiamond = (x: number, y: number) => {
  const ring = (Math.abs(x - CENTER) + Math.abs(y - CENTER)) / GRID_STEP;
  const values = ['.3', '.3', '.3', '.3', '.3', '.3', '.3', '.3', '.3'];
  const peakIndex = Math.max(1, Math.min(7, Math.round(ring) + 1));

  values[peakIndex - 1] = '.5';
  values[peakIndex] = '1';
  values[peakIndex + 1] = '.5';

  return values.join(';');
};
</script>
