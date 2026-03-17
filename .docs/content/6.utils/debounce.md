---
title: Debounce
description: TBA
---

## Usage

```ts
const onSearch = () => console.info('Search Executed');

const onDebouncedSearch = debounce(onSearch, 500);

onDebouncedSearch()
```

## API

### `debounce` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="fn" type="function" required}
  Function to be debounced
  ::
  ::field{name="ms" type="number"}
  Time in milliseconds. Default: `300`
  ::
::
