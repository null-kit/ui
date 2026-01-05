<template>
  <div ref="tbody">
    <slot
      v-bind="{
        data: sortedData,

        rows,
        cells,

        startIndex,
        endIndex,
        topPadding,
        bottomPadding,
        visibleRows,

        expandedRows,
        isExpanded,
        toggleRow
      }"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = withDefaults(
  defineProps<{
    data: T[];

    sort: {
      sortByQuery: Ref<string>;
      canSortBy: (cell: string) => boolean;
      isSorted: (cell: string, direction: string) => boolean;
      onSort: (cell: string) => void;
    };

    meta: {
      dictionaryKey?: string;
      expandedKey?: string;
      virtualScroll?: boolean | number;
      sortByClient?: string[];
    };

    omit?: (keyof T)[];
    pick?: (keyof T)[];
    columnsOrder?: (keyof T)[];
    columnsExtra?: string[];
  }>(),
  {
    pick: () => [],
    omit: () => [],
    columnsOrder: () => [],
    columnsExtra: () => [],
    sortByClient: () => []
  }
);

const expandedRows = ref(new Set());

const isExpanded = (index: number | unknown) => expandedRows.value.has(index);

const toggleRow = (index: number | unknown) => {
  const row = new Set(expandedRows.value);

  if (row.has(index)) {
    row.delete(index);
  } else {
    row.add(index);
  }

  expandedRows.value = row;
};

// Create formatted rows
const createRows = (data: T[]) => {
  const mergedRows = data.map((row) => {
    let entries: Record<string, unknown> = { ...row };

    if (props.columnsExtra.length > 0) {
      Object.assign(entries, Object.fromEntries(props.columnsExtra.map((key) => [key, null])));
    }

    if (props.columnsOrder.length > 0) {
      const orderedEntries: Record<string, unknown> = {};

      for (const key of props.columnsOrder) {
        if (key in entries) {
          orderedEntries[key as string] = entries[key as string];
        }
      }

      for (const key in entries) {
        if (!(key in orderedEntries)) {
          orderedEntries[key] = entries[key];
        }
      }

      entries = orderedEntries;
    }

    if (props.pick.length > 0) {
      entries = Object.fromEntries(Object.entries(entries).filter(([key]) => props.pick.includes(key)));
    }

    if (props.omit.length > 0) {
      entries = Object.fromEntries(Object.entries(entries).filter(([key]) => !props.omit.includes(key)));
    }

    return entries;
  });

  // Expand all nested rows (for virtualized rows)
  if (props.meta.expandedKey) {
    const unpacked: Record<string, unknown>[] = [];

    for (const [rowIndex, row] of mergedRows.entries()) {
      unpacked.push({ ...row, _rowIndex: rowIndex });

      const nestedArray = row[props.meta.expandedKey];

      if (!Array.isArray(nestedArray)) continue;

      for (const nested of nestedArray) {
        unpacked.push({ ...nested, isNested: true, _parentIndex: rowIndex });
      }
    }

    return unpacked.filter((row) => {
      if (!row.isNested) return true;

      return expandedRows.value.has(row._parentIndex);
    });
  }

  return mergedRows;
};

const sortedData = computed(() => {
  const sortByQuery = props.sort.sortByQuery.value;

  if (!sortByQuery) return props.data;

  const [column, direction = 'asc'] = sortByQuery.split(':') as [string, 'asc' | 'desc'];

  if (!props.meta.sortByClient?.includes(column)) return props.data;

  return props.data
    .map((row) => {
      const item = { ...row } as Record<string, unknown>;

      if (props.meta.expandedKey) {
        const nested = item[props.meta.expandedKey];

        if (Array.isArray(nested)) {
          item[props.meta.expandedKey] = [...nested].sort((a, b) => compareValues(a[column], b[column], direction));
        }
      }

      return item as T;
    })
    .sort((a, b) => compareValues(a[column], b[column], direction));
});

const rows = ref(createRows(sortedData.value));

watch(
  () => [sortedData.value, expandedRows.value],
  () => {
    rows.value = createRows(sortedData.value);
  }
);

// Create cells array based on rows
const cells = computed(() => {
  const keys = Object.keys(rows.value[0] || {});

  return keys.filter((key) => key !== props.meta.expandedKey && !key.startsWith('_'));
});

// Rows virtualization
const { startIndex, endIndex, visibleRows, topPadding, bottomPadding } = useTableVirtualRows(
  rows,
  props.meta.virtualScroll
);
</script>
