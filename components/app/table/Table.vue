<template>
  <div v-if="data && data.length > 0">
    <div v-if="stickyHead" ref="theadVisible" class="sticky z-5 overflow-hidden" :class="stickyOffset">
      <table class="table-default w-full border-separate border-spacing-0">
        <AppTableHead :merged-column-keys :slots="$slots" :props />
      </table>
    </div>

    <div ref="tableWrapper" class="scrollbar w-full overflow-auto">
      <table class="table-default w-full border-separate border-spacing-0">
        <AppTableHead
          :class="{ 'pointer-events-none invisible': stickyHead }"
          :merged-column-keys
          :slots="$slots"
          :props
        />

        <tbody>
          <tr v-for="(entry, index) in mergedColumns" :key="index" :class="[trClass]">
            <td
              v-for="cell in Object.keys(entry)"
              :key="cell"
              :class="[
                tdClass,
                { 'left-0 z-1 md:sticky': stickyLeft.includes(cell) },
                { 'right-0 -left-px z-1 border-l md:sticky': stickyRight.includes(cell) }
              ]"
            >
              <component :is="$slots[cell]" v-if="$slots[cell]" :entry="data[index]" :value="entry[cell]" />

              <template v-else>
                {{ entry[cell] }}
              </template>
            </td>

            <td v-if="$slots.actions" :class="tdClass">
              <component :is="$slots.actions" :entry="data[index]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
type ColumnSlots = { [K in keyof T]?: (props: { entry: T; value: T[K] }) => void };
type CustomSlots = { [key: string]: (props: { entry: T; value: T[keyof T] }) => void };

defineSlots<ColumnSlots & CustomSlots>();

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
  }>(),
  {
    stickyHead: false,
    stickyOffset: 'top-0',
    stickyLeft: () => [],
    stickyRight: () => [],
    sortBy: () => [],
    omit: () => [],
    pick: () => []
  }
);

const mergedColumns = computed(() => {
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

const mergedColumnKeys = computed(() => Object.keys(mergedColumns.value[0]!));

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
