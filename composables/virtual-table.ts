interface Props<T extends Record<string, unknown>> {
  virtual?: boolean;
  rows: T[];
  expandedKey?: string;
  expandedRows?: Set<unknown>;
  rowHeight?: number;
  childRowHeight?: number;
  buffer?: number;
}

export const useVirtualTable = <T extends Record<string, unknown>>(props: Props<T>) => {
  if (!props.virtual) {
    return {
      startIndex: 0,
      endIndex: 0,
      visibleRows: props.rows
    };
  }

  console.log('useVirtualTable', props);

  const rowHeight = props.rowHeight || 40;
  const childRowHeight = props.childRowHeight || rowHeight;
  const buffer = props.buffer || 5;

  const tbody = useTemplateRef<HTMLElement>('tbody');
  const scrollY = ref(0);
  const viewportHeight = ref(window.innerHeight);
  const tableTop = ref(0);

  const expandedCounts = computed(() => {
    const list = new Array(props.rows.length).fill(0);

    if (!props.expandedKey) return list;

    for (let i = 0; i < props.rows.length; i++) {
      if (props.expandedRows && !props.expandedRows.has(i)) continue;

      const children = props.rows[i]?.[props.expandedKey];

      list[i] = Array.isArray(children) ? children.length : 0;
    }

    return list;
  });

  const prefixHeights = computed(() => {
    const pref = new Array(props.rows.length + 1).fill(0);
    const extras = expandedCounts.value;

    for (let i = 0; i < props.rows.length; i++) {
      pref[i + 1] = pref[i] + rowHeight + (extras[i] || 0) * childRowHeight;
    }

    return pref;
  });

  const totalHeight = computed(() => {
    return prefixHeights.value.length ? prefixHeights.value[prefixHeights.value.length - 1] : 0;
  });

  function lowerBound(arr: number[], target: number) {
    let l = 0;
    let r = arr.length - 1;

    while (l < r) {
      const m = (l + r) >>> 1;

      if (arr[m]! < target) {
        l = m + 1;
      } else {
        r = m;
      }
    }

    return l;
  }

  const startIndex = computed(() => {
    const relativeScroll = Math.max(scrollY.value - tableTop.value, 0);
    const index = Math.max(0, Math.min(props.rows.length, lowerBound(prefixHeights.value, relativeScroll)));

    return Math.max(index - buffer, 0);
  });

  const endIndex = computed(() => {
    const bottom = Math.max(scrollY.value - tableTop.value, 0) + viewportHeight.value;
    const index = Math.max(0, Math.min(props.rows.length, lowerBound(prefixHeights.value, bottom)));

    return Math.min(index + buffer, props.rows.length);
  });

  const visibleRows = computed(() => props.rows.slice(startIndex.value, endIndex.value));

  const topPadding = computed(() => Math.min(prefixHeights.value[startIndex.value], totalHeight.value));

  const bottomPadding = computed(() => Math.max(totalHeight.value - prefixHeights.value[endIndex.value], 0));

  function updateTableTop() {
    tableTop.value = tbody.value ? tbody.value.getBoundingClientRect().top + window.scrollY : 0;
  }

  function onScroll() {
    scrollY.value = window.scrollY;
  }

  function onResize() {
    viewportHeight.value = window.innerHeight;
    updateTableTop();
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
