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
            <td colspan="100%" :style="{ padding: 0, border: 0, height: topSize + 'px' }" />
          </tr>

          <tr
            v-for="(row, index) in visibleRows"
            :key="row.id"
            :aria-expanded="row.getIsExpanded() || undefined"
            :data-row="striped && virtualScroll && (startIndex + index) % 2 !== 0 ? 'odd' : undefined"
            :data-row-context="rowContext ? row.original[rowContext] : undefined"
            :height="typeof virtualScroll === 'number' ? virtualScroll : undefined"
            :class="{ 'cursor-pointer': fullRowExpand && row.getCanExpand() }"
            @click="fullRowExpand && row.getCanExpand() ? row.toggleExpanded() : undefined"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :data-cell="cell.column.id"
              :aria-expanded="(cell.column.id === 'expander' && row.depth > 0) || undefined"
              :class="[cell.column.columnDef.meta?.class, getTdClass(cell.column.columnDef.meta?.tdClass, cell)]"
              :style="columnStyles(cell.column)"
            >
              <slot
                v-if="!cell.getIsPlaceholder()"
                :name="cell.column.id"
                :cell="cell.getValue() as NoInfer<TData[keyof TData]>"
                :row="row.original"
                :is-nested="row.depth > 0"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="{ ...cell.getContext() }" />
              </slot>
            </td>
          </tr>

          <tr v-if="virtualScroll" aria-hidden>
            <td colspan="100%" :style="{ padding: 0, border: 0, height: bottomSize + 'px' }" />
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
import type { CSSProperties } from 'vue';
import { useTable, FlexRender, createColumnHelper } from '@tanstack/vue-table';
import type { ExpandedState, SortingState, ColumnVisibilityState, ColumnPinningState } from '@tanstack/vue-table';

const getTdClass = <TData extends RowData, TValue>(
  tdClass: TableTdClass<TData, TValue> | undefined,
  cell: TableCell<TData, TValue>
) => {
  return typeof tdClass === 'function' ? tdClass(cell.getContext()) : tdClass;
};
</script>

<script setup lang="ts" generic="TData extends RowData">
defineSlots<TableSlots<TData>>();

defineEmits<{ sort: [TableSortType]; contextmenu: [TData] }>();

const props = withDefaults(
  defineProps<{
    data: TData[];
    columns: ColumnDef<TData>[] | ((columnHelper: ColumnHelper<TData>) => ColumnDef<TData>[]);
    nestedKey?: keyof TData;
    fullRowExpand?: boolean;
    sortDefault?: MaybeRef<TableSortType | string>;
    sort?: 'server' | 'client';
    enableSorting?: boolean;
    virtualScroll?: boolean | number;
    stickyHead?: boolean;
    stickyScrollbar?: boolean;
    striped?: boolean;
    rowContext?: keyof TData;
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
      cell: ({ row }: { row: TableRow<TData> }) => {
        if (!row.getCanExpand()) return;

        return h(
          'button',
          {
            type: 'button',
            onClick: !props.fullRowExpand ? row.getToggleExpandedHandler() : undefined,
            class: 'btn btn-sm size-6'
          },
          h(
            'svg',
            {
              viewBox: '0 0 24 24',
              fill: 'none',
              class: `size-full shrink-0 duration-200 ${row.getIsExpanded() ? 'rotate-90' : ''}`
            },
            [h('path', { d: 'M7 2L17 12L7 22', stroke: 'currentColor', 'stroke-width': '3.5' })]
          )
        );
      }
    }
  ];
};

const getInitialSorting = (): SortingState => {
  const sortBy = (route.query.sortBy as string) || unref(props.sortDefault);
  if (!sortBy) return [];

  const [column, direction] = sortBy.split(':');
  if (!column) return [];

  return [{ id: column, desc: direction === 'desc' }];
};

const expanded = ref<ExpandedState>({});
const sorting = ref<SortingState>(getInitialSorting());
const columnVisibility = ref<ColumnVisibilityState>({});
const columnPinning = ref<ColumnPinningState>({
  start: ['expander'],
  end: []
});

const table = useTable({
  features: tableFeatureSet,
  get data() {
    return props.data;
  },
  get columns() {
    const columns =
      typeof props.columns === 'function' ? props.columns(createColumnHelper<TableFeatureSet, TData>()) : props.columns;

    return [...createColumnExpander(), ...columns];
  },
  defaultColumn: {
    enableResizing: false,
    enableSorting: props.enableSorting,
    size: undefined
  },
  manualSorting: props.sort === 'server',
  columnResizeMode: 'onChange',
  getSubRows: (row: TData) => (row && props.nestedKey ? (row[props.nestedKey] as TData[]) : undefined),
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

const noColumnStyle: CSSProperties = Object.freeze({});

const computeColumnStyle = (column: TableColumn<TData>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const canResize = column.getCanResize() || column.columnDef.size;

  if (!isPinned && !canResize) return noColumnStyle;

  const style: CSSProperties = {};

  if (isPinned) {
    style.position = 'sticky';
    style.zIndex = 2;

    if (isPinned === 'start') {
      style.left = `${column.getStart('start')}px`;
    } else {
      style.right = `${column.getAfter('end')}px`;
    }
  }

  if (canResize) {
    style['--size'] = `${column.getSize()}px`;
    style.minWidth = 'var(--size)';
    style.maxWidth = 'var(--size)';
    style.width = 'var(--size)';
  }

  return style;
};

const tableWrapper = useTemplateRef<HTMLElement>('tableWrapper');
const tbody = useTemplateRef<HTMLElement>('tbody');

const rows = computed(() => table.getRowModel().rows);
const leafColumns = computed(() => table.getAllLeafColumns());

const columnStyleCache = computed(() => {
  const cache = new Map<string, CSSProperties>();

  for (const column of table.getAllFlatColumns()) cache.set(column.id, computeColumnStyle(column));

  return cache;
});

const columnStyles = (column: TableColumn<TData>): CSSProperties => {
  return columnStyleCache.value.get(column.id) ?? computeColumnStyle(column);
};

const { startIndex, visibleRows, topSize, bottomSize } = useVirtualRows({
  rows,
  enabledOrHeight: props.virtualScroll,
  body: tbody
});

if (props.stickyScrollbar) useTableStickyScrollbar(tableWrapper);
if (props.stickyHead) useTableStickyHead(tableWrapper);

for (const column of leafColumns.value) {
  if (column.columnDef.meta?.pin === 'start') {
    columnPinning.value.start.push(column.id);
  }

  if (column.columnDef.meta?.pin === 'end') {
    columnPinning.value.end.push(column.id);
  }
}

watch(
  leafColumns,
  (columns) => {
    for (const column of columns) {
      const show = column.columnDef.meta?.show;

      if (show !== undefined) columnVisibility.value[column.id] = show;
    }
  },
  { immediate: true }
);
</script>
