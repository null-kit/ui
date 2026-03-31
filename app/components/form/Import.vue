<template>
  <label class="btn" :class="buttonClass">
    <input type="file" :accept class="absolute hidden" @change="onImport" />

    <AppIcon :name="icon" />

    {{ label }}

    <AppTooltip v-if="!label" message="Import file" hover-class="absolute inset-0" />
  </label>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx';

type Separator = '\n' | ',' | '.' | ';';

const {
  join = ',',
  split = ',',
  multiple = false,
  icon = 'file-paste',
  buttonClass = 'rounded-none',
  accept = '.csv,.xlsx',
  regex = /^[a-zA-Z0-9\n,.;]+$/
} = defineProps<{
  label?: string;
  join?: Separator;
  split?: Separator;
  multiple?: boolean;
  icon?: string;
  buttonClass?: string;
  accept?: string;
  regex?: RegExp;
}>();

const model = defineModel<string | number | (string | number)[] | (string | number)[][]>();

const { setToast } = useToast();

const parseRows = (rows: string[][]) => {
  if (rows.length < 2) return setToast({ title: 'Import Error!', text: 'File has no data rows', type: 'error' });

  const dataRows = rows.slice(1);

  if (multiple) {
    const columnCount = Math.max(...dataRows.map((cells) => cells.length));
    model.value = Array.from({ length: columnCount }, (_, colIndex) => dataRows.map((cells) => cells[colIndex] ?? ''));
    return;
  }

  model.value = dataRows.map((cells) => cells[0] ?? '').join(join);
};

const parseXlsx = (buffer: ArrayBuffer) => {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) return setToast({ title: 'Import Error!', text: 'No sheets found in file', type: 'error' });

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return setToast({ title: 'Import Error!', text: 'Could not read sheet', type: 'error' });

  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' });

  parseRows(rows);
};

const parseCsv = (text: string) => {
  const csv = text.replace(/\r/g, '').replace(regex, '');

  const rows = csv
    .split('\n')
    .filter((row) => row.trim() !== '')
    .map((row) => row.split(split));

  parseRows(rows);
};

const onImport = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  const isXlsx = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
  const fileReader = new FileReader();

  fileReader.onload = (e) => {
    try {
      if (isXlsx) {
        parseXlsx(e.target?.result as ArrayBuffer);
      } else {
        parseCsv(String(e.target?.result));
      }
    } catch (error) {
      setToast({ title: 'Import Error!', text: `Failed to parse file: ${error}`, type: 'error' });
    }
  };

  if (isXlsx) {
    fileReader.readAsArrayBuffer(file);
  } else {
    fileReader.readAsText(file);
  }

  target.value = '';
};
</script>
