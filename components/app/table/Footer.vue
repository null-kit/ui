<template>
  <tfoot>
    <tr v-if="hasFooter" :class="table.trClass">
      <th v-if="table.expandedKey" class="w-0" />

      <td
        v-for="cell in table.cells"
        :key="cell"
        :class="[
          table.tdClass,
          { 'left-0 md:sticky': table.stickyLeft?.includes(cell) },
          { 'right-0 -left-px border-l md:sticky': table.stickyRight?.includes(cell) }
        ]"
        :aria-label="`tf-${cell}`"
      >
        <component :is="slots[`tf-${cell}`]" v-if="slots[`tf-${cell}`]" :values="values(cell)" />
      </td>

      <td v-if="slots.actions" :class="['w-0', table.tdClass]" />
    </tr>

    <component v-if="slots.tfoot" :is="slots.tfoot" />
  </tfoot>
</template>

<script setup lang="ts">
const props = defineProps<{
  slots: {
    tfoot?: object;
    actions?: object;
    [key: string]: object | undefined;
  };
}>();

const table = useTable();

const hasFooter = computed(() => Object.keys(props.slots).some((key) => key.startsWith('tf-')));

const values = (cell: string) => table.rows.map((d) => d[cell]);
</script>
