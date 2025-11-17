<template>
  <div ref="tbody">
    <slot
      v-bind="{
        data,

        rows,
        cells,

        startIndex,
        endIndex,
        topPadding,
        bottomPadding,
        visibleRows,

        expandedRows,
        isExpanded,
        toggleRow,

        onSortByClient
      }"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = withDefaults(
  defineProps<{
    data: T[];

    meta: {
      dictionaryKey?: string;
      expandedKey?: string;
      virtualScroll?: boolean;
    };

    omit?: (keyof T)[];
    pick?: (keyof T)[];
    columnsExtra?: string[];
  }>(),
  {
    pick: () => [],
    omit: () => [],
    columnsExtra: () => []
  }
);

const route = useRoute();

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

    if (props.pick.length > 0) {
      entries = Object.fromEntries(Object.entries(row).filter(([key]) => props.pick.includes(key)));
    }

    if (props.omit.length > 0) {
      entries = Object.fromEntries(Object.entries(row).filter(([key]) => !props.omit.includes(key)));
    }

    if (props.columnsExtra.length > 0) {
      Object.assign(entries, Object.fromEntries(props.columnsExtra.map((key) => [key, null])));
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

const rows = ref(createRows(props.data));

watch(
  () => [props.data, expandedRows.value, route.query.sortBy],
  () => {
    rows.value = createRows(props.data);
  }
);

// Create cells array based on rows
const cells = computed(() => {
  const keys = Object.keys(rows.value[0] || {});

  return keys.filter((key) => key !== props.meta.expandedKey && !key.startsWith('_'));
});

// Rows virtualization
const { startIndex, endIndex, visibleRows, topPadding, bottomPadding } = useVirtualRows(rows, props.meta.virtualScroll);

// Client side sorting
const onSortByClient = () => {
  const [column, direction] = String(route.query.sortBy).split(':') as [string, 'asc' | 'desc'];

  rows.value = props.data.sort((a, b) => compareValues(a[column], b[column], direction));

  if (props.meta.expandedKey && rows.value.length > 0) {
    for (const item of rows.value) {
      const nested = item[props.meta.expandedKey];

      if (!Array.isArray(nested)) continue;

      nested.sort((a, b) => compareValues(a[column], b[column], direction));
    }
  }
};
</script>
