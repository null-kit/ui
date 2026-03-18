---
title: Format Number
description: Utilities for formatting numbers, including general formatting and currency display
---

## Usage

```ts
const number = 2315628;
const currency = 6240;

formatNumber(number); // 2,315,628

formatCurrency(currency); // $6,240
```

## API

### `formatNumber` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="value" type="number | string | null | undefined" required}
  Returns `N/A` if undefined
  ::
  ::field{name="options" type="Intl.NumberFormatOptions"}
  ::
  ::field{name="locale" type="Intl.LocalesArgument"}
  Default: `en-US`
  ::
::

### `formatCurrency` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="value" type="number | string | null | undefined" required}
  Returns `N/A` if undefined
  ::
  ::field{name="options" type="Intl.NumberFormatOptions"}
  Default: `currency: 'USD'`
  ::
  ::field{name="locale" type="Intl.LocalesArgument"}
  Default: `en-US`
  ::
::
