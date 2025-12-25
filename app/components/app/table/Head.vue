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
          { 'right-0 -left-px z-1 border-l md:sticky': meta.stickyRight.includes(cell) },
          { 'text-accent': (sort.canSortBy(cell) && sort.isSorted(cell, 'desc')) || sort.isSorted(cell, 'asc') }
        ]"
        :style="{
          left: meta.expandedKey && meta.stickyLeft.includes(cell) ? `${meta.expandedCellWidth}px` : undefined
        }"
        :aria-label="`th-${cell}`"
        :aria-sort="sort.canSortBy(cell) ? (sort.isSorted(cell, 'desc') ? 'descending' : 'ascending') : undefined"
        @click="sort.onSort(cell)"
      >
        <div class="flex w-full items-center gap-1">
          <component :is="slots[`th-${cell}-left`]" v-if="slots[`th-${cell}-left`]" />

          <component :is="slots[`th-${cell}`]" v-if="slots[`th-${cell}`]" />

          <template v-else>
            {{ useDictionary(meta.dictionaryKey ? `${meta.dictionaryKey}.${cell}` : cell) }}
          </template>

          <component :is="slots[`th-${cell}-right`]" v-if="slots[`th-${cell}-right`]" />

          <div class="bg-surface/5 ml-auto shrink-0 rounded-full p-0.5">
            <svg
              v-if="sort.canSortBy(cell)"
              class="text-surface/50 h-3 w-1.5"
              viewBox="0 0 16 30"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
            >
              <path d="M2 21L8 27L14 21" :class="{ 'text-accent': sort.isSorted(cell, 'desc') }" />
              <path d="M2 9L8 3L14 9" :class="{ 'text-accent': sort.isSorted(cell, 'asc') }" />
            </svg>
          </div>
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
defineProps<{
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
</script>
