<template>
  <fieldset id="datepicker">
    <legend>Datepicker</legend>

    <div class="flex gap-4">
      <FormDatepicker v-model="formData.singleDate" />

      <FormDatepicker v-model="formData.rangeDates" range />

      <FormDatepicker v-model="formData.singleDate" date-mode="short" />

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
  rangeDates: [today.setDate(today.getDate() - 7), today] as Date[],
  time: `${hours}:${minutes}:${seconds}`
});
</script>
