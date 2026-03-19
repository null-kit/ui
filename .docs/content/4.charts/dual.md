---
title: Dual
description: Dual chart visualization component
---

## Usage `AppChartDual`

::note{to="https://unovis.dev"}
Component is built using `@unovis/vue` under the hood.
::

```vue [index.vue]
<template>
  <AppChartDual :data left-key="profit" right-key="spend" x-key="date" />
</template>

<script setup lang="ts">
const categories = ['profit', 'spend'];

const data = [
  { id: 1, date: '2026-03-09', company: 'Acme', profit: 100, spend: 80 },
  { id: 2, date: '2026-03-10', company: 'Umbrella', profit: 170, spend: 150 },
  { id: 3, date: '2026-03-11', company: 'Stark', profit: 230, spend: 200 },
  { id: 4, date: '2026-03-12', company: 'Wonka', profit: 195, spend: 140 }
];
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="data" type="T[]" required}
  ::
  ::field{name="left-key" type="keyof T" required}
  ::
  ::field{name="right-key" type="keyof T" required}
  ::
  ::field{name="x-key" type="keyof T" required}
  ::  
  ::field{name="x-format" type="(i: string | number) => string"}
  ::
  ::field{name="y-format-left" type="(i: string | number) => string"}
  :: 
  ::field{name="y-format-right" type="(i: string | number) => string"}
  :: 
  ::field{name="num-ticks" type="number"}
  ::
  ::field{name="tooltip-class" type="string"}
  ::
::

## Examples

TBA
