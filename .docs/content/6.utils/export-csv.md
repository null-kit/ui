---
title: Export CSV
description: Utilities for converting data to CSV and triggering file downloads
---

## Usage

```ts
const data = [
  { id: 1, name: 'Alice', note: 'She said "hi"' },
  { id: 2, name: 'John', note: 'He said "hello"' }
];

// Build a CSV and download automatically
useExportCsv(data, 'users.csv');

// Build a CSV Blob manually
const headers = ['id', 'name'];
const rows = data.map((row) => ({ id: row.id, name: row.name }));

const blob = formatCsv(headers, rows);

useDownload(blob, 'users.csv');
```

## API

### `useExportCsv` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="data" type="T[]" required}
  Exported rows. Headers are inferred from first row
  ::
  ::field{name="filename" type="string" required}
  ::
::

### `formatCsv` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="headers" type="string[]" required}
  First CSV line. Also used as the column order when building rows.
  ::
  ::field{name="rows" type="Record<string, unknown>[] | (string | number | Date)[]" required}
  ::
::

### `useDownload` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="content" type="Blob | unknown" required}
  ::
  ::field{name="filename" type="string" required}
  Download name. Include extension (e.g. `data.json`, `table.csv`)
  ::
::

### `escapeCsvValue` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="value" type="unknown" required}
  Converts to string and escapes for CSV
  ::
::
