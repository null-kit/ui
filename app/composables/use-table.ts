// Sticky Head Composable
export const useTableStickyHead = (tableWrapper: Readonly<Ref<HTMLElement | null>>) => {
  const theadVisible = useTemplateRef<HTMLElement>('theadVisible');

  onMounted(() => {
    if (!tableWrapper.value || !theadVisible.value) return;

    const resizeObserver = new ResizeObserver(() => {
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

    resizeObserver.observe(tableWrapper.value);

    const hiddenList = tableWrapper.value.querySelectorAll('th');

    for (const cell of hiddenList) resizeObserver.observe(cell);

    const onScroll = () => (theadVisible.value!.scrollLeft = tableWrapper.value!.scrollLeft);

    tableWrapper.value!.addEventListener('scroll', onScroll);

    onUnmounted(() => {
      tableWrapper.value?.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
    });
  });
};

// Virtualization Composable
export const useTableVirtualRows = <T>(rows: Ref<T[]>, hasVirtual?: boolean | number) => {
  if (!hasVirtual) return { startIndex: 0, endIndex: 0, visibleRows: rows };

  const rowHeight = typeof hasVirtual === 'number' ? hasVirtual : 40;
  const buffer = 5;

  const tableBody = useTemplateRef<HTMLElement>('tbody');
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

  const onScroll = () => (scrollY.value = window.scrollY);

  const onResize = () => {
    viewportHeight.value = window.innerHeight;
    updateTableTop();
  };

  // TODO: Check if this function is needed
  const updateTableTop = () => {
    if (tableBody.value) {
      tableTop.value = tableBody.value.getBoundingClientRect().top + window.scrollY;
    }
  };

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

export const useTableSort = (props: {
  name?: string;
  sortByInitial?: string;
  sortBy?: string[];
  sortByClient?: string[];
}) => {
  const sortByList = computed(() => [...(props.sortBy || []), ...(props.sortByClient || [])]);

  if (!sortByList.value.length)
    return {
      sortByQuery: ref(''),
      canSortBy: () => false,
      isSorted: () => false,
      onSort: () => {}
    };

  const route = useRoute();
  const sortByKey = computed(() => (props.name ? `sortBy:${props.name}` : 'sortBy'));
  const sortByQuery = computed<string>(() => (route.query[sortByKey.value] as string) || props.sortByInitial || '');

  const canSortBy = (column: string) => sortByList.value.includes(column);

  const isSorted = (cell: string, direction: string) => sortByQuery.value.startsWith(`${cell}:${direction}`);

  const onSort = (column: string) => {
    if (!canSortBy(column)) return;

    const query = { ...route.query };

    if (sortByQuery.value === `${column}:asc`) {
      query[sortByKey.value] = `${column}:desc`;
    } else if (sortByQuery.value === `${column}:desc`) {
      query[sortByKey.value] = route.query[sortByKey.value] ? (undefined as unknown as null) : `${column}:asc`;
    } else {
      query[sortByKey.value] = `${column}:asc`;
    }

    navigateTo({ query });
  };

  return {
    sortByQuery,
    canSortBy,
    isSorted,
    onSort
  };
};

export const useTableStickyScrollbar = (tableWrapper: Readonly<Ref<HTMLElement | null>>) => {
  const tableScrollbarThumb = useTemplateRef<HTMLElement>('tableScrollbarThumb');
  const tableScrollbar = useTemplateRef<HTMLElement>('tableScrollbar');

  onMounted(() => {
    if (!tableWrapper.value || !tableScrollbar.value) return;

    const table = tableWrapper.value.querySelector('table');

    if (!table) return;

    const resizeObserver = new ResizeObserver(() => {
      tableScrollbarThumb.value!.style.width = `${table.scrollWidth}px`;
    });

    resizeObserver.observe(table);

    const onScrollTable = () => (tableWrapper.value!.scrollLeft = tableScrollbar.value!.scrollLeft);
    const onScrollThumb = () => (tableScrollbar.value!.scrollLeft = tableWrapper.value!.scrollLeft);

    tableScrollbar.value.addEventListener('scroll', onScrollTable);
    tableWrapper.value.addEventListener('scroll', onScrollThumb);

    onUnmounted(() => {
      resizeObserver.disconnect();
      tableScrollbar.value?.removeEventListener('scroll', onScrollTable);
      tableWrapper.value?.removeEventListener('scroll', onScrollThumb);
    });
  });
};
