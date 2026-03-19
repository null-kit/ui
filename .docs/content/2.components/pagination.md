---
title: Pagination
description: Component for navigating through paginated content
---

## Usage `AppPagination`

```vue [index.vue]
<template>
  <AppPagination :total-pages="100" />
</template>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="total-pages" type="number" required}
  ::
  ::field{name="per-page" type="number"}
  Default `25`
  ::
  ::field{name="scroll-to" type="string"}
  Selector (e.g. #records)
  ::
::

## Examples

TBA
