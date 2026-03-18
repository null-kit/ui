---
title: Local Storage
description: Utilities for reading and writing values in browser localStorage
---

## Usage `useLocalStorage`

```ts
const key = 'settings';

const { setItem, getItem, removeItem } = useLocalStorage();

setItem(key, { themeColor: 'violet' });

getItem(key); // { themeColor: 'violet' }

removeItem(key);
```

## API

### `setItem` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="key" type="string" required}
  ::
  ::field{name="data" type="string" required}
::

### `getItem` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="key" type="string" required}
::

### `removeItem` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="key" type="string" required}
::
