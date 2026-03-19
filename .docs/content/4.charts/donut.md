---
title: Donut
description: Donut chart visualization component
---

## Usage `AppChartDonut`

::note{to="https://unovis.dev"}
Component is built using `@unovis/vue` under the hood.
::

```vue [index.vue]
<template>
  <AppChartDonut :data category-key="company" value-key="spend" />
</template>

<script setup lang="ts">
const data = [
  { id: 1, company: 'Acme', profit: 100, spend: 80 },
  { id: 2, company: 'Umbrella', profit: 170, spend: 150 },
  { id: 3, company: 'Stark', profit: 230, spend: 200 },
  { id: 4, company: 'Wonka', profit: 195, spend: 140 }
];
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="data" type="T[]" required}
  ::
  ::field{name="category-key" type="keyof T" required}
  ::
  ::field{name="value-key" type="keyof T" required}
  ::
  ::field{name="value-format" type="(i: number) => string"}
  :: 
  ::field{name="pad-angle" type="number"}
  ::
  ::field{name="tooltip-class" type="string"}
  ::
::

## Examples

TBA
