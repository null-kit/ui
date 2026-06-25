<template>
  <fieldset id="async-state">
    <legend>Async State</legend>

    <div class="flex gap-3">
      <button class="btn btn-default btn-sm" @click="status = 'pending'">Set to Pending</button>
      <button class="btn btn-default btn-sm" @click="status = 'error'">Set to Error</button>
      <button class="btn btn-default btn-sm" @click="status = 'success'">Set to Success</button>
    </div>

    <AppAsyncState :has-data="false" :status error-text="Please try again later" empty-text="Try another filters" />
  </fieldset>
</template>

<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app';

const status = ref<AsyncDataRequestStatus>('error');
</script>
