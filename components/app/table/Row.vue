<template>
  <tr :class="trClass">
    <td v-if="expandedKey" class="!px-2">
      <button v-if="!isNested" type="button" class="btn btn-sm" @click="$emit('toggle', (isExpanded = !isExpanded))">
        <AppIcon name="chevron-right" class="duration-200" :class="{ 'rotate-90': isExpanded }" />
      </button>
    </td>

    <td
      v-for="cell in cells"
      :key="cell"
      :aria-label="`td-${cell}`"
      :class="[
        tdClass,
        { 'left-0 z-1 md:sticky': stickyLeft.includes(cell) },
        { 'right-0 -left-px z-1 border-l md:sticky': stickyRight.includes(cell) }
      ]"
    >
      <component :is="slots[cell]" v-if="slots[cell]" :entry="data" :value="entry[cell]" />

      <template v-else>{{ entry[cell] }}</template>
    </td>

    <td v-if="slots.actions" :class="tdClass">
      <component :is="slots.actions" :entry="data" />
    </td>
  </tr>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = withDefaults(
  defineProps<{
    data?: T;
    entry: T;
    expandedKey?: string;
    columnsExtra?: string[];
    omit?: (keyof T)[];
    pick?: (keyof T)[];
    trClass?: string;
    tdClass?: string;
    stickyLeft?: string[];
    stickyRight?: string[];
    isNested?: boolean;
    slots: {
      actions?: object;
      [key: string]: object | undefined;
    };
  }>(),
  {
    pick: () => [],
    omit: () => [],
    stickyLeft: () => [],
    stickyRight: () => []
  }
);

defineEmits<{ toggle: [boolean] }>();

const isExpanded = ref(false);

const cells = computed(() => {
  let merged: Record<string, unknown> = { ...props.data };

  if (props.pick.length > 0) {
    merged = Object.fromEntries(Object.entries(merged).filter(([key]) => props.pick.includes(key)));
  }

  if (props.omit.length > 0) {
    merged = Object.fromEntries(Object.entries(merged).filter(([key]) => !props.omit.includes(key)));
  }

  if (props.columnsExtra) {
    merged = { ...merged, ...Object.fromEntries(props.columnsExtra.map((key) => [key, null])) };
  }

  return Object.keys(merged).filter((key) => key !== props.expandedKey);
});
</script>
