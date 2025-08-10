<template>
  <tbody ref="tbody">
    <tr v-if="table.virtual">
      <td :style="{ padding: 0, border: 0, height: topPadding + 'px' }" />
    </tr>

    <tr
      v-for="(entry, index) in visibleRows"
      :key="startIndex + index"
      :class="table.trClass"
      :aria-rowindex="startIndex + index"
    >
      <td
        v-if="table.expandedKey"
        :aria-expanded="Boolean(entry.isNested) || table.isExpanded(Number(entry._rowIndex))"
      >
        <button
          v-if="!entry.isNested"
          type="button"
          class="btn btn-sm w-full"
          @click="table.toggleRow(Number(entry._rowIndex))"
        >
          <AppIcon
            name="chevron-right"
            class="duration-200"
            :class="{ 'rotate-90': table.isExpanded(Number(entry._rowIndex)) }"
          />
        </button>
      </td>

      <td
        v-for="cell in table.cells"
        :key="cell"
        :aria-label="`td-${cell}`"
        :class="[
          table.tdClass,
          { 'left-0 z-1 md:sticky': table.stickyLeft?.includes(cell) },
          { 'right-0 -left-px z-1 border-l md:sticky': table.stickyRight?.includes(cell) }
        ]"
      >
        <component
          :key="cell + index"
          :is="slots[cell]"
          v-if="slots[cell]"
          :entry="getEntry(entry, startIndex + index)"
          :value="getEntry(entry, startIndex + index)?.[cell]"
        />

        <template v-else>{{ entry[cell] }}</template>
      </td>

      <td
        v-if="slots.actions"
        :class="[{ 'right-0 -left-px border-l md:sticky': table.stickyRight?.includes('actions') }, table.tdClass]"
      >
        <component :is="slots.actions" :entry="getEntry(entry, startIndex + index)" />
      </td>
    </tr>

    <tr v-if="table.virtual">
      <td :style="{ padding: 0, border: 0, height: bottomPadding + 'px' }" />
    </tr>
  </tbody>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = defineProps<{
  data: T[];
  slots: {
    actions?: object;
    [key: string]: object | undefined;
  };
}>();

const table = useTable();

const { startIndex, visibleRows, topPadding, bottomPadding } = useVirtualRows(toRef(table, 'rows'), table.virtual);

const getEntry = (entry: Record<string, unknown>, index: number) => {
  if (entry.isNested) return entry;

  return props.data[index] || props.data[Number(entry._rowIndex)];
};
</script>
