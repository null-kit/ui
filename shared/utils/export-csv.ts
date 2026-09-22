import * as XLSX from 'xlsx';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

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

export const formatXls = (headers: string[], rows: Record<string, unknown>[], sheetName: string = 'Sheet1') => {
  const sheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  const book = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(book, sheet, sheetName);

  const bytes = XLSX.write(book, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;

  return new Blob([bytes], { type: XLSX_MIME });
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
  if (blob.type === XLSX_MIME && !filename.toLowerCase().endsWith('.xlsx')) ext = '.xlsx';

  link.href = url;
  link.setAttribute('download', filename + ext);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const toExportRows = <T>(data: T[]) => {
  const keys = Object.keys(data[0]!) as (keyof T)[];

  const rows = data.map((row) => {
    const formatted: Record<string, unknown> = {};

    keys.forEach((key) => (formatted[key as string] = row[key]));

    return formatted;
  });

  return { headers: keys.map(String), rows };
};

export const useExportCsv = <T>(data: T[], filename: string) => {
  if (!data.length) return;

  const { headers, rows } = toExportRows(data);

  useDownload(formatCsv(headers, rows), filename);
};

export const useExportXls = <T>(data: T[], filename: string, sheetName?: string) => {
  if (!data.length) return;

  const { headers, rows } = toExportRows(data);

  useDownload(formatXls(headers, rows, sheetName), filename);
};

/**
 * Temporary alias for backwards compatibility
 *
 * @deprecated Use `useExportCsv` instead
 */
export const useExportCSV = useExportCsv;
