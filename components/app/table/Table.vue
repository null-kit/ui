<template>
  <div v-if="data && data.length > 0">
    <div v-if="stickyHead" ref="theadVisible" class="sticky z-5 overflow-hidden" :class="stickyOffset">
      <table class="table-default w-full">
        <AppTableHead :slots />
      </table>
    </div>

    <div ref="tableWrapper" class="scrollbar w-full overflow-auto">
      <table class="table-default w-full">
        <AppTableHead :slots :class="{ 'pointer-events-none invisible': stickyHead }" />

        <AppTableBody :data="data" :slots />

        <AppTableFooter :slots />
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const slots = defineSlots<TableSlots<T>>();

const props = withDefaults(
  defineProps<{
    data: T[];

    stickyHead?: boolean;
    stickyOffset?: string;
    stickyLeft?: string[];
    stickyRight?: string[];

    sortBy?: string[];
    sortByClient?: string[];

    trClass?: string;
    thClass?: string;
    tdClass?: string;

    omit?: (keyof T)[];
    pick?: (keyof T)[];
    columnsExtra?: string[];

    dictionaryKey?: string;
    expandedKey?: string;
    virtual?: boolean;
  }>(),
  {
    stickyOffset: 'top-0'
  }
);

useTable(props);
</script>
