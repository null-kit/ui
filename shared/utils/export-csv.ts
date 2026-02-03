export const escapeCsvValue = (value: unknown): string => {
  if (value == null) return '';

  let str = String(value);

  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }

  return str;
};

export const formatCsv = (headers: string[], rows: Record<string, unknown>[] | (string | number | Date)[][]) => {
  const content = [
    headers.join(','),
    ...rows.map((row) => headers.map((_, index) => escapeCsvValue(Object.values(row)[index])).join(','))
  ].join('\n');

  return new Blob([content], { type: 'text/csv;charset=utf-8;' });
};

export const useDownload = (content: Blob | unknown, filename: string) => {
  let blob: Blob;

  if (content instanceof Blob) {
    blob = content;
  } else {
    const bytes = new TextEncoder().encode(JSON.stringify(content, null, 2));

    blob = new Blob([bytes], { type: 'application/json;charset=utf-8' });
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  let ext = '';

  if (blob.type === 'text/csv' && !filename.toLowerCase().endsWith('.csv')) ext = '.csv';

  link.href = url;
  link.setAttribute('download', filename + ext);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const useExportCSV = <T>(data: T[], filename: string) => {
  if (!data.length) return;

  const keys = Object.keys(data[0]!) as (keyof T)[];

  const rows = data.map((row) => {
    const formatted: Record<string, unknown> = {};

    keys.forEach((key) => (formatted[key as string] = row[key]));

    return formatted;
  });

  useDownload(formatCsv(keys.map(String), rows), filename);
};
