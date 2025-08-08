<template>
  <tbody ref="tbody">
    <tr v-if="virtual">
      <td :style="{ padding: 0, border: 0, height: topPadding + 'px' }" />
    </tr>

    <template v-for="(entry, pIndex) in visibleRows" :key="startIndex + pIndex">
      <slot name="default" :entry="entry" :start-index="startIndex + pIndex" />
    </template>

    <tr v-if="virtual">
      <td :style="{ padding: 0, border: 0, height: bottomPadding + 'px' }" />
    </tr>
  </tbody>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = defineProps<{
  rows: T[];
  expandedKey?: string;
  rowHeight?: number;
  buffer?: number;
  childRowHeight?: number;
  virtual?: boolean;
  expandedRows?: Set<unknown>;
}>();

const { startIndex, visibleRows, topPadding, bottomPadding } = useVirtualTable(props);
</script>
