<template>
  <div class="isolate">
    <div v-if="stickyHead" ref="theadVisible" class="sticky top-0 z-1 overflow-hidden">
      <table class="table-default w-full">
        <AppTanHead :table />
      </table>
    </div>

    <div
      ref="tableWrapper"
      class="scrollbar w-full overflow-auto"
      :style="{ scrollbarWidth: stickyScrollbar ? 'none' : undefined }"
    >
      <table class="table-default w-full">
        <AppTanHead :table :column-styles :is-hidden="stickyHead" />

        <tbody ref="tbody" class="isolate">
          <tr v-if="virtualScroll" aria-hidden>
            <td :style="{ padding: 0, border: 0, height: topPadding + 'px' }" />
          </tr>

          <template v-for="(row, index) in visibleRows" :key="row.id">
            <tr
              :aria-expanded="row.getIsExpanded() || undefined"
              :aria-label="striped && (startIndex + index) % 2 === 0 ? 'even' : undefined"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :aria-label="`td-${cell.column.id}`"
                :aria-expanded="(cell.column.id === 'expander' && row.depth > 0) || undefined"
                :class="cell.column.columnDef.meta?.class"
                :style="columnStyles(cell.column)"
              >
                <slot
                  v-if="!cell.getIsPlaceholder()"
                  :name="cell.column.id"
                  :cell="cell.getValue()"
                  :row="row.original"
                  :isNested="row.depth > 0"
                >
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </slot>
              </td>
            </tr>
          </template>

          <tr v-if="virtualScroll" aria-hidden>
            <td :style="{ padding: 0, border: 0, height: bottomPadding + 'px' }" />
          </tr>
        </tbody>

        <AppTanFoot :table />
      </table>
    </div>

    <div
      v-if="stickyScrollbar"
      ref="tableScrollbar"
      class="scrollbar sticky bottom-0 z-1 w-full overflow-x-auto overflow-y-hidden"
    >
      <div ref="tableScrollbarThumb" class="h-px" />
    </div>
  </div>
</template>

<script lang="ts">
declare module '@tanstack/vue-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    class?: string;
    // sorting?: 'asc' | 'desc';
  }
}
</script>

<script setup lang="ts" generic="TData">
import type { CSSProperties } from 'vue';
import {
  useVueTable,
  FlexRender,
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  type RowData,
  type Row,
  type ColumnDef,
  type ColumnHelper,
  type Column,
  type ExpandedState,
  type SortingState
} from '@tanstack/vue-table';

defineSlots<TableTanSlots<TData>>();

const props = defineProps<{
  data: TData[];
  columns: ColumnDef<TData>[] | ((columnHelper: ColumnHelper<TData>) => ColumnDef<TData>[]);
  nestedKey?: keyof TData;
  defaultSort?: `${Extract<keyof TData, string>}:${'asc' | 'desc'}`;
  virtualScroll?: boolean | number;
  stickyHead?: boolean;
  stickyScrollbar?: boolean;
  striped?: boolean;
}>();

if (!props.columns) throw new Error('columns prop is required');

const createColumnExpander = () => {
  if (!props.nestedKey) return [];

  return [
    {
      id: 'expander',
      enablePinning: false,
      meta: {
        class: 'w-9'
      },
      cell: ({ row }: { row: Row<TData> }) => {
        if (!row.getCanExpand()) return;

        return h(
          'button',
          { type: 'button', onClick: row.getToggleExpandedHandler(), class: 'btn btn-sm size-6' },
          h(
            'svg',
            {
              viewBox: '0 0 24 24',
              fill: 'none',
              class: `size-fit shrink-0 duration-200 ${row.getIsExpanded() ? 'rotate-90' : ''}`
            },
            [h('path', { d: 'M7 2L17 12L7 22', stroke: 'currentColor', 'stroke-width': '3.5' })]
          )
        );
      }
    }
  ];
};

const defaultSorting = computed<SortingState>(() => {
  if (!props.defaultSort) return [];

  const [column, direction] = props.defaultSort.split(':');

  if (!column) return [];

  return [{ id: column, desc: direction === 'desc' }];
});

const expanded = ref<ExpandedState>({});
const sorting = ref<SortingState>(defaultSorting.value);

const table = useVueTable({
  get data() {
    return props.data;
  },
  columns: [
    ...createColumnExpander(),
    ...(typeof props.columns === 'function' ? props.columns(createColumnHelper<TData>()) : props.columns)
  ],
  defaultColumn: {
    enableResizing: false,
    size: undefined
  },
  initialState: {
    columnPinning: {
      left: ['expander']
    }
  },
  columnResizeMode: 'onChange',
  getSubRows: (row) => (row && props.nestedKey ? (row[props.nestedKey] as TData[]) : undefined),
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getSortedRowModel: getSortedRowModel(),
  state: {
    get expanded() {
      return expanded.value;
    },
    get sorting() {
      return sorting.value;
    }
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue;
  },
  onExpandedChange: (updaterOrValue) => {
    expanded.value = typeof updaterOrValue === 'function' ? updaterOrValue(expanded.value) : updaterOrValue;
  }
});

const columnStyles = (column: Column<TData>): CSSProperties => {
  const isPinned = column.getIsPinned();
  // const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  // const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    // boxShadow: isLastLeftPinnedColumn
    //   ? '-4px 0 4px -4px gray inset'
    //   : isFirstRightPinnedColumn
    //     ? '4px 0 4px -4px gray inset'
    //     : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : undefined,
    zIndex: isPinned ? 1 : undefined,
    [`--size`]: column.getCanResize() || column.columnDef.size ? `${column.getSize()}px` : undefined,
    minWidth: column.getCanResize() || column.columnDef.size ? `var(--size)` : undefined,
    maxWidth: column.getCanResize() || column.columnDef.size ? `var(--size)` : undefined
  };
};

const tableWrapper = useTemplateRef<HTMLElement>('tableWrapper');

const rows = computed(() => table.getRowModel().rows);

const { startIndex, visibleRows, topPadding, bottomPadding } = useTableVirtualRows(rows, props.virtualScroll);

if (props.stickyScrollbar) useTableStickyScrollbar(tableWrapper);
if (props.stickyHead) useTableStickyHead(tableWrapper);
</script>
