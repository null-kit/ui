<template>
  <div class="isolate">
    <div v-if="stickyHead" ref="theadVisible" class="sticky top-0 z-1 overflow-hidden">
      <table class="table-default w-full">
        <AppTanHead :table>
          <template v-for="(_, name) in $slots" #[name]="scope">
            <slot :name v-bind="scope" />
          </template>
        </AppTanHead>
      </table>
    </div>

    <div
      ref="tableWrapper"
      class="scrollbar w-full overflow-auto"
      :style="{ scrollbarWidth: stickyScrollbar ? 'none' : undefined }"
    >
      <table class="table-default w-full" :class="{ 'table-striped': striped && !virtualScroll }">
        <AppTanHead :table :column-styles :is-hidden="stickyHead">
          <template v-for="(_, name) in $slots" #[name]="scope">
            <slot :name v-bind="scope" />
          </template>
        </AppTanHead>

        <tbody ref="tbody" class="isolate">
          <tr v-if="virtualScroll" aria-hidden>
            <td :style="{ padding: 0, border: 0, height: topPadding + 'px' }" />
          </tr>

          <template v-for="(row, index) in visibleRows" :key="row.id">
            <tr
              :aria-expanded="row.getIsExpanded() || undefined"
              :data-tr="striped && virtualScroll && (startIndex + index) % 2 !== 0 ? 'odd' : undefined"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :data-td="cell.column.id"
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

        <tfoot v-if="hasFooter">
          <template v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
            <tr>
              <td v-for="cell in footerGroup.headers" :key="cell.id" :colSpan="cell.colSpan">
                <slot
                  v-if="!cell.isPlaceholder"
                  :name="`tf-${cell.id}`"
                  :values="table.getRowModel().rows.map((row) => row.original[cell.id as keyof TData])"
                >
                  <FlexRender :render="cell.column.columnDef.footer" :props="cell.getContext()" />
                </slot>
              </td>
            </tr>
          </template>
        </tfoot>

        <!-- <AppTanFoot :table /> -->
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
    show?: boolean;
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

const slots = defineSlots<TableTanSlots<TData>>();

const props = withDefaults(
  defineProps<{
    data: TData[];
    columns: ColumnDef<TData>[] | ((columnHelper: ColumnHelper<TData>) => ColumnDef<TData>[]);
    nestedKey?: keyof TData;
    sortDefault?: `${Extract<keyof TData, string>}:${'asc' | 'desc'}`;
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
      meta: { class: 'w-9' },
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
  const sortBy = (route.query.sortBy as string) || props.sortDefault;
  if (!sortBy) return [];

  const [column, direction] = sortBy.split(':');
  if (!column) return [];

  return [{ id: column, desc: direction === 'desc' }];
});

const expanded = ref<ExpandedState>({});
const sorting = ref<SortingState>(initialSorting.value);

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    const columns = typeof props.columns === 'function' ? props.columns(createColumnHelper<TData>()) : props.columns;
    const visibleColumns = columns.filter(({ meta }) => meta?.show === undefined || meta?.show);

    return [...createColumnExpander(), ...visibleColumns];
  },
  defaultColumn: {
    enableResizing: false,
    enableSorting: props.enableSorting,
    size: undefined
  },
  initialState: {
    columnPinning: {
      left: ['expander']
    }
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
  }
});

const columnStyles = (column: Column<TData>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const canResize = column.getCanResize() || column.columnDef.size;

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : undefined,
    zIndex: isPinned ? 1 : undefined,
    [`--size`]: canResize ? `${column.getSize()}px` : undefined,
    minWidth: canResize ? `var(--size)` : undefined,
    maxWidth: canResize ? `var(--size)` : undefined
    // width: canResize ? `var(--size)` : undefined
  };
};

const hasFooter =
  table
    .getFooterGroups()
    .flatMap(({ headers }) => headers.map(({ column }) => column.columnDef.footer))
    .filter(Boolean).length > 0;

const tableWrapper = useTemplateRef<HTMLElement>('tableWrapper');

const rows = computed(() => table.getRowModel().rows);

const { startIndex, visibleRows, topPadding, bottomPadding } = useTableVirtualRows(rows, props.virtualScroll);

if (props.stickyScrollbar) useTableStickyScrollbar(tableWrapper);
if (props.stickyHead) useTableStickyHead(tableWrapper);
</script>
