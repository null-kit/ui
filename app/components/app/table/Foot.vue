<template>
  <tfoot v-if="hasFooter">
    <template v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
      <tr v-if="footerGroup.headers.some((h) => !h.isPlaceholder && h.column.columnDef.footer)">
        <td
          v-for="header in footerGroup.headers"
          :key="header.id"
          :data-tf="header.id"
          :class="[header.column.columnDef.meta?.class, header.column.columnDef.meta?.tfClass]"
          :colSpan="header.colSpan"
        >
          <slot v-if="!header.isPlaceholder" :name="`tf-${header.id}`" :values="getValues(header.id)" :get-values>
            <FlexRender :render="header.column.columnDef.footer" :props="header.getContext()" />
          </slot>
        </td>
      </tr>
    </template>
  </tfoot>
</template>

<script setup lang="ts" generic="TData">
import { FlexRender } from '@tanstack/vue-table';
import type { Table } from '@tanstack/vue-table';

const props = defineProps<{ table: Table<TData> }>();

const hasFooter =
  props.table
    .getFooterGroups()
    .flatMap(({ headers }) => headers.map(({ column }) => column.columnDef.footer))
    .filter(Boolean).length > 0;

const getValues = <T extends keyof TData>(column: string) => {
  if (!column) return [];

  return props.table.getPreExpandedRowModel().rows.map((row) => row.original[column as T]);
};
</script>
