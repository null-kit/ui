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
export const useVirtualRows = <T extends Record<string, unknown>>(rows: Ref<T[]>, hasVirtual?: boolean | number) => {
  if (!hasVirtual) {
    return {
      startIndex: 0,
      endIndex: 0,
      visibleRows: rows
    };
  }

  const rowHeight = typeof hasVirtual === 'number' ? hasVirtual : 40;
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
