---
title: Range
description: Input element to select a numeric value within a range
---

## Usage `FormRange`

```vue [index.vue]
<template>
  <FormRange v-model="volume" label="Volume" :min="0" :max="100" />
</template>

<script setup lang="ts">
const volume = ref(50);
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="label" type="string" }
  ::
  ::field{name="name" type="string" }
  Required if the field should show a validation message
  ::
  ::field{name="required" type="boolean" }
  Displays a visual indicator if the field is required. Default `false`
  ::
  ::field{name="min" type="number" }
  ::
  ::field{name="max" type="number" }
  ::
  ::field{name="step" type="number" }
  ::
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="label-left"}
  ::
  ::field{name="label-right"}
  ::
::

## Examples

TBA
