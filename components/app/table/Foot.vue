<template>
  <tfoot>
    <tr :class="trClass">
      <th v-if="expandedKey" class="w-0" />

      <td
        v-for="cell in cells"
        :key="cell"
        :class="[
          tdClass,
          { 'left-0 md:sticky': stickyLeft.includes(cell) },
          { 'right-0 -left-px border-l md:sticky': stickyRight.includes(cell) }
        ]"
      >
        <component :is="slots[`tfoot-${cell}`]" v-if="slots[`tfoot-${cell}`]" :entry="data" />
      </td>

      <td v-if="slots.actions" :class="['w-0', tdClass]" />
    </tr>
  </tfoot>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = withDefaults(
  defineProps<{
    data: T[];
    rows: T[];
    expandedKey?: string;
    stickyLeft?: string[];
    stickyRight?: string[];
    trClass?: string;
    tdClass?: string;
    slots: {
      tfoot?: object;
      actions?: object;
      [key: string]: object | undefined;
    };
  }>(),
  {
    stickyLeft: () => [],
    stickyRight: () => []
  }
);

const cells = computed(() => Object.keys(props.rows[0]!).filter((key) => key !== props.expandedKey));
</script>
