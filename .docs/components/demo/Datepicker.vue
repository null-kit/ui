<template>
  <fieldset id="datepicker">
    <legend>Datepicker</legend>

    <div class="flex gap-4">
      <FormDatepicker v-model="formData.singleDate" />

      <FormDatepicker v-model.iso.safe="formData.rangeDates" preset="last-week" range />

      <FormDatepicker v-model.iso="formData.singleDate" />

      <FormTimepicker v-model="formData.time" />
    </div>
  </fieldset>
</template>

<script setup lang="ts">
const today = new Date();

const hours = today.getHours().toString().padStart(2, '0');
const minutes = today.getMinutes().toString().padStart(2, '0');
const seconds = today.getSeconds().toString().padStart(2, '0');

const formData = reactive({
  singleDate: today,
  rangeDates: [],
  time: `${hours}:${minutes}:${seconds}`
});
</script>
