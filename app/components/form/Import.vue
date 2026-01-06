<template>
  <label class="btn rounded-none">
    <input type="file" accept=".csv" class="absolute hidden" @change="onImport" />
    <AppIcon :name="icon" />
    {{ label }}
  </label>
</template>

<script setup lang="ts">
const { join = ',', icon = 'file-paste' } = defineProps<{
  label?: string;
  join?: ',' | '\n';
  icon?: string;
}>();

const model = defineModel<string | string[]>();

const { setToast } = useToast();

const onImport = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      try {
        const csv = String(event.target?.result);

        const rows = csv.split('\n').filter((row) => row.trim() !== '');

        if (rows.length < 2) return setToast('Import Error!', 'CSV file is empty', 'error');

        model.value = rows.slice(1).join(join);
      } catch (error) {
        return setToast('Import Error!', `Failed to parse CSV: ${error}`, 'error');
      }
    };

    fileReader.readAsText(file);

    target.value = '';
  }
};
</script>
