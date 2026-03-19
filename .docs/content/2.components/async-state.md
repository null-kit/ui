---
title: Async State
description: Displaying different UI states during asynchronous operations
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
  ::field{name="has-data" type="boolean" required}
  ::
  ::field{name="status" type="success | error | idle | pending" required}
  ::
  ::field{name="pending-title" type="string"}
  Default `Please Wait`
  ::
  ::field{name="pending-text" type="string"}
  ::
  ::field{name="empty-title" type="string"}
  Default `No Data Found`
  ::
  ::field{name="empty-text" type="string"}
  ::
  ::field{name="error-title" type="string"}
  Default `Something Went Wrong`
  ::
  ::field{name="error-text" type="string"}
  ::
  ::field{name="idle-title" type="string"}
  ::
  ::field{name="idle-text" type="string"}
  ::
  ::field{name="soft-loading" type="boolean"}
  Default: `false`<br>
  The component preserves its state inside the default slot.
  ::
::

## Examples

TBA
