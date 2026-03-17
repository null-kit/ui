---
title: Tree Select
description: Nested tree-structure select component for choosing from a list of options
---

## Usage `FormTreeSelect`

<!-- prettier-ignore -->
```vue [index.vue]
<template>
  <FormTreeSelect 
    v-model="category" 
    :options 
    label="Category" 
    name="category" 
    search 
  />
</template>

<script setup lang="ts">
const options = [
  {
    value: 'GRP1',
    name: 'Fruits & Vegetables',
    children: [
      { value: 'GRP1-1', name: 'Mangoes' },
      { value: 'GRP1-2', name: 'Broccoli' }
    ]
  },
  {
    value: 'GRP2',
    name: 'Beverages',
    children: [
      { value: 'GRP2-1', name: 'Coffee' },
      { value: 'GRP2-2', name: 'Lemonade' }
    ]
  }
];

const category = ref();
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="options" type="{ value: string; name: string; children?: TreeOption[]; isOpen?: boolean; }" required}
  ::
  ::field{name="label" type="string" }
  ::
  ::field{name="name" type="string" }
  Required if the field should show a validation message
  ::
  ::field{name="search" type="boolean" }
  Enables the search field. Default `false`
  ::
  ::field{name="required" type="boolean" }
  Displays a visual indicator if the field is required. Default `false`
  ::
::
