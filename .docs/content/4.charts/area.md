---
title: Area
description: TBA
---

## Usage `AppChartArea`

```vue [index.vue]
<template>
  <AppChartArea :data :categories x-key="company" />
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
  ::field{name="xKey" type="keyof T" required}
  ::
  ::field{name="xFormat" type="(i: string | number) => string"}
  ::
  ::field{name="yFormat" type="(i: string | number) => string"}
  :: 
  ::field{name="numTicks" type="number"}
  ::
  ::field{name="tooltipClass" type="string"}
  ::
::

## Examples

TBA
