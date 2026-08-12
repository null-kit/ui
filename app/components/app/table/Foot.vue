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
            <FlexRender :footer="header" />
          </slot>
        </td>
      </tr>
    </template>
  </tfoot>
</template>

<script setup lang="ts" generic="TData extends RowData">
import { FlexRender } from '@tanstack/vue-table';

const props = defineProps<{ table: TableInstance<TData> }>();
const slots = useSlots();

const hasSlots = Object.keys(slots).some((key) => key.startsWith('tf-'));

const hasGroups =
  props.table
    .getFooterGroups()
    .flatMap(({ headers }) => headers.map(({ column }) => column.columnDef.footer))
    .filter(Boolean).length > 0;

const hasFooter = hasSlots || hasGroups;

const rowValues = computed(() => ({
  rows: props.table.getPreExpandedRowModel().rows,
  cache: new Map<string, unknown[]>()
}));

const getValues = <T extends keyof TData>(column: string) => {
  if (!column) return [];

  const { rows, cache } = rowValues.value;
  let values = cache.get(column) as TData[T][] | undefined;

  if (!values) {
    values = rows.map((row) => row.original[column as T]);
    cache.set(column, values);
  }

  return values;
};
</script>
