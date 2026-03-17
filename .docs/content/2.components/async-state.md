---
title: Async State
description: TBA
---

## Usage `AppAsyncState`

```vue [index.vue]
<template>
  <AppAsyncState :has-data="records && records.length > 0" :status>
    <AppTable v-if="records" :data="records" :columns />
  </AppAsyncState>
</template>

<script setup lang="ts">
const records = ref([]);
const status = ref('pending');
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="hasData" type="boolean" required}
  ::
  ::field{name="status" type="success | error | idle | pending" required}
  ::
  ::field{name="pendingTitle" type="string"}
  Default `Please Wait`
  ::
  ::field{name="pendingText" type="string"}
  ::
  ::field{name="emptyTitle" type="string"}
  Default `No Data Found`
  ::
  ::field{name="emptyText" type="string"}
  ::
  ::field{name="errorTitle" type="string"}
  Default `Something Went Wrong`
  ::
  ::field{name="errorText" type="string"}
  ::
  ::field{name="idleTitle" type="string"}
  ::
  ::field{name="idleText" type="string"}
  ::
  ::field{name="softLoading" type="boolean"}
  Default: `false`<br>
  The component preserves its state inside the default slot.
  ::
::

## Examples

TBA
