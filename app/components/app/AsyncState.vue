<template>
  <section :class="{ 'min-h-31': status === 'pending' && softLoading, relative: softLoading }">
    <div
      v-if="status === 'pending' && !softLoading"
      class="text-center"
      :class="[!$slots.pending && !pendingClass ? contentClass : '', pendingClass]"
    >
      <slot name="pending">
        <AppDotMatrix class="mx-auto mb-3" />

        <h3 class="text-surface text-md/6 font-medium" :data-text-shimmer="pendingTitle" />

        <p v-if="pendingText" class="text-surface/50 text-sm">{{ pendingText }}</p>
      </slot>
    </div>

    <div
      v-else-if="!hasData"
      class="text-center"
      :class="[!$slots.empty && !emptyClass ? contentClass : '', emptyClass]"
    >
      <slot name="empty">
        <AppIcon
          v-if="title || text"
          :name="status === 'error' ? 'alert' : 'search-area'"
          class="mx-auto mb-3 size-6"
        />

        <h3 v-if="title" class="text-surface text-md/6 font-medium">{{ title }}</h3>

        <p v-if="text" class="text-surface/50 text-sm">{{ text }}</p>
      </slot>
    </div>

    <slot v-else-if="hasData" />

    <Transition enter-from-class="opacity-0" enter-to-class="duration-600" leave-to-class="opacity-0 duration-600">
      <div
        v-if="status === 'pending' && softLoading"
        class="bg-darwin/80 absolute inset-0 grid size-full cursor-wait backdrop-grayscale-100"
      >
        <div class="is-loading sticky inset-10 m-auto" />
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app';

const props = withDefaults(
  defineProps<{
    hasData: boolean | undefined;
    status: AsyncDataRequestStatus;
    softLoading?: boolean;

    pendingTitle?: string;
    pendingText?: string;

    emptyTitle?: string;
    emptyText?: string;

    errorTitle?: string;
    errorText?: string;

    idleTitle?: string;
    idleText?: string;

    contentClass?: string;
    pendingClass?: string;
    emptyClass?: string;
  }>(),
  {
    pendingTitle: 'Please Wait',
    emptyTitle: 'No Data Found',
    errorTitle: 'Something Went Wrong',
    contentClass: 'py-8'
  }
);

const title = computed(() => {
  if (props.status === 'success') return props.emptyTitle;
  if (props.status === 'error') return props.errorTitle;
  return props.idleTitle;
});

const text = computed(() => {
  if (props.status === 'success') return props.emptyText;
  if (props.status === 'error') return props.errorText;
  return props.idleText;
});
</script>
