<template>
  <fieldset id="control">
    <legend>Form Control</legend>

    <div class="grid grid-cols-3 gap-4">
      <FormControl label="Text Input" name="name" placeholder="Enter your name" required />

      <FormControl type="number" label="Number Input" name="age" placeholder="Enter your age" step="1" />

      <FormControl
        v-model="formData.country"
        type="select"
        label="Select"
        name="country"
        placeholder="Select a country"
      >
        <option value="United States">United States</option>
        <option value="Canada">Canada</option>
        <option value="United Kingdom">United Kingdom</option>
      </FormControl>

      <FormControl type="email" label="Email with Left Slot" name="email" placeholder="Enter your email">
        <template #left>
          <div class="my-auto px-3">Left Slot</div>
        </template>
      </FormControl>

      <FormControl
        type="password"
        label="Password with Slot and Custom Help"
        name="password"
        placeholder="Enter your password"
      >
        <template #right>
          <svg class="mx-3 my-auto size-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm9-.45S19.75 20 12.02 20C4.84 20 0 11.55 0 11.55S4.45 4 12.02 4C19.7 4 24 11.55 24 11.55zM17 12a5 5 0 1 0-10.01.01A5 5 0 0 0 17 12z"
            />
          </svg>
        </template>

        <template #help>
          <div class="text-accent">
            <p>Password must be at least 8 characters long</p>
            <p>Password must contain at least one special character</p>
          </div>
        </template>
      </FormControl>

      <FormControl
        type="textarea"
        label="Textarea"
        name="description"
        placeholder="Enter description..."
        help="Maximum 500 characters"
      />

      <FormControl label="Disabled Text Input" name="disabled" placeholder="Enter your username" disabled />

      <FormRange v-model="formData.range" label="Range" name="range" :min="0" :max="100" />

      <FormControl name="disabled" placeholder="Required but no label" class="mt-auto" required />
    </div>

    <div class="mt-4 flex gap-4">
      <button
        type="button"
        class="btn btn-default"
        @click="setErrors({ username: 'Username is required', email: 'Please enter a valid email address' })"
      >
        Validate
      </button>

      <button type="button" class="btn btn-default" @click="clearErrors">Clear Errors</button>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
const { setErrors, clearErrors } = useValidate();

const formData = reactive({
  country: '',
  range: 10
});
</script>
