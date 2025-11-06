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
const formData = reactive({
  singleDate: new Date(),
  rangeDates: [new Date().setDate(new Date().getDate() - 7), new Date()] as Date[],
  time: new Date().getHours() + ':' + new Date().getMinutes().toString().padStart(2, '0').padEnd(2, '0')
});
</script>
