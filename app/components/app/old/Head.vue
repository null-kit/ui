<template>
  <thead>
    <component :is="slots.thead" v-if="slots.thead" />

    <tr :class="meta.trClass">
      <th v-if="meta.expandedKey" class="left-0 z-1 w-0 min-w-10 md:sticky" />

      <th
        v-for="cell in cells"
        :key="cell"
        :class="[
          meta.thClass,
          { 'left-0 z-1 md:sticky': meta.stickyLeft.includes(cell) },
          { 'right-0 -left-px z-1 border-l md:sticky': meta.stickyRight.includes(cell) }
        ]"
        :style="{
          left: meta.expandedKey && meta.stickyLeft.includes(cell) ? `${meta.expandedCellWidth}px` : undefined
        }"
        :aria-label="`th-${cell}`"
        :aria-sort="getSortDirection(cell)"
        @click="sort.onSort(cell)"
      >
        <div class="flex w-full items-center gap-1">
          <component :is="slots[`th-${cell}-left`]" v-if="slots[`th-${cell}-left`]" />

          <component :is="slots[`th-${cell}`]" v-if="slots[`th-${cell}`]" />

          <template v-else>
            {{ useDictionary(meta.dictionaryKey ? `${meta.dictionaryKey}.${cell}` : cell) }}
          </template>

          <component :is="slots[`th-${cell}-right`]" v-if="slots[`th-${cell}-right`]" />

          <svg
            v-if="sort.canSortBy(cell)"
            width="6"
            height="12"
            class="ml-auto shrink-0"
            viewBox="0 0 16 30"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
          >
            <path d="M2 21L8 27L14 21" :opacity="sort.isSorted(cell, 'desc') ? 1 : 0.5" />
            <path d="M2 9L8 3L14 9" :opacity="sort.isSorted(cell, 'asc') ? 1 : 0.5" />
          </svg>
        </div>
      </th>

      <th
        v-if="slots.actions"
        :class="['w-0', { 'right-0 -left-px border-l md:sticky': meta.stickyRight.includes('actions') }, meta.thClass]"
      />
    </tr>
  </thead>
</template>

<script setup lang="ts">
const props = defineProps<{
  cells: string[];

  sort: {
    canSortBy: (cell: string) => boolean;
    isSorted: (cell: string, direction: string) => boolean;
    onSort: (cell: string) => void;
  };

  meta: {
    expandedKey?: string;
    expandedCellWidth?: number;
    dictionaryKey?: string;

    trClass?: string;
    thClass?: string;

    stickyLeft: string[];
    stickyRight: string[];
  };

  slots: {
    thead?: object;
    actions?: object;
    [key: string]: object | undefined;
  };
}>();

const getSortDirection = (cell: string) => {
  if (props.sort.isSorted(cell, 'asc')) return 'ascending';
  if (props.sort.isSorted(cell, 'desc')) return 'descending';

  return 'none';
};
</script>
