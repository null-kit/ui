---
title: Helpers
description: TBA
---

## Usage

```ts
const values = [23, 57, 120, 49];

calcTotal(values); // 249

calcAvg(values); // 62.25

calcDiffPercentage(8352.7, 3824.5); // -54.21

toFixedNumber(23.59999); // 23.6

toSeparatedArray('apple, banana, cherry', ','); // ['apple', 'banana', 'cherry']
toSeparatedString(['apple', 'banana', 'cherry'], ','); // 'apple,banana,cherry'

generateRandomString(); // zLLBODFGlNisU4KgtZ89
```

## API

### `calcTotal` and `calcAvg` arguments

<!-- prettier-ignore -->
::field-group 
  ::field{name="data" type="T[]" required}
  ::
  ::field{name="key" type="string"}
  If the data contains objects, the provided key will be used to extract their values.
  ::
::

### `calcDiffPercentage` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="firstValue" type="number" required}
  ::
  ::field{name="secondValue" type="number" required}
::

### `toFixedNumber` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="value" type="number" required}
  ::
  ::field{name="precision" type="number"}
  Default: `2`
  ::
::

### `toSeparatedArray` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="value" type="string" required}
  ::
  ::field{name="separator" type="string"}
  ::
  ::field{name="unique" type="boolean"}
  Whether to return a unique array. Default: `false`
  ::
::

### `generateRandomString` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="length" type="number"}
  Default: `20`
  ::
::
