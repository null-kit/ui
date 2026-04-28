<template>
  <fieldset id="charts">
    <legend>Charts</legend>

    <fieldset>
      <legend>Donut</legend>

      <AppChartDonut :data="formData.donutChart" category-key="format" value-key="value" />
    </fieldset>

    <fieldset>
      <legend>Area</legend>

      <AppChartArea :data="formData.areaChart" :categories="['impressions', 'requests', 'margin']" x-key="date" />
    </fieldset>

    <fieldset>
      <legend>Bar</legend>

      <div class="grid gap-4 md:grid-cols-2">
        <AppChartBar
          :data="formData.barChart"
          :categories="['impressions', 'requests', 'margin']"
          x-key="date"
          :x-format="formatDate"
        />

        <AppChartBar
          :data="formData.barChart"
          :categories="['impressions', 'requests', 'margin']"
          x-key="date"
          :x-format="formatDate"
          bar-style="solid"
          y-hide
        />
      </div>
    </fieldset>
  </fieldset>
</template>

<script setup lang="ts">
const formData = reactive({
  areaChart: Array.from({ length: 10 }, (_, index) => ({
    date: `2024-01-${index + 4}`,
    impressions: Math.floor(Math.random() * 300),
    requests: Math.floor(Math.random() * 150),
    margin: Math.floor(Math.random() * 150)
  })),
  donutChart: [
    { format: 'Desktop', value: Math.floor(Math.random() * 300) },
    { format: 'Mobile', value: Math.floor(Math.random() * 150) },
    { format: 'Tablet', value: Math.floor(Math.random() * 200) }
  ],
  barChart: Array.from({ length: 5 }, (_, index) => ({
    date: `2024-01-${index + 4}`,
    impressions: Math.floor(Math.random() * 300),
    requests: Math.floor(Math.random() * 150),
    margin: Math.floor(Math.random() * 150)
  }))
});
</script>
