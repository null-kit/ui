---
title: Import CSV
description: Input element to upload a CSV file and parse its data
---

## Usage `FormImport`

```vue [index.vue]
<template>
  <FormImport v-model="users" />
</template>

<script setup lang="ts">
const users = ref('');
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="label" type="string" }
  ::
  ::field{name="join" type="\n | , | . | ;" }
  Default `,`
  ::
  ::field{name="split" type="\n | , | . | ;" }
  Default `,`
  ::
  ::field{name="multiple" type="boolean" }
  ::
  ::field{name="icon" type="string" }
  ::
  ::field{name="button-class" type="string" }
  ::
::

## Examples

TBA
