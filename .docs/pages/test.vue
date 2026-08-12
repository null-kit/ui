<template>
  <div>
    <div class="mx-auto w-full max-w-(--ui-container) px-4 py-4 sm:px-6 lg:px-8">
      <h1 class="mt-8 mb-4 text-2xl font-bold">Test</h1>

      <p class="mb-20 text-sm text-gray-500">This is a test page to demonstrate the table component.</p>

      <div ref="scrollTrack" :style="{ height: overflowY > 0 ? `calc(100dvh + ${overflowY}px)` : undefined }">
        <div ref="viewport" class="sticky top-0 max-h-dvh overflow-x-auto overflow-y-hidden">
          <table ref="table" class="table-default w-full">
            <thead class="sticky top-0 z-1">
              <tr>
                <th class="sticky left-0">Name</th>
                <th>Company</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Zip</th>
                <th>Country</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Website</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="i in 100" :key="i">
                <td class="sticky left-0">Name {{ i }}</td>
                <td>Company {{ i }}</td>
                <td>Address {{ i }}</td>
                <td>City {{ i }}</td>
                <td>State {{ i }}</td>
                <td>Zip {{ i }}</td>
                <td>Country {{ i }}</td>
                <td>Phone {{ i }}</td>
                <td>Email {{ i }}</td>
                <td>
                  <span>
                    {{ i }} - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
                    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </span>
                </td>

                <td>
                  <button class="btn btn-sm btn-default">Edit</button>
                  <button class="btn btn-sm btn-default">Delete</button>
                </td>
              </tr>
            </tbody>

            <tfoot class="sticky bottom-0">
              <tr>
                <td colspan="100%">Total</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <p class="mt-20 h-80 bg-red-500 text-sm text-gray-500">This is a test page to demonstrate the table component.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollTrack = ref<HTMLDivElement | null>(null);
const viewport = ref<HTMLDivElement | null>(null);
const table = ref<HTMLTableElement | null>(null);
const overflowY = ref(0);
// const theadTop = ref(0);

let frame = 0;

const measure = () => {
  if (!viewport.value || !table.value) return;

  overflowY.value = Math.max(0, table.value.offsetHeight - viewport.value.clientHeight);
};

const sync = () => {
  if (!scrollTrack.value || !viewport.value) return;

  const progress = -scrollTrack.value.getBoundingClientRect().top;

  viewport.value.scrollTop = Math.min(Math.max(progress, 0), overflowY.value);

  // theadTop.value = Math.max(0, progress - overflowY.value);
};

const onScroll = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(sync);
};

onMounted(() => {
  measure();
  sync();

  const observer = new ResizeObserver(() => {
    measure();
    sync();
  });

  if (table.value) observer.observe(table.value);
  if (viewport.value) observer.observe(viewport.value);

  window.addEventListener('scroll', onScroll, { passive: true });

  onUnmounted(() => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('scroll', onScroll);
  });
});
</script>

<style>
[data-slot='root'] {
  display: none;
}
</style>
