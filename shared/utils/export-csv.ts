const escapeCsvValue = (value: unknown): string => {
  if (value == null) return '';

  let str = String(value);

  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }

  return str;
};

export const formatCsv = (headers: string[], rows: Record<string, unknown>[]) => {
  const content = [
    headers.join(','),
    ...rows.map((row) => {
      const values = Object.values(row);
      return headers.map((_, index) => escapeCsvValue(values[index])).join(',');
    })
  ].join('\n');

  return new Blob([content], { type: 'text/csv;charset=utf-8;' });
};

export const useDownload = (content: Blob, filename: string) => {
  const url = window.URL.createObjectURL(content);
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const useExportCSV = <T extends Record<string, unknown>>(data: T[], filename: string) => {
  if (!data.length) return;

  const keys = Object.keys(data[0]!) as (keyof T)[];

  const rows = data.map((row) => {
    const formatted: Record<string, unknown> = {};

    keys.forEach((key) => (formatted[key as string] = row[key]));

    return formatted;
  });

  useDownload(formatCsv(keys.map(String), rows), filename);
};
