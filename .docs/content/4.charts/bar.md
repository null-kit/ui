---
title: Bar
description: Bar chart visualization component
---

## Usage `AppChartBar`

::note{to="https://unovis.dev"}
Component is built using `@unovis/vue` under the hood.
::

```vue [index.vue]
<template>
  <AppChartBar :data :categories x-key="company" />
</template>

<script setup lang="ts">
const categories = ['profit', 'spend'];

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
  ::field{name="categories" type="keyof T[]" required}
  ::
  ::field{name="x-key" type="keyof T" required}
  ::  
  ::field{name="x-trim" type="boolean"}
  Whether to trim text when no space is available
  ::
  ::field{name="x-hide" type="boolean"}
  Whether to hide X axis ticks. Default: `false`
  ::
  ::field{name="y-hide" type="boolean"}
  Whether to hide Y axis ticks. Default: `false`
  ::
  ::field{name="x-format" type="(i: string | number) => string"}
  ::
  ::field{name="y-format" type="(i: string | number) => string"}
  :: 
  ::field{name="stacked" type="boolean"}
  :: 
  ::field{name="rounded-corners" type="number"}
  ::
  ::field{name="show-legend" type="boolean"}
  ::
  ::field{name="tooltip-class" type="string"}
  ::  
  ::field{name="bar-style" type="gradient | solid"}
  Default: `gradient`
  ::
  ::field{name="bar-padding" type="number"}
  Default: `0.1`
  ::
  ::field{name="height" type="string"}
  Default: `25rem`
  ::
  ::field{name="num-ticks" type="number"}
  Default: `25rem`
  ::
::

## Examples

TBA
