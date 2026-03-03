<template>
  <section :class="{ 'relative min-h-31': status === 'pending' && softLoading }">
    <div v-if="status === 'pending' && !softLoading" class="text-center" :class="attrs.class || 'py-8'">
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

      <h3 class="text-surface text-md/6 animate-pulse font-medium">{{ pendingTitle }}</h3>

      <p v-if="pendingText" class="text-surface/50 text-sm">{{ pendingText }}</p>
    </div>

    <div v-else-if="!hasData && status === 'success'" class="text-center" :class="attrs.class || 'py-8'">
      <AppIcon name="search-area" class="mx-auto mb-3 size-6" />

      <h3 class="text-surface text-md/6 font-medium">{{ emptyTitle }}</h3>

      <p v-if="emptyText" class="text-surface/50 text-sm">{{ emptyText }}</p>
    </div>

    <div v-else-if="!hasData && status === 'error'" class="text-center" :class="attrs.class || 'py-8'">
      <AppIcon name="alert" class="mx-auto mb-3 size-6" />

      <h3 class="text-surface text-md/6 font-medium">{{ errorTitle }}</h3>

      <p v-if="errorText" class="text-surface/50 text-sm">{{ errorText }}</p>
    </div>

    <div v-else-if="!hasData && status === 'idle' && idleTitle" class="text-center" :class="attrs.class || 'py-8'">
      <AppIcon name="search-area" class="mx-auto mb-3 size-6" />

      <h3 class="text-surface text-md/6 font-medium">{{ idleTitle }}</h3>

      <p v-if="idleText" class="text-surface/50 text-sm">{{ idleText }}</p>
    </div>

    <slot v-else-if="hasData" />

    <Transition enter-from-class="opacity-0" enter-to-class="duration-600" leave-to-class="opacity-0 duration-600">
      <div
        v-if="status === 'pending' && softLoading"
        class="bg-darwin/80 absolute inset-0 grid size-full cursor-wait backdrop-grayscale-100"
      >
        <div class="is-loading sticky inset-10 m-auto" />
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app';

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

withDefaults(
  defineProps<{
    hasData?: boolean;
    status?: AsyncDataRequestStatus;
    softLoading?: boolean;

    pendingTitle?: string;
    pendingText?: string;

    emptyTitle?: string;
    emptyText?: string;

    errorTitle?: string;
    errorText?: string;

    idleTitle?: string;
    idleText?: string;
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
