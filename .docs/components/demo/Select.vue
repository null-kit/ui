<template>
  <fieldset id="select">
    <legend>Form Select</legend>

    <div class="space-y-2">
      <fieldset>
        <legend>Signle (:key-name :key-value)</legend>

        <div class="flex flex-wrap items-center gap-4">
          <FormSelect
            v-model="formData.country"
            key-name="name"
            key-value="id"
            placeholder="Select a country"
            :options="options"
          />

          <FormSelect
            v-model="formData.country"
            key-name="name"
            key-value="id"
            placeholder="Select a country"
            :options="options"
          >
            <template #left>
              <span class="mx-2 my-auto">Left Slot</span>
            </template>

            <template #right>
              <span class="mx-2 my-auto">Right Slot</span>
            </template>
          </FormSelect>

          <code class="bg-edison ml-auto rounded-md p-2 text-xs">{{ formData.country }}</code>
        </div>
      </fieldset>

      <fieldset>
        <legend>Multiple (:search :order :mutilple :key-name :key-value)</legend>

        <div class="flex flex-wrap items-center gap-4">
          <FormSelect
            v-model="formData.countries"
            placeholder="Select countries"
            :options="options"
            :virtual-scroll="34"
            key-name="name"
            key-value="id"
            multiple
            search
            order
          />

          <code class="bg-edison ml-auto rounded-md p-2 text-xs">{{ formData.countries }}</code>
        </div>
      </fieldset>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
const formData = reactive({
  country: 1,
  countries: [2, 3]
});

const options = ref(Array.from({ length: 300 }, (_, i) => ({ id: i + 1, name: `Option ${i + 1}` })));
</script>
