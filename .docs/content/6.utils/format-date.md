---
title: Format Date
description: TBA
---

## Usage

```ts
const date = '2026-03-09';
const timestamp = 1773660689273;

formatDate(date); // Mar 09, 2026

formatISO(timestamp); // 2026-03-09

setDate(timestamp, -1); // 2026-03-08T00:00:00

setDateRange(date, '2026-03-11'); // ['2026-03-09', '2026-03-10', '2026-03-11']
```

## API

### `formatDate` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="date" type="Date | string | number | null | undefined" required}
  Returns `N/A` if undefined
  ::
  ::field{name="format" type="short | long | iso"}
  Default: `short`
  ::
  ::field{name="time" type="boolean"}
  Default: `false`
  ::
  ::field{name="year" type="boolean"}
  Default: `true`
  ::
  ::field{name="options" type="Intl.DateTimeFormatOptions"}
  ::
  ::field{name="locale" type="Intl.LocalesArgument"}
  Default: `en-US`
  ::
  ::field{name="hourCycle" type="Intl.DateTimeFormatOptions['hourCycle']"}
  Default: `h23`
  ::
::

### `formatISO` arguments

Returns the provided date in ISO format `YYYY-MM-DD`.

<!-- prettier-ignore -->
::field-group
  ::field{name="date" type="Date | string | number | null | undefined" required}
  Returns `N/A` if undefined
  ::
::

### `setDate` arguments

Returns the date with the specified offset applied.

<!-- prettier-ignore -->
::field-group
  ::field{name="date" type="Date | string | number | null | undefined" required}
  If not provided, today is used as the default value.
  ::
  ::field{name="offset" type="number"}
  Default: `0`
::

### `setDateRange` arguments

Returns an array of dates from the specified startDate to the endDate.

<!-- prettier-ignore -->
::field-group
  ::field{name="startDate" type="Date | string | number | null | undefined" required}
  Returns empty array if undefined
  ::  
  ::field{name="endDate" type="Date | string | number | null | undefined" required}
  Returns empty array if undefined
  ::
::
