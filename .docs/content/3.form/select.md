---
title: Select
description: Select component to choose from a list of options
---

## Usage `FormSelect`

<!-- prettier-ignore -->
```vue [index.vue]
<template>
  <FormSelect 
    v-model="color" 
    :options
    label="Color"
    placeholder="Select" 
    key-name="name" 
    key-value="hex" 
  />
</template>

<script setup lang="ts">
const options = [
  { id: 1, name: 'Red', slug: 'red', hex: '#f00' },
  { id: 1, name: 'Blue', slug: 'blue', hex: '#00f' }
];

const color = ref();
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="options" type="T[]" required}
  ::
  ::field{name="label" type="string" }
  ::
  ::field{name="name" type="string" }
  Required if the field should show a validation message
  ::
  ::field{name="placeholder" type="string" }
  ::
  ::field{name="key-name" type="keyof T" }
  Displays the value from the passed object
  ::
  ::field{name="key-value" type="keyof T" }
  Returns the value from the passed object
  ::
  ::field{name="required" type="boolean" }
  Displays a visual indicator if the field is required. Default `false`
  ::
  ::field{name="value" type="T | T[] | keyof T | T[keyof T]" }
  ::
  ::field{name="multiple" type="boolean" }
  Enables multiple selection. Default `false`
  ::
  ::field{name="search" type="boolean" }
  Enables the search field. Default `false`
  ::
  ::field{name="order" type="boolean" }
  Moves the selected items to the top. Default `false`
  ::
  ::field{name="placement" type="top | right | bottom | left | (top | bottom | right | left)-(start | end)" }
  Default `bottom-start`
  ::
  ::field{name="autoclose" type="boolean" }
  ::
  ::field{name="help" type="string" }
  Displays the help message. Default: `undefined`
  ::
  ::field{name="presets" type="Array<{ name: string; list: (string | number)[] }>" }
  ::
  ::field{name="input-class" type="string" }
  ::
  ::field{name="dropdown-class" type="string" }
  ::
  ::field{name="validate-class" type="string" }
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="label-left"}
  ::
  ::field{name="label-right"}
  ::
  ::field{name="left"}
  ::
  ::field{name="right"}
  ::
  ::field{name="option"}
  Exposes `value` to manually transform each option
  ::
  ::field{name="help"}
  ::
::

## Examples

TBA
