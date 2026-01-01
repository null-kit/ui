<template>
  <tfoot v-if="hasFooter">
    <template v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
      <!-- <tr v-if="footerGroup.depth > 0"> -->
      <td v-for="cell in footerGroup.headers" :key="cell.id" :colSpan="cell.colSpan">
        <slot :name="`tf-${cell.id}`" :values="getValues(cell.id)">
          <FlexRender v-if="!cell.isPlaceholder" :render="cell.column.columnDef.footer" :props="cell.getContext()" />
        </slot>
      </td>
      <!-- </tr> -->
    </template>
  </tfoot>
</template>

<script setup lang="ts" generic="TData">
import { FlexRender, type Table } from '@tanstack/vue-table';

const props = defineProps<{ table: Table<TData> }>();

const hasFooter =
  props.table
    .getFooterGroups()
    .flatMap(({ headers }) => headers.map(({ column }) => column.columnDef.footer))
    .filter(Boolean).length > 0;

const getValues = (column: string) => {
  return props.table.getRowModel().rows.map((row) => row.original[column]);
};
</script>
