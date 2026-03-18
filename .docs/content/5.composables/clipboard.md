---
title: Clipboard
description: Copy text to the clipboard with reactive status and feedback
---

## Usage `useClipboard`

```vue [index.vue]
<template>
  <button type="button" class="btn" @click="copy('This is copied text!')">
    {{ statusText }}
  </button>
</template>

<script setup lang="ts">
const { copy, statusText } = useClipboard();
</script>
```

## API

### `copy`

<!-- prettier-ignore -->
::field-group
  ::field{name="text" type="string" required}
  ::
  ::field{name="id" type="string | number"}
  Required for `copyId` to match the exact line that was copied
  ::
::

### `copyId`

::field{type="Ref<number | string | null>"}

### `status`

::field{type="Ref<boolean>"}

### `statusText`

::field{type="Ref<Copy | Copied! | Error>"}
