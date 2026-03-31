<template>
  <label class="btn" :class="buttonClass">
    <input type="file" :accept class="absolute hidden" @change="onImport" />
    <AppIcon :name="icon" />
    {{ label }}

    <AppTooltip v-if="!label" message="Import CSV file" hover-class="absolute inset-0" />
  </label>
</template>

<script setup lang="ts">
type Separator = '\n' | ',' | '.' | ';';

const {
  join = ',',
  split = ',',
  multiple = false,
  icon = 'file-paste',
  buttonClass = 'rounded-none',
  accept = '.csv'
} = defineProps<{
  label?: string;
  join?: Separator;
  split?: Separator;
  multiple?: boolean;
  icon?: string;
  buttonClass?: string;
  accept?: string;
}>();

const model = defineModel<string | number | (string | number)[] | (string | number)[][]>();

const { setToast } = useToast();

const onImport = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      try {
        const csv = String(event.target?.result)
          .replace(/\r/g, '')
          .replace(/[^a-zA-Z0-9\n,.;]/g, '');

        const rows = csv.split('\n').filter((row) => row.trim() !== '');

        if (rows.length < 2) return setToast({ title: 'Import Error!', text: 'CSV file is empty', type: 'error' });

        const slicedRows = rows.slice(1);

        if (multiple) {
          const dataRows = slicedRows.map((row) => row.split(split));
          const columnCount = Math.max(...dataRows.map((cells) => cells.length));

          model.value = Array.from({ length: columnCount }, (_, colIndex) =>
            dataRows.map((cells) => cells[colIndex] ?? '')
          );

          return;
        }

        model.value = slicedRows.join(join);
      } catch (error) {
        return setToast({ title: 'Import Error!', text: `Failed to parse CSV: ${error}`, type: 'error' });
      }
    };

    fileReader.readAsText(file);

    target.value = '';
  }
};
</script>
