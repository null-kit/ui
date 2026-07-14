<template>
  <Teleport to="#teleports">
    <div ref="floating" class="app-floating fixed flex flex-col" :class="floatingClass" :style="floatingStyle">
      <div
        v-if="$slots.header"
        class="app-floating-header cursor-grab select-none active:cursor-grabbing"
        @pointerdown="onDragStart"
      >
        <slot name="header" />
      </div>

      <div class="scrollbar scrollbar-thin min-h-0 flex-1 overflow-auto">
        <slot />
      </div>

      <div
        v-for="handle in resizeHandles"
        :key="handle"
        :data-resizer="handle"
        @pointerdown="onResizeStart($event, handle)"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
type ResizeMode = 'none' | 'x' | 'y' | 'both';
type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';
type HorizontalAnchor = { side: 'left' | 'right'; offset: number };
type VerticalAnchor = { side: 'top' | 'bottom'; offset: number };

const {
  resize = 'none',
  bounding = true,
  minWidth = 0,
  minHeight = 0,
  maxWidth,
  maxHeight,
  top: topProp,
  left: leftProp,
  right: rightProp,
  bottom: bottomProp,
  floatingClass
} = defineProps<{
  resize?: ResizeMode;
  bounding?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  floatingClass?: string;
}>();

const left = ref(100);
const top = ref(100);
const width = ref<number>();
const height = ref<number>();
const widthLocked = ref(false);
const heightLocked = ref(false);
const horizontalAnchor = ref<HorizontalAnchor | null>(null);
const verticalAnchor = ref<VerticalAnchor | null>(null);

const floating = useTemplateRef<HTMLDivElement>('floating');

const resizeHandles = computed<ResizeHandle[]>(() => {
  switch (resize) {
    case 'x':
      return ['w', 'e'];
    case 'y':
      return ['n', 's'];
    case 'both':
      return ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
    default:
      return [];
  }
});

const clamp = (value: number, min: number, max?: number) => {
  const upper = max ?? Number.POSITIVE_INFINITY;

  return Math.min(Math.max(value, min), upper);
};

const getViewport = () => ({ width: window.innerWidth, height: window.innerHeight });

const getRect = () => {
  const el = floating.value;

  if (!el) {
    return { left: left.value, top: top.value, width: width.value ?? 0, height: height.value ?? 0 };
  }

  const rect = el.getBoundingClientRect();

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  };
};

const syncAnchorsFromProps = () => {
  if (leftProp !== undefined) {
    horizontalAnchor.value = { side: 'left', offset: leftProp };
  } else if (rightProp !== undefined) {
    horizontalAnchor.value = { side: 'right', offset: rightProp };
  } else {
    horizontalAnchor.value = { side: 'left', offset: 100 };
  }

  if (topProp !== undefined) {
    verticalAnchor.value = { side: 'top', offset: topProp };
  } else if (bottomProp !== undefined) {
    verticalAnchor.value = { side: 'bottom', offset: bottomProp };
  } else {
    verticalAnchor.value = { side: 'top', offset: 100 };
  }
};

const resolvePosition = (boxWidth: number, boxHeight: number) => {
  const viewport = getViewport();
  let nextLeft = left.value;
  let nextTop = top.value;

  if (horizontalAnchor.value) {
    nextLeft =
      horizontalAnchor.value.side === 'left'
        ? horizontalAnchor.value.offset
        : viewport.width - boxWidth - horizontalAnchor.value.offset;
  }

  if (verticalAnchor.value) {
    nextTop =
      verticalAnchor.value.side === 'top'
        ? verticalAnchor.value.offset
        : viewport.height - boxHeight - verticalAnchor.value.offset;
  }

  return { left: nextLeft, top: nextTop };
};

const getMaxWidth = (nextLeft = left.value) => {
  const limits = [maxWidth];

  if (bounding) {
    if (horizontalAnchor.value?.side === 'right') {
      limits.push(getViewport().width - horizontalAnchor.value.offset);
    } else {
      limits.push(getViewport().width - nextLeft);
    }
  }

  const values = limits.filter((value): value is number => value !== undefined);

  return values.length ? Math.min(...values) : undefined;
};

const getMaxHeight = (nextTop = top.value) => {
  const limits = [maxHeight];

  if (bounding) {
    if (verticalAnchor.value?.side === 'bottom') {
      limits.push(getViewport().height - verticalAnchor.value.offset);
    } else {
      limits.push(getViewport().height - nextTop);
    }
  }

  const values = limits.filter((value): value is number => value !== undefined);

  return values.length ? Math.min(...values) : undefined;
};

const applyBounds = (nextLeft: number, nextTop: number, boxWidth: number, boxHeight: number) => {
  const viewport = getViewport();

  let resolvedLeft = nextLeft;
  let resolvedTop = nextTop;
  let nextWidth = clamp(boxWidth, minWidth, getMaxWidth(nextLeft) ?? Number.POSITIVE_INFINITY);
  let nextHeight = clamp(boxHeight, minHeight, getMaxHeight(nextTop) ?? Number.POSITIVE_INFINITY);

  if (!bounding) {
    return { left: resolvedLeft, top: resolvedTop, width: nextWidth, height: nextHeight };
  }

  resolvedLeft = clamp(resolvedLeft, 0, viewport.width - nextWidth);
  resolvedTop = clamp(resolvedTop, 0, viewport.height - nextHeight);

  if (resolvedLeft + nextWidth > viewport.width) {
    nextWidth = viewport.width - resolvedLeft;
  }

  if (resolvedTop + nextHeight > viewport.height) {
    nextHeight = viewport.height - resolvedTop;
  }

  return {
    left: resolvedLeft,
    top: resolvedTop,
    width: Math.max(nextWidth, minWidth),
    height: Math.max(nextHeight, minHeight)
  };
};

const syncBounds = () => {
  const rect = getRect();
  const viewport = getViewport();
  const resolved = resolvePosition(rect.width, rect.height);
  const next = applyBounds(resolved.left, resolved.top, rect.width, rect.height);

  if (horizontalAnchor.value || verticalAnchor.value || widthLocked.value || heightLocked.value) {
    left.value = next.left;
    top.value = next.top;
  } else {
    left.value = clamp(rect.left, 0, Math.max(0, viewport.width - rect.width));
    top.value = clamp(rect.top, 0, Math.max(0, viewport.height - rect.height));
  }

  if (widthLocked.value) width.value = next.width;
  if (heightLocked.value) height.value = next.height;
};

const floatingStyle = computed(() => {
  const maxWidthValue = getMaxWidth();
  const maxHeightValue = getMaxHeight();

  return {
    left: `${left.value}px`,
    top: `${top.value}px`,
    width: widthLocked.value && width.value ? `${width.value}px` : undefined,
    height: heightLocked.value && height.value ? `${height.value}px` : undefined,
    maxWidth: !widthLocked.value && maxWidthValue !== undefined ? `${maxWidthValue}px` : undefined,
    maxHeight: !heightLocked.value && maxHeightValue !== undefined ? `${maxHeightValue}px` : undefined
  };
});

const clearAnchors = () => {
  horizontalAnchor.value = null;
  verticalAnchor.value = null;
};

const onPointerDrag = (
  event: PointerEvent,
  onMove: (current: PointerEvent, start: PointerEvent) => void,
  onEnd?: () => void
) => {
  const target = event.currentTarget as HTMLElement;

  target.setPointerCapture(event.pointerId);

  const start = event;

  const onPointerMove = (moveEvent: PointerEvent) => {
    if (moveEvent.pointerId !== event.pointerId) return;

    onMove(moveEvent, start);
  };

  const onPointerEnd = (endEvent: PointerEvent) => {
    if (endEvent.pointerId !== event.pointerId) return;

    target.releasePointerCapture(event.pointerId);
    target.removeEventListener('pointermove', onPointerMove);
    target.removeEventListener('pointerup', onPointerEnd);
    target.removeEventListener('pointercancel', onPointerEnd);

    onEnd?.();
  };

  target.addEventListener('pointermove', onPointerMove);
  target.addEventListener('pointerup', onPointerEnd);
  target.addEventListener('pointercancel', onPointerEnd);
};

const onDragStart = (event: PointerEvent) => {
  if (event.button !== 0) return;

  event.preventDefault();
  clearAnchors();

  const rect = getRect();

  onPointerDrag(event, (moveEvent, startEvent) => {
    const next = applyBounds(
      rect.left + moveEvent.clientX - startEvent.clientX,
      rect.top + moveEvent.clientY - startEvent.clientY,
      rect.width,
      rect.height
    );

    left.value = next.left;
    top.value = next.top;
  });
};

const onResizeStart = (event: PointerEvent, handle: ResizeHandle) => {
  if (event.button !== 0) return;

  event.preventDefault();
  event.stopPropagation();
  clearAnchors();

  const rect = getRect();

  if (handle.includes('n') || handle.includes('s')) heightLocked.value = true;
  if (handle.includes('e') || handle.includes('w')) widthLocked.value = true;

  width.value = rect.width;
  height.value = rect.height;

  onPointerDrag(event, (moveEvent, startEvent) => {
    const dx = moveEvent.clientX - startEvent.clientX;
    const dy = moveEvent.clientY - startEvent.clientY;

    let nextLeft = rect.left;
    let nextTop = rect.top;
    let nextWidth = rect.width;
    let nextHeight = rect.height;

    if (handle.includes('e')) nextWidth = rect.width + dx;
    if (handle.includes('w')) {
      nextWidth = rect.width - dx;
      nextLeft = rect.left + dx;
    }

    if (handle.includes('s')) nextHeight = rect.height + dy;
    if (handle.includes('n')) {
      nextHeight = rect.height - dy;
      nextTop = rect.top + dy;
    }

    if (resize === 'x') nextHeight = rect.height;
    if (resize === 'y') nextWidth = rect.width;

    const next = applyBounds(nextLeft, nextTop, nextWidth, nextHeight);

    left.value = next.left;
    top.value = next.top;
    width.value = next.width;
    height.value = next.height;
  });
};

let resizeObserver: ResizeObserver | undefined;

syncAnchorsFromProps();

watch(
  () => [topProp, leftProp, rightProp, bottomProp],
  () => {
    syncAnchorsFromProps();
    syncBounds();
  }
);

onMounted(() => {
  nextTick(() => syncBounds());
  window.addEventListener('resize', syncBounds);

  resizeObserver = new ResizeObserver(syncBounds);

  watch(
    floating,
    (el, _, onCleanup) => {
      if (!el || !resizeObserver) return;

      resizeObserver.observe(el);
      onCleanup(() => resizeObserver?.unobserve(el));
    },
    { immediate: true }
  );
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncBounds);
  resizeObserver?.disconnect();
});
</script>
