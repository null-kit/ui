---
title: Alert
description: TBA
---

## Usage `AppAlert`

::tabs
:::tabs-item{icon="i-lucide-code" label="Code"}

```vue [index.vue]
<template>
  <AppAlert type="warning" label="Please pay attention" />
</template>
```

:::

:::tabs-item{icon="i-lucide-eye" label="Preview"}
:::app-alert{type="warning" label="Please pay attention"}
:::
:::
::

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="type" type="default | success | warning | danger | info | accent" }
  ::
  ::field{name="size" type="default"}
  Only `default` at the moment
  ::
  ::field{name="label" type="string | number"}
  ::
  ::field{name="message" type="string | number"}
  ::
  ::field{name="icon" type="string"}
  ::
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="label"}
  ::
  ::field{name="message"}
  ::
  ::field{name="icon"}
  ::
::

## Examples

TBA
