<template>
  <div>
    <div class="mx-auto w-full max-w-(--ui-container) px-4 py-4 sm:px-6 lg:px-8">
      <h1 class="mt-8 mb-4 text-2xl font-bold">Test</h1>

      <p class="mb-20 text-sm text-gray-500">This is a test page to demonstrate the table component.</p>

      <AppTable :data :columns />

      <hr class="my-20" />

      <AppTable :data :columns sticky-head sticky-scrollbar :virtual-scroll="37" />

      <hr class="my-20" />

      <AppTable :data :columns nested-key="children" sticky-head :virtual-scroll="37" />

      <p class="mt-20 h-80 bg-red-500 text-sm text-gray-500">This is a test page to demonstrate the table component.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const data = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  description: `Description ${i}`,
  longText: `Long Text ${i} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  children: Array.from({ length: 10 }, (_, j) => ({
    id: i * 10 + j,
    name: `Child ${i} ${j}`,
    description: `Child Description ${i} ${j}`,
    longText: `Child Long Text ${i} ${j} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
  }))
}));

const columns = [
  {
    header: 'Name',
    accessorKey: 'name',
    meta: {
      class: 'sticky left-0 z-1'
    }
  },
  {
    header: 'Description',
    accessorKey: 'description'
  },
  {
    header: 'Long Text',
    accessorKey: 'longText'
  }
];
</script>

<style>
[data-slot='root'] {
  display: none;
}
</style>
