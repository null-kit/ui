---
title: Clipboard
description: Component for copying data between sibling groups
---

## Usage `AppClipboard`

```vue [index.vue]
<template>
  <AppClipboard name="users">
    <FormSelect v-model="formData.allowedUsers" :options="users" multiple />
  </AppClipboard>

  <AppClipboard name="users">
    <FormSelect v-model="formData.blockedUsers" :options="users" multiple />
  </AppClipboard>
</template>

<script setup lang="ts">
const users = ref(['John Wick', 'Alice Wick']);

const formData = reactive({
  allowedUsers: [],
  blockedUsers: []
});
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="name" type="string"}
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="default"}
::

## Examples

TBA
