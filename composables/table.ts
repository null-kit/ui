const TABLE_KEY = Symbol('table');

export const useTable = <T extends Record<string, unknown>>(props?: TableProps<T>) => {
  const injected = inject(TABLE_KEY, null);

  if (!props && injected) return injected;

  if (!props) throw new Error('Please provide table props');

  const route = useRoute();

  // Merge rows with extra columns and nested rows
  const rows = computed({
    get() {
      const pick = props.pick || [];
      const omit = props.omit || [];
      const columnsExtra = props.columnsExtra || [];

      const mergedRows = props.data.map((row) => {
        if (pick.length > 0) {
          return Object.fromEntries(Object.entries(row).filter(([key]) => pick.includes(key)));
        }

        if (omit.length > 0) {
          return Object.fromEntries(Object.entries(row).filter(([key]) => !omit.includes(key)));
        }

        if (columnsExtra.length > 0) {
          return Object.assign(row, Object.fromEntries(columnsExtra.map((key) => [key, null])));
        }

        return row;
      });

      if (props.expandedKey) {
        const unpackedRows: Record<string, unknown>[] = [];

        for (const [rowIndex, row] of mergedRows.entries()) {
          unpackedRows.push({ ...row, _rowIndex: rowIndex });

          const nestedArray = row[props.expandedKey];

          if (Array.isArray(nestedArray)) {
            for (const nested of nestedArray) {
              unpackedRows.push({
                ...nested,
                isNested: true,
                _parentIndex: rowIndex
              });
            }
          }
        }

        return unpackedRows.filter((row) => {
          if (!row.isNested) return true;

          return expandedRows.value.has(row._parentIndex);
        });
      }

      return mergedRows;
    },
    set: (newValue) => newValue
  });

  // Create cells array based on rows
  const cells = computed(() => {
    const keys = Object.keys(rows.value[0] || {});

    return keys.filter((key) => key !== props.expandedKey && !key.startsWith('_'));
  });

  // Expanded rows
  const expandedRows = ref(new Set());

  const isExpanded = (index: number) => expandedRows.value.has(index);

  const toggleRow = (index: number) => {
    const row = new Set(expandedRows.value);

    if (row.has(index)) {
      row.delete(index);
    } else {
      row.add(index);
    }

    expandedRows.value = row;
  };

  // Sorting Functions
  const canSortBy = (column: string) => {
    const sortBy = props.sortBy || [];
    const sortByClient = props.sortByClient || [];

    return [...sortBy, ...sortByClient].includes(column);
  };

  const onSortBy = (column: string) => {
    if (!canSortBy(column)) return;

    const direction = String(route.query.sortBy).endsWith(':desc') ? 'asc' : 'desc';

    navigateTo({ query: { ...route.query, sortBy: `${column}:${direction}` } });

    // Client sorting if sort-by-client prop is provided
    if (!props.sortByClient?.includes(column)) return;

    expandedRows.value = new Set([...expandedRows.value]); // Trigger re-render

    rows.value = props.data.sort((a, b) => compareValues(a[column], b[column], direction));

    if (props.expandedKey && rows.value.length > 0) {
      for (const item of rows.value) {
        const nested = item[props.expandedKey];

        if (!Array.isArray(nested)) continue;

        nested.sort((a, b) => compareValues(a[column], b[column], direction));
      }
    }
  };

  const tableData = reactive({
    ...props,
    rows,
    cells,
    onSortBy,
    canSortBy,
    expandedRows,
    toggleRow,
    isExpanded
  });

  provide(TABLE_KEY, tableData);

  if (props.stickyHead) useStickyHead();

  return tableData;
};

// Sticky Head Composable
export const useStickyHead = () => {
  const tableWrapper = useTemplateRef<HTMLElement>('tableWrapper');
  const theadVisible = useTemplateRef<HTMLElement>('theadVisible');

  let onScroll: () => void;
  let resizeObserver: ResizeObserver | undefined;

  onMounted(() => {
    if (!tableWrapper.value || !theadVisible.value) return;

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
};

// Virtualization Composable
export const useVirtualRows = <T extends Record<string, unknown>>(rows: Ref<T[]>, hasVirtual?: boolean) => {
  if (!hasVirtual) {
    return {
      startIndex: 0,
      endIndex: 0,
      visibleRows: rows
    };
  }

  const rowHeight = 40;
  const buffer = 5;

  const tableRef = useTemplateRef<HTMLElement>('tbody');
  const scrollY = ref(0);
  const viewportHeight = ref(window.innerHeight);
  const tableTop = ref(0);

  const totalRows = computed(() => rows.value.length);
  const totalHeight = computed(() => totalRows.value * rowHeight);

  const startIndex = computed(() => {
    const relativeScroll = scrollY.value - tableTop.value;

    return Math.max(Math.floor(relativeScroll / rowHeight) - buffer, 0);
  });

  const endIndex = computed(() => {
    const visibleCount = Math.ceil(viewportHeight.value / rowHeight);

    return Math.min(startIndex.value + visibleCount + buffer * 2, totalRows.value);
  });

  const visibleRows = computed(() => rows.value.slice(startIndex.value, endIndex.value));

  const topPadding = computed(() => {
    const padding = startIndex.value * rowHeight;

    if (padding >= totalHeight.value) return totalHeight.value;

    return Math.max(padding, 0);
  });

  const bottomPadding = computed(() => {
    const padding = (totalRows.value - endIndex.value) * rowHeight;

    return Math.max(padding, 0);
  });

  function onScroll() {
    scrollY.value = window.scrollY;
  }

  function onResize() {
    viewportHeight.value = window.innerHeight;
    updateTableTop();
  }

  // TODO: Check if this function is needed
  function updateTableTop() {
    if (tableRef.value) {
      tableTop.value = tableRef.value.getBoundingClientRect().top + window.scrollY;
    }
  }

  onMounted(() => {
    updateTableTop();
    onScroll();

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  });

  return {
    startIndex,
    endIndex,
    visibleRows,
    topPadding,
    bottomPadding
  };
};
