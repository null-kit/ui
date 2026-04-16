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

<!-- prettier-ignore -->
::field-group
  ::field{name="iso" type="modifier" }
  Converts the selected date to ISO format.
  ::
  ::field{name="safe" type="modifier" }
  Moves the date back one day if it is the same day and the UTC day has not started yet.
  ::
::

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="range" type="boolean" }
  ::
  ::field{name="range-year" type="boolean" }
  Displays `This Year` preset. Default `false`.
  ::
  ::field{name="preset" type="today | yesterday | last-week | this-month | last-month | this-year" }
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
