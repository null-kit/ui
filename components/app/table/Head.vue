<template>
  <thead>
    <component :is="slots.thead" v-if="slots.thead" />

    <tr :class="table.trClass">
      <th v-if="table.expandedKey" class="w-0" />

      <th
        v-for="cell in table.cells"
        :key="cell"
        :class="[
          table.thClass,
          { 'left-0 md:sticky': table.stickyLeft?.includes(cell) },
          { 'right-0 -left-px border-l md:sticky': table.stickyRight?.includes(cell) },
          { 'hover:bg-surface/3 cursor-pointer duration-200': canSortBy(cell) },
          { 'text-accent': String($route.query.sortBy).startsWith(cell + ':') }
        ]"
        :aria-label="`th-${cell}`"
        @click="table?.onSortBy(cell)"
      >
        <div class="flex w-full items-center gap-1">
          <component :is="slots[`th-${cell}`]" v-if="slots[`th-${cell}`]" />

          <template v-else>
            {{ useDictionary(table.dictionaryKey ? `${table.dictionaryKey}.${cell}` : cell) }}
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
            <polyline points="10 22 16 28 22 22" fill="none" :class="{ 'text-accent': isSorted(cell, 'asc') }" />
            <polyline points="10 10 16 4 22 10" fill="none" :class="{ 'text-accent': isSorted(cell, 'desc') }" />
          </svg>
        </div>
      </th>

      <th
        v-if="slots.actions"
        :class="[
          'w-0',
          { 'right-0 -left-px border-l md:sticky': table.stickyRight?.includes('actions') },
          table.thClass
        ]"
      />
    </tr>
  </thead>
</template>

<script setup lang="ts">
defineProps<{
  slots: {
    thead?: object;
    actions?: object;
    [key: string]: object | undefined;
  };
}>();

const table = useTable();
const route = useRoute();

const canSortBy = (column: string) => [...(table.sortBy || []), ...(table.sortByClient || [])].includes(column);

const isSorted = (cell: string, direction: string) => {
  return String(route.query.sortBy).startsWith(`${cell}:${direction}`);
};
</script>
