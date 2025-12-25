<template>
  <AppTableRoot
    v-slot="{ cells, startIndex, topPadding, bottomPadding, visibleRows, isExpanded, toggleRow, data: slotData }"
    v-bind="{ data, meta, pick, omit, columnsOrder, columnsExtra, sort }"
  >
    <div v-if="stickyHead" ref="theadVisible" class="sticky z-1 overflow-hidden" :class="stickyOffset">
      <table class="table-default w-full">
        <AppTableHead v-bind="{ meta, cells, slots, sort }" />
      </table>
    </div>

    <div
      ref="tableWrapper"
      class="scrollbar isolate w-full overflow-auto"
      :style="{ scrollbarWidth: stickyScrollbar ? 'none' : 'auto' }"
    >
      <table class="table-default w-full" :class="{ 'table-striped': striped }">
        <AppTableHead v-bind="{ meta, cells, slots, sort }" :class="{ 'pointer-events-none invisible': stickyHead }" />

        <tbody ref="tbody">
          <tr v-if="virtualScroll" aria-hidden>
            <td :colspan="cells.length" :style="{ padding: 0, border: 0, height: topPadding + 'px' }" />
          </tr>

          <tr
            v-for="(entry, index) in visibleRows"
            :key="startIndex + index"
            :class="trClass"
            :aria-rowindex="startIndex + index"
            :aria-expanded="(expandedKey && isExpanded(entry._rowIndex)) || undefined"
          >
            <td
              v-if="expandedKey"
              ref="expandedCell"
              :aria-expanded="Boolean(entry.isNested) || isExpanded(entry._rowIndex)"
              class="left-0 z-1 md:sticky"
            >
              <button
                v-if="!entry.isNested"
                type="button"
                class="btn btn-sm size-6"
                @click="toggleRow(entry._rowIndex)"
              >
                <AppIcon
                  name="chevron-right"
                  class="duration-200"
                  :class="{ 'rotate-90': isExpanded(entry._rowIndex) }"
                />
              </button>

              <component
                :is="slots['td-expanded']"
                v-else="slots['td-expanded']"
                :entry="getEntry(entry, startIndex + index, slotData)"
                :isNested="entry.isNested"
              />
            </td>

            <td
              v-for="cell in cells"
              :key="cell"
              :aria-label="`td-${cell}`"
              :class="[
                tdClass,
                { 'left-0 z-1 md:sticky': stickyLeft.includes(cell) },
                { 'right-0 -left-px z-1 border-l md:sticky': stickyRight.includes(cell) }
              ]"
              :style="{ left: expandedKey && stickyLeft.includes(cell) ? `${expandedCellWidth}px` : undefined }"
            >
              <component
                :is="slots[cell]"
                v-if="slots[cell]"
                :entry="getEntry(entry, startIndex + index, slotData)"
                :value="getEntry(entry, startIndex + index, slotData)?.[cell]"
                :isNested="entry.isNested"
              />

              <template v-else>{{ entry[cell] }}</template>
            </td>

            <td
              v-if="slots.actions"
              :class="[{ 'right-0 -left-px border-l md:sticky': stickyRight.includes('actions') }, tdClass]"
            >
              <component
                :is="slots.actions"
                :entry="getEntry(entry, startIndex + index, slotData)"
                :isNested="entry.isNested"
              />
            </td>
          </tr>

          <tr v-if="virtualScroll" aria-hidden>
            <td :colspan="cells.length" :style="{ padding: 0, border: 0, height: bottomPadding + 'px' }" />
          </tr>
        </tbody>

        <AppTableFooter v-bind="{ data, cells, meta, slots }" />
      </table>
    </div>

    <div
      v-if="stickyScrollbar"
      ref="tableScrollbar"
      class="scrollbar sticky bottom-0 z-1 w-full overflow-x-auto overflow-y-hidden"
    >
      <div ref="tableScrollbarThumb" class="h-px" />
    </div>
  </AppTableRoot>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const slots = defineSlots<TableSlots<T>>();

const props = withDefaults(
  defineProps<{
    data: T[];

    stickyHead?: boolean;
    stickyOffset?: string;
    stickyLeft?: string[];
    stickyRight?: string[];
    stickyScrollbar?: boolean;

    sortBy?: string[];
    sortByClient?: string[];
    sortByInitial?: `${Extract<keyof T, string>}:${'asc' | 'desc'}`;
    name?: string;

    trClass?: string;
    thClass?: string;
    tdClass?: string;

    omit?: (keyof T)[];
    pick?: (keyof T)[];
    columnsOrder?: (keyof T)[];
    columnsExtra?: string[];

    dictionaryKey?: string;
    expandedKey?: string;
    virtualScroll?: boolean | number;

    striped?: boolean;
  }>(),
  {
    stickyLeft: () => [],
    stickyRight: () => [],
    stickyOffset: 'top-0'
  }
);

const expandedCell = useTemplateRef<HTMLElement | null>('expandedCell');

const expandedCellWidth = computed(() => {
  if (!Array.isArray(expandedCell.value)) return 0;

  return expandedCell.value[0].getBoundingClientRect().width;
});

const meta = reactive({
  expandedKey: props.expandedKey,
  expandedCellWidth: computed(() => expandedCellWidth.value),
  dictionaryKey: props.dictionaryKey,

  trClass: props.trClass,
  thClass: props.thClass,
  tdClass: props.tdClass,

  stickyLeft: props.stickyLeft,
  stickyRight: props.stickyRight,

  virtualScroll: props.virtualScroll,

  sortByClient: props.sortByClient
});

const getEntry = (entry: Record<string, unknown>, index: number, data: T[] = props.data) => {
  if (entry.isNested) return entry;

  if (typeof entry._rowIndex === 'number') {
    return data[entry._rowIndex];
  }

  return data[index];
};

const tableWrapper = useTemplateRef<HTMLElement>('tableWrapper');

if (props.stickyScrollbar) useTableStickyScrollbar(tableWrapper);
if (props.stickyHead) useTableStickyHead(tableWrapper);

const sort = useTableSort(props);
</script>
