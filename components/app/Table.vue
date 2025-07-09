<template>
  <div v-if="columns && columns.length > 0" class="w-full text-sm whitespace-nowrap">
    <div
      ref="theadVisible"
      class="table-thead flex overflow-hidden select-none"
      :class="[{ 'sticky z-10': stickyHead }, stickyOffset]"
    >
      <component :is="$slots.thead" v-if="$slots.thead" />

      <div :class="['table-tr', trClass]" class="flex">
        <div
          v-for="(cell, index) in mergedColumnKeys"
          :key="cell"
          :class="[
            'table-th transition-colors',
            thClass,
            { 'left-0 md:sticky': stickyCells.includes(cell) },
            { 'hover:bg-surface/3 cursor-pointer duration-200': sortBy.includes(cell) },
            { 'text-accent': String($route.query.sort).startsWith(cell + ':') }
          ]"
          :style="{ minWidth: theadCellWidths[index] + 'px' }"
          @click="onSortBy(cell)"
        >
          <div class="flex items-center gap-1">
            {{ useDictionary(cell) }}

            <component :is="$slots[`th-${cell}`]" v-if="$slots[`th-${cell}`]" />

            <svg
              v-if="sortBy.includes(cell)"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              class="text-surface/50 ml-auto size-3 shrink-0"
            >
              <polyline
                points="10 22 16 28 22 22"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                :class="{ 'text-accent': String($route.query.sort).startsWith(cell + ':asc') }"
              />

              <polyline
                points="10 10 16 4 22 10"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                :class="{ 'text-accent': String($route.query.sort).startsWith(cell + ':desc') }"
              />
            </svg>
          </div>
        </div>

        <div
          v-if="$slots.actions"
          :class="['table-th w-0', thClass]"
          :style="{ minWidth: theadCellWidths[theadCellWidths.length - 1] + 'px' }"
        />
      </div>
    </div>

    <div ref="tableWrapper" class="scrollbar w-full overflow-auto">
      <table class="w-full border-separate border-spacing-0">
        <thead ref="theadHidden" class="table-thead pointer-events-none invisible">
          <tr :class="['table-tr', trClass]">
            <th v-for="cell in mergedColumnKeys" :key="cell" :class="['table-th', thClass]">
              <div class="flex items-center gap-1">
                {{ useDictionary(cell) }}

                <component :is="$slots[`th-${cell}`]" v-if="$slots[`th-${cell}`]" />

                <div v-if="sortBy.includes(cell)" class="size-3 shrink-0" />
              </div>
            </th>

            <th v-if="$slots.actions" :class="['table-th w-0', thClass]" />
          </tr>
        </thead>

        <tbody>
          <tr v-for="(entry, index) in mergedColumns" :key="index" :class="['table-tr', trClass]">
            <td
              v-for="cell in Object.keys(entry)"
              :key="cell"
              :class="['table-td', tdClass, { 'left-0 z-1 md:sticky': stickyCells.includes(cell) }]"
            >
              <component :is="$slots[cell]" v-if="$slots[cell]" :entry="columns[index]" :value="entry[cell]" />

              <template v-else>
                {{ entry[cell] }}
              </template>
            </td>

            <td v-if="$slots.actions" :class="['table-td', tdClass]">
              <component :is="$slots.actions" :entry="entry" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const {
  stickyOffset = 'top-0',
  columnsExtra,
  columns,
  omit = [],
  stickyCells = [],
  sortBy = []
} = defineProps<{
  columns: T[];
  columnsExtra?: string[];
  stickyHead?: boolean;
  stickyOffset?: string;
  stickyCells?: string[];
  sortBy?: string[];
  trClass?: string;
  thClass?: string;
  tdClass?: string;
  omit?: string[];
}>();

type ColumnSlots = { [K in keyof T]?: (props: { entry: T; value: T[K] }) => void };
type CustomSlots = { [key: string]: (props: { entry: T; value: T[keyof T] }) => void };

defineSlots<ColumnSlots & CustomSlots>();

const route = useRoute();

const mergedColumns = computed(() => {
  const omitted = columns.map((row) => {
    return Object.fromEntries(Object.entries(row).filter(([key]) => !omit.includes(key)));
  });

  if (columnsExtra) {
    const extra = Object.fromEntries(columnsExtra.map((key) => [key, null]));

    return omitted.map((column) => ({ ...column, ...extra }));
  }

  return omitted;
});

const mergedColumnKeys = computed(() => Object.keys(mergedColumns.value[0]!));

const onSortBy = (column: string) => {
  if (!sortBy.includes(column)) return;

  const direction = String(route.query.sort).endsWith(':desc') ? 'asc' : 'desc';

  navigateTo({ query: { ...route.query, sort: `${column}:${direction}` } });
};

const tableWrapper = useTemplateRef('tableWrapper');
const theadVisible = useTemplateRef('theadVisible');
const theadHidden = useTemplateRef('theadHidden');

const theadCellWidths = ref<number[]>([]);

const getRect = (element: HTMLElement) => element.getBoundingClientRect();

const getTheadCellWidths = () => {
  if (!theadHidden.value || !theadVisible.value) return;

  const theadCells = theadHidden.value.querySelectorAll('th');

  theadVisible.value.style.marginBottom = `-${getRect(theadVisible.value).height}px`;

  theadCellWidths.value = Array.from(theadCells).map((cell) => getRect(cell).width);
};

const debouncedGetTheadCellWidths = debounce(getTheadCellWidths, 30);

watch(mergedColumnKeys, () => nextTick().then(() => debouncedGetTheadCellWidths()), { immediate: true });

let scrollHandler: () => void;
let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  if (!tableWrapper.value || !theadVisible.value) return;

  resizeObserver = new ResizeObserver(getTheadCellWidths);
  resizeObserver.observe(tableWrapper.value);

  scrollHandler = () => theadVisible.value?.scrollTo({ left: tableWrapper.value?.scrollLeft });

  tableWrapper.value.addEventListener('scroll', scrollHandler);
});

onUnmounted(() => {
  if (scrollHandler) tableWrapper.value?.removeEventListener('scroll', scrollHandler);
  if (resizeObserver) resizeObserver.disconnect();
});
</script>
