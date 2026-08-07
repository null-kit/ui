type Params<T> = {
  rows: Ref<T[]>;
  enabledOrHeight?: boolean | number;
  container?: Readonly<Ref<HTMLElement | null>>;
  body?: Readonly<Ref<HTMLElement | null>>;
};

export const useVirtualRows = <T>({ rows, enabledOrHeight, container, body }: Params<T>) => {
  if (!enabledOrHeight) return { startIndex: 0, endIndex: 0, visibleRows: rows };

  const rowHeight = typeof enabledOrHeight === 'number' ? enabledOrHeight : 34;
  const overscan = 20;
  const threshold = 10;

  const scrollY = ref(0);
  const viewportHeight = ref(0);

  const totalRows = computed(() => rows.value.length);
  const totalHeight = computed(() => totalRows.value * rowHeight);

  const startIndex = ref(0);
  const endIndex = ref(0);

  const getRelativeScroll = () => {
    if (container?.value && body?.value) {
      return Math.max(0, container.value.scrollTop - body.value.offsetTop);
    }

    if (container?.value) return container.value.scrollTop;

    return !body?.value ? 0 : Math.max(0, -body.value.getBoundingClientRect().top);
  };

  const updateRange = () => {
    const total = totalRows.value;
    const first = Math.min(Math.max(Math.floor(scrollY.value / rowHeight), 0), total);
    const visibleCount = Math.max(1, Math.ceil(viewportHeight.value / rowHeight));
    const last = Math.min(first + visibleCount, total);

    const needsUpdate =
      endIndex.value === 0 ||
      first - startIndex.value < threshold ||
      endIndex.value - last < threshold ||
      endIndex.value > total;

    if (!needsUpdate) return;

    startIndex.value = Math.max(first - overscan, 0);
    endIndex.value = Math.min(last + overscan, total);
  };

  const visibleRows = computed(() => rows.value.slice(startIndex.value, endIndex.value));

  const topSize = computed(() => {
    const padding = startIndex.value * rowHeight;

    if (padding >= totalHeight.value) return totalHeight.value;

    return Math.max(Math.round(padding), 0);
  });

  const bottomSize = computed(() => {
    const padding = (totalRows.value - endIndex.value) * rowHeight;

    return Math.max(Math.round(padding), 0);
  });

  const updateViewport = () => {
    viewportHeight.value = container?.value?.clientHeight || window.innerHeight;
  };

  onMounted(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        scrollY.value = getRelativeScroll();
        updateRange();
      });
    };

    const onResize = () => {
      updateViewport();
      onScroll();
    };

    const scrollTarget: EventTarget = container?.value ?? window;

    scrollTarget.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('resize', onResize);

    const resizeObserver = new ResizeObserver(onResize);

    const syncObservers = () => {
      resizeObserver.disconnect();

      if (container?.value) {
        resizeObserver.observe(container.value);

        for (const child of container.value.children) resizeObserver.observe(child);
      } else if (body?.value) {
        resizeObserver.observe(body.value);
      }
    };

    syncObservers();

    const mutationObserver = container?.value ? new MutationObserver(syncObservers) : undefined;

    if (container?.value) mutationObserver?.observe(container.value, { childList: true });

    onResize();

    onUnmounted(() => {
      if (frame) cancelAnimationFrame(frame);

      resizeObserver.disconnect();
      mutationObserver?.disconnect();

      scrollTarget.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onResize);
    });
  });

  watch(totalRows, updateRange);

  return {
    startIndex,
    endIndex,
    visibleRows,
    topSize,
    bottomSize
  };
};
