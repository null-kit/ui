---
title: Timepicker
description: Input for selecting a time
---

## Usage `FormTimepicker`

```vue [index.vue]
<template>
  <FormTimepicker v-model="time" />
</template>

<script setup lang="ts">
const time = ref('12:00:00');
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="name" type="string" }
  ::
  ::field{name="range" type="boolean" }
  ::
  ::field{name="step" type="number" }
  ::
  ::field{name="icon" type="string" }
  Default `clock`
  ::
  ::field{name="no-icon" type="boolean" }
  ::
::

## Examples

TBA
