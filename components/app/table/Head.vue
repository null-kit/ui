<template>
  <thead>
    <component :is="slots.thead" v-if="slots.thead" />

    <tr :class="trClass">
      <th v-if="expandedKey" class="w-0" />

      <th
        v-for="cell in cells"
        :key="cell"
        :class="[
          thClass,
          { 'left-0 md:sticky': stickyLeft.includes(cell) },
          { 'right-0 -left-px border-l md:sticky': stickyRight.includes(cell) },
          { 'hover:bg-surface/3 cursor-pointer duration-200': sortBy.includes(cell) },
          { 'text-accent': String($route.query.sort).startsWith(cell + ':') }
        ]"
        @click="onSortBy(cell)"
      >
        <div :class="{ 'flex w-full items-center gap-1': slots[`th-${cell}`] || sortBy.includes(cell) }">
          {{ useDictionary(dictionaryKey ? `${dictionaryKey}.${cell}` : cell) }}

          <component :is="slots[`th-${cell}`]" v-if="slots[`th-${cell}`]" />

          <svg
            v-if="sortBy.includes(cell)"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            class="text-surface/50 ml-auto size-3 shrink-0"
            stroke="currentColor"
            stroke-width="4"
          >
            <polyline points="10 22 16 28 22 22" fill="none" :class="{ 'text-accent': activeSort(cell, 'asc') }" />
            <polyline points="10 10 16 4 22 10" fill="none" :class="{ 'text-accent': activeSort(cell, 'desc') }" />
          </svg>
        </div>
      </th>

      <th v-if="slots.actions" :class="['w-0', thClass]" />
    </tr>
  </thead>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = withDefaults(
  defineProps<{
    rows: T[];
    expandedKey?: string;
    sortBy?: string[];
    stickyLeft?: string[];
    stickyRight?: string[];
    dictionaryKey?: string;
    trClass?: string;
    thClass?: string;
    slots: {
      thead?: object;
      actions?: object;
      [key: string]: object | undefined;
    };
  }>(),
  {
    sortBy: () => [],
    stickyLeft: () => [],
    stickyRight: () => []
  }
);

const cells = computed(() => Object.keys(props.rows[0]!).filter((key) => key !== props.expandedKey));

const route = useRoute();

const onSortBy = (column: string) => {
  if (!props.sortBy.includes(column)) return;

  const direction = String(route.query.sort).endsWith(':desc') ? 'asc' : 'desc';

  navigateTo({ query: { ...route.query, sort: `${column}:${direction}` } });
};

const activeSort = (cell: string, direction: string) => String(route.query.sort).startsWith(`${cell}:${direction}`);
</script>
