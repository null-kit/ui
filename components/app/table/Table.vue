<template>
  <div v-if="data && data.length > 0">
    <div v-if="stickyHead" ref="theadVisible" class="sticky z-5 overflow-hidden" :class="stickyOffset">
      <table class="table-default w-full border-separate border-spacing-0">
        <AppTableHead v-bind="props" :rows :slots />
      </table>
    </div>

    <div ref="tableWrapper" class="scrollbar w-full overflow-auto">
      <table class="table-default w-full border-separate border-spacing-0">
        <AppTableHead :class="{ 'pointer-events-none invisible': stickyHead }" v-bind="props" :rows :slots />

        <tbody>
          <template v-for="(entry, pIndex) in rows" :key="pIndex">
            <AppTableRow v-bind="props" :data="data[pIndex]" :entry :slots @toggle="toggleRow(pIndex)" />

            <TransitionGroup
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0 duration-200"
              leave-to-class="opacity-0 -translate-y-2 duration-200"
            >
              <template v-if="expanded && isExpanded(pIndex)">
                <AppTableRow
                  v-for="(row, cIndex) in entry[expanded]"
                  :key="cIndex"
                  v-bind="props"
                  :data="row"
                  :entry="row"
                  :slots
                  is-nested
                />
              </template>
            </TransitionGroup>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
type DataSlots = { [K in keyof T]?: (props: { entry: T; value: T[K] }) => void };
type ExtraSlots = { [key: string]: (props: { entry: T; value: T[keyof T] }) => void };

const slots = defineSlots<DataSlots & ExtraSlots>();

const props = withDefaults(
  defineProps<{
    data: T[];
    columnsExtra?: string[];
    stickyHead?: boolean;
    stickyOffset?: string;
    stickyLeft?: string[];
    stickyRight?: string[];
    sortBy?: string[];
    trClass?: string;
    thClass?: string;
    tdClass?: string;
    omit?: string[];
    pick?: string[];
    dictionaryKey?: string;
    expanded?: string;
  }>(),
  {
    stickyOffset: 'top-0',
    stickyLeft: () => [],
    stickyRight: () => [],
    sortBy: () => [],
    omit: () => [],
    pick: () => []
  }
);

const rows = computed(() => {
  const merged = props.data.map((row) => {
    if (props.pick.length > 0) {
      return Object.fromEntries(Object.entries(row).filter(([key]) => props.pick.includes(key)));
    }

    if (props.omit.length > 0) {
      return Object.fromEntries(Object.entries(row).filter(([key]) => !props.omit.includes(key)));
    }

    return row;
  });

  if (props.columnsExtra) {
    const extra = Object.fromEntries(props.columnsExtra.map((key) => [key, null]));

    return merged.map((column) => ({ ...column, ...extra }));
  }

  return merged;
});

const expandedRows = ref(new Set());

const toggleRow = (index: number) => {
  if (expandedRows.value.has(index)) {
    return expandedRows.value.delete(index);
  }

  expandedRows.value.add(index);
};

const isExpanded = (index: number) => expandedRows.value.has(index);

const tableWrapper = useTemplateRef('tableWrapper');
const theadVisible = useTemplateRef('theadVisible');

let onScroll: () => void;
let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  if (!props.stickyHead) return;

  resizeObserver = new ResizeObserver(() => {
    const hiddenList = tableWrapper.value!.querySelectorAll('th');
    const visibleList = theadVisible.value!.querySelectorAll('th');

    if (!hiddenList || !visibleList) return;

    theadVisible.value!.style.marginBottom = `-${theadVisible.value!.offsetHeight}px`;

    hiddenList.forEach((cell, index) => {
      const visibleCell = visibleList[index];
      const { width } = cell.getBoundingClientRect();

      if (visibleCell) visibleCell.style.minWidth = `${width}px`;
    });
  });

  if (tableWrapper.value) {
    resizeObserver.observe(tableWrapper.value);

    const hiddenList = tableWrapper.value.querySelectorAll('th');

    for (const cell of hiddenList) resizeObserver.observe(cell);
  }

  onScroll = () => theadVisible.value!.scrollTo({ left: tableWrapper.value!.scrollLeft });

  tableWrapper.value!.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  if (onScroll) tableWrapper.value?.removeEventListener('scroll', onScroll);
  if (resizeObserver) resizeObserver.disconnect();
});
</script>
