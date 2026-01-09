<template>
  <tfoot v-if="hasFooter">
    <template v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
      <tr v-if="footerGroup.headers.some((h) => !h.isPlaceholder && h.column.columnDef.footer)">
        <td
          v-for="header in footerGroup.headers"
          :key="header.id"
          :data-tf="header.id"
          :class="[
            getMetaClass(header.column.columnDef.meta?.class, header),
            getMetaClass(header.column.columnDef.meta?.tfClass, header)
          ]"
          :colSpan="header.colSpan"
        >
          <slot v-if="!header.isPlaceholder" :name="`tf-${header.id}`" :values="getValues(header.id)">
            <FlexRender :render="header.column.columnDef.footer" :props="header.getContext()" />
          </slot>
        </td>
      </tr>
    </template>
  </tfoot>
</template>

<script setup lang="ts" generic="TData">
import { FlexRender, type Table } from '@tanstack/vue-table';
import { getMetaClass } from './utils';

const props = defineProps<{ table: Table<TData> }>();

const hasFooter =
  props.table
    .getFooterGroups()
    .flatMap(({ headers }) => headers.map(({ column }) => column.columnDef.footer))
    .filter(Boolean).length > 0;

const getValues = (column: string) => {
  return props.table.getCoreRowModel().rows.map((row) => row.original[column as keyof TData]);
};
</script>
