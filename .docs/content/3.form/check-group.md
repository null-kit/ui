---
title: Checkbox Group
description: Button-like checkbox input group element
---

## Usage `FormCheckGroup`

```vue [index.vue]
<template>
  <FormCheckGroup v-model.lowercase="color" :options />
</template>

<script setup lang="ts">
const options = ['Red', 'Blue', 'Green'];

const color = ref();
</script>
```

## API

### Model

::field{name="lowercase" type="modifier" }
Converts the selected option to lowercase.
::

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
  ::field{name="type" type="checkbox | radio" }
  Default `radio`
  ::
  ::field{name="value" type="T | T[] | number" }
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
  ::field{name="disabled" type="boolean" }
  ::
  ::field{name="readonly" type="boolean" }
  ::
  ::field{name="help" type="string" }
  Displays the help message. Default: `undefined`
  ::
  ::field{name="no-toggle" type="boolean" }
  Prevents deselecting all values. Default is `false`.
  ::
  ::field{name="group-class" type="string" }
  ::
  ::field{name="btn-class" type="string" }
  ::
  ::field{name="validate-class" type="string" }
  ::
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
  ::field{name="help"}
  ::
::

## Examples

TBA
