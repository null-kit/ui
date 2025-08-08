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
          { 'text-accent': String($route.query.sortBy).startsWith(cell + ':') }
        ]"
        :aria-label="`th-${cell}`"
        @click="onSortBy(cell)"
      >
        <div :class="{ 'flex w-full items-center gap-1': slots[`th-${cell}`] || sortBy.includes(cell) }">
          <component :is="slots[`th-${cell}`]" v-if="slots[`th-${cell}`]" />

          <template v-else>
            {{ useDictionary(dictionaryKey ? `${dictionaryKey}.${cell}` : cell) }}
          </template>

          <component :is="slots[`th-${cell}-right`]" v-if="slots[`th-${cell}-right`]" />

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

      <th
        v-if="slots.actions"
        :class="['w-0', { 'right-0 -left-px border-l md:sticky': stickyRight.includes('actions') }, thClass]"
      />
    </tr>
  </thead>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = withDefaults(
  defineProps<{
    rows: T[];
    expandedKey?: string;
    sortBy?: string[];
    sortByClient?: string[];
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
    sortByClient: () => [],
    stickyLeft: () => [],
    stickyRight: () => []
  }
);

const cells = computed(() => Object.keys(props.rows[0]!).filter((key) => key !== props.expandedKey));

const route = useRoute();

const sortBy = computed(() => [...props.sortBy, ...props.sortByClient]);

const onSortBy = (column: string) => {
  if (!sortBy.value.includes(column)) return;

  const direction = String(route.query.sortBy).endsWith(':desc') ? 'asc' : 'desc';

  navigateTo({ query: { ...route.query, sortBy: `${column}:${direction}` } });
};

const activeSort = (cell: string, direction: string) => String(route.query.sortBy).startsWith(`${cell}:${direction}`);
</script>
