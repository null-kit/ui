<template>
  <AppTableRoot
    v-slot="{ cells, startIndex, topPadding, bottomPadding, visibleRows, onSortByClient, isExpanded, toggleRow }"
    v-bind="{ data, meta, pick, omit, columnsExtra }"
  >
    <div v-if="stickyHead" ref="theadVisible" class="sticky z-1 overflow-hidden" :class="stickyOffset">
      <table class="table-default w-full">
        <AppTableHead v-bind="{ meta, cells, slots, sortBy, sortByClient }" @sort="onSortByClient" />
      </table>
    </div>

    <div ref="tableWrapper" class="scrollbar isolate w-full overflow-auto">
      <table class="table-default w-full" :class="{ 'table-striped': striped }">
        <AppTableHead
          v-bind="{ meta, cells, slots, sortBy, sortByClient }"
          :class="{ 'pointer-events-none invisible': stickyHead }"
          @sort="onSortByClient"
        />

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
            <td v-if="expandedKey" :aria-expanded="Boolean(entry.isNested) || isExpanded(entry._rowIndex)">
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
            >
              <component
                :is="slots[cell]"
                v-if="slots[cell]"
                :entry="getEntry(entry, startIndex + index)"
                :value="getEntry(entry, startIndex + index)?.[cell]"
                :isNested="entry.isNested"
              />

              <template v-else>{{ entry[cell] }}</template>
            </td>

            <td
              v-if="slots.actions"
              :class="[{ 'right-0 -left-px border-l md:sticky': stickyRight.includes('actions') }, tdClass]"
            >
              <component :is="slots.actions" :entry="getEntry(entry, startIndex + index)" :isNested="entry.isNested" />
            </td>
          </tr>

          <tr v-if="virtualScroll" aria-hidden>
            <td :colspan="cells.length" :style="{ padding: 0, border: 0, height: bottomPadding + 'px' }" />
          </tr>
        </tbody>

        <AppTableFooter v-bind="{ data, cells, meta, slots }" />
      </table>
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

    sortBy?: string[];
    sortByClient?: string[];

    trClass?: string;
    thClass?: string;
    tdClass?: string;

    omit?: (keyof T)[];
    pick?: (keyof T)[];
    columnsExtra?: string[];

    dictionaryKey?: string;
    expandedKey?: string;
    virtualScroll?: boolean;

    striped?: boolean;
  }>(),
  {
    stickyLeft: () => [],
    stickyRight: () => [],
    stickyOffset: 'top-0'
  }
);

const meta = reactive({
  expandedKey: props.expandedKey,
  dictionaryKey: props.dictionaryKey,

  trClass: props.trClass,
  thClass: props.thClass,
  tdClass: props.tdClass,

  stickyLeft: props.stickyLeft,
  stickyRight: props.stickyRight,

  virtualScroll: props.virtualScroll
});

const getEntry = (entry: Record<string, unknown>, index: number) => {
  if (entry.isNested) return entry;

  return props.data[index] || props.data[Number(entry._rowIndex)];
};

useStickyHead();
</script>
