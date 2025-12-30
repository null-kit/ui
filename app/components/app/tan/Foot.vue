<template>
  <tfoot v-if="hasFooter">
    <template v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
      <tr v-if="footerGroup.depth > 0">
        <td v-for="cell in footerGroup.headers" :key="cell.id" :colSpan="cell.colSpan">
          <FlexRender v-if="!cell.isPlaceholder" :render="cell.column.columnDef.footer" :props="cell.getContext()" />
        </td>
      </tr>
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
</script>
