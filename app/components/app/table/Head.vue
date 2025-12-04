<template>
  <thead>
    <component :is="slots.thead" v-if="slots.thead" />

    <tr :class="meta.trClass">
      <th v-if="meta.expandedKey" class="w-0 min-w-10" />

      <th
        v-for="cell in cells"
        :key="cell"
        :class="[
          meta.thClass,
          { 'left-0 z-1 md:sticky': meta.stickyLeft.includes(cell) },
          { 'right-0 -left-px z-1 border-l md:sticky': meta.stickyRight.includes(cell) },
          { 'text-accent': canSortBy(cell) && String($route.query.sortBy).startsWith(cell + ':') }
        ]"
        :aria-label="`th-${cell}`"
        :aria-sort="canSortBy(cell) ? (isSorted(cell, 'desc') ? 'descending' : 'ascending') : undefined"
        @click="onSort(cell)"
      >
        <div class="flex w-full items-center gap-1">
          <component :is="slots[`th-${cell}-left`]" v-if="slots[`th-${cell}-left`]" />

          <component :is="slots[`th-${cell}`]" v-if="slots[`th-${cell}`]" />

          <template v-else>
            {{ useDictionary(meta.dictionaryKey ? `${meta.dictionaryKey}.${cell}` : cell) }}
          </template>

          <component :is="slots[`th-${cell}-right`]" v-if="slots[`th-${cell}-right`]" />

          <svg
            v-if="canSortBy(cell)"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            class="text-surface/50 ml-auto size-3 shrink-0"
            stroke="currentColor"
            stroke-width="4"
          >
            <polyline points="10 22 16 28 22 22" fill="none" :class="{ 'text-accent': isSorted(cell, 'desc') }" />
            <polyline points="10 10 16 4 22 10" fill="none" :class="{ 'text-accent': isSorted(cell, 'asc') }" />
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
const props = withDefaults(
  defineProps<{
    cells: string[];

    meta: {
      expandedKey?: string;
      dictionaryKey?: string;

      trClass?: string;
      thClass?: string;

      stickyLeft: string[];
      stickyRight: string[];
    };

    sortBy?: string[];
    sortByClient?: string[];

    slots: {
      thead?: object;
      actions?: object;
      [key: string]: object | undefined;
    };
  }>(),
  {
    sortBy: () => [],
    sortByClient: () => []
  }
);

const route = useRoute();

const canSortBy = (column: string) => [...props.sortBy, ...props.sortByClient].includes(column);

const isSorted = (cell: string, direction: string) => {
  return String(route.query.sortBy).startsWith(`${cell}:${direction}`);
};

const onSort = (column: string) => {
  if (!canSortBy(column)) return;

  const direction = String(route.query.sortBy).endsWith(':desc') ? 'asc' : 'desc';

  navigateTo({ query: { ...route.query, sortBy: `${column}:${direction}` } });
};
</script>
