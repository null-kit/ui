<template>
  <div class="isolate">
    <div v-if="stickyHead" ref="theadVisible" class="sticky top-0 z-1 overflow-hidden">
      <table class="table-default w-full">
        <AppTableHead :table @sort="$emit('sort', $event)">
          <template v-for="(_, name) in $slots" #[name]="scope">
            <slot :name v-bind="scope" />
          </template>
        </AppTableHead>
      </table>
    </div>

    <div
      ref="tableWrapper"
      class="scrollbar w-full overflow-auto"
      :style="{ scrollbarWidth: stickyScrollbar ? 'none' : undefined }"
    >
      <table class="table-default w-full" :class="{ 'table-striped': striped && !virtualScroll }">
        <AppTableHead :table :column-styles :is-hidden="stickyHead" @sort="$emit('sort', $event)">
          <template v-for="(_, name) in $slots" #[name]="scope">
            <slot :name v-bind="scope" />
          </template>
        </AppTableHead>

        <tbody ref="tbody" class="isolate">
          <tr v-if="virtualScroll" aria-hidden>
            <td :style="{ padding: 0, border: 0, height: topPadding + 'px' }" />
          </tr>

          <template v-for="(row, index) in visibleRows" :key="row.id">
            <tr
              :aria-expanded="row.getIsExpanded() || undefined"
              :data-row="striped && virtualScroll && (startIndex + index) % 2 !== 0 ? 'odd' : undefined"
              :height="typeof virtualScroll === 'number' ? virtualScroll : undefined"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :data-cell="cell.column.id"
                :aria-expanded="(cell.column.id === 'expander' && row.depth > 0) || undefined"
                :class="[
                  getTdClass(cell.column.columnDef.meta?.class, cell),
                  getTdClass(cell.column.columnDef.meta?.tdClass, cell)
                ]"
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

        <AppTableFoot :table>
          <template v-for="(_, name) in $slots" #[name]="scope">
            <slot :name v-bind="scope" />
          </template>
        </AppTableFoot>
      </table>
    </div>

    <div
      v-if="stickyScrollbar"
      ref="tableScrollbar"
      class="scrollbar sticky bottom-0 z-1 -mt-px w-full overflow-x-auto overflow-y-hidden"
    >
      <div ref="tableScrollbarThumb" class="h-px" />
    </div>
  </div>
</template>

<script lang="ts">
import type { RowData, Row, Cell } from '@tanstack/vue-table';

type TdClass<TData, TValue> = string | ((cell: Cell<TData, TValue>) => string | undefined);

declare module '@tanstack/vue-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    class?: string;
    thClass?: string;
    tdClass?: TdClass<TData, TValue>;
    tfClass?: string;
    show?: boolean;
    pin?: 'left' | 'right';
  }
}

const getTdClass = <TData, TValue>(tdClass: TdClass<TData, TValue> | undefined, cell: Cell<TData, TValue>) => {
  return typeof tdClass === 'function' ? tdClass(cell) : tdClass;
};
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
  type ColumnDef,
  type ColumnHelper,
  type Column,
  type ExpandedState,
  type SortingState,
  type VisibilityState,
  type ColumnPinningState
} from '@tanstack/vue-table';

const slots = defineSlots<TableTanSlots<TData>>();

defineEmits<{ sort: [TableSortType] }>();

const props = withDefaults(
  defineProps<{
    data: TData[];
    columns: ColumnDef<TData>[] | ((columnHelper: ColumnHelper<TData>) => ColumnDef<TData>[]);
    nestedKey?: keyof TData;
    sortDefault?: MaybeRef<TableSortType | string>;
    sort?: 'server' | 'client';
    enableSorting?: boolean;
    virtualScroll?: boolean | number;
    stickyHead?: boolean;
    stickyScrollbar?: boolean;
    striped?: boolean;
  }>(),
  {
    enableSorting: undefined
  }
);

if (!props.columns) throw new Error('columns prop is required');

const route = useRoute();

const createColumnExpander = () => {
  if (!props.nestedKey) return [];

  return [
    {
      id: 'expander',
      enablePinning: false,
      size: 38,
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

const initialSorting = computed<SortingState>(() => {
  const sortBy = (route.query.sortBy as string) || unref(props.sortDefault);
  if (!sortBy) return [];

  const [column, direction] = sortBy.split(':');
  if (!column) return [];

  return [{ id: column, desc: direction === 'desc' }];
});

const expanded = ref<ExpandedState>({});
const sorting = ref<SortingState>(initialSorting.value);
const columnVisibility = ref<VisibilityState>({});
const columnPinning = ref<ColumnPinningState>({
  left: ['expander']
});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    const columns = typeof props.columns === 'function' ? props.columns(createColumnHelper<TData>()) : props.columns;

    return [...createColumnExpander(), ...columns];
  },
  defaultColumn: {
    enableResizing: false,
    enableSorting: props.enableSorting,
    size: undefined
  },
  manualSorting: props.sort === 'server',
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
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get columnPinning() {
      return columnPinning.value;
    }
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue;

    if (props.sort) {
      const query: Record<string, string | undefined> = { ...route.query, sortBy: undefined };

      for (const item of sorting.value) {
        if (Object.keys(item).length > 0) {
          query[`sortBy`] = `${item.id}:${item.desc ? 'desc' : 'asc'}`;
        } else {
          query[`sortBy`] = undefined;
        }
      }

      navigateTo({ query });
    }
  },
  onExpandedChange: (updaterOrValue) => {
    expanded.value = typeof updaterOrValue === 'function' ? updaterOrValue(expanded.value) : updaterOrValue;
  },
  onColumnPinningChange: (updaterOrValue) => {
    columnPinning.value = typeof updaterOrValue === 'function' ? updaterOrValue(columnPinning.value) : updaterOrValue;
  }
});

const columnStyles = (column: Column<TData>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const canResize = column.getCanResize() || column.columnDef.size;

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : undefined,
    zIndex: isPinned ? 2 : undefined,
    [`--size`]: canResize ? `${column.getSize()}px` : undefined,
    minWidth: canResize ? `var(--size)` : undefined,
    maxWidth: canResize ? `var(--size)` : undefined,
    width: canResize ? `var(--size)` : undefined
  };
};

const tableWrapper = useTemplateRef<HTMLElement>('tableWrapper');

const rows = computed(() => table.getRowModel().rows);
const leafColumns = computed(() => table.getAllLeafColumns());

const { startIndex, visibleRows, topPadding, bottomPadding } = useTableVirtualRows(rows, props.virtualScroll);

if (props.stickyScrollbar) useTableStickyScrollbar(tableWrapper);
if (props.stickyHead) useTableStickyHead(tableWrapper);

for (const column of leafColumns.value) {
  if (column.columnDef.meta?.pin === 'left') {
    columnPinning.value.left?.push(column.id);
  }

  if (column.columnDef.meta?.pin === 'right') {
    columnPinning.value.right?.push(column.id);
  }
}

watch(
  leafColumns,
  (columns) => {
    for (const column of columns) {
      if (column.columnDef.meta?.show !== undefined) {
        columnVisibility.value[column.id] = column.columnDef.meta?.show;
      }
    }
  },
  { immediate: true }
);
</script>
