<template>
  <div
    ref="container"
    class="scrollbar max-h-[inherit] flex-1 scrollbar-thin overflow-auto [overflow-anchor:none]"
    :style="maxHeight ? { maxHeight } : undefined"
  >
    <slot name="before" />

    <div ref="body" class="select-options">
      <div v-if="virtualScroll" aria-hidden :style="{ height: topSize + 'px' }" />

      <template v-for="(row, index) in visibleRows" :key="startIndex + index">
        <div v-if="row.type === 'group'" class="select-group-label">{{ row.label }}</div>

        <slot
          v-else
          name="option"
          :value="row.value"
          :is-selected="isSelected(row.value)"
          :on-select="() => emit('select', row.value)"
          :on-toggle="() => emit('select', row.value)"
        >
          <button
            type="button"
            class="btn min-h-0 shrink-0 justify-start"
            :style="typeof virtualScroll === 'number' ? { height: virtualScroll + 'px' } : undefined"
            :aria-current="row.value === activeOption || undefined"
            :class="{
              'bg-current/5 font-medium': isSelected(row.value),
              'bg-current/10': row.value === activeOption
            }"
            @mousedown.prevent="emit('select', row.value)"
          >
            <svg
              v-if="variant === 'select'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              class="size-4 shrink-0"
            >
              <path
                fill="none"
                stroke-width="3"
                d="m5 18 7 7L27 9"
                class="duration-300"
                stroke="currentColor"
                stroke-dasharray="32"
                :style="{ strokeDashoffset: isSelected(row.value) ? 0 : 32 }"
              />
            </svg>

            <slot name="button" :value="row.value" :is-selected="isSelected(row.value)">
              <span class="max-w-sm truncate">{{ getKeyName(row.value) }}</span>
            </slot>
          </button>
        </slot>
      </template>

      <div v-if="virtualScroll" aria-hidden :style="{ height: bottomSize + 'px' }" />
    </div>

    <slot name="after" />
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown> | string | number">
type Row<T> = { type: 'group'; label: string } | { type: 'option'; value: T };

const emit = defineEmits<{ select: [option: T] }>();

const props = withDefaults(
  defineProps<{
    groups: OptionGroup<T>[];
    getKeyName: (option: T) => unknown;
    isSelected: (option: T) => boolean;
    isHidden?: (option: T) => boolean;
    variant?: 'select' | 'pick';
    order?: boolean;
    maxHeight?: string;
    virtualScroll?: boolean | number;
  }>(),
  {
    variant: 'select'
  }
);

const flatOptions = computed(() => props.groups.flatMap((group) => group.list).filter((opt) => !props.isHidden?.(opt)));

const orderedOptions = computed(() => {
  if (!props.order) return flatOptions.value;

  return [
    ...flatOptions.value.filter((opt) => props.isSelected(opt)),
    ...flatOptions.value.filter((opt) => !props.isSelected(opt))
  ];
});

const rows = computed<Row<T>[]>(() => {
  if (props.order) {
    return orderedOptions.value.map((value) => ({ type: 'option' as const, value }));
  }

  const rows: Row<T>[] = [];

  for (const optionGroup of props.groups) {
    const list = optionGroup.list.filter((opt) => !props.isHidden?.(opt));

    if (!list.length) continue;

    if (optionGroup.group) rows.push({ type: 'group', label: optionGroup.group });

    for (const value of list) rows.push({ type: 'option', value });
  }

  return rows;
});

const container = useTemplateRef<HTMLElement>('container');
const body = useTemplateRef<HTMLElement>('body');

const { startIndex, visibleRows, topSize, bottomSize } = useVirtualRows({
  rows,
  enabledOrHeight: props.virtualScroll,
  container,
  body
});

const activeIndex = ref(-1);
const activeOption = computed(() => orderedOptions.value[activeIndex.value]);

const onKeyDown = async (event: KeyboardEvent) => {
  if (['ArrowUp', 'ArrowDown', 'Enter', ' '].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === 'ArrowUp') {
    if (activeIndex.value > 0) activeIndex.value--;
  }

  if (event.key === 'ArrowDown') {
    if (activeIndex.value < orderedOptions.value.length - 1) activeIndex.value++;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    if (activeOption.value) emit('select', activeOption.value);
  }

  await nextTick();
  container.value?.querySelector('[aria-current]')?.scrollIntoView({ block: 'center' });
};

onMounted(() => window.addEventListener('keydown', onKeyDown));
onUnmounted(() => window.removeEventListener('keydown', onKeyDown));
</script>
