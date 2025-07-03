<template>
  <div v-if="columns && columns.length > 0" class="scrollbar w-full overflow-auto">
    <table class="w-full border-separate border-spacing-0 text-sm whitespace-nowrap">
      <thead class="text-left font-semibold select-none" :class="[{ 'sticky z-1': stickyHead }, stickyOffset]">
        <component :is="$slots.thead" v-if="$slots.thead" />

        <tr :class="['table-tr', trClass]">
          <template v-for="cell in Object.keys(mergedColumns[0]!)" :key="cell">
            <th
              v-if="!isOmitted(cell)"
              :class="[
                'table-th',
                thClass,
                { 'left-0 md:sticky': stickyCells?.includes(cell) },
                { 'hover:bg-surface/3 cursor-pointer duration-200': sortBy?.includes(cell) },
                { 'text-accent': $route.query.sort?.includes(cell + ':') }
              ]"
              @click="sortBy?.includes(cell) && handleSortBy(cell)"
            >
              <div class="flex items-center justify-between gap-px">
                {{ useDictionary(cell) }}

                <svg
                  v-if="sortBy?.includes(cell)"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  class="text-surface/50 size-3 shrink-0"
                >
                  <polyline
                    points="10 22 16 28 22 22"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    :class="{ 'text-accent': $route.query.sort?.includes(cell + ':asc') }"
                  />

                  <polyline
                    points="10 10 16 4 22 10"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    :class="{ 'text-accent': $route.query.sort?.includes(cell + ':desc') }"
                  />
                </svg>
              </div>
            </th>
          </template>

          <th v-if="$slots.actions" :class="['w-0', thClass]" />
        </tr>
      </thead>

      <tbody>
        <tr v-for="(entry, index) in mergedColumns" :key="index" :class="['table-tr', trClass]">
          <template v-for="cell in Object.keys(entry)" :key="cell">
            <td
              v-if="!isOmitted(cell)"
              :class="['table-td', tdClass, { 'left-0 md:sticky': stickyCells?.includes(cell) }]"
            >
              <component :is="$slots[cell]" v-if="$slots[cell]" :entry="entry" :value="entry[cell]" />

              <template v-else>
                {{ entry[cell] }}
              </template>
            </td>
          </template>

          <td v-if="$slots.actions" :class="['table-td', tdClass]">
            <component :is="$slots.actions" v-if="$slots.actions" :entry="entry" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const {
  stickyOffset = 'top-0',
  columnsExtra,
  columns,
  omit
} = defineProps<{
  columns: T[];
  columnsExtra?: string;
  stickyHead?: boolean;
  stickyOffset?: string;
  stickyCells?: string;
  sortBy?: string;
  trClass?: string;
  thClass?: string;
  tdClass?: string;
  omit?: string;
}>();

type ColumnSlots = { [K in keyof T]?: (props: { entry: T; value: T[K] }) => void };
type CustomSlots = { [key: string]: (props: { entry: T; value: T[keyof T] }) => void };

defineSlots<ColumnSlots & CustomSlots>();

const mergedColumns = computed(() => {
  if (columnsExtra && Array.isArray(columns)) {
    const extra = Object.fromEntries(columnsExtra.split(',').map((key) => [key, null]));

    return columns.map((column) => ({ ...column, ...extra }));
  }

  return columns;
});

const isOmitted = (key: string) => {
  if (omit && key) {
    return new Set(String(omit).split(',')).has(key);
  }

  return false;
};

const route = useRoute();

const handleSortBy = (column: string) => {
  const sortBy = String(route.query.sort).endsWith(':desc') ? 'asc' : 'desc';

  navigateTo({ query: { ...route.query, sort: `${column}:${sortBy}` } });
};
</script>
