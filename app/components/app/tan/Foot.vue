<template>
  <tfoot v-if="hasFooter">
    <tr v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
      <th v-for="header in footerGroup.headers" :key="header.id" :colSpan="header.colSpan">
        <FlexRender
          v-if="!header.isPlaceholder"
          :render="header.column.columnDef.footer"
          :props="header.getContext()"
        />
      </th>
    </tr>
  </tfoot>
</template>

<script setup lang="ts" generic="T">
import { FlexRender, type Table } from '@tanstack/vue-table';

const props = defineProps<{ table: Table<T> }>();

const hasFooter =
  props.table
    .getFooterGroups()
    .flatMap(({ headers }) => headers.map(({ column }) => column.columnDef.footer))
    .filter(Boolean).length > 0;
</script>
