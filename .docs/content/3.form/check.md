---
title: Checkbox
description: Checkbox input element
---

## Usage `FormCheck`

```vue [index.vue]
<template>
  <FormCheck v-model="status" name="status" label="Active" />
</template>

<script setup lang="ts">
const status = ref(false);
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="label" type="string" }
  ::
  ::field{name="type" type="checkbox | radio" }
  Default `checkbox`
  ::
  ::field{name="name" type="string" }
  Required if the field should show a validation message
  ::
  ::field{name="value" type="T" }
  ::
  ::field{name="is-switch" type="boolen" }
  Displays the checkbox as a switch. Default: `false`
  ::
  ::field{name="indeterminate" type="boolean" }
  ::
  ::field{name="disabled" type="boolean" }
  ::
  ::field{name="help" type="string" }
  Displays the help message. Default: `undefined`
  ::
  ::field{name="true-value" type="boolean | string | number | null" }
  ::
  ::field{name="false-value" type="boolean | string | number | null" }
  ::
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="label-left"}
  ::
  ::field{name="label-right"}
  ::
  ::field{name="help"}
  ::
::

## Examples

TBA
