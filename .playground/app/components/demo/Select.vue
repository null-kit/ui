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

const options = ref([
  { id: 1, name: 'United States' },
  { id: 2, name: 'Canada' },
  { id: 3, name: 'United Kingdom' },
  { id: 4, name: 'Australia' },
  { id: 5, name: 'New Zealand' },
  { id: 6, name: 'South Africa' },
  { id: 7, name: 'India' },
  { id: 8, name: 'China' },
  { id: 9, name: 'Japan' }
]);
</script>
