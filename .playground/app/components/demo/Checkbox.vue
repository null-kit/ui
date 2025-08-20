<template>
  <fieldset id="checkbox">
    <legend>Checkbox (FormCheck)</legend>

    <div class="space-y-2">
      <fieldset>
        <legend>String Array</legend>

        <div class="flex flex-wrap gap-4">
          <FormCheck v-model="formData.fruits" value="apple" label="Apple" />
          <FormCheck v-model="formData.fruits" value="banana" label="Banana" />
          <FormCheck v-model="formData.fruits" value="orange" label="Orange" />
          <FormCheck v-model="formData.fruits" value="grape" label="Grape" />

          <code class="bg-edison ml-auto rounded-md p-2 text-xs">{{ formData.fruits }}</code>
        </div>
      </fieldset>

      <fieldset>
        <legend>Boolean</legend>

        <div class="flex flex-wrap gap-4">
          <FormCheck v-model="formData.status" label="Enable notifications" />
          <FormCheck v-model="formData.darkMode" label="Dark mode" is-switch />

          <code class="bg-edison ml-auto rounded-md p-2 text-xs">{{ formData.status }}</code>
          <code class="bg-edison rounded-md p-2 text-xs">{{ formData.darkMode }}</code>
        </div>
      </fieldset>

      <fieldset>
        <legend>Indeterminate</legend>

        <FormCheck label="Some items are selected" indeterminate />
      </fieldset>

      <fieldset>
        <legend>Radio</legend>

        <div class="flex flex-wrap gap-4">
          <FormCheck v-model="formData.size" type="radio" :value="1" label="Small" />
          <FormCheck v-model="formData.size" type="radio" :value="2" label="Medium" />
          <FormCheck v-model="formData.size" type="radio" :value="3" label="Large" />
          <FormCheck v-model="formData.size" type="radio" :value="-1" label="Unknown" />

          <code class="bg-edison ml-auto rounded-md p-2 text-xs">{{ formData.size }}</code>
        </div>
      </fieldset>

      <fieldset>
        <legend>No model but has value prop</legend>

        <div class="flex flex-wrap gap-4">
          <FormCheck :value="1" label="Prop value = 1" />
          <FormCheck :value="0" label="Prop value = 0" />
        </div>
      </fieldset>

      <fieldset>
        <legend>Custom true-value prop</legend>

        <div class="flex flex-wrap gap-4">
          <FormCheck v-model="formData.type" label="Type" true-value="This is custom true value" />

          <code class="bg-edison ml-auto rounded-md p-2 text-xs">{{ formData.type }}</code>
        </div>
      </fieldset>

      <fieldset>
        <legend>Disabled</legend>

        <div class="flex flex-wrap gap-4">
          <FormCheck :value="true" disabled />
          <FormCheck disabled />

          <FormCheck v-model="formData.disabledSize" type="radio" value="1" disabled />
          <FormCheck v-model="formData.disabledSize" type="radio" value="2" disabled />

          <FormCheck :value="true" disabled is-switch />
          <FormCheck disabled is-switch />
        </div>
      </fieldset>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
const formData = reactive({
  fruits: ['apple', 'grape'],
  status: false,
  darkMode: true,
  size: 2,
  disabledSize: 2,
  type: true
});
</script>
