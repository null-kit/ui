<template>
  <label class="btn cursor-pointer rounded-none">
    <input type="file" accept=".csv" class="absolute hidden" @change="onImport" />
    <AppIcon name="file-csv" />
  </label>
</template>

<script setup lang="ts">
const model = defineModel<string>();

const onImport = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      try {
        const csv = String(event.target?.result);

        const rows = csv.split('\n').filter((row) => row.trim() !== '');

        if (rows.length < 2) return useToast().setToast('Import Error!', 'CSV file is empty', 'error');

        model.value = rows.slice(1).join(', ');
      } catch (error) {
        return useToast().setToast('Import Error!', 'Failed to parse CSV', 'error');
      }
    };

    fileReader.readAsText(file);

    target.value = '';
  }
};
</script>
