<template>
  <AppTooltip message="Import CSV file">
    <label class="btn" :class="buttonClass">
      <input type="file" accept=".csv" class="absolute hidden" @change="onImport" />
      <AppIcon :name="icon" />
      {{ label }}
    </label>
  </AppTooltip>
</template>

<script setup lang="ts">
const {
  join = ',',
  icon = 'file-paste',
  buttonClass = 'rounded-none'
} = defineProps<{
  label?: string;
  join?: ',' | '\n';
  icon?: string;
  buttonClass?: string;
}>();

const model = defineModel<string | number | (string | number)[]>();

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
