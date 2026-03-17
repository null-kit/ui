---
title: Badge
description: Badge component for displaying statuses, types, or labels.
---

## Usage `AppBadge`

```vue [index.vue]
<template>
  <AppBadge type="success" label="Active" />
</template>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="type" type="default | success | warning | danger | info | accent" }
  ::
  ::field{name="size" type="default | sm | lg"}
  ::
  ::field{name="label" type="string | number"}
  ::
  ::field{name="icon" type="string"}
  ::
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="label"}
  ::
  ::field{name="icon"}
  ::
::

## Examples

TBA
