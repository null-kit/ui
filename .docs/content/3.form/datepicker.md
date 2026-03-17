---
title: Datepicker
description: Input for selecting a date
---

## Usage `FormDatepicker`

```vue [index.vue]
<template>
  <FormDatepicker v-model.iso="date" preset="today" max-today />
</template>

<script setup lang="ts">
const date = ref('');
</script>
```

## API

### Model

::field{name="iso" type="modifier" }
Converts the selected date to ISO format.
::

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="range" type="boolean" }
  ::
  ::field{name="preset" type="today | yesterday | last-week | this-month | this-month-today | last-month" }
  ::
  ::field{name="max-today" type="boolean" }
  Prevents selecting dates greater than today. Default `false`.
  ::
  ::field{name="icon" type="string" }
  Default `calendar`
  ::
  ::field{name="no-icon" type="boolean" }
  ::
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="presets"}
  Exposes `setPreset` for manually handling the presets
  ::
  ::field{name="prev-icon"}
  ::
  ::field{name="next-icon"}
  ::
::

## Examples

TBA
