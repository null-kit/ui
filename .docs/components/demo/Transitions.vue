<template>
  <fieldset id="charts">
    <legend>Transitions</legend>

    <fieldset>
      <legend>Number Flow</legend>

      <div class="flex items-center gap-5">
        <button class="btn btn-default btn-sm" @click="shuffleNumber">Shuffle</button>

        <AppNumberFlow :value="formatCurrency(formData.number)" />
      </div>
    </fieldset>

    <fieldset>
      <legend>Appear</legend>

      <div class="flex items-center gap-5">
        <button class="btn btn-default btn-sm" @click="formData.isActive = !formData.isActive">Appear</button>

        <AppAppear>
          <div v-if="formData.isActive">Smooth</div>
        </AppAppear>

        <AppAppear v-if="formData.isActive">
          <div>Instant</div>
        </AppAppear>
      </div>
    </fieldset>
  </fieldset>
</template>

<script setup lang="ts">
const formData = reactive({
  number: 123456,
  isActive: false
});

const shuffleNumber = () => {
  formData.number = Math.floor(Math.random() * 1000000);
};
</script>
