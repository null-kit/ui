<template>
  <thead :aria-hidden="isHidden || undefined" :class="{ 'pointer-events-none invisible': isHidden }">
    <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
      <th
        v-for="header in headerGroup.headers"
        :key="header.id"
        :colSpan="header.colSpan"
        :data-cell="header.column.id"
        :aria-sort="getSortDirection(header)"
        :class="['relative', header.column.columnDef.meta?.class, header.column.columnDef.meta?.thClass]"
        :style="getPinStyles(header.column)"
      >
        <template v-if="!header.isPlaceholder">
          <div
            v-if="header.column.getCanSort()"
            class="flex items-center gap-1 after:absolute after:inset-0"
            @click="onSort(header.column)"
          >
            <div
              class="z-1 flex w-full items-center gap-1 text-left duration-200"
              :class="{ 'text-accent': header.column.getIsSorted() }"
            >
              <slot :name="`th-${header.column.id}-left`" />

              <slot :name="`th-${header.column.id}`">
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
              </slot>

              <slot :name="`th-${header.column.id}-right`" />

              <div class="bg-surface/5 ml-auto shrink-0 rounded-full p-0.5">
                <svg
                  class="text-surface/50 h-3 w-1.5"
                  viewBox="0 0 16 30"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="4"
                >
                  <path d="M2 21L8 27L14 21" :class="{ 'text-accent': header.column.getIsSorted() === 'desc' }" />
                  <path d="M2 9L8 3L14 9" :class="{ 'text-accent': header.column.getIsSorted() === 'asc' }" />
                </svg>
              </div>
            </div>

            <DevOnly>
              <!-- <label v-if="header.column.getCanPin()" class="btn btn-sm relative ml-auto">
                  <select
                    name="pin"
                    class="absolute inset-0 z-1 appearance-none opacity-0"
                    @change="header.column.pin($event.target.value)"
                  >
                    <option :selected="!header.column.getIsPinned()" disabled value="false">Pin Column</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option v-if="header.column.getIsPinned()" value="false">Reset</option>
                  </select>

                  <svg class="text-surface size-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 21L8 16"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </label> -->
            </DevOnly>
          </div>

          <template v-else>
            <slot :name="`th-${header.column.id}-left`" />

            <slot :name="`th-${header.column.id}`">
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            </slot>

            <slot :name="`th-${header.column.id}-right`" />
          </template>

          <div
            v-if="header.column.getCanResize()"
            class="bg-surface absolute inset-y-1 right-1 w-1 cursor-col-resize rounded-full duration-200"
            :class="{ 'opacity-5 hover:opacity-50': !header.column.getIsResizing() }"
            @touchstart="header.getResizeHandler()($event)"
            @mousedown="header.getResizeHandler()($event)"
            @dblclick="onResetSize(header.column)"
          />
        </template>
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts" generic="TData, TValue">
import { FlexRender } from '@tanstack/vue-table';
import type { CSSProperties } from 'vue';
import type { Column, Table, Header } from '@tanstack/vue-table';

const emit = defineEmits<{ sort: [TableSortType] }>();

const props = defineProps<{
  table: Table<TData>;
  columnStyles?: (column: Column<TData>) => CSSProperties;
  isHidden?: boolean;
}>();

const getSortDirection = (header: Header<TData, unknown>) => {
  if (!header.column.getCanSort() || header.isPlaceholder) return undefined;

  return header.column.getIsSorted() === 'desc' ? 'descending' : 'ascending';
};

const getPinStyles = (column: Column<TData>): CSSProperties => {
  const isPinned = column.getIsPinned();

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : undefined,
    zIndex: isPinned ? 2 : undefined,
    ...(props.columnStyles ? props.columnStyles(column) : undefined)
  };
};

const onSort = (column: Column<TData>) => {
  column.toggleSorting();

  const dir = column.getIsSorted();

  emit('sort', dir ? `${column.id}:${dir}` : undefined);
};

const onResetSize = (column: Column<TData>) => {
  props.table.getState().columnSizing[column.id] = column.columnDef.size ?? 0;
};
</script>
